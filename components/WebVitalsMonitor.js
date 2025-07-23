import { useEffect, useState, useCallback, useRef } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * Core Web Vitals 监控组件
 * 实时监控FCP、LCP、FID、CLS等关键性能指标
 */
export default function WebVitalsMonitor({ 
  onMetricsUpdate,
  enableReporting = true,
  enableConsoleLog = false 
}) {
  const [metrics, setMetrics] = useState({
    FCP: null,  // First Contentful Paint
    LCP: null,  // Largest Contentful Paint
    FID: null,  // First Input Delay
    CLS: null,  // Cumulative Layout Shift
    TTFB: null, // Time to First Byte
    INP: null   // Interaction to Next Paint
  })

  const [performanceGrade, setPerformanceGrade] = useState('unknown')

  // 计算性能评分
  const calculateGrade = useCallback((currentMetrics) => {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    }

    let score = 0
    let totalMetrics = 0

    Object.entries(currentMetrics).forEach(([key, value]) => {
      if (value !== null && thresholds[key]) {
        totalMetrics++
        const threshold = thresholds[key]
        
        if (value <= threshold.good) {
          score += 100
        } else if (value <= threshold.poor) {
          score += 50
        } else {
          score += 0
        }
      }
    })

    if (totalMetrics === 0) return 'unknown'

    const averageScore = score / totalMetrics
    
    if (averageScore >= 80) return 'good'
    if (averageScore >= 50) return 'needs-improvement'
    return 'poor'
  }, [])

  // 更新指标 - 使用useRef避免无限循环
  const lastReportedRef = useRef({})
  
  const updateMetric = useCallback((name, value) => {
    // 避免重复更新相同的值
    if (lastReportedRef.current[name] === value) {
      return
    }
    
    lastReportedRef.current[name] = value
    
    setMetrics(prev => {
      const updated = { ...prev, [name]: value }
      return updated
    })
    
    // 控制台日志（限制频率）
    if (enableConsoleLog) {
      console.log(`Web Vital ${name}:`, value)
    }
  }, [enableConsoleLog])

  // 单独的useEffect来计算和更新性能评分
  useEffect(() => {
    const grade = calculateGrade(metrics)
    setPerformanceGrade(prevGrade => {
      if (prevGrade !== grade) {
        // 异步回调通知，避免在渲染过程中更新状态
        setTimeout(() => {
          if (onMetricsUpdate) {
            onMetricsUpdate({
              metrics,
              grade,
              timestamp: Date.now()
            })
          }
        }, 0)
        return grade
      }
      return prevGrade
    })
  }, [metrics, calculateGrade, onMetricsUpdate])

  // 发送指标到分析服务
  const reportMetrics = useCallback((metric) => {
    if (!enableReporting) return

    // 发送到Google Analytics（如果配置了）
    const analyticsId = siteConfig('ANALYTICS_GOOGLE_ID')
    if (analyticsId && typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true
      })
    }

    // 发送到自定义分析端点
    const analyticsEndpoint = siteConfig('ANALYTICS_ENDPOINT')
    if (analyticsEndpoint) {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'web-vital',
          metric: metric.name,
          value: metric.value,
          id: metric.id,
          url: window.location.href,
          timestamp: Date.now()
        })
      }).catch(err => console.warn('Failed to report web vital:', err))
    }
  }, [enableReporting])

  // 初始化Web Vitals监控
  useEffect(() => {
    if (typeof window === 'undefined') return

    let observer

    // 监控FCP (First Contentful Paint)
    const observeFCP = () => {
      if ('PerformanceObserver' in window) {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
          
          if (fcpEntry) {
            const value = fcpEntry.startTime
            updateMetric('FCP', value)
            reportMetrics({ name: 'FCP', value, id: 'fcp' })
            fcpObserver.disconnect()
          }
        })
        
        fcpObserver.observe({ entryTypes: ['paint'] })
      }
    }

    // 监控LCP (Largest Contentful Paint)
    const observeLCP = () => {
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          if (lastEntry) {
            const value = lastEntry.startTime
            updateMetric('LCP', value)
            reportMetrics({ name: 'LCP', value, id: 'lcp' })
          }
        })
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        
        // 在页面隐藏时停止观察
        const stopObserving = () => {
          lcpObserver.disconnect()
          document.removeEventListener('visibilitychange', stopObserving)
        }
        
        document.addEventListener('visibilitychange', stopObserving)
      }
    }

    // 监控FID (First Input Delay)
    const observeFID = () => {
      if ('PerformanceObserver' in window) {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          
          entries.forEach(entry => {
            if (entry.processingStart && entry.startTime) {
              const value = entry.processingStart - entry.startTime
              updateMetric('FID', value)
              reportMetrics({ name: 'FID', value, id: 'fid' })
            }
          })
        })
        
        fidObserver.observe({ entryTypes: ['first-input'] })
      }
    }

    // 监控CLS (Cumulative Layout Shift)
    const observeCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0
        let sessionValue = 0
        let sessionEntries = []
        
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              const firstSessionEntry = sessionEntries[0]
              const lastSessionEntry = sessionEntries[sessionEntries.length - 1]
              
              if (sessionValue && 
                  entry.startTime - lastSessionEntry.startTime < 1000 &&
                  entry.startTime - firstSessionEntry.startTime < 5000) {
                sessionValue += entry.value
                sessionEntries.push(entry)
              } else {
                sessionValue = entry.value
                sessionEntries = [entry]
              }
              
              if (sessionValue > clsValue) {
                clsValue = sessionValue
                updateMetric('CLS', clsValue)
                reportMetrics({ name: 'CLS', value: clsValue, id: 'cls' })
              }
            }
          })
        })
        
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      }
    }

    // 监控TTFB (Time to First Byte)
    const observeTTFB = () => {
      if ('performance' in window && 'timing' in window.performance) {
        const timing = window.performance.timing
        const ttfb = timing.responseStart - timing.navigationStart
        
        if (ttfb > 0) {
          updateMetric('TTFB', ttfb)
          reportMetrics({ name: 'TTFB', value: ttfb, id: 'ttfb' })
        }
      }
    }

    // 监控INP (Interaction to Next Paint) - 实验性
    const observeINP = () => {
      if ('PerformanceObserver' in window) {
        let maxINP = 0
        
        const inpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          
          entries.forEach(entry => {
            if (entry.processingEnd && entry.startTime) {
              const inp = entry.processingEnd - entry.startTime
              if (inp > maxINP) {
                maxINP = inp
                updateMetric('INP', inp)
                reportMetrics({ name: 'INP', value: inp, id: 'inp' })
              }
            }
          })
        })
        
        try {
          inpObserver.observe({ entryTypes: ['event'] })
        } catch (e) {
          // INP可能不被支持
          console.warn('INP monitoring not supported:', e)
        }
      }
    }

    // 启动所有监控
    observeFCP()
    observeLCP()
    observeFID()
    observeCLS()
    observeTTFB()
    observeINP()

    // 页面卸载时的清理
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [updateMetric, reportMetrics])

  // 获取性能建议
  const getPerformanceAdvice = useCallback(() => {
    const advice = []

    if (metrics.FCP && metrics.FCP > 3000) {
      advice.push({
        metric: 'FCP',
        issue: 'Slow First Contentful Paint',
        suggestion: 'Optimize critical rendering path, reduce server response time, eliminate render-blocking resources'
      })
    }

    if (metrics.LCP && metrics.LCP > 4000) {
      advice.push({
        metric: 'LCP',
        issue: 'Slow Largest Contentful Paint',
        suggestion: 'Optimize images, preload key resources, reduce server response time'
      })
    }

    if (metrics.FID && metrics.FID > 300) {
      advice.push({
        metric: 'FID',
        issue: 'High First Input Delay',
        suggestion: 'Reduce JavaScript execution time, split long tasks, use web workers'
      })
    }

    if (metrics.CLS && metrics.CLS > 0.25) {
      advice.push({
        metric: 'CLS',
        issue: 'High Cumulative Layout Shift',
        suggestion: 'Set size attributes on images and videos, avoid inserting content above existing content'
      })
    }

    if (metrics.TTFB && metrics.TTFB > 1800) {
      advice.push({
        metric: 'TTFB',
        issue: 'Slow Time to First Byte',
        suggestion: 'Optimize server performance, use CDN, enable caching'
      })
    }

    return advice
  }, [metrics])

  // 导出性能报告
  const exportReport = useCallback(() => {
    return {
      metrics,
      grade: performanceGrade,
      advice: getPerformanceAdvice(),
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    }
  }, [metrics, performanceGrade, getPerformanceAdvice])

  // 如果在开发环境，显示调试信息
  if (process.env.NODE_ENV === 'development' && enableConsoleLog) {
    console.log('Web Vitals Metrics:', metrics)
    console.log('Performance Grade:', performanceGrade)
  }

  return null // 这是一个监控组件，不渲染任何UI
}

