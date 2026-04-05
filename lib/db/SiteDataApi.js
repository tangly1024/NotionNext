import BLOG from '@/blog.config'
import { getDataFromCache, getOrSetDataWithCache } from '../cache/cache_manager'
import { getAllCategories } from '@/lib/db/notion/getAllCategories'
import getAllPageIds from '@/lib/db/notion/getAllPageIds'
import { getAllTags } from '@/lib/db/notion/getAllTags'
import { getConfigMapFromConfigPage } from '@/lib/db/notion/getNotionConfig'
import getPageProperties, {
  adjustPageProperties
} from '@/lib/db/notion/getPageProperties'
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
import { fetchPageFromNotion } from './notion/getNotionPost'
import { processPostData } from '../utils/post'
import { adapterNotionBlockMap } from '../utils/notion.util'
import pLimit from 'p-limit'

export { getAllTags } from './notion/getAllTags'
export { fetchPageFromNotion as getPost } from './notion/getNotionPost'
export { fetchNotionPageBlocks as getPostBlocks } from './notion/getPostBlocks'

// ─── 防击穿：同一个 key 只发一次请求，其余等待 ────────────────────────────────
const inflightMap = new Map()

/**
 * 获取全站数据；基于 Notion 实现
 * 支持多站点（pageId 逗号分隔）和多语言（locale 前缀）
 */
export async function fetchGlobalAllData({
  pageId = BLOG.NOTION_PAGE_ID,
  from,
  locale
}) {

  const siteIds = pageId?.split(',') || []
  let data = EmptyData(pageId)

  if (BLOG.BUNDLE_ANALYZER) {
    return data
  }

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
}

/**
 * 获取指定 Notion collection 数据
 * 带防击穿缓存：同一 pageId 并发时只发一次 API 请求
 */
export async function getSiteDataByPageId({ pageId, from }) {
  const cacheKey = `site_data_${pageId}`

  // 如果已有相同 key 的请求在飞行中，直接等它的结果
  if (inflightMap.has(cacheKey)) {
    const raw = await inflightMap.get(cacheKey)
    return convertNotionToSiteData(pageId, from, deepClone(raw))
  }

  const promise = getOrSetDataWithCache(
    cacheKey,
    async (pageId, from) => {
      return fetchNotionPageBlocks(pageId, from)
    },
    pageId,
    from
  )

  inflightMap.set(cacheKey, promise)
  promise.finally(() => inflightMap.delete(cacheKey))

  const originalPageRecordMap = await promise
  return convertNotionToSiteData(pageId, from, deepClone(originalPageRecordMap))
}

/**
 * 获取公告 block
 * 拉取后必须经过 adapter + format，否则新格式双层嵌套导致 type undefined
 */
