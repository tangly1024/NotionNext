import throttle from 'lodash.throttle'
import { useCallback, useEffect } from 'react'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

let windowTop = 0

/**
 * 标签组导航条，默认隐藏仅在移动端显示
 * @param tags
 * @returns {JSX.Element}
 * @constructor
 */
const StickyBar = ({ children }) => {
  // 滚动页面时导航条样式调整
  const scrollTrigger = useCallback(throttle(() => {
    if (siteConfig('NEXT_NAV_TYPE', null, CONFIG) === 'normal') {
      return
    }
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
  }, 200), [])

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    scrollTrigger()
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  if (!children) return <></>

  return (
    <div id='sticky-bar' className='sticky flex-grow justify-center top-0 duration-500 z-10 pb-16'>
      <div className='bg-white dark:bg-hexo-black-gray px-5 absolute shadow-md w-full scroll-hidden'>
        <div id='tag-container' className="md:pl-3 overflow-x-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default StickyBar
