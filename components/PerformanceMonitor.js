import { useEffect, useState, useRef } from 'react'

/**
 * 性能监控组件
 * 监控页面性能指标并提供优化建议
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 性能监控组件
 */
export default function PerformanceMonitor({
  enabled = process.env.NODE_ENV === 'development',
  showPanel = false,
  onMetricsUpdate,
  thresholds = {
    fcp: 1800, // First Contentful Paint
    lcp: 2500, // Largest Contentful Paint
    fid: 100,  // First Input Delay
    cls: 0.1,  // Cumulative Layout Shift
    ttfb: 800  // Time to First Byte
  }
}) {
  const [metrics, setMetrics] = useState({})
  const [warnings, setWarnings] = useState([])
  const [isVisible, setIsVisible] = useState(showPanel)
  const observerRef = useRef(null)
  
  // 收集性能指标
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      const paint = performance.getEntriesByType('paint')
      
      const newMetrics = {
        // 导航时间
        ttfb: navigation?.responseStart - navigation?.requestStart || 0,
        domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.navigationStart || 0,
        loadComplete: navigation?.loadEventEnd - navigation?.navigationStart || 0,
        
        // 绘制时间
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        
        // 资源统计
        resourceCount: performance.getEntriesByType('resource').length,
        
        // 内存使用（如果支持）
        memoryUsage: performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        } : null,
        
        // 连接信息（如果支持）
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null
      }
      
      setMetrics(newMetrics)
      onMetricsUpdate?.(newMetrics)
      
      // 检查性能警告
      checkPerformanceWarnings(newMetrics)
    }
    
    // 延迟收集，确保页面加载完成
    const timer = setTimeout(collectMetrics, 1000)
    
    return () => clearTimeout(timer)
  }, [enabled, onMetricsUpdate])
  
  // Web Vitals 监控
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    
    // 监控 LCP (Largest Contentful Paint)
    const observeLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          setMetrics(prev => ({
            ...prev,
            lcp: lastEntry.startTime
          }))
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        observerRef.current = observer
      }
    }
    
    // 监控 FID (First Input Delay)
    const observeFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(entry => {
            setMetrics(prev => ({
              ...prev,
              fid: entry.processingStart - entry.startTime
            }))
          })
        })
        
        observer.observe({ entryTypes: ['first-input'] })
      }
    }
    
    // 监控 CLS (Cumulative Layout Shift)
    const observeCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0
        
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          
          setMetrics(prev => ({
            ...prev,
            cls: clsValue
          }))
        })
        
        observer.observe({ entryTypes: ['layout-shift'] })
      }
    }
    
    observeLCP()
    observeFID()
    observeCLS()
    
    return () => {
      observerRef.current?.disconnect()
    }
  }, [enabled])
  
  // 检查性能警告
  const checkPerformanceWarnings = (currentMetrics) => {
    const newWarnings = []
    
    if (currentMetrics.fcp > thresholds.fcp) {
      newWarnings.push({
        type: 'fcp',
        message: `首次内容绘制时间过长: ${Math.round(currentMetrics.fcp)}ms`,
        suggestion: '优化关键渲染路径，减少阻塞资源'
      })
    }
    
    if (currentMetrics.lcp > thresholds.lcp) {
      newWarnings.push({
        type: 'lcp',
        message: `最大内容绘制时间过长: ${Math.round(currentMetrics.lcp)}ms`,
        suggestion: '优化图片加载，使用预加载技术'
      })
    }
    
    if (currentMetrics.fid > thresholds.fid) {
      newWarnings.push({
        type: 'fid',
        message: `首次输入延迟过长: ${Math.round(currentMetrics.fid)}ms`,
        suggestion: '减少主线程阻塞，优化JavaScript执行'
      })
    }
    
    if (currentMetrics.cls > thresholds.cls) {
      newWarnings.push({
        type: 'cls',
        message: `累积布局偏移过大: ${currentMetrics.cls.toFixed(3)}`,
        suggestion: '为图片和广告设置尺寸，避免动态内容插入'
      })
    }
    
    if (currentMetrics.ttfb > thresholds.ttfb) {
      newWarnings.push({
        type: 'ttfb',
        message: `首字节时间过长: ${Math.round(currentMetrics.ttfb)}ms`,
        suggestion: '优化服务器响应时间，使用CDN'
      })
    }
    
    setWarnings(newWarnings)
  }
  
  // 格式化时间
  const formatTime = (time) => {
    if (!time) return 'N/A'
    return `${Math.round(time)}ms`
  }
  
  // 格式化内存
  const formatMemory = (bytes) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)}MB`
  }
  
  // 获取性能评分
  const getPerformanceScore = () => {
    const scores = []
    
    if (metrics.fcp) scores.push(metrics.fcp <= thresholds.fcp ? 100 : 50)
    if (metrics.lcp) scores.push(metrics.lcp <= thresholds.lcp ? 100 : 50)
    if (metrics.fid) scores.push(metrics.fid <= thresholds.fid ? 100 : 50)
    if (metrics.cls) scores.push(metrics.cls <= thresholds.cls ? 100 : 50)
    if (metrics.ttfb) scores.push(metrics.ttfb <= thresholds.ttfb ? 100 : 50)
    
    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0
  }
  
  if (!enabled) return null
  
  return (
    <>
      {/* 性能监控面板切换按钮 */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
          title="性能监控"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* 性能监控面板 */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                性能监控
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getPerformanceScore() >= 80 ? 'bg-green-500' : getPerformanceScore() >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getPerformanceScore()}分
                </span>
              </div>
            </div>
            
            {/* 核心指标 */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">FCP:</span>
                  <span className={`ml-2 ${metrics.fcp <= thresholds.fcp ? 'text-green-600' : 'text-red-600'}`}>
                    {formatTime(metrics.fcp)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">LCP:</span>
                  <span className={`ml-2 ${metrics.lcp <= thresholds.lcp ? 'text-green-600' : 'text-red-600'}`}>
                    {formatTime(metrics.lcp)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">FID:</span>
                  <span className={`ml-2 ${metrics.fid <= thresholds.fid ? 'text-green-600' : 'text-red-600'}`}>
                    {formatTime(metrics.fid)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">CLS:</span>
                  <span className={`ml-2 ${metrics.cls <= thresholds.cls ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.cls?.toFixed(3) || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">TTFB:</span>
                  <span className={`ml-2 ${metrics.ttfb <= thresholds.ttfb ? 'text-green-600' : 'text-red-600'}`}>
                    {formatTime(metrics.ttfb)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">资源:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {metrics.resourceCount || 0}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 内存使用 */}
            {metrics.memoryUsage && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">内存使用</h4>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div>已使用: {formatMemory(metrics.memoryUsage.used)}</div>
                  <div>总计: {formatMemory(metrics.memoryUsage.total)}</div>
                </div>
              </div>
            )}
            
            {/* 连接信息 */}
            {metrics.connection && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">网络连接</h4>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <div>类型: {metrics.connection.effectiveType}</div>
                  <div>下行: {metrics.connection.downlink}Mbps</div>
                  <div>RTT: {metrics.connection.rtt}ms</div>
                </div>
              </div>
            )}
            
            {/* 性能警告 */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400">性能警告</h4>
                {warnings.map((warning, index) => (
                  <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs">
                    <div className="text-red-800 dark:text-red-200 font-medium">
                      {warning.message}
                    </div>
                    <div className="text-red-600 dark:text-red-400 mt-1">
                      {warning.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}