import React, { useState, useEffect, useRef } from 'react'
import CONFIG from '../config'

/**
 * 顶栏组件（包含占位，防止内容遮挡；下滑隐藏，上滑显示）
 * @param {object} props
 * @returns {JSX.Element}
 */
const TopBar = ({ height, style, children }) => {
  const barHeight = height || CONFIG.TOPBAR_HEIGHT || 56
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // 上滑显示顶栏
      if (currentScrollY < lastScrollY.current) {
        setIsVisible(true)
      }
      // 下滑隐藏顶栏（只在向下滚动超过顶栏高度后隐藏）
      else if (currentScrollY > barHeight && currentScrollY > lastScrollY.current) {
        setIsVisible(false)
      }
      // 滚动到顶部时显示
      else if (currentScrollY === 0) {
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [barHeight])

  return (
    <>
      {/* 固定顶栏（仅桌面显示） */}
      <div
        className="hidden lg:flex w-full fixed top-0 left-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 items-center transition-all duration-300 shadow-sm"
        style={{
          height: barHeight,
          transform: isVisible ? 'translateY(0)' : `translateY(-${barHeight}px)`,
          ...style
        }}
      >
        <div className="flex-1 flex items-center px-4 h-full">
          {typeof children !== 'undefined' && children !== null
            ? children
            : <span className="font-bold text-lg">Rivulet 顶栏</span>}
        </div>
      </div>

      {/* 占位符，防止内容被顶栏遮挡（仅桌面显示） */}
      <div className="hidden lg:block" style={{ height: barHeight }} />
    </>
  )
}

export default TopBar
