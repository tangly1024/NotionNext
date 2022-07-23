import BLOG from '@/blog.config'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { getPostBlocks } from '@/lib/notion/getPostBlocks'
import { idToUuid } from 'notion-utils'
import { defaultMapImageUrl } from 'react-notion-x'
import { deepClone, isIterable } from '../utils'
import getAllPageIds from './getAllPageIds'
import { getAllTags } from './getAllTags'
import getPageProperties from './getPageProperties'

/**
 * 获取博客数据
 * @param {*} pageId
 * @param {*} from
 * @param latestPostCount 截取最新文章数量
 * @param categoryCount
 * @param tagsCount 截取标签数量
 * @param pageType 过滤的文章类型，数组格式 ['Page','Post']
 * @returns
 *
 */
export async function getGlobalNotionData({
  pageId = BLOG.NOTION_PAGE_ID,
  from,
  pageType = ['Post']
}) {
  // 获取Notion数据
  const notionPageData = deepClone(await getNotionPageData({ pageId, from }))
  delete notionPageData.block
  delete notionPageData.collection
  delete notionPageData.collectionQuery
  delete notionPageData.schema
  delete notionPageData.rawMetadata
  delete notionPageData.pageIds
  delete notionPageData.tagOptions
  delete notionPageData.categoryOptions
  return notionPageData
}

/**
 * 获取最新文章 根据最后修改时间倒序排列
 * @param {*}} param0
 * @returns
 */
function getLatestPosts({ allPosts, from, latestPostCount }) {
  const latestPosts = Object.create(allPosts).sort((a, b) => {
    const dateA = new Date(a?.lastEditedTime || a?.createdTime || a?.date?.start_date)
    const dateB = new Date(b?.lastEditedTime || b?.createdTime || b?.date?.start_date)
    return dateB - dateA
  })
  return latestPosts.slice(0, latestPostCount)
}

/**
 * 获取指定notion的collection数据
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getNotionPageData({ pageId, from }) {
  // 尝试从缓存获取
  const cacheKey = 'page_block_' + pageId
  const data = await getDataFromCache(cacheKey)
  if (data && data.pageIds?.length > 0) {
    console.log('[命中缓存]:', `from:${from}`, `root-page-id:${pageId}`)
    return data
  }
  const pageRecordMap = await getPageRecordMapByNotionAPI({ pageId, from })
  // 存入缓存
  if (pageRecordMap) {
    await setDataToCache(cacheKey, pageRecordMap)
  }
  return pageRecordMap
}

/**
 * 获取用户自定义单页菜单
 * @param notionPageData
 * @returns {Promise<[]|*[]>}
 */
function getCustomNav({ allPages }) {
  const customNav = []
  if (allPages && allPages.length > 0) {
    allPages.forEach(p => {
      if (p?.status?.[0] === 'Published') {
        if (p?.slug?.indexOf('http') === 0) {
          customNav.push({ icon: p.icon || null, name: p.title, to: p.slug, show: true })
        } else {
          customNav.push({ icon: p.icon || null, name: p.title, to: '/' + p.slug, show: true })
        }
      }
    })
  }
  return customNav
}

/**
 * 获取标签选项
 * @param schema
 * @returns {undefined}
 */
function getTagOptions(schema) {
  if (!schema) return {}
  const tagSchema = Object.values(schema).find(e => e.name === 'tags')
  return tagSchema?.options || []
}

/**
 * 获取分类选项
 * @param schema
 * @returns {{}|*|*[]}
 */
function getCategoryOptions(schema) {
  if (!schema) return {}
  const categorySchema = Object.values(schema).find(e => e.name === 'category')
  return categorySchema?.options || []
}

/**
 * 获取所有文章的分类
 * @param allPosts
 * @returns {Promise<{}|*[]>}
 */
function getAllCategories({ allPosts, categoryOptions, sliceCount = 0 }) {
  if (!allPosts || !categoryOptions) {
    return []
  }
  // 计数
  let categories = allPosts.map(p => p.category)
  categories = [...categories.flat()]
  const categoryObj = {}
  categories.forEach(category => {
    if (category in categoryObj) {
      categoryObj[category]++
    } else {
      categoryObj[category] = 1
    }
  })
  const list = []
  if (isIterable(categoryOptions)) {
    for (const c of categoryOptions) {
      const count = categoryObj[c.value]
      if (count) {
        list.push({ id: c.id, name: c.value, color: c.color, count })
      }
    }
  }

  // 按照数量排序
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount)
  } else {
    return list
  }
}

