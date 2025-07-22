/**
 * 搜索引擎提交管理器
 * 支持自动提交sitemap到各大搜索引擎，管理验证码，处理索引请求
 */

class SearchEngineSubmissionManager {
  constructor(config = {}) {
    this.config = {
      siteUrl: config.siteUrl || '',
      sitemapUrl: config.sitemapUrl || '/sitemap.xml',
      enableAutoSubmission: config.enableAutoSubmission || true,
      submissionInterval: config.submissionInterval || 24 * 60 * 60 * 1000, // 24小时
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 5000,
      ...config
    }

    this.searchEngines = {
      google: {
        name: 'Google',
        enabled: true,
        submissionUrl: 'https://www.google.com/ping',
        indexingApi: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
        verificationMethods: ['html_file', 'html_tag', 'dns', 'google_analytics', 'google_tag_manager'],
        quotaLimits: {
          daily: 200,
          perMinute: 10
        }
      },
      bing: {
        name: 'Bing',
        enabled: true,
        submissionUrl: 'https://www.bing.com/ping',
        indexingApi: 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch',
        verificationMethods: ['html_file', 'html_tag', 'dns'],
        quotaLimits: {
          daily: 10000,
          perMinute: 100
        }
      },
      baidu: {
        name: '百度',
        enabled: true,
        submissionUrl: 'http://data.zz.baidu.com/ping',
        indexingApi: 'http://data.zz.baidu.com/urls',
        verificationMethods: ['html_file', 'html_tag', 'cname'],
        quotaLimits: {
          daily: 3000,
          perMinute: 50
        }
      },
      yandex: {
        name: 'Yandex',
        enabled: false,
        submissionUrl: 'https://webmaster.yandex.com/ping',
        verificationMethods: ['html_file', 'html_tag', 'dns'],
        quotaLimits: {
          daily: 1000,
          perMinute: 20
        }
      }
    }

    this.submissionHistory = new Map()
    this.quotaUsage = new Map()
    this.verificationCodes = new Map()
  }

  /**
   * 提交sitemap到所有启用的搜索引擎
   */
  async submitSitemapToAll() {
    const results = []
    const sitemapUrl = `${this.config.siteUrl}${this.config.sitemapUrl}`

    for (const [engineId, engine] of Object.entries(this.searchEngines)) {
      if (!engine.enabled) continue

      try {
        const result = await this.submitSitemapToEngine(engineId, sitemapUrl)
        results.push({
          engine: engine.name,
          success: result.success,
          message: result.message,
          timestamp: Date.now()
        })
      } catch (error) {
        results.push({
          engine: engine.name,
          success: false,
          message: error.message,
          timestamp: Date.now()
        })
      }
    }

    return results
  }

  /**
   * 提交sitemap到指定搜索引擎
   */
  async submitSitemapToEngine(engineId, sitemapUrl) {
    const engine = this.searchEngines[engineId]
    if (!engine) {
      throw new Error(`Unknown search engine: ${engineId}`)
    }

    // 检查配额限制
    if (!this.checkQuotaLimit(engineId)) {
      throw new Error(`Quota limit exceeded for ${engine.name}`)
    }

    const submissionUrl = this.buildSubmissionUrl(engine, sitemapUrl)
    
    try {
      const response = await this.makeRequest(submissionUrl, {
        method: 'GET',
        timeout: 10000
      })

      // 记录提交历史
      this.recordSubmission(engineId, sitemapUrl, true)
      
      // 更新配额使用
      this.updateQuotaUsage(engineId)

      return {
        success: true,
        message: `Successfully submitted to ${engine.name}`,
        response: response
      }
    } catch (error) {
      this.recordSubmission(engineId, sitemapUrl, false, error.message)
      throw error
    }
  }

  /**
   * 构建提交URL
   */
  buildSubmissionUrl(engine, sitemapUrl) {
    const params = new URLSearchParams({
      sitemap: sitemapUrl
    })

    return `${engine.submissionUrl}?${params.toString()}`
  }

  /**
   * 提交单个URL到搜索引擎索引API
   */
  async submitUrlForIndexing(url, engineId = 'google', type = 'URL_UPDATED') {
    const engine = this.searchEngines[engineId]
    if (!engine || !engine.indexingApi) {
      throw new Error(`Indexing API not available for ${engineId}`)
    }

    if (!this.checkQuotaLimit(engineId)) {
      throw new Error(`Quota limit exceeded for ${engine.name}`)
    }

    try {
      let result
      switch (engineId) {
        case 'google':
          result = await this.submitToGoogleIndexingAPI(url, type)
          break
        case 'bing':
          result = await this.submitToBingIndexingAPI(url)
          break
        case 'baidu':
          result = await this.submitToBaiduIndexingAPI(url)
          break
        default:
          throw new Error(`Indexing API not implemented for ${engineId}`)
      }

      this.updateQuotaUsage(engineId)
      return result
    } catch (error) {
      console.error(`Failed to submit URL to ${engine.name}:`, error)
      throw error
    }
  }

