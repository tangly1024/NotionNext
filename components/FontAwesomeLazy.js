import { siteConfig } from '@/lib/config'
import { useEffect, useInsertionEffect } from 'react'

/**
 * FontAwesome懒加载组件
 * 使用useInsertionEffect来优化加载性能
 */
export default function FontAwesomeLazy() {
  // 使用useInsertionEffect进行CSS懒加载
  // 如果浏览器不支持useInsertionEffect，则回退到useEffect
  const useInsertionEffectOrFallback = useInsertionEffect || useEffect

  useInsertionEffectOrFallback(() => {
    const BLOG = require('@/blog.config')
    if (!BLOG.FONT_AWESOME) return

    // 创建link元素
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = BLOG.FONT_AWESOME
    link.id = 'font-awesome'
    link.crossOrigin = 'anonymous'
    link.referrerPolicy = 'no-referrer'
    
    // 添加到head
    document.head.appendChild(link)
    
    // 清理函数
    return () => {
      const linkElm = document.getElementById('font-awesome')
      if (linkElm) {
        linkElm.remove()
      }
    }
  }, [])

  return null
}
