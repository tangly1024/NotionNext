/**
 * Random cover for posts
 */

'use strict'

hexo.extend.generator.register('post', locals => {
  const previousIndexes = []

  const getRandomCover = defaultCover => {
    if (!defaultCover) return false
    if (!Array.isArray(defaultCover)) return defaultCover

    const coverCount = defaultCover.length

    if (coverCount === 1) {
      return defaultCover[0]
    }

    const maxPreviousIndexes = coverCount === 2 ? 1 : (coverCount === 3 ? 2 : 3)

    let index
    do {
      index = Math.floor(Math.random() * coverCount)
    } while (previousIndexes.includes(index) && previousIndexes.length < coverCount)

    previousIndexes.push(index)
    if (previousIndexes.length > maxPreviousIndexes) {
      previousIndexes.shift()
    }

    return defaultCover[index]
  }

  const handleImg = data => {
    const imgTestReg = /\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i
    let { cover: coverVal, top_img: topImg } = data

    // Add path to top_img and cover if post_asset_folder is enabled
    if (hexo.config.post_asset_folder) {
      if (topImg && topImg.indexOf('/') === -1 && imgTestReg.test(topImg)) {
        data.top_img = `${data.path}${topImg}`
      }
      if (coverVal && coverVal.indexOf('/') === -1 && imgTestReg.test(coverVal)) {
        data.cover = `${data.path}${coverVal}`
      }
    }

    if (coverVal === false) return data

    // If cover is not set, use random cover
    if (!coverVal) {
      const { cover: { default_cover: defaultCover } } = hexo.theme.config
      const randomCover = getRandomCover(defaultCover)
      data.cover = randomCover
      coverVal = randomCover // update coverVal
    }

    if (coverVal && (coverVal.indexOf('//') !== -1 || imgTestReg.test(coverVal))) {
      data.cover_type = 'img'
    }

    return data
  }

  // https://github.com/hexojs/hexo/blob/master/lib%2Fplugins%2Fgenerator%2Fpost.ts
  const posts = locals.posts.sort('date').toArray()
  const { length } = posts

  return posts.map((post, i) => {
    if (i) post.prev = posts[i - 1]
    if (i < length - 1) post.next = posts[i + 1]

    post.__post = true

    return {
      data: handleImg(post),
      layout: 'post',
      path: post.path
    }
  })
})
