import BLOG from '@/blog.config'
import { NotionAPI } from 'notion-client'
import { getDateValue, getTextContent } from 'notion-utils'
import formatDate from '../utils/formatDate'
// import { createHash } from 'crypto'
import md5 from 'js-md5'
import { siteConfig } from '../config'
import { checkContainHttp, sliceUrlFromHttp } from '../utils'
import { mapImgUrl } from './mapImage'

/**
 * 获取页面元素成员属性
 * @param {*} id
 * @param {*} value
 * @param {*} schema
 * @param {*} authToken
 * @param {*} tagOptions
 * @returns
 */
export default async function getPageProperties(
  id,
  value,
  schema,
  authToken,
  tagOptions
) {
  const rawProperties = Object.entries(value?.properties || [])
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
        case 'person': {
          const rawUsers = val.flat()
          const users = []
          const api = new NotionAPI({ authToken })

          for (let i = 0; i < rawUsers.length; i++) {
            if (rawUsers[i][0][1]) {
              const userId = rawUsers[i][0]
              const res = await api.getUsers(userId)
              const resValue =
                res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value
              const user = {
                id: resValue?.id,
                first_name: resValue?.given_name,
                last_name: resValue?.family_name,
                profile_photo: resValue?.profile_photo
              }
              users.push(user)
            }
          }
          properties[schema[key].name] = users
          break
        }
        default:
          break
      }
    }
  }

  // 映射键：用户自定义表头名
  const fieldNames = BLOG.NOTION_PROPERTY_NAME
  if (fieldNames) {
    Object.keys(fieldNames).forEach(key => {
      if (fieldNames[key] && properties[fieldNames[key]])
        properties[key] = properties[fieldNames[key]]
    })
  }

  // type\status\category 是单选下拉框 取数组第一个
  properties.type = properties.type?.[0] || ''
  properties.status = properties.status?.[0] || ''
  properties.category = properties.category?.[0] || ''

  // 映射值：用户个性化type和status字段的下拉框选项，在此映射回代码的英文标识
  mapProperties(properties)

  properties.publishDate = new Date(
    properties?.date?.start_date || value.created_time
  ).getTime()
  properties.publishDay = formatDate(properties.publishDate, BLOG.LANG)
  properties.lastEditedDate = new Date(value?.last_edited_time)
  properties.lastEditedDay = formatDate(
    new Date(value?.last_edited_time),
    BLOG.LANG
  )
  properties.fullWidth = value?.format?.page_full_width ?? false
  properties.pageIcon = mapImgUrl(value?.format?.page_icon, value) ?? ''
  properties.pageCover = mapImgUrl(value?.format?.page_cover, value) ?? ''
  properties.pageCoverThumbnail =
    mapImgUrl(value?.format?.page_cover, value, 'block') ?? ''
  properties.ext = convertToJSON(properties?.ext)
  properties.content = value.content ?? []
  properties.tagItems =
    properties?.tags?.map(tag => {
      return {
        name: tag,
        color: tagOptions?.find(t => t.value === tag)?.color || 'gray'
      }
    }) || []
  delete properties.content
  return properties
}

/**
 * 字符串转json
 * @param {*} str
 * @returns
 */
function convertToJSON(str) {
  if (!str) {
    return {}
  }
  // 使用正则表达式去除空格和换行符
  try {
    return JSON.parse(str.replace(/\s/g, ''))
  } catch (error) {
    console.warn('无效JSON', str)
    return {}
  }
}

/**
 * 映射用户自定义表头
 */
function mapProperties(properties) {
  if (properties?.type === BLOG.NOTION_PROPERTY_NAME.type_post) {
    properties.type = 'Post'
  }
  if (properties?.type === BLOG.NOTION_PROPERTY_NAME.type_page) {
    properties.type = 'Page'
  }
  if (properties?.type === BLOG.NOTION_PROPERTY_NAME.type_notice) {
    properties.type = 'Notice'
  }
  if (properties?.status === BLOG.NOTION_PROPERTY_NAME.status_publish) {
    properties.status = 'Published'
  }
  if (properties?.status === BLOG.NOTION_PROPERTY_NAME.status_invisible) {
    properties.status = 'Invisible'
  }
}

/**
 * 过滤处理页面数据
 * 过滤处理过程会用到NOTION_CONFIG中的配置
 */
export function adjustPageProperties(properties, NOTION_CONFIG) {
  // 处理URL
  // 1.按照用户配置的URL_PREFIX 转换一下slug
  // 2.为文章添加一个href字段，存储最终调整的路径
  if (properties.type === 'Post') {
    if (siteConfig('POST_URL_PREFIX', '', NOTION_CONFIG)) {
      properties.slug = generateCustomizeSlug(properties, NOTION_CONFIG)
    }
    properties.href = properties.slug ?? properties.id
  } else if (properties.type === 'Page') {
    properties.href = properties.slug ?? properties.id
  } else if (properties.type === 'Menu' || properties.type === 'SubMenu') {
    // 菜单路径为空、作为可展开菜单使用
    properties.href = properties.slug ?? '#'
    properties.name = properties.title ?? ''
  }

  // 开启伪静态路径
  if (siteConfig('PSEUDO_STATIC', false, NOTION_CONFIG)) {
    if (
      !properties?.href?.endsWith('.html') &&
      !properties?.href?.startsWith('http')
    ) {
      properties.href += '.html'
    }
  }

  // 最终检查超链接
  properties.href = checkContainHttp(properties?.href)
    ? sliceUrlFromHttp(properties?.href)
    : `/${properties.href}`

  // 设置链接在页内或新页面打开
  if (properties.href?.indexOf('http') === 0) {
    properties.target = '_blank'
  } else {
    properties.target = '_self'
  }

  // 密码字段md5
  properties.password = properties.password
    ? md5(properties.slug + properties.password)
    : ''
}

/**
 * 获取自定义URL
 * 可以根据变量生成URL
 * 支持：%category%/%year%/%month%/%day%/%slug%
 * @param {*} postProperties
 * @returns
 */
function generateCustomizeSlug(postProperties, NOTION_CONFIG) {
  let fullPrefix = ''
  const allSlugPatterns = siteConfig(
    'POST_URL_PREFIX',
    '',
    NOTION_CONFIG
  ).split('/')

  allSlugPatterns.forEach((pattern, idx) => {
    if (pattern === '%year%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefix += formatPostCreatedDate.getUTCFullYear()
    } else if (pattern === '%month%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefix += String(formatPostCreatedDate.getUTCMonth() + 1).padStart(
        2,
        0
      )
    } else if (pattern === '%day%' && postProperties?.publishDay) {
      const formatPostCreatedDate = new Date(postProperties?.publishDay)
      fullPrefix += String(formatPostCreatedDate.getUTCDate()).padStart(2, 0)
    } else if (pattern === '%slug%') {
      fullPrefix += postProperties.slug ?? postProperties.id
    } else if (pattern === '%category%' && postProperties?.category) {
      fullPrefix += postProperties.category
    } else if (!pattern.includes('%')) {
      fullPrefix += pattern
    } else {
      return
    }
    if (idx !== allSlugPatterns.length - 1) {
      fullPrefix += '/'
    }
  })
  if (fullPrefix.startsWith('/')) {
    fullPrefix = fullPrefix.substring(1) // 去掉头部的"/"
  }
  if (fullPrefix.endsWith('/')) {
    fullPrefix = fullPrefix.substring(0, fullPrefix.length - 1) // 去掉尾部部的"/"
  }
  return `${fullPrefix}/${postProperties.slug ?? postProperties.id}`
}
