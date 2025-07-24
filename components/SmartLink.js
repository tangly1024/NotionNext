import Link from 'next/link'
import { siteConfig } from '@/lib/config'

const SmartLink = ({ href, children, ...rest }) => {
  const LINK = siteConfig('LINK')
  const isExternal = href.startsWith('http') && !href.startsWith(LINK)

  if (isExternal) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        {...rest}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}

export default SmartLink
