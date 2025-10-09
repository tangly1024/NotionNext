'use strict'

hexo.extend.helper.register('groupPosts', function () {
  const getGroupArray = array => {
    return array.reduce((groups, item) => {
      const key = item.series
      if (key) {
        groups[key] = groups[key] || []
        groups[key].push(item)
      }
      return groups
    }, {})
  }

  const sortPosts = posts => {
    const { orderBy = 'date', order = 1 } = this.theme.aside.card_post_series
    if (orderBy === 'title') return posts.sort('title', order)
    return posts.sort('date', order)
  }

  return getGroupArray(sortPosts(this.site.posts))
})
