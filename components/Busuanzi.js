import busuanzi from '@/lib/busuanzi'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Busuanzi () {
  const router = useRouter()
  useEffect(() => {
    const busuanziRouteChange = url => {
      busuanzi.fetch()
    }
    router.events.on('routeChangeComplete', busuanziRouteChange)
    return () => {
      router.events.off('routeChangeComplete', busuanziRouteChange)
    }
  }, [router.events])
  return null
}
