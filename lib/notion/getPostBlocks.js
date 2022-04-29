import BLOG from '@/blog.config'
import { NotionAPI } from 'notion-client'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { deepClone, delay } from '../utils'

export async function getPostBlocks(id, from, slice) {
  const cacheKey = 'page_block_' + id
  let pageBlock = await getDataFromCache(cacheKey)
  if (pageBlock) {
    console.log('[请求缓存]:', `from:${from}`, cacheKey)
    return filterPostBlocks(id, pageBlock, slice)
  }

  console.warn('[请求API]:', `from:${from}`, `id:${id}`)
  pageBlock = await getPageWithRetry(id, from)
  console.warn('[请求完成]: 结果', `${pageBlock ? '成功' : '失败'}`, `from:${from}`, `id:${id}`)

  if (pageBlock) {
    await setDataToCache(cacheKey, pageBlock)
    return filterPostBlocks(id, pageBlock, slice)
  }
  return pageBlock
}

/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
async function getPageWithRetry(id, from, retryAttempts = 3) {
  if (retryAttempts && retryAttempts > 0) {
    console.error('[发起请求]', `from:${from}`, `id:${id}`, `剩余重试次数:${retryAttempts}`)
    try {
      const authToken = BLOG.NOTION_ACCESS_TOKEN || null
      const api = new NotionAPI({ authToken })
      return await api.getPage(id)
    } catch (e) {
      await delay(1000)
      const cacheKey = 'page_block_' + id
      const pageBlock = await getDataFromCache(cacheKey)
      if (pageBlock) {
        console.error('[重试获取缓存]', `from:${from}`, `id:${id}`)
        return pageBlock
      }
      return await getPageWithRetry(id, from, retryAttempts - 1)
    }
  } else {
    return null
  }
}

/**
 * 获取到的blockMap删除不需要的字段
 * @param {*} id 页面ID
 * @param {*} pageBlock 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
function filterPostBlocks(id, pageBlock, slice) {
  const clonePageBlock = deepClone(pageBlock)
  let count = 0

  for (const i in clonePageBlock?.block) {
    const b = clonePageBlock?.block[i]
    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock?.block[i]
      continue
    }
    count++
    // 处理 c++ 和 c#两种语言
    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp'
      }
    }

    delete b?.role
    delete b?.value?.version
    delete b?.value?.created_by_table
    delete b?.value?.created_by_id
    delete b?.value?.last_edited_by_table
    delete b?.value?.last_edited_by_id
    delete b?.value?.space_id
  }

  // 去掉不用的字段
  if (id === BLOG.NOTION_PAGE_ID) {
    return clonePageBlock
  }
  return clonePageBlock
}
