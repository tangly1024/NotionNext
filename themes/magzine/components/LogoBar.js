import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function LogoBar(props) {
  return (
    <div id='top-wrapper' className='w-full flex items-center '>
      <Link
        href='/'
        className='flex text-md font-semibold md:text-xl hover:bg-black hover:text-white p-2 rounded-xl duration-200 dark:text-gray-200'>
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
