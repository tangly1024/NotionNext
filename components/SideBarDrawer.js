import SideBar from '@/components/SideBar'
import React, { useEffect, useImperativeHandle, useState } from 'react'

/**
 * 侧边栏抽屉面板，可以从侧面拉出
 * @returns {JSX.Element}
 * @constructor
 */
const SideBarDrawer = ({ post, currentTag, cRef, tags, posts, categories, currentCategory }) => {
  // 暴露给父组件 通过cRef.current.handleMenuClick 调用
  useImperativeHandle(cRef, () => {
    return {
      handleSwitchSideDrawerVisible: () => switchSideDrawerVisible()
    }
  })

  useEffect(() => {
    const sideBarWrapperElement = document.getElementById('sidebar-wrapper')
    sideBarWrapperElement?.classList?.remove('hidden')
  })

  // 点击按钮更改侧边抽屉状态
  const [isShow, changeHiddenStatus] = useState(false)
  const switchSideDrawerVisible = () => {
    const showStatus = !isShow
    changeHiddenStatus(showStatus)
    if (window) {
      const sideBarDrawer = window.document.getElementById('sidebar-drawer')
      const sideBarDrawerBackground = window.document.getElementById('sidebar-drawer-background')

      if (showStatus) {
        sideBarDrawer.classList.replace('-ml-80', 'ml-0')
        sideBarDrawerBackground.classList.replace('hidden', 'block')
      } else {
        sideBarDrawer.classList.replace('ml-0', '-ml-80')
        sideBarDrawerBackground.classList.replace('block', 'hidden')
      }
    }
  }

  return <div id='sidebar-wrapper' className='hidden'>
    <div id='sidebar-drawer' className='-ml-80 bg-white dark:bg-gray-900 flex flex-col duration-300 fixed h-full left-0 overflow-y-scroll scroll-hidden top-0 z-50'>
      <SideBar tags={tags} post={post} posts={posts} categories={categories} currentCategory={currentCategory} />
    </div>
    {/* 背景蒙版 */}
    <div id='sidebar-drawer-background' onClick={switchSideDrawerVisible} className='hidden fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-30'/>

  </div>
}
export default SideBarDrawer
