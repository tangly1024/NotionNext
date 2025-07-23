/**
 * 性能优化器
 * 解决重复图片预加载、资源优先级管理等性能问题
 */

import { siteConfig } from '@/lib/config'

/**
 * 图片预加载去重管理器
 */
class ImagePreloadManager {
  constructor() {
    this.preloadedImages = new Set()
    this.preloadQueue = new Map()
    this.maxConcurrentPreloads = 3
    this.currentPreloads = 0
  }

  /**
   * 添加图片到预加载队列（去重）
   */
  addToPreloadQueue(imageUrl, priority = 50) {
    if (this.preloadedImages.has(imageUrl)) {
      return false // 已经预加载过
    }

    if (!this.preloadQueue.has(imageUrl)) {
      this.preloadQueue.set(imageUrl, {
        url: imageUrl,
        priority,
        timestamp: Date.now()
      })
      
      this.processQueue()
      return true
    }
    
    return false
  }

  /**
   * 处理预加载队列
   */
  async processQueue() {
    if (this.currentPreloads >= this.maxConcurrentPreloads) {
      return
    }

    // 按优先级排序
    const sortedQueue = Array.from(this.preloadQueue.values())
      .sort((a, b) => b.priority - a.priority)

    for (const item of sortedQueue) {
      if (this.currentPreloads >= this.maxConcurrentPreloads) {
        break
      }

      this.preloadQueue.delete(item.url)
      this.currentPreloads++
      
      this.preloadImage(item.url)
        .finally(() => {
          this.currentPreloads--
          this.processQueue() // 处理下一个
        })
    }
  }

  /**
   * 预加载单个图片
   */
  async preloadImage(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image()
      
      img.onload = () => {
        this.preloadedImages.add(imageUrl)
        resolve(true)
      }
      
      img.onerror = () => {
        console.warn(`Failed to preload image: ${imageUrl}`)
        resolve(false)
      }
      
      img.src = imageUrl
    })
  }

  /**
   * 获取预加载统计
   */
  getStats() {
    return {
      preloadedCount: this.preloadedImages.size,
      queueLength: this.preloadQueue.size,
      currentPreloads: this.currentPreloads
    }
  }

  /**
   * 清理过期的预加载记录
   */
  cleanup() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    
    for (const [url, item] of this.preloadQueue) {
      if (item.timestamp < oneHourAgo) {
        this.preloadQueue.delete(url)
      }
    }
  }
}

/**
 * 资源优先级管理器
 */
class ResourcePriorityManager {
  constructor() {
    this.resourceMap = new Map()
    this.priorityLevels = {
      CRITICAL: 100,
      HIGH: 80,
      MEDIUM: 60,
      LOW: 40,
      DEFERRED: 20
    }
  }

  /**
   * 设置资源优先级
   */
  setResourcePriority(resourceUrl, priority, type = 'unknown') {
    this.resourceMap.set(resourceUrl, {
      url: resourceUrl,
      priority,
      type,
      timestamp: Date.now()
    })
  }

  /**
   * 获取资源优先级
   */
  getResourcePriority(resourceUrl) {
    const resource = this.resourceMap.get(resourceUrl)
    return resource ? resource.priority : this.priorityLevels.MEDIUM
  }

  /**
   * 自动分配资源优先级
   */
  autoAssignPriority(resourceUrl, context = {}) {
    let priority = this.priorityLevels.MEDIUM

    // 根据资源类型分配优先级
    if (resourceUrl.includes('logo') || resourceUrl.includes('icon')) {
      priority = this.priorityLevels.CRITICAL
    } else if (resourceUrl.includes('hero') || resourceUrl.includes('banner')) {
      priority = this.priorityLevels.HIGH
    } else if (resourceUrl.includes('thumbnail') || resourceUrl.includes('avatar')) {
      priority = this.priorityLevels.MEDIUM
    } else if (resourceUrl.includes('background')) {
      priority = this.priorityLevels.LOW
    }

    // 根据上下文调整优先级
    if (context.isAboveFold) {
      priority = Math.min(priority + 20, this.priorityLevels.CRITICAL)
    }

    if (context.isFirstPage) {
      priority = Math.min(priority + 10, this.priorityLevels.CRITICAL)
    }

    this.setResourcePriority(resourceUrl, priority, context.type)
    return priority
  }
}

/**
 * WebP/AVIF格式检测和转换器
 */
class ModernImageFormatManager {
  constructor() {
    this.supportCache = new Map()
    this.formatPriority = ['avif', 'webp', 'original']
  }

