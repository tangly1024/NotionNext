import BLOG from '@/blog.config'
import { NotionAPI } from 'notion-client'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'

export async function getPostBlocks (id, from) {
  let pageBlock = await getDataFromCache('page_block_' + id)
  if (pageBlock) {
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

  if (pageBlock) {
    await setDataToCache('page_block_' + id, pageBlock)
  }
  return pageBlock
}
