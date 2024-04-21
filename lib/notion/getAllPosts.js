import BLOG from '@/blog.config'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import { getNotionPageData } from '@/lib/db/getSiteData'
import { delCacheData } from '@/lib/cache/cache_manager'

/**
 * Method to get all the posts from Notion.
 * @param notionPageData - Notion page data from getNotionPageData.
 * @param from - The source of the Notion page data.
 * @param pageType - An array of page types to include.
 * @returns {Promise<Array>} - An array of posts.
 */
export async function getAllPosts({ notionPageData, from, pageType }) {
  notionPageData = notionPageData || await getNotionPageData({ from })

  if (!notionPageData) {
    return []
  }

  const { block, schema, tagOptions, collectionQuery, collectionId, collectionView, viewIds } = notionPageData

  const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds)

  const data = await Promise.all(pageIds.map(async (id) => {
    const value = block[id]?.value

    if (!value) {
      return null
    }

    const properties = await getPageProperties(id, value, schema, null, tagOptions)

    return properties || null
  }))

  const posts = data.filter(post => {
    return post?.title && post?.status?.[0] === 'Published' && pageType.includes(post?.type?.[0])
  })

  if (!posts || posts.length === 0) {
    const cacheKey = 'page_block_' + BLOG.NOTION_PAGE_ID
    await delCacheData(cacheKey)
  }

  if (BLOG.POSTS_SORT_BY === 'date') {
    posts.sort((a, b) => {
      return b?.publishDate - a?.publishDate
    })
  }

  return posts
}
