import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef } from 'react'
import CommonHead from '@/components/CommonHead'
import throttle from 'lodash.throttle'
import BLOG from '@/blog.config'
import { useTheme } from '@/lib/theme'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import SideBar from '@/components/SideBar'
import JumpToTop from '@/components/JumpToTop'

const BaseLayout = ({ children, layout, fullWidth, tags, meta, post, ...customMeta }) => {
  let windowTop = 0
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    if (scrollS >= windowTop && scrollS > 10) {
      hiddenNav()
      windowTop = scrollS
    } else {
      showNav()
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
  })
  const { theme } = useTheme()
  const targetRef = useRef(null)

  return (
    <div id='wrapper' className={[BLOG.font, theme].join(' ')}>
      <CommonHead meta={meta} />

      <TopNav tags={tags} post={post} />
      {/* Middle Wrapper */}
      <main className='flex dark:bg-black'>
        <SideBar tags={tags} post={post} />
        <div className='flex flex-grow' ref={targetRef}>
            {children}
        </div>
        <JumpToTop targetRef={targetRef} showPercent={true} />
      </main>

      <Footer />
    </div>
  )
}

/**
 * 隐藏导航
 */
const hiddenNav = () => {
  if (document) {
    const nav = document.querySelector('#sticky-nav')
    const sidebar = document.querySelector('#sidebar')
    const tagsBar = document.querySelector('#tags-bar')
    const rightToc = document.querySelector('#right-toc')
    nav && nav.classList.replace('top-0', '-top-16')
    tagsBar && tagsBar.classList.replace('top-16', 'top-0')
    sidebar && sidebar.classList.replace('top-20', 'top-2')
    rightToc && rightToc.classList.replace('top-16', 'top-0')
  }
}

/**
 * 显示导航
 */
const showNav = () => {
  if (document) {
    const nav = document.querySelector('#sticky-nav')
    const sidebar = document.querySelector('#sidebar')
    const tagsBar = document.querySelector('#tags-bar')
    const rightToc = document.querySelector('#right-toc')
    nav && nav.classList.replace('-top-16', 'top-0')
    tagsBar && tagsBar.classList.replace('top-0', 'top-16')
    sidebar && sidebar.classList.replace('top-2', 'top-20')
    rightToc && rightToc.classList.replace('top-0', 'top-16')
  }
}

BaseLayout.propTypes = {
  children: PropTypes.node
}

export default BaseLayout