  /**
   * 检测浏览器格式支持（缓存版本）
   */
  async detectFormatSupport() {
    const cacheKey = 'imageFormatSupport'
    
    // 检查缓存
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        try {
          const support = JSON.parse(cached)
          this.supportCache.set('formats', support)
          return support
        } catch (e) {
          // 缓存无效，继续检测
        }
      }
    }

    const support = {
      avif: await this.testFormat('avif'),
      webp: await this.testFormat('webp')
    }

    this.supportCache.set('formats', support)
    
    // 缓存结果
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(cacheKey, JSON.stringify(support))
    }

    return support
  }

  /**
   * 测试特定格式支持
   */
  async testFormat(format) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img.width === 1)
      img.onerror = () => resolve(false)
      
      const testImages = {
        webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
        avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
      }
      
      img.src = testImages[format]
    })
  }

  /**
   * 获取最佳图片格式
   */
  async getBestFormat(originalUrl) {
    const support = this.supportCache.get('formats') || await this.detectFormatSupport()
    
    for (const format of this.formatPriority) {
      if (format === 'original') return originalUrl
      if (support[format]) {
        return this.convertToFormat(originalUrl, format)
      }
    }
    
    return originalUrl
  }

  /**
   * 转换图片URL到指定格式
   */
  convertToFormat(originalUrl, format) {
    if (!originalUrl || format === 'original') return originalUrl
    
    // 如果是外部URL，尝试添加格式参数
    if (originalUrl.startsWith('http')) {
      const separator = originalUrl.includes('?') ? '&' : '?'
      return `${originalUrl}${separator}fm=${format}`
    }
    
    // 本地图片，需要服务器端支持
    return originalUrl
  }
}

// 单例实例
const imagePreloadManager = new ImagePreloadManager()
const resourcePriorityManager = new ResourcePriorityManager()
const modernImageFormatManager = new ModernImageFormatManager()

/**
 * 性能优化主函数
 */
export async function optimizePagePerformance(pageContext = {}) {
  const optimizations = []

  try {
    // 1. 检测和优化图片格式
    const formatSupport = await modernImageFormatManager.detectFormatSupport()
    optimizations.push({
      type: 'format_detection',
      result: formatSupport,
      message: `Format support detected: AVIF=${formatSupport.avif}, WebP=${formatSupport.webp}`
    })

    // 2. 优化图片预加载
    const images = pageContext.images || []
    let preloadCount = 0
    
    for (const image of images) {
      const priority = resourcePriorityManager.autoAssignPriority(image.src, {
        isAboveFold: image.isAboveFold,
        isFirstPage: pageContext.isFirstPage,
        type: 'image'
      })
      
      if (imagePreloadManager.addToPreloadQueue(image.src, priority)) {
        preloadCount++
      }
    }
    
    optimizations.push({
      type: 'image_preload',
      result: { preloadCount, totalImages: images.length },
      message: `Optimized preloading for ${preloadCount} images`
    })

    // 3. 资源优先级优化
    const resources = pageContext.resources || []
    for (const resource of resources) {
      resourcePriorityManager.autoAssignPriority(resource.url, resource.context)
    }
    
    optimizations.push({
      type: 'resource_priority',
      result: { optimizedResources: resources.length },
      message: `Set priority for ${resources.length} resources`
    })

    return {
      success: true,
      optimizations,
      stats: {
        preload: imagePreloadManager.getStats(),
        formatSupport
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      optimizations
    }
  }
}

/**
 * 获取性能优化建议
 */
export function getPerformanceRecommendations(pageData) {
  const recommendations = []

  // 检查图片优化
  if (pageData.images) {
    const largeImages = pageData.images.filter(img => 
      img.fileSize && img.fileSize > 500 * 1024
    )
    
    if (largeImages.length > 0) {
      recommendations.push({
        type: 'image_optimization',
        severity: 'medium',
        message: `${largeImages.length} images are larger than 500KB`,
        suggestion: 'Consider compressing images or using modern formats (WebP/AVIF)',
        affectedResources: largeImages.map(img => img.src)
      })
    }

    const imagesWithoutAlt = pageData.images.filter(img => !img.alt)
    if (imagesWithoutAlt.length > 0) {
      recommendations.push({
        type: 'accessibility',
        severity: 'high',
        message: `${imagesWithoutAlt.length} images missing alt attributes`,
        suggestion: 'Add descriptive alt attributes for better accessibility and SEO',
        affectedResources: imagesWithoutAlt.map(img => img.src)
      })
    }
  }

  // 检查预加载重复
  const preloadStats = imagePreloadManager.getStats()
  if (preloadStats.queueLength > 10) {
    recommendations.push({
      type: 'preload_optimization',
      severity: 'low',
      message: `${preloadStats.queueLength} resources in preload queue`,
      suggestion: 'Consider reducing the number of preloaded resources',
      details: preloadStats
    })
  }

  return recommendations
}

export {
  imagePreloadManager,
  resourcePriorityManager,
  modernImageFormatManager
}