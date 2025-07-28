/**
 * Sitemap性能监控器
 * 
 * 提供性能监控、缓存管理和资源优化功能。
 * 实现全面的性能监控和智能缓存策略。
 * 
 * 主要功能：
 * - 生成时间和内存使用监控
 * - 智能缓存和降级策略
 * - 并发控制和超时保护
 * - 性能统计和健康检查
 * - 自动化性能优化
 * 
 * @class SitemapPerformanceMonitor
 * @version 2.0.0
 * @since 2024-01-28
 * 
 * @example
 * const monitor = new SitemapPerformanceMonitor({
 *   maxGenerationTime: 10000,
 *   enableCache: true,
 *   enableMonitoring: true
 * });
 * 
 * const result = await monitor.executeWithMonitoring(
 *   generatorFunction,
 *   'cache-key'
 * );
 */

class SitemapPerformanceMonitor {
  constructor(config = {}) {
    this.config = {
      // 性能限制
      maxGenerationTime: config.maxGenerationTime || 10000, // 10秒
      maxMemoryUsage: config.maxMemoryUsage || 512 * 1024 * 1024, // 512MB
      maxConcurrentRequests: config.maxConcurrentRequests || 5,
      
      // 缓存配置
      enableCache: config.enableCache !== false,
      cacheMaxAge: config.cacheMaxAge || 3600 * 1000, // 1小时
      cacheMaxSize: config.cacheMaxSize || 100, // 最大缓存条目数
      
      // 监控配置
      enableMonitoring: config.enableMonitoring !== false,
      enableMemoryMonitoring: config.enableMemoryMonitoring !== false,
      enableTimeoutProtection: config.enableTimeoutProtection !== false,
      
      // 日志配置
      enableLogging: config.enableLogging !== false,
      logLevel: config.logLevel || 'info', // 'debug', 'info', 'warn', 'error'
      
      ...config
    }
    
    // 性能统计
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageGenerationTime: 0,
      peakMemoryUsage: 0,
      concurrentRequests: 0,
      timeouts: 0
    }
    
    // 缓存存储
    this.cache = new Map()
    this.cacheTimestamps = new Map()
    
    // 并发控制
    this.activeRequests = new Set()
    this.requestQueue = []
    
    // 性能监控
    this.performanceHistory = []
    this.memorySnapshots = []
    
