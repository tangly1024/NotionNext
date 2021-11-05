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
  const [isHidden, changeHiddenStatus] = useState(true)
  // 点击按钮更改侧边抽屉状态
  const switchSideDrawerVisible = () => {
    changeHiddenStatus(!isHidden)
  }
  return <div>
    <div className={(isHidden ? '-ml-72' : 'shadow-2xl') + ' flex flex-col duration-300 fixed h-full left-0 overflow-y-scroll scroll-hidden top-0 z-50'}>
      <SideBar tags={tags} post={post} posts={posts} categories={categories} currentCategory={currentCategory} />
    </div>
    {/* 背景蒙版 */}
    <div id='drawer-background'
         className={(isHidden ? 'hidden' : 'block') + ' fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-30'}
         onClick={switchSideDrawerVisible} />
  </div>
}
export default SideBarDrawer
