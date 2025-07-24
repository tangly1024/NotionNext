import { useState, useEffect } from 'react'

/**
 * 客户端渲染Hook - 避免水合错误
 * 
 * 使用场景：
 * - 需要访问window、document等浏览器API
 * - 需要使用localStorage、sessionStorage
 * - 需要生成随机内容或时间戳
 * - 需要检测浏览器特性
 * 
 * @returns {boolean} 是否在客户端
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * 安全的浏览器API访问Hook
 * 
 * @param {Function} accessor - 访问浏览器API的函数
 * @param {*} fallback - 服务端渲染时的默认值
 * @returns {*} API访问结果或默认值
 */
export function useSafeBrowserAPI(accessor, fallback = null) {
  const [value, setValue] = useState(fallback)
  const isClient = useClientOnly()

  useEffect(() => {
    if (isClient && typeof accessor === 'function') {
      try {
        const result = accessor()
        setValue(result)
      } catch (error) {
        console.warn('Browser API access failed:', error)
        setValue(fallback)
      }
    }
  }, [isClient, accessor, fallback])

  return value
}

/**
 * 延迟渲染Hook - 避免水合错误
 * 
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {boolean} 是否可以渲染
 */
export function useDelayedRender(delay = 0) {
  const [canRender, setCanRender] = useState(false)
  const isClient = useClientOnly()

  useEffect(() => {
    if (isClient) {
      if (delay > 0) {
        const timer = setTimeout(() => setCanRender(true), delay)
        return () => clearTimeout(timer)
      } else {
        setCanRender(true)
      }
    }
  }, [isClient, delay])

  return canRender
}

/**
 * 条件渲染组件 - 只在客户端渲染
 */
export function ClientOnly({ children, fallback = null }) {
  const isClient = useClientOnly()
  
  if (!isClient) {
    return fallback
  }
  
  return children
}

/**
 * 安全的存储访问Hook
 */
export function useStorage(type = 'localStorage') {
  const isClient = useClientOnly()
  
  const getItem = (key, defaultValue = null) => {
    if (!isClient) return defaultValue
    
    try {
      const storage = type === 'sessionStorage' ? sessionStorage : localStorage
      const item = storage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Storage access failed for key "${key}":`, error)
      return defaultValue
    }
  }
  
  const setItem = (key, value) => {
    if (!isClient) return false
    
    try {
      const storage = type === 'sessionStorage' ? sessionStorage : localStorage
      storage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Storage write failed for key "${key}":`, error)
      return false
    }
  }
  
  const removeItem = (key) => {
    if (!isClient) return false
    
    try {
      const storage = type === 'sessionStorage' ? sessionStorage : localStorage
      storage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Storage remove failed for key "${key}":`, error)
      return false
    }
  }
  
  return { getItem, setItem, removeItem, isClient }
}