/**
 * Butterfly
 * Merge CDN
 */

'use strict'

const { version } = require('../../package.json')
const path = require('path')

hexo.extend.filter.register('before_generate', () => {
  const themeConfig = hexo.theme.config
  const { CDN } = themeConfig

  const thirdPartySrc = hexo.render.renderSync({ path: path.join(hexo.theme_dir, '/plugins.yml'), engine: 'yaml' })
  const internalSrc = {
    main: {
      name: 'hexo-theme-butterfly',
      file: 'js/main.js',
      version
    },
    utils: {
      name: 'hexo-theme-butterfly',
      file: 'js/utils.js',
      version
    },
    translate: {
      name: 'hexo-theme-butterfly',
      file: 'js/tw_cn.js',
      version
    },
    local_search: {
      name: 'hexo-theme-butterfly',
      file: 'js/search/local-search.js',
      version
    },
    algolia_js: {
      name: 'hexo-theme-butterfly',
      file: 'js/search/algolia.js',
      version
    }
  }

  const minFile = file => {
    return file.replace(/(?<!\.min)\.(js|css)$/g, ext => '.min' + ext)
  }

  const createCDNLink = (data, type, cond = '') => {
    Object.keys(data).forEach(key => {
      let { name, version, file, other_name } = data[key]
      const cdnjs_name = other_name || name
      const cdnjs_file = file.replace(/^[lib|dist]*\/|browser\//g, '')
      const min_cdnjs_file = minFile(cdnjs_file)
      if (cond === 'internal') file = `source/${file}`
      const min_file = minFile(file)
      const verType = CDN.version ? (type === 'local' ? `?v=${version}` : `@${version}`) : ''

      const value = {
        version,
        name,
        file,
        cdnjs_file,
        min_file,
        min_cdnjs_file,
        cdnjs_name
      }

      const cdnSource = {
        local: cond === 'internal' ? `${cdnjs_file + verType}` : `/pluginsSrc/${name}/${file + verType}`,
        jsdelivr: `https://cdn.jsdelivr.net/npm/${name}${verType}/${min_file}`,
        unpkg: `https://unpkg.com/${name}${verType}/${file}`,
        cdnjs: `https://cdnjs.cloudflare.com/ajax/libs/${cdnjs_name}/${version}/${min_cdnjs_file}`,
        custom: (CDN.custom_format || '').replace(/\$\{(.+?)\}/g, (match, $1) => value[$1])
      }

      data[key] = cdnSource[type]
    })

    if (cond === 'internal') data.main_css = 'css/index.css' + (CDN.version ? `?v=${version}` : '')
    return data
  }

  // delete null value
  const deleteNullValue = obj => {
    if (!obj) return
    for (const i in obj) {
      obj[i] === null && delete obj[i]
    }
    return obj
  }

  themeConfig.asset = Object.assign(
    createCDNLink(internalSrc, CDN.internal_provider, 'internal'),
    createCDNLink(thirdPartySrc, CDN.third_party_provider),
    deleteNullValue(CDN.option)
  )
})
