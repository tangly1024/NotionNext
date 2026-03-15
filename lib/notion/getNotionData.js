import BLOG from '@/blog.config'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { getPostBlocks } from '@/lib/notion/getPostBlocks'
import { NotionAPI } from 'notion-client'
import { idToUuid } from 'notion-utils'
import { deepClone } from '../utils'
import { getAllCategories } from './getAllCategories'
import getAllPageIds from './getAllPageIds'
import { getAllTags } from './getAllTags'
import getPageProperties from './getPageProperties'
import { mapImgUrl, compressImage } from './mapImage'
import { getConfigMapFromConfigPage } from './getNotionConfig'

export async function getGlobalData({
  pageId = BLOG.NOTION_PAGE_ID,
  from
}) {
  const data = await getNotionPageData({ pageId, from })
  const db = deepClone(data)

  delete db.block
  delete db.schema
  delete db.rawMetadata
  delete db.pageIds
  delete db.viewIds
  delete db.collection
  delete db.collectionQuery
  delete db.collectionId
  delete db.collectionView

  return db
}

function getLatestPosts({ allPages, latestPostCount }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')

  const latestPosts = Object.create(allPosts).sort((a, b) => {
    const dateA = new Date(a?.lastEditedDate || a?.publishDate)
    const dateB = new Date(b?.lastEditedDate || b?.publishDate)
    return dateB - dateA
  })

  return latestPosts.slice(0, latestPostCount)
}

export async function getNotionPageData({ pageId, from }) {
  const cacheKey = 'page_block_' + pageId
  const data = await getDataFromCache(cacheKey)

  if (data && data.pageIds?.length > 0) {
    console.log('[缓存]:', `from:${from}`, `root-page-id:${pageId}`)
    return data
  }

  const db = await getDataBaseInfoByNotionAPI({ pageId, from })

  if (db) {
    await setDataToCache(cacheKey, db)
  }

  return db
}

function getCustomNav({ allPages }) {
  const customNav = []
  if (allPages && allPages.length > 0) {
    allPages.forEach(p => {
      if (p?.slug?.indexOf('http') === 0) {
        customNav.push({ icon: p.icon || null, name: p.title, to: p.slug, target: '_blank', show: true })
      } else {
        customNav.push({ icon: p.icon || null, name: p.title, to: '/' + p.slug, target: '_self', show: true })
      }
    })
  }
  return customNav
}

