import { useEffect, useRef, useState, useCallback } from 'react'
import { generateImageAlt, analyzeImageSEO } from '@/lib/seo/imageSEO'

/**
 * 增强版图片SEO优化组件
 * 提供更全面的图片SEO优化功能
 */
export default function EnhancedImageSEO({
  enabled = true,
  autoOptimize = true,
  monitorPerformance = true,
  generateStructuredData = true,
  context = {},
  onOptimizationComplete,
  onPerformanceUpdate
}) {
  const processedImages = useRef(new Set())
  const observer = useRef(null)
  const performanceObserver = useRef(null)
  const [optimizationStats, setOptimizationStats] = useState({
    totalImages: 0,
    optimizedImages: 0,
    failedImages: 0,
    averageOptimizationTime: 0
  })

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    initializeImageOptimization()
    
    if (monitorPerformance) {
      setupPerformanceMonitoring()
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
      if (performanceObserver.current) {
        performanceObserver.current.disconnect()
      }
    }
  }, [enabled, autoOptimize, monitorPerformance])

  /**
   * 初始化图片优化
   */
  const initializeImageOptimization = useCallback(async () => {
    const images = document.querySelectorAll('img')
    const startTime = performance.now()
    
    let optimizedCount = 0
    let failedCount = 0

    for (const img of images) {
      try {
        await processImageEnhanced(img)
        optimizedCount++
      } catch (error) {
        console.warn('Failed to optimize image:', error)
        failedCount++
      }
    }

    const endTime = performance.now()
    const averageTime = images.length > 0 ? (endTime - startTime) / images.length : 0

    const stats = {
      totalImages: images.length,
      optimizedImages: optimizedCount,
      failedImages: failedCount,
      averageOptimizationTime: averageTime
    }

    setOptimizationStats(stats)
    
    if (onOptimizationComplete) {
      onOptimizationComplete(stats)
    }
  }, [autoOptimize, context])

  /**
   * 设置性能监控
   */
  const setupPerformanceMonitoring = useCallback(() => {
    if (!('PerformanceObserver' in window)) return

    try {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const imageEntries = entries.filter(entry => 
          entry.initiatorType === 'img' || entry.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)
        )

        if (imageEntries.length > 0 && onPerformanceUpdate) {
          const performanceData = {
            totalImages: imageEntries.length,
            averageLoadTime: imageEntries.reduce((sum, entry) => sum + entry.duration, 0) / imageEntries.length,
            largestImage: imageEntries.reduce((max, entry) => 
              entry.transferSize > (max.transferSize || 0) ? entry : max, {}
            ),
            timestamp: Date.now()
          }
          
          onPerformanceUpdate(performanceData)
        }
      })

      performanceObserver.current.observe({ entryTypes: ['resource'] })
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error)
    }
  }, [onPerformanceUpdate])

  /**
   * 增强版图片处理
   */
  const processImageEnhanced = async (img) => {
    if (!img || !img.src) return
    
    const imageId = img.src + (img.alt || '')
    if (processedImages.current.has(imageId)) return
    processedImages.current.add(imageId)

    const startTime = performance.now()

    try {
      // 1. 优化alt属性
      await optimizeAltAttribute(img)
      
      // 2. 优化加载属性
      optimizeLoadingAttributes(img)
      
      // 3. 添加尺寸属性
      await optimizeImageDimensions(img)
      
      // 4. 生成结构化数据
      if (generateStructuredData) {
        generateImageStructuredData(img)
      }
      
      // 5. 优化性能属性
      optimizePerformanceAttributes(img)
      
      // 6. 添加错误处理
      addErrorHandling(img)

      const endTime = performance.now()
      img.setAttribute('data-seo-optimization-time', (endTime - startTime).toFixed(2))
      img.setAttribute('data-seo-optimized', 'true')

    } catch (error) {
      console.warn('Image optimization failed:', error)
      img.setAttribute('data-seo-optimization-error', error.message)
    }
  }

  /**
   * 优化alt属性
   */
  const optimizeAltAttribute = async (img) => {
    if (img.alt && img.alt.trim()) return

    try {
      const generatedAlt = await generateImageAlt(img.src, {
        ...context,
        title: document.title,
        url: window.location.href,
        surroundingText: getSurroundingText(img),
        imageElement: img
      })
      
      if (generatedAlt) {
        img.alt = generatedAlt
        img.setAttribute('data-alt-generated', 'true')
      }
    } catch (error) {
      console.warn('Alt generation failed:', error)
    }
  }

  /**
   * 优化加载属性
   */
  const optimizeLoadingAttributes = (img) => {
    // 设置loading属性
    if (!img.loading) {
      img.loading = isAboveTheFold(img) ? 'eager' : 'lazy'
    }

    // 设置decoding属性
    if (!img.decoding) {
      img.decoding = 'async'
    }

    // 设置fetchpriority属性
    if (!img.fetchPriority && isAboveTheFold(img)) {
      img.fetchPriority = 'high'
    }
  }

  /**
   * 优化图片尺寸
   */
  const optimizeImageDimensions = (img) => {
    return new Promise((resolve) => {
      if (img.width && img.height) {
        resolve()
        return
      }

      const handleLoad = () => {
        if (img.naturalWidth && img.naturalHeight) {
          if (!img.width) img.width = img.naturalWidth
          if (!img.height) img.height = img.naturalHeight
          
          // 添加aspect-ratio CSS属性
          const aspectRatio = img.naturalWidth / img.naturalHeight
          img.style.aspectRatio = aspectRatio.toFixed(3)
        }
        resolve()
      }

      if (img.complete) {
        handleLoad()
      } else {
        img.addEventListener('load', handleLoad, { once: true })
        img.addEventListener('error', () => resolve(), { once: true })
      }
    })
  }

  /**
   * 生成图片结构化数据
   */
  const generateImageStructuredData = (img) => {
    if (!img.src || !img.alt) return

    const existingScript = document.querySelector(`script[data-image-src="${img.src}"]`)
    if (existingScript) return

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "url": img.src,
      "name": img.alt,
      "description": img.title || img.alt,
      "contentUrl": img.src,
      "width": img.naturalWidth || img.width,
      "height": img.naturalHeight || img.height,
      "encodingFormat": getImageMimeType(img.src),
      "uploadDate": new Date().toISOString(),
      "creator": context.author ? {
        "@type": "Person",
        "name": context.author
      } : null,
      "copyrightHolder": context.author ? {
        "@type": "Person",
        "name": context.author
      } : null,
      "license": context.license || null,
      "acquireLicensePage": context.licensePage || null
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-image-src', img.src)
    script.textContent = JSON.stringify(structuredData)
    
    document.head.appendChild(script)
  }

  /**
   * 优化性能属性
   */
  const optimizePerformanceAttributes = (img) => {
    // 预加载关键图片
    if (isAboveTheFold(img) && !img.hasAttribute('data-preloaded')) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = img.src
      link.setAttribute('data-preload-for', img.src)
      document.head.appendChild(link)
      
      img.setAttribute('data-preloaded', 'true')
    }

    // 添加intersection observer for lazy loading
    if (!isAboveTheFold(img) && !img.hasAttribute('data-lazy-observed')) {
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target
            image.style.transition = 'opacity 0.3s ease-in-out'
            lazyObserver.unobserve(image)
          }
        })
      }, { rootMargin: '50px' })

      lazyObserver.observe(img)
      img.setAttribute('data-lazy-observed', 'true')
    }
  }

  /**
   * 添加错误处理
   */
  const addErrorHandling = (img) => {
    if (img.hasAttribute('data-error-handled')) return

    img.addEventListener('error', () => {
      console.warn('Image failed to load:', img.src)
      
      // 尝试加载备用图片
      const fallbackSrc = getFallbackImageSrc()
      if (fallbackSrc && img.src !== fallbackSrc) {
        img.src = fallbackSrc
        img.alt = img.alt || 'Image not available'
      }
      
      img.setAttribute('data-load-error', 'true')
    }, { once: true })

    img.setAttribute('data-error-handled', 'true')
  }

  /**
   * 获取图片周围文本
   */
  const getSurroundingText = (img) => {
    const parent = img.parentElement
    if (!parent) return ''

    let text = parent.textContent || ''
    
    // 获取前后兄弟元素
    const prevSibling = img.previousElementSibling
    const nextSibling = img.nextElementSibling
    
    if (prevSibling) {
      text = (prevSibling.textContent || '') + ' ' + text
    }
    
    if (nextSibling) {
      text = text + ' ' + (nextSibling.textContent || '')
    }

    return text.trim().substring(0, 200)
  }

  /**
   * 检查是否在首屏
   */
  const isAboveTheFold = (img) => {
    const rect = img.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    return rect.top < viewportHeight
  }

  /**
   * 获取图片MIME类型
   */
  const getImageMimeType = (src) => {
    const extension = src.split('.').pop()?.toLowerCase()
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'avif': 'image/avif',
      'svg': 'image/svg+xml'
    }
    return mimeTypes[extension] || 'image/jpeg'
  }

  /**
   * 获取备用图片
   */
  const getFallbackImageSrc = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
  }

  return null
}

