import BLOG from '@/blog.config'
import { idToUuid } from 'notion-utils'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'
import { getPostBlocks } from '@/lib/notion/getPostBlocks'

/**
 * 获取指定notion的collection数据
 * @param pageId
 * @param from 请求来源
 * @returns {Promise<JSX.Element|*|*[]>}
 */
export async function getNotionPageData ({ pageId = BLOG.notionPageId, from }) {
  // 尝试从缓存获取
  const data = await getDataFromCache('page_record_map_' + pageId)
  if (data) {
    console.log('[请求缓存]:', `from:${from}`, `id:${pageId}`)
    return data
  }
  const pageRecordMap = await getPageRecordMapByNotionAPI({ pageId, from })
  // 存入缓存
  if (pageRecordMap) {
    await setDataToCache('page_record_map', pageRecordMap)
  }
  return pageRecordMap
}

/**
 * 获取标签选项
 * @param schema
 * @returns {undefined}
 */
function getTagOptions (schema) {
  const tagSchema = Object.values(schema).find(e => e.name === 'tags')
  return tagSchema?.options || {}
}

/**
 * 调用NotionAPI获取Page数据
 * @returns {Promise<JSX.Element|null|*>}
 */
async function getPageRecordMapByNotionAPI ({ pageId, from }) {
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

  // Check Type Page-Database和Inline-Database
  if (rawMetadata?.type !== 'collection_view_page' && rawMetadata?.type !== 'collection_view') {
    console.warn(`pageId "${pageId}" is not a database`)
    return null
  }

  return {
    collection,
    collectionQuery,
    block,
    schema,
    tagOptions,
    rawMetadata
  }
}
