import BLOG from '@/blog.config'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
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

  const { block, schema, tagOptions, collectionQuery, collectionId, collectionView, viewIds } = notionPageData
  const data = []
  const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds)
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const value = block[id]?.value
    if (!value) {
      continue
    }
    const properties = (await getPageProperties(id, block[id].value, schema, null, tagOptions)) || null
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
      return b?.publishDate - a?.publishDate
    })
  }
  return posts
}
