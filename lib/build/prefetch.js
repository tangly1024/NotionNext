// lib/build/prefetch.js
import pLimit from 'p-limit'
import { fetchNotionPageBlocks } from '@/lib/db/notion/getPostBlocks'
import {
  getDataFromCache,
  setDataToCache

} from '@/lib/cache/cache_manager'


// lib/build/prefetch.js 中新增，或单独放 lib/build/buildUtils.js

/**
 * 获取优先预生成的页面
 * - 最新5篇（按发布时间倒序）
 * - 默认排序前5篇（allPages 原始顺序）
 * - 两者合并去重
 */
export function getPriorityPages(allPages) {
  const published = (allPages ?? []).filter(
    p => p.type === 'Post' && p.status === 'Published'
  )

  // 默认排序前5
  const top5Default = published.slice(0, 5)

  // 按发布时间最新5
  const top5Latest = [...published]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, 5)

  // 合并去重
  const seen = new Set()
  return [...top5Default, ...top5Latest].filter(p => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

/**
 * 预热所有页面的 block 数据
 * @param {*} allPages 页面列表
 * @param {*} concurrency 并发数
 */
export async function prefetchAllBlockMaps(allPages, concurrency = 8) {
  const limit = pLimit(concurrency)
  let hit = 0, fetched = 0, failed = 0

  console.log(`[Prefetch] 开始预热 ${allPages.length} 个页面 block`)
  const start = Date.now()

  await Promise.all(
    allPages.map(page =>
      limit(async () => {
        const cacheKey = `page_block_${page.id}`
        
        // 已有缓存跳过
        if (await getDataFromCache(cacheKey)) {
          hit++
          return
        }

        try {
          const block = await fetchNotionPageBlocks(page.id, 'prefetch')
          await setDataToCache(cacheKey, block, 1000 * 60 * 60 * 2) // 2小时
          fetched++
        } catch (e) {
          console.warn('[Prefetch Failed]', page.id, e.message)
          failed++
        }
      })
    )
  )

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`[Prefetch] 完成: 命中缓存=${hit} 新拉取=${fetched} 失败=${failed} 耗时=${elapsed}s`)
}