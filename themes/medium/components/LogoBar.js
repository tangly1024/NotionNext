import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function LogoBar(props) {
  const avatar = siteConfig('AVATAR') // 取出头像URL
  const title = siteConfig('TITLE')   // 取出标题

  return (
<div id='top-wrapper' className='w-full flex items-center space-x-4'>
  <Link href='/' className='logo flex items-center space-x-3'>
    {avatar && (
      <img
        src={avatar}
        alt='logo'
        className='w-10 h-10'
      />
    )}
    <div className="flex flex-col">
      <span className="text-xl md:text-3xl text-gray-800 dark:text-gray-200">{title}</span>
      <span className="text-[11px] text-gray-300 dark:text-gray-400">Louis, slice of life</span>
    </div>
  </Link>
</div>
  )
}
