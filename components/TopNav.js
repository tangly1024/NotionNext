import Link from 'next/link'
import BLOG from '@/blog.config'
import React from 'react'
import DarkModeButton from '@/components/DarkModeButton'
import Image from 'next/image'
import SearchInput from '@/components/SearchInput'
import Drawer from '@/components/Drawer'

const TopNav = ({ tags, currentTag, post }) => {
  return (
    <div className='bg-white dark:bg-gray-800 border-b dark:border-gray-700'>

      {/* 侧面抽屉 */}
      <Drawer post={post} currentTag={currentTag} />

      {/* 导航栏 */}
      <div
        id='sticky-nav'
        className='text-sm m-auto w-full flex flex-row justify-between items-center p-2 md:px-4'
      >
        <div className='flex ml-12'>
          <Link href='/'>
            <a
              className='flex text-xl py-1 px-3 justify-center align-middle my-auto font-bold font-semibold hover:bg-gray-800 hover:text-white duration-200
               dark:text-gray-300
              '>{BLOG.title}</a>
          </Link>
        </div>

        <div className='hidden sm:block w-96'>
          {/* 搜索框 */}
          <SearchInput currentTag={currentTag} />
        </div>

        <div className='flex flex-nowrap space-x-1'>
          <DarkModeButton />
          <div className='flex align-middle cursor-pointer'>
            <Link href='/article/about'>
              <Image
                alt={BLOG.author}
                width={28}
                height={28}
                src='/avatar.svg'
                className='rounded-full border-black'
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav
