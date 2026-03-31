import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 加载进度条
 * NProgress实现
 */
export default function LoadingProgress() {
  const router = useRouter()
  // 加载进度条
  useEffect(() => {
    loadExternalResource(
      'https://cdnjs.snrat.com/ajax/libs/nprogress/0.2.0/nprogress.min.js',
      'js'
    ).then(() => {
      if (window.NProgress) {
        // 调速
        window.NProgress.settings.minimum = 0.1
        loadExternalResource(
          'https://cdnjs.snrat.com/ajax/libs/nprogress/0.2.0/nprogress.min.css',
          'css'
        )
      }
    })

    const handleStart = url => {
      window.NProgress?.start()
    }

    const handleStop = () => {
      window.NProgress?.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleStop)
    router.events.on('routeChangeComplete', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router.events])
}
