import { isIterable } from '../utils'

/**
 * 获取所有文章的标签
 * @param allPosts
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @returns {Promise<{}|*[]>}
 */
export function getAllTags({ allPosts, sliceCount = 0, tagOptions }) {
  if (!allPosts || !tagOptions) {
    return []
  }
  // 计数
  let tags = allPosts.map(p => p.tags)
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
  if (isIterable(tagOptions)) {
    tagOptions.forEach(c => {
      const count = tagObj[c.value]
      if (count) {
        list.push({ id: c.id, name: c.value, color: c.color, count })
      }
    })
  }

  // 按照数量排序
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount)
  } else {
    return list
  }
}
