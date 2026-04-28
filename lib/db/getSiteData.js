import BLOG from '@/blog.config'
import { getOrSetDataWithCache } from '@/lib/cache/cache_manager'
import { getAllCategories } from '@/lib/notion/getAllCategories'
import getAllPageIds from '@/lib/notion/getAllPageIds'
import { getAllTags } from '@/lib/notion/getAllTags'
import { getConfigMapFromConfigPage } from '@/lib/notion/getNotionConfig'
import notionAPI from '@/lib/notion/getNotionAPI'
import getPageProperties, {
  adjustPageProperties
} from '@/lib/notion/getPageProperties'
import { fetchInBatches, getPage } from '@/lib/notion/getPostBlocks'
import { compressImage, mapImgUrl } from '@/lib/notion/mapImage'
import { deepClone } from '@/lib/utils'
import { idToUuid } from 'notion-utils'
import { siteConfig } from '../config'
import formatDate from '../utils/formatDate'
import { extractLangId, extractLangPrefix, getShortId } from '../utils/pageId'

export { getAllTags } from '../notion/getAllTags'
export { getPost } from '../notion/getNotionPost'
export { getPage as getPostBlocks } from '../notion/getPostBlocks'

const SITE_DATA_REDIRECTS = new Map([
  ['/aboutme', '/about'],
  ['aboutme', '/about']
])

const KNOWN_BROKEN_SITE_PATHS = new Set([
  '/article/openai-sora-shutdown-10yi-lesson',
  'article/openai-sora-shutdown-10yi-lesson'
])

const MENU_PLACEHOLDER_PATHS = new Set(['#', '/#'])
const LEGACY_PUBLIC_ASSET_PATTERNS = [
  /https?:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/public(\/[^?\s]+)(\?[^#\s]*)?/i
]

/**
 * 获取博客数据; 基于Notion实现
 * @param {*} pageId
 * @param {*} from
 * @param {*} locale 语言  zh|en|jp 等等
 * @returns
 *
 */
export async function getGlobalData({
  pageId = BLOG.NOTION_PAGE_ID,
  from,
  locale
}) {
  // 获取站点数据 ， 如果pageId有逗号隔开则分次取数据
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
      // 第一个id站点默认语言
      if (index === 0 || locale === prefix) {
        data = await getSiteDataByPageId({
          pageId: id,
          from
        })
      }
    }
  } catch (error) {
    console.error('异常', error)
  }
  return handleDataBeforeReturn(deepClone(data))
}

/**
 * 获取指定notion的collection数据
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getSiteDataByPageId({ pageId, from }) {
  // 获取NOTION原始数据，此接支持mem缓存。
  return await getOrSetDataWithCache(
    `site_data_${pageId}`,
    async (pageId, from) => {
      const pageRecordMap = await getPage(pageId, from)
      return convertNotionToSiteData(pageId, from, deepClone(pageRecordMap))
    },
    pageId,
    from
  )
}

/**
 * 获取公告
 */
async function getNotice(post) {
  if (!post) {
    return null
  }

  post.blockMap = await getPage(post.id, 'data-notice')
  return post
}

/**
 * 空的默认数据
 * @param {*} pageId
 * @returns
 */
