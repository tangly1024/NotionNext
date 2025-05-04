import BLOG from '@/blog.config'
import { idToUuid } from 'notion-utils'
import { defaultMapImageUrl } from 'react-notion-x'
import formatDate from '../utils/formatDate'
import { getPage } from './getPostBlocks'
import { checkStrIsNotionId, checkStrIsUuid } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

/**
 * 根据页面ID获取内容
 * @param {*} pageId
 * @returns
 */
export async function getPost(pageId) {
  const blockMap = await getPage(pageId, 'slug')
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

  let wordCount = 0
  let readingTime = ''
  try {
    const contentText = extractTextFromBlockMap(blockMap)
    wordCount = contentText.replace(/\s/g, '').length
    readingTime = Math.ceil(wordCount / 300) + '分钟'
  } catch (e) {
    console.error('统计字数/阅读时间出错', e)
  }

  return {
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
    wordCount,
    readingTime,
    blockMap
  }
}

function getPageCover(postInfo) {
  const pageCover = postInfo.format?.page_cover
  if (pageCover) {
    if (pageCover.startsWith('/')) return BLOG.NOTION_HOST + pageCover
    if (pageCover.startsWith('http'))
      return defaultMapImageUrl(pageCover, postInfo)
  }
}

// 提取正文文本内容
function extractTextFromBlockMap(blockMap) {
  let text = ''
  if (!blockMap?.block) return text
  Object.values(blockMap.block).forEach(block => {
    const value = block.value
    if (value?.properties?.title) {
      text += value.properties.title.map(arr => arr[0]).join('') + ' '
    }
  })
  return text
}
