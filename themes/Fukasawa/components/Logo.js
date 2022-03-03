import BLOG from '@/blog.config'
import Link from 'next/link'

function Logo () {
  return <section className='flex'>
   <Link href='/'>
    <a className='hover:bg-black hover:text-white border-black border-2 duration-500 px-4 py-2 cursor-pointer dark:text-gray-300 dark:border-gray-300 font-black'>{BLOG.TITLE}</a>
   </Link>
  </section>
}

export default Logo
