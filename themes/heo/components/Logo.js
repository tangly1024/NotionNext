import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'

const Logo = props => {
  const { siteInfo } = props
  return (
    <Link href='/' passHref legacyBehavior>
      <div className='flex justify-center items-center cursor-pointer font-extrabold'>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteInfo?.icon} width={24} height={24} alt={BLOG.AUTHOR} className='mr-2 hidden md:block' />
        <div className='text-lg my-auto rounded dark:border-white transform duration-200'> {siteInfo?.title || BLOG.TITLE}</div>
      </div>
    </Link>
  )
}
export default Logo
