import BLOG from '@/blog.config'
import { getOrSetDataWithCache } from '../cache/cache_manager'
import { getAllCategories } from '@/lib/db/notion/getAllCategories'
import getAllPageIds from '@/lib/db/notion/getAllPageIds'
import { getAllTags } from '@/lib/db/notion/getAllTags'
import { getConfigMapFromConfigPage } from '@/lib/db/notion/getNotionConfig'
import getPageProperties, {
  adjustPageProperties
} from '@/lib/db/notion/getPageProperties'
import {
  getCustomMenu,
  getSourcePageSlugs
} from '@/lib/db/notion/getCustomMenu'
import {
  fetchInBatches,
  fetchNotionPageBlocks,
  formatNotionBlock
} from '@/lib/db/notion/getPostBlocks'
import { compressImage, mapImgUrl } from '@/lib/db/notion/mapImage'
import { deepClone } from '@/lib/utils'
import { idToUuid } from 'notion-utils'
import { siteConfig } from '../config'
import { extractLangId, extractLangPrefix, getShortId } from '../utils/pageId'
import {
  normalizeNotionMetadata,
  normalizeCollection,
  normalizeSchema,
  normalizePageBlock
} from './notion/normalizeUtil'
import { filterCollectionViewData } from './notion/filterCollectionViewData'
import { fetchPageFromNotion } from './notion/getNotionPost'
import { processPostData } from '../utils/post'
import { writePwaManifest } from '../pwa.server'
import { adapterNotionBlockMap } from '../utils/notion.util'
import { sortPinnedPostsByLatestUpdate } from '@/lib/utils/pinnedPosts'
import { fetchMembersFromOfficialAPI } from './notion/memberDataSource'
import {
  getPublishedTypedPages,
  sortTypedPagesByPublishDate
} from '@/lib/site/typedCollections'
// import pLimit from 'p-limit'

export { getAllTags } from './notion/getAllTags'
export { fetchPageFromNotion as getPost } from './notion/getNotionPost'
export { fetchNotionPageBlocks as getPostBlocks } from './notion/getPostBlocks'

/**
 * 获取全站数据；基于 Notion 实现
 * 支持多站点（pageId 逗号分隔）和多语言（locale 前缀）
 */
export async function fetchGlobalAllData({
  pageId = BLOG.NOTION_PAGE_ID,
  from,
  locale
}) {
  if (BLOG.BUNDLE_ANALYZER) {
    return EmptyData(pageId)
  }

  const cacheKey = getGlobalDataCacheKey({ pageId, locale })
  const cachedData = await getOrSetDataWithCache(cacheKey, async () => {
    const siteIds = pageId?.split(',') || []
    let data = EmptyData(pageId)

    try {
      for (let index = 0; index < siteIds.length; index++) {
        const siteId = siteIds[index]
        const id = extractLangId(siteId)
        const prefix = extractLangPrefix(siteId)

        if (index === 0 || locale === prefix) {
          data = await getSiteDataByPageId({ pageId: id, from })
        }
      }
    } catch (error) {
      console.error('异常', error)
    }

    return handleDataBeforeReturn(deepClone(data))
  })

  const data = deepClone(cachedData)
  data.latestPosts = cleanPostSummaries(data.latestPosts)
  data.notice = cleanNoticeForClient(data.notice)
  return data
}

function getGlobalDataCacheKey({ pageId, locale }) {
  const safePageId = String(pageId || BLOG.NOTION_PAGE_ID).replace(
    /[^a-z0-9,_:-]/gi,
    '_'
  )
  const safeLocale = String(locale || 'default').replace(/[^a-z0-9_-]/gi, '_')
  return `global_data_${safeLocale}_${safePageId}`
}

/**
 * 获取指定 Notion collection 数据
 * 带防击穿缓存：同一 pageId 并发时只发一次 API 请求
 */
export async function getSiteDataByPageId({ pageId, from }) {
  // const siteStart = Date.now()

  const cacheKey = `site_${pageId}`

  const data = await getOrSetDataWithCache(cacheKey,
    async () => {
      console.log('获取全站数据 ', pageId)
      // 拉取数据
      const originalPageRecordMap = await fetchNotionPageBlocks(pageId, from)
      // 转换格式
      const r = await convertNotionToSiteData(pageId, from, originalPageRecordMap)
      // 返回并塞入缓存
      return Array.isArray(r?.allPages) ? r : EmptyData(pageId)
    }

  )
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[ThemeResolver][site-data]',
      JSON.stringify({
        from,
        pageId,
        notionTheme: data?.NOTION_CONFIG?.THEME || null,
        configTheme: BLOG.THEME,
        cacheEnabled: BLOG.ENABLE_CACHE
      })
    )
  }
  return data

  // const originalPageRecordMap = await promise
  // const siteEnd = Date.now()
  // console.log(`⏱ [Notion API] 站点 ${pageId} 耗时: ${siteEnd - siteStart}ms`)
  // return convertNotionToSiteData(pageId, from, deepClone(originalPageRecordMap))


}