const EmptyData = pageId => {
  const empty = {
    notice: null,
    siteInfo: getSiteInfo({}),
    allPages: [
      {
        id: 'oops-page-fallback', // 使用字符串ID防止parsePageId错误
        title: `无法获取Notion数据，请检查Notion_ID： \n 当前 ${pageId}`,
        summary:
          '站点数据暂时不可用，请检查环境变量、Notion 权限和页面配置。',
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
  }
  return empty
}

/**
 * 将Notion数据转站点数据
 * 这里统一对数据格式化
 * @returns {Promise<JSX.Element|null|*>}
 */
async function convertNotionToSiteData(pageId, from, pageRecordMap) {
  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', pageId)
    return EmptyData(pageId)
  }
  pageId = idToUuid(pageId)
  let block = pageRecordMap.block || {}

  // 修复：使用block中实际存在的第一个键(可能与pageId不同)
  const actualBlockKey = Object.keys(block)[0] || pageId
  console.log('[fix] 期望的pageId:', pageId)
  console.log('[fix] block中实际的键:', actualBlockKey)
  console.log('[fix] 是否匹配:', actualBlockKey === pageId)

  // 使用实际存在的键来获取数据
  const blockItem = block[actualBlockKey]?.value
  const rawMetadata = blockItem?.value || blockItem

  console.log('[fix] 使用键', actualBlockKey, '获取到rawMetadata:', !!rawMetadata)
  console.log('[fix] rawMetadata.type:', rawMetadata?.type)

  // 获取collection数据（可能是inline database或独立database）
  const collectionItem = Object.values(pageRecordMap.collection || {})[0]
  const collection = collectionItem?.value?.value || collectionItem?.value || {}

  // 修复：从collection对象本身获取ID，而不是从rawMetadata
  // rawMetadata可能是text类型的页面，但包含inline database
  const collectionId = Object.keys(pageRecordMap.collection || {})[0] || rawMetadata?.collection_id

  console.log('[fix] collection存在:', !!collectionItem)
  console.log('[fix] collectionId:', collectionId)
  console.log('[fix] collection包含的schema键数:', Object.keys(collection?.schema || {}).length)

  // Check：如果没有collection，则返回空数据
  if (!collectionId || !collection?.schema) {
    console.error(`页面 "${pageId}" 不包含有效的collection数据`)
    console.error(`rawMetadata类型: ${rawMetadata?.type || 'undefined'}`)
    console.error(`collection存在: ${!!collectionItem}`)
    console.error(`collectionId: ${collectionId}`)
    return EmptyData(pageId)
  }
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view
  const schema = collection?.schema

  const viewIds = rawMetadata?.view_ids
  const collectionData = []

  let pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds
  )

  const collectionQueryPageIds = await queryCollectionPageIds({
    collectionId,
    collectionView,
    viewIds
  })

  if (collectionQueryPageIds.length > 0) {
    pageIds = mergePageIds(collectionQueryPageIds, pageIds)
    console.log('[回退] 使用 notion-client collection 查询补齐 pageIds:', {
      queried: collectionQueryPageIds.length,
      merged: pageIds.length
    })
  }

  console.log('[调试] pageIds数量:', pageIds?.length)
  console.log('[调试] 前5个pageIds:', pageIds?.slice(0, 5))

  if (pageIds?.length === 0) {
    console.error(
      '获取到的文章列表为空，请检查notion模板',
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      pageRecordMap
    )

    const fallbackCollectionData = await queryDatabaseItemsWithOfficialApi({
      databaseId: collectionId,
      tagOptions: getTagOptions(schema)
    })

    if (fallbackCollectionData.length > 0) {
      console.log(
        '[回退] 使用官方 Notion API 成功获取数据库条目:',
        fallbackCollectionData.length
      )
      pageIds = fallbackCollectionData.map(item => item.id)
      collectionData.push(...fallbackCollectionData)
    }
  } else {
    // console.log('有效Page数量', pageIds?.length)
  }

  if (collectionData.length === 0) {
    // 抓取主数据库最多抓取1000个blocks，溢出的数block这里统一抓取一遍
    const blockIdsNeedFetch = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const value = block[id]?.value
      if (!value) {
        blockIdsNeedFetch.push(id)
      }
    }
    const fetchedBlocks = await fetchInBatches(blockIdsNeedFetch)
    block = Object.assign({}, block, fetchedBlocks)

    console.log('[调试] 需要额外抓取的blocks数量:', blockIdsNeedFetch.length)
    console.log('[调试] 抓取成功的blocks数量:', Object.keys(fetchedBlocks).length)

    // 获取每篇文章基础数据
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]

      // 防御性检查：如果block不存在，跳过该页面（避免uuidToId(undefined)崩溃）
      if (!id || !block[id]) {
        console.warn(`[警告] 跳过无效页面: block ID为 ${id ? '有效但block不存在' : 'undefined'}`)
        continue
      }

      const blockItem = block[id]
      const value = blockItem?.value?.value || blockItem?.value

      // 二次验证：确保value存在且有效
      if (!value || !value.properties) {
        console.warn(`[警告] 跳过数据不完整的页面 ID: ${id}`)
        continue
      }

      if (i === 0) {
        console.log('[调试] 第一个block结构:')
        console.log('  - blockItem存在:', !!blockItem)
        console.log('  - blockItem keys:', blockItem ? Object.keys(blockItem) : [])
        console.log('  - value存在:', !!value)
        console.log('  - value.type:', value?.type)
        console.log('  - value.properties:', value?.properties ? Object.keys(value.properties).slice(0, 5) : [])
      }

      const properties =
        (await getPageProperties(
          id,
          value,
          schema,
          null,
          getTagOptions(schema)
        )) || null

      if (properties) {
        collectionData.push(properties)
      }
    }
  }

  // 补偿：官方 Notion API 新建的数据库条目，可能能出现在 pageIds 中，
  // 但 block 数据结构不完整，导致旧解析流程直接跳过。
  // 这里再用官方 API 查询数据库，把未成功解析的页面补进 collectionData。
  const parsedPageIdSet = new Set(
    collectionData.map(item => item?.id).filter(Boolean)
  )
  const supplementalCollectionData = await queryDatabaseItemsWithOfficialApi({
    databaseId: collectionId,
    tagOptions: getTagOptions(schema)
  })

  if (supplementalCollectionData.length > 0) {
    let supplementedCount = 0
    supplementalCollectionData.forEach(item => {
      if (!item?.id || parsedPageIdSet.has(item.id)) {
        return
      }
      collectionData.push(item)
      parsedPageIdSet.add(item.id)
      supplementedCount++
    })

    if (supplementedCount > 0) {
      console.log('[回退] 补充官方 Notion API 页面条目:', supplementedCount)
    }
  }

  console.log('[调试] collectionData总数:', collectionData.length)
  if (collectionData.length > 0) {
    const sample = collectionData[0]
    console.log('[调试] 第一篇文章样本:')
    console.log('  - title:', sample?.title)
    console.log('  - type:', sample?.type)
    console.log('  - status:', sample?.status)
    console.log('  - slug:', sample?.slug)
    console.log('  - 所有keys:', Object.keys(sample || {}).slice(0, 10))
  }

  // 站点配置优先读取配置表格，否则读取blog.config.js 文件
  const NOTION_CONFIG = (await getConfigMapFromConfigPage(collectionData)) || {}

  // 处理每一条数据的字段
  collectionData.forEach(function (element) {
    adjustPageProperties(element, NOTION_CONFIG)
  })

  // 站点基础信息
  const siteInfo = getSiteInfo({ collection, block, NOTION_CONFIG })

  // 文章计数
  let postCount = 0

  // 查找所有的Post和Page
  const allPages = collectionData.filter(post => {
    if (post?.type === 'Post' && post.status === 'Published') {
      postCount++
    }

    return (
      post &&
      post?.slug &&
      //   !post?.slug?.startsWith('http') &&
      (post?.status === 'Invisible' || post?.status === 'Published')
    )
  })

  console.log('[调试] 过滤后的allPages数量:', allPages.length)
  console.log('[调试] postCount:', postCount)
  console.log('[调试] 前3篇allPages标题:', allPages.slice(0, 3).map(p => p?.title || 'no title'))

  // Sort by date
  if (siteConfig('POSTS_SORT_BY', null, NOTION_CONFIG) === 'date') {
    allPages.sort((a, b) => {
      return b?.publishDate - a?.publishDate
    })
  }

  const notice = await getNotice(
    collectionData.filter(post => {
      return (
        post &&
        post?.type &&
        post?.type === 'Notice' &&
        post.status === 'Published'
      )
    })?.[0]
  )
  // 所有分类
  let categoryOptions = getAllCategories({
    allPages,
    categoryOptions: getCategoryOptions(schema)
  })

  // 严格清理 categoryOptions，确保没有 undefined
  categoryOptions = Array.isArray(categoryOptions)
    ? categoryOptions.filter(cat => cat && typeof cat === 'object').map(cat => ({
        id: cat.id ?? null,
        name: cat.name ?? '',
        color: cat.color ?? '',
        count: cat.count ?? 0
      }))
    : []
  // 所有标签
  const tagSchemaOptions = getTagOptions(schema)
  let tagOptions =
    getAllTags({
      allPages: allPages ?? [],
      tagOptions: tagSchemaOptions ?? [],
      NOTION_CONFIG
    }) ?? []

  // 严格清理 tagOptions，确保没有 undefined
  tagOptions = Array.isArray(tagOptions)
    ? tagOptions.filter(tag => tag && typeof tag === 'object').map(tag => ({
        id: tag.id ?? null,
        name: tag.name ?? '',
        color: tag.color ?? '',
        count: tag.count ?? 0,
        source: tag.source ?? ''
      }))
    : []
  // 旧的菜单
  const customNav = getCustomNav({
    allPages: collectionData.filter(
      post => post?.type === 'Page' && post.status === 'Published'
    )
  })
  // 新的菜单
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

