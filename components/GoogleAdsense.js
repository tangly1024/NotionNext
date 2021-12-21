import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function GoogleAdsense () {
  const initGoogleAdsense = () => {
    const ads = document.getElementsByClassName('adsbygoogle').length
    const newAdsCount = ads
    if (newAdsCount > 0) {
      for (let i = 0; i <= newAdsCount; i++) {
        try {
          // eslint-disable-next-line no-undef
          (adsbygoogle = window.adsbygoogle || []).push({})
        } catch (e) {

        }
      }
    }
  }

  const router = useRouter()
  useEffect(() => {
    initGoogleAdsense()
    router.events.on('routeChangeComplete', initGoogleAdsense)
    return () => {
      router.events.off('routeChangeComplete', initGoogleAdsense)
    }
  }, [router.events])
  return null
}