function getCustomMenu({ collectionData }) {
  const menuPages = collectionData.filter(
    post =>
      (post?.type === BLOG.NOTION_PROPERTY_NAME.type_menu ||
        post?.type === BLOG.NOTION_PROPERTY_NAME.type_sub_menu) &&
      post.status === 'Published'
  )

  const menus = []
  if (menuPages && menuPages.length > 0) {
    menuPages.forEach(e => {
      e.show = true
      if (e?.slug?.indexOf('http') === 0) {
        e.target = '_blank'
      }

      if (e.type === BLOG.NOTION_PROPERTY_NAME.type_menu) {
        menus.push(e)
      } else if (e.type === BLOG.NOTION_PROPERTY_NAME.type_sub_menu) {
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
  const tagSchema = Object.values(schema).find(e => e.name === BLOG.NOTION_PROPERTY_NAME.tags)
  return tagSchema?.options || []
}

function getCategoryOptions(schema) {
  if (!schema) return {}
  const categorySchema = Object.values(schema).find(e => e.name === BLOG.NOTION_PROPERTY_NAME.category)
  return categorySchema?.options || []
}

function getSiteInfo({ collection, block }) {
  const title = collection?.name?.[0][0] || BLOG.TITLE
  const description = collection?.description ? Object.assign(collection).description[0][0] : BLOG.DESCRIPTION
  const pageCover = collection?.cover
    ? mapImgUrl(collection?.cover, block[idToUuid(BLOG.NOTION_PAGE_ID)]?.value)
    : BLOG.HOME_BANNER_IMAGE

  let icon = collection?.icon ? mapImgUrl(collection?.icon, collection, 'collection') : BLOG.AVATAR
  icon = compressImage(icon)

  const emojiPattern = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
  if (!icon || emojiPattern.test(icon)) {
    icon = BLOG.AVATAR
  }

  return { title, description, pageCover, icon }
}

export function getNavPages({ allPages }) {
  const allNavPages = allPages?.filter(post => {
    return (
      post &&
      post?.slug &&
      !post?.slug?.startsWith('http') &&
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
    pageIcon: item.pageIcon || '',
    lastEditedDate: item.lastEditedDate
  }))
}

async function getNotice(post) {
  if (!post) return null
  post.blockMap = await getPostBlocks(post.id, 'data-notice')
  return post
}

const EmptyData = () => {
  return {
    notice: null,
    siteInfo: getSiteInfo({}),
    allPages: [],
    allNavPages: [],
    collection: {},
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
    postCount: 0,
    pageIds: [],
    latestPosts: []
  }
}

function findDatabaseMetadata(block, pageId) {
  if (!block) return null

  const direct = block?.[pageId]?.value
  if (direct?.type === 'collection_view_page' || direct?.type === 'collection_view') {
    return direct
  }

  for (const key of Object.keys(block)) {
    const value = block?.[key]?.value
    if (value?.type === 'collection_view_page' || value?.type === 'collection_view') {
      return value
    }
  }

  return null
}

function getPageIdsFromBlockMap(block, collectionId) {
  if (!block || !collectionId) return []

  const ids = []
  for (const key of Object.keys(block)) {
    const v = block[key]?.value
    if (v?.type === 'page' && v?.parent_table === 'collection' && v?.parent_id === collectionId) {
      ids.push(key)
    }
  }
  return ids
}

async function queryPageIdsFallback({ collectionId, viewIds, collectionView }) {
  if (!collectionId || !Array.isArray(viewIds) || viewIds.length === 0) return []

  const ids = new Set()
  const authToken = BLOG.NOTION_ACCESS_TOKEN || null
  const api = new NotionAPI({
    authToken,
    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  for (const viewId of viewIds) {
    try {
      const view = collectionView?.[viewId]?.value || {}
      const data = await api.getCollectionData(collectionId, viewId, view, {
        limit: 9999,
        searchQuery: ''
      })

      const rr = data?.result?.reducerResults || {}
      const candidates = [
        rr?.collection_group_results?.blockIds,
        rr?.collection_group_results?.block_ids,
        rr?.results?.blockIds,
        rr?.results?.block_ids,
        rr?.blockIds,
        rr?.block_ids
      ]

      for (const arr of candidates) {
        if (!Array.isArray(arr)) continue
        for (const id of arr) {
          if (typeof id === 'string' && id) ids.add(id)
        }
      }
    } catch (e) {
      console.warn('[fallback queryCollection] view failed:', viewId, e?.message || e)
    }
  }

  return [...ids]
}

async function getDataBaseInfoByNotionAPI({ pageId, from }) {
  pageId = idToUuid(pageId)

  const pageRecordMap = await getPostBlocks(pageId, from)
  if (!pageRecordMap) {
    console.error('can`t get Notion Data ; Which id is: ', pageId)
    return EmptyData(pageId)
  }

  const block = pageRecordMap.block || {}
  const rawMetadata = findDatabaseMetadata(block, pageId)

  if (!rawMetadata) {
    console.error(`pageId "${pageId}" is not a database`)
    return EmptyData(pageId)
  }

  const collection = Object.values(pageRecordMap.collection || {})[0]?.value || {}
  const siteInfo = getSiteInfo({ collection, block })
  const collectionId = rawMetadata?.collection_id
  const collectionQuery = pageRecordMap.collection_query || {}
  const collectionView = pageRecordMap.collection_view || {}
  const schema = collection?.schema || {}

  const viewIds = rawMetadata?.view_ids || []
  const collectionData = []
  let pageIds = getAllPageIds(collectionQuery, collectionId, collectionView, viewIds)

  if (!pageIds || pageIds.length === 0) {
    pageIds = getPageIdsFromBlockMap(block, collectionId)
    if (pageIds.length > 0) {
      console.warn('[fallback:blockMap] pageIds:', pageIds.length)
    }
  }

  if ((!pageIds || pageIds.length === 0) && collectionId && viewIds?.length > 0) {
    pageIds = await queryPageIdsFallback({ collectionId, viewIds, collectionView })
    if (pageIds.length > 0) {
      console.warn('[fallback:queryCollection] pageIds:', pageIds.length)
    }
  }

  if (!pageIds || pageIds.length === 0) {
    console.error('获取到的文章列表为空，请检查notion模板', {
      collectionId,
      viewIdsLen: viewIds?.length || 0
    })
  }

  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const value = block[id]?.value
    if (!value) continue

    const properties = (await getPageProperties(id, block, schema, null, getTagOptions(schema))) || null
    if (properties) {
      collectionData.push(properties)
    }
  }

  let postCount = 0

  const allPages = collectionData.filter(post => {
    if (post?.type === 'Post' && post.status === 'Published') {
      postCount++
    }

    return (
      post &&
      post?.slug &&
      !post?.slug?.startsWith('http') &&
      (post?.status === 'Invisible' || post?.status === 'Published')
    )
  })

  const NOTION_CONFIG = (await getConfigMapFromConfigPage(collectionData)) || {}

  if (BLOG.POSTS_SORT_BY === 'date') {
    allPages.sort((a, b) => b?.publishDate - a?.publishDate)
  }

  const notice = await getNotice(
    collectionData.filter(post => post && post?.type && post?.type === 'Notice' && post.status === 'Published')?.[0]
  )

  const categoryOptions = getAllCategories({ allPages, categoryOptions: getCategoryOptions(schema) })
  const tagOptions = getAllTags({ allPages, tagOptions: getTagOptions(schema) })

  const customNav = getCustomNav({
    allPages: collectionData.filter(post => post?.type === 'Page' && post.status === 'Published')
  })

  const customMenu = await getCustomMenu({ collectionData })
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