async function queryDatabaseItemsWithOfficialApi({ databaseId, tagOptions }) {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey || !databaseId) {
    return []
  }

  const notionVersion = process.env.NOTION_API_VERSION || '2022-06-28'
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Notion-Version': notionVersion,
    'Content-Type': 'application/json'
  }

  const results = []
  let cursor

  try {
    do {
      const response = await fetch(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            start_cursor: cursor,
            page_size: 100
          })
        }
      )

      if (!response.ok) {
        console.error(
          '[回退] 官方 Notion API 查询失败:',
          response.status,
          await response.text()
        )
        return []
      }

      const data = await response.json()
      results.push(...(data.results || []))
      cursor = data.has_more ? data.next_cursor : null
    } while (cursor)
  } catch (error) {
    console.error('[回退] 官方 Notion API 请求异常:', error)
    return []
  }

  return results.map(page =>
    mapOfficialPageToProperties({
      page,
      tagOptions
    })
  )
}

async function queryCollectionPageIds({
  collectionId,
  collectionView,
  viewIds
}) {
  if (!collectionId || !collectionView) {
    return []
  }

  const groupIndex = Number(BLOG.NOTION_INDEX || 0)
  const preferredViewId =
    (Array.isArray(viewIds) && viewIds[groupIndex]) ||
    Object.keys(collectionView)[0]
  const rawViewRecord = preferredViewId ? collectionView?.[preferredViewId] : null
  const collectionViewValue =
    rawViewRecord?.value?.value || rawViewRecord?.value || null

  if (!preferredViewId || !collectionViewValue) {
    return []
  }

  try {
    const result = await notionAPI.getCollectionData(
      collectionId,
      preferredViewId,
      collectionViewValue,
      { limit: 1000, searchQuery: '' }
    )

    return (
      result?.result?.blockIds ||
      result?.result?.reducerResults?.collection_group_results?.blockIds ||
      []
    )
  } catch (error) {
    console.warn('[回退] notion-client collection 查询失败:', error)
    return []
  }
}

