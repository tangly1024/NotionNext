import { siteConfig } from '@/lib/config'
import PostListHorizontal from './PostListHorizontal'

/**
 * 按文章类别分组的文章列表区块
 * @returns {JSX.Element}
 * @constructor
 */
const PostBannerGroupByCategory = props => {
  const { posts, categoryOptions, allNavPages } = props
  if (!posts || posts.length === 0) {
    return null
  }

  // 按分类将文章分组成文件夹
  const categoryFolders = groupArticles(categoryOptions, allNavPages.slice(8))

  return (
    <>
      {/* 不同的分类文章列表 */}
      {categoryFolders?.map((categoryGroup, index) => {
        if (
          !categoryGroup ||
          !categoryGroup.items ||
          categoryGroup.items.length < 1
        ) {
          return null
        }

        return (
          <PostListHorizontal
            key={index}
            hasBg={index % 2 === 1}
            title={categoryGroup?.category}
            href={`/category/${categoryGroup?.category}`}
            posts={categoryGroup?.items}
          />
        )
      })}
    </>
  )
}

// 按照分类将文章分组成文件夹
function groupArticles(categoryOptions, allPosts) {
  if (!allPosts) {
    return []
  }
  const groups = []

  for (let i = 0; i < allPosts.length; i++) {
    const item = allPosts[i]
    const categoryName = item?.category ? item?.category : '' // 将 category 转换为字符串

    const existingGroup = groups.find(group => group.category === categoryName) // 搜索同名的最后一个分组

    if (existingGroup && existingGroup.category === categoryName) {
      // 如果分组已存在，并且该分组中的文章数量小于4，添加文章
      if (existingGroup.items.length < 4) {
        existingGroup.items.push(item)
      }
    } else {
      // 新建分组，并添加当前文章
      groups.push({ category: categoryName, items: [item] })
    }
  }
  const hiddenCategory = siteConfig('MAGZINE_HOME_HIDDEN_CATEGORY')
  // 按照 categoryOptions 的顺序排序 groups
  const sortedGroups = []
  for (let i = 0; i < categoryOptions.length; i++) {
    const option = categoryOptions[i]
    const matchingGroup = groups.find(group => group.category === option.name)

    if (matchingGroup) {
      if (
        hiddenCategory &&
        hiddenCategory.indexOf(matchingGroup.category) >= 0
      ) {
        continue
      }
      sortedGroups.push(matchingGroup)
    }
  }
  return sortedGroups
}

export default PostBannerGroupByCategory