/**
 * 获取公告 block
 * 拉取后必须经过 adapter + format，否则新格式双层嵌套导致 type undefined
 */
async function getNotice(post) {
  if (!post) return null

  try {
    const rawBlockMap = await fetchNotionPageBlocks(post.id, 'data-notice', {
      cacheVersion: post.lastEditedDate
    })
    const adapted = adapterNotionBlockMap(rawBlockMap)
    post.blockMap = {
      ...adapted,
      block: formatNotionBlock(adapted.block)
    }
  } catch (e) {
    console.warn('[getNotice] fetchNotionPageBlocks failed:', post.id, e)
    post.blockMap = null
  }

  return post
}

const CLIENT_POST_SUMMARY_FIELDS = [
  'id',
  'short_id',
  'title',
  'name',
  'slug',
  'href',
  'target',
  'pageIcon',
  'icon',
  'pageCover',
  'pageCoverThumbnail',
  'date',
  'publishDate',
  'publishDay',
  'lastEditedDate',
  'lastEditedDay',
  'category',
  'tags',
  'tagItems',
  'summary',
  'description',
  'type',
  'status',
  'password',
  'readTime',
  'wordCount',
  'ext'
]

export function cleanPostSummary(post) {
  if (!post || typeof post !== 'object') return post

  const result = {}
  CLIENT_POST_SUMMARY_FIELDS.forEach(field => {
    if (post[field] !== undefined) result[field] = post[field]
  })
  return result
}

export function cleanPostSummaries(posts) {
  if (!Array.isArray(posts)) return posts
  return posts.map(cleanPostSummary)
}

function cleanPostForClient(post) {
  if (!post?.blockMap) return post
  const cleanedPost = cleanBlock(post)
  delete cleanedPost.content
  cleanRecordMapMetadata(cleanedPost.blockMap)
  filterCollectionViewData(cleanedPost.blockMap)
  pruneUnusedCollectionRecords(cleanedPost.blockMap)
  return cleanedPost
}

function cleanNoticeForClient(notice) {
  if (!notice?.blockMap) return notice
  const cleanedNotice = cleanBlock(notice)
  pruneBlockMapToRootPage(cleanedNotice.blockMap, cleanedNotice.id)
  cleanRecordMapMetadata(cleanedNotice.blockMap)
  filterCollectionViewData(cleanedNotice.blockMap)
  pruneUnusedCollectionRecords(cleanedNotice.blockMap)
  return cleanedNotice
}

function pruneBlockMapToRootPage(blockMap, rootId) {
  if (!blockMap?.block) return

  const rootBlockId = rootId || findRootPageBlockId(blockMap.block)
  if (!rootBlockId) return

  const keepIds = new Set([rootBlockId])
  let changed = true
  while (changed) {
    changed = false
    Object.entries(blockMap.block).forEach(([id, entry]) => {
      const block = entry?.value || entry
      if (!keepIds.has(id) && keepIds.has(block?.parent_id)) {
        keepIds.add(id)
        changed = true
      }
    })
  }

  Object.keys(blockMap.block).forEach(id => {
    if (!keepIds.has(id)) delete blockMap.block[id]
  })
}

function findRootPageBlockId(blockRecord) {
  return Object.values(blockRecord)
    .map(entry => entry?.value || entry)
    .find(block => block?.type === 'page' && Array.isArray(block.content))
    ?.id
}

function cleanRecordMapMetadata(blockMap) {
  if (!blockMap) return

  delete blockMap.__version__
  if (blockMap.notion_user && Object.keys(blockMap.notion_user).length === 0) {
    delete blockMap.notion_user
  }

  cleanRecordEntries(blockMap.collection)
  cleanRecordEntries(blockMap.collection_view)
}

function pruneUnusedCollectionRecords(blockMap) {
  if (!blockMap?.block) return

  const collectionIds = new Set()
  const viewIds = new Set()
  Object.values(blockMap.block).forEach(entry => {
    const block = entry?.value || entry
    if (!block || typeof block !== 'object') return
    if (block.collection_id) collectionIds.add(block.collection_id)
    block.view_ids?.forEach(viewId => viewIds.add(viewId))
  })

  pruneRecordByIds(blockMap.collection, collectionIds)
  pruneRecordByIds(blockMap.collection_view, viewIds)
  pruneRecordByIds(blockMap.collection_query, collectionIds)
}

function pruneRecordByIds(record, ids) {
  if (!record || typeof record !== 'object') return
  Object.keys(record).forEach(id => {
    if (!ids.has(id)) delete record[id]
  })
}

function cleanRecordEntries(record) {
  if (!record || typeof record !== 'object') return

  Object.values(record).forEach(entry => {
    const value = entry?.value || entry
    if (!value || typeof value !== 'object') return

    delete value.version
    delete value.created_by_table
    delete value.created_by_id
    delete value.last_edited_by_table
    delete value.last_edited_by_id
    delete value.space_id
    delete value.parent_table
    delete value.permissions
    delete value.alive
    delete value.role
    delete value.copied_from_pointer
    delete value.copied_from
  })
}

