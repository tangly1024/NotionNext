/**
 * 性能优化工具函数
 * 提供各种性能优化相关的工具函数
 */

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func.apply(this, args)
  }
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 请求空闲时间执行
 * @param {Function} callback 回调函数
 * @param {Object} options 选项
 * @returns {number} 请求ID
 */
export function requestIdleCallback(callback, options = {}) {
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    return window.requestIdleCallback(callback, options)
  }
  
  // 降级方案
  return setTimeout(() => {
    const start = Date.now()
    callback({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (Date.now() - start))
      }
    })
  }, 1)
}

/**
 * 取消空闲时间请求
 * @param {number} id 请求ID
 */
export function cancelIdleCallback(id) {
  if (typeof window !== 'undefined' && window.cancelIdleCallback) {
    window.cancelIdleCallback(id)
  } else {
    clearTimeout(id)
  }
}

/**
 * 延迟执行函数
 * @param {number} ms 延迟时间（毫秒）
 * @returns {Promise} Promise对象
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 批量执行函数
 * @param {Array} tasks 任务数组
 * @param {number} batchSize 批次大小
 * @param {number} delay 批次间延迟
 * @returns {Promise} Promise对象
 */
export async function batchExecute(tasks, batchSize = 10, delayMs = 0) {
  const results = []
  
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(task => 
      typeof task === 'function' ? task() : task
    ))
    
    results.push(...batchResults)
    
    if (delayMs > 0 && i + batchSize < tasks.length) {
      await delay(delayMs)
    }
  }
  
  return results
}

/**
 * 内存使用情况
 * @returns {Object} 内存使用信息
 */
export function getMemoryUsage() {
  if (typeof window === 'undefined' || !performance.memory) {
    return null
  }
  
  const memory = performance.memory
  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
    usedMB: Math.round(memory.usedJSHeapSize / 1024 / 1024),
    totalMB: Math.round(memory.totalJSHeapSize / 1024 / 1024),
    limitMB: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
    usagePercent: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
  }
}

/**
 * 网络连接信息
 * @returns {Object} 网络连接信息
 */
export function getConnectionInfo() {
  if (typeof window === 'undefined' || !navigator.connection) {
    return null
  }
  
  const connection = navigator.connection
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData
  }
}

/**
 * 检查是否为慢速网络
 * @returns {boolean} 是否为慢速网络
 */
export function isSlowConnection() {
  const connection = getConnectionInfo()
  if (!connection) return false
  
  return (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true ||
    connection.downlink < 1.5
  )
}

/**
 * 预加载图片
 * @param {string|Array} src 图片地址或地址数组
 * @returns {Promise} Promise对象
 */
export function preloadImages(src) {
  const sources = Array.isArray(src) ? src : [src]
  
  const promises = sources.map(source => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(source)
      img.onerror = () => reject(source)
      img.src = source
    })
  })
  
  return Promise.allSettled(promises)
}

/**
 * 获取页面性能指标
 * @returns {Object} 性能指标
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !performance) {
    return null
  }
  
  const navigation = performance.getEntriesByType('navigation')[0]
  const paint = performance.getEntriesByType('paint')
  
  return {
    // 导航时间
    navigationStart: navigation?.navigationStart || 0,
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.navigationStart || 0,
    loadComplete: navigation?.loadEventEnd - navigation?.navigationStart || 0,
    
    // 网络时间
    dnsLookup: navigation?.domainLookupEnd - navigation?.domainLookupStart || 0,
    tcpConnect: navigation?.connectEnd - navigation?.connectStart || 0,
    request: navigation?.responseStart - navigation?.requestStart || 0,
    response: navigation?.responseEnd - navigation?.responseStart || 0,
    
    // 绘制时间
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    
    // 资源统计
    resourceCount: performance.getEntriesByType('resource').length,
    
    // 时间戳
    timestamp: Date.now()
  }
}

/**
 * 优化图片加载
 * @param {HTMLImageElement} img 图片元素
 * @param {Object} options 选项
 */
export function optimizeImageLoading(img, options = {}) {
  const {
    lazy = true,
    placeholder = true,
    webp = true,
    quality = 75
  } = options
  
  // 懒加载
  if (lazy && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
          }
          observer.unobserve(img)
        }
      })
    })
    
    observer.observe(img)
  }
  
  // WebP支持检测
  if (webp) {
    const supportsWebP = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    }
    
    if (supportsWebP() && img.src && !img.src.includes('.webp')) {
      const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      
      // 测试WebP版本是否存在
      const testImg = new Image()
      testImg.onload = () => {
        img.src = webpSrc
      }
      testImg.src = webpSrc
    }
  }
}

/**
 * 资源提示
 * @param {string} href 资源地址
 * @param {string} as 资源类型
 * @param {string} rel 关系类型
 */
export function addResourceHint(href, as, rel = 'preload') {
  if (typeof document === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = rel
  link.href = href
  if (as) link.as = as
  if (rel === 'preload' && as === 'font') {
    link.crossOrigin = 'anonymous'
  }
  
  document.head.appendChild(link)
}

/**
 * 清理性能条目
 * @param {string} type 条目类型
 */
export function clearPerformanceEntries(type) {
  if (typeof performance !== 'undefined' && performance.clearResourceTimings) {
    if (type) {
      const entries = performance.getEntriesByType(type)
      entries.forEach(entry => {
        performance.clearMarks?.(entry.name)
        performance.clearMeasures?.(entry.name)
      })
    } else {
      performance.clearResourceTimings()
      performance.clearMarks?.()
      performance.clearMeasures?.()
    }
  }
}