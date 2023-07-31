// import { useRouter } from 'next/router'
import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

const Ackee = () => {
  useEffect(() => {
    loadExternalResource(BLOG.ANALYTICS_ACKEE_TRACKER, 'js').then(url => {
      const ackeeTracker = window.ackeeTracker
      console.log('ackeeTracker', ackeeTracker)
    })
  })

  //   const router = useRouter()
  //   useAckee(
  //     router.asPath,
  //     {
  //       server: BLOG.ANALYTICS_ACKEE_DATA_SERVER,
  //       domainId: BLOG.ANALYTICS_ACKEE_DOMAIN_ID
  //     },
  //     {
  //       detailed: false,
  //       ignoreLocalhost: true
  //     }
  //   )
  return null
}

export default Ackee
