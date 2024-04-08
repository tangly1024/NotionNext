import { siteConfig } from '@/lib/config'
import Link from 'next/link'

/* eslint-disable @next/next/no-html-link-for-pages */
export default function LogoMini() {
  return (
    <Link href='/' className='logo rounded cursor-pointer flex items-center text-xl text-white font-bold font-serif'>
      {siteConfig('TITLE')?.charAt(0)}
    </Link>
  )
}
