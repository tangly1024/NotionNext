import { useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * 404错误跟踪React组件包装器
 */
export default function NotFoundErrorTracker() {
  useEffect(() => {
    // 检查是否启用404监控
    const enable404Monitor = siteConfig('SEO_404_MONITOR', true)
    const enableAnalyticsTracking = siteConfig('SEO_404_ANALYTICS_TRACKING', true)
    
    if (!enable404Monitor) return

    // 动态导入404错误跟踪器类
    import('@/lib/seo/404ErrorTracker').then(({ default: NotFoundErrorTrackerClass }) => {
      // 初始化跟踪器
      if (!window.notFoundTracker) {
        window.notFoundTracker = new NotFoundErrorTrackerClass({
          apiEndpoint: '/api/seo/404-report',
          enableAnalytics: enableAnalyticsTracking,
          enableConsoleLog: process.env.NODE_ENV === 'development',
          retryAttempts: 3,
          retryDelay: 1000
        })
      }
    }).catch(error => {
      console.warn('Failed to load 404 error tracker:', error)
    })

    // 清理函数
    return () => {
      // 可以在这里添加清理逻辑
    }
  }, [])

  // 这个组件不渲染任何内容
  return null
}