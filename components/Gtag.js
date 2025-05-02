import { siteConfig } from '@/lib/config'
import * as gtag from '@/lib/plugins/gtag'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
/**
 * Google Analytics
 * @returns
 */
const Gtag = () => {
  const router = useRouter()
  const ANALYTICS_GOOGLE_ID = siteConfig('ANALYTICS_GOOGLE_ID')
  useEffect(() => {
    const gtagRouteChange = url => {
      gtag.pageview(url, ANALYTICS_GOOGLE_ID)
    }
    router.events.on('routeChangeComplete', gtagRouteChange)
    return () => {
      router.events.off('routeChangeComplete', gtagRouteChange)
    }
  }, [router.events])
  return null
}
export default Gtag
