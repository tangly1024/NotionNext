import { useEffect } from 'react'

/**
 * FontAwesome懒加载组件
 * 用于客户端动态加载FontAwesome字体图标
 */
export default function FontAwesomeLazy() {
  useEffect(() => {
    // 检查是否在浏览器环境中
    const isBrowser = typeof window !== 'undefined'
    if (!isBrowser) return

    // 获取配置
    const BLOG = require('@/blog.config')
    if (!BLOG.FONT_AWESOME) return

    // 检查是否已经存在FontAwesome元素，避免重复加载
    const existingLink = document.getElementById('font-awesome')
    if (existingLink) return

    // 创建link元素
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = BLOG.FONT_AWESOME
    link.id = 'font-awesome'
    link.crossOrigin = 'anonymous'
    link.referrerPolicy = 'no-referrer'

    // 添加到head
    document.head.appendChild(link)

    // 清理函数 - 在实际应用中可能不需要移除FontAwesome
    // 因为其他组件可能仍需要使用它，所以注释掉
    /*
    return () => {
      const linkElm = document.getElementById('font-awesome')
      if (linkElm) {
        linkElm.remove()
      }
    }
    */

    // 空依赖数组是有意为之，我们希望这个副作用只在组件挂载时执行一次
  }, [])

  return null
}
