import BLOG from '@/blog.config'
import { idToUuid } from 'notion-utils'
import formatDate from '../formatDate'
import { getPostBlocks } from './getPostBlocks'
import { defaultMapImageUrl } from 'react-notion-x'

export async function getNotion(pageId) {
  const blockMap = await getPostBlocks(pageId, 'slug')
  if (!blockMap) {
    return null
  }

  const postInfo = blockMap?.block?.[idToUuid(pageId)].value

  return {
    id: pageId,
    type: postInfo,
    category: '',
    tags: [],
    title: postInfo?.properties?.title?.[0],
    status: 'Published',
    createdTime: formatDate(new Date(postInfo.created_time).toString(), BLOG.LANG),
    lastEditedTime: formatDate(new Date(postInfo?.last_edited_time).toString(), BLOG.LANG),
    fullWidth: false,
    page_cover: getPageCover(postInfo),
    date: { start_date: formatDate(new Date(postInfo?.last_edited_time).toString(), BLOG.LANG) },
    blockMap
  }
}

function getPageCover(postInfo) {
  const pageCover = postInfo.format?.page_cover
  if (pageCover) {
    if (pageCover.startsWith('/')) return 'https://www.notion.so' + pageCover
    if (pageCover.startsWith('http')) return defaultMapImageUrl(pageCover, postInfo)
  }
}
