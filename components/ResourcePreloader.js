import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 资源预加载管理器
 * 避免重复预加载，管理关键资源优先级
 */
export default function ResourcePreloader({ 
  images = [], 
  fonts = [], 
  scripts = [], 
  styles = [],
  enableDNSPrefetch = true,
  enablePreconnect = true 
}) {
  const preloadRef = useRef(new Set())

  // 默认需要预加载的资源
  const defaultResources = {
    fonts: [
      siteConfig('FONT_URL'),
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ].filter(Boolean),
    
    scripts: [
      // 关键的第三方脚本
    ].filter(Boolean),
    
    styles: [
      // 关键CSS
    ].filter(Boolean),
    
    dns: [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'www.google-analytics.com',
      'www.googletagmanager.com',
      'cdnjs.cloudflare.com'
    ],
    
    preconnect: [
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com'
    ]
  }

  // 合并资源列表
  const allResources = {
    images: [...images].filter(Boolean),
    fonts: [...defaultResources.fonts, ...fonts].filter(Boolean),
    scripts: [...defaultResources.scripts, ...scripts].filter(Boolean),
    styles: [...defaultResources.styles, ...styles].filter(Boolean)
  }

  // 去重函数
  const deduplicateResources = (resources) => {
    const seen = new Set()
    return resources.filter(resource => {
      const key = typeof resource === 'string' ? resource : resource.href || resource.src
      if (seen.has(key) || preloadRef.current.has(key)) {
        return false
      }
      seen.add(key)
      preloadRef.current.add(key)
      return true
    })
  }

  // 按优先级排序资源
  const prioritizeResources = (resources, type) => {
    return resources.sort((a, b) => {
      const aPriority = getPriority(a, type)
      const bPriority = getPriority(b, type)
      return bPriority - aPriority // 高优先级在前
    })
  }

  // 获取资源优先级
  const getPriority = (resource, type) => {
    if (typeof resource === 'object' && resource.priority) {
      return resource.priority
    }
    
    // 默认优先级规则
    switch (type) {
      case 'images':
        if (typeof resource === 'string') {
          if (resource.includes('hero') || resource.includes('banner')) return 100
          if (resource.includes('logo') || resource.includes('avatar')) return 90
          return 50
        }
        return resource.priority || 50
        
      case 'fonts':
        return 95 // 字体高优先级
        
      case 'styles':
        return 90 // 样式高优先级
        
      case 'scripts':
        return 30 // 脚本低优先级
        
      default:
        return 50
    }
  }

  // 判断是否应该预加载图片
  const shouldPreloadImage = (imageUrl) => {
    if (!imageUrl) return false
    
    try {
      // 避免预加载过大的图片
      let url, params
      
      if (typeof window !== 'undefined') {
        url = new URL(imageUrl, window.location.origin)
        params = new URLSearchParams(url.search)
      } else {
        // 服务端渲染时的简单URL解析
        const urlParts = imageUrl.split('?')
        if (urlParts.length > 1) {
          params = new URLSearchParams(urlParts[1])
        } else {
          params = new URLSearchParams()
        }
      }
      
      const width = params.get('w') || params.get('width')
      
      // 如果图片宽度超过1200px，不预加载
      if (width && parseInt(width) > 1200) {
        return false
      }
      
      // 只预加载首屏可能用到的图片格式
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
      const hasAllowedExtension = allowedExtensions.some(ext => 
        imageUrl.toLowerCase().includes(ext)
      )
      
      return hasAllowedExtension || imageUrl.includes('images/') || imageUrl.includes('avatar')
    } catch (error) {
      // URL解析失败时，使用保守策略
      console.warn('Failed to parse image URL for preload check:', imageUrl, error)
      return imageUrl.includes('logo') || imageUrl.includes('avatar')
    }
  }

  // 生成预加载链接
  const generatePreloadLinks = () => {
    const links = []

    // DNS预解析
    if (enableDNSPrefetch) {
      defaultResources.dns.forEach(domain => {
        links.push(
          <link key={`dns-${domain}`} rel="dns-prefetch" href={`//${domain}`} />
        )
      })
    }

    // 预连接
    if (enablePreconnect) {
      defaultResources.preconnect.forEach(url => {
        links.push(
          <link key={`preconnect-${url}`} rel="preconnect" href={url} crossOrigin="anonymous" />
        )
      })
    }

    // 图片预加载（只预加载首屏关键图片，避免预加载警告）
    const prioritizedImages = prioritizeResources(deduplicateResources(allResources.images), 'images')
    const criticalImages = prioritizedImages.filter(image => {
      const priority = getPriority(image, 'images')
      return priority >= 90 // 只预加载优先级90以上的图片（logo、hero图等）
    })
    
    criticalImages.slice(0, 2).forEach((image, index) => { // 进一步限制为2张
      const imageUrl = typeof image === 'string' ? image : image.src
      const imageSizes = typeof image === 'object' ? image.sizes : undefined
      const imageSrcSet = typeof image === 'object' ? image.srcSet : undefined
      
      if (imageUrl && shouldPreloadImage(imageUrl)) {
        links.push(
          <link
            key={`image-${imageUrl}-${index}`}
            rel="preload"
            as="image"
            href={imageUrl}
            imageSizes={imageSizes}
            imageSrcSet={imageSrcSet}
          />
        )
      }
    })

    // 字体预加载
    const prioritizedFonts = prioritizeResources(deduplicateResources(allResources.fonts), 'fonts')
    prioritizedFonts.forEach((font, index) => {
      const fontUrl = typeof font === 'string' ? font : font.href
      if (fontUrl) {
        links.push(
          <link
            key={`font-${fontUrl}-${index}`}
            rel="preload"
            as="font"
            href={fontUrl}
            type="font/woff2"
            crossOrigin="anonymous"
          />
        )
      }
    })

    // 样式预加载
    const prioritizedStyles = prioritizeResources(deduplicateResources(allResources.styles), 'styles')
    prioritizedStyles.forEach((style, index) => {
      const styleUrl = typeof style === 'string' ? style : style.href
      if (styleUrl) {
        links.push(
          <link
            key={`style-${styleUrl}-${index}`}
            rel="preload"
            as="style"
            href={styleUrl}
          />
        )
      }
    })

    // 脚本预加载（低优先级）
    const prioritizedScripts = prioritizeResources(deduplicateResources(allResources.scripts), 'scripts')
    prioritizedScripts.slice(0, 2).forEach((script, index) => { // 限制预加载数量
      const scriptUrl = typeof script === 'string' ? script : script.src
      if (scriptUrl) {
        links.push(
          <link
            key={`script-${scriptUrl}-${index}`}
            rel="preload"
            as="script"
            href={scriptUrl}
          />
        )
      }
    })

    return links
  }

  // 清理预加载缓存（仅在组件卸载时）
  useEffect(() => {
    return () => {
      preloadRef.current.clear()
    }
  }, [])

  return (
    <Head>
      {generatePreloadLinks()}
      
      {/* 资源提示 */}
      <meta name="resource-hints" content="preload, dns-prefetch, preconnect" />
      
      {/* 性能优化提示 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="format-detection" content="telephone=no" />
    </Head>
  )
}

/**
 * 智能图片预加载Hook
 * 根据页面内容智能决定需要预加载的图片
 */
export function useSmartImagePreload(post, siteInfo) {
  const [criticalImages, setCriticalImages] = useState([])

  useEffect(() => {
    const images = []

    // 1. 网站Logo（最高优先级）
    if (siteInfo?.icon) {
      images.push({
        src: siteInfo.icon,
        priority: 100,
        sizes: '32x32',
        type: 'logo'
      })
    }

    // 2. 文章封面图（高优先级）
    if (post?.pageCover) {
      images.push({
        src: post.pageCover,
        priority: 95,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        type: 'cover'
      })
    }

    // 3. 文章缩略图
    if (post?.pageCoverThumbnail && post.pageCoverThumbnail !== post?.pageCover) {
      images.push({
        src: post.pageCoverThumbnail,
        priority: 90,
        sizes: '(max-width: 768px) 100vw, 300px',
        type: 'thumbnail'
      })
    }

    // 4. 网站背景图
    if (siteInfo?.pageCover) {
      images.push({
        src: siteInfo.pageCover,
        priority: 80,
        sizes: '100vw',
        type: 'background'
      })
    }

    // 5. 作者头像
    if (siteInfo?.avatar) {
      images.push({
        src: siteInfo.avatar,
        priority: 70,
        sizes: '64x64',
        type: 'avatar'
      })
    }

    setCriticalImages(images)
  }, [post, siteInfo])

  return criticalImages
}

/**
 * 关键资源预加载Hook
 * 预加载页面渲染必需的关键资源
 */
export function useCriticalResourcePreload() {
  const [criticalResources, setCriticalResources] = useState({
    fonts: [],
    styles: [],
    scripts: []
  })

  useEffect(() => {
    const resources = {
      fonts: [],
      styles: [],
      scripts: []
    }

    // 关键字体
    const fontUrl = siteConfig('FONT_URL')
    if (fontUrl) {
      resources.fonts.push({
        href: fontUrl,
        priority: 100,
        type: 'font/woff2'
      })
    }

    // 关键CSS（如果有内联CSS配置）
    const criticalCSS = siteConfig('CRITICAL_CSS_URL')
    if (criticalCSS) {
      resources.styles.push({
        href: criticalCSS,
        priority: 95
      })
    }

    // 关键脚本（如分析脚本）
    const analyticsId = siteConfig('ANALYTICS_GOOGLE_ID')
    if (analyticsId) {
      resources.scripts.push({
        src: `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`,
        priority: 60
      })
    }

    setCriticalResources(resources)
  }, [])

  return criticalResources
}

/**
 * 性能监控Hook
 * 监控预加载资源的加载性能
 */
export function usePreloadPerformance() {
  const [performanceData, setPerformanceData] = useState({
    preloadedCount: 0,
    loadTime: 0,
    errors: []
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const preloadEntries = entries.filter(entry => 
        entry.initiatorType === 'link' && 
        entry.name.includes('preload')
      )

      if (preloadEntries.length > 0) {
        const avgLoadTime = preloadEntries.reduce((sum, entry) => 
          sum + entry.loadEnd - entry.loadStart, 0
        ) / preloadEntries.length

        setPerformanceData(prev => ({
          ...prev,
          preloadedCount: prev.preloadedCount + preloadEntries.length,
          loadTime: avgLoadTime
        }))
      }
    })

    observer.observe({ entryTypes: ['resource'] })

    return () => observer.disconnect()
  }, [])

  return performanceData
}