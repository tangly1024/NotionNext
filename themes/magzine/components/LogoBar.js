import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function LogoBar(props) {
  const { siteInfo } = props
  return (
    <div id='top-wrapper' className='w-full flex items-center '>
      <Link href='/' className='flex text-md md:text-xl dark:text-gray-200'>
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
