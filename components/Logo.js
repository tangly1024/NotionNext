import Link from 'next/link'
import BLOG from '@/blog.config'
import React from 'react'

const Logo = () => {
  return <Link href='/'>
      <div className='mx-auto text-center cursor-pointer text-3xl dark:bg-gray-900 dark:text-gray-300 font-semibold dark:hover:bg-gray-600 bg-gray-700 text-white p-2 hover:scale-105 hover:shadow-2xl duration-200 transform'>{BLOG.title}</div>

     {/* <div className='transform hover:scale-110 duration-200 cursor-pointer'><img src='http://to-a.ru/DmOleR/img1' width={100} alt={BLOG.title} /></div> */}

  </Link>
}
export default Logo
