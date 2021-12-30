import throttle from 'lodash.throttle'
import { useCallback, useEffect } from 'react'

let windowTop = 0

/**
 * 标签组导航条，默认隐藏仅在移动端显示
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const StickyBar = ({ children }) => {
  if (!children) return <></>
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    if (scrollS >= windowTop && scrollS > 10) {
      const stickyBar = document.querySelector('#sticky-bar')
      stickyBar && stickyBar.classList.replace('top-14', 'top-0')
      windowTop = scrollS
    } else {
      const stickyBar = document.querySelector('#sticky-bar')
      stickyBar && stickyBar.classList.replace('top-0', 'top-14')
      windowTop = scrollS
    }
  }, 200))

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    scrollTrigger()
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  return (
    <div id='sticky-bar' className='sticky flex-grow justify-center top-14 md:top-0 duration-500 z-10 pb-16'>
      <div className='glassmorphism dark:border-gray-600 px-5 absolute rounded-none md:rounded-xl shadow-xl border w-full hidden-scroll'>
          <div id='tag-container' className="md:pl-3 overflow-x-auto">
              { children }
          </div>
      </div>
    </div>
  )
}

export default StickyBar
