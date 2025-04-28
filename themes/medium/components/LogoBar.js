import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function LogoBar(props) {
  const avatar = siteConfig('AVATAR') // 取出头像URL
  const title = siteConfig('TITLE')   // 取出标题

  return (
    <div id='top-wrapper' className='w-full flex items-center space-x-4'>
      <Link href='/' className='logo flex items-center text-md md:text-xl dark:text-gray-200'>
        {/* 如果有头像，则显示 */}
        {avatar && (
          <img
            src={avatar}
            alt='logo'
            className='w-10 h-10 rounded-full mr-2'
          />
        )}
        <span>{title}</span>
      </Link>
    </div>
  )
}
