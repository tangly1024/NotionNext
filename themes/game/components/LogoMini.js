import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'

/* eslint-disable @next/next/no-html-link-for-pages */
export default function LogoMini() {
  return (
    <SmartLink href='/' className='logo rounded cursor-pointer flex items-center text-xl text-white font-bold font-serif'>
      {siteConfig('TITLE')?.charAt(0)}
    </SmartLink>
  )
}
