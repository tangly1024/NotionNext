import Head from 'next/head'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * 关键资源预加载管理器
 * 智能预加载关键CSS、字体、图片等资源
 */
export default function ResourcePreloader({ 
  criticalCSS = [],
  fonts = [],
  images = [],
  scripts = [],
  prefetchPages = [],
  enableDNSPrefetch = true,
  enablePreconnect = true
}) {
  const [resourcesLoaded, setResourcesLoaded] = useState(false)
  const [loadedResources, setLoadedResources] = useState(new Set())

  // 默认预连接的域名
  const defaultPreconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ]

  // 默认DNS预解析的域名
  const defaultDNSPrefetchDomains = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//www.google-analytics.com',
    '//www.googletagmanager.com',
    '//cdn.jsdelivr.net'
  ]

  // 获取关键字体
  const getCriticalFonts = () => {
    const defaultFonts = [
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        as: 'style'
      }
    ]
    return [...defaultFonts, ...fonts]
  }

  // 获取关键图片
  const getCriticalImages = () => {
    const siteIcon = siteConfig('SITE_ICON')
    const avatar = siteConfig('AVATAR')
    const defaultImages = []
    
    if (siteIcon) {
      defaultImages.push({
        href: siteIcon,
        as: 'image',
        type: getImageType(siteIcon)
      })
    }
    
    if (avatar) {
      defaultImages.push({
        href: avatar,
        as: 'image',
        type: getImageType(avatar)
      })
    }
    
    return [...defaultImages, ...images]
  }

  // 获取图片类型
  const getImageType = (src) => {
    if (src.includes('.webp')) return 'image/webp'
    if (src.includes('.avif')) return 'image/avif'
    if (src.includes('.png')) return 'image/png'
    if (src.includes('.jpg') || src.includes('.jpeg')) return 'image/jpeg'
    if (src.includes('.svg')) return 'image/svg+xml'
    return 'image/jpeg' // 默认
  }

  // 资源加载完成回调
  const handleResourceLoad = (resourceUrl) => {
    setLoadedResources(prev => new Set([...prev, resourceUrl]))
  }

  // 检查所有关键资源是否加载完成
  useEffect(() => {
    const criticalResources = [
      ...getCriticalFonts().map(f => f.href),
      ...getCriticalImages().map(i => i.href),
      ...criticalCSS
    ]
    
    const allLoaded = criticalResources.every(resource => loadedResources.has(resource))
    
    if (allLoaded && criticalResources.length > 0) {
      setResourcesLoaded(true)
      
      // 触发自定义事件
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('criticalResourcesLoaded'))
      }
    }
  }, [loadedResources, criticalCSS])

  return (
    <Head>
      {/* DNS预解析 */}
      {enableDNSPrefetch && defaultDNSPrefetchDomains.map(domain => (
        <link key={domain} rel="dns-prefetch" href={domain} />
      ))}
      
      {/* 预连接 */}
      {enablePreconnect && defaultPreconnectDomains.map(domain => (
        <link key={domain} rel="preconnect" href={domain} crossOrigin="anonymous" />
      ))}
      
      {/* 关键CSS预加载 */}
      {criticalCSS.map(css => (
        <link
          key={css}
          rel="preload"
          href={css}
          as="style"
          onLoad={() => handleResourceLoad(css)}
          onError={() => console.warn(`Failed to preload CSS: ${css}`)}
        />
      ))}
      
      {/* 字体预加载 */}
      {getCriticalFonts().map(font => (
        <link
          key={font.href}
          rel="preload"
          href={font.href}
          as={font.as || 'font'}
          type={font.type}
          crossOrigin="anonymous"
          onLoad={() => handleResourceLoad(font.href)}
          onError={() => console.warn(`Failed to preload font: ${font.href}`)}
        />
      ))}
      
      {/* 关键图片预加载 */}
      {getCriticalImages().map(image => (
        <link
          key={image.href}
          rel="preload"
          href={image.href}
          as={image.as || 'image'}
          type={image.type}
          onLoad={() => handleResourceLoad(image.href)}
          onError={() => console.warn(`Failed to preload image: ${image.href}`)}
        />
      ))}
      
      {/* 关键脚本预加载 */}
      {scripts.map(script => (
        <link
          key={script.href || script.src}
          rel="preload"
          href={script.href || script.src}
          as="script"
          type={script.type || 'text/javascript'}
          crossOrigin={script.crossOrigin}
          onLoad={() => handleResourceLoad(script.href || script.src)}
          onError={() => console.warn(`Failed to preload script: ${script.href || script.src}`)}
        />
      ))}
      
      {/* 页面预取 */}
      {prefetchPages.map(page => (
        <link
          key={page}
          rel="prefetch"
          href={page}
          as="document"
        />
      ))}
      
      {/* 资源提示 */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* 关键资源加载状态 */}
      {resourcesLoaded && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 标记关键资源已加载
              window.__CRITICAL_RESOURCES_LOADED__ = true;
              
              // 移除加载动画
              const loadingElements = document.querySelectorAll('.loading-placeholder');
              loadingElements.forEach(el => el.classList.add('loaded'));
              
              // 启用非关键功能
              if (window.enableNonCriticalFeatures) {
                window.enableNonCriticalFeatures();
              }
            `
          }}
        />
      )}
    </Head>
  )
}

/**
 * 智能资源预加载Hook
 */
export function useResourcePreloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadedResources, setLoadedResources] = useState(new Set())
  
  useEffect(() => {
    const handleCriticalResourcesLoaded = () => {
      setIsLoading(false)
    }
    
    // 监听关键资源加载完成事件
    window.addEventListener('criticalResourcesLoaded', handleCriticalResourcesLoaded)
    
    // 检查是否已经加载完成
    if (window.__CRITICAL_RESOURCES_LOADED__) {
      setIsLoading(false)
    }
    
    return () => {
      window.removeEventListener('criticalResourcesLoaded', handleCriticalResourcesLoaded)
    }
  }, [])
  
  const preloadResource = (url, type = 'fetch') => {
    if (loadedResources.has(url)) return Promise.resolve()
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = type
      
      link.onload = () => {
        setLoadedResources(prev => new Set([...prev, url]))
        resolve()
      }
      
      link.onerror = reject
      
      document.head.appendChild(link)
    })
  }
  
  return {
    isLoading,
    loadedResources,
    preloadResource
  }
}

/**
 * 性能监控Hook
 */
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState({})
  
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach(entry => {
        if (entry.entryType === 'navigation') {
          setMetrics(prev => ({
            ...prev,
            navigationTiming: {
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              loadComplete: entry.loadEventEnd - entry.loadEventStart,
              firstPaint: entry.responseEnd - entry.requestStart,
              domInteractive: entry.domInteractive - entry.requestStart
            }
          }))
        }
        
        if (entry.entryType === 'paint') {
          setMetrics(prev => ({
            ...prev,
            paintTiming: {
              ...prev.paintTiming,
              [entry.name]: entry.startTime
            }
          }))
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            lcp: entry.startTime
          }))
        }
        
        if (entry.entryType === 'first-input') {
          setMetrics(prev => ({
            ...prev,
            fid: entry.processingStart - entry.startTime
          }))
        }
        
        if (entry.entryType === 'layout-shift') {
          setMetrics(prev => ({
            ...prev,
            cls: (prev.cls || 0) + entry.value
          }))
        }
      })
    })
    
    // 观察各种性能指标
    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (e) {
      console.warn('Performance observer not supported:', e)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return metrics
}