/**
 * Core Web Vitals 监控工具
 * 收集和分析关键性能指标：FCP, LCP, FID, CLS, TTFB
 */

/**
 * Web Vitals 数据收集器
 */
export class WebVitalsCollector {
  constructor(options = {}) {
    this.options = {
      reportEndpoint: '/api/analytics/web-vitals',
      sampleRate: 0.1, // 10% 采样率
      enableConsoleLog: process.env.NODE_ENV === 'development',
      enableBeacon: true,
      ...options
    }
    
    this.metrics = new Map()
    this.observers = new Map()
    this.isSupported = this.checkSupport()
    
    if (this.isSupported) {
      this.init()
    }
  }

  /**
   * 检查浏览器支持
   */
  checkSupport() {
    return typeof window !== 'undefined' && 
           'PerformanceObserver' in window &&
           'performance' in window
  }

  /**
   * 初始化监控
   */
  init() {
    this.observeFCP()
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeTTFB()
    this.observeINP() // Interaction to Next Paint (新指标)
    
    // 页面隐藏时发送最终数据
    this.setupBeforeUnload()
  }

  /**
   * 监控 First Contentful Paint (FCP)
   */
  observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', {
              value: entry.startTime,
              rating: this.getRating('FCP', entry.startTime),
              timestamp: Date.now(),
              entry
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['paint'] })
      this.observers.set('FCP', observer)
    } catch (error) {
      console.warn('FCP monitoring not supported:', error)
    }
  }

  /**
   * 监控 Largest Contentful Paint (LCP)
   */
  observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('LCP', {
            value: entry.startTime,
            rating: this.getRating('LCP', entry.startTime),
            timestamp: Date.now(),
            element: entry.element?.tagName || 'unknown',
            url: entry.url || '',
            entry
          })
        })
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.set('LCP', observer)
    } catch (error) {
      console.warn('LCP monitoring not supported:', error)
    }
  }

  /**
   * 监控 First Input Delay (FID)
   */
  observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const delay = entry.processingStart - entry.startTime
          this.recordMetric('FID', {
            value: delay,
            rating: this.getRating('FID', delay),
            timestamp: Date.now(),
            eventType: entry.name,
            target: entry.target?.tagName || 'unknown',
            entry
          })
        })
      })
      
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.set('FID', observer)
    } catch (error) {
      console.warn('FID monitoring not supported:', error)
    }
  }

  /**
   * 监控 Cumulative Layout Shift (CLS)
   */
  observeCLS() {
    try {
      let clsValue = 0
      let sessionValue = 0
      let sessionEntries = []
      
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // 只计算非用户输入导致的布局偏移
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0]
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1]
            
            // 如果条目与上一个条目的时间间隔小于1秒，且
            // 与会话中第一个条目的时间间隔小于5秒，则
            // 将条目包含在当前会话中。否则，开始一个新会话。
            if (sessionValue &&
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value
              sessionEntries.push(entry)
            } else {
              sessionValue = entry.value
              sessionEntries = [entry]
            }
            
            // 如果当前会话值大于当前CLS值，
            // 则更新CLS及其相关条目。
            if (sessionValue > clsValue) {
              clsValue = sessionValue
              
              this.recordMetric('CLS', {
                value: clsValue,
                rating: this.getRating('CLS', clsValue),
                timestamp: Date.now(),
                entries: sessionEntries.map(e => ({
                  value: e.value,
                  startTime: e.startTime,
                  sources: e.sources?.map(source => ({
                    element: source.node?.tagName || 'unknown',
                    currentRect: source.currentRect,
                    previousRect: source.previousRect
                  })) || []
                })),
                entry
              })
            }
          }
        })
      })
      
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.set('CLS', observer)
    } catch (error) {
      console.warn('CLS monitoring not supported:', error)
    }
  }

  /**
   * 监控 Time to First Byte (TTFB)
   */
  observeTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const ttfb = entry.responseStart - entry.requestStart
            this.recordMetric('TTFB', {
              value: ttfb,
              rating: this.getRating('TTFB', ttfb),
              timestamp: Date.now(),
              connectionType: navigator.connection?.effectiveType || 'unknown',
              entry
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      this.observers.set('TTFB', observer)
    } catch (error) {
      console.warn('TTFB monitoring not supported:', error)
    }
  }

  /**
   * 监控 Interaction to Next Paint (INP) - 新的Core Web Vital
   */
  observeINP() {
    try {
      let longestInteraction = 0
      
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // 只考虑用户交互
          if (entry.interactionId) {
            const duration = entry.duration
            if (duration > longestInteraction) {
              longestInteraction = duration
              
              this.recordMetric('INP', {
                value: duration,
                rating: this.getRating('INP', duration),
                timestamp: Date.now(),
                eventType: entry.name,
                target: entry.target?.tagName || 'unknown',
                entry
              })
            }
          }
        })
      })
      
      observer.observe({ entryTypes: ['event'] })
      this.observers.set('INP', observer)
    } catch (error) {
      console.warn('INP monitoring not supported:', error)
    }
  }

  /**
   * 记录指标
   */
  recordMetric(name, data) {
    this.metrics.set(name, data)
    
    if (this.options.enableConsoleLog) {
      console.log(`Web Vital [${name}]:`, data)
    }
    
    // 触发自定义事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('web-vital', {
        detail: { name, ...data }
      }))
    }
    
    // 立即报告关键指标
    if (['FCP', 'LCP', 'FID'].includes(name)) {
      this.reportMetric(name, data)
    }
  }

  /**
   * 获取性能评级
   */
  getRating(metricName, value) {
    const thresholds = {
      FCP: { good: 1800, needsImprovement: 3000 },
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      TTFB: { good: 800, needsImprovement: 1800 },
      INP: { good: 200, needsImprovement: 500 }
    }
    
    const threshold = thresholds[metricName]
    if (!threshold) return 'unknown'
    
    if (value <= threshold.good) return 'good'
    if (value <= threshold.needsImprovement) return 'needs-improvement'
    return 'poor'
  }

  /**
   * 报告指标到服务器
   */
  async reportMetric(name, data) {
    // 采样率控制
    if (Math.random() > this.options.sampleRate) return
    
    const payload = {
      metric: name,
      value: data.value,
      rating: data.rating,
      timestamp: data.timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      viewport: this.getViewportInfo(),
      ...data
    }
    
    try {
      if (this.options.enableBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(
          this.options.reportEndpoint,
          JSON.stringify(payload)
        )
      } else {
        await fetch(this.options.reportEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        })
      }
    } catch (error) {
      console.warn('Failed to report web vital:', error)
    }
  }

  /**
   * 获取连接信息
   */
  getConnectionInfo() {
    if (!navigator.connection) return null
    
    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    }
  }

  /**
   * 获取视口信息
   */
  getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    }
  }

  /**
   * 设置页面卸载前的数据发送
   */
  setupBeforeUnload() {
    const sendFinalMetrics = () => {
      // 发送所有收集到的指标
      this.metrics.forEach((data, name) => {
        this.reportMetric(name, { ...data, isFinal: true })
      })
    }
    
    // 页面隐藏时发送
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendFinalMetrics()
      }
    })
    
    // 页面卸载前发送
    window.addEventListener('beforeunload', sendFinalMetrics)
    
    // 页面冻结时发送（移动端）
    window.addEventListener('freeze', sendFinalMetrics)
  }

  /**
   * 获取所有指标
   */
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  /**
   * 获取指标摘要
   */
  getMetricsSummary() {
    const metrics = this.getMetrics()
    const summary = {
      coreWebVitals: {},
      otherMetrics: {},
      overallRating: 'unknown'
    }
    
    // Core Web Vitals
    const coreVitals = ['FCP', 'LCP', 'FID', 'CLS']
    coreVitals.forEach(name => {
      if (metrics[name]) {
        summary.coreWebVitals[name] = {
          value: metrics[name].value,
          rating: metrics[name].rating
        }
      }
    })
    
    // 其他指标
    const otherVitals = ['TTFB', 'INP']
    otherVitals.forEach(name => {
      if (metrics[name]) {
        summary.otherMetrics[name] = {
          value: metrics[name].value,
          rating: metrics[name].rating
        }
      }
    })
    
    // 计算总体评级
    const ratings = Object.values(summary.coreWebVitals).map(m => m.rating)
    if (ratings.length > 0) {
      const goodCount = ratings.filter(r => r === 'good').length
      const poorCount = ratings.filter(r => r === 'poor').length
      
      if (poorCount === 0 && goodCount >= ratings.length * 0.75) {
        summary.overallRating = 'good'
      } else if (poorCount <= ratings.length * 0.25) {
        summary.overallRating = 'needs-improvement'
      } else {
        summary.overallRating = 'poor'
      }
    }
    
    return summary
  }

  /**
   * 销毁监控器
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.metrics.clear()
  }
}

/**
 * 简化的Web Vitals监控函数
 */
