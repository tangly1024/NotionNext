import fs from 'fs'
import path from 'path'
import pLimit from 'p-limit'
import { fetchNotionPageBlocks } from '@/lib/db/notion/getPostBlocks'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'

// 整次构建只预热一次的标记文件
const PREFETCH_LOCK_FILE = path.join(
  process.cwd(), '.next/cache/notion/.prefetch_done'
)

/**
 * 获取优先预生成的页面
 * - 默认排序前5篇（Notion 拖拽顺序）
 * - 最新发布5篇（按 publishDate 倒序）
 * - 合并去重，最多约6~8篇
 */
export function getPriorityPages(allPages) {
  const published = (allPages ?? []).filter(
    p => p.type === 'Post' && p.status === 'Published'
  )

  const top5Default = published.slice(0, 5)

  const top5Latest = [...published]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, 5)

  const seen = new Set()
  return [...top5Default, ...top5Latest].filter(p => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

/**
 * 全量预热 block 数据（内部实现，不带跨进程保护）
 */
async function _prefetchAllBlockMaps(allPages, concurrency = 8) {
  const limit = pLimit(concurrency)
  let hit = 0, fetched = 0, failed = 0

  console.log(`[Prefetch][pid:${process.pid}] 开始预热 ${allPages.length} 个页面 block`)
  const start = Date.now()

  await Promise.all(
    allPages.map(page =>
      limit(async () => {
        const cacheKey = `page_block_${page.id}`

        if (await getDataFromCache(cacheKey)) {
          hit++
          return
        }

        try {
          const block = await fetchNotionPageBlocks(page.id, 'prefetch')
          await setDataToCache(cacheKey, block, 1000 * 60 * 60 * 2)
          fetched++
        } catch (e) {
          console.warn(`[Prefetch][pid:${process.pid}] Failed:`, page.id, e.message)
          failed++
        }
      })
    )
  )

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(
    `[Prefetch][pid:${process.pid}] 完成: 命中=${hit} 新拉取=${fetched} 失败=${failed} 耗时=${elapsed}s`
  )
}

/**
 * 带跨进程保护的全量预热
 * 整次构建只执行一次，其他 Worker 等待完成后直接复用缓存
 *
 * export 模式下三个路由文件都会调用此函数，
 * 但只有第一个抢到标记的 Worker 真正执行预热，其余等待。
 */
export async function prefetchAllBlockMaps(allPages, concurrency = 8) {
  // 标记文件已标记为 done：本次构建已预热完成，直接跳过
  if (_isDone()) {
    console.log(`[Prefetch][pid:${process.pid}] 已预热完成，跳过`)
    return
  }

  // 尝试写标记文件（wx 原子创建，只有一个 Worker 能成功）
  const acquired = _tryAcquire()

  if (!acquired) {
    // 其他 Worker 正在预热，等待其完成
    console.log(`[Prefetch][pid:${process.pid}] 其他 Worker 正在预热，等待...`)
    await _waitUntilDone()
    console.log(`[Prefetch][pid:${process.pid}] 等待结束，缓存已就绪`)
    return
  }

  // 抢到标记，执行真实预热
  try {
    await _prefetchAllBlockMaps(allPages, concurrency)
    // 预热完成，写入 done 标记供其他 Worker / 后续路由文件识别
    fs.writeFileSync(PREFETCH_LOCK_FILE, 'done', 'utf-8')
    console.log(`[Prefetch][pid:${process.pid}] 标记预热完成`)
  } catch (e) {
    // 预热失败，删除标记文件，让其他 Worker 有机会重试
    _releaseLock()
    throw e
  }
}

// ─── 内部工具函数 ────────────────────────────────────────────────

function _isDone() {
  try {
    return fs.existsSync(PREFETCH_LOCK_FILE) &&
      fs.readFileSync(PREFETCH_LOCK_FILE, 'utf-8').trim() === 'done'
  } catch {
    return false
  }
}

function _tryAcquire() {
  try {
    fs.mkdirSync(path.dirname(PREFETCH_LOCK_FILE), { recursive: true })
    // wx flag：文件不存在时创建成功，存在时抛错 → 原子锁
    fs.writeFileSync(PREFETCH_LOCK_FILE, String(process.pid), { flag: 'wx' })
    return true
  } catch {
    return false
  }
}

function _releaseLock() {
  try { fs.unlinkSync(PREFETCH_LOCK_FILE) } catch {}
}

export async function _waitUntilDone(timeout = 300000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    await new Promise(r => setTimeout(r, 500))
    if (_isDone()) return
  }
  console.warn(`[Prefetch][pid:${process.pid}] 等待预热超时，继续执行`)
}