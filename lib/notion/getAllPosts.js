import BLOG from '@/blog.config'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import { defaultMapImageUrl } from 'react-notion-x'
import { getNotionPageData } from '@/lib/notion/getNotionData'

/**
 * 获取所有文章列表
 * @param notionPageData
 * @param from
 * @param includePage 是否包含Page类型
 * @returns {Promise<*[]>}
 */
export async function getAllPosts ({ notionPageData, from, includePage = false }) {
  if (!notionPageData) {
    notionPageData = await getNotionPageData({ from })
  }
  if (!notionPageData) {
    return []
  }

  const pageBlock = notionPageData.block
  const schema = notionPageData.schema
  const tagOptions = notionPageData.tagOptions
  const collectionQuery = notionPageData.collectionQuery

  const data = []
  const pageIds = getAllPageIds(collectionQuery)
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const properties = (await getPageProperties(id, pageBlock, schema)) || null
    properties.createdTime = new Date(pageBlock[id].value?.created_time).toString()
    properties.lastEditedTime = new Date(pageBlock[id].value?.last_edited_time).toString()
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
    if (includePage) {
      return (
        post.title && post.slug &&
        post?.status?.[0] === 'Published' &&
        (post?.type?.[0] === 'Post' || post?.type?.[0] === 'Page')
      )
    } else {
      return (
        post.title && post.slug &&
        post?.status?.[0] === 'Published' &&
        (post?.type?.[0] === 'Post')
      )
    }
  })

  // Sort by date
  if (BLOG.sortByDate) {
    posts.sort((a, b) => {
      const dateA = new Date(a?.date?.start_date || a.createdTime)
      const dateB = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })
  }
  return posts
}

// 从Block获取封面图;优先取PageCover，否则取内容图片
function getPostCover (id, block) {
  const pageCover = block[id].value?.format?.page_cover
  if (pageCover) {
    if (pageCover.startsWith('/')) return 'https://www.notion.so' + pageCover
    if (pageCover.startsWith('http')) return defaultMapImageUrl(pageCover, block[id].value)
  }
}
