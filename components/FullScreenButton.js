import { isBrowser } from '@/lib/utils'
import React, { useState } from 'react'

/**
 * 全屏按钮
 * @returns
 */
const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleFullScreenClick = () => {
    if (!isBrowser) {
      return
    }
    const element = document.documentElement
    if (!isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
      setIsFullScreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullScreen(false)
    }
  }

  return (
      <button onClick={handleFullScreenClick} className='dark:text-gray-300'>
        {isFullScreen ? '退出全屏' : <i className="fa-solid fa-expand"></i>}
      </button>
  )
}

export default FullScreenButton
