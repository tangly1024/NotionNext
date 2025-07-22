import { useEffect, useState, useCallback, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * 性能优化React Hook
 * 提供各种性能优化功能的React Hook
 */

/**
 * 关键资源预加载Hook
 */
export function useResourcePreloader() {
  const [preloadedResources, setPreloadedResources] = useState(new Set())
  const preloadQueue = useRef([])

  const preloadResource = useCallback((url, type = 'script', priority = 'low') => {
    if (preloadedResources.has(url)) return

    const link = document.createElement('link')
    link.rel = priority === 'high' ? 'preload' : 'prefetch'
    link.href = url
    link.as = type

    if (type === 'script') {
      link.crossOrigin = 'anonymous'
    }

    link.onload = () => {
      setPreloadedResources(prev => new Set([...prev, url]))
    }

    link.onerror = () => {
      console.warn(`Failed to preload resource: ${url}`)
    }

    document.head.appendChild(link)
  }, [preloadedResources])

  const preloadCriticalResources = useCallback(() => {
    const criticalResources = [
      { url: '/css/critical.css', type: 'style', priority: 'high' },
      { url: '/js/critical.js', type: 'script', priority: 'high' },
      { url: '/fonts/main.woff2', type: 'font', priority: 'high' }
    ]

    criticalResources.forEach(resource => {
      preloadResource(resource.url, resource.type, resource.priority)
    })
  }, [preloadResource])

  useEffect(() => {
    // 在组件挂载后预加载关键资源
    if (siteConfig('SEO_ENABLE_PRELOAD', true)) {
      preloadCriticalResources()
    }
  }, [preloadCriticalResources])

  return {
    preloadResource,
    preloadCriticalResources,
    preloadedResources: Array.from(preloadedResources)
  }
}

/**
 * 懒加载Hook
 */
export function useLazyLoading(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const elementRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observerRef.current?.disconnect()
        }
      },
      { threshold }
    )

    observerRef.current.observe(element)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [threshold])

  const markAsLoaded = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return {
    elementRef,
    isVisible,
    isLoaded,
    markAsLoaded
  }
}

/**
 * 图片优化Hook
 */
export function useOptimizedImage(src, options = {}) {
  const {
    sizes = [320, 640, 1024, 1920],
    formats = ['webp', 'jpg'],
    quality = 80,
    lazy = true
  } = options

  const [currentSrc, setCurrentSrc] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isVisible, elementRef } = useLazyLoading()

  // 生成响应式图片源
  const generateSources = useCallback(() => {
    const sources = []

    formats.forEach(format => {
      const srcSet = sizes.map(size => {
        const optimizedSrc = generateOptimizedSrc(src, size, quality, format)
        return `${optimizedSrc} ${size}w`
      }).join(', ')

      sources.push({
        srcSet,
        type: `image/${format}`,
        sizes: '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px'
      })
    })

    return sources
  }, [src, sizes, formats, quality])

  // 加载图片
  const loadImage = useCallback(async () => {
    if (!src || (lazy && !isVisible)) return

    setIsLoading(true)
    setError(null)

    try {
      // 选择最适合的图片源
      const optimalSrc = selectOptimalSource(src, sizes, formats, quality)
      
      // 预加载图片
      const img = new Image()
      img.onload = () => {
        setCurrentSrc(optimalSrc)
        setIsLoading(false)
      }
      img.onerror = () => {
        setError('Failed to load image')
        setCurrentSrc(src) // 回退到原始图片
        setIsLoading(false)
      }
      img.src = optimalSrc

    } catch (err) {
      setError(err.message)
      setCurrentSrc(src)
      setIsLoading(false)
    }
  }, [src, sizes, formats, quality, lazy, isVisible])

  useEffect(() => {
    loadImage()
  }, [loadImage])

  return {
    elementRef,
    currentSrc,
    sources: generateSources(),
    isLoading,
    error,
    isVisible
  }
}

/**
 * 脚本懒加载Hook
 */
export function useLazyScript(src, options = {}) {
  const {
    strategy = 'idle', // idle, visible, delay
    delay = 3000,
    condition = null
  } = options

  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const scriptRef = useRef(null)

  const loadScript = useCallback(() => {
    if (isLoaded || scriptRef.current) return

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
    }

    script.onerror = () => {
      setError(`Failed to load script: ${src}`)
    }

    document.head.appendChild(script)
    scriptRef.current = script
  }, [src, isLoaded])

  useEffect(() => {
    if (condition && !condition()) return

    switch (strategy) {
      case 'idle':
        if ('requestIdleCallback' in window) {
          requestIdleCallback(loadScript)
        } else {
          setTimeout(loadScript, 1000)
        }
        break

      case 'delay':
        setTimeout(loadScript, delay)
        break

      case 'immediate':
        loadScript()
        break

      default:
        loadScript()
    }

    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current)
        scriptRef.current = null
      }
    }
  }, [strategy, delay, condition, loadScript])

  return { isLoaded, error }
}

/**
 * 性能监控Hook
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({})
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const supported = 'PerformanceObserver' in window
    setIsSupported(supported)

    if (!supported) return

    // 监控各种性能指标
    const observers = []

    // FCP (First Contentful Paint)
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
          }
        })
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
      observers.push(fcpObserver)
    }

    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    observers.push(lcpObserver)

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
    observers.push(fidObserver)

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          setMetrics(prev => ({ ...prev, cls: clsValue }))
        }
      })
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    observers.push(clsObserver)

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  const reportMetrics = useCallback((endpoint = '/api/analytics/web-vitals') => {
    if (Object.keys(metrics).length === 0) return

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: window.location.href,
        metrics,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
    }).catch(error => {
      console.warn('Failed to report performance metrics:', error)
    })
  }, [metrics])

  return {
    metrics,
    isSupported,
    reportMetrics
  }
}

/**
 * 代码分割Hook
 */
export function useCodeSplitting(importFunction, deps = []) {
  const [component, setComponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    importFunction()
      .then(module => {
        if (!cancelled) {
          setComponent(() => module.default || module)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, deps)

  return { component, loading, error }
}

/**
 * 缓存Hook
 */
export function useCache(key, fetcher, options = {}) {
  const {
    ttl = 5 * 60 * 1000, // 5分钟
    staleWhileRevalidate = true
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getCachedData = useCallback(() => {
    try {
      const cached = localStorage.getItem(`cache_${key}`)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        const isExpired = Date.now() - timestamp > ttl
        
        if (!isExpired || staleWhileRevalidate) {
          return { data, isStale: isExpired }
        }
      }
    } catch {
      // 忽略缓存错误
    }
    return null
  }, [key, ttl, staleWhileRevalidate])

  const setCachedData = useCallback((data) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch {
      // 忽略存储错误
    }
  }, [key])

  const fetchData = useCallback(async (useCache = true) => {
    try {
      if (useCache) {
        const cached = getCachedData()
        if (cached) {
          setData(cached.data)
          setLoading(false)
          
          if (!cached.isStale) {
            return cached.data
          }
        }
      }

      setLoading(true)
      const result = await fetcher()
      setData(result)
      setCachedData(result)
      setError(null)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetcher, getCachedData, setCachedData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => {
    return fetchData(false)
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refresh
  }
}

// 辅助函数
function generateOptimizedSrc(src, width, quality, format) {
  // 这里应该根据实际的图片优化服务来生成URL
  const params = new URLSearchParams({
    w: width,
    q: quality,
    f: format
  })
  
  return `${src}?${params.toString()}`
}

function selectOptimalSource(src, sizes, formats, quality) {
  // 根据设备和网络条件选择最优图片源
  const devicePixelRatio = window.devicePixelRatio || 1
  const viewportWidth = window.innerWidth * devicePixelRatio
  
  // 选择合适的尺寸
  const optimalSize = sizes.find(size => size >= viewportWidth) || sizes[sizes.length - 1]
  
  // 选择合适的格式
  const supportWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1
  const optimalFormat = supportWebP && formats.includes('webp') ? 'webp' : formats[formats.length - 1]
  
  return generateOptimizedSrc(src, optimalSize, quality, optimalFormat)
}