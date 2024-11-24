import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function LogoBar({ className }) {
  return (
    <div
      id='top-wrapper'
      className={`w-full flex items-center ${className || ''}`}>
      <Link
        href='/'
        className='logo flex font-semibold hover:bg-black hover:text-white p-2 rounded-xl duration-200 dark:text-gray-200'>
        {/* <LazyImage
          src={siteInfo?.icon}
          width={24}
          height={20}
          alt={siteConfig('AUTHOR')}
          className='mr-2 hidden md:block rounded-full'
        /> */}
        {siteConfig('TITLE')}
      </Link>
    </div>
  )
}
