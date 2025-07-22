import { useEffect, useState, useRef } from 'react'

/**
 * 性能监控组件
 * 监控Core Web Vitals和其他性能指标
 */
export default function PerformanceMonitor({
  enableReporting = false,
  reportEndpoint = '/api/analytics/performance',
  sampleRate = 0.1, // 10%的用户进行性能监控
  enableConsoleLog = process.env.NODE_ENV === 'development',
  onMetric,
  thresholds = {
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    TTFB: 800  // Time to First Byte
  }
}) {
  const [metrics, setMetrics] = useState({})
  const [isSupported, setIsSupported] = useState(false)
  const observerRef = useRef(null)
  const reportedMetrics = useRef(new Set())

  // 检查浏览器支持
  useEffect(() => {
    const supported = typeof window !== 'undefined' && 
                     'PerformanceObserver' in window &&
                     'performance' in window
    setIsSupported(supported)
  }, [])

  // 报告性能指标
  const reportMetric = async (metric) => {
    // 避免重复报告
    if (reportedMetrics.current.has(metric.name)) return
    reportedMetrics.current.add(metric.name)

    // 采样率控制
    if (Math.random() > sampleRate) return

    const metricData = {
      name: metric.name,
      value: metric.value,
      rating: getRating(metric.name, metric.value),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: getConnectionInfo(),
      deviceInfo: getDeviceInfo()
    }

    // 控制台输出（开发环境）
    if (enableConsoleLog) {
      console.log(`Performance Metric [${metric.name}]:`, metricData)
    }

    // 触发回调
    if (typeof onMetric === 'function') {
      onMetric(metricData)
    }

    // 更新状态
    setMetrics(prev => ({
      ...prev,
      [metric.name]: metricData
    }))

    // 发送到服务器
    if (enableReporting && reportEndpoint) {
      try {
        await fetch(reportEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(metricData)
        })
      } catch (error) {
        console.warn('Failed to report performance metric:', error)
      }
    }
  }

  // 获取性能评级
  const getRating = (name, value) => {
    const threshold = thresholds[name]
    if (!threshold) return 'unknown'

    switch (name) {
      case 'FCP':
      case 'LCP':
      case 'FID':
      case 'TTFB':
        if (value <= threshold * 0.75) return 'good'
        if (value <= threshold) return 'needs-improvement'
        return 'poor'
      
      case 'CLS':
        if (value <= 0.1) return 'good'
        if (value <= 0.25) return 'needs-improvement'
        return 'poor'
      
      default:
        return 'unknown'
    }
  }

  // 获取连接信息
  const getConnectionInfo = () => {
    if (!navigator.connection) return null
    
    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    }
  }

  // 获取设备信息
  const getDeviceInfo = () => {
    return {
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      memory: navigator.deviceMemory || null,
      hardwareConcurrency: navigator.hardwareConcurrency || null
    }
  }

  // 初始化性能监控
  useEffect(() => {
    if (!isSupported) return

    // 监控各种性能指标
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              reportMetric({
                name: 'FCP',
                value: entry.startTime,
                entry
              })
            }
            break

          case 'largest-contentful-paint':
            reportMetric({
              name: 'LCP',
              value: entry.startTime,
              entry
            })
            break

          case 'first-input':
            reportMetric({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              entry
            })
            break

          case 'layout-shift':
            // 累积布局偏移
            if (!entry.hadRecentInput) {
              setMetrics(prev => {
                const currentCLS = prev.CLS?.value || 0
                const newCLS = currentCLS + entry.value
                
                const clsMetric = {
                  name: 'CLS',
                  value: newCLS,
                  entry
                }
                
                // 只在CLS值稳定后报告
                setTimeout(() => reportMetric(clsMetric), 1000)
                
                return {
                  ...prev,
                  CLS: clsMetric
                }
              })
            }
            break

          case 'navigation':
            // Time to First Byte
            reportMetric({
              name: 'TTFB',
              value: entry.responseStart - entry.requestStart,
              entry
            })
            
            // 其他导航时间
            reportMetric({
              name: 'DOM_CONTENT_LOADED',
              value: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              entry
            })
            
            reportMetric({
              name: 'LOAD_COMPLETE',
              value: entry.loadEventEnd - entry.loadEventStart,
              entry
            })
            break

          case 'resource':
            // 监控关键资源加载时间
            if (entry.name.includes('.css') || 
                entry.name.includes('.js') || 
                entry.name.includes('font')) {
              reportMetric({
                name: 'RESOURCE_LOAD',
                value: entry.duration,
                resourceType: entry.initiatorType,
                resourceName: entry.name,
                entry
              })
            }
            break
        }
      })
    })

    // 观察所有支持的性能指标
    try {
      observer.observe({ 
        entryTypes: [
          'paint',
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
          'navigation',
          'resource'
        ] 
      })
      observerRef.current = observer
    } catch (error) {
      console.warn('Some performance metrics not supported:', error)
      
      // 降级处理，只观察支持的指标
      const supportedTypes = []
      const testTypes = ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift']
      
      testTypes.forEach(type => {
        try {
          observer.observe({ entryTypes: [type] })
          supportedTypes.push(type)
        } catch (e) {
          // 忽略不支持的类型
        }
      })
      
      if (supportedTypes.length > 0) {
        observerRef.current = observer
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isSupported])

  // 监控长任务
  useEffect(() => {
    if (!isSupported) return

    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        reportMetric({
          name: 'LONG_TASK',
          value: entry.duration,
          startTime: entry.startTime,
          entry
        })
      })
    })

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (error) {
      console.warn('Long task monitoring not supported:', error)
    }

    return () => longTaskObserver.disconnect()
  }, [isSupported])

  // 监控内存使用情况
  useEffect(() => {
    if (!isSupported || !performance.memory) return

    const reportMemoryUsage = () => {
      const memory = performance.memory
      reportMetric({
        name: 'MEMORY_USAGE',
        value: memory.usedJSHeapSize,
        totalHeapSize: memory.totalJSHeapSize,
        heapSizeLimit: memory.jsHeapSizeLimit,
        entry: memory
      })
    }

    // 定期报告内存使用情况
    const interval = setInterval(reportMemoryUsage, 30000) // 每30秒

    return () => clearInterval(interval)
  }, [isSupported])

  // 页面可见性变化监控
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // 页面隐藏时，报告最终的性能指标
        Object.values(metrics).forEach(metric => {
          if (!reportedMetrics.current.has(`${metric.name}_final`)) {
            reportMetric({
              ...metric,
              name: `${metric.name}_final`,
              isFinal: true
            })
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [metrics])

  // 不渲染任何UI
  return null
}

/**
 * 性能指标Hook
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleMetric = (metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric
      }))
    }

    // 监听性能指标事件
    window.addEventListener('performance-metric', handleMetric)

    // 检查是否已有指标数据
    if (window.__PERFORMANCE_METRICS__) {
      setMetrics(window.__PERFORMANCE_METRICS__)
      setIsLoading(false)
    }

    const timer = setTimeout(() => setIsLoading(false), 5000)

    return () => {
      window.removeEventListener('performance-metric', handleMetric)
      clearTimeout(timer)
    }
  }, [])

  const getMetricRating = (name) => {
    const metric = metrics[name]
    return metric ? metric.rating : 'unknown'
  }

  const getMetricValue = (name) => {
    const metric = metrics[name]
    return metric ? metric.value : null
  }

  return {
    metrics,
    isLoading,
    getMetricRating,
    getMetricValue,
    coreWebVitals: {
      FCP: metrics.FCP,
      LCP: metrics.LCP,
      FID: metrics.FID,
      CLS: metrics.CLS
    }
  }
}

/**
 * 性能预算检查器
 */
export function PerformanceBudgetChecker({ budgets, onBudgetExceeded }) {
  const { metrics } = usePerformanceMetrics()

  useEffect(() => {
    Object.entries(budgets).forEach(([metricName, budget]) => {
      const metric = metrics[metricName]
      if (metric && metric.value > budget) {
        const violation = {
          metric: metricName,
          value: metric.value,
          budget,
          excess: metric.value - budget,
          timestamp: Date.now()
        }

        console.warn(`Performance budget exceeded:`, violation)
        
        if (typeof onBudgetExceeded === 'function') {
          onBudgetExceeded(violation)
        }
      }
    })
  }, [metrics, budgets, onBudgetExceeded])

  return null
}