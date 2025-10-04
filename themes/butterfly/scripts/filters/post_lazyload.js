/**
 * Butterfly
 * Lazyload filter
 * Replace src with data-lazy-src for lazy loading
 */

'use strict'

const urlFor = require('hexo-util').url_for.bind(hexo)

const lazyload = htmlContent => {
  if (hexo.theme.config.lazyload.native) {
    // Use more precise replacement: only replace img tags in HTML, not content inside script tags
    return htmlContent.replace(/(<img(?![^>]*?\bloading=)(?:\s[^>]*?)?>)(?![^<]*<\/script>)/gi, match => {
      return match.replace(/>$/, ' loading=\'lazy\'>')
    })
  }

  const bg = hexo.theme.config.lazyload.placeholder ? urlFor(hexo.theme.config.lazyload.placeholder) : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

  // Handle src attributes with double quotes, single quotes, or no quotes (unified approach)
  // Matches: src="..." or src='...' or src=... (e.g., after minification by hexo-minify)
  return htmlContent.replace(/(<img(?![^>]*?\bdata-lazy-src=)(?:\s[^>]*?)?\ssrc=)(?:"([^"]*)"|'([^']*)'|([^\s>]+))(?![^<]*<\/script>)/gi, (match, prefix, srcDoubleQuote, srcSingleQuote, srcNoQuote) => {
    const src = srcDoubleQuote || srcSingleQuote || srcNoQuote
    return `${prefix}"${bg}" data-lazy-src="${src}"`
  })
}

hexo.extend.filter.register('after_render:html', data => {
  const { enable, field } = hexo.theme.config.lazyload
  if (!enable || field !== 'site') return
  return lazyload(data)
})

hexo.extend.filter.register('after_post_render', data => {
  const { enable, field } = hexo.theme.config.lazyload
  if (!enable || field !== 'post') return
  data.content = lazyload(data.content)
  return data
})