  /**
   * 提交到Google Indexing API
   */
  async submitToGoogleIndexingAPI(url, type = 'URL_UPDATED') {
    const apiKey = process.env.GOOGLE_INDEXING_API_KEY
    if (!apiKey) {
      throw new Error('Google Indexing API key not configured')
    }

    const requestBody = {
      url: url,
      type: type // URL_UPDATED, URL_DELETED
    }

    const response = await this.makeRequest(
      `${this.searchEngines.google.indexingApi}?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    )

    return {
      success: true,
      message: 'Successfully submitted to Google Indexing API',
      response: response
    }
  }

  /**
   * 提交到Bing Indexing API
   */
  async submitToBingIndexingAPI(url) {
    const apiKey = process.env.BING_WEBMASTER_API_KEY
    if (!apiKey) {
      throw new Error('Bing Webmaster API key not configured')
    }

    const requestBody = {
      siteUrl: this.config.siteUrl,
      urlList: [url]
    }

    const response = await this.makeRequest(
      this.searchEngines.bing.indexingApi,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      }
    )

    return {
      success: true,
      message: 'Successfully submitted to Bing Indexing API',
      response: response
    }
  }

  /**
   * 提交到百度链接提交API
   */
  async submitToBaiduIndexingAPI(url) {
    const token = process.env.BAIDU_PUSH_TOKEN
    if (!token) {
      throw new Error('Baidu push token not configured')
    }

    const apiUrl = `${this.searchEngines.baidu.indexingApi}?site=${encodeURIComponent(this.config.siteUrl)}&token=${token}`

    const response = await this.makeRequest(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: url
    })

    return {
      success: true,
      message: 'Successfully submitted to Baidu Push API',
      response: response
    }
  }

  /**
   * 批量提交URL
   */
  async submitUrlsBatch(urls, engineId = 'google') {
    const results = []
    const batchSize = this.getBatchSize(engineId)
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize)
      
      for (const url of batch) {
        try {
          const result = await this.submitUrlForIndexing(url, engineId)
          results.push({
            url,
            success: true,
            result
          })
        } catch (error) {
          results.push({
            url,
            success: false,
            error: error.message
          })
        }
        
        // 添加延迟以避免超出速率限制
        await this.delay(1000)
      }
    }

    return results
  }

  /**
   * 获取批处理大小
   */
  getBatchSize(engineId) {
    const sizes = {
      google: 10,
      bing: 50,
      baidu: 20,
      yandex: 10
    }
    return sizes[engineId] || 10
  }

  /**
   * 检查配额限制
   */
  checkQuotaLimit(engineId) {
    const engine = this.searchEngines[engineId]
    if (!engine.quotaLimits) return true

    const today = new Date().toDateString()
    const usage = this.quotaUsage.get(`${engineId}_${today}`) || 0
    
    return usage < engine.quotaLimits.daily
  }

  /**
   * 更新配额使用
   */
  updateQuotaUsage(engineId) {
    const today = new Date().toDateString()
    const key = `${engineId}_${today}`
    const currentUsage = this.quotaUsage.get(key) || 0
    this.quotaUsage.set(key, currentUsage + 1)
  }

  /**
   * 记录提交历史
   */
  recordSubmission(engineId, url, success, error = null) {
    const key = `${engineId}_${Date.now()}`
    this.submissionHistory.set(key, {
      engineId,
      url,
      success,
      error,
      timestamp: Date.now()
    })

    // 清理旧记录（保留最近30天）
    this.cleanupHistory()
  }

  /**
   * 清理历史记录
   */
  cleanupHistory() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    
    for (const [key, record] of this.submissionHistory) {
      if (record.timestamp < thirtyDaysAgo) {
        this.submissionHistory.delete(key)
      }
    }
  }

  /**
   * 获取提交历史
   */
  getSubmissionHistory(engineId = null, limit = 100) {
    let records = Array.from(this.submissionHistory.values())
    
    if (engineId) {
      records = records.filter(record => record.engineId === engineId)
    }
    
    return records
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  /**
   * 管理验证码
   */
  setVerificationCode(engineId, method, code) {
    const key = `${engineId}_${method}`
    this.verificationCodes.set(key, {
      code,
      method,
      engineId,
      timestamp: Date.now()
    })
  }

  /**
   * 获取验证码
   */
  getVerificationCode(engineId, method) {
    const key = `${engineId}_${method}`
    return this.verificationCodes.get(key)
  }

  /**
   * 生成验证文件内容
   */
  generateVerificationFile(engineId, method) {
    const verification = this.getVerificationCode(engineId, method)
    if (!verification) {
      throw new Error(`No verification code found for ${engineId} ${method}`)
    }

    switch (method) {
      case 'html_file':
        return verification.code
      case 'html_tag':
        return `<meta name="verification" content="${verification.code}" />`
      default:
        return verification.code
    }
  }

  /**
   * 发起HTTP请求
   */
  async makeRequest(url, options = {}) {
    const defaultOptions = {
      timeout: 10000,
      headers: {
        'User-Agent': 'SEO-Submission-Bot/1.0'
      }
    }

    const finalOptions = { ...defaultOptions, ...options }

    try {
      const response = await fetch(url, finalOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`)
    }
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 获取搜索引擎状态
   */
  getEngineStatus() {
    const status = {}
    
    for (const [engineId, engine] of Object.entries(this.searchEngines)) {
      const today = new Date().toDateString()
      const usage = this.quotaUsage.get(`${engineId}_${today}`) || 0
      
      status[engineId] = {
        name: engine.name,
        enabled: engine.enabled,
        quotaUsed: usage,
        quotaLimit: engine.quotaLimits?.daily || 0,
        lastSubmission: this.getLastSubmissionTime(engineId)
      }
    }
    
    return status
  }

  /**
   * 获取最后提交时间
   */
  getLastSubmissionTime(engineId) {
    const records = Array.from(this.submissionHistory.values())
      .filter(record => record.engineId === engineId && record.success)
      .sort((a, b) => b.timestamp - a.timestamp)
    
    return records.length > 0 ? records[0].timestamp : null
  }
}

// 单例实例
const searchEngineSubmission = new SearchEngineSubmissionManager()

export default searchEngineSubmission
export { SearchEngineSubmissionManager }