    // 初始化监控
    this.monitorInterval = null
    if (this.config.enableMemoryMonitoring) {
      this.startMemoryMonitoring()
    }
  }

  /**
   * 执行带性能监控的sitemap生成
   * @param {Function} generatorFn - sitemap生成函数
   * @param {string} cacheKey - 缓存键
   * @param {Object} options - 选项
   * @returns {Promise<Object>} 生成结果
   */
  async executeWithMonitoring(generatorFn, cacheKey, options = {}) {
    const requestId = this.generateRequestId()
    const startTime = Date.now()
    
    try {
      // 更新统计
      this.stats.totalRequests++
      this.stats.concurrentRequests++
      this.activeRequests.add(requestId)
      
      // 并发控制
      if (this.stats.concurrentRequests > this.config.maxConcurrentRequests) {
        await this.waitForSlot(requestId)
      }
      
      // 检查缓存
      if (this.config.enableCache && cacheKey) {
        const cachedResult = this.getCachedResult(cacheKey)
        if (cachedResult) {
          this.stats.cacheHits++
          this.log('info', `Cache hit for key: ${cacheKey}`)
          return {
            ...cachedResult,
            fromCache: true,
            requestId
          }
        } else {
          this.stats.cacheMisses++
        }
      }
      
      // 执行生成函数（带超时保护）
      const result = await this.executeWithTimeout(generatorFn, options)
      
      // 记录性能数据
      const generationTime = Date.now() - startTime
      this.recordPerformance(requestId, generationTime, result)
      
      // 缓存结果
      if (this.config.enableCache && cacheKey && result.success) {
        this.setCachedResult(cacheKey, result)
      }
      
      this.stats.successfulRequests++
      this.log('info', `Sitemap generated successfully in ${generationTime}ms`)
      
      return {
        ...result,
        fromCache: false,
        requestId,
        generationTime
      }
      
    } catch (error) {
      this.stats.failedRequests++
      this.log('error', `Sitemap generation failed: ${error.message}`)
      
      // 尝试返回缓存的结果作为降级
      if (this.config.enableCache && cacheKey) {
        const staleResult = this.getStaleResult(cacheKey)
        if (staleResult) {
          this.log('warn', `Using stale cache for key: ${cacheKey}`)
          return {
            ...staleResult,
            fromCache: true,
            isStale: true,
            requestId,
            error: error.message
          }
        }
      }
      
      throw error
      
    } finally {
      // 清理
      this.stats.concurrentRequests--
      this.activeRequests.delete(requestId)
      this.processQueue()
    }
  }

  /**
   * 带超时保护的执行
   * @param {Function} fn - 要执行的函数
   * @param {Object} options - 选项
   * @returns {Promise} 执行结果
   */
  async executeWithTimeout(fn, options = {}) {
    const timeout = options.timeout || this.config.maxGenerationTime
    
    if (!this.config.enableTimeoutProtection) {
      return await fn()
    }
    
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.stats.timeouts++
        reject(new Error(`Sitemap generation timeout after ${timeout}ms`))
      }, timeout)
      
      try {
        const result = await fn()
        clearTimeout(timeoutId)
        resolve(result)
      } catch (error) {
        clearTimeout(timeoutId)
        reject(error)
      }
    })
  }

  /**
   * 等待并发槽位
   * @param {string} requestId - 请求ID
   * @returns {Promise} Promise对象
   */
  async waitForSlot(requestId) {
    return new Promise((resolve) => {
      this.requestQueue.push({ requestId, resolve })
      this.log('debug', `Request ${requestId} queued, queue length: ${this.requestQueue.length}`)
    })
  }

  /**
   * 处理请求队列
   */
  processQueue() {
    if (this.requestQueue.length > 0 && this.stats.concurrentRequests < this.config.maxConcurrentRequests) {
      const { requestId, resolve } = this.requestQueue.shift()
      this.log('debug', `Processing queued request ${requestId}`)
      resolve()
    }
  }

  /**
   * 获取缓存结果
   * @param {string} key - 缓存键
   * @returns {Object|null} 缓存结果
   */
  getCachedResult(key) {
    if (!this.cache.has(key)) {
      return null
    }
    
    const timestamp = this.cacheTimestamps.get(key)
    const age = Date.now() - timestamp
    
    if (age > this.config.cacheMaxAge) {
      // 缓存过期，但保留用于降级
      return null
    }
    
    return this.cache.get(key)
  }

  /**
   * 获取过期的缓存结果（用于降级）
   * @param {string} key - 缓存键
   * @returns {Object|null} 过期的缓存结果
   */
  getStaleResult(key) {
    if (!this.cache.has(key)) {
      return null
    }
    
    const timestamp = this.cacheTimestamps.get(key)
    const age = Date.now() - timestamp
    
    // 只要缓存存在就返回，即使过期（用于降级）
    if (age < 24 * 60 * 60 * 1000) { // 24小时内的过期缓存可用于降级
      return this.cache.get(key)
    }
    
    return null
  }

  /**
   * 设置缓存结果
   * @param {string} key - 缓存键
   * @param {Object} result - 结果对象
   */
  setCachedResult(key, result) {
    // 存储缓存（移除一些不需要缓存的字段）
    const cacheableResult = {
      ...result,
      // 移除可能很大的字段
      xml: result.xml ? result.xml.substring(0, 1000) + '...' : undefined // 只缓存XML的开头部分作为验证
    }
    
    this.cache.set(key, cacheableResult)
    this.cacheTimestamps.set(key, Date.now())
    
    // 检查缓存大小限制（在添加后检查）
    while (this.cache.size > this.config.cacheMaxSize) {
      this.evictOldestCache()
    }
    
    this.log('debug', `Cached result for key: ${key}`)
  }

  /**
   * 清除最旧的缓存条目
   */
  evictOldestCache() {
    let oldestKey = null
    let oldestTime = Date.now()
    
    for (const [key, timestamp] of this.cacheTimestamps.entries()) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp
        oldestKey = key
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey)
      this.cacheTimestamps.delete(oldestKey)
      this.log('debug', `Evicted cache entry: ${oldestKey}`)
    }
  }

  /**
   * 记录性能数据
   * @param {string} requestId - 请求ID
   * @param {number} generationTime - 生成时间
   * @param {Object} result - 结果对象
   */
  recordPerformance(requestId, generationTime, result) {
    // 更新平均生成时间
    const totalTime = this.stats.averageGenerationTime * (this.stats.totalRequests - 1) + generationTime
    this.stats.averageGenerationTime = totalTime / this.stats.totalRequests
    
    // 记录性能历史
    const performanceRecord = {
      requestId,
      timestamp: Date.now(),
      generationTime,
      memoryUsage: this.getCurrentMemoryUsage(),
      urlCount: result.stats?.urlsProcessed || 0,
      xmlSize: result.stats?.xmlSize || 0,
      cacheHit: false
    }
    
    this.performanceHistory.push(performanceRecord)
    
    // 保持历史记录在合理范围内
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory = this.performanceHistory.slice(-500)
    }
    
    // 检查性能阈值
    this.checkPerformanceThresholds(performanceRecord)
  }

  /**
   * 检查性能阈值
   * @param {Object} record - 性能记录
   */
  checkPerformanceThresholds(record) {
    // 检查生成时间阈值
    if (record.generationTime > this.config.maxGenerationTime * 0.8) {
      this.log('warn', `Generation time approaching limit: ${record.generationTime}ms`)
    }
    
    // 检查内存使用阈值
    if (record.memoryUsage > this.config.maxMemoryUsage * 0.8) {
      this.log('warn', `Memory usage approaching limit: ${(record.memoryUsage / 1024 / 1024).toFixed(2)}MB`)
    }
    
    // 更新峰值内存使用
    if (record.memoryUsage > this.stats.peakMemoryUsage) {
      this.stats.peakMemoryUsage = record.memoryUsage
    }
  }

  /**
   * 开始内存监控
   */
  startMemoryMonitoring() {
    if (typeof process === 'undefined' || !process.memoryUsage) {
      this.log('warn', 'Memory monitoring not available in this environment')
      return
    }
    
    this.monitorInterval = setInterval(() => {
      const memoryUsage = this.getCurrentMemoryUsage()
      
      this.memorySnapshots.push({
        timestamp: Date.now(),
        memoryUsage,
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal
      })
      
      // 保持快照在合理范围内
      if (this.memorySnapshots.length > 1440) { // 24小时的分钟数
        this.memorySnapshots = this.memorySnapshots.slice(-720) // 保留12小时
      }
      
      // 检查内存泄漏
      this.detectMemoryLeaks()
      
    }, 60000) // 每分钟检查一次
  }

  /**
   * 停止内存监控
   */
  stopMemoryMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval)
      this.monitorInterval = null
    }
  }

  /**
   * 检测内存泄漏
   */
  detectMemoryLeaks() {
    if (this.memorySnapshots.length < 10) return
    
    const recent = this.memorySnapshots.slice(-10)
    const trend = this.calculateMemoryTrend(recent)
    
    // 如果内存使用持续增长且超过阈值，发出警告
    if (trend > 0.1 && recent[recent.length - 1].memoryUsage > this.config.maxMemoryUsage * 0.7) {
      this.log('warn', `Potential memory leak detected. Memory trend: +${(trend * 100).toFixed(2)}%`)
    }
  }

  /**
   * 计算内存使用趋势
   * @param {Array} snapshots - 内存快照数组
   * @returns {number} 趋势值
   */
  calculateMemoryTrend(snapshots) {
    if (snapshots.length < 2) return 0
    
    const first = snapshots[0].memoryUsage
    const last = snapshots[snapshots.length - 1].memoryUsage
    
    return (last - first) / first
  }

  /**
   * 获取当前内存使用量
   * @returns {number} 内存使用量（字节）
   */
  getCurrentMemoryUsage() {
    if (typeof process === 'undefined' || !process.memoryUsage) {
      return 0
    }
    
    return process.memoryUsage().heapUsed
  }

  /**
   * 生成请求ID
   * @returns {string} 请求ID
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 获取性能统计
   * @returns {Object} 性能统计信息
   */
  getPerformanceStats() {
    const currentMemory = this.getCurrentMemoryUsage()
    
    return {
      ...this.stats,
      currentMemoryUsage: currentMemory,
      cacheSize: this.cache.size,
      queueLength: this.requestQueue.length,
      cacheHitRate: this.stats.totalRequests > 0 
        ? (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100).toFixed(2) + '%'
        : '0%',
      successRate: this.stats.totalRequests > 0
        ? (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(2) + '%'
        : '0%'
    }
  }

  /**
   * 获取性能历史
   * @param {number} limit - 限制数量
   * @returns {Array} 性能历史记录
   */
  getPerformanceHistory(limit = 100) {
    return this.performanceHistory.slice(-limit)
  }

  /**
   * 获取内存快照
   * @param {number} limit - 限制数量
   * @returns {Array} 内存快照
   */
  getMemorySnapshots(limit = 100) {
    return this.memorySnapshots.slice(-limit)
  }

  /**
   * 清理缓存
   * @param {boolean} force - 是否强制清理所有缓存
   */
  clearCache(force = false) {
    if (force) {
      this.cache.clear()
      this.cacheTimestamps.clear()
      this.log('info', 'All cache cleared')
    } else {
      // 只清理过期的缓存
      const now = Date.now()
      const expiredKeys = []
      
      for (const [key, timestamp] of this.cacheTimestamps.entries()) {
        if (now - timestamp > this.config.cacheMaxAge) {
          expiredKeys.push(key)
        }
      }
      
      expiredKeys.forEach(key => {
        this.cache.delete(key)
        this.cacheTimestamps.delete(key)
      })
      
      this.log('info', `Cleared ${expiredKeys.length} expired cache entries`)
    }
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageGenerationTime: 0,
      peakMemoryUsage: 0,
      concurrentRequests: 0,
      timeouts: 0
    }
    
    this.performanceHistory = []
    this.log('info', 'Performance stats reset')
  }

  /**
   * 日志记录
   * @param {string} level - 日志级别
   * @param {string} message - 日志消息
   */
  log(level, message) {
    if (!this.config.enableLogging) return
    
    const levels = { debug: 0, info: 1, warn: 2, error: 3 }
    const configLevel = levels[this.config.logLevel] || 1
    const messageLevel = levels[level] || 1
    
    if (messageLevel >= configLevel) {
      const timestamp = new Date().toISOString()
      console[level](`[${timestamp}] [SitemapPerformance] ${message}`)
    }
  }

  /**
   * 获取健康状态
   * @returns {Object} 健康状态信息
   */
  getHealthStatus() {
    const stats = this.getPerformanceStats()
    const currentMemory = this.getCurrentMemoryUsage()
    
    const issues = []
    
    // 检查各种健康指标
    if (stats.averageGenerationTime > this.config.maxGenerationTime * 0.8) {
      issues.push('High generation time')
    }
    
    if (currentMemory > this.config.maxMemoryUsage * 0.8) {
      issues.push('High memory usage')
    }
    
    if (parseFloat(stats.successRate) < 95) {
      issues.push('Low success rate')
    }
    
    if (stats.timeouts > 0) {
      issues.push('Timeouts detected')
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      stats,
      timestamp: new Date().toISOString()
    }
  }
}

module.exports = { SitemapPerformanceMonitor }