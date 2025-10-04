'use strict'

const { truncateContent, postDesc } = require('../common/postDesc')
const { prettyUrls } = require('hexo-util')
const crypto = require('crypto')
const moment = require('moment-timezone')

hexo.extend.helper.register('truncate', truncateContent)

hexo.extend.helper.register('postDesc', data => {
  return postDesc(data, hexo)
})

hexo.extend.helper.register('cloudTags', function (options = {}) {
  const env = this
  let { source, minfontsize, maxfontsize, limit, unit = 'px', orderby, order, page = 'tags' } = options

  if (limit > 0) {
    source = source.limit(limit)
  }

  const sizes = [...new Set(source.map(tag => tag.length).sort((a, b) => a - b))]

  const getRandomColor = () => {
    const randomColor = () => Math.floor(Math.random() * 201)
    const r = randomColor()
    const g = randomColor()
    const b = randomColor()
    return `rgb(${Math.max(r, 50)}, ${Math.max(g, 50)}, ${Math.max(b, 50)})`
  }

  const generateStyle = (size, unit, page) => {
    if (page === 'tags') {
      return `font-size: ${parseFloat(size.toFixed(2)) + unit}; background-color: ${getRandomColor()};`
    } else {
      return `font-size: ${parseFloat(size.toFixed(2)) + unit}; color: ${getRandomColor()};`
    }
  }

  const length = sizes.length - 1
  const result = source.sort(orderby, order).map(tag => {
    const ratio = length ? sizes.indexOf(tag.length) / length : 0
    const size = minfontsize + ((maxfontsize - minfontsize) * ratio)
    const style = generateStyle(size, unit, page)
    return `<a href="${env.url_for(tag.path)}" style="${style}">${tag.name}</a>`
  }).join('')

  return result
})

hexo.extend.helper.register('urlNoIndex', function (url = null, trailingIndex = false, trailingHtml = false) {
  return prettyUrls(url || this.url, { trailing_index: trailingIndex, trailing_html: trailingHtml })
})

hexo.extend.helper.register('md5', function (path) {
  return crypto.createHash('md5').update(decodeURI(this.url_for(path, { relative: false }))).digest('hex')
})

hexo.extend.helper.register('injectHtml', data => {
  return data ? data.join('') : ''
})

hexo.extend.helper.register('findArchivesTitle', function (page, menu, date) {
  if (page.year) {
    const dateStr = page.month ? `${page.year}-${page.month}` : `${page.year}`
    const dateFormat = page.month ? hexo.theme.config.aside.card_archives.format : 'YYYY'
    return date(dateStr, dateFormat)
  }

  const defaultTitle = this._p('page.archives')
  if (!menu) return defaultTitle

  const loop = m => {
    for (const key in m) {
      if (typeof m[key] === 'object') {
        const result = loop(m[key])
        if (result) return result
      }

      if (/\/archives\//.test(m[key])) {
        return key
      }
    }
  }

  return loop(menu) || defaultTitle
})

hexo.extend.helper.register('getBgPath', function (path) {
  if (!path) return ''

  const absoluteUrlPattern = /^(?:[a-z][a-z\d+.-]*:)?\/\//i
  const relativeUrlPattern = /^(\.\/|\.\.\/|\/|[^/]+\/).*$/
  const colorPattern = /^(#|rgb|rgba|hsl|hsla)/i

  if (colorPattern.test(path)) {
    return `background-color: ${path};`
  } else if (absoluteUrlPattern.test(path) || relativeUrlPattern.test(path)) {
    return `background-image: url(${this.url_for(path)});`
  } else {
    return `background: ${path};`
  }
})

hexo.extend.helper.register('shuoshuoFN', (data, page) => {
  const { limit } = page
  let finalResult = ''

  // Check if limit.value is a valid date
  const isValidDate = date => !isNaN(Date.parse(date))

  // order by date
  const orderByDate = data => data.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))

  // Apply number limit or time limit conditionally
  const limitData = data => {
    if (limit && limit.type === 'num' && limit.value > 0) {
      return data.slice(0, limit.value)
    } else if (limit && limit.type === 'date' && isValidDate(limit.value)) {
      const limitDate = Date.parse(limit.value)
      return data.filter(item => Date.parse(item.date) >= limitDate)
    }

    return data
  }

  orderByDate(data)
  finalResult = limitData(data)

  // This is a hack method, because hexo treats time as UTC time
  // so you need to manually convert the time zone
  finalResult.forEach(item => {
    const utcDate = moment.utc(item.date).format('YYYY-MM-DD HH:mm:ss')
    item.date = moment.tz(utcDate, hexo.config.timezone).format('YYYY-MM-DD HH:mm:ss')
    // markdown
    item.content = hexo.render.renderSync({ text: item.content, engine: 'markdown' })
  })

  return finalResult
})

hexo.extend.helper.register('getPageType', (page, isHome) => {
  const { layout, tag, category, type, archive } = page
  if (layout) return layout
  if (tag) return 'tag'
  if (category) return 'category'
  if (archive) return 'archive'
  if (type) {
    if (type === 'tags' || type === 'categories') return type
    else return 'page'
  }
  if (isHome) return 'home'
  return 'post'
})

hexo.extend.helper.register('getVersion', () => {
  const { version } = require('../../package.json')
  return { hexo: hexo.version, theme: version }
})

hexo.extend.helper.register('safeJSON', data => {
  // Safely serialize JSON for embedding in <script> tags
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
})
