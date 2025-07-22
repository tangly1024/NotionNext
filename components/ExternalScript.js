import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

/**
 * 第三方脚本异步加载优化组件
 * 支持延迟加载、错误处理、性能监控等
 */
export default function ExternalScript({
  src,
  strategy = 'afterInteractive', // 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker'
  onLoad,
  onError,
  onReady,
  id,
  async = true,
  defer = false,
  crossOrigin,
  integrity,
  referrerPolicy,
  type = 'text/javascript',
  timeout = 10000,
  retries = 2,
  fallback,
  condition,
  priority = 'low',
  ...props
}) {
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'ready' | 'error'
  const [error, setError] = useState(null)
  const scriptRef = useRef(null)
  const timeoutRef = useRef(null)
  const retriesRef = useRef(0)

  // 检查加载条件
  const shouldLoad = () => {
    if (typeof condition === 'function') {
      return condition()
    }
    if (typeof condition === 'boolean') {
      return condition
    }
    return true
  }

  // 清理定时器
  const clearLoadTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // 脚本加载成功
  const handleLoad = () => {
    clearLoadTimeout()
    setStatus('ready')
    setError(null)
    
    if (typeof onLoad === 'function') {
      onLoad()
    }
    
    if (typeof onReady === 'function') {
      onReady()
    }
  }

  // 脚本加载失败
  const handleError = (errorEvent) => {
    clearLoadTimeout()
    
    const errorInfo = {
      message: `Failed to load script: ${src}`,
      src,
      retries: retriesRef.current,
      event: errorEvent
    }
    
    setError(errorInfo)
    
    // 重试逻辑
    if (retriesRef.current < retries) {
      retriesRef.current++
      console.warn(`Script load failed, retrying (${retriesRef.current}/${retries}):`, src)
      
      setTimeout(() => {
        loadScript()
      }, 1000 * retriesRef.current) // 递增延迟重试
    } else {
      setStatus('error')
      
      if (typeof onError === 'function') {
        onError(errorInfo)
      }
      
      // 加载备用脚本
      if (fallback) {
        console.warn(`Loading fallback script for: ${src}`)
        loadFallbackScript()
      }
    }
  }

  // 加载超时处理
  const handleTimeout = () => {
    const errorInfo = {
      message: `Script load timeout: ${src}`,
      src,
      timeout,
      retries: retriesRef.current
    }
    
    handleError(errorInfo)
  }

  // 加载备用脚本
  const loadFallbackScript = () => {
    if (!fallback) return
    
    const fallbackScript = document.createElement('script')
    fallbackScript.src = fallback
    fallbackScript.async = async
    fallbackScript.defer = defer
    
    fallbackScript.onload = () => {
      console.log(`Fallback script loaded: ${fallback}`)
      handleLoad()
    }
    
    fallbackScript.onerror = () => {
      console.error(`Fallback script also failed: ${fallback}`)
      setStatus('error')
    }
    
    document.head.appendChild(fallbackScript)
  }

  // 加载脚本
  const loadScript = () => {
    if (!src || !shouldLoad()) return
    
    // 检查脚本是否已存在
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      setStatus('ready')
      return
    }
    
    setStatus('loading')
    setError(null)
    
    const script = document.createElement('script')
    script.src = src
    script.async = async
    script.defer = defer
    script.type = type
    
    if (id) script.id = id
    if (crossOrigin) script.crossOrigin = crossOrigin
    if (integrity) script.integrity = integrity
    if (referrerPolicy) script.referrerPolicy = referrerPolicy
    
    // 添加自定义属性
    Object.keys(props).forEach(key => {
      script.setAttribute(key, props[key])
    })
    
    script.onload = handleLoad
    script.onerror = handleError
    
    // 设置超时
    if (timeout > 0) {
      timeoutRef.current = setTimeout(handleTimeout, timeout)
    }
    
    scriptRef.current = script
    
    // 根据策略决定插入位置和时机
    if (strategy === 'beforeInteractive') {
      document.head.appendChild(script)
    } else {
      document.body.appendChild(script)
    }
  }

  // 根据策略决定加载时机
  useEffect(() => {
    if (!src) return
    
    switch (strategy) {
      case 'beforeInteractive':
        loadScript()
        break
        
      case 'afterInteractive':
        if (document.readyState === 'complete') {
          loadScript()
        } else {
          window.addEventListener('load', loadScript)
          return () => window.removeEventListener('load', loadScript)
        }
        break
        
      case 'lazyOnload':
        const timer = setTimeout(loadScript, 100)
        return () => clearTimeout(timer)
        
      case 'worker':
        // Web Worker中加载（如果支持）
        if (typeof Worker !== 'undefined') {
          try {
            const worker = new Worker(
              URL.createObjectURL(
                new Blob([`importScripts('${src}');`], { type: 'application/javascript' })
              )
            )
            worker.onmessage = handleLoad
            worker.onerror = handleError
          } catch (e) {
            console.warn('Worker loading failed, falling back to normal loading:', e)
            loadScript()
          }
        } else {
          loadScript()
        }
        break
        
      default:
        loadScript()
    }
    
    return () => {
      clearLoadTimeout()
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [src, strategy])

  // 性能监控
  useEffect(() => {
    if (status === 'ready' && typeof window !== 'undefined' && window.performance) {
      const entries = performance.getEntriesByName(src, 'resource')
      if (entries.length > 0) {
        const entry = entries[0]
        console.log(`Script performance [${src}]:`, {
          duration: entry.duration,
          transferSize: entry.transferSize,
          encodedBodySize: entry.encodedBodySize,
          decodedBodySize: entry.decodedBodySize
        })
      }
    }
  }, [status, src])

  // 渲染状态指示器（开发环境）
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: status === 'ready' ? 'green' : status === 'error' ? 'red' : 'orange',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        display: status === 'idle' ? 'none' : 'block'
      }}>
        {src.split('/').pop()}: {status}
        {error && <div style={{ fontSize: '10px' }}>{error.message}</div>}
      </div>
    )
  }

  return null
}

