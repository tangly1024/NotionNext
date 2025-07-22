import { useEffect, useRef } from 'react'
import { generateImageAlt, analyzeImageSEO, optimizeImagesSEO, validateImageSEO } from '@/lib/seo/imageSEO'

/**
 * 图片SEO自动优化组件
 * 自动为页面中的图片添加SEO优化
 */
export default function ImageSEOOptimizer({
  enabled = true,
  autoGenerateAlt = true,
  optimizeFilenames = false,
  addStructuredData = true,
  context = {},
  onOptimizationComplete
}) {
  const processedImages = useRef(new Set())
  const observer = useRef(null)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // 初始化图片优化
    initializeImageOptimization()

    // 设置MutationObserver监听动态添加的图片
    setupMutationObserver()

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [enabled, autoGenerateAlt, optimizeFilenames, addStructuredData])

  /**
   * 初始化图片优化
   */
  const initializeImageOptimization = async () => {
    // 处理页面中现有的图片
    const images = document.querySelectorAll('img')
    const imagePromises = Array.from(images).map(img => processImage(img))
    
    try {
      await Promise.all(imagePromises)
      
      // 使用批量优化功能
      const imageData = Array.from(images).map(img => ({
        src: img.src,
        alt: img.alt || '',
        title: img.title || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        filename: img.src.split('/').pop(),
        loading: img.loading,
        decoding: img.decoding
      }))
      
      const optimizationResult = await optimizeImagesSEO(imageData, {
        ...context,
        title: document.title,
        url: window.location.href
      })
      
      // 调用完成回调
      if (typeof onOptimizationComplete === 'function') {
        onOptimizationComplete({
          totalImages: images.length,
          optimizedImages: optimizationResult.optimizedImages,
          optimizationReport: optimizationResult.optimizationReport,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.warn('Image optimization initialization failed:', error)
    }
  }

  /**
   * 设置MutationObserver
   */
  const setupMutationObserver = () => {
    observer.current = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查新添加的图片元素
            if (node.tagName === 'IMG') {
              processImage(node)
            }
            
            // 检查新添加元素内的图片
            const images = node.querySelectorAll?.('img')
            images?.forEach(img => processImage(img))
          }
        })
      })
    })

    observer.current.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  /**
   * 处理单个图片元素
   */
  const processImage = async (img) => {
    if (!img || !img.src) return
    
    // 避免重复处理
    const imageId = img.src + (img.alt || '')
    if (processedImages.current.has(imageId)) return
    processedImages.current.add(imageId)

    try {
      // 自动生成alt属性
      if (autoGenerateAlt && (!img.alt || img.alt.trim() === '')) {
        const generatedAlt = await generateImageAlt(img.src, {
          ...context,
          title: document.title,
          url: window.location.href,
          surroundingText: getSurroundingText(img)
        })
        
        if (generatedAlt) {
          img.alt = generatedAlt
          img.setAttribute('data-seo-optimized', 'alt')
        }
      }

      // 添加title属性（如果没有）
      if (!img.title && img.alt) {
        img.title = img.alt
      }

      // 添加loading属性优化
      if (!img.loading && !isAboveTheFold(img)) {
        img.loading = 'lazy'
      }

      // 添加decoding属性
      if (!img.decoding) {
        img.decoding = 'async'
      }

      // 设置图片尺寸属性（防止CLS）
      await setImageDimensions(img)

      // 添加结构化数据
      if (addStructuredData) {
        addImageStructuredData(img)
      }

      // 优化图片加载性能
      optimizeImageLoading(img)

    } catch (error) {
      console.warn('Image SEO optimization failed:', error)
    }
  }

  /**
   * 获取图片周围的文本内容
   */
  const getSurroundingText = (img) => {
    const parent = img.parentElement
    if (!parent) return ''

    // 获取父元素的文本内容
    let text = parent.textContent || ''
    
    // 获取前后兄弟元素的文本
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
   * 检查图片是否在首屏
   */
  const isAboveTheFold = (img) => {
    const rect = img.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    return rect.top < viewportHeight
  }

  /**
   * 设置图片尺寸属性
   */
  const setImageDimensions = (img) => {
    return new Promise((resolve) => {
      if (img.width && img.height) {
        resolve()
        return
      }

      if (img.complete) {
        if (img.naturalWidth && img.naturalHeight) {
          if (!img.width) img.width = img.naturalWidth
          if (!img.height) img.height = img.naturalHeight
        }
        resolve()
      } else {
        img.onload = () => {
          if (img.naturalWidth && img.naturalHeight) {
            if (!img.width) img.width = img.naturalWidth
            if (!img.height) img.height = img.naturalHeight
          }
          resolve()
        }
        img.onerror = () => resolve()
      }
    })
  }

  /**
   * 添加图片结构化数据
   */
  const addImageStructuredData = (img) => {
    if (!img.src || !img.alt) return

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
      "uploadDate": new Date().toISOString()
    }

    // 检查是否已存在结构化数据
    const existingScript = document.querySelector(`script[data-image-src="${img.src}"]`)
    if (existingScript) return

    // 创建结构化数据脚本
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-image-src', img.src)
    script.textContent = JSON.stringify(structuredData)
    
    document.head.appendChild(script)
  }

  /**
   * 优化图片加载性能
   */
  const optimizeImageLoading = (img) => {
    // 添加图片加载事件监听
    if (!img.hasAttribute('data-load-optimized')) {
      img.addEventListener('load', () => {
        // 图片加载完成后的优化
        img.style.transition = 'opacity 0.3s ease-in-out'
        img.style.opacity = '1'
      })

      img.addEventListener('error', () => {
        // 图片加载失败的处理
        console.warn('Image failed to load:', img.src)
        
        // 尝试加载备用图片
        const fallbackSrc = getFallbackImageSrc()
        if (fallbackSrc && img.src !== fallbackSrc) {
          img.src = fallbackSrc
        }
      })

      img.setAttribute('data-load-optimized', 'true')
    }

    // 预加载关键图片
    if (isAboveTheFold(img) && !img.hasAttribute('data-preloaded')) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = img.src
      document.head.appendChild(link)
      
      img.setAttribute('data-preloaded', 'true')
    }
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
   * 获取备用图片源
   */
  const getFallbackImageSrc = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
  }

  // 不渲染任何UI
  return null
}

/**
 * 图片SEO分析Hook
 */
export function useImageSEOAnalysis() {
  const analyzePageImages = () => {
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt || '',
      title: img.title || '',
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      loading: img.loading,
      decoding: img.decoding,
      format: img.src.split('.').pop()?.toLowerCase()
    }))

    return analyzeImageSEO(images)
  }

  const getImageSEOReport = () => {
    const analysis = analyzePageImages()
    
    return {
      ...analysis,
      url: window.location.href,
      title: document.title,
      analyzedAt: new Date().toISOString()
    }
  }

  return {
    analyzePageImages,
    getImageSEOReport
  }
}

/**
 * 图片SEO优化配置Hook
 */
export function useImageSEOConfig() {
  const defaultConfig = {
    autoGenerateAlt: true,
    optimizeFilenames: false,
    addStructuredData: true,
    enableLazyLoading: true,
    enablePreloading: true,
    maxAltLength: 125,
    fallbackImage: null
  }

  // 这里可以从配置文件或API获取配置
  return defaultConfig
}