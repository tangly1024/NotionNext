/**
 * Sitemap错误处理器
 * 
 * 提供统一的错误处理和降级机制，确保sitemap生成的稳定性。
 * 实现多级错误处理策略和智能降级功能。
 * 
 * 主要功能：
 * - 多级错误处理和重试机制
 * - 智能降级策略
 * - 错误统计和监控
 * - 缓存管理和恢复
 * - 日志记录和调试
 * 
 * @class SitemapErrorHandler
 * @version 2.0.0
 * @since 2024-01-28
 * 
 * @example
 * const errorHandler = new SitemapErrorHandler({
 *   baseUrl: 'https://example.com',
 *   maxRetries: 3,
 *   retryDelay: 1000
 * });
 * 
 * const result = await errorHandler.retry(async () => {
 *   return await fetchData();
 * });
 */

class SitemapErrorHandler {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'https://www.shareking.vip',
      maxRetries: config.maxRetries || 2,
      retryDelay: config.retryDelay || 1000,
      cacheMaxAge: config.cacheMaxAge || 24 * 60 * 60 * 1000, // 24小时
      enableLogging: config.enableLogging !== false,
      ...config
    }
    
    this.errorStats = {
      dataFetchErrors: 0,
      processingErrors: 0,
      xmlGenerationErrors: 0,
      fallbackUsed: 0
    }
    
    this.cache = new Map()
  }

  /**
   * 处理数据获取错误
   * @param {Error} error - 错误对象
   * @param {string} siteId - 站点ID
   * @param {Object} context - 上下文信息
   * @returns {Object} 处理结果
   */
  handleDataFetchError(error, siteId, context = {}) {
    this.errorStats.dataFetchErrors++
    
    const errorInfo = {
      type: 'DATA_FETCH_ERROR',
      siteId,
      error: error.message,
      timestamp: new Date().toISOString(),
      context
    }

    if (this.config.enableLogging) {
      console.error(`[Sitemap] Data fetch error for site ${siteId}:`, error.message)
    }

    // 尝试从缓存获取数据
    const cachedData = this.getCachedData(siteId)
    if (cachedData) {
      if (this.config.enableLogging) {
        console.warn(`[Sitemap] Using cached data for site ${siteId}`)
      }
      return {
        success: true,
        data: cachedData,
        source: 'cache',
        errorInfo
      }
    }

    // 返回空数据，让系统继续处理其他站点
    return {
      success: false,
      data: null,
      source: 'none',
      errorInfo
    }
  }

  /**
   * 处理数据处理错误
   * @param {Error} error - 错误对象
   * @param {Object} data - 原始数据
   * @param {Object} context - 上下文信息
   * @returns {Object} 处理结果
   */
  handleProcessingError(error, data, context = {}) {
    this.errorStats.processingErrors++
    
    const errorInfo = {
      type: 'PROCESSING_ERROR',
      error: error.message,
      timestamp: new Date().toISOString(),
      context
    }

    if (this.config.enableLogging) {
      console.error('[Sitemap] Data processing error:', error.message)
    }

    // 尝试基础处理
    try {
      const basicData = this.performBasicProcessing(data)
      return {
        success: true,
        data: basicData,
        source: 'basic_processing',
        errorInfo
      }
    } catch (basicError) {
      if (this.config.enableLogging) {
        console.error('[Sitemap] Basic processing also failed:', basicError.message)
      }
      
      return {
        success: false,
        data: null,
        source: 'none',
        errorInfo: {
          ...errorInfo,
          basicProcessingError: basicError.message
        }
      }
    }
  }

  /**
   * 处理XML生成错误
   * @param {Error} error - 错误对象
   * @param {Array} urls - URL列表
   * @param {Object} context - 上下文信息
   * @returns {Object} 处理结果
   */
  handleXMLGenerationError(error, urls, context = {}) {
    this.errorStats.xmlGenerationErrors++
    
    const errorInfo = {
      type: 'XML_GENERATION_ERROR',
      error: error.message,
      urlCount: urls ? urls.length : 0,
      timestamp: new Date().toISOString(),
      context
    }

    if (this.config.enableLogging) {
      console.error('[Sitemap] XML generation error:', error.message)
    }

    // 尝试生成简化的XML
    try {
      const simplifiedXML = this.generateSimplifiedXML(urls)
      return {
        success: true,
        xml: simplifiedXML,
        source: 'simplified',
        errorInfo
      }
    } catch (simplifiedError) {
      if (this.config.enableLogging) {
        console.error('[Sitemap] Simplified XML generation also failed:', simplifiedError.message)
      }
      
      // 返回最基础的XML
      const fallbackXML = this.generateFallbackXML()
      return {
        success: true,
        xml: fallbackXML,
        source: 'fallback',
        errorInfo: {
          ...errorInfo,
          simplifiedError: simplifiedError.message
        }
      }
    }
  }

  /**
   * 生成降级sitemap
   * @param {string} level - 降级级别 ('level1', 'level2', 'level3')
   * @returns {string} XML字符串
   */
  generateFallbackSitemap(level = 'level2') {
    this.errorStats.fallbackUsed++
    
    if (this.config.enableLogging) {
      console.warn(`[Sitemap] Generating fallback sitemap (${level})`)
    }

    switch (level) {
      case 'level1':
        // 使用缓存数据
        return this.generateFromCache()
      
      case 'level2':
        // 基础静态sitemap
        return this.generateBasicSitemap()
      
      case 'level3':
      default:
        // 最小化sitemap
        return this.generateMinimalSitemap()
    }
  }

  /**
   * 生成基础sitemap（包含基础页面）
   * @returns {string} XML字符串
   */
  generateBasicSitemap() {
    const currentDate = new Date().toISOString().split('T')[0]
    const baseUrl = this.config.baseUrl
    
    const basicPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/archive', priority: '0.8', changefreq: 'daily' },
      { path: '/category', priority: '0.8', changefreq: 'daily' },
      { path: '/search', priority: '0.6', changefreq: 'weekly' },
      { path: '/tag', priority: '0.8', changefreq: 'daily' }
    ]

    let urlsXml = ''
    basicPages.forEach(page => {
      urlsXml += `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    })

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}</urlset>`
  }

  /**
   * 生成最小化sitemap（仅首页）
   * @returns {string} XML字符串
   */
  generateMinimalSitemap() {
    const currentDate = new Date().toISOString().split('T')[0]
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${this.config.baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
  }

  /**
   * 生成简化的XML（处理部分URL）
   * @param {Array} urls - URL列表
   * @returns {string} XML字符串
   */
  generateSimplifiedXML(urls) {
    if (!urls || !Array.isArray(urls)) {
      return this.generateBasicSitemap()
    }

    // 只处理前1000个URL，避免内存问题
    const limitedUrls = urls.slice(0, 1000)
    
    let urlsXml = ''
    limitedUrls.forEach(url => {
      // 基础的XML转义
      const escapedLoc = this.escapeXML(url.loc || '')
      urlsXml += `  <url>
    <loc>${escapedLoc}</loc>
    <lastmod>${url.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority || '0.5'}</priority>
  </url>
`
    })

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}</urlset>`
  }

  /**
   * 生成降级XML
   * @returns {string} XML字符串
   */
  generateFallbackXML() {
    return this.generateMinimalSitemap()
  }

  /**
   * 执行基础数据处理
   * @param {Object} data - 原始数据
   * @returns {Object} 处理后的数据
   */
  performBasicProcessing(data) {
    if (!data || !data.allPages) {
      return { allPages: [] }
    }

    // 基础过滤：只保留已发布的文章
    const validPages = data.allPages.filter(page => {
      return page && 
             page.status === 'Published' && 
             page.slug && 
             typeof page.slug === 'string' &&
             page.slug.trim().length > 0
    })

    return {
      ...data,
      allPages: validPages
    }
  }

  /**
   * 缓存数据
   * @param {string} key - 缓存键
   * @param {*} data - 数据
   */
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 获取缓存数据
   * @param {string} key - 缓存键
   * @returns {*} 缓存的数据或null
   */
  getCachedData(key) {
    const cached = this.cache.get(key)
    if (!cached) return null

    const age = Date.now() - cached.timestamp
    if (age > this.config.cacheMaxAge) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  /**
   * 从缓存生成sitemap
   * @returns {string} XML字符串
   */
  generateFromCache() {
    // 尝试获取最近的缓存数据
    const cacheKeys = Array.from(this.cache.keys())
    let latestData = null
    let latestTimestamp = 0

    for (const key of cacheKeys) {
      const cached = this.cache.get(key)
      if (cached && cached.timestamp > latestTimestamp) {
        latestTimestamp = cached.timestamp
        latestData = cached.data
      }
    }

    if (latestData && latestData.allPages) {
      try {
        // 使用缓存数据生成简化sitemap
        const urls = this.generateUrlsFromPages(latestData.allPages)
        return this.generateSimplifiedXML(urls)
      } catch (error) {
        if (this.config.enableLogging) {
          console.error('[Sitemap] Failed to generate from cache:', error.message)
        }
      }
    }

    // 缓存数据不可用，返回基础sitemap
    return this.generateBasicSitemap()
  }

  /**
   * 从页面数据生成URL列表
   * @param {Array} pages - 页面数据
   * @returns {Array} URL列表
   */
  generateUrlsFromPages(pages) {
    const currentDate = new Date().toISOString().split('T')[0]
    const baseUrl = this.config.baseUrl

    return pages
      .filter(page => page.status === 'Published' && page.slug)
      .map(page => ({
        loc: `${baseUrl}/${page.slug}`,
        lastmod: page.publishDay ? new Date(page.publishDay).toISOString().split('T')[0] : currentDate,
        changefreq: 'weekly',
        priority: '0.8'
      }))
  }

  /**
   * XML转义
   * @param {string} str - 需要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeXML(str) {
    if (typeof str !== 'string') return ''
    
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * 重试机制
   * @param {Function} fn - 要重试的函数
   * @param {number} maxRetries - 最大重试次数
   * @param {number} delay - 重试延迟
   * @returns {Promise} 执行结果
   */
  async retry(fn, maxRetries = this.config.maxRetries, delay = this.config.retryDelay) {
    let lastError
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (i < maxRetries) {
          if (this.config.enableLogging) {
            console.warn(`[Sitemap] Retry ${i + 1}/${maxRetries} after error:`, error.message)
          }
          await this.delay(delay)
        }
      }
    }
    
    throw lastError
  }

  /**
   * 延迟函数
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise} Promise对象
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 获取错误统计信息
   * @returns {Object} 错误统计
   */
  getErrorStats() {
    return { ...this.errorStats }
  }

  /**
   * 重置错误统计
   */
  resetErrorStats() {
    this.errorStats = {
      dataFetchErrors: 0,
      processingErrors: 0,
      xmlGenerationErrors: 0,
      fallbackUsed: 0
    }
  }

  /**
   * 检查系统健康状态
   * @returns {Object} 健康状态信息
   */
  getHealthStatus() {
    const totalErrors = Object.values(this.errorStats).reduce((sum, count) => sum + count, 0)
    const cacheSize = this.cache.size
    
    return {
      healthy: totalErrors < 10, // 错误数量少于10认为健康
      errorStats: this.errorStats,
      cacheSize,
      timestamp: new Date().toISOString()
    }
  }
}

module.exports = { SitemapErrorHandler }