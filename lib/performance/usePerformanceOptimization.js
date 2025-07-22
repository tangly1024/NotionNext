import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  debounce,
  throttle,
  requestIdleCallback,
  cancelIdleCallback,
  detectDevicePerformance,
  getMemoryUsage,
  checkPerformanceBudget
} from './performanceUtils'

/**
 * 性能优化Hook
 * 提供各种性能优化相关的功能
 * @param {Object} options 配置选项
 * @returns {Object} 性能优化工具和状态
 */
export function usePerformanceOptimization(options = {}) {
  const {
    enableMemoryMonitoring = false,
    enablePerformanceBudget = false,
    performanceBudget = {},
    debounceDelay = 300,
    throttleLimit = 100
  } = options
  
  const [devicePerformance, setDevicePerformance] = useState(null)
  const [memoryUsage, setMemoryUsage] = useState(null)
  const [performanceMetrics, setPerformanceMetrics] = useState({})
  const [budgetStatus, setBudgetStatus] = useState(null)
  
  const idleCallbackRef = useRef(null)
  const memoryMonitorRef = useRef(null)
  
  // 检测设备性能
  useEffect(() => {
    const performance = detectDevicePerformance()
    setDevicePerformance(performance)
  }, [])
  
  // 内存监控
  useEffect(() => {
    if (!enableMemoryMonitoring) return
    
    const monitorMemory = () => {
      const usage = getMemoryUsage()
      if (usage) {
        setMemoryUsage(usage)
      }
    }
    
    // 立即执行一次
    monitorMemory()
    
    // 定期监控
    memoryMonitorRef.current = setInterval(monitorMemory, 5000)
    
    return () => {
      if (memoryMonitorRef.current) {
        clearInterval(memoryMonitorRef.current)
      }
    }
  }, [enableMemoryMonitoring])
  
  // 性能预算检查
  useEffect(() => {
    if (!enablePerformanceBudget || Object.keys(performanceMetrics).length === 0) return
    
    const status = checkPerformanceBudget(performanceMetrics, performanceBudget)
    setBudgetStatus(status)
  }, [enablePerformanceBudget, performanceMetrics, performanceBudget])
  
  // 创建防抖函数
  const createDebounced = useCallback((func, delay = debounceDelay) => {
    return debounce(func, delay)
  }, [debounceDelay])
  
  // 创建节流函数
  const createThrottled = useCallback((func, limit = throttleLimit) => {
    return throttle(func, limit)
  }, [throttleLimit])
  
  // 空闲时执行
  const runWhenIdle = useCallback((callback, options = {}) => {
    if (idleCallbackRef.current) {
      cancelIdleCallback(idleCallbackRef.current)
    }
    
    idleCallbackRef.current = requestIdleCallback(callback, options)
    
    return () => {
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current)
      }
    }
  }, [])
  
  // 更新性能指标
  const updateMetrics = useCallback((newMetrics) => {
    setPerformanceMetrics(prev => ({ ...prev, ...newMetrics }))
  }, [])
  
  // 获取优化建议
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions = []
    
    if (devicePerformance?.level === 'low') {
      suggestions.push({
        type: 'device',
        message: '检测到低性能设备，建议启用性能优化模式',
        action: 'enableLowPowerMode'
      })
    }
    
    if (memoryUsage?.usagePercent > 80) {
      suggestions.push({
        type: 'memory',
        message: '内存使用率过高，建议清理不必要的资源',
        action: 'cleanupMemory'
      })
    }
    
    if (budgetStatus?.violations.length > 0) {
      budgetStatus.violations.forEach(violation => {
        suggestions.push({
          type: 'budget',
          message: `${violation.metric} 超出预算 ${violation.percentage}%`,
          action: `optimize${violation.metric.toUpperCase()}`
        })
      })
    }
    
    return suggestions
  }, [devicePerformance, memoryUsage, budgetStatus])
  
  // 清理函数
  useEffect(() => {
    return () => {
      if (idleCallbackRef.current) {
        cancelIdleCallback(idleCallbackRef.current)
      }
      if (memoryMonitorRef.current) {
        clearInterval(memoryMonitorRef.current)
      }
    }
  }, [])
  
  return {
    // 状态
    devicePerformance,
    memoryUsage,
    performanceMetrics,
    budgetStatus,
    
    // 工具函数
    createDebounced,
    createThrottled,
    runWhenIdle,
    updateMetrics,
    getOptimizationSuggestions,
    
    // 便捷方法
    isLowPerformanceDevice: devicePerformance?.level === 'low',
    isHighMemoryUsage: memoryUsage?.usagePercent > 80,
    hasBudgetViolations: budgetStatus?.violations.length > 0
  }
}

/**
 * 虚拟滚动Hook
 * @param {Object} options 配置选项
 * @returns {Object} 虚拟滚动状态和方法
 */
export function useVirtualScroll(options = {}) {
  const {
    itemHeight = 50,
    containerHeight = 400,
    items = [],
    overscan = 5
  } = options
  
  const [scrollTop, setScrollTop] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef(null)
  
  // 计算可见项目
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    
    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex + 1)
    }
  }, [scrollTop, itemHeight, containerHeight, items, overscan])
  
  // 处理滚动
  const handleScroll = useCallback((event) => {
    const newScrollTop = event.target.scrollTop
    setScrollTop(newScrollTop)
    setIsScrolling(true)
    
    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    // 设置新的定时器
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 150)
  }, [])
  
  // 节流滚动处理
  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, 16), // 60fps
    [handleScroll]
  )
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])
  
  return {
    scrollTop,
    isScrolling,
    visibleRange,
    handleScroll: throttledHandleScroll,
    totalHeight: items.length * itemHeight,
    offsetY: visibleRange.startIndex * itemHeight
  }
}

