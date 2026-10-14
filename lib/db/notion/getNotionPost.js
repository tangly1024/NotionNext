import BLOG from '@/blog.config'
import { idToUuid } from 'notion-utils'
import ReactNotionX from 'react-notion-x'
import formatDate from '../../utils/formatDate'
import { fetchNotionPageBlocks, formatNotionBlock } from './getPostBlocks'
import { checkStrIsNotionId, checkStrIsUuid } from '@/lib/utils'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { extractLangId } from '@/lib/utils/pageId'

/** 已确认可用的本站工作区 id 集合（只缓存成功结果） */
let cachedBlogSpaceIds = null
/** 正在进行中的工作区推导，供并发请求共享，避免重复请求 Notion */
let inflightBlogSpaceIds = null

/**
 * 归一化成 32 位小写十六进制，便于比较
 * 兼容：32 位裸 id、带连字符的 uuid、带 en: 等语言前缀、粘贴时带的引号或空格
 * 注意必须先用 extractLangId 拆出语言前缀，否则前缀里的 e 会被误保留成 33 位
 */
function normalizeId(value) {
  const withoutPrefix = extractLangId(
    String(value ?? '')
      .trim()
      .replace(/^["']|["']$/g, '')
  )
  const hex = withoutPrefix.toLowerCase().replace(/[^0-9a-f]/g, '')
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
 * 允许渲染的工作区(space) id 集合
 * 优先读环境变量 NOTION_WORKSPACE_ID（支持逗号分隔多工作区）；
 * 没配置时从 NOTION_PAGE_ID 的每个根页面记录里推导（支持多站点、语言前缀）。
 * 并发请求共享同一个推导 Promise；只缓存成功结果，失败后下次调用会重试。
 * 目的是不在代码里写死任何 id。
 */
function getBlogSpaceIds() {
  const envIds = String(process.env.NOTION_WORKSPACE_ID || '')
    .split(',')
    .map(normalizeId)
    .filter(Boolean)
  if (envIds.length > 0) {
    return { spaceIds: new Set(envIds), complete: true }
  }
  if (cachedBlogSpaceIds) {
    return { spaceIds: cachedBlogSpaceIds, complete: true }
  }
  if (!inflightBlogSpaceIds) {
    inflightBlogSpaceIds = deriveBlogSpaceIds()
      .then(result => {
        // A successful root must not hide another root's temporary failure.
        // Cache only complete discovery; partial results can be retried.
        if (result.complete && result.spaceIds.size > 0) {
          cachedBlogSpaceIds = result.spaceIds
        }
        return result
      })
      .finally(() => {
        inflightBlogSpaceIds = null
      })
  }
  return inflightBlogSpaceIds
}

/**
 * 从所有根页面记录推导允许的工作区集合。
 * 多站点（逗号分隔的 NOTION_PAGE_ID）可能分属不同工作区，全部收集，
 * 避免只取第一个导致第二个站点的合法子页面被 404。
 */
async function deriveBlogSpaceIds() {
  const spaceIds = new Set()
  let complete = true
  const pageIds = String(BLOG.NOTION_PAGE_ID || '').split(',')
  for (const rawPageId of pageIds) {
    const pageId = normalizeId(rawPageId)
    if (!pageId) {
      complete = false
      continue
    }
    const uuid = idToUuid(pageId)
    try {
      const rootBlockMap = await fetchNotionPageBlocks(uuid, 'blog-space-id')
      const spaceId = readSpaceId(rootBlockMap, uuid)
      if (spaceId) {
        spaceIds.add(spaceId)
      } else {
        complete = false
        console.warn(
          `[Notion] 根页面记录中未读到工作区 id: ${uuid}`
        )
      }
    } catch (error) {
      complete = false
      console.warn('[Notion] 读取站点工作区 id 失败:', error)
    }
  }
  if (spaceIds.size === 0) {
    console.warn('[Notion] 无法确定本站工作区 id，按 ID 访问的页面将返回 404')
  }
  return { spaceIds, complete }
}

/**
 * 根据页面ID获取文章，同时打印获取耗时
 * @param {*} pageId
 * @returns
 */
export async function fetchPageFromNotion(pageId, { throwOnUnavailable = false } = {}) {
  const start = Date.now() // 开始时间

  // 获取页面内容块
  const rawBlockMap = await fetchNotionPageBlocks(pageId, 'slug')
  const fetchEnd = Date.now() // fetchNotionPageBlocks 耗时
  console.log(`⏱ [Notion] pageId: ${pageId} fetch blocks耗时: ${fetchEnd - start}ms`)

  if (!rawBlockMap) {
    // Retries return null when Notion is unavailable. This is not evidence that
    // a previously rendered UUID page was deleted.
    if (throwOnUnavailable) throw new Error('Notion page is temporarily unavailable')
    return null
  }

  const blockUuid = checkStrIsNotionId(pageId) ? idToUuid(pageId) : pageId
  if (!checkStrIsUuid(blockUuid)) {
    return null
  }

  // 只允许渲染本站工作区内的内容：
  // URL 最后一段可以是任意 Notion 块 id，而 Notion 的公开接口能读到别人公开分享的页面，
  // 不校验的话别人的页面就会被渲染到我们域名下。
  // 无法确认归属（含工作区推导失败）时一律拒绝，宁可 404 不可放行
  const { spaceIds: blogSpaceIds, complete } = await getBlogSpaceIds()
  const blockSpaceId = readSpaceId(rawBlockMap, blockUuid)
  if (throwOnUnavailable && (!blogSpaceIds.size || (!complete && !blogSpaceIds.has(blockSpaceId)))) {
    throw new Error('Notion workspace is temporarily unavailable')
  }
  if (!blogSpaceIds?.size || !blockSpaceId || !blogSpaceIds.has(blockSpaceId)) {
    console.warn(
      `[Notion] 拒绝渲染非本站工作区的内容: ${blockUuid} (实际=${blockSpaceId || 'unknown'} 期望=${blogSpaceIds ? [...blogSpaceIds].join(',') : 'unknown'})`
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