/**
 * 空的默认数据（Notion 拉取失败时的兜底）
 */
const EmptyData = pageId => ({
  notice: null,
  siteInfo: getSiteInfo({}),
  allPages: [
    {
      id: 1,
      title: `无法获取Notion数据，请检查Notion_ID： \n 当前 ${pageId}`,
      summary:
        '访问文档获取帮助 → https://docs.tangly1024.com/article/vercel-deploy-notion-next',
      status: 'Published',
      type: 'Post',
      slug: 'oops',
      publishDay: '2024-11-13',
      pageCoverThumbnail: BLOG.HOME_BANNER_IMAGE || '/bg_image.jpg',
      date: {
        start_date: '2023-04-24',
        lastEditedDay: '2023-04-24',
        tagItems: []
      }
    }
  ],
  allNavPages: [],
  allLinkPages: [],
  collection: [],
  collectionQuery: {},
  collectionId: null,
  collectionView: {},
  viewIds: [],
  block: {},
  schema: {},
  tagOptions: [],
  categoryOptions: [],
  rawMetadata: {},
  customNav: [],
  customMenu: [],
  allMembers: [],
  allEvents: [],
  postCount: 1,
  pageIds: [],
  latestPosts: []
})
/**
 * 在服务端解析单篇文章的 props
 * 兼容 prefix / slug / suffix 任意组合
 * 只能在 getStaticProps / getServerSideProps 中使用
 */