function mergePageIds(primaryIds = [], fallbackIds = []) {
  const merged = []
  const seen = new Set()

  for (const source of [primaryIds, fallbackIds]) {
    source.forEach(id => {
      if (!id || seen.has(id)) {
        return
      }
      seen.add(id)
      merged.push(id)
    })
  }

  return merged
}

function mapOfficialPageToProperties({ page, tagOptions }) {
  const fields = BLOG.NOTION_PROPERTY_NAME
  const properties = page?.properties || {}

  const tags = getOfficialMultiSelect(properties[fields.tags])
  const publishDateSource = properties[fields.date]?.date?.start || page.created_time
  const publishDate = new Date(publishDateSource).getTime()
  const lastEditedDate = new Date(page.last_edited_time)

  return {
    id: page.id,
    title: getOfficialPlainText(properties[fields.title]),
    summary: getOfficialPlainText(properties[fields.summary]),
    slug: getOfficialPlainText(properties[fields.slug]),
    password: getOfficialPlainText(properties[fields.password]),
    icon: getOfficialPlainText(properties[fields.icon]),
    type: properties[fields.type]?.select?.name || '',
    status: properties[fields.status]?.select?.name || '',
    category: properties[fields.category]?.select?.name || '',
    tags,
    date: mapOfficialDate(properties[fields.date]?.date),
    publishDate,
    publishDay: formatDate(publishDate, BLOG.LANG),
    lastEditedDate,
    lastEditedDay: formatDate(lastEditedDate, BLOG.LANG),
    fullWidth: false,
    pageIcon: mapOfficialIcon(page.icon),
    pageCover: mapOfficialCover(page.cover),
    pageCoverThumbnail: mapOfficialCover(page.cover),
    ext: {},
    tagItems: tags.map(tag => ({
      name: tag,
      color: tagOptions?.find(option => option.value === tag)?.color || 'gray'
    }))
  }
}

function getOfficialPlainText(property) {
  if (!property) {
    return ''
  }

  if (property.type === 'title') {
    return property.title?.map(item => item.plain_text).join('') || ''
  }

  if (property.type === 'rich_text') {
    return property.rich_text?.map(item => item.plain_text).join('') || ''
  }

  return ''
}

function getOfficialMultiSelect(property) {
  if (!property || property.type !== 'multi_select') {
    return []
  }

  return property.multi_select?.map(item => item.name).filter(Boolean) || []
}

function mapOfficialDate(dateProperty) {
  if (!dateProperty?.start) {
    return {}
  }

  return {
    start_date: dateProperty.start,
    end_date: dateProperty.end || null,
    time_zone: dateProperty.time_zone || null
  }
}

function mapOfficialCover(cover) {
  if (!cover) {
    return ''
  }

  if (cover.type === 'external') {
    return cover.external?.url || ''
  }

  if (cover.type === 'file') {
    return cover.file?.url || ''
  }

  return ''
}

function mapOfficialIcon(icon) {
  if (!icon) {
    return ''
  }

  if (icon.type === 'external') {
    return icon.external?.url || ''
  }

  if (icon.type === 'file') {
    return icon.file?.url || ''
  }

  return ''
}