/**
 * 站点信息
 * @param notionPageData
 * @param from
 * @returns {Promise<{title,description,pageCover,icon}>}
 */
function getBlogInfo({ collection, block }) {
  const title = collection?.name?.[0][0] || BLOG.TITLE
  const description = collection?.description ? Object.assign(collection).description[0][0] : BLOG.DESCRIPTION
  const pageCover = collection?.cover ? (mapImgUrl(collection?.cover, block[idToUuid(BLOG.NOTION_PAGE_ID)]?.value)) : BLOG.HOME_BANNER_IMAGE
  const icon = collection?.icon ? (mapCollectionImg(collection?.icon, collection)) : BLOG.AVATAR
  return { title, description, pageCover, icon }
}

/**
 * Notion图片映射
 * @param pageCover
 * @returns {string}
 */
const mapImgUrl = (img, value) => {
  if (img) {
    if (img.startsWith('/')) return 'https://www.notion.so' + img
    if (img.startsWith('http')) return defaultMapImageUrl(img, value)
  }
}

/**
 * collection 图片映射
 * @param {*} img
 * @param {*} value
 * @returns
 */
const mapCollectionImg = (img, value) => {
  if (img) {
    if (img.startsWith('/')) return 'https://www.notion.so' + img
    if (img.startsWith('http')) {
      return 'https://www.notion.so/image/' + encodeURIComponent(img) + '?table=collection&id=' + value.id
    }
    // 判断是否含有emoji表情
    const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
    if (emojiPattern.test(img)) {
      console.error('请不要使用emoji作为站点图标', img)
      return BLOG.AVATAR
    }

    console.error('非法的站点图标', img)
    return BLOG.AVATAR
  }
}

/**
 * 调用NotionAPI获取Page数据
 * @returns {Promise<JSX.Element|null|*>}
 */
async function getPageRecordMapByNotionAPI({ pageId, from }) {
  const pageRecordMap = await getPostBlocks(pageId, from)
  if (!pageRecordMap) {
    return []
  }
  pageId = idToUuid(pageId)
  const block = pageRecordMap.block
  const rawMetadata = block[pageId]?.value
  // Check Type Page-Database和Inline-Database
  if (
    rawMetadata?.type !== 'collection_view_page' &&
            rawMetadata?.type !== 'collection_view'
  ) {
    console.warn(`pageId "${pageId}" is not a database`)
    return null
  }

  const collection = Object.values(pageRecordMap.collection)[0]?.value
  const collectionId = rawMetadata?.collection_id
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view
  const schema = collection?.schema
  const tagOptions = getTagOptions(schema)
  const categoryOptions = getCategoryOptions(schema)
  const viewIds = rawMetadata?.view_ids
  const collectionData = []
  const pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds)
  const siteInfo = getBlogInfo({ collection, block })
  if (pageIds?.length === 0) {
    console.error('获取到的文章列表为空，请检查notion模板', collectionQuery, collection, collectionView, viewIds, pageRecordMap)
  }
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const value = block[id]?.value
    if (!value) {
      continue
    }
    const properties = (await getPageProperties(id, block, schema, null, tagOptions, siteInfo)) || null
    if (properties) {
      collectionData.push(properties)
    }
  }

  const allPages = collectionData.filter(post => {
    return post.title && ['Page'].indexOf(post?.type?.[0]) > -1 && (post?.status?.[0] === 'Published' || post?.status?.[0] === 'Invisible')
  })
  const allPosts = collectionData.filter(post => {
    return post.title && ['Post'].indexOf(post?.type?.[0]) > -1 && post?.status?.[0] === 'Published'
  })

  // Sort by date
  if (BLOG.POSTS_SORT_BY === 'date') {
    allPosts.sort((a, b) => {
      const dateA = new Date(a?.date?.start_date || a.createdTime)
      const dateB = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })
  }

  const customNav = getCustomNav({ allPages })
  const postCount = allPosts?.length || 0
  const categories = getAllCategories({ allPosts, categoryOptions, sliceCount: BLOG.PREVIEW_CATEGORY_COUNT })
  const tags = getAllTags({ allPosts, tagOptions, sliceCount: BLOG.PREVIEW_TAG_COUNT })
  const latestPosts = getLatestPosts({ allPosts, from, latestPostCount: 5 })

  return {
    siteInfo,
    allPages,
    allPosts,
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
    postCount,
    pageIds,
    categories,
    tags,
    latestPosts
  }
}
