
/**
 * 获取所有文章的标签
 * @param allPosts
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @returns {Promise<{}|*[]>}
 */
export async function getAllTags (allPosts, sliceCount = 12) {
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
  const list = Object.keys(tagObj).map((index) => {
    return { name: index, count: tagObj[index] }
  })
  list.sort((a, b) => b.count - a.count)
  if (sliceCount) {
    return list.slice(0, 12)
  } else {
    return list
  }
}
