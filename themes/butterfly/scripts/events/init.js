const { deepMerge } = require('hexo-util')
const path = require('path')

// Cache default config to avoid repeated file reads
let cachedDefaultConfig = null

/**
 * Check Hexo version and configuration
 */
function checkHexoEnvironment (hexo) {
  const { version, log, locals } = hexo

  const [major, minor] = version.split('.').map(Number)
  const requiredMajor = 5
  const requiredMinor = 3

  if (major < requiredMajor || (major === requiredMajor && minor < requiredMinor)) {
    log.error('Please update Hexo to V5.3.0 or higher!')
    log.error('請把 Hexo 升級到 V5.3.0 或更高的版本！')
    process.exit(-1)
  }

  // Check for deprecated configuration file
  if (locals.get) {
    const data = locals.get('data')
    if (data && data.butterfly) {
      log.error("'butterfly.yml' is deprecated. Please use '_config.butterfly.yml'")
      log.error("'butterfly.yml' 已經棄用，請使用 '_config.butterfly.yml'")
      process.exit(-1)
    }
  }
}

/**
 * Load default configuration
 */
function loadDefaultConfig () {
  if (cachedDefaultConfig) {
    return cachedDefaultConfig
  }

  const configPath = path.join(__dirname, '../common/default_config.js')
  cachedDefaultConfig = require(configPath)
  return cachedDefaultConfig
}

/**
 * Process comment system configuration
 */
function processCommentConfig (themeConfig) {
  const { comments } = themeConfig
  if (!comments || !comments.use) {
    return
  }

  let { use } = comments

  if (!Array.isArray(use)) {
    use = typeof use === 'string' ? use.split(',') : [use]
  }

  use = use
    .map(item => {
      if (typeof item !== 'string') return item
      return item.trim().toLowerCase().replace(/\b[a-z]/g, s => s.toUpperCase())
    })
    .filter(Boolean)

  // Handle Disqus and Disqusjs conflict
  if (use.includes('Disqus') && use.includes('Disqusjs')) {
    hexo.log.warn('Disqus and Disqusjs conflict detected, keeping only the first one')
    hexo.log.warn('檢測到 Disqus 和 Disqusjs 衝突，只保留第一個')
    use = [use[0]]
  }

  themeConfig.comments.use = use
}

hexo.extend.filter.register('before_generate', () => {
  checkHexoEnvironment(hexo)

  const defaultConfig = loadDefaultConfig()
  hexo.theme.config = deepMerge(defaultConfig, hexo.theme.config)

  processCommentConfig(hexo.theme.config)
}, 1)
