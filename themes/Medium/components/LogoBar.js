import BLOG from '@/blog.config'
import Link from 'next/link'

export default function LogoBar () {
  return <div id='top-wrapper' className='w-full max-w-5xl justify-center mx-auto font-sans'>
      <div className='w-full'>
        <Link href='/'>
          <a className='text-2xl'>{BLOG.TITLE}</a>
        </Link>
      </div>
  </div>
}
