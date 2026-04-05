import {
  getDataFromCache,
  getOrSetDataWithCache,
  setDataToCache,

} from '@/lib/cache/cache_manager'
import { deepClone, delay } from '../../utils'
import notionAPI from '@/lib/db/notion/getNotionAPI'
import pLimit from 'p-limit'

// ⚠️ 全局限流器（非常关键）
// 建议 2~4，不要超过 5
const limit = pLimit(3)

// ⚠️ 每个请求之间的间隔（防 burst）
const REQUEST_INTERVAL = 200 // ms

/**
 * 获取文章内容块
 * @param {string} id
 * @param {*} from
 * @param {*} slice
 */
export async function fetchNotionPageBlocks(id, from = null, slice = 0) {
  const cacheKey = `page_block_${id}`

  // 1️⃣ 统一由缓存工具负责「读 / 写 / 兜底获取」
  const pageBlock = await getOrSetDataWithCache(
    cacheKey,
    async () => {
      // 抓取最新数据
      return await getPageWithRetry(id, from)
    }
  )

  // 2️⃣ 防御式返回
  if (!pageBlock) {
    console.warn('[getPage] empty pageBlock:', id)
    return null
  }

  // 3️⃣ 转换为 post
  return pageBlock
}


/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
export async function getPageWithRetry(id, from, retryAttempts = 3) {
  if (retryAttempts && retryAttempts > 0) {
    console.log(
      '[API-->>请求]',
      `from:${from}`,
      `id:${id}`,
      retryAttempts < 3 ? `剩余重试次数:${retryAttempts}` : ''
    )
    try {
      const start = Date.now()
      const pageData = await notionAPI.getPage(id)
      const end = Date.now()
      console.log('[API<<--响应]', `耗时:${end - start}ms - from:${from}`)
      return pageData
    } catch (e) {
      console.warn('[API<<--异常]:', e)
      await delay(1000)
      const cacheKey = 'page_block_' + id
      const pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        // console.log('[重试缓存]', `from:${from}`, `id:${id}`)
        return pageBlock
      }
      return await getPageWithRetry(id, from, retryAttempts - 1)
    }
  } else {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`)
    return null
  }
}

/**
 * Notion页面BLOCK格式化处理
 * 1.删除冗余字段
 * 2.比如文件、视频、音频、url格式化
 * 3.代码块等元素兼容
 * @param {*} id 页面ID
 * @param {*} blockMap 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
export function formatNotionBlock(block) {
  const clonedBlock = deepClone(block)
  const blocksToProcess = Object.keys(clonedBlock || {})

  for (let i = 0; i < blocksToProcess.length;) {
    const blockId = blocksToProcess[i]
    let b = clonedBlock[blockId]

    // ✅ 【新增】统一结构：兼容新版双层嵌套格式
    // 新格式: { spaceId, value: { value: { id, type }, role } }
    // 次格式: { value: { id, type }, role }
    // 旧格式: { value: { id, type } }
    if (b?.value?.value?.id) {
      // 新格式，剥掉外层，只保留真实 block value
      clonedBlock[blockId] = { value: b.value.value }
      b = clonedBlock[blockId]
    } else if (!b?.value?.id && b?.value?.role !== undefined) {
      // role:none 等无权限 block，直接跳过
      i++
      continue
    }

    // ✅ 【新增】清理 crdt 字段，react-notion-x 不认识会报 Unsupported block type
    if (b?.value) {
      delete b.value.crdt_data
      delete b.value.crdt_format_version
    }

    // 原有逻辑不变 ↓↓↓

    sanitizeBlockUrls(b?.value)

    if (b?.value?.type === 'sync_block' && b?.value?.children) {
      const childBlocks = b.value.children
      const childBlockIds = []
      delete clonedBlock[blockId]
      childBlocks.forEach((childBlock, index) => {
        const newBlockId = `${blockId}_child_${index}`
        clonedBlock[newBlockId] = childBlock
        childBlockIds.push(newBlockId)
      })
      blocksToProcess.splice(i, 1, ...childBlockIds)
      continue
    }

    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'Assembly') {
        b.value.properties.language[0][0] = 'asm6502'
      }
    }

    if (
      ['file', 'pdf', 'video', 'audio'].includes(b?.value?.type) &&
      b?.value?.properties?.source?.[0][0] &&
      (b?.value?.properties?.source?.[0][0]?.startsWith('attachment') ||
        b?.value?.properties?.source?.[0][0].indexOf('amazonaws.com') > 0)
    ) {
      const oldUrl = b?.value?.properties?.source?.[0][0]
      const newUrl = `https://notion.so/signed/${encodeURIComponent(oldUrl)}?table=block&id=${b?.value?.id}`
      b.value.properties.source[0][0] = newUrl
    }

    i++
  }

  return clonedBlock
}