/**
 * 图片SEO性能监控Hook
 */
export function useImageSEOPerformance() {
  const [performanceData, setPerformanceData] = useState({
    totalImages: 0,
    optimizedImages: 0,
    averageLoadTime: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0
  })

  const updatePerformanceData = useCallback((data) => {
    setPerformanceData(prev => ({
      ...prev,
      ...data,
      lastUpdated: Date.now()
    }))
  }, [])

  const getPerformanceReport = useCallback(() => {
    const images = Array.from(document.querySelectorAll('img'))
    const optimizedImages = images.filter(img => img.hasAttribute('data-seo-optimized'))
    
    return {
      ...performanceData,
      totalImages: images.length,
      optimizedImages: optimizedImages.length,
      optimizationRate: images.length > 0 ? (optimizedImages.length / images.length * 100).toFixed(1) : 0,
      generatedAt: new Date().toISOString()
    }
  }, [performanceData])

  return {
    performanceData,
    updatePerformanceData,
    getPerformanceReport
  }
}

/**
 * 图片SEO批量优化Hook
 */
export function useImageSEOBatchOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)

  const optimizeAllImages = useCallback(async (options = {}) => {
    const {
      batchSize = 5,
      delay = 100,
      onProgress,
      onComplete
    } = options

    setIsOptimizing(true)
    setOptimizationProgress(0)

    const images = Array.from(document.querySelectorAll('img:not([data-seo-optimized])'))
    const totalImages = images.length

    if (totalImages === 0) {
      setIsOptimizing(false)
      if (onComplete) onComplete({ totalImages: 0, optimizedImages: 0 })
      return
    }

    let optimizedCount = 0

    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize)
      
      await Promise.all(batch.map(async (img) => {
        try {
          // 简化的优化逻辑
          if (!img.alt) {
            const alt = await generateImageAlt(img.src, {
              title: document.title,
              url: window.location.href
            })
            if (alt) img.alt = alt
          }
          
          if (!img.loading) {
            img.loading = 'lazy'
          }
          
          img.setAttribute('data-seo-optimized', 'true')
          optimizedCount++
        } catch (error) {
          console.warn('Failed to optimize image:', error)
        }
      }))

      const progress = Math.round(((i + batchSize) / totalImages) * 100)
      setOptimizationProgress(Math.min(progress, 100))
      
      if (onProgress) {
        onProgress({
          processed: Math.min(i + batchSize, totalImages),
          total: totalImages,
          progress: Math.min(progress, 100)
        })
      }

      // 添加延迟避免阻塞UI
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    setIsOptimizing(false)
    setOptimizationProgress(100)
    
    if (onComplete) {
      onComplete({
        totalImages,
        optimizedImages: optimizedCount,
        optimizationRate: (optimizedCount / totalImages * 100).toFixed(1)
      })
    }
  }, [])

  return {
    isOptimizing,
    optimizationProgress,
    optimizeAllImages
  }
}