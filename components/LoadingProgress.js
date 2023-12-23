import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'

/**
 * 出现页面加载进度条
 */
export default function LoadingProgress() {
  const router = useRouter()
  // 加载进度条
  useEffect(() => {
    const handleStart = (url) => {
      NProgress.start()
    }

    const handleStop = () => {
      NProgress.done()
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