export async function resolvePostProps({ prefix, slug, suffix, locale, from }) {
  const segments = [prefix, slug].filter(Boolean)
  if (Array.isArray(suffix)) segments.push(...suffix)
  const fullSlug = segments.join('/')
  const lastSegment = segments.at(-1)
  const source = from || `slug-props-${fullSlug}`
  const taskId = `${fullSlug || lastSegment}-${Date.now()}` // 当前任务唯一标识

  const startTime = Date.now()
  console.log(`[${taskId}] 🕒 开始解析文章: ${fullSlug || lastSegment} @ ${new Date().toISOString()}`)

  // 拉全站数据
  const step1Start = Date.now()
  const props = await fetchGlobalAllData({ from: source, locale })
  const step1End = Date.now()
  console.log(`[${taskId}] ⏱ fetchGlobalAllData 耗时: ${step1End - step1Start}ms @ ${new Date().toISOString()}`)

  // 工具函数：查找文章
  const findPost = () => {
    if (!props?.allPages) return null
    return (
      // 1. 完整 slug 匹配
      props.allPages.find(p => p && !p.type?.includes('Menu') && p.slug === fullSlug) ||
      // 2. UUID 匹配
      props.allPages.find(p => p?.id === fullSlug) ||
      null
    )
  }

  let post
  // const step2Start = Date.now()
  post = findPost()
  // const step2End = Date.now()
  // console.log(`[${taskId}] ⏱ 查找文章耗时: ${step2End - step2Start}ms @ ${new Date().toISOString()}`)

  // 3. 最后一段是 UUID，直接拉 Notion
  if (!post && typeof lastSegment === 'string' && /^[a-f0-9-]{32,36}$/i.test(lastSegment)) {
    const step3Start = Date.now()
    try {
      post = await fetchPageFromNotion(lastSegment)
    } catch (e) {
      console.warn(`[${taskId}] [resolvePostProps] fetchPageFromNotion failed:`, lastSegment, e)
    }
    const step3End = Date.now()
    console.log(`[${taskId}] ⏱ fetchPageFromNotion 耗时: ${step3End - step3Start}ms @ ${new Date().toISOString()}`)
  }

  // 封装 block 拉取 + 适配逻辑
  const ensureBlockMap = async (post) => {
    if (!post?.id || post?.blockMap) return post
    const step4Start = Date.now()
    try {
      const rawBlockMap = await fetchNotionPageBlocks(post.id, source, {
        cacheVersion: post.lastEditedDate
      })
      const adapted = adapterNotionBlockMap(rawBlockMap)
      post.blockMap = {
        ...adapted,
        block: formatNotionBlock(adapted.block)
      }
    } catch (e) {
      console.warn(`[${taskId}] [resolvePostProps] fetchNotionPageBlocks failed:`, post.id, e)
    }
    const step4End = Date.now()
    console.log(`[${taskId}] ⏱ ensureBlockMap 耗时: ${step4End - step4Start}ms @ ${new Date().toISOString()}`)
    return post
  }

  if (post) {
    post = await ensureBlockMap(post)
    props.post = post
    // const step5Start = Date.now()
    try {
      await processPostData(props, source)
    } catch (e) {
      console.warn(`[${taskId}] [resolvePostProps] processPostData failed`, e)
    }
    // const step5End = Date.now()
    // console.log(`[${taskId}] ⏱ processPostData 耗时: ${step5End - step5Start}ms @ ${new Date().toISOString()}`)
    props.post = cleanPostForClient(props.post)
    props.prev = cleanPostSummary(props.prev)
    props.next = cleanPostSummary(props.next)
    props.recommendPosts = cleanPostSummaries(props.recommendPosts)
  } else {
    props.post = null
  }

  props.latestPosts = cleanPostSummaries(props.latestPosts)
  delete props.allPages
  const endTime = Date.now()
  console.log(`[${taskId}] ✅ 完成解析文章: ${fullSlug || lastSegment}, 总耗时: ${endTime - startTime}ms @ ${new Date().toISOString()}`)

  return props
}
async function convertNotionToSiteData(
  SITE_DATABASE_PAGE_ID,
  from,
  pageRecordMap
) {
  const traceId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const overallStart = Date.now()
  console.log(`[${traceId}] 🕒 开始 convertNotionToSiteData from: ${from} @ ${new Date().toISOString()}`)

  if (!pageRecordMap) {
    console.error(`[${traceId}] can't get Notion Data ; pageId:`, SITE_DATABASE_PAGE_ID)
    return {}
  }

  // const stepStart1 = Date.now()
  SITE_DATABASE_PAGE_ID = idToUuid(SITE_DATABASE_PAGE_ID)
  // const stepEnd1 = Date.now()
  // console.log(`[${traceId}] ⏱ UUID 转换耗时: ${stepEnd1 - stepStart1}ms @ ${new Date().toISOString()}`)

  // ── 原始 block，格式统一 ──
  const stepStart2 = Date.now()
  let block = adapterNotionBlockMap({ block: pageRecordMap.block || {} }).block
  const stepEnd2 = Date.now()
  console.log(`[${traceId}] ⏱ adapterNotionBlockMap 耗时: ${stepEnd2 - stepStart2}ms @ ${new Date().toISOString()}`)

  // const stepStart3 = Date.now()
  const rawMetadata = normalizeNotionMetadata(block, SITE_DATABASE_PAGE_ID)
  // const stepEnd3 = Date.now()
  // console.log(`[${traceId}] ⏱ normalizeNotionMetadata 耗时: ${stepEnd3 - stepStart3}ms @ ${new Date().toISOString()}`)

  if (rawMetadata?.type !== 'collection_view_page' && rawMetadata?.type !== 'collection_view') {
    console.error(`[${traceId}] pageId "${SITE_DATABASE_PAGE_ID}" is not a database`)
    return EmptyData(SITE_DATABASE_PAGE_ID)
  }

  const stepStart4 = Date.now()
  const collectionMap = pageRecordMap.collection || {}
  const inferredCollectionId =
    Object.keys(collectionMap).length === 1 ? Object.keys(collectionMap)[0] : null
  const collectionId = rawMetadata?.collection_id || inferredCollectionId
  const rawCollection =
    collectionMap?.[collectionId] ||
    collectionMap?.[idToUuid(collectionId)] ||
    {}
  const collection = normalizeCollection(rawCollection)
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view
  const schema = normalizeSchema(collection?.schema || {})
  const viewIds = rawMetadata?.view_ids
  const collectionData = []
  const stepEnd4 = Date.now()
  console.log(`[${traceId}] ⏱ Collection 初始化耗时: ${stepEnd4 - stepStart4}ms @ ${new Date().toISOString()}`)

  // ── 获取 pageIds ──
  // const stepStart5 = Date.now()
  const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds, block)
  // const stepEnd5 = Date.now()
  // console.log(`[${traceId}] ⏱ getAllPageIds 耗时: ${stepEnd5 - stepStart5}ms, count: ${pageIds.length} @ ${new Date().toISOString()}`)

  // ── 找出需要补拉的 block ──
  // const stepStart6 = Date.now()
  const blockIdsNeedFetch = pageIds.filter(id => !normalizePageBlock(block[id]))
  // const limit = pLimit(10)
  // const idsNeedFetch = (
  //   await Promise.all(
  //     blockIdsNeedFetch.map(id =>
  //       limit(async () => {
  //         const cache = await getDataFromCache(`page_block_${id}`)
  //         return cache ? null : id
  //       })
  //     )
  //   )
  // ).filter(Boolean)
  // const stepEnd6 = Date.now()
  // console.log(`[${traceId}] ⏱ 缓存检查耗时: ${stepEnd6 - stepStart6}ms, 需补拉: ${idsNeedFetch.length} @ ${new Date().toISOString()}`)

  // ── 批量补拉 block ──
  const stepStart7 = Date.now()
  if (blockIdsNeedFetch.length > 0) {
    const fetchedBlocks = await fetchInBatches(blockIdsNeedFetch)
    const adaptedFetchedBlocks = adapterNotionBlockMap({ block: fetchedBlocks }).block
    block = { ...block, ...adaptedFetchedBlocks }
  }
  const stepEnd7 = Date.now()
  console.log(`[${traceId}] ⏱ fetchInBatches + adapter 耗时: ${stepEnd7 - stepStart7}ms @ ${new Date().toISOString()}`)

  // ── 生成 collectionData ──
  const stepStart8 = Date.now()
  for (const id of pageIds) {
    const pageBlock = normalizePageBlock(block[id])
    if (!pageBlock) continue
    // Notion升级后数据发生乱窜，意外读取到其它数据库的列表，这里筛选
    if (pageBlock.parent_id !== collectionId) continue
    const properties = (await getPageProperties(id, pageBlock, schema, null, getTagOptions(schema))) || null
    if (properties) collectionData.push(properties)
  }
  const stepEnd8 = Date.now()
  console.log(`[${traceId}] ⏱ collectionData 构建耗时: ${stepEnd8 - stepStart8}ms @ ${new Date().toISOString()}`)

  // ── 站点配置 ──
  const stepStart9 = Date.now()
  const NOTION_CONFIG = (await getConfigMapFromConfigPage(collectionData)) || {}
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[ThemeResolver][notion-config]',
      JSON.stringify({
        from,
        pageId: SITE_DATABASE_PAGE_ID,
        notionTheme: NOTION_CONFIG?.THEME || null,
        configTheme: BLOG.THEME,
        note: 'If notionTheme exists, it will override configTheme unless URL ?theme is provided.'
      })
    )
  }
  const sourcePageSlugs = getSourcePageSlugs(collectionData)
  collectionData.forEach(element => adjustPageProperties(element, NOTION_CONFIG))

  const officialMembers = await fetchMembersFromOfficialAPI({
    typeProperty: BLOG.NOTION_PROPERTY_NAME.type,
    statusProperty: BLOG.NOTION_PROPERTY_NAME.status,
    typeValue: BLOG.NOTION_PROPERTY_NAME.type_member,
    statusValue: BLOG.NOTION_PROPERTY_NAME.status_publish
  })
  if (officialMembers.length > 0) {
    const existingMembers = new Set(
      collectionData
        .filter(item => item?.type === 'Member')
        .flatMap(item => [item.id, item.slug].filter(Boolean))
    )
    officialMembers.forEach(member => {
      if (!existingMembers.has(member.id) && !existingMembers.has(member.slug)) {
        collectionData.push(member)
      }
    })
  }

  const siteInfo = getSiteInfo({ collection, block, rawMetadata, NOTION_CONFIG })
  writePwaManifest({ siteInfo, notionConfig: NOTION_CONFIG })
  const stepEnd9 = Date.now()
  console.log(`[${traceId}] ⏱ 配置站点信息耗时: ${stepEnd9 - stepStart9}ms @ ${new Date().toISOString()}`)

  // ── 筛选有效页面、排序 ──
  // const stepStart10 = Date.now()
  let postCount = 0
  let allPages = collectionData.filter(post => {
    if (post?.type === 'Post' && post.status === 'Published') postCount++
    return post?.slug && (post?.status === 'Invisible' || post?.status === 'Published')
  })
  const sortBy = siteConfig('POSTS_SORT_BY', null, NOTION_CONFIG)
  if (sortBy === 'date') {
    allPages.sort((a, b) => (b?.publishDate ?? 0) - (a?.publishDate ?? 0))
  }

  // 全局置顶：仅当开启 TOP_TAG 时，才对置顶子集做“最新更新时间倒序”重排。
  // 非置顶文章的相对顺序尽量不改变（匹配你确认的 A 行为）。
  const topTag = siteConfig('TOP_TAG', '', NOTION_CONFIG)
  if (topTag) {
    allPages = sortPinnedPostsByLatestUpdate(allPages, topTag)
  }
  // const stepEnd10 = Date.now()
  // console.log(`[${traceId}] ⏱ 筛选 + 排序 allPages 耗时: ${stepEnd10 - stepStart10}ms @ ${new Date().toISOString()}`)

  // ── 其他数据生成 ──
  const stepStart11 = Date.now()
  const notice = await getNotice(collectionData.find(post => post?.type === 'Notice' && post.status === 'Published'))
  const categoryOptions = getAllCategories({ allPages, categoryOptions: getCategoryOptions(schema) })
  const tagSchemaOptions = getTagOptions(schema)
  const tagOptions = getAllTags({ allPages, tagOptions: tagSchemaOptions ?? [], NOTION_CONFIG }) ?? null
  const customNav = getCustomNav({ allPages: collectionData.filter(post => post?.type === 'Page' && post.status === 'Published') })
  const customMenu = getCustomMenu({ collectionData, sourcePageSlugs })
  const latestPosts = getLatestPosts({
    allPages,
    from,
    latestPostCount: siteConfig('LATEST_POST_COUNT', 6, NOTION_CONFIG)
  })
  const allNavPages = getNavPages({ allPages })
  const allLinkPages = getLinkPages({ allPages })

  // ── 社区数据：Member / Event ──
  const allMembers = getAllMembers({ allPages })
  const allEvents = getAllEvents({ allPages })

  const stepEnd11 = Date.now()
  console.log(`[${traceId}] ⏱ 其他数据生成耗时: ${stepEnd11 - stepStart11}ms @ ${new Date().toISOString()}`)
  const overallEnd = Date.now()
  console.log(`[${traceId}] ✅ convertNotionToSiteData 完成，总耗时: ${overallEnd - overallStart}ms @ ${new Date().toISOString()}`)

  return {
    NOTION_CONFIG,
    notice,
    siteInfo,
    allPages,
    allMembers,
    allEvents,
    allNavPages,
    allLinkPages,
    collection,
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    block,
    schema,
    tagOptions,
    categoryOptions,
    rawMetadata,
    customNav,
    customMenu,
    postCount,
    pageIds,
    latestPosts
  }
}

