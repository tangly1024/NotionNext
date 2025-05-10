import BLOG from '@/blog.config'
import {
  getDataFromCache,
  getOrSetDataWithCache,
  setDataToCache
} from '@/lib/cache/cache_manager'
import { deepClone, delay } from '../utils'
import notionAPI from '@/lib/notion/getNotionAPI'

/**
 * 获取文章内容块
 * @param {*} id
 * @param {*} from
 * @param {*} slice
 * @returns
 */
export async function getPage(id, from = null, slice) {
  const cacheKey = `page_content_${id}`
  return await getOrSetDataWithCache(
    cacheKey,
    async (id, slice) => {
      let pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        return convertNotionBlocksToPost(id, pageBlock, slice)
      }

      // 抓取最新数据
      pageBlock = await getPageWithRetry(id, from)

      if (pageBlock) {
        await setDataToCache(cacheKey, pageBlock)
        return convertNotionBlocksToPost(id, pageBlock, slice)
      }
      return pageBlock
    },
    id,
    slice
  )
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
      const start = new Date().getTime()
      const pageData = await notionAPI.getPage(id)
      const end = new Date().getTime()
      console.log('[API<<--响应]', `耗时:${end - start}ms - from:${from}`)
      return pageData
    } catch (e) {
      console.warn('[API<<--异常]:', e)
      await delay(1000)
      const cacheKey = 'page_block_' + id
      const pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
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
function convertNotionBlocksToPost(id, blockMap, slice) {
  const clonePageBlock = deepClone(blockMap)
  let count = 0
  const blocksToProcess = Object.keys(clonePageBlock?.block || {})

  for (let i = 0; i < blocksToProcess.length; i++) {
    const blockId = blocksToProcess[i]
    const b = clonePageBlock?.block[blockId]

    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock?.block[blockId]
      continue
    }

    // 移除Page本体敏感数据
    if (b?.value?.id === id) {
      delete b?.value?.properties
      continue
    }

    count++

    // 处理同步块 sync_block
    if (b?.value?.type === 'sync_block' && b?.value?.children) {
      const childBlocks = b.value.children
      delete clonePageBlock.block[blockId]
      childBlocks.forEach((childBlock, index) => {
        const newBlockId = `${blockId}_child_${index}`
        clonePageBlock.block[newBlockId] = childBlock
        blocksToProcess.splice(i + index + 1, 0, newBlockId)
      })
      i--
      continue
    }

    // 代码块语言映射
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

    // 处理文件、PDF、视频、音频 block，提取真实 signed url
    if (
      (b?.value?.type === 'file' ||
        b?.value?.type === 'pdf' ||
        b?.value?.type === 'video' ||
        b?.value?.type === 'audio') &&
      b?.value?.properties?.source?.[0][0]
    ) {
      const signedUrl = b?.value?.file?.url || b?.value?.format?.display_source
      if (signedUrl) {
        b.value.properties.source[0][0] = signedUrl
      } else {
        // fallback：旧逻辑
        const oldUrl = b?.value?.properties?.source?.[0][0]
        const newUrl = `https://notion.so/signed/${encodeURIComponent(oldUrl)}?table=block&id=${b?.value?.id}`
        b.value.properties.source[0][0] = newUrl
      }
    }
  }

  if (id === BLOG.NOTION_PAGE_ID) {
    return clonePageBlock
  }
  return clonePageBlock
}

/**
 * 批量抓取blocks
 * @param {*} ids
 * @param {*} batchSize
 * @returns
 */
export const fetchInBatches = async (ids, batchSize = 100) => {
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  let fetchedBlocks = {}
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    console.log('[API-->>请求] Fetching missing blocks', batch, ids.length)
    const start = new Date().getTime()
    const pageChunk = await notionAPI.getBlocks(batch)
    const end = new Date().getTime()
    console.log(
      `[API<<--响应] 耗时:${end - start}ms Fetching missing blocks count:${ids.length} `
    )

    fetchedBlocks = Object.assign(
      {},
      fetchedBlocks,
      pageChunk?.recordMap?.block
    )
  }
  return fetchedBlocks
}