/**
 * 图片懒加载Hook
 * @param {Object} options 配置选项
 * @returns {Object} 懒加载状态和方法
 */
export function useImageLazyLoad(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    fallbackSrc = null,
    enableWebP = true,
    enableAVIF = true
  } = options
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')
  
  const imgRef = useRef(null)
  const observerRef = useRef(null)
  
  // 设置Intersection Observer
  useEffect(() => {
    if (!imgRef.current) return
    
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observerRef.current?.disconnect()
        }
      },
      { threshold, rootMargin }
    )
    
    observerRef.current.observe(imgRef.current)
    
    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold, rootMargin])
  
  // 处理图片加载
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
  }, [])
  
  // 处理图片错误
  const handleError = useCallback(() => {
    setHasError(true)
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
    }
  }, [fallbackSrc, currentSrc])
  
  // 设置图片源
  const setSrc = useCallback((src) => {
    setCurrentSrc(src)
    setIsLoaded(false)
    setHasError(false)
  }, [])
  
  return {
    imgRef,
    isLoaded,
    isIntersecting,
    hasError,
    currentSrc,
    handleLoad,
    handleError,
    setSrc
  }
}

/**
 * 资源预加载Hook
 * @param {Array} resources 资源列表
 * @param {Object} options 配置选项
 * @returns {Object} 预加载状态
 */
export function useResourcePreload(resources = [], options = {}) {
  const { priority = 'low', enabled = true } = options
  
  const [status, setStatus] = useState({
    loading: false,
    loaded: [],
    failed: [],
    progress: 0
  })
  
  useEffect(() => {
    if (!enabled || resources.length === 0) return
    
    setStatus(prev => ({ ...prev, loading: true }))
    
    const preloadPromises = resources.map((resource, index) => {
      return new Promise((resolve, reject) => {
        if (resource.type === 'image') {
          const img = new Image()
          img.onload = () => resolve({ index, resource, success: true })
          img.onerror = () => reject({ index, resource, success: false })
          img.src = resource.src
        } else if (resource.type === 'script') {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = resource.src
          link.as = 'script'
          link.onload = () => resolve({ index, resource, success: true })
          link.onerror = () => reject({ index, resource, success: false })
          document.head.appendChild(link)
        } else if (resource.type === 'style') {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = resource.src
          link.as = 'style'
          link.onload = () => resolve({ index, resource, success: true })
          link.onerror = () => reject({ index, resource, success: false })
          document.head.appendChild(link)
        }
      })
    })
    
    Promise.allSettled(preloadPromises).then(results => {
      const loaded = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value.resource)
      
      const failed = results
        .filter(r => r.status === 'rejected')
        .map(r => r.reason.resource)
      
      setStatus({
        loading: false,
        loaded,
        failed,
        progress: 100
      })
    })
    
    // 进度更新
    let completedCount = 0
    preloadPromises.forEach(promise => {
      promise
        .finally(() => {
          completedCount++
          setStatus(prev => ({
            ...prev,
            progress: Math.round((completedCount / resources.length) * 100)
          }))
        })
    })
  }, [resources, enabled])
  
  return status
}

/**
 * 性能监控Hook
 * @param {Object} options 配置选项
 * @returns {Object} 性能监控状态和方法
 */
export function usePerformanceMonitor(options = {}) {
  const {
    enabled = process.env.NODE_ENV === 'development',
    collectInterval = 5000,
    thresholds = {}
  } = options
  
  const [metrics, setMetrics] = useState({})
  const [warnings, setWarnings] = useState([])
  const intervalRef = useRef(null)
  
  // 收集性能指标
  const collectMetrics = useCallback(() => {
    if (typeof performance === 'undefined') return
    
    const navigation = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    const memory = getMemoryUsage()
    
    const newMetrics = {
      // 导航时间
      ttfb: navigation?.responseStart - navigation?.requestStart || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.navigationStart || 0,
      loadComplete: navigation?.loadEventEnd - navigation?.navigationStart || 0,
      
      // 绘制时间
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      
      // 资源统计
      resourceCount: performance.getEntriesByType('resource').length,
      
      // 内存使用
      memory,
      
      // 时间戳
      timestamp: Date.now()
    }
    
    setMetrics(newMetrics)
    
    // 检查警告
    const newWarnings = []
    if (newMetrics.fcp > (thresholds.fcp || 1800)) {
      newWarnings.push({
        type: 'fcp',
        message: `首次内容绘制时间过长: ${Math.round(newMetrics.fcp)}ms`
      })
    }
    
    if (memory?.usagePercent > 80) {
      newWarnings.push({
        type: 'memory',
        message: `内存使用率过高: ${memory.usagePercent}%`
      })
    }
    
    setWarnings(newWarnings)
  }, [thresholds])
  
  // 开始监控
  useEffect(() => {
    if (!enabled) return
    
    // 立即收集一次
    collectMetrics()
    
    // 定期收集
    intervalRef.current = setInterval(collectMetrics, collectInterval)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, collectInterval, collectMetrics])
  
  return {
    metrics,
    warnings,
    isSupported: typeof performance !== 'undefined'
  }
}