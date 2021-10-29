import TocBar from '@/components/TocBar'
import React, { useImperativeHandle, useState } from 'react'

/**
 * 右侧边栏
 * @param toc
 * @param post
 * @returns {JSX.Element}
 * @constructor
 */
const DrawerRight = ({ post, cRef }) => {
// 暴露给父组件 通过cRef.current.handleMenuClick 调用
  useImperativeHandle(cRef, () => {
    return {
      handleMenuClick: () => handleMenuClick()
    }
  })
  const [showDrawer, switchShowDrawer] = useState(false)
  const handleMenuClick = () => {
    switchShowDrawer(!showDrawer)
  }

  return <div>
    <div className='fixed top-0 right-0 z-40 h-full'>
      <div
        className={(showDrawer ? 'shadow-2xl' : '-mr-72') + ' overflow-y-auto duration-200 w-72 h-full bg-white dark:bg-gray-700 border-r dark:border-gray-600'}>
        {/* LOGO */}
        <div className='sticky top-0 z-20 bg-white w-72 flex space-x-4 px-5 py-3.5 dark:border-gray-500 border-b dark:bg-gray-900 '>
          <div className='text-lg font-bold font-semibold px-2 py-1 duration-200 dark:text-gray-300'>文章目录
          </div>
          <div
            className='z-10 p-1 duration-200 mr-2 absolute right-6 text-gray-600 text-xl cursor-pointer dark:text-gray-300'>
            <i className='fa hover:scale-125 transform duration-200 fa-bookmark ' onClick={handleMenuClick} />
          </div>
        </div>
      </div>

      {/* 侧边菜单 */}
      <div
        className={(showDrawer ? 'shadow-2xl ' : ' -mr-72 ') + ' w-72 duration-200 h-full fixed right-0 top-16 overflow-y-auto'}>
        <div className='z-20'>
          {post && <TocBar toc={post.toc}/>}
        </div>
      </div>
    </div>
    {/* 背景蒙版 */}
    <div id='right-drawer-background' className={(showDrawer ? 'block' : 'hidden') + ' fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-50'}
         onClick={handleMenuClick} />
  </div>
}
export default DrawerRight
