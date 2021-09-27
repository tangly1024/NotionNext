import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as gtag from '@/lib/gtag'

const Gtag = () => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = url => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return null
}
export default Gtag
