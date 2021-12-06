import React, { useImperativeHandle, useState } from 'react'
import SideBar from '@/components/SideBar'

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
  const [isShow, changeHiddenStatus] = useState(false)
  // 点击按钮更改侧边抽屉状态
  const switchSideDrawerVisible = () => {
    changeHiddenStatus(!isShow)
    if (window) {
      const sideBarDrawer = window.document.getElementById('sidebar-drawer')
      const sideBarDrawerBackground = window.document.getElementById('sidebar-drawer-background')

      if (isShow) {
        sideBarDrawer.classList.replace('-ml-72', 'ml-0')
        sideBarDrawerBackground.classList.replace('hidden', 'block')
      } else {
        sideBarDrawer.classList.replace('ml-0', '-ml-72')
        sideBarDrawerBackground.classList.replace('block', 'hidden')
      }
    }
  }
  return <>
    <div id='sidebar-drawer' className='-ml-72 flex flex-col duration-300 fixed h-full left-0 overflow-y-scroll scroll-hidden top-0 z-50'>
      <SideBar tags={tags} post={post} posts={posts} categories={categories} currentCategory={currentCategory} />
    </div>
    {/* 背景蒙版 */}
    <div id='sidebar-drawer-background'
          className='hidden fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-30'
         onClick={switchSideDrawerVisible} />

  </>
}
export default SideBarDrawer
