import Link from 'next/link'
import BLOG from '@/blog.config'
import React from 'react'

const Logo = () => {
  return <Link href='/'>
      <div title={BLOG.title} className='mx-auto border text-center cursor-pointer text-xl  dark:text-gray-300 font-semibold dark:hover:bg-gray-600 text-white p-2 hover:scale-105 hover:shadow-2xl duration-200 transform'>
        <span className='text-red-600'>Tangly</span>
        <span className='text-blue-400'>1024</span>
      </div>
     {/* <div className='transform hover:scale-110 duration-200 cursor-pointer'><img src='http://to-a.ru/DmOleR/img1' width={100} alt={BLOG.title} /></div> */}

  </Link>
}
export default Logo
