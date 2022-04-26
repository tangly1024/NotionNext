import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'

const Logo = props => {
  const { siteInfo } = props
  return <Link href='/' passHref>
    <div className='flex flex-col justify-center items-center cursor-pointer space-y-3'>
      <div className='font-sans text-lg p-1.5 rounded bg-black text-white dark:border-white border-black border'> {siteInfo?.title || BLOG.TITLE}</div>
    </div>
  </Link>
}
export default Logo