/**
 * 返回给浏览器前端前的数据清理
 * 脱敏、减体积、定时发布处理
 */
function handleDataBeforeReturn(db) {
  delete db.block
  delete db.schema
  delete db.rawMetadata
  delete db.pageIds
  delete db.viewIds
  delete db.collection
  delete db.collectionQuery
  delete db.collectionId
  delete db.collectionView

  if (db?.notice) {
    db.notice = cleanNoticeForClient(db?.notice)
    delete db.notice?.id
  }

  db.categoryOptions = cleanIds(db?.categoryOptions)
  db.customMenu = cleanIds(db?.customMenu)
  db.allNavPages = shortenIds(db?.allNavPages)
  db.allLinkPages = shortenIds(db?.allLinkPages)

  // 先清理 tagOptions，再用清理后的标签集合过滤页面的 tagItems，
  // 避免页面保留对「已被 cleanTagOptions 删除的标签」的引用，导致点击 404
  db.tagOptions = cleanTagOptions(db?.tagOptions)
  db.allNavPages = cleanPages(db?.allNavPages, db.tagOptions)
  db.allLinkPages = cleanPages(db?.allLinkPages, db.tagOptions)
  db.allPages = cleanPages(db.allPages, db.tagOptions)
  db.allMembers = cleanPages(db.allMembers, db.tagOptions)
  db.allEvents = cleanPages(db.allEvents, db.tagOptions)
  db.latestPosts = cleanPostSummaries(cleanPages(db.latestPosts, db.tagOptions))

  // 定时发布：检查发布时间窗口，超出范围的隐藏
  // 仅对 Post/Page 生效，Event 和 Member 不受此限制
  const POST_SCHEDULE_PUBLISH = siteConfig(
    'POST_SCHEDULE_PUBLISH',
    null,
    db.NOTION_CONFIG
  )
  if (POST_SCHEDULE_PUBLISH) {
    db.allPages?.forEach(p => {
      if (p.type === 'Event' || p.type === 'Member') return
      if (!isInRange(p.title, p.date)) {
        console.log('[定时发布] 隐藏-->', p.title, p.date)
        p.status = 'Invisible'
      }
    })
  }

  return db
}

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