export function initWebVitals(options = {}) {
  if (typeof window === 'undefined') return null
  
  const collector = new WebVitalsCollector(options)
  
  // 将collector实例挂载到window对象，方便调试
  if (process.env.NODE_ENV === 'development') {
    window.__webVitalsCollector = collector
  }
  
  return collector
}

/**
 * 获取Web Vitals快照
 */
export function getWebVitalsSnapshot() {
  if (typeof window !== 'undefined' && window.__webVitalsCollector) {
    return window.__webVitalsCollector.getMetricsSummary()
  }
  return null
}

/**
 * Web Vitals阈值配置
 */
export const WEB_VITALS_THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 },
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 }
}

/**
 * 检查指标是否通过Core Web Vitals标准
 */
export function checkCoreWebVitalsPass(metrics) {
  const coreVitals = ['FCP', 'LCP', 'FID', 'CLS']
  const results = {}
  let passCount = 0
  
  coreVitals.forEach(vital => {
    if (metrics[vital]) {
      const rating = metrics[vital].rating
      results[vital] = {
        value: metrics[vital].value,
        rating,
        pass: rating === 'good'
      }
      
      if (rating === 'good') passCount++
    }
  })
  
  return {
    metrics: results,
    passRate: passCount / coreVitals.length,
    overallPass: passCount >= Math.ceil(coreVitals.length * 0.75) // 75%通过率
  }
}