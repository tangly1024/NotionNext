import { isIterable } from '../utils'
import BLOG from '@/blog.config'

/**
 * 获取所有文章的标签
 * @param allPosts
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @returns {Promise<{}|*[]>}
 */
export function getAllTags({ allPages, sliceCount = 0, tagOptions }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')

  if (!allPosts || !tagOptions) {
    return []
  }
  // 计数
  let tags = allPosts?.map(p => p.tags)
  tags = [...tags.flat()]
  const tagObj = {}
  tags.forEach(tag => {
    if (tag in tagObj) {
      tagObj[tag]++
    } else {
      tagObj[tag] = 1
    }
  })

  const list = []
  const { IS_TAG_COLOR_DISTINGUISHED } = BLOG
  if (isIterable(tagOptions)) {
    if (!IS_TAG_COLOR_DISTINGUISHED) {
      // 如果不区分颜色, 那么不同颜色相同名称的tag当做同一种tag
      const savedTagNames = new Set()
      tagOptions.forEach(c => {
        if (!savedTagNames.has(c.value)) {
          const count = tagObj[c.value]
          if (count) {
            list.push({ id: c.id, name: c.value, color: c.color, count })
          }
          savedTagNames.add(c.value)
        }
      })
    } else {
      tagOptions.forEach(c => {
        const count = tagObj[c.value]
        if (count) {
          list.push({ id: c.id, name: c.value, color: c.color, count })
        }
      })
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