function cleanPages(allPages, tagOptions) {
  if (!Array.isArray(allPages) || !Array.isArray(tagOptions)) {
    console.warn('Invalid input: allPages and tagOptions should be arrays.')
    return allPages || []
  }
  const validTags = new Set(
    tagOptions
      .map(tag => (typeof tag.name === 'string' ? tag.name : null))
      .filter(Boolean)
  )
  allPages.forEach(page => {
    if (Array.isArray(page.tagItems)) {
      page.tagItems = page.tagItems.filter(
        tagItem => validTags.has(tagItem?.name) && typeof tagItem.name === 'string'
      )
    }
  })
  return allPages
}

function shortenIds(items) {
  if (items && Array.isArray(items)) {
    return items.map(item => {
      const { id, ...rest } = item
      return {
        ...rest,
        short_id: getShortId(id)
      }
    })
  }
  return items
}

function cleanIds(items) {
  if (items && Array.isArray(items)) {
    return items.map(({ id, ...rest }) => rest)
  }
  return items
}

function cleanTagOptions(tagOptions) {
  if (tagOptions && Array.isArray(tagOptions)) {
    return tagOptions
      .filter(tagOption => tagOption.source === 'Published')
      .map(({ id, source, ...rest }) => rest)
  }
  return tagOptions
}

function cleanBlock(item) {
  const post = deepClone(item)
  const pageBlock = post?.blockMap?.block
  if (pageBlock) {
    for (const i in pageBlock) {
      pageBlock[i] = cleanBlock(pageBlock[i])
      delete pageBlock[i]?.role
      delete pageBlock[i]?.value?.version
      delete pageBlock[i]?.value?.created_by_table
      delete pageBlock[i]?.value?.created_by_id
      delete pageBlock[i]?.value?.last_edited_by_table
      delete pageBlock[i]?.value?.last_edited_by_id
      delete pageBlock[i]?.value?.space_id
      delete pageBlock[i]?.value?.format?.copied_from_pointer
      delete pageBlock[i]?.value?.format?.block_locked_by
      delete pageBlock[i]?.value?.parent_table
      delete pageBlock[i]?.value?.copied_from_pointer
      delete pageBlock[i]?.value?.copied_from
      delete pageBlock[i]?.value?.permissions
      delete pageBlock[i]?.value?.alive
    }
  }
  return post
}

