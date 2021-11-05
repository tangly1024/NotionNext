import Toc from '@/components/Toc'
import React, { useImperativeHandle, useState } from 'react'

/**
 * 目录抽屉栏
 * @param toc
 * @param post
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawer = ({ post, cRef }) => {
// 暴露给父组件 通过cRef.current.handleMenuClick 调用
  useImperativeHandle(cRef, () => {
    return {
      handleSwitchVisible: () => switchVisible()
    }
  })
  const [showDrawer, switchShowDrawer] = useState(false)
  const switchVisible = () => {
    switchShowDrawer(!showDrawer)
  }

  return <div>
    <div className='fixed top-0 right-0 z-40 '>
      {/* 侧边菜单 */}
      <div
        className={(showDrawer ? 'shadow-2xl ' : ' -mr-72 ') + ' w-72 duration-200 h-full bg-white fixed right-0 top-0 overflow-y-auto'}>
        <div className='z-20'>
          {post && <Toc toc={post.toc}/>}
        </div>
      </div>
    </div>
    {/* 背景蒙版 */}
    <div id='right-drawer-background' className={(showDrawer ? 'block' : 'hidden') + ' fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-50'}
         onClick={switchVisible} />
  </div>
}
export default TocDrawer