/**
 * 返回给浏览器前端的数据处理
 * 适当脱敏
 * 减少体积
 * 其它处理
 * @param {*} db
 */
function handleDataBeforeReturn(db) {
  if ((!Array.isArray(db?.tagOptions) || db.tagOptions.length === 0) && Array.isArray(db?.allPages)) {
    db.tagOptions = rebuildTagOptionsFromPages(db.allPages)
  }

  // 清理多余数据
  delete db.block
  delete db.schema
  delete db.rawMetadata
  delete db.pageIds
  delete db.viewIds
  delete db.collection
  delete db.collectionQuery
  delete db.collectionId
  delete db.collectionView

  // 清理多余的块
  if (db?.notice) {
    db.notice = cleanBlock(db?.notice)
    delete db.notice?.id
  }
  db.categoryOptions = cleanIds(db?.categoryOptions)
  db.customMenu = sanitizeMenuItems(cleanIds(db?.customMenu))

  //   db.latestPosts = shortenIds(db?.latestPosts)
  db.allNavPages = shortenIds(db?.allNavPages)
  //   db.allPages = cleanBlocks(db?.allPages)

  db.allNavPages = cleanPages(db?.allNavPages, db.tagOptions).filter(
    page => !isBrokenSiteDataPath(page?.href || page?.slug)
  )
  db.allPages = cleanPages(db.allPages, db.tagOptions)
  db.latestPosts = cleanPages(db.latestPosts, db.tagOptions).filter(
    page => !isBrokenSiteDataPath(page?.href || page?.slug)
  )
  // 必须在使用完毕后才能进行清理
  db.tagOptions = cleanTagOptions(db?.tagOptions)

  const POST_SCHEDULE_PUBLISH = siteConfig(
    'POST_SCHEDULE_PUBLISH',
    null,
    db.NOTION_CONFIG
  )
  if (POST_SCHEDULE_PUBLISH) {
    //   console.log('[定时发布] 开启检测')
    db.allPages?.forEach(p => {
      // 新特性，判断文章的发布和下架时间，如果不在有效期内则进行下架处理
      const publish = isInRange(p.title, p.date)
      if (!publish) {
        const currentTimestamp = Date.now()
        const startTimestamp = getTimestamp(
          p.date.start_date,
          p.date.start_time || '00:00',
          p.date.time_zone
        )
        const endTimestamp = getTimestamp(
          p.date.end_date,
          p.date.end_time || '23:59',
          p.date.time_zone
        )
        console.log(
          '[定时发布] 隐藏--> 文章:',
          p.title,
          '当前时间戳:',
          currentTimestamp,
          '目标时间戳:',
          startTimestamp,
          '-',
          endTimestamp
        )
        console.log(
          '[定时发布] 隐藏--> 文章:',
          p.title,
          '当前时间:',
          new Date(),
          '目标时间:',
          p.date
        )
        // 隐藏
        p.status = 'Invisible'
      }
    })
  }

  return db
}

function rebuildTagOptionsFromPages(allPages = []) {
  const tags = new Map()

  allPages.forEach(page => {
    if (page?.type !== 'Post' || page?.status !== 'Published') {
      return
    }

    const pageTags = Array.isArray(page.tags) ? page.tags : []
    pageTags.forEach(tagName => {
      if (!tagName) {
        return
      }

      const existing = tags.get(tagName)
      const color =
        page.tagItems?.find(tag => tag?.name === tagName)?.color || 'gray'

      if (existing) {
        existing.count += 1
        return
      }

      tags.set(tagName, {
        name: tagName,
        color,
        count: 1,
        source: 'Published'
      })
    })
  })

  return Array.from(tags.values()).sort((a, b) => b.count - a.count)
}

/**
 * 处理文章列表中的异常数据
 * @param {Array} allPages - 所有页面数据
 * @param {Array} tagOptions - 标签选项
 * @returns {Array} 处理后的 allPages
 */
