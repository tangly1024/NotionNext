import BLOG from '@/blog.config'
import { NotionAPI } from 'notion-client'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'

export async function getPostBlocks (id) {
  let pageBlock = await getDataFromCache('page_block_' + id)
  if (pageBlock) {
    return pageBlock
  }
  const authToken = BLOG.notionAccessToken || null
  const api = new NotionAPI({ authToken })
  pageBlock = await api.getPage(id)
  if (pageBlock) {
    await setDataToCache('page_block_' + id, pageBlock)
  }
  return pageBlock
}