/**
 * Web Vitals Hook
 * 提供Web Vitals数据的React Hook
 */
export function useWebVitals(options = {}) {
  const [vitalsData, setVitalsData] = useState({
    metrics: {},
    grade: 'unknown',
    isLoading: true
  })

  const handleMetricsUpdate = useCallback((data) => {
    setVitalsData({
      ...data,
      isLoading: false
    })
  }, [])

  return {
    ...vitalsData,
    WebVitalsMonitor: () => (
      <WebVitalsMonitor 
        onMetricsUpdate={handleMetricsUpdate}
        {...options}
      />
    )
  }
}

/**
 * 性能监控仪表板组件
 */
export function WebVitalsDashboard({ metrics, grade }) {
  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className="web-vitals-dashboard loading">
        <p>Loading performance metrics...</p>
      </div>
    )
  }

  const getMetricColor = (metric, value) => {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    }

    if (!thresholds[metric] || value === null) return 'gray'
    
    const threshold = thresholds[metric]
    if (value <= threshold.good) return 'green'
    if (value <= threshold.poor) return 'orange'
    return 'red'
  }

  const formatValue = (metric, value) => {
    if (value === null) return 'N/A'
    if (metric === 'CLS') return value.toFixed(3)
    return Math.round(value) + 'ms'
  }

  return (
    <div className={`web-vitals-dashboard ${grade}`}>
      <h3>Core Web Vitals</h3>
      <div className="metrics-grid">
        {Object.entries(metrics).map(([metric, value]) => (
          <div 
            key={metric} 
            className={`metric-card ${getMetricColor(metric, value)}`}
          >
            <div className="metric-name">{metric}</div>
            <div className="metric-value">{formatValue(metric, value)}</div>
          </div>
        ))}
      </div>
      <div className={`overall-grade ${grade}`}>
        Overall Grade: {grade.toUpperCase()}
      </div>
      
      <style jsx>{`
        .web-vitals-dashboard {
          padding: 1rem;
          border-radius: 8px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .metric-card {
          padding: 1rem;
          border-radius: 6px;
          text-align: center;
          border: 2px solid;
        }
        
        .metric-card.green { border-color: #10b981; background: #ecfdf5; }
        .metric-card.orange { border-color: #f59e0b; background: #fffbeb; }
        .metric-card.red { border-color: #ef4444; background: #fef2f2; }
        .metric-card.gray { border-color: #6b7280; background: #f9fafb; }
        
        .metric-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }
        
        .metric-value {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 0.25rem;
        }
        
        .overall-grade {
          text-align: center;
          font-weight: 700;
          padding: 0.5rem;
          border-radius: 4px;
        }
        
        .overall-grade.good { background: #10b981; color: white; }
        .overall-grade.needs-improvement { background: #f59e0b; color: white; }
        .overall-grade.poor { background: #ef4444; color: white; }
        .overall-grade.unknown { background: #6b7280; color: white; }
      `}</style>
    </div>
  )
}