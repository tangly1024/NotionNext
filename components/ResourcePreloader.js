import { useEffect, useState } from 'react'
import Head from 'next/head'

/**
 * 资源预加载组件
 * 用于预加载关键资源，提升页面性能
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 资源预加载组件
 */
export default function ResourcePreloader({
  preloadImages = [],
  preloadFonts = [],
  preloadScripts = [],
  preloadStyles = [],
  dnsPrefetch = [],
  preconnect = [],
  prefetch = [],
  modulePreload = [],
  priority = 'high',
  onLoad,
  onError
}) {
  const [loadedResources, setLoadedResources] = useState(new Set())
  const [failedResources, setFailedResources] = useState(new Set())
  
  // 预加载图片
  useEffect(() => {
    if (preloadImages.length === 0) return
    
    const imagePromises = preloadImages.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          setLoadedResources(prev => new Set([...prev, src]))
          resolve(src)
        }
        img.onerror = () => {
          setFailedResources(prev => new Set([...prev, src]))
          reject(src)
        }
        img.src = src
      })
    })
    
    Promise.allSettled(imagePromises).then(results => {
      const loaded = results.filter(r => r.status === 'fulfilled').map(r => r.value)
      const failed = results.filter(r => r.status === 'rejected').map(r => r.reason)
      
      onLoad?.({ type: 'images', loaded, failed })
      onError?.({ type: 'images', failed })
    })
  }, [preloadImages, onLoad, onError])
  
  // 预加载脚本
  useEffect(() => {
    if (preloadScripts.length === 0) return
    
    const scriptPromises = preloadScripts.map(src => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.onload = () => {
          setLoadedResources(prev => new Set([...prev, src]))
          resolve(src)
        }
        script.onerror = () => {
          setFailedResources(prev => new Set([...prev, src]))
          reject(src)
        }
        script.src = src
        script.async = true
        document.head.appendChild(script)
      })
    })
    
    Promise.allSettled(scriptPromises).then(results => {
      const loaded = results.filter(r => r.status === 'fulfilled').map(r => r.value)
      const failed = results.filter(r => r.status === 'rejected').map(r => r.reason)
      
      onLoad?.({ type: 'scripts', loaded, failed })
      onError?.({ type: 'scripts', failed })
    })
  }, [preloadScripts, onLoad, onError])
  
  return (
    <Head>
      {/* DNS 预解析 */}
      {dnsPrefetch.map((domain, index) => (
        <link key={`dns-${index}`} rel="dns-prefetch" href={domain} />
      ))}
      
      {/* 预连接 */}
      {preconnect.map((domain, index) => (
        <link key={`preconnect-${index}`} rel="preconnect" href={domain} crossOrigin="" />
      ))}
      
      {/* 预加载图片 */}
      {preloadImages.map((src, index) => (
        <link
          key={`img-${index}`}
          rel="preload"
          href={src}
          as="image"
          fetchPriority={priority}
        />
      ))}
      
      {/* 预加载字体 */}
      {preloadFonts.map((font, index) => (
        <link
          key={`font-${index}`}
          rel="preload"
          href={font.src || font}
          as="font"
          type={font.type || 'font/woff2'}
          crossOrigin=""
          fetchPriority={priority}
        />
      ))}
      
      {/* 预加载样式 */}
      {preloadStyles.map((href, index) => (
        <link
          key={`style-${index}`}
          rel="preload"
          href={href}
          as="style"
          fetchPriority={priority}
        />
      ))}
      
      {/* 预加载脚本 */}
      {preloadScripts.map((src, index) => (
        <link
          key={`script-${index}`}
          rel="preload"
          href={src}
          as="script"
          fetchPriority={priority}
        />
      ))}
      
      {/* 模块预加载 */}
      {modulePreload.map((src, index) => (
        <link
          key={`module-${index}`}
          rel="modulepreload"
          href={src}
          fetchPriority={priority}
        />
      ))}
      
      {/* 预获取 */}
      {prefetch.map((href, index) => (
        <link key={`prefetch-${index}`} rel="prefetch" href={href} />
      ))}
    </Head>
  )
}

/**
 * 智能资源预加载器
 * 根据用户行为和页面内容智能预加载资源
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 智能预加载组件
 */
