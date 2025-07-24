import Link from 'next/link'
import { siteConfig } from '@/lib/config'

// 保留允许传给 <a> 的属性
const filterDOMProps = (props) => {
  const {
    passHref,
    legacyBehavior,
    ...rest
  } = props;
  return rest;
};
const SmartLink = ({ href, children, ...rest }) => {
  const LINK = siteConfig('LINK')
  const isExternal = href.startsWith('http') && !href.startsWith(LINK)

  if (isExternal) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        {...filterDOMProps(rest)}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} {...rest} >
      {children}
    </Link>
  )
}

export default SmartLink
