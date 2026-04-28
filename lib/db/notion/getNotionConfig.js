/**
 * 从Notion中读取站点配置;
 * 在Notion模板中创建一个类型为CONFIG的页面，再添加一个数据库表格，即可用于填写配置
 * Notion数据库配置优先级最高，将覆盖vercel环境变量以及blog.config.js中的配置
 * --注意--
 * 数据库请从模板复制 https://www.notion.so/tanghh/287869a92e3d4d598cf366bd6994755e
 *
 */
import { getDateValue, getTextContent } from 'notion-utils'
import { deepClone } from '../../utils'
import getAllPageIds from './getAllPageIds'
import { fetchNotionPageBlocks } from './getPostBlocks'
import { encryptEmail } from '@/lib/plugins/mailEncrypt'
import { normalizeCollection, normalizeSchema, normalizePageBlock } from './normalizeUtil'

/**
 * 从Notion中读取Config配置表
 * @param {*} allPages
 * @returns
 */
export async function getConfigMapFromConfigPage(allPages) {
  if (!allPages?.length) {
    console.warn('[Notion配置] 忽略的配置')
    return null
  }

  // ✅ 1. 找配置页
  const configPage = findConfigPage(allPages)
  if (!configPage) return null

  // ✅ 2. 拉数据
  const data = await fetchConfigPageData(configPage.id)
  if (!data) return null

  // ✅ 3. 解析
  return parseConfigFromPage(data.pageRecordMap, data.content)
}


function normalizeId(id) {
  return String(id || '').replace(/-/g, '')
}

export function findConfigPage(allPages) {
  const configPages = (allPages || []).filter(post =>
    post?.type && ['CONFIG', 'config', 'Config'].includes(post.type)
  )

  if (!configPages.length) {
    console.warn('[Notion配置] 未找到配置页面')
    return null
  }

  const selected = configPages[0]

  console.warn('[Notion配置] ✅:', {
    id: selected.id,
    title: selected.title
  })

  return selected
}


export async function fetchConfigPageData(configPageId) {
  let pageRecordMap = await fetchNotionPageBlocks(configPageId, 'config-table')

  const pageBlock = pageRecordMap?.block?.[configPageId]?.value
  let content = normalizePageBlock(pageBlock)?.content


  for (const table of ['Config-Table', 'CONFIG-TABLE']) {
    if (content) break
    pageRecordMap = await fetchNotionPageBlocks(configPageId, table)
    content = pageRecordMap.block[configPageId]?.value?.content
  }

  if (!content) {
    console.warn('[Notion配置] 未找到配置表')
    return null
  }

  return { pageRecordMap, content }
}


export function parseConfigFromPage(pageRecordMap, content) {
  const notionConfig = {}

  const configTableId = content.find(contentId => {
    const blockItem = pageRecordMap.block?.[contentId]?.value
    return normalizePageBlock(blockItem)?.type === 'collection_view'
  })

  if (!configTableId) return null

  const block = pageRecordMap.block || {}
  const rawMetadata = normalizePageBlock(pageRecordMap.block[configTableId])

  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.error(`pageId "${configTableId}" is not a database`)
    return null
  }

  const collectionId = rawMetadata.collection_id
  const collection = normalizeCollection(
    pageRecordMap.collection[collectionId].value
  )
  const schema = normalizeSchema(collection?.schema || {})

  const rowPageIds = getAllPageIds(
    pageRecordMap.collection_query,
    collectionId,
    pageRecordMap.collection_view,
    rawMetadata.view_ids
  )

  for (const id of rowPageIds) {
    const value = block[id]?.value
    if (!value) continue

    const temp = normalizePageBlock(value)
    if (!temp?.properties) continue

    const rawProperties = Object.entries(temp.properties)
    const exclude = ['date', 'select', 'multi_select', 'person']

    const properties = { id }

    for (const [key, val] of rawProperties) {
      if (schema[key]?.type && !exclude.includes(schema[key].type)) {
        properties[schema[key].name] = getTextContent(val)
      } else {
        switch (schema[key]?.type) {
          case 'date': {
            const date = getDateValue(val)
            delete date.type
            properties[schema[key].name] = date
            break
          }
          case 'select':
          case 'multi_select': {
            const selects = getTextContent(val)
            if (selects) {
              properties[schema[key].name] = selects.split(',')
            }
            break
          }
        }
      }
    }

    const config = {
      enable: (properties['启用'] || properties.Enable) === 'Yes',
      key: properties['配置名'] || properties.Name,
      value: properties['配置值'] || properties.Value
    }

    if (config.enable && config.key) {
      if (config.key === 'CONTACT_EMAIL') {
        notionConfig[config.key] =
          (config.value && encryptEmail(config.value)) || null
      } else {
        notionConfig[config.key] =
          parseTextToJson(config.value) || config.value || null
      }
    }
  }

  // INLINE_CONFIG 合并
  try {
    return {
      ...deepClone(notionConfig),
      ...notionConfig?.INLINE_CONFIG
    }
  } catch (err) {
    console.warn('INLINE_CONFIG 解析失败', err)
    return notionConfig
  }
}


/**
 * 解析文本为JSON
 * @param text
 * @returns {any|null}
 */
export function parseTextToJson(text) {
  try {
    return JSON.parse(text)
  } catch (error) {
    return null
  }
}
