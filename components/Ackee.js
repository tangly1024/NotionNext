'use strict'

import { useEffect } from 'react'
import BLOG from '@/blog.config'
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'

const Ackee = () => {
  const router = useRouter()
  useEffect(() => {
    handleAckee(
      router.asPath,
      {
        server: BLOG.ANALYTICS_ACKEE_DATA_SERVER,
        domainId: BLOG.ANALYTICS_ACKEE_DOMAIN_ID
      },
      {
        detailed: false,
        ignoreLocalhost: false
      }
    )
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

  const instance = ackeeTracker.create(environment.server, options)

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

  const attributes = ackeeTracker.attributes(options.detailed)
  const url = new URL(pathname, location)

  return instance.record(environment.domainId, {
    ...attributes,
    siteLocation: url.href
  }).stop
}