function cleanPages(allPages, tagOptions) {
  // 校验参数是否为数组
  if (!Array.isArray(allPages) || !Array.isArray(tagOptions)) {
    console.warn('Invalid input: allPages and tagOptions should be arrays.')
    return allPages || [] // 返回空数组或原始值
  }

  // 提取 tagOptions 中所有合法的标签名
  const validTags = new Set(
    tagOptions
      .map(tag => (typeof tag.name === 'string' ? tag.name : null))
      .filter(Boolean) // 只保留合法的字符串
  )

  // 遍历所有的 pages
  allPages.forEach(page => {
    // 确保 tagItems 是数组
    if (Array.isArray(page.tagItems)) {
      // 对每个 page 的 tagItems 进行过滤
      page.tagItems = page.tagItems.filter(
        tagItem =>
          validTags.has(tagItem?.name) && typeof tagItem.name === 'string' // 校验 tagItem.name 是否是字符串
      )
    }

    // 统一改写历史仓库里的 public 静态资源地址，避免前台继续暴露旧仓库路径
    page.pageCoverThumbnail = rewriteLegacyPublicAssetUrl(page.pageCoverThumbnail)
    page.pageCover = rewriteLegacyPublicAssetUrl(page.pageCover)
    page.pageIcon = rewriteLegacyPublicAssetUrl(page.pageIcon)

    // 确保图片相关字段不为 undefined，避免 JSON 序列化错误
    if (page.pageCoverThumbnail === undefined) {
      page.pageCoverThumbnail = ''
    }
    if (page.pageCover === undefined) {
      page.pageCover = ''
    }
    if (page.pageIcon === undefined) {
      page.pageIcon = ''
    }

    // 确保 href 字段不为 undefined，避免 Link 组件报错
    if (page.href === undefined || page.href === null) {
      page.href = page.slug || `/${page.id}` || '/'
    }

    page.href = sanitizeSiteDataPath(page.href)
    if (typeof page.slug === 'string') {
      page.slug = sanitizeSiteDataPath(page.slug)
    }
  })

  return allPages
}

function rewriteLegacyPublicAssetUrl(value) {
  if (typeof value !== 'string' || !value) {
    return value
  }

  for (const pattern of LEGACY_PUBLIC_ASSET_PATTERNS) {
    const match = value.match(pattern)
    if (match) {
      const assetPath = match[1]
      const query = match[2] || ''
      return `${assetPath}${query}`
    }
  }

  return value
}

function sanitizeSiteDataPath(value) {
  if (typeof value !== 'string' || !value) {
    return value
  }

  const trimmed = value.trim()
  return SITE_DATA_REDIRECTS.get(trimmed) || trimmed
}

function isBrokenSiteDataPath(value) {
  if (typeof value !== 'string' || !value) {
    return false
  }

  return KNOWN_BROKEN_SITE_PATHS.has(value.trim())
}

function sanitizeMenuItems(items) {
  if (!Array.isArray(items)) {
    return items || []
  }

  return items
    .map(item => {
      const next = { ...item }
      if (typeof next.href === 'string') {
        next.href = sanitizeSiteDataPath(next.href)
      }
      if (typeof next.slug === 'string') {
        next.slug = sanitizeSiteDataPath(next.slug)
      }
      if (Array.isArray(next.subMenus)) {
        next.subMenus = sanitizeMenuItems(next.subMenus)
      }
      const href = typeof next.href === 'string' ? next.href.trim() : ''
      const hasSubMenus = Array.isArray(next.subMenus) && next.subMenus.length > 0
      const isInternalLink = href.startsWith('/') && !href.startsWith('//')

      if (hasSubMenus && MENU_PLACEHOLDER_PATHS.has(href)) {
        delete next.href
      }

      if (isInternalLink || (hasSubMenus && !href)) {
        next.target = '_self'
      }
      return next
    })
    .filter(item => !isBrokenSiteDataPath(item?.href || item?.slug))
}

/**
 * 清理一组数据的id
 * @param {*} items
 * @returns
 */
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

/**
 * 清理一组数据的id
 * @param {*} items
 * @returns
 */
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

/**
 * 清理和过滤tagOptions
 * @param {*} tagOptions
 * @returns
 */
function cleanTagOptions(tagOptions) {
  if (tagOptions && Array.isArray(tagOptions)) {
    return deepClone(
      tagOptions
        // Some call sites may already have stripped `source`; keep those tags
        // instead of collapsing the entire tag index to an empty array.
        .filter(
          tagOption =>
            tagOption.source === undefined || tagOption.source === 'Published'
        )
        .map(({ id, source, ...newTagOption }) => newTagOption)
    )
  }
  return tagOptions
}

/**
 * 清理block数据
 */
