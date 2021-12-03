import Link from 'next/link'
import BLOG from '@/blog.config'
import React from 'react'

const Logo = () => {
  return <Link href='/' passHref>
      <div title={BLOG.title} className='mx-auto border dark:border-gray-600 text-center cursor-pointer text-xl  dark:text-gray-300 font-semibold dark:hover:bg-gray-600 text-white p-2 hover:scale-105 hover:shadow-2xl duration-200 transform'>
        <span className='text-red-600'>Tangly</span>
        <span className='text-blue-400'>1024</span>
      </div>
  </Link>
}
export default Logo
