import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as gtag from '@/lib/plugins/gtag'

const Gtag = () => {
  const router = useRouter()
  useEffect(() => {
    const gtagRouteChange = url => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', gtagRouteChange)
    return () => {
      router.events.off('routeChangeComplete', gtagRouteChange)
    }
  }, [router.events])
  return null
}
export default Gtag
