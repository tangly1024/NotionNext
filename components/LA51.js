import { siteConfig } from '@/lib/config'
import { useEffect } from 'react'

/**
 * 51LA统计
 */
export default function LA51() {
  const ANALYTICS_51LA_ID = siteConfig('ANALYTICS_51LA_ID')
  const ANALYTICS_51LA_CK = siteConfig('ANALYTICS_51LA_CK')
  useEffect(() => {
    const LA = window.LA
    if (LA) {
      LA.init({ id: `${ANALYTICS_51LA_ID}`, ck: `${ANALYTICS_51LA_CK}`, hashMode: true, autoTrack: true })
    }
  }, [])

  return <></>
}
