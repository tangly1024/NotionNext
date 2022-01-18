import { useRouter } from 'next/router'
import useAckee from 'use-ackee'
import BLOG from '@/blog.config'

const Ackee = () => {
  const ackeeServerUrl = BLOG.ANALYTICS_ACKEE_DATA_SERVER
  const ackeeDomainId = BLOG.ANALYTICS_ACKEE_DOMAIN_ID
  const router = useRouter()
  useAckee(
    router.asPath,
    {
      server: ackeeServerUrl,
      domainId: ackeeDomainId
    },
    {
      detailed: false,
      ignoreLocalhost: true
    }
  )
  return null
}

export default Ackee
