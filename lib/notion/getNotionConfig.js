/**
 * 从Notion中读取站点配置;
 * 在Notion模板中创建一个类型为CONFIG的页面，再添加一个数据库表格，即可用于填写配置
 * Notion数据库配置优先级最高，将覆盖vercel环境变量以及blog.config.js中的配置
 * --注意--
 * 数据库请从模板复制 https://www.notion.so/tanghh/287869a92e3d4d598cf366bd6994755e
 *
 */
import { getDateValue, getTextContent } from 'notion-utils'
import { deepClone } from '../utils'
import getAllPageIds from './getAllPageIds'
import { getPage } from './getPostBlocks'
import { encryptEmail } from '@/lib/plugins/mailEncrypt'

/**
 * 从Notion中读取Config配置表
 * @param {*} allPages
 * @returns
 */
export async function getConfigMapFromConfigPage(allPages) {
  // 默认返回配置文件
  const notionConfig = {}

  if (!allPages || !Array.isArray(allPages) || allPages.length === 0) {
    console.warn('[Notion配置] 忽略的配置')
    return null
  }
  // 找到Config类
  const configPage = allPages?.find(post => {
    return (
      post &&
      post?.type &&
      (post?.type === 'CONFIG' ||
        post?.type === 'config' ||
        post?.type === 'Config')
    )
  })

  if (!configPage) {
    // console.warn('[Notion配置] 未找到配置页面')
    return null
  }
  const configPageId = configPage.id
  //   console.log('[Notion配置]请求配置数据 ', configPage.id)
  let pageRecordMap = await getPage(configPageId, 'config-table')
  //   console.log('配置中心Page', configPageId, pageRecordMap)
  let content = pageRecordMap.block[configPageId].value.content
  for (const table of ['Config-Table', 'CONFIG-TABLE']) {
    if (content) break
    pageRecordMap = await getPage(configPageId, table)
    content = pageRecordMap.block[configPageId].value.content
  }

  if (!content) {
    // console.warn(
    //   '[Notion配置] 未找到配置表格',
    //   pageRecordMap.block[configPageId],
    //   pageRecordMap.block[configPageId].value
    // )
    return null
  }

  // 找到PAGE文件中的database
  const configTableId = content?.find(contentId => {
    return pageRecordMap.block[contentId].value.type === 'collection_view'
  })

  // eslint-disable-next-line no-constant-condition, no-self-compare
  if (!configTableId) {
    // console.warn(
    //   '[Notion配置]未找到配置表格数据',
    //   pageRecordMap.block[configPageId],
    //   pageRecordMap.block[configPageId].value
    // )
    return null
  }

  // 页面查找
  const databaseRecordMap = pageRecordMap.block[configTableId]
  const block = pageRecordMap.block || {}
  const rawMetadata = databaseRecordMap.value
  // Check Type Page-Database和Inline-Database
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.error(`pageId "${configTableId}" is not a database`)
    return null
  }
  //   console.log('表格', databaseRecordMap, block, rawMetadata)
  const collectionId = rawMetadata?.collection_id
  const collection = pageRecordMap.collection[collectionId].value
  const collectionQuery = pageRecordMap.collection_query
  const collectionView = pageRecordMap.collection_view
  const schema = collection?.schema
  const viewIds = rawMetadata?.view_ids
  const pageIds = getAllPageIds(
    collectionQuery,
    collectionId,
    collectionView,
    viewIds
  )
  if (pageIds?.length === 0) {
    console.error(
      '[Notion配置]获取到的文章列表为空，请检查notion模板',
      collectionQuery,
      collection,
      collectionView,
      viewIds,
      databaseRecordMap
    )
  }
  // 遍历用户的表格
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    const value = block[id]?.value
    if (!value) {
      continue
    }
    const rawProperties = Object.entries(block?.[id]?.value?.properties || [])
    const excludeProperties = ['date', 'select', 'multi_select', 'person']
    const properties = {}
    for (let i = 0; i < rawProperties.length; i++) {
      const [key, val] = rawProperties[i]
      properties.id = id
      if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
        properties[schema[key].name] = getTextContent(val)
      } else {
        switch (schema[key]?.type) {
          case 'date': {
            const dateProperty = getDateValue(val)
            delete dateProperty.type
            properties[schema[key].name] = dateProperty
            break
          }
          case 'select':
          case 'multi_select': {
            const selects = getTextContent(val)
            if (selects[0]?.length) {
              properties[schema[key].name] = selects.split(',')
            }
            break
          }
          default:
            break
        }
      }
    }

    if (properties) {
      // 将表格中的字段映射成 英文
      const config = {
        enable: (properties['启用'] || properties.Enable) === 'Yes',
        key: properties['配置名'] || properties.Name,
        value: properties['配置值'] || properties.Value
      }

      // 只导入生效的配置
      if (config.enable) {
        // console.log('[Notion配置]', config.key, config.value)
        if (config.key === 'CONTACT_EMAIL') {
          notionConfig[config.key] =
            (config.value && encryptEmail(config.value)) || null
        } else {
          notionConfig[config.key] =
            parseTextToJson(config.value) || config.value || null
          // 配置不能是undefined，至少是null
        }
      }
    }
  }

  let combine = notionConfig
  try {
    // 将INLINE_CONFIG合并，@see https://docs.tangly1024.com/article/notion-next-inline-config
    combine = Object.assign(
      {},
      deepClone(notionConfig),
      notionConfig?.INLINE_CONFIG
    )
  } catch (err) {
    console.warn('解析 INLINE_CONFIG 配置时出错,请检查JSON格式', err)
  }
  return combine
}

/**
 * 解析INLINE_CONFIG
 * @param {*} configString
 * @returns
 */
export function parseConfig(configString) {
  if (!configString) {
    return {}
  }
  // 解析对象
  try {
    // eslint-disable-next-line no-eval
    const config = eval('(' + configString + ')')
    return config
  } catch (evalError) {
    console.warn(
      '解析 eval(INLINE_CONFIG) 配置时出错,请检查JSON格式',
      evalError
    )
    return {}
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
