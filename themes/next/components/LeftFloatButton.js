import { useEffect, useState } from 'react'
import throttle from 'lodash.throttle'
import DarkModeButton from './DarkModeButton'

/**
 * 左上角悬浮菜单栏 - 宽屏优化版
 */
const LeftFloatButton = () => {
  const [collapse, setCollapse] = useState(true)

  // 实时监听窗口大小，动态决定是否自动展开侧边栏
  const updateLayout = throttle(() => {
    if (window.innerWidth > 1600) {
      setCollapse(false)  // 大屏自动展开
    } else {
      setCollapse(true)   // 小屏自动收起
    }
  }, 300)

  useEffect(() => {
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  
  // 动态计算内容左边距（关键！）
  const getLeftOffset = () => {
    if (!collapse) {
      if (window.innerWidth > 1800) return 'left-96'   // 超大屏 384px
      if (window.innerWidth > 1600) return 'left-80'   // 320px
      if (window.innerWidth > 1400) return 'left-72'   // 288px
    }
    return 'left-0'
  }

  return (
    <div
      className={`${getLeftOffset()} z-30 fixed flex flex-nowrap md:flex-col top-0 pl-4 py-1 duration-500 ease-in-out transition-all`}
    >
      {/* 折叠按钮 */}
      <div
        className='p-1 border hover:shadow-xl duration-200 dark:border-gray-500 h-12 bg-white dark:bg-hexo-black-gray bg-opacity-80 backdrop-blur-sm
          dark:hover:bg-gray-100 text-xl cursor-pointer mr-2 my-2 dark:text-gray-300 dark:hover:text-black rounded-lg'
        onClick={() => setCollapse(!collapse)}
      >
        <i className='fas fa-bars p-3 hover:scale-110 transform duration-200' />
      </div>

      {/* 夜间模式按钮 */}
      <DarkModeButton />
    </div>
  )
}

export default LeftFloatButton