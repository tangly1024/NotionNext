import { useEffect } from 'react'
import { initWebVitals } from '@/lib/performance/webVitals'

/**
 * Web Vitals监控组件
 * 自动初始化Core Web Vitals监控
 */
export default function WebVitalsMonitor({
  enableReporting = true,
  sampleRate = 0.1,
  enableConsoleLog = process.env.NODE_ENV === 'development'
}) {
  useEffect(() => {
    // 只在客户端运行
    if (typeof window === 'undefined') return

    // 初始化Web Vitals监控
    const collector = initWebVitals({
      reportEndpoint: '/api/analytics/web-vitals',
      sampleRate,
      enableConsoleLog,
      enableBeacon: true
    })

    // 清理函数
    return () => {
      if (collector) {
        collector.destroy()
      }
    }
  }, [sampleRate, enableConsoleLog])

  // 不渲染任何UI
  return null
}