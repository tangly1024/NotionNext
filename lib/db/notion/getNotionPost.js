import BLOG from '@/blog.config'
import { idToUuid } from 'notion-utils'
import ReactNotionX from 'react-notion-x'
import formatDate from '../../utils/formatDate'
import { fetchNotionPageBlocks, formatNotionBlock } from './getPostBlocks'
import { checkStrIsNotionId, checkStrIsUuid } from '@/lib/utils'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'

let cachedBlogSpaceId

/**
 * 读取记录所属的工作区(space) id，兼容新旧两种 Notion 数据格式
 */
function readSpaceId(recordMap, blockId) {
  const entry = recordMap?.block?.[blockId]
  return (
    entry?.spaceId ||
    entry?.value?.value?.space_id ||
    entry?.value?.space_id ||
    null
  )
}

/**
 * 本站自己的工作区(space) id
 * 优先读环境变量 NOTION_WORKSPACE_ID；没配置时从博客根页面的记录里现取（进程内缓存）
 * 目的是不在代码里写死任何 id
 */
async function getBlogSpaceId() {
  const fromEnv = process.env.NOTION_WORKSPACE_ID
  if (fromEnv) {
    return String(fromEnv).trim().toLowerCase()
  }
  if (cachedBlogSpaceId !== undefined) {
    return cachedBlogSpaceId
  }
  const rootPageId = String(BLOG.NOTION_PAGE_ID || '')
    .split(',')[0]
    .match(/[0-9a-fA-F]{32}/)?.[0]
  if (!rootPageId) {
    cachedBlogSpaceId = null
    return cachedBlogSpaceId
  }
  const rootUuid = idToUuid(rootPageId)
  try {
    const rootBlockMap = await fetchNotionPageBlocks(rootUuid, 'blog-space-id')
    cachedBlogSpaceId = readSpaceId(rootBlockMap, rootUuid)
  } catch (error) {
    console.warn('[Notion] 读取站点工作区 id 失败:', error)
    cachedBlogSpaceId = null
  }
  return cachedBlogSpaceId
}

/**
 * 根据页面ID获取文章，同时打印获取耗时
 * @param {*} pageId
 * @returns
 */
export async function fetchPageFromNotion(pageId) {
  const start = Date.now() // 开始时间

  // 获取页面内容块
  const rawBlockMap = await fetchNotionPageBlocks(pageId, 'slug')
  const fetchEnd = Date.now() // fetchNotionPageBlocks 耗时
  console.log(`⏱ [Notion] pageId: ${pageId} fetch blocks耗时: ${fetchEnd - start}ms`)

  if (!rawBlockMap) {
    return null
  }

  const blockUuid = checkStrIsNotionId(pageId) ? idToUuid(pageId) : pageId
  if (!checkStrIsUuid(blockUuid)) {
    return null
  }

  // 只允许渲染本站工作区内的内容：
  // URL 最后一段可以是任意 Notion 块 id，而 Notion 的公开接口能读到别人公开分享的页面，
  // 不校验的话别人的页面就会被渲染到我们域名下
  const blogSpaceId = await getBlogSpaceId()
  const blockSpaceId = readSpaceId(rawBlockMap, blockUuid)
  if (
    !blogSpaceId ||
    !blockSpaceId ||
    String(blockSpaceId).toLowerCase() !== blogSpaceId
  ) {
    console.warn(
      `[Notion] 拒绝渲染非本站工作区的内容: ${blockUuid} (space=${blockSpaceId || 'unknown'})`
    )
    return null
  }

  const blockMap = adapterNotionBlockMap(rawBlockMap)
  if (blockMap?.block) {
    blockMap.block = formatNotionBlock(blockMap.block)
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
