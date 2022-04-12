import BLOG from '@/blog.config'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { getPostBlocks } from '@/lib/notion/getPostBlocks'
import { idToUuid } from 'notion-utils'
import { defaultMapImageUrl } from 'react-notion-x'
import { getAllCategories } from './getAllCategories'
import { getAllPosts, getAllPostCount } from './getAllPosts'
import { getAllTags } from './getAllTags'

/**
 * 获取博客数据
 * @param {*} pageId
 * @param {*} from
 * @param latestPostCount 截取最新文章数量
 * @param categoryCount
 * @param tagsCount 截取标签数量
 * @param pageType 过滤的文章类型，数组格式 ['Page','Post']
 * @returns {
    allPosts,   所有博客
    latestPosts,
    categories, 所有分类
    postCount,
    customNav, 自定义导航菜单
    tags, 所有标签
    siteInfo:{
      title,
      description,
      pageCover
    }
  }
 *
 */
export async function getGlobalNotionData({
  pageId = BLOG.NOTION_PAGE_ID,
  from,
  latestPostCount = 5,
  categoryCount = BLOG.PREVIEW_CATEGORY_COUNT,
  tagsCount = BLOG.PREVIEW_TAG_COUNT,
  pageType = ['Post']
}) {
  const notionPageData = await getNotionPageData({ pageId, from })
  const siteInfo = await getBlogInfo({ notionPageData, from })
  const tagOptions = notionPageData.tagOptions
  const categoryOptions = notionPageData.categoryOptions
  const customNav = await getCustomNav({ notionPageData })
  const allPosts = await getAllPosts({ notionPageData, from, pageType })
  const postCount = await getAllPostCount({ notionPageData, from })
  const categories = await getAllCategories({ allPosts, categoryOptions, sliceCount: categoryCount })
  const tags = await getAllTags({ allPosts, tagOptions, sliceCount: tagsCount })
  const latestPosts = await getLatestPosts({ notionPageData, from, latestPostCount })
  return { allPosts, latestPosts, categories, postCount, customNav, tags, siteInfo }
}

/**
 * 获取最新文章 根据最后修改时间倒序排列
 * @param {*}} param0
 * @returns
 */
async function getLatestPosts({ notionPageData, from, latestPostCount }) {
  const allPosts = await getAllPosts({ notionPageData, from, pageType: ['Post'] })
  const latestPosts = Object.create(allPosts).sort((a, b) => {
    const dateA = new Date(a?.lastEditedTime || a?.createdTime || a?.date?.start_date)
    const dateB = new Date(b?.lastEditedTime || b?.createdTime || b?.date?.start_date)
    // const dateA = new Date(a.date?.start_date)
    // const dateB = new Date(b.date?.start_date)
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
  if (data) {
    console.log('[请求缓存]:', `from:${from}`, `id:${pageId}`)
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
async function getCustomNav({ notionPageData }) {
  if (!notionPageData) {
    notionPageData = await getNotionPageData({ from: 'custom-nav' })
  }
  if (!notionPageData) {
    return []
  }
  const allPage = await getAllPosts({ notionPageData, from: 'custom-nav', pageType: ['Page'] })
  const customNav = []
  if (allPage && allPage.length > 0) {
    allPage.forEach(p => {
      if (p?.slug?.indexOf('http') === 0) {
        customNav.push({ icon: p.icon || null, name: p.title, to: p.slug, show: true })
      } else {
        customNav.push({ icon: p.icon || null, name: p.title, to: '/' + p.slug, show: true })
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
 * 站点信息
 * @param notionPageData
 * @param from
 * @returns {Promise<{title,description,pageCover}>}
 */
async function getBlogInfo({ notionPageData, from }) {
  if (!notionPageData) {
    notionPageData = await getNotionPageData({ from })
  }
  if (!notionPageData) {
    return null
  }
  const collection = notionPageData?.collection
  const title = collection?.name?.[0][0] || BLOG.TITLE
  const description = collection?.description?.[0][0] || BLOG.DESCRIPTION
  const pageCover = mapCoverUrl(collection?.cover, notionPageData.block)
  return { title, description, pageCover }
}

/**
 * 网站封面背景图
 * @param pageCover
 * @returns {string}
 */
const mapCoverUrl = (pageCover, block) => {
  if (!pageCover || pageCover === '') {
    return BLOG.HOME_BANNER_IMAGE
  }
  if (pageCover) {
    if (pageCover.startsWith('/')) return 'https://www.notion.so' + pageCover
    if (pageCover.startsWith('http')) return defaultMapImageUrl(pageCover, block[idToUuid(BLOG.NOTION_PAGE_ID)].value)
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
  const collection = Object.values(pageRecordMap.collection)[0]?.value
  const collectionQuery = pageRecordMap.collection_query
  const block = pageRecordMap.block
  const schema = collection?.schema
  const rawMetadata = block[pageId].value
  const tagOptions = getTagOptions(schema)
  const categoryOptions = getCategoryOptions(schema)

  // Check Type Page-Database和Inline-Database
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.warn(`pageId "${pageId}" is not a database`)
    return null
  }

  return {
    collection,
    collectionQuery,
    block,
    schema,
    tagOptions,
    categoryOptions,
    rawMetadata
  }
}
