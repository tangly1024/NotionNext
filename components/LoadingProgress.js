import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * 出现页面加载进度条
 */
export default function LoadingProgress() {
  const router = useRouter()
  const [NProgress, setNProgress] = useState(null)
  // 加载进度条
  useEffect(() => {
    loadExternalResource(
      'https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.js',
      'js'
    ).then(() => {
      if (window.NProgress) {
        setNProgress(window.NProgress)
        // 调速
        window.NProgress.settings.minimun = 0.1
        loadExternalResource(
          'https://cdn.bootcdn.net/ajax/libs/nprogress/0.2.0/nprogress.min.css',
          'css'
        )
      }
    })

    const handleStart = url => {
      NProgress?.start()
    }

    const handleStop = () => {
      NProgress?.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeError', handleStop)
    router.events.on('routeChangeComplete', handleStop)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])
}
