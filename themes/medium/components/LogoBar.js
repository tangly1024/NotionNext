import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function LogoBar(props) {
  return (
    <div id='top-wrapper' className='w-full flex items-center '>
      <Link href='/' className='logo text-md md:text-xl dark:text-gray-200'>
        {siteConfig('TITLE')}
      </Link>
    </div>
  )
}