/**
 * 获取最新文章，按最后修改时间倒序
 * 修复：原代码用 Object.create(allPosts) 不是真正的数组副本，改为展开运算符
 */
function getLatestPosts({ allPages, from, latestPostCount }) {
  const allPosts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  return [...(allPosts ?? [])]
    .sort((a, b) => {
      const dateA = new Date(a?.lastEditedDate || a?.publishDate)
      const dateB = new Date(b?.lastEditedDate || b?.publishDate)
      return dateB - dateA
    })
    .slice(0, latestPostCount)
}

function getCustomNav({ allPages }) {
  const customNav = []
  if (allPages && allPages.length > 0) {
    allPages.forEach(p => {
      p.to = p.slug
      customNav.push({
        icon: p.icon || null,
        name: p.title || p.name || '',
        href: p.href,
        target: p.target,
        show: true
      })
    })
  }
  return customNav
}

function getTagOptions(schema) {
  if (!schema) return {}
  const tagSchema = Object.values(schema).find(
    e => e.name === BLOG.NOTION_PROPERTY_NAME.tags
  )
  return tagSchema?.options || []
}

function getCategoryOptions(schema) {
  if (!schema) return {}
  const categorySchema = Object.values(schema).find(
    e => e.name === BLOG.NOTION_PROPERTY_NAME.category
  )
  return categorySchema?.options || []
}

/**
 * 站点信息
 * @param notionPageData
 * @param from
 * @returns {Promise<{title,description,pageCover,icon}>}
 */
function getSiteInfo({ collection, block, rawMetadata, NOTION_CONFIG }) {
  const defaultTitle = NOTION_CONFIG?.TITLE || 'NotionNext BLOG'
  const defaultDescription =
    NOTION_CONFIG?.DESCRIPTION || '这是一个由NotionNext生成的站点'
  const defaultPageCover = NOTION_CONFIG?.HOME_BANNER_IMAGE || '/bg_image.jpg'
  const defaultIcon = NOTION_CONFIG?.AVATAR || '/avatar.svg'
  const defaultLink = NOTION_CONFIG?.LINK || BLOG.LINK

  if (!collection && !block) {
    return {
      title: defaultTitle,
      description: defaultDescription,
      pageCover: defaultPageCover,
      icon: defaultIcon,
      link: defaultLink
    }
  }

  const title = collection?.name?.[0][0] || defaultTitle
  const description = collection?.description
    ? Object.assign(collection).description[0][0]
    : defaultDescription
  // 站点封面优先级：
  // 1. 数据库 collection.cover
  // 2. 数据库页面（collection_view_page）自身的 page_cover
  // 3. HOME_BANNER_IMAGE / 默认兜底图
  const pageCover = collection?.cover
    ? mapImgUrl(collection?.cover, collection, 'collection')
    : rawMetadata?.format?.page_cover
      ? mapImgUrl(rawMetadata?.format?.page_cover, rawMetadata, 'block')
      : defaultPageCover

  let icon = compressImage(
    collection?.icon
      ? mapImgUrl(collection?.icon, collection, 'collection')
      : defaultIcon
  )
  const link = NOTION_CONFIG?.LINK || defaultLink
  const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
  if (!icon || emojiPattern.test(icon)) icon = defaultIcon

  return { title, description, pageCover, icon, link }
}

function isInRange(title, date = {}) {
  const {
    start_date,
    start_time = '00:00',
    end_date,
    end_time = '23:59',
    time_zone = 'Asia/Shanghai'
  } = date

  const currentTimestamp = Date.now()
  const startTimestamp = getTimestamp(start_date, start_time, time_zone)
  const endTimestamp = getTimestamp(end_date, end_time, time_zone)

  if (startTimestamp && currentTimestamp < startTimestamp) return false
  if (endTimestamp && currentTimestamp > endTimestamp) return false
  return true
}

