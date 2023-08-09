'use strict'

import { useEffect } from 'react'
import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
const Ackee = () => {
  const router = useRouter()

  // handleAckee 函数
  const handleAckeeCallback = () => {
    handleAckee(
      router.asPath,
      {
        server: BLOG.ANALYTICS_ACKEE_DATA_SERVER,
        domainId: BLOG.ANALYTICS_ACKEE_DOMAIN_ID
      },
      {
        /*
         * Enable or disable tracking of personal data.
         * We recommend to ask the user for permission before turning this option on.
         */
        detailed: true,
        /*
        * Enable or disable tracking when on localhost.
        */
        ignoreLocalhost: false,
        /*
        * Enable or disable the tracking of your own visits.
        * This is enabled by default, but should be turned off when using a wildcard Access-Control-Allow-Origin header.
        * Some browsers strictly block third-party cookies. The option won't have an impact when this is the case.
        */
        ignoreOwnVisits: false
      }
    )
  }

  // 或者使用其他依赖数组，根据需要执行 handleAckee
  useEffect(() => {
    handleAckeeCallback()
  }, [router])

  return null
}

export default Ackee

/**
 * Function to use Ackee.
 * Creates an instance once and a new record every time the pathname changes.
 * Safely no-ops during server-side rendering.
 * @param {?String} pathname - Current path.
 * @param {Object} environment - Object containing the URL of the Ackee server and the domain id.
 * @param {?Object} options - Ackee options.
 */
const handleAckee = async function(pathname, environment, options = {}) {
  await loadExternalResource(BLOG.ANALYTICS_ACKEE_TRACKER, 'js')
  const ackeeTracker = window.ackeeTracker

  const instance = ackeeTracker?.create(environment.server, options)

  if (instance == null) {
    console.warn('Skipped record creation because useAckee has been called in a non-browser environment')
    return
  }

  const hasPathname = (
    pathname != null && pathname !== ''
  )

  if (hasPathname === false) {
    console.warn('Skipped record creation because useAckee has been called without pathname')
    return
  }

  const attributes = ackeeTracker?.attributes(options.detailed)
  const url = new URL(pathname, location)

  return instance.record(environment.domainId, {
    ...attributes,
    siteLocation: url.href
  }).stop
}
