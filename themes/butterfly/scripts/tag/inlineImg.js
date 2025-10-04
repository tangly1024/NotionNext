/**
 * inlineImg
 * @param {Array} args - Image name and height
 * @param {string} args[0] - Image name
 * @param {number} args[1] - Image height
 * @returns {string} - Image tag
 */

'use strict'

const urlFor = require('hexo-util').url_for.bind(hexo)

const inlineImg = ([img, height = '']) => {
  const heightStyle = height ? `style="height:${height}"` : ''
  const src = urlFor(img)
  return `<img class="inline-img" src="${src}" ${heightStyle} />`
}

hexo.extend.tag.register('inlineImg', inlineImg, { ends: false })