export function SmartPreloader({
  enableImagePreload = true,
  enableFontPreload = true,
  enableScriptPreload = false,
  maxPreloadImages = 5,
  preloadThreshold = 0.5,
  children
}) {
  const [preloadQueue, setPreloadQueue] = useState({
    images: [],
    fonts: [],
    scripts: []
  })
  
  // 自动检测页面中的资源
  useEffect(() => {
    if (!enableImagePreload) return
    
    const images = Array.from(document.querySelectorAll('img[data-src], img[loading="lazy"]'))
      .slice(0, maxPreloadImages)
      .map(img => img.dataset.src || img.src)
      .filter(Boolean)
    
    setPreloadQueue(prev => ({
      ...prev,
      images: [...new Set([...prev.images, ...images])]
    }))
  }, [enableImagePreload, maxPreloadImages])
  
  // 检测字体
  useEffect(() => {
    if (!enableFontPreload) return
    
    const fontFaces = Array.from(document.fonts)
      .map(font => font.src)
      .filter(Boolean)
    
    setPreloadQueue(prev => ({
      ...prev,
      fonts: [...new Set([...prev.fonts, ...fontFaces])]
    }))
  }, [enableFontPreload])
  
  // 检测脚本（如果启用）
  useEffect(() => {
    if (!enableScriptPreload) return
    
    const scripts = Array.from(document.querySelectorAll('script[data-src]'))
      .map(script => script.dataset.src)
      .filter(Boolean)
    
    setPreloadQueue(prev => ({
      ...prev,
      scripts: [...new Set([...prev.scripts, ...scripts])]
    }))
  }, [enableScriptPreload])
  
  // 基于用户交互的智能预加载
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleUserInteraction = () => {
      // 当用户开始交互时，预加载更多资源
      const links = Array.from(document.querySelectorAll('a[href]'))
        .filter(link => {
          const rect = link.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          // 预加载视口下方一定范围内的链接资源
          return rect.top < viewportHeight * (1 + preloadThreshold)
        })
        .map(link => link.href)
        .slice(0, 3) // 限制数量
      
      if (links.length > 0) {
        // 这里可以添加预加载逻辑
        console.log('Smart preloading links:', links)
      }
    }
    
    // 监听用户交互事件
    const events = ['mouseenter', 'touchstart', 'focus']
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true })
    })
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [preloadThreshold])
  
  return (
    <>
      <ResourcePreloader
        preloadImages={preloadQueue.images}
        preloadFonts={preloadQueue.fonts}
        preloadScripts={preloadQueue.scripts}
        dnsPrefetch={[
          '//fonts.googleapis.com',
          '//fonts.gstatic.com',
          '//www.google-analytics.com',
          '//cdn.jsdelivr.net'
        ]}
        preconnect={[
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ]}
      />
      {children}
    </>
  )
}

/**
 * 关键资源预加载Hook
 * @param {Array} resources 资源列表
 * @param {Object} options 配置选项
 * @returns {Object} 预加载状态
 */
export function useResourcePreload(resources = [], options = {}) {
  const [status, setStatus] = useState({
    loading: false,
    loaded: [],
    failed: [],
    progress: 0
  })
  
  const { timeout = 10000, retries = 1 } = options
  
  useEffect(() => {
    if (resources.length === 0) return
    
    setStatus(prev => ({ ...prev, loading: true }))
    
    const promises = resources.map((resource) => {
      return new Promise((resolve, reject) => {
        let attempts = 0
        
        const tryLoad = () => {
          attempts++
          
          if (resource.type === 'image') {
            const img = new Image()
            const timeoutId = setTimeout(() => {
              reject({ resource, error: 'timeout' })
            }, timeout)
            
            img.onload = () => {
              clearTimeout(timeoutId)
              resolve({ resource, success: true })
            }
            img.onerror = () => {
              clearTimeout(timeoutId)
              if (attempts < retries) {
                setTimeout(tryLoad, 1000) // 重试延迟1秒
              } else {
                reject({ resource, error: 'load_failed' })
              }
            }
            img.src = resource.src
          } else if (resource.type === 'script') {
            const script = document.createElement('script')
            const timeoutId = setTimeout(() => {
              reject({ resource, error: 'timeout' })
            }, timeout)
            
            script.onload = () => {
              clearTimeout(timeoutId)
              resolve({ resource, success: true })
            }
            script.onerror = () => {
              clearTimeout(timeoutId)
              if (attempts < retries) {
                setTimeout(tryLoad, 1000)
              } else {
                reject({ resource, error: 'load_failed' })
              }
            }
            script.src = resource.src
            script.async = true
            document.head.appendChild(script)
          } else {
            // 其他类型的资源
            const controller = new AbortController()
            const timeoutId = setTimeout(() => {
              controller.abort()
              reject({ resource, error: 'timeout' })
            }, timeout)
            
            fetch(resource.src, { signal: controller.signal })
              .then(() => {
                clearTimeout(timeoutId)
                resolve({ resource, success: true })
              })
              .catch(() => {
                clearTimeout(timeoutId)
                if (attempts < retries) {
                  setTimeout(tryLoad, 1000)
                } else {
                  reject({ resource, error: 'load_failed' })
                }
              })
          }
        }
        
        tryLoad()
      })
    })
    
    Promise.allSettled(promises).then(results => {
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
    let loadedCount = 0
    promises.forEach(promise => {
      promise
        .then(() => {
          loadedCount++
          setStatus(prev => ({
            ...prev,
            progress: Math.round((loadedCount / resources.length) * 100)
          }))
        })
        .catch(() => {
          loadedCount++
          setStatus(prev => ({
            ...prev,
            progress: Math.round((loadedCount / resources.length) * 100)
          }))
        })
    })
  }, [resources, timeout, retries])
  
  return status
}

/**
 * 资源预加载状态显示组件
 * @param {Object} props 组件属性
 * @returns {JSX.Element} 状态显示组件
 */
export function PreloadStatus({ resources = [], options = {} }) {
  const status = useResourcePreload(resources, options)
  
  if (!status.loading && status.loaded.length === 0 && status.failed.length === 0) {
    return null
  }
  
  return (
    <div className="preload-status p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
      <div className="flex items-center justify-between">
        <span>资源预加载</span>
        <span>{status.progress}%</span>
      </div>
      {status.loading && (
        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
          <div 
            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${status.progress}%` }}
          />
        </div>
      )}
      {status.failed.length > 0 && (
        <div className="text-red-600 mt-1">
          {status.failed.length} 个资源加载失败
        </div>
      )}
    </div>
  )
}