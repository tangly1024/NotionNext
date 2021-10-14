import Link from 'next/link'
import BLOG from '@/blog.config'
import React, { useRef } from 'react'
import DarkModeButton from '@/components/DarkModeButton'
import Image from 'next/image'
import SearchInput from '@/components/SearchInput'
import Drawer from '@/components/Drawer'

const TopNav = ({ tags, currentTag, post }) => {
  const drawer = useRef()

  return (<div className='fixed w-full top-0 z-20'>
    {/* 侧面抽屉 */}
    <Drawer post={post} currentTag={currentTag} cRef={drawer} />

    <div id='sticky-nav'
         className='transform 2xl:mt-0 duration-500 bg-white dark:bg-gray-800 border-b dark:border-gray-700'>
      {/* 导航栏 */}
      <div
        className=' text-sm m-auto w-full flex flex-row justify-between items-center px-4 py-2 shadow-md '
      >
        {/* 左侧LOGO */}
        <div className='flex ml-12'>
          <div onClick={() => { drawer.current.handleMenuClick() }}
               className='fixed top-3 left-0 z-30 py-1 px-5 text-gray-600 text-2xl cursor-pointer dark:text-gray-300'>
            <i className='fa hover:scale-125 transform duration-200 fa-bars '
            />
          </div>
          <Link href='/'>
            <a
              className='flex text-xl py-1 px-3 justify-center align-middle my-auto font-bold font-semibold hover:bg-gray-800 hover:text-white duration-200
               dark:text-gray-300
              '>{BLOG.title}</a>
          </Link>
        </div>

        {/* 中间搜索框 */}
        <div className='hidden sm:block w-96'>
          <SearchInput currentTag={currentTag} />
        </div>

        {/* 右侧功能 */}
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

  </div>)
}

export default TopNav
