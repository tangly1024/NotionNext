import BLOG from '@/blog.config'
import { idToUuid } from 'notion-utils'
import ReactNotionX from 'react-notion-x'
import formatDate from '../../utils/formatDate'
import { fetchNotionPageBlocks } from './getPostBlocks'
import { checkStrIsNotionId, checkStrIsUuid } from '@/lib/utils'

/**
 * 根据页面ID获取文章，同时打印获取耗时
 * @param {*} pageId
 * @returns
 */
export async function fetchPageFromNotion(pageId) {
  const start = Date.now() // 开始时间

  // 获取页面内容块
  const blockMap = await fetchNotionPageBlocks(pageId, 'slug')
  const fetchEnd = Date.now() // fetchNotionPageBlocks 耗时
  console.log(`⏱ [Notion] pageId: ${pageId} fetch blocks耗时: ${fetchEnd - start}ms`)

  if (!blockMap) {
    return null
  }

  if (checkStrIsNotionId(pageId)) {
    pageId = idToUuid(pageId)
  }
  if (!checkStrIsUuid(pageId)) {
    return null
  }

  const postInfo = blockMap?.block?.[pageId]?.value
  if (!postInfo) {
    return null
  }

  const result = {
    id: pageId,
    type: postInfo.type,
    category: '',
    tags: [],
    title: postInfo?.properties?.title?.[0] || null,
    status: 'Published',
    createdTime: formatDate(
      new Date(postInfo.created_time).toString(),
      BLOG.LANG
    ),
    lastEditedDay: formatDate(
      new Date(postInfo?.last_edited_time).toString(),
      BLOG.LANG
    ),
    fullWidth: postInfo?.fullWidth || false,
    page_cover: getPageCover(postInfo) || BLOG.HOME_BANNER_IMAGE || null,
    date: {
      start_date: formatDate(
        new Date(postInfo?.last_edited_time).toString(),
        BLOG.LANG
      )
    },
    blockMap
  }

  const end = Date.now() // 总耗时
  console.log(`✅ [Notion] pageId: ${pageId} total处理耗时: ${end - start}ms`)

  return result
}

/**
 * 获取页面封面，优先级：Notion页面封面 > 站点默认封面 > null
 */
function getPageCover(postInfo) {
  const pageCover = postInfo.format?.page_cover
  if (pageCover) {
    if (pageCover.startsWith('/')) return BLOG.NOTION_HOST + pageCover
    if (pageCover.startsWith('http')) {
      console.log('ReactNotionX', ReactNotionX)
      return pageCover
    }
    // return defaultMapImageUrl(pageCover, postInfo)
    return null
  }
}
