import BLOG from '@/blog.config'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import { defaultMapImageUrl } from 'react-notion-x'
import formatDate from '@/lib/formatDate'
import { getNotionPageData } from '@/lib/notion/getNotionData'
import { delCacheData } from '@/lib/cache/cache_manager'

/**
 * 获取所有文章列表
 * @param notionPageData
 * @param from
 * @param pageType 页面类型数组 ['Post','Page']
 * @returns {Promise<*[]>}
 */
export async function getAllPosts({ notionPageData, from, pageType }) {
  if (!notionPageData) {
    notionPageData = await getNotionPageData({ from })
  }
  if (!notionPageData) {
    return []
  }

  const pageBlock = notionPageData.block
  const schema = notionPageData.schema
  const tagOptions = notionPageData.tags
  const collectionQuery = notionPageData.collectionQuery

  const data = []
  const pageIds = getAllPageIds(collectionQuery)
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const properties = (await getPageProperties(id, pageBlock, schema)) || null
    properties.slug = properties.slug ?? properties.id
    properties.createdTime = formatDate(new Date(pageBlock[id].value?.created_time).toString(), BLOG.LANG)
    properties.lastEditedTime = formatDate(new Date(pageBlock[id].value?.last_edited_time).toString(), BLOG.LANG)
    properties.fullWidth = pageBlock[id].value?.format?.page_full_width ?? false
    properties.page_cover = getPostCover(id, pageBlock) ?? null
    properties.content = pageBlock[id].value?.content ?? []
    properties.tagItems = properties?.tags?.map(tag => {
      return { name: tag, color: tagOptions.find(t => t.value === tag)?.color || 'gray' }
    }) || []
    delete properties.content
    data.push(properties)
  }

  // remove all the the items doesn't meet requirements
  const posts = data.filter(post => {
    return post.title && post?.status?.[0] === 'Published' && pageType.indexOf(post?.type?.[0]) > -1
  })

  if (!posts || posts.length === 0) {
    const cacheKey = 'page_block_' + BLOG.NOTION_PAGE_ID
    await delCacheData(cacheKey)
  }

  // Sort by date
  if (BLOG.POSTS_SORT_BY === 'date') {
    posts.sort((a, b) => {
      const dateA = new Date(a?.date?.start_date || a.createdTime)
      const dateB = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })
  }
  return posts
}

// 从Block获取封面图;优先取PageCover，否则取内容图片
function getPostCover(id, block) {
  const pageCover = block[id].value?.format?.page_cover
  if (pageCover) {
    if (pageCover.startsWith('/')) return 'https://www.notion.so' + pageCover
    if (pageCover.startsWith('http')) return defaultMapImageUrl(pageCover, block[id].value)
  }
}
