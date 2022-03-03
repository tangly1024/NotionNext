import BLOG from '@/blog.config'
import Link from 'next/link'

export default function LogoBar () {
  return <div id='top-wrapper' className='w-full flex justify-center font-sans'>
    <div className='flex mx-auto w-full  justify-between '>
      <div className='space-x-3 flex items-center'>
        <Link href='/'>
          <a className='text-2xl dark:text-gray-200'>{BLOG.TITLE}</a>
        </Link>
      </div>
    </div>
  </div>
}
