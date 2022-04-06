import BLOG from '@/blog.config'
import { NotionAPI } from 'notion-client'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'

export async function getPostBlocks(id, from, slice, retryCount = 3) {
  const cacheKey = 'page_block_' + id
  let pageBlock = await getDataFromCache(cacheKey)
  if (pageBlock) {
    console.log('[请求缓存]:', `from:${from}`, `id:${id}`, cacheKey)
    return filterPostBlocks(id, pageBlock, slice)
  }
  const authToken = BLOG.NOTION_ACCESS_TOKEN || null
  const api = new NotionAPI({ authToken })
  try {
    console.warn('[请求API]:', `from:${from}`, `id:${id}`)
    pageBlock = await api.getPage(id)
    console.warn('[请求成功]', `from:${from}`, `id:${id}`)
  } catch (error) {
    console.error('[请求失败]', `from:${from}`, `id:${id}`, `error:${error}`)
    if (retryCount && retryCount > 0) { // 重试
      console.error('[重试请求]', `from:${from}`, `id:${id}`, `剩余次数:${retryCount}`)
      return getPostBlocks(id, from, slice, retryCount - 1)
    }
    return null
  }

  if (pageBlock) {
    await setDataToCache(cacheKey, pageBlock)
    return filterPostBlocks(id, pageBlock, slice)
  }
  return pageBlock
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

function deepClone(obj) {
  const newObj = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = (obj && typeof obj[key] === 'object') ? deepClone(obj[key]) : obj[key]
      }
    }
  }
  return newObj
}
