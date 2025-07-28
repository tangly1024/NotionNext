/**
 * XML格式化器
 * 
 * 专门处理sitemap XML的生成、格式化和优化。
 * 提供符合搜索引擎标准的XML生成功能。
 * 
 * 主要功能：
 * - 标准sitemap XML生成
 * - XML格式验证和优化
 * - 响应头设置和缓存控制
 * - 压缩和性能优化
 * - 错误处理和统计
 * 
 * @class XMLFormatter
 * @version 2.0.0
 * @since 2024-01-28
 * 
 * @example
 * const formatter = new XMLFormatter({
 *   baseUrl: 'https://example.com',
 *   maxUrls: 50000,
 *   enableValidation: true
 * });
 * 
 * const result = formatter.generateSitemapXML(urls);
 * formatter.setOptimalResponseHeaders(res);
 */

class XMLFormatter {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'https://www.shareking.vip',
      maxUrls: config.maxUrls || 50000,
      maxSizeBytes: config.maxSizeBytes || 50 * 1024 * 1024, // 50MB
      enableCompression: config.enableCompression !== false,
      enableValidation: config.enableValidation !== false,
      prettyPrint: config.prettyPrint || false,
      includeLastmod: config.includeLastmod !== false,
      includeChangefreq: config.includeChangefreq !== false,
      includePriority: config.includePriority !== false,
      ...config
    }
    
    this.stats = {
      urlsProcessed: 0,
      xmlSize: 0,
      generationTime: 0,
      validationErrors: []
    }
  }

  /**
   * 生成完整的sitemap XML
   * @param {Array} urls - URL列表
   * @param {Object} options - 生成选项
   * @returns {Object} 生成结果
   */
  generateSitemapXML(urls, options = {}) {
    const startTime = Date.now()
    this.resetStats()

    try {
      // 验证输入
      const validatedUrls = this.validateUrls(urls)
      
      // 检查URL数量限制
      const limitedUrls = this.applyUrlLimits(validatedUrls)
      
      // 生成XML内容
      const xmlContent = this.buildXMLContent(limitedUrls, options)
      
      // 验证XML格式
      if (this.config.enableValidation) {
        this.validateXML(xmlContent)
      }
      
      // 计算统计信息
      this.stats.urlsProcessed = limitedUrls.length
      this.stats.xmlSize = Buffer.byteLength(xmlContent, 'utf8')
      this.stats.generationTime = Date.now() - startTime
      
      return {
        success: true,
        xml: xmlContent,
        stats: { ...this.stats },
        warnings: this.generateWarnings(urls, limitedUrls)
      }
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stats: { ...this.stats },
        fallbackXML: this.generateFallbackXML()
      }
    }
  }

  /**
   * 验证URL列表
   * @param {Array} urls - URL列表
   * @returns {Array} 验证后的URL列表
   */
  validateUrls(urls) {
    if (!Array.isArray(urls)) {
      throw new Error('URLs must be an array')
    }

    return urls.filter(url => {
      if (!url || typeof url !== 'object') {
        this.stats.validationErrors.push('Invalid URL object')
        return false
      }

      if (!url.loc || typeof url.loc !== 'string') {
        this.stats.validationErrors.push('Missing or invalid loc field')
        return false
      }

      // 验证URL格式
      try {
        new URL(url.loc)
      } catch (e) {
        this.stats.validationErrors.push(`Invalid URL format: ${url.loc}`)
        return false
      }

      // 验证域名
      if (!url.loc.startsWith(this.config.baseUrl)) {
        this.stats.validationErrors.push(`URL not from base domain: ${url.loc}`)
        return false
      }

      return true
    })
  }

  /**
   * 应用URL数量限制
   * @param {Array} urls - URL列表
   * @returns {Array} 限制后的URL列表
   */
  applyUrlLimits(urls) {
    if (urls.length <= this.config.maxUrls) {
      return urls
    }

    // 按优先级排序，保留高优先级的URL
    const sortedUrls = urls.sort((a, b) => {
      const priorityA = parseFloat(a.priority || '0.5')
      const priorityB = parseFloat(b.priority || '0.5')
      return priorityB - priorityA
    })

    return sortedUrls.slice(0, this.config.maxUrls)
  }

  /**
   * 构建XML内容
   * @param {Array} urls - URL列表
   * @param {Object} options - 构建选项
   * @returns {string} XML字符串
   */
  buildXMLContent(urls, options = {}) {
    const indent = this.config.prettyPrint ? '  ' : ''
    const newline = this.config.prettyPrint ? '\n' : ''
    
    // XML声明和根元素
    let xml = `<?xml version="1.0" encoding="UTF-8"?>${newline}`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`
    
    // 添加可选的命名空间
    if (options.includeImages) {
      xml += ` xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`
    }
    if (options.includeNews) {
      xml += ` xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"`
    }
    if (options.includeVideo) {
      xml += ` xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"`
    }
    
    xml += `>${newline}`

    // 生成URL条目
    urls.forEach(url => {
      xml += this.buildUrlEntry(url, indent, newline)
    })

    xml += `</urlset>${newline}`

    // 检查大小限制
    if (Buffer.byteLength(xml, 'utf8') > this.config.maxSizeBytes) {
      throw new Error(`XML size exceeds limit: ${this.config.maxSizeBytes} bytes`)
    }

    return xml
  }

  /**
   * 构建单个URL条目
   * @param {Object} url - URL对象
   * @param {string} indent - 缩进字符
   * @param {string} newline - 换行符
   * @returns {string} URL条目XML
   */
  buildUrlEntry(url, indent, newline) {
    let entry = `${indent}<url>${newline}`
    
    // 必需的loc字段
    entry += `${indent}${indent}<loc>${this.escapeXML(url.loc)}</loc>${newline}`
    
    // 可选字段
    if (this.config.includeLastmod && url.lastmod) {
      const lastmod = this.formatDate(url.lastmod)
      entry += `${indent}${indent}<lastmod>${lastmod}</lastmod>${newline}`
    }
    
    if (this.config.includeChangefreq && url.changefreq) {
      const changefreq = this.validateChangefreq(url.changefreq)
      entry += `${indent}${indent}<changefreq>${changefreq}</changefreq>${newline}`
    }
    
    if (this.config.includePriority && url.priority) {
      const priority = this.validatePriority(url.priority)
      entry += `${indent}${indent}<priority>${priority}</priority>${newline}`
    }
    
    // 扩展字段（图片、视频等）
    if (url.images && Array.isArray(url.images)) {
      url.images.forEach(image => {
        entry += this.buildImageEntry(image, indent, newline)
      })
    }
    
    entry += `${indent}</url>${newline}`
    return entry
  }

  /**
   * 构建图片条目
   * @param {Object} image - 图片对象
   * @param {string} indent - 缩进字符
   * @param {string} newline - 换行符
   * @returns {string} 图片条目XML
   */
  buildImageEntry(image, indent, newline) {
    if (!image.loc) return ''
    
    let entry = `${indent}${indent}<image:image>${newline}`
    entry += `${indent}${indent}${indent}<image:loc>${this.escapeXML(image.loc)}</image:loc>${newline}`
    
    if (image.caption) {
      entry += `${indent}${indent}${indent}<image:caption>${this.escapeXML(image.caption)}</image:caption>${newline}`
    }
    
    if (image.title) {
      entry += `${indent}${indent}${indent}<image:title>${this.escapeXML(image.title)}</image:title>${newline}`
    }
    
    entry += `${indent}${indent}</image:image>${newline}`
    return entry
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
   * 格式化日期
   * @param {string|Date} date - 日期
   * @returns {string} 格式化后的日期
   */
  formatDate(date) {
    if (!date) return new Date().toISOString().split('T')[0]
    
    if (typeof date === 'string') {
      // 验证日期格式
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date
      }
      
      // 尝试解析其他格式
      const parsed = new Date(date)
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0]
      }
    }
    
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    
    // 默认返回当前日期
    return new Date().toISOString().split('T')[0]
  }

  /**
   * 验证changefreq值
   * @param {string} changefreq - 更新频率
   * @returns {string} 验证后的更新频率
   */
  validateChangefreq(changefreq) {
    const validValues = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
    
    if (validValues.includes(changefreq)) {
      return changefreq
    }
    
    // 默认值
    return 'weekly'
  }

  /**
   * 验证priority值
   * @param {string|number} priority - 优先级
   * @returns {string} 验证后的优先级
   */
  validatePriority(priority) {
    const num = parseFloat(priority)
    
    if (isNaN(num)) {
      return '0.5'
    }
    
    // 限制在0.0-1.0范围内
    const clamped = Math.max(0.0, Math.min(1.0, num))
    return clamped.toFixed(1)
  }

  /**
   * 验证XML格式
   * @param {string} xml - XML字符串
   * @throws {Error} 如果XML格式无效
   */
  validateXML(xml) {
    // 基础XML格式检查
    if (!xml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      throw new Error('Missing XML declaration')
    }
    
    // 检查urlset元素（可能包含扩展命名空间）
    if (!xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      throw new Error('Missing or invalid urlset element')
    }
    
    if (!xml.includes('</urlset>')) {
      throw new Error('Missing closing urlset tag')
    }
    
    // 检查URL条目格式
    const urlMatches = xml.match(/<url>/g)
    const urlCloseMatches = xml.match(/<\/url>/g)
    
    if (urlMatches && urlCloseMatches && urlMatches.length !== urlCloseMatches.length) {
      throw new Error('Mismatched URL tags')
    }
    
    // 检查必需的loc字段（如果有URL条目的话）
    if (urlMatches && urlMatches.length > 0) {
      const locMatches = xml.match(/<loc>.*?<\/loc>/g)
      if (!locMatches || locMatches.length !== urlMatches.length) {
        throw new Error('Missing loc elements')
      }
    }
  }

  /**
   * 生成警告信息
   * @param {Array} originalUrls - 原始URL列表
   * @param {Array} processedUrls - 处理后的URL列表
   * @returns {Array} 警告信息列表
   */
  generateWarnings(originalUrls, processedUrls) {
    const warnings = []
    
    if (originalUrls.length > processedUrls.length) {
      warnings.push(`${originalUrls.length - processedUrls.length} URLs were filtered out`)
    }
    
    if (processedUrls.length > this.config.maxUrls) {
      warnings.push(`URL count exceeds limit, truncated to ${this.config.maxUrls}`)
    }
    
    if (this.stats.validationErrors.length > 0) {
      warnings.push(`${this.stats.validationErrors.length} validation errors occurred`)
    }
    
    return warnings
  }

  /**
   * 生成降级XML
   * @returns {string} 降级XML
   */
  generateFallbackXML() {
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
   * 生成sitemap索引文件
   * @param {Array} sitemapUrls - sitemap文件URL列表
   * @returns {string} sitemap索引XML
   */
  generateSitemapIndex(sitemapUrls) {
    const currentDate = new Date().toISOString().split('T')[0]
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
    
    sitemapUrls.forEach(sitemapUrl => {
      xml += `  <sitemap>
    <loc>${this.escapeXML(sitemapUrl.loc)}</loc>
    <lastmod>${sitemapUrl.lastmod || currentDate}</lastmod>
  </sitemap>
`
    })
    
    xml += `</sitemapindex>`
    return xml
  }

  /**
   * 优化响应头设置
   * @param {Object} res - 响应对象
   * @param {Object} options - 选项
   */
  setOptimalResponseHeaders(res, options = {}) {
    const {
      isFallback = false,
      enableCompression = this.config.enableCompression,
      cacheMaxAge = isFallback ? 300 : 3600,
      staleWhileRevalidate = 59
    } = options

    // 设置内容类型
    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    
    // 设置缓存策略
    res.setHeader('Cache-Control', `public, max-age=${cacheMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`)
    
    // 设置其他优化头
    res.setHeader('X-Robots-Tag', 'noindex') // sitemap本身不需要被索引
    res.setHeader('Vary', 'Accept-Encoding')
    
    // 设置安全头
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    
    // 设置性能头
    if (enableCompression) {
      res.setHeader('Content-Encoding', 'gzip')
    }
    
    // 设置ETag用于缓存验证
    if (this.stats.xmlSize > 0) {
      const etag = `"${this.stats.xmlSize}-${this.stats.generationTime}"`
      res.setHeader('ETag', etag)
    }
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      urlsProcessed: 0,
      xmlSize: 0,
      generationTime: 0,
      validationErrors: []
    }
  }

  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return { ...this.stats }
  }

  /**
   * 获取配置信息
   * @returns {Object} 配置信息
   */
  getConfig() {
    return { ...this.config }
  }
}

module.exports = { XMLFormatter }