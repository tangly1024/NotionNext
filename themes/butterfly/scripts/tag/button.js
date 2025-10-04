/**
 * Button
 * {% btn url text icon option %}
 * option: color outline center block larger
 * color : default/blue/pink/red/purple/orange/green
 */

'use strict'

const urlFor = require('hexo-util').url_for.bind(hexo)

const btn = args => {
  const [url = '', text = '', icon = '', option = ''] = args.join(' ').split(',').map(arg => arg.trim())

  const iconHTML = icon ? `<i class="${icon}"></i>` : ''
  const textHTML = text ? `<span>${text}</span>` : ''

  return `<a class="btn-beautify ${option}" href="${urlFor(url)}" title="${text}">${iconHTML}${textHTML}</a>`
}

hexo.extend.tag.register('btn', btn, { ends: false })
