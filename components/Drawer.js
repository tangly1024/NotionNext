import Link from 'next/link'
import BLOG from '@/blog.config'
import SearchInput from '@/components/SearchInput'
import MenuButtonGroup from '@/components/MenuButtonGroup'
import TocBar from '@/components/TocBar'
import React, { useState } from 'react'

/**
 * 抽屉面板，可以从侧面拉出
 * @returns {JSX.Element}
 * @constructor
 */
const Drawer = ({ post, currentTag }) => {
  const [showDrawer, switchShowDrawer] = useState(false)
  // 点击按钮更改侧边抽屉状态
  const handleMenuClick = () => {
    switchShowDrawer(!showDrawer)
  }
  return <div>
    {/* 触发抽屉按钮 */}
    <div onClick={handleMenuClick}
      className='fixed top-1 left-0 z-30 py-1 px-5 duration-200 bg-white dark:bg-gray-600 text-gray-600 text-2xl cursor-pointer dark:text-gray-300'>
      <i className='fa hover:scale-125 transform duration-200 fa-bars '
          />
    </div>
    <div className='fixed top-0 left-0 z-30 h-full'>
      <div className={(showDrawer ? 'shadow-2xl' : '-ml-72') + ' overflow-y-auto duration-200 w-72 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-600'}>
        {/* LOGO */}
        <div className='sticky top-0 z-20 bg-white w-72  flex space-x-4 px-5 py-1 dark:border-gray-500 border-b dark:bg-gray-600 '>
          <div className='z-10 p-1 duration-200 mr-2 bg-white dark:bg-gray-600 text-gray-600 text-xl cursor-pointer dark:text-gray-300'>
            <i className='fa hover:scale-125 transform duration-200 fa-bars ' onClick={handleMenuClick}/>
          </div>
          <Link href='/'>
            <a
              className='flex text-lg justify-center font-bold font-semibold hover:bg-gray-800 hover:text-white px-2 py-1 duration-200
               dark:text-gray-300
              '>{BLOG.title}</a>
          </Link>
        </div>
      </div>
      {/* 侧边菜单 */}
      <div className={(showDrawer ? 'shadow-2xl' : '-ml-72') + ' w-72 duration-200 h-full fixed left-0 top-12 overflow-y-auto'}>
        <div className='z-20'>
          <div className='px-5 my-3 block md:hidden'>
            <SearchInput currentTag={currentTag}/>
          </div>
          {/* 菜单 */}
          <MenuButtonGroup allowCollapse={false}/>
          {post && (
            <div className='sticky top-24'>
              <TocBar toc={post.toc} />
            </div>
          )}
        </div>
      </div>
    </div>
    {/* 背景蒙版 */}
    <div className={(showDrawer ? 'block' : 'hidden') + ' fixed top-0 left-0 z-20 w-full h-full bg-black bg-opacity-40' } onClick={handleMenuClick}/>
  </div>
}
export default Drawer
