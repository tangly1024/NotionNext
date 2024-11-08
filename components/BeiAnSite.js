import { siteConfig } from '@/lib/config'

/**
 * 站点域名备案
 * @returns
 */
export default function BeiAnSite() {
  const beian = siteConfig('BEI_AN')
  if (!beian) {
    return null
  }
  return (
    <span>
      <i className='fas fa-shield-alt' />
      <a href='https://beian.miit.gov.cn/' className='mx-1'>
        {siteConfig('BEI_AN')}
      </a>
      <br />
    </span>
  )
}
