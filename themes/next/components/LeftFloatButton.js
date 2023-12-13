import React, { useEffect, useState } from 'react'
import throttle from 'lodash.throttle'
import DarkModeButton from './DarkModeButton'

/**
 * 左上角悬浮菜单栏
 * @returns {JSX.Element}
 * @constructor
 */
const LeftFloatButton = () => {
  // 监听resize事件
  useEffect(() => {
    window.addEventListener('resize', collapseSideBar)
    collapseSideBar()
    return () => {
      window.removeEventListener('resize', collapseSideBar)
    }
  }, [])

  const collapseSideBar = throttle(() => {
    if (window.innerWidth > 1300) {
      changeCollapse(false)
    } else {
      changeCollapse(true)
    }
  }, 500)
  const [collapse, changeCollapse] = useState(true)
  return <div
    className={(collapse ? 'left-0' : 'left-72') + ' z-30 fixed flex flex-nowrap md:flex-col  top-0 pl-4 py-1 duration-500 ease-in-out'}>
    {/* 菜单折叠 */}
    <div className='p-1 border hover:shadow-xl duration-200 dark:border-gray-500 h-12 bg-white dark:bg-gray-600 dark:bg-opacity-70 bg-opacity-70
      dark:hover:bg-gray-100 text-xl cursor-pointer mr-2 my-2 dark:text-gray-300 dark:hover:text-black'>
      <i className='p-2.5 hover:scale-125 transform duration-200 fas fa-bars' onClick={() => changeCollapse(!collapse)} />
    </div>
    {/* 夜间模式 */}
    <DarkModeButton />
  </div>
}

export default LeftFloatButton
