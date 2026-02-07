import BLOG from '@/blog.config'
import { getOrSetDataWithCache } from '@/lib/cache/cache_manager'
import { getAllCategories } from '@/lib/notion/getAllCategories'
import getAllPageIds from '@/lib/notion/getAllPageIds'
import { getAllTags } from '@/lib/notion/getAllTags'
import { getConfigMapFromConfigPage } from '@/lib/notion/getNotionConfig'
import getPageProperties, {
  adjustPageProperties
} from '@/lib/notion/getPageProperties'
import { fetchInBatches, getPage } from '@/lib/notion/getPostBlocks'
import { compressImage, mapImgUrl } from '@/lib/notion/mapImage'
import { deepClone } from '@/lib/utils'
import { idToUuid } from 'notion-utils'
import { siteConfig } from '../config'
import { extractLangId, extractLangPrefix, getShortId } from '../utils/pageId'

export { getAllTags } from '../notion/getAllTags'
export { getPost } from '../notion/getNotionPost'
export { getPage as getPostBlocks } from '../notion/getPostBlocks'

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
  }
  return empty
}

/**
 * 可能由于Notion接口升级导致数据格式变化，这里进行统一处理
 * @param {*} block 
 * @param {*} pageId 
 * @returns 
 */
function normalizeNotionMetadata(block, pageId) {
  const rawValue = block?.[pageId]?.value
  if (!rawValue) return null
  return rawValue.type ? rawValue : rawValue.value ?? null
}

/**
 * 兼容新老 Notion collection 结构 ， 新版会用space_id 包裹一层
 * 统一返回真正的 collection.value（包含 schema 的那一层）
 */
function normalizeCollection(collection) {
  let current = collection

  // 最多剥 3 层，防止死循环
  for (let i = 0; i < 3; i++) {
    if (!current) break

    // 已经是最终形态：有 schema
    if (current.schema) {
      return current
    }

    // 常见包装：{ value: {...}, role }
    if (current.value) {
      current = current.value
      continue
    }

    break
  }

  return current ?? {}
}

/**
 * 兼容 Notion schema
 * 保留原始字段 id 作为 key
 */
/**
 * 兼容 Notion schema
 * 保留原始字段 id 作为 key
 */
function normalizeSchema(schema = {}) {
  const result = {}

  Object.entries(schema).forEach(([key, value]) => {
    result[key] = {
      ...value,
      name: value?.name || '',
      type: value?.type || ''
    }
  })

  return result
}


/**
 * ✅ 终极版：兼容 Notion 新老 Page Block 结构
 * 最终一定返回：{ id, type, properties }
 */
function normalizePageBlock(blockItem) {
  if (!blockItem) return null

  let current = blockItem

  // 最多拆 4 层，防止死循环
  for (let i = 0; i < 4; i++) {
    if (!current) return null

    // 🎯 命中目标：真正的 page block
    if (current.type === 'page' && current.properties) {
      return current
    }

    // 新版 Notion 常见包裹
    if (current.value) {
      current = current.value
      continue
    }

    break
  }

  return null
}



/**
 * 将Notion数据转站点数据
 * 这里统一对数据格式化
 * @returns {Promise<JSX.Element|null|*>}
 */
async function convertNotionToSiteData(pageId, from, pageRecordMap) {
  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', pageId)
    return {}
  }
  pageId = idToUuid(pageId)
  let block = pageRecordMap.block || {}
  const rawMetadata = normalizeNotionMetadata(block, pageId)
  // Check Type Page-Database和Inline-Database
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.error(`pageId "${pageId}" is not a database`)
    return EmptyData(pageId)
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

  const pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds
  )

  if (pageIds?.length === 0) {
    console.error(
      '获取到的文章列表为空，请检查notion模板',
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      pageRecordMap
    )
  } else {
    // console.log('有效Page数量', pageIds?.length)
  }

  // 1️⃣ 找出需要 fetch 的 block
  const blockIdsNeedFetch = []
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const pageBlock = normalizePageBlock(block[id])

    if (!pageBlock) {
      blockIdsNeedFetch.push(id)
    }
  }

  // 2️⃣ fetch 缺失的 blocks
  const fetchedBlocks = await fetchInBatches(blockIdsNeedFetch)
  block = Object.assign({}, block, fetchedBlocks)

  // 3️⃣ 只执行一次：生成 collectionData
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]

    const rawBlock = block[id]
    const pageBlock = normalizePageBlock(rawBlock)

    if (!pageBlock) {
      console.warn('⚠️ 无法解析 page block:', id, rawBlock)
      continue
    }

    const properties =
      (await getPageProperties(
        id,
        pageBlock,
        schema,
        null,
        getTagOptions(schema)
      )) || null

    if (properties) {
      collectionData.push(properties)
    }
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
  const categoryOptions = getAllCategories({
    allPages,
    categoryOptions: getCategoryOptions(schema)
  })
  // 所有标签
  const tagSchemaOptions = getTagOptions(schema)
  const tagOptions =
    getAllTags({
      allPages: allPages ?? [],
      tagOptions: tagSchemaOptions ?? [],
      NOTION_CONFIG
    }) ?? null
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

/**
 * 返回给浏览器前端的数据处理
 * 适当脱敏
 * 减少体积
 * 其它处理
 * @param {*} db
 */
function handleDataBeforeReturn(db) {
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
  db.customMenu = cleanIds(db?.customMenu)

  //   db.latestPosts = shortenIds(db?.latestPosts)
  db.allNavPages = shortenIds(db?.allNavPages)
  //   db.allPages = cleanBlocks(db?.allPages)

  db.allNavPages = cleanPages(db?.allNavPages, db.tagOptions)
  db.allPages = cleanPages(db.allPages, db.tagOptions)
  db.latestPosts = cleanPages(db.latestPosts, db.tagOptions)
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
  })

  return allPages
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
        .filter(tagOption => tagOption.source === 'Published')
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
function getSiteInfo({ collection, block, NOTION_CONFIG }) {
  const defaultTitle = NOTION_CONFIG?.TITLE || 'NotionNext BLOG'
  const defaultDescription =
    NOTION_CONFIG?.DESCRIPTION || '这是一个由NotionNext生成的站点'
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
  let offsetHours = timeZoneOffsets[timeZone]

  // 未被支持的时区采用兼容
  if (offsetHours === undefined) {
    // 获取时区所属大洲（"Continent/City" -> "Continent"）
    const continent = timeZone.split('/')[0]

    // 选择该大洲的默认时区
    const fallbackZone = continentDefaults[continent] || 'UTC'
    offsetHours = timeZoneOffsets[fallbackZone]

    console.warn(
      `Warning: Unsupported time zone "${timeZone}". Using default "${fallbackZone}" for continent "${continent}".`
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
  return convertToUTC(`${date} ${time}:00`, time_zone).getTime()
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