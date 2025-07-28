/**
 * URL验证和清理工具类
 * 用于sitemap生成中的URL验证、清理和标准化处理
 */

export class URLValidator {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'https://www.shareking.vip'
    this.blacklistedDomains = config.blacklistedDomains || [
      'github.com',
      'tangly1024.com',
      'docs.tangly1024.com',
      'blog.tangly1024.com',
      'preview.tangly1024.com',
      'netdiskso.xyz'
    ]
    this.maxUrlLength = config.maxUrlLength || 2048
  }

  /**
   * 验证slug是否有效
   * @param {string} slug - 要验证的slug
   * @returns {boolean} 是否有效
   */
  isValidSlug(slug) {
    // 基础验证
    if (!slug || typeof slug !== 'string') {
      return false
    }

    // 长度验证
    if (slug.length === 0 || slug.length > 500) {
      return false
    }

    // 过滤包含协议的slug
    if (slug.includes('https://') || slug.includes('http://')) {
      return false
    }

    // 过滤包含片段标识符的slug
    if (slug.includes('#')) {
      return false
    }

    // 过滤包含查询参数的slug
    if (slug.includes('?')) {
      return false
    }

    // 过滤只有斜杠的slug
    if (slug === '/' || slug === '') {
      return false
    }

    // 过滤包含特殊字符的slug
    const invalidChars = ['<', '>', '"', '|', '^', '`', '{', '}', '\\']
    if (invalidChars.some(char => slug.includes(char))) {
      return false
    }

    return true
  }

  /**
   * 验证完整URL是否有效
   * @param {string} url - 要验证的URL
   * @returns {boolean} 是否有效
   */
  isValidURL(url) {
    // 基础验证
    if (!url || typeof url !== 'string') {
      return false
    }

    // 长度验证
    if (url.length > this.maxUrlLength) {
      return false
    }

    // 协议验证
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false
    }

    // 域名验证 - 必须是我们的基础域名
    if (!url.startsWith(this.baseUrl)) {
      return false
    }

    // 片段标识符验证
    if (url.includes('#')) {
      return false
    }

    // 黑名单域名验证
    for (const domain of this.blacklistedDomains) {
      if (url.includes(domain)) {
        return false
      }
    }

    // URL格式验证
    try {
      new URL(url)
    } catch (error) {
      return false
    }

    return true
  }

  /**
   * 清理和标准化URL
   * @param {string} url - 要清理的URL
   * @returns {string|null} 清理后的URL，如果无效则返回null
   */
  cleanURL(url) {
    if (!url || typeof url !== 'string') {
      return null
    }

    // 去除首尾空白
    url = url.trim()

    // 如果没有协议，添加https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // 如果是相对路径，添加基础URL
      if (url.startsWith('/')) {
        url = this.baseUrl + url
      } else {
        url = this.baseUrl + '/' + url
      }
    }

    // 移除片段标识符
    const hashIndex = url.indexOf('#')
    if (hashIndex !== -1) {
      url = url.substring(0, hashIndex)
    }

    // 移除查询参数（sitemap通常不需要）
    const queryIndex = url.indexOf('?')
    if (queryIndex !== -1) {
      url = url.substring(0, queryIndex)
    }

    // 标准化路径分隔符 - 但保护协议部分
    const protocolMatch = url.match(/^https?:\/\//)
    if (protocolMatch) {
      const protocol = protocolMatch[0]
      const rest = url.substring(protocol.length)
      const cleanRest = rest.replace(/\/+/g, '/').replace(/\/+$/, '')
      url = protocol + cleanRest
    }

    // 如果是根路径，确保正确格式
    if (url === this.baseUrl.replace(/\/+$/, '') || url === this.baseUrl + '/') {
      url = this.baseUrl
    }

    // 验证清理后的URL
    if (!this.isValidURL(url)) {
      return null
    }

    return url
  }

  /**
   * 清理slug并生成完整URL
   * @param {string} slug - 要处理的slug
   * @param {string} locale - 语言前缀（可选）
   * @returns {string|null} 生成的URL，如果无效则返回null
   */
  generateURL(slug, locale = '') {
    if (!this.isValidSlug(slug)) {
      return null
    }

    // 处理locale前缀
    let localePrefix = ''
    if (locale && locale.length > 0 && locale !== 'zh-CN') {
      localePrefix = locale.startsWith('/') ? locale : '/' + locale
    }

    // 处理slug前缀
    const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug

    // 生成完整URL
    const fullUrl = `${this.baseUrl}${localePrefix}/${cleanSlug}`

    return this.cleanURL(fullUrl)
  }

  /**
   * 批量验证URL列表
   * @param {Array} urls - URL对象数组，每个对象应包含loc属性
   * @returns {Object} 包含有效和无效URL的结果对象
   */
  validateURLList(urls) {
    const valid = []
    const invalid = []

    urls.forEach((urlObj, index) => {
      if (!urlObj || !urlObj.loc) {
        invalid.push({
          index,
          url: urlObj,
          reason: 'Missing loc property'
        })
        return
      }

      const cleanedUrl = this.cleanURL(urlObj.loc)
      if (cleanedUrl) {
        valid.push({
          ...urlObj,
          loc: cleanedUrl
        })
      } else {
        invalid.push({
          index,
          url: urlObj,
          reason: 'Invalid URL format'
        })
      }
    })

    return { valid, invalid }
  }

  /**
   * 去重URL列表
   * @param {Array} urls - URL对象数组
   * @returns {Array} 去重后的URL数组
   */
  deduplicateURLs(urls) {
    const uniqueUrlsMap = new Map()

    urls.forEach(url => {
      if (!url.loc) return

      const existing = uniqueUrlsMap.get(url.loc)
      if (!existing || new Date(url.lastmod) > new Date(existing.lastmod)) {
        uniqueUrlsMap.set(url.loc, url)
      }
    })

    return Array.from(uniqueUrlsMap.values())
  }

  /**
   * XML转义处理
   * @param {string} str - 要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeXML(str) {
    if (!str) return ''
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * 获取验证统计信息
   * @param {Array} urls - URL列表
   * @returns {Object} 统计信息
   */
  getValidationStats(urls) {
    const result = this.validateURLList(urls)
    return {
      total: urls.length,
      valid: result.valid.length,
      invalid: result.invalid.length,
      validPercentage: urls.length > 0 ? (result.valid.length / urls.length * 100).toFixed(2) : 0,
      invalidReasons: result.invalid.reduce((acc, item) => {
        acc[item.reason] = (acc[item.reason] || 0) + 1
        return acc
      }, {})
    }
  }
}

// 默认导出单例实例
export default new URLValidator()