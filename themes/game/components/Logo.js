import { siteConfig } from '@/lib/config'
import Link from 'next/link'

/* eslint-disable @next/next/no-html-link-for-pages */
export default function Logo({ siteInfo }) {
  return (
    <Link
      passHref
      href='/'
      className='logo rounded cursor-pointer flex flex-col items-center'>
      <div className='w-full'>
        <h1 className='text-2xl dark:text-white font-bold font-serif'>
          {siteInfo?.title}
        </h1>
        <h2 className='text-xs text-gray-400 whitespace-nowrap'>
          {siteConfig('BIO')}
        </h2>
      </div>
    </Link>
  )
}