/**
 * 根据[]ids，批量抓取blocks
 * 在获取数据库文章列表时，超过一定数量的block会被丢弃，因此根据pageId批量抓取block
 * @param {*} ids
 * @param {*} batchSize
 * @returns
 */
export const fetchInBatches = async (ids, batchSize = 10) => {
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  let fetchedBlocks = {}

  let cacheHit = 0
  let cacheMiss = 0

  console.log('[Batch] START total ids:', ids.length)

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)

    console.log(`\n[Batch] processing ${i} ~ ${i + batch.length}`)

    const results = await Promise.all(
      batch.map((id, index) =>
        limit(async () => {
          const cacheKey = `page_block_${id}`

          try {
            // ✅ 1. 先查缓存
            const cached = await getDataFromCache(cacheKey)

            if (cached) {
              cacheHit++
              console.log('[Cache HIT]', id)
              return cached
            }

            cacheMiss++
            console.log('[Cache MISS]', id)

            // 👉 节流
            await delay(index * REQUEST_INTERVAL)

            console.log('[API-->>请求]', id)

            const start = Date.now()
            const pageChunk = await notionAPI.getBlocks([id])
            const end = Date.now()

            console.log(
              `[API<<--响应] ${id} 耗时:${end - start}ms blockCount:${
                Object.keys(pageChunk?.recordMap?.block || {}).length
              }`
            )

            const blocks = pageChunk?.recordMap?.block || {}

            // ✅ 2. 写缓存（注意：这里缓存的是整个 block map，不只是 id）
            await setDataToCache(cacheKey, blocks)

            return blocks
          } catch (err) {
            console.warn('[API异常]', id, err.message)
            return {}
          }
        })
      )
    )

    // ✅ 合并
    for (const block of results) {
      fetchedBlocks = {
        ...fetchedBlocks,
        ...block
      }
    }

    console.log(
      `[Batch] 当前累计 blocks: ${Object.keys(fetchedBlocks).length}`
    )
  }

  return fetchedBlocks
}

/**
 * 强制修复 block 中所有可能的非法 URL 字段
 * @param {Object} blockValue - block.value
 */
function sanitizeBlockUrls(blockValue) {
  if (!blockValue || typeof blockValue !== 'object') return

  const fixUrl = (url) => {
    if (typeof url !== 'string') return url

    if (url.startsWith('/')) {
      return url
    }

    // 修复 http:xxx → http://xxx
    if (url.startsWith('http:') && !url.startsWith('http://')) {
      url = 'http://' + url.slice(5)
    } else if (url.startsWith('https:') && !url.startsWith('https://')) {
      url = 'https://' + url.slice(6)
    }

    // 再次验证是否合法，否则替换为占位图
    try {
      new URL(url)
      return url
    } catch {
      console.warn('[Sanitize URL] Invalid URL replaced:', url)
      return 'https://via.placeholder.com/1x1?text=Invalid+Image'
    }
  }

  // 1. 处理 properties.source（用于 image, embed, bookmark, file, pdf 等）
  if (
    blockValue.properties?.source?.[0]?.[0] &&
    typeof blockValue.properties.source[0][0] === 'string'
  ) {
    blockValue.properties.source[0][0] = fixUrl(blockValue.properties.source[0][0])
  }

  // 2. 处理 file.url（用于 file block）
  if (blockValue.file?.url && typeof blockValue.file.url === 'string') {
    blockValue.file.url = fixUrl(blockValue.file.url)
  }

  // 3. 处理 format.page_cover（页面封面）
  if (blockValue.format?.page_cover && typeof blockValue.format.page_cover === 'string') {
    blockValue.format.page_cover = fixUrl(blockValue.format.page_cover)
  }

  // 4. 处理其他可能的 URL 字段（可选扩展）
  // 例如：video、audio 的 source 可能也走 properties.source，已覆盖
}