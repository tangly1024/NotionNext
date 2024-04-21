import { isIterable } from '../utils'

export function getAllTags({ allPages, sliceCount = 0, tagOptions }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  if (!allPosts || !tagOptions) {
    return []
  }
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
  list.sort((a, b) => b.count - a.count)
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
  let categoryList = []
  if (isIterable(categoryOptions)) {
    for (const c of categoryOptions) {
      const count = categoryObj[c.value]
      if (count) {
        categoryList.push({ id: c.id, name: c.value, color: c.color, count })
      }
    }
  }
  categoryList.sort((a, b) => b.count - a.count)
  if (categorySliceCount && categorySliceCount > 0) {
    const slicedCategoryList = categoryList.slice(0, categorySliceCount)
    categoryList = slicedCategoryList
  }
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
  let tagList = []
  if (isIterable(tagOptions)) {
    tagOptions.forEach(c => {
      const count = tagObj[c.value]
      if (count) {
        tagList.push({ id: c.id, name: c.value, color: c.color, count })
      }
    })
  }
  tagList.sort((a, b) => b.count - a.count)
  if (tagSliceCount && tagSliceCount > 0) {
    const slicedTagList = tagList.slice(0, tagSliceCount)
    tagList = slicedTagList
  }
  return { categories: categoryList, tags: tagList }
}
export function getTopCategories({ allPages, categoryOptions, sliceCount = 0 }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  if (!allPosts || !categoryOptions) {
    return []
  }
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
  list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount)
  } else {
    return list
  }
}
