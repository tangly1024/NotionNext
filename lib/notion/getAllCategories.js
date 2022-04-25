import { isIterable } from '../utils'

/**
 * 获取所有文章的分类
 * @param allPosts
 * @returns {Promise<{}|*[]>}
 */
export async function getAllCategories({ allPosts, categoryOptions, sliceCount = 0 }) {
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