function convertToUTC(dateStr, timeZone = 'Asia/Shanghai') {
  const timeZoneOffsets = {
    UTC: 0, 'Etc/GMT': 0, 'Etc/GMT+0': 0,
    'Asia/Shanghai': 8, 'Asia/Taipei': 8, 'Asia/Tokyo': 9, 'Asia/Seoul': 9,
    'Asia/Kolkata': 5.5, 'Asia/Jakarta': 7, 'Asia/Singapore': 8,
    'Asia/Hong_Kong': 8, 'Asia/Bangkok': 7, 'Asia/Dubai': 4,
    'Asia/Tehran': 3.5, 'Asia/Riyadh': 3,
    'Europe/London': 0, 'Europe/Paris': 1, 'Europe/Berlin': 1,
    'Europe/Moscow': 3, 'Europe/Amsterdam': 1,
    'America/New_York': -5, 'America/Chicago': -6, 'America/Denver': -7,
    'America/Los_Angeles': -8, 'America/Sao_Paulo': -3,
    'America/Argentina/Buenos_Aires': -3,
    'Africa/Johannesburg': 2, 'Africa/Cairo': 2, 'Africa/Nairobi': 3,
    'Australia/Sydney': 10, 'Australia/Perth': 8,
    'Pacific/Auckland': 13, 'Pacific/Fiji': 12,
    'Antarctica/Palmer': -3, 'Antarctica/McMurdo': 13
  }
  const continentDefaults = {
    Asia: 'Asia/Shanghai', Europe: 'Europe/London', America: 'America/New_York',
    Africa: 'Africa/Cairo', Australia: 'Australia/Sydney',
    Pacific: 'Pacific/Auckland', Antarctica: 'Antarctica/Palmer', UTC: 'UTC'
  }

  let offsetHours = timeZoneOffsets[timeZone]
  if (offsetHours === undefined) {
    const continent = timeZone.split('/')[0]
    const fallbackZone = continentDefaults[continent] || 'UTC'
    offsetHours = timeZoneOffsets[fallbackZone]
    console.warn(
      `Warning: Unsupported time zone "${timeZone}". Using default "${fallbackZone}".`
    )
  }

  const localDate = new Date(`${dateStr.replace(' ', 'T')}Z`)
  if (isNaN(localDate.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`)
  }
  return new Date(localDate.getTime() - offsetHours * 3600 * 1000)
}

function getTimestamp(date, time = '00:00', time_zone) {
  if (!date) return null
  return convertToUTC(`${date} ${time}:00`, time_zone).getTime()
}

export function getNavPages({ allPages }) {
  const allNavPages = allPages?.filter(
    post =>
      post &&
      post?.slug &&
      post?.type === 'Post' &&
      post?.status === 'Published'
  )
  return allNavPages.map(item => ({
    id: item.id,
    title: item.title || '',
    pageCoverThumbnail: item.pageCoverThumbnail || '',
    category: item.category || null,
    tags: item.tags || null,
    summary: item.summary || null,
    slug: item.slug,
    href: item.href,
    pageIcon: item.pageIcon || '',
    lastEditedDate: item.lastEditedDate,
    publishDate: item.publishDate,
    ext: item.ext || {}
  }))
}

/**
 * Notion content links can target both posts and standalone pages. Keep this
 * list separate from allNavPages because themes use allNavPages as a post list.
 */
export function getLinkPages({ allPages }) {
  const allLinkPages = (allPages || []).filter(
    post =>
      post &&
      post?.slug &&
      (post?.type === 'Post' || post?.type === 'Page') &&
      post?.status === 'Published'
  )
  return allLinkPages.map(item => ({
    id: item.id,
    title: item.title || '',
    type: item.type,
    slug: item.slug,
    href: item.href,
    short_id: item.short_id
  }))
}

/**
 * 获取所有已发布的社区成员
 * 从 allPages 中筛选 type=Member && status=Published 的条目
 */
export function getAllMembers({ allPages }) {
  const published = getPublishedTypedPages({ allPages, type: 'Member' })

  // 精简成员数据，只保留前端需要的字段，减少 pageProps 体积
  const slim = published.map(m => ({
    id: m.id || '',
    title: m.title || '',
    type: m.type || 'Member',
    status: m.status || 'Published',
    slug: m.slug || '',
    summary: m.summary || '',
    avatar: m.avatar || '',
    quote: m.quote || '',
    role: m.role || '',
    bio: m.bio || '',
    featured: m.featured || '',
    verified: m.verified || '',
    sortOrder: m.sortOrder ?? null,
    joinedAtText: m.joinedAtText || '',
    pageIcon: m.pageIcon || '',
    pageCoverThumbnail: m.pageCoverThumbnail || '',
    pageCover: m.pageCover || '',
    publishDate: m.publishDate ?? null
  }))

  return slim.sort((a, b) => {
    // Featured 优先
    const aFeatured = Boolean(a.featured)
    const bFeatured = Boolean(b.featured)
    if (aFeatured !== bFeatured) return bFeatured ? 1 : -1
    // Verified 优先
    const aVerified = Boolean(a.verified)
    const bVerified = Boolean(b.verified)
    if (aVerified !== bVerified) return bVerified ? 1 : -1
    // sortOrder 升序
    if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder
    // 发布时间倒序
    return (b?.publishDate ?? 0) - (a?.publishDate ?? 0)
  })
}

/**
 * 获取所有已发布的社区活动
 * 从 allPages 中筛选 type=Event && status=Published 的条目
 */
export function getAllEvents({ allPages }) {
  return sortTypedPagesByPublishDate(
    getPublishedTypedPages({ allPages, type: 'Event' })
  )
}