/**
 * 脚本管理器Hook
 */
export function useScriptManager() {
  const [scripts, setScripts] = useState(new Map())
  
  const loadScript = (src, options = {}) => {
    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (scripts.has(src)) {
        const script = scripts.get(src)
        if (script.status === 'ready') {
          resolve(script)
          return
        }
      }
      
      const script = document.createElement('script')
      script.src = src
      script.async = options.async !== false
      script.defer = options.defer || false
      
      if (options.type) script.type = options.type
      if (options.crossOrigin) script.crossOrigin = options.crossOrigin
      if (options.integrity) script.integrity = options.integrity
      
      script.onload = () => {
        const scriptInfo = { src, status: 'ready', element: script }
        setScripts(prev => new Map(prev).set(src, scriptInfo))
        resolve(scriptInfo)
      }
      
      script.onerror = (error) => {
        const scriptInfo = { src, status: 'error', error, element: script }
        setScripts(prev => new Map(prev).set(src, scriptInfo))
        reject(error)
      }
      
      const scriptInfo = { src, status: 'loading', element: script }
      setScripts(prev => new Map(prev).set(src, scriptInfo))
      
      document.head.appendChild(script)
    })
  }
  
  const unloadScript = (src) => {
    const script = scripts.get(src)
    if (script && script.element && script.element.parentNode) {
      script.element.parentNode.removeChild(script.element)
      setScripts(prev => {
        const newMap = new Map(prev)
        newMap.delete(src)
        return newMap
      })
    }
  }
  
  const getScriptStatus = (src) => {
    const script = scripts.get(src)
    return script ? script.status : 'not-loaded'
  }
  
  return {
    scripts: Array.from(scripts.values()),
    loadScript,
    unloadScript,
    getScriptStatus
  }
}

/**
 * 批量脚本加载器
 */
export function ScriptLoader({ scripts = [], onAllLoaded, onError }) {
  const [loadedCount, setLoadedCount] = useState(0)
  const [errors, setErrors] = useState([])
  
  useEffect(() => {
    if (scripts.length === 0) return
    
    let mounted = true
    const loadPromises = scripts.map(script => {
      return new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script')
        scriptElement.src = script.src
        scriptElement.async = script.async !== false
        scriptElement.defer = script.defer || false
        
        scriptElement.onload = () => {
          if (mounted) {
            setLoadedCount(prev => prev + 1)
            resolve(script)
          }
        }
        
        scriptElement.onerror = (error) => {
          if (mounted) {
            setErrors(prev => [...prev, { script, error }])
            reject(error)
          }
        }
        
        document.head.appendChild(scriptElement)
      })
    })
    
    Promise.allSettled(loadPromises).then(results => {
      if (mounted) {
        const successful = results.filter(r => r.status === 'fulfilled')
        const failed = results.filter(r => r.status === 'rejected')
        
        if (successful.length === scripts.length && onAllLoaded) {
          onAllLoaded(successful.map(r => r.value))
        }
        
        if (failed.length > 0 && onError) {
          onError(failed.map(r => r.reason))
        }
      }
    })
    
    return () => {
      mounted = false
    }
  }, [scripts, onAllLoaded, onError])
  
  return (
    <Head>
      {scripts.map(script => (
        <ExternalScript
          key={script.src}
          {...script}
        />
      ))}
    </Head>
  )
}