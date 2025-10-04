hexo.extend.helper.register('getArchiveLength', function () {
  const archiveGenerator = hexo.config.archive_generator
  const posts = this.site.posts

  const { yearly, monthly, daily } = archiveGenerator
  const { year, month, day } = this.page

  // Archives Page
  if (!year) return posts.length

  // Function to generate a unique key based on the granularity
  const getKey = (post, type) => {
    const date = post.date.clone()
    const y = date.year()
    const m = date.month() + 1
    const d = date.date()
    if (type === 'year') return `${y}`
    if (type === 'month') return `${y}-${m}`
    if (type === 'day') return `${y}-${m}-${d}`
  }

  // Create a map to count posts per period
  const mapData = this.fragment_cache('createArchiveObj', () => {
    const map = new Map()
    posts.forEach(post => {
      const keyYear = getKey(post, 'year')
      const keyMonth = getKey(post, 'month')
      const keyDay = getKey(post, 'day')

      if (yearly) map.set(keyYear, (map.get(keyYear) || 0) + 1)
      if (monthly) map.set(keyMonth, (map.get(keyMonth) || 0) + 1)
      if (daily) map.set(keyDay, (map.get(keyDay) || 0) + 1)
    })
    return map
  })

  // Determine the appropriate key to fetch based on current page context
  let key
  if (yearly && year) key = `${year}`
  if (monthly && month) key = `${year}-${month}`
  if (daily && day) key = `${year}-${month}-${day}`

  // Return the count for the current period or default to the total posts
  return mapData.get(key) || posts.length
})
