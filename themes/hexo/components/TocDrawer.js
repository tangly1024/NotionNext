import Catalog from './Catalog'
import { useImperativeHandle, useState } from 'react'

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
  return <>
    <div className='fixed top-0 right-0 z-40 '>
      {/* 悬浮目录 */}
      <div
        className={(showDrawer ? 'animate__slideInRight ' : ' -mr-72 animate__slideOutRight') +
        ' shadow-card animate__animated animate__faster' +
        ' w-60 duration-200 fixed right-12 bottom-12 rounded py-2 bg-white dark:bg-gray-900'}>
          {post && <>
           <div className='dark:text-gray-400 text-gray-600'>
             <Catalog toc={post.toc}/>
           </div>
          </>
          }
      </div>
    </div>
    {/* 背景蒙版 */}
    <div id='right-drawer-background' className={(showDrawer ? 'block' : 'hidden') + ' fixed top-0 left-0 z-30 w-full h-full'}
         onClick={switchVisible} />
  </>
}
export default TocDrawer
