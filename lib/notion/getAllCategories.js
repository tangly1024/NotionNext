import { isIterable } from '../utils'

export function getAllCategories({ allPages, categoryOptions, sliceCount = 0 }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  if (!allPosts || !categoryOptions) {
    return []
  }

  const categories = allPosts.flatMap(p => p.category)
  const categoryObj = {}
  categories.forEach(category => {
    categoryObj[category] = (categoryObj[category] || 0) + 1
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

export function getAllTags({ allPages, tagOptions, sliceCount = 0 }) {
  const allPosts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  if (!allPosts || !tagOptions) {
    return []
  }

  const tags = allPosts.flatMap(p => p.tag)
  const tagObj = {}
  tags.forEach(tag => {
    tagObj[tag] = (tagObj[tag] || 0) + 1
  })

  const list = []
  if (isIterable(tagOptions)) {
    for (const t of tagOptions) {
      const count = tagObj[t.value]
      if (count) {
        list.push({ id: t.id, name: t.value, color: t.color, count })
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
