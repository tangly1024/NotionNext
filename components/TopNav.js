import Link from 'next/link'
import BLOG from '@/blog.config'
import React, { useRef } from 'react'
import DarkModeButton from '@/components/DarkModeButton'
import SearchInput from '@/components/SearchInput'
import Drawer from '@/components/Drawer'
import DrawerRight from '@/components/DrawerRight'

const TopNav = ({ tags, currentTag, post }) => {
  const drawer = useRef()
  const drawerRight = useRef()

  return (<div className='fixed w-full top-0 z-20'>
    {/* 侧面抽屉 */}
    <Drawer post={post} currentTag={currentTag} cRef={drawer} tags={tags} />
    <DrawerRight post={post} cRef={drawerRight}/>

    {/* 导航栏 */}
    <div id='sticky-nav' className='transform duration-500 bg-white dark:bg-gray-800 border-b dark:border-gray-700'>
      <div className='text-sm m-auto w-full flex flex-row justify-between items-center px-4 py-2 shadow-md'>
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
          {post && <div className='block xl:hidden z-10 p-1 duration-200 mr-2 h-12 text-xl cursor-pointer dark:text-gray-300 '>
            <i className='fa p-2.5 hover:scale-125 transform duration-200 fa-bookmark' onClick={() => { drawerRight.current.handleMenuClick() }}/>
          </div>}
        </div>
      </div>
    </div>

  </div>)
}

export default TopNav