function cleanBlock(item) {
  const post = deepClone(item)
  const pageBlock = post?.blockMap?.block
  //   delete post?.id
  //   delete post?.blockMap?.collection

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
      delete pageBlock[i]?.value?.version
      delete pageBlock[i]?.value?.format?.copied_from_pointer
      delete pageBlock[i]?.value?.format?.block_locked_by
      delete pageBlock[i]?.value?.parent_table
      delete pageBlock[i]?.value?.copied_from_pointer
      delete pageBlock[i]?.value?.copied_from
      delete pageBlock[i]?.value?.created_by_table
      delete pageBlock[i]?.value?.created_by_id
      delete pageBlock[i]?.value?.last_edited_by_table
      delete pageBlock[i]?.value?.last_edited_by_id
      delete pageBlock[i]?.value?.permissions
      delete pageBlock[i]?.value?.alive
    }
  }
  return post
}

/**
 * 获取最新文章 根据最后修改时间倒序排列
 * @param {*}} param0
 * @returns
 */
function getLatestPosts({ allPages, from, latestPostCount }) {
  const allPosts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )

  const latestPosts = Object.create(allPosts).sort((a, b) => {
    const dateA = new Date(a?.lastEditedDate || a?.publishDate)
    const dateB = new Date(b?.lastEditedDate || b?.publishDate)
    return dateB - dateA
  })
  return latestPosts.slice(0, latestPostCount)
}

/**
 * 获取用户自定义单页菜单
 * 旧版本，不读取Menu菜单，而是读取type=Page生成菜单
 * @param notionPageData
 * @returns {Promise<[]|*[]>}
 */
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

/**
 * 获取自定义菜单
 * @param {*} allPages
 * @returns
 */
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

/**
 * 获取标签选项
 * @param schema
 * @returns {undefined}
 */
function getTagOptions(schema) {
  if (!schema) return {}
  const tagSchema = Object.values(schema).find(
    e => e.name === BLOG.NOTION_PROPERTY_NAME.tags
  )
  return tagSchema?.options || []
}

/**
 * 获取分类选项
 * @param schema
 * @returns {{}|*|*[]}
 */
function getCategoryOptions(schema) {
  if (!schema) return []  // 返回空数组而不是空对象
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
function getSiteInfo({ collection, block, NOTION_CONFIG }) {
  const defaultTitle = NOTION_CONFIG?.TITLE || 'CharliiAI'
  const defaultDescription =
    NOTION_CONFIG?.DESCRIPTION || 'CharliiAI 的 AI 工具、研究与实用内容站点。'
  const defaultPageCover = NOTION_CONFIG?.HOME_BANNER_IMAGE || '/bg_image.jpg'
  const defaultIcon = NOTION_CONFIG?.AVATAR || '/avatar.svg'
  const defaultLink = NOTION_CONFIG?.LINK || BLOG.LINK
  // 空数据的情况返回默认值
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

  // 用户头像压缩一下
  let icon = compressImage(
    collection?.icon
      ? mapImgUrl(collection?.icon, collection, 'collection')
      : defaultIcon
  )
  // 站点网址
  const link = NOTION_CONFIG?.LINK || defaultLink

  // 站点图标不能是emoji
  const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
  if (!icon || emojiPattern.test(icon)) {
    icon = defaultIcon
  }
  return { title, description, pageCover, icon, link }
}

/**
 * 判断文章是否在发布时间内
 * @param {string} title - 文章标题
 * @param {Object} date - 时间范围参数
 * @param {string} date.start_date - 开始日期（格式：YYYY-MM-DD）
 * @param {string} date.start_time - 开始时间（可选，格式：HH:mm）
 * @param {string} date.end_date - 结束日期（格式：YYYY-MM-DD）
 * @param {string} date.end_time - 结束时间（可选，格式：HH:mm）
 * @param {string} date.time_zone - 时区（IANA格式，如 "Asia/Shanghai"）
 * @returns {boolean} 是否在范围内
 */
function isInRange(title, date = {}) {
  const {
    start_date,
    start_time = '00:00',
    end_date,
    end_time = '23:59',
    time_zone = 'Asia/Shanghai'
  } = date

  // 获取当前时间的时间戳（基于目标时区）
  const currentTimestamp = Date.now()

  // 获取开始和结束时间的时间戳
  const startTimestamp = getTimestamp(start_date, start_time, time_zone)
  const endTimestamp = getTimestamp(end_date, end_time, time_zone)

  // 判断是否在范围内
  if (startTimestamp && currentTimestamp < startTimestamp) {
    return false
  }

  if (endTimestamp && currentTimestamp > endTimestamp) {
    return false
  }

  return true
}

/**
 * 将指定时区的日期字符串转换为 UTC 时间
 * @param {string} dateStr - 日期字符串，格式为 YYYY-MM-DD HH:mm:ss
 * @param {string} timeZone - 时区名称（如 "Asia/Shanghai"）
 * @returns {Date} - 转换后的 Date 对象（UTC 时间）
 */
function convertToUTC(dateStr, timeZone = 'Asia/Shanghai') {
  const normalizedTimeZone =
    typeof timeZone === 'string' && timeZone.trim()
      ? timeZone.trim()
      : 'Asia/Shanghai'

  // 维护一个时区偏移映射（以小时为单位）
  const timeZoneOffsets = {
    // UTC 基础
    UTC: 0,
    'Etc/GMT': 0,
    'Etc/GMT+0': 0,

    // 亚洲地区
    'Asia/Shanghai': 8, // 中国
    'Asia/Taipei': 8, // 台湾
    'Asia/Tokyo': 9, // 日本
    'Asia/Seoul': 9, // 韩国
    'Asia/Kolkata': 5.5, // 印度
    'Asia/Jakarta': 7, // 印尼
    'Asia/Singapore': 8, // 新加坡
    'Asia/Hong_Kong': 8, // 香港
    'Asia/Bangkok': 7, // 泰国
    'Asia/Dubai': 4, // 阿联酋
    'Asia/Tehran': 3.5, // 伊朗
    'Asia/Riyadh': 3, // 沙特阿拉伯

    // 欧洲地区
    'Europe/London': 0, // 英国（GMT）
    'Europe/Paris': 1, // 法国（CET）
    'Europe/Berlin': 1, // 德国
    'Europe/Moscow': 3, // 俄罗斯
    'Europe/Amsterdam': 1, // 荷兰

    // 美洲地区
    'America/New_York': -5, // 美国东部（EST）
    'America/Chicago': -6, // 美国中部（CST）
    'America/Denver': -7, // 美国山区时间（MST）
    'America/Los_Angeles': -8, // 美国西部（PST）
    'America/Sao_Paulo': -3, // 巴西
    'America/Argentina/Buenos_Aires': -3, // 阿根廷

    // 非洲地区
    'Africa/Johannesburg': 2, // 南非
    'Africa/Cairo': 2, // 埃及
    'Africa/Nairobi': 3, // 肯尼亚

    // 大洋洲地区
    'Australia/Sydney': 10, // 澳大利亚东部
    'Australia/Perth': 8, // 澳大利亚西部
    'Pacific/Auckland': 13, // 新西兰
    'Pacific/Fiji': 12, // 斐济

    // 北极与南极
    'Antarctica/Palmer': -3, // 南极洲帕尔默
    'Antarctica/McMurdo': 13 // 南极洲麦克默多
  }

  // 预设每个大洲的默认时区
  const continentDefaults = {
    Asia: 'Asia/Shanghai',
    Europe: 'Europe/London',
    America: 'America/New_York',
    Africa: 'Africa/Cairo',
    Australia: 'Australia/Sydney',
    Pacific: 'Pacific/Auckland',
    Antarctica: 'Antarctica/Palmer',
    UTC: 'UTC'
  }

  // 获取目标时区的偏移量（以小时为单位）
  let offsetHours = timeZoneOffsets[normalizedTimeZone]

  // 未被支持的时区采用兼容
  if (offsetHours === undefined) {
    // 获取时区所属大洲（"Continent/City" -> "Continent"）
    const continent = normalizedTimeZone.split('/')[0]

    // 选择该大洲的默认时区
    const fallbackZone = continentDefaults[continent] || 'UTC'
    offsetHours = timeZoneOffsets[fallbackZone]

    console.warn(
      `Warning: Unsupported time zone "${normalizedTimeZone}". Using default "${fallbackZone}" for continent "${continent}".`
    )
  }

  // 将日期字符串转换为本地时间的 Date 对象
  const localDate = new Date(`${dateStr.replace(' ', 'T')}Z`)
  if (isNaN(localDate.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`)
  }

  // 计算 UTC 时间的时间戳
  const utcTimestamp = localDate.getTime() - offsetHours * 60 * 60 * 1000
  return new Date(utcTimestamp)
}

// 辅助函数：生成指定日期时间的时间戳（基于目标时区）
function getTimestamp(date, time = '00:00', time_zone) {
  if (!date) return null
  return convertToUTC(`${date} ${time}:00`, time_zone || 'Asia/Shanghai').getTime()
}

/**
 * 获取导航用的精减文章列表
 * gitbook主题用到，只保留文章的标题分类标签分类信息，精减掉摘要密码日期等数据
 * 导航页面的条件，必须是Posts
 * @param {*} param0
 */
export function getNavPages({ allPages }) {
  const allNavPages = allPages?.filter(post => {
    return (
      post &&
      post?.slug &&
      post?.type === 'Post' &&
      post?.status === 'Published'
    )
  })

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
