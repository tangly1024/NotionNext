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
  const tagObj = {}
  tags.forEach(tag => {
    if (tag in tagObj) {
      tagObj[tag]++
    } else {
      tagObj[tag] = 1
    }
  })
  return tagObj
}