async function getNotice(post) {
  if (!post) return null

  try {
    const rawBlockMap = await fetchNotionPageBlocks(post.id, 'data-notice')
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
  const segments = []
  if (prefix) segments.push(prefix)
  if (slug) segments.push(slug)
  if (Array.isArray(suffix)) segments.push(...suffix)

  const fullSlug = segments.join('/')
  const lastSegment = segments[segments.length - 1]
  const source = from || `slug-props-${fullSlug}`

  const props = await fetchGlobalAllData({ from: source, locale })

  let post = null

  // 1. 完整 slug 精确匹配
  if (fullSlug) {
    post = props?.allPages?.find(p => {
      if (!p || p?.type?.includes('Menu')) return false
      return p.slug === fullSlug
    })
  }

  // 2. UUID 精确匹配
  if (!post && fullSlug) {
    post = props?.allPages?.find(p => p?.id === fullSlug)
  }

  // 3. 最后一段是 UUID，直接拉 Notion
  if (
    !post &&
    typeof lastSegment === 'string' &&
    /^[a-f0-9-]{32,36}$/i.test(lastSegment)
  ) {
    try {
      post = await fetchPageFromNotion(lastSegment)
    } catch (e) {
      console.warn('[resolvePostProps] fetchPageFromNotion failed:', lastSegment, e)
    }
  }

  // 4. 拿到 post 但没有 blockMap，补拉 block
  if (post?.id && !post?.blockMap) {
    try {
      const rawBlockMap = await fetchNotionPageBlocks(post.id, source)
      const adapted = adapterNotionBlockMap(rawBlockMap)
      post.blockMap = {
        ...adapted,
        block: formatNotionBlock(adapted.block)
      }
    } catch (e) {
      console.warn('[resolvePostProps] fetchNotionPageBlocks failed:', post.id, e)
    }
  }

  if (post) {
    props.post = post
    try {
      await processPostData(props, source)
    } catch (e) {
      console.warn('[resolvePostProps] processPostData failed', e)
    }
  } else {
    props.post = null
  }

  delete props.allPages
  return props
}

/**
 * 将 Notion 原始数据转换为站点数据
 *
 * 排序策略（优先级从高到低）：
 *   1. NOTION_CONFIG.POSTS_SORT_BY === 'date'  → 按 publishDate 降序
 *   2. NOTION_CONFIG.POSTS_SORT_BY === 'notion' → 保留 page_sort 原始顺序（默认）
 *   3. 其他值 / 未配置                          → 同 'notion'，保留原始顺序
 *
 * page_sort 的顺序来自 Notion 数据库第一个视图（NOTION_INDEX）的手动排序，
 * 与 Notion 界面中拖拽调整的顺序一致。
 * 如需按视图的"排序规则"（如按字段升降序），请在 Notion 界面中改用手动排序，
 * 或在此处扩展 applySortRule() 函数。
 */
async function convertNotionToSiteData(
  SITE_DATABASE_PAGE_ID,
  from,
  pageRecordMap
) {


  const traceId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  console.log(`\n================= [TRACE START] ${traceId} =================`)
  console.log('[convert] pageId:', SITE_DATABASE_PAGE_ID)
  console.log('[convert] from:', from)


  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', SITE_DATABASE_PAGE_ID)
    return {}
  }

  SITE_DATABASE_PAGE_ID = idToUuid(SITE_DATABASE_PAGE_ID)

  // ── 原始 block，先做格式统一（兼容新旧双层嵌套）──────────────────────────
  let block = adapterNotionBlockMap({ block: pageRecordMap.block || {} }).block

  const rawMetadata = normalizeNotionMetadata(block, SITE_DATABASE_PAGE_ID)

  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.error(`pageId "${SITE_DATABASE_PAGE_ID}" is not a database`)
    return EmptyData(SITE_DATABASE_PAGE_ID)
  }

  const collectionId = rawMetadata?.collection_id
  const rawCollection =
    pageRecordMap.collection?.[collectionId] ||
    pageRecordMap.collection?.[idToUuid(collectionId)] ||
    {}

  const collection = normalizeCollection(rawCollection)
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view
  const schema = normalizeSchema(collection?.schema || {})
  const viewIds = rawMetadata?.view_ids
  const collectionData = []

  // ── 获取 pageIds（策略1 page_sort + 策略2 collectionQuery 补齐截断）────────
  const pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds,
    block
  )



  console.log(`[${traceId}] pageIds count:`, pageIds.length)

  if (pageIds?.length === 0) {
    console.error(
      '获取到的文章列表为空，请检查notion模板',
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      pageRecordMap
    )
  }

  // ── 1. 找出需要补拉的 block ───────────────────────────────────────────────
  const blockIdsNeedFetch = pageIds.filter(id => !normalizePageBlock(block[id]))

  const limit = pLimit(5)
  const idsNeedFetch = (
    await Promise.all(
      blockIdsNeedFetch.map(id =>
        limit(async () => {
          const cache = await getDataFromCache(`page_block_${id}`)
          return cache ? null : id
        })
      )
    )
  ).filter(Boolean)


  // ── 2. 批量补拉，拉回来也要 adapter ──────────────────────────────────────
  if (blockIdsNeedFetch.length > 0) {
    // 批量拉取，注意控制并发和间隔，避免对 Notion API 造成压力
    const fetchedBlocks = await fetchInBatches(idsNeedFetch)
    const adaptedFetchedBlocks = adapterNotionBlockMap({
      block: fetchedBlocks
    }).block
    block = { ...block, ...adaptedFetchedBlocks }
  }

  // console.log(`[${traceId}] initial block count:`, Object.keys(block || {}).length)

  // ── 3. 生成 collectionData，严格按 pageIds 顺序 ───────────────────────────
  for (const id of pageIds) {
    const pageBlock = normalizePageBlock(block[id])

    if (!pageBlock) continue

    const properties =
      (await getPageProperties(id, pageBlock, schema, null, getTagOptions(schema))) ||
      null

    if (properties) {
      collectionData.push(properties)
    }
  }

  // ── 站点配置 ──────────────────────────────────────────────────────────────
  const NOTION_CONFIG = (await getConfigMapFromConfigPage(collectionData)) || {}

  collectionData.forEach(element => adjustPageProperties(element, NOTION_CONFIG))

  const siteInfo = getSiteInfo({ collection, block, NOTION_CONFIG })

  // ── 筛选有效页面 ──────────────────────────────────────────────────────────
  let postCount = 0
  const allPages = collectionData.filter(post => {
    if (post?.type === 'Post' && post.status === 'Published') postCount++
    return (
      post?.slug &&
      (post?.status === 'Invisible' || post?.status === 'Published')
    )
  })

  // ── 排序 ──────────────────────────────────────────────────────────────────
  // allPages 此时已按 pageIds（page_sort）顺序排列，即 Notion 视图手动顺序
  // 仅当明确配置为 'date' 时才覆盖为日期排序
  const sortBy = siteConfig('POSTS_SORT_BY', null, NOTION_CONFIG)
  if (sortBy === 'date') {
    allPages.sort((a, b) => (b?.publishDate ?? 0) - (a?.publishDate ?? 0))
  }
  // sortBy === 'notion' 或未配置：保持 page_sort 原始顺序，不做任何处理

  // ── 其余数据 ──────────────────────────────────────────────────────────────
  const notice = await getNotice(
    collectionData.find(
      post => post?.type === 'Notice' && post.status === 'Published'
    )
  )

  const categoryOptions = getAllCategories({
    allPages,
    categoryOptions: getCategoryOptions(schema)
  })

  const tagSchemaOptions = getTagOptions(schema)
  const tagOptions =
    getAllTags({
      allPages: allPages ?? [],
      tagOptions: tagSchemaOptions ?? [],
      NOTION_CONFIG
    }) ?? null

  const customNav = getCustomNav({
    allPages: collectionData.filter(
      post => post?.type === 'Page' && post.status === 'Published'
    )
  })

  const customMenu = getCustomMenu({ collectionData, NOTION_CONFIG })
  const latestPosts = getLatestPosts({ allPages, from, latestPostCount: 6 })
  const allNavPages = getNavPages({ allPages })

  return {
    NOTION_CONFIG,
    notice,
    siteInfo,
    allPages,
    allNavPages,
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
    db.notice = cleanBlock(db?.notice)
    delete db.notice?.id
  }

  db.categoryOptions = cleanIds(db?.categoryOptions)
  db.customMenu = cleanIds(db?.customMenu)
  db.allNavPages = shortenIds(db?.allNavPages)

  db.allNavPages = cleanPages(db?.allNavPages, db.tagOptions)
  db.allPages = cleanPages(db.allPages, db.tagOptions)
  db.latestPosts = cleanPages(db.latestPosts, db.tagOptions)
  db.tagOptions = cleanTagOptions(db?.tagOptions)

  // 定时发布：检查发布时间窗口，超出范围的隐藏
  const POST_SCHEDULE_PUBLISH = siteConfig(
    'POST_SCHEDULE_PUBLISH',
    null,
    db.NOTION_CONFIG
  )
  if (POST_SCHEDULE_PUBLISH) {
    db.allPages?.forEach(p => {
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
    return deepClone(
      items.map(item => {
        item.short_id = getShortId(item.id)
        delete item.id
        return item
      })
    )
  }
  return items
}

function cleanIds(items) {
  if (items && Array.isArray(items)) {
    return deepClone(
      items.map(item => {
        delete item.id
        return item
      })
    )
  }
  return items
}

function cleanTagOptions(tagOptions) {
  if (tagOptions && Array.isArray(tagOptions)) {
    return deepClone(
      tagOptions
        .filter(tagOption => tagOption.source === 'Published')
        .map(({ id, source, ...rest }) => rest)
    )
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

function getCustomMenu({ collectionData, NOTION_CONFIG }) {
  const menuPages = collectionData.filter(
    post =>
      post.status === 'Published' &&
      (post?.type === 'Menu' || post?.type === 'SubMenu')
  )
  const menus = []
  if (menuPages && menuPages.length > 0) {
    menuPages.forEach(e => {
      e.show = true
      if (e.type === 'Menu') {
        menus.push(e)
      } else if (e.type === 'SubMenu') {
        const parentMenu = menus[menus.length - 1]
        if (parentMenu) {
          if (parentMenu.subMenus) {
            parentMenu.subMenus.push(e)
          } else {
            parentMenu.subMenus = [e]
          }
        }
      }
    })
  }
  return menus
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

function getSiteInfo({ collection, block, NOTION_CONFIG }) {
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
  const pageCover = collection?.cover
    ? mapImgUrl(collection?.cover, collection, 'collection')
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