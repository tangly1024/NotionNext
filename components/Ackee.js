import { useRouter } from 'next/router'
import useAckee from 'use-ackee'
import BLOG from '@/blog.config'

const Ackee = () => {
  const router = useRouter()
  useAckee(
    router.asPath,
    {
      server: BLOG.ANALYTICS_ACKEE_DATA_SERVER,
      domainId: BLOG.ANALYTICS_ACKEE_DOMAIN_ID
    },
    {
      detailed: false,
      ignoreLocalhost: true
    }
  )
  return null
}

export default Ackee
