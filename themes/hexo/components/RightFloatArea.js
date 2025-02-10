import throttle from 'lodash.throttle'
import { useCallback, useEffect, useState } from 'react'
import ButtonDarkModeFloat from './ButtonFloatDarkMode'
import ButtonJumpToTop from './ButtonJumpToTop'

/**
 * 悬浮在右下角的按钮，当页面向下滚动100px时会出现
 * @param {*} param0
 * @returns
 */
export default function RightFloatArea({ floatSlot }) {
  const [showFloatButton, switchShow] = useState(false)
  const scrollListener = useCallback(
    throttle(() => {
      const targetRef = document.getElementById('wrapper')
      const clientHeight = targetRef?.clientHeight
      const scrollY = window.pageYOffset
      const fullHeight = clientHeight - window.outerHeight
      let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))
      if (per > 100) per = 100
      const shouldShow = scrollY > 100 && per > 0

      // 右下角显示悬浮按钮
      if (shouldShow !== showFloatButton) {
        switchShow(shouldShow)
      }
    }, 200)
  )

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [])

  return (
    <div
      className={
        (showFloatButton ? 'opacity-100 ' : 'invisible opacity-0') +
        '  duration-300 transition-all bottom-12 right-1 fixed justify-end z-20  text-white bg-indigo-500 dark:bg-hexo-black-gray rounded-sm'
      }>
      <div
        className={'justify-center  flex flex-col items-center cursor-pointer'}>
        <ButtonDarkModeFloat />
        {floatSlot}
        <ButtonJumpToTop />
      </div>
    </div>
  )
}
