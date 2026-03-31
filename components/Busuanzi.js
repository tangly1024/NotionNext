import busuanzi from '@/lib/plugins/busuanzi'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useEffect, useRef } from 'react'

export default function Busuanzi () {
  const { theme } = useGlobal()
  const router = useRouter()
  const initializedRef = useRef(false)
  const themeMountedRef = useRef(false)
  const lastPathRef = useRef('')

  useEffect(() => {
    const handleRouteChangeComplete = (url) => {
      if (url === lastPathRef.current) return
      lastPathRef.current = url
      busuanzi.fetch()
    }

    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router])

  useEffect(() => {
    if (!router.isReady || initializedRef.current) {
      return
    }
    initializedRef.current = true
    lastPathRef.current = router.asPath
    busuanzi.fetch()
  }, [router.isReady, router.asPath])

  // 更换主题时更新
  useEffect(() => {
    if (!themeMountedRef.current) {
      themeMountedRef.current = true
      return
    }
    if (theme) {
      busuanzi.fetch()
    }
  }, [theme])
  return null
}
