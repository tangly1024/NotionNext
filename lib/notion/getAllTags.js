import { rest } from "lodash"

/**
 * 获取所有文章的标签
 * @param allPosts
 * @returns {Promise<{}|*[]>}
 */
export async function getAllTags (allPosts) {
  if (!allPosts) {
    return []
  }

  let tags = allPosts.map(p => p.tags)
  tags = [...tags.flat()]

  // 标签计数
  const tagObj = {}
  tags.forEach(tag => {
    if (tag in tagObj) {
      tagObj[tag]++
    } else {
      tagObj[tag] = 1
    }
  })

  // 按照标签数量排序
  const list = Object.keys(tagObj).map((index) => {return {name:index,count:tagObj[index]}})
  list.sort((a, b) => b.count - a.count)
  return list
}
