import { isIterable } from '../utils'
let categoryList = [];
let tagList = [];
/**
 * 获取所有文章的分类
 * @param allPages
 * @param categoryOptions 分类的下拉选项
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @returns {Promise<{}|*[]>}
 */
export function getAllCategories({ allPages, categoryOptions, sliceCount = 0 }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  if (!allPosts || !categoryOptions) {
    return []
  }
  // 计数
  let categories = allPosts?.map(p => p.category)
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
  list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount)
  } else {
    return list
  }
}

/**
 * Get all tags of the articles".
 * @param allPosts
 * @param sliceCount default 12, if 0 return all
 * @param tagOptions tag options
 * @returns {Promise<{}|*[]>}
 */
export function getAllTags({ allPages, sliceCount = 0, tagOptions }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')

  if (!allPosts || !tagOptions) {
    return []
  }
  // Count tags
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
  if (isIterable(tagOptions)) {
    tagOptions.forEach(c => {
      const count = tagObj[c.value]
      if (count) {
        list.push({ id: c.id, name: c.value, color: c.color, count })
      }
    })
  }

  // Sort tags by count
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount)
  } else {
    return list
  }
}
export function getTopCategoriesAndTags({ allPages, categoryOptions, tagOptions, categorySliceCount = 0, tagSliceCount = 0 }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  if (!allPosts || (!categoryOptions && !tagOptions)) {
    return []
  }
  // Count categories
  let categories = allPosts?.map(p => p.category)
  categories = [...categories.flat()]
  const categoryObj = {}
  categories.forEach(category => {
    if (category in categoryObj) {
      categoryObj[category]++
    } else {
      categoryObj[category] = 1
    }
  })
  const categoryList = []
  if (isIterable(categoryOptions)) {
    for (const c of categoryOptions) {
      const count = categoryObj[c.value]
      if (count) {
        categoryList.push({ id: c.id, name: c.value, color: c.color, count })
      }
    }
  }
  // Sort categories by count
  const sortedCategoryList = categoryList.sort((a, b) => b.count - a.count)
  if (categorySliceCount && categorySliceCount > 0) {
    const slicedCategoryList = sortedCategoryList.slice(0, categorySliceCount)
    categoryList = slicedCategoryList
  }

  // Count tags
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
  const tagList = []
  if (isIterable(tagOptions)) {
    tagOptions.forEach(c => {
      const count = tagObj[c.value]
      if (count) {
        tagList.push({ id: c.id, name: c.value, color: c.color, count })
      }
    })
  }
  // Sort tags by count
  const sortedTagList = tagList.sort((a, b) => b.count - a.count)
  if (tagSliceCount && tagSliceCount > 0) {
    const slicedTagList = sortedTagList.slice(0, tagSliceCount)
    tagList = slicedTagList
  }

  return { categories: categoryList, tags: tagList }
}
export function getTopCategories({ allPages, categoryOptions, sliceCount = 0 }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  if (!allPosts || !categoryOptions) {
    return []
  }
  // Count categories
  let categories = allPosts?.map(p => p.category)
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
  // Sort categories by count
  list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount)
  } else {
    return list
  }
}
