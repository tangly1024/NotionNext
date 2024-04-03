import throttle from 'lodash.throttle'
import { useCallback, useEffect, useState } from 'react'
import FloatDarkModeButton from './FloatDarkModeButton'
import JumpToTopButton from './JumpToTopButton'
import MusicPlayer from './MusicPlayer'

/**
 * 悬浮在右下角的按钮，当页面向下滚动100px时会出现
 * @param {*} param0
 * @returns
 */
export default function RightFloatArea({ floatSlot }) {
  const [showFloatButton, switchShow] = useState(false)
  const scrollListener = useCallback(throttle(() => {
    const targetRef = document.getElementById('wrapper')
    const clientHeight = targetRef?.clientHeight
    const scrollY = window.pageYOffset
    const fullHeight = document.body.scrollHeight - window.innerHeight
    let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))
    if (per > 100) per = 100
    const shouldShow = scrollY > 50

    // 直接使用状态更新函数，避免依赖外部状态变量
    switchShow(show => shouldShow !== show ? shouldShow : show)
  }, 200))

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [])

  return (
        <div className={(showFloatButton ? 'opacity-100 ' : 'invisible opacity-0') + ' duration-300 transition-all bottom-[2rem] left-3 fixed justify-end z-20  text-white bg-tab dark:bg-hexo-black-gray rounded-sm'}>
                <div id="tool" className={'justify-center  flex flex-col items-center cursor-pointer audio affix'}>
                    {/* <FloatDarkModeButton /> */}
                    <MusicPlayer />
                    {floatSlot}
                    <JumpToTopButton />
                </div>
            </div>
  )
}
