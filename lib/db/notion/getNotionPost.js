import BLOG from '@/blog.config'
import { idToUuid } from 'notion-utils'
import ReactNotionX from 'react-notion-x'
import formatDate from '../../utils/formatDate'
import { fetchNotionPageBlocks, formatNotionBlock } from './getPostBlocks'
import { checkStrIsNotionId, checkStrIsUuid } from '@/lib/utils'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'

let cachedBlogSpaceId

/**
 * 归一化成 32 位小写十六进制，便于比较
 * 兼容：32 位裸 id、带连字符的 uuid、带 en: 前缀、粘贴时带的引号或空格
 */
function normalizeId(value) {
  const hex = String(value ?? '')
    .toLowerCase()
    .replace(/[^0-9a-f]/g, '')
  return hex.length === 32 ? hex : null
}

/**
 * 读取记录所属的工作区(space) id，兼容新旧两种 Notion 数据格式
 */
function readSpaceId(recordMap, blockId) {
  const entry = recordMap?.block?.[blockId]
  return normalizeId(
    entry?.spaceId || entry?.value?.value?.space_id || entry?.value?.space_id
  )
}

/**
 * 本站自己的工作区(space) id
 * 优先读环境变量 NOTION_WORKSPACE_ID；没配置或格式不对时从博客根页面的记录里现取（进程内缓存）
 * 目的是不在代码里写死任何 id
 */
async function getBlogSpaceId() {
  const fromEnv = normalizeId(process.env.NOTION_WORKSPACE_ID)
  if (fromEnv) {
    return fromEnv
  }
  if (cachedBlogSpaceId !== undefined) {
    return cachedBlogSpaceId
  }
  cachedBlogSpaceId = null
  const pageIds = String(BLOG.NOTION_PAGE_ID || '').split(',')
  for (const rawPageId of pageIds) {
    const pageId = normalizeId(rawPageId)
    if (!pageId) continue
    const uuid = idToUuid(pageId)
    try {
      const rootBlockMap = await fetchNotionPageBlocks(uuid, 'blog-space-id')
      const spaceId = readSpaceId(rootBlockMap, uuid)
      if (spaceId) {
        cachedBlogSpaceId = spaceId
        break
      }
    } catch (error) {
      console.warn('[Notion] 读取站点工作区 id 失败:', error)
    }
  }
  if (!cachedBlogSpaceId) {
    console.warn('[Notion] 无法确定本站工作区 id，按 ID 访问的页面将返回 404')
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
  if (!blogSpaceId || !blockSpaceId || blockSpaceId !== blogSpaceId) {
    console.warn(
      `[Notion] 拒绝渲染非本站工作区的内容: ${blockUuid} (实际=${blockSpaceId || 'unknown'} 期望=${blogSpaceId || 'unknown'})`
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
