import { getTextContent, getDateValue } from 'notion-utils'
import { NotionAPI } from 'notion-client'
import BLOG from '@/blog.config'
import formatDate from '../formatDate'
import { defaultMapImageUrl } from 'react-notion-x'

async function getPageProperties(id, block, schema, authToken, tagOptions, siteInfo) {
  const rawProperties = Object.entries(block?.[id]?.value?.properties || [])
  const excludeProperties = ['date', 'select', 'multi_select', 'person']
  const value = block[id]?.value
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

  properties.slug = properties.slug ?? properties.id
  properties.createdTime = formatDate(new Date(value.created_time).toString(), BLOG.LANG)
  properties.lastEditedTime = formatDate(new Date(value?.last_edited_time).toString(), BLOG.LANG)
  properties.fullWidth = value.format?.page_full_width ?? false
  properties.page_cover = getPostCover(id, block) ?? siteInfo?.pageCover
  properties.content = value.content ?? []
  properties.tagItems = properties?.tags?.map(tag => {
    return { name: tag, color: tagOptions?.find(t => t.value === tag)?.color || 'gray' }
  }) || []
  delete properties.content
  return properties

  // 从Block获取封面图;优先取PageCover，否则取内容图片
  function getPostCover(id, block) {
    const pageCover = block[id].value?.format?.page_cover
    if (pageCover) {
      if (pageCover.startsWith('/')) return 'https://www.notion.so' + pageCover
      if (pageCover.startsWith('http')) return defaultMapImageUrl(pageCover, block[id].value)
    }
  }
}

export { getPageProperties as default }
