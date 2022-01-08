import BLOG from '@/blog.config'
import { NotionAPI } from 'notion-client'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'

export async function getPostBlocks (id, from) {
  const cacheKey = 'page_block_' + id
  let pageBlock = await getDataFromCache(cacheKey)
  if (pageBlock) {
    console.log('[请求缓存]:', `from:${from}`, `id:${id}`)
    return pageBlock
  }
  const authToken = BLOG.notionAccessToken || null
  const api = new NotionAPI({ authToken })
  try {
    console.log('[请求API]:', `from:${from}`, `id:${id}`)
    pageBlock = await api.getPage(id)
    console.log('[请求成功]', `from:${from}`, `id:${id}`)
  } catch (error) {
    console.error('[请求失败]', `from:${from}`, `id:${id}`, `error:${error}`)
    return null
  }

  // 去掉不用的字段
  for (const j in pageBlock?.block) {
    const b = pageBlock?.block[j]
    if (b) {
      delete b.role
      delete b.value?.version
      delete b.value?.created_time
      delete b.value?.last_edited_time
      delete b.value?.created_by_table
      delete b.value?.created_by_id
      delete b.value?.last_edited_by_table
      delete b.value?.last_edited_by_id
      delete b.value?.space_id
    }
  }

  if (pageBlock) {
    await setDataToCache(cacheKey, pageBlock)
  }
  return pageBlock
}
