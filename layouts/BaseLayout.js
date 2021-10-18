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
    const nav = document.querySelector('#sticky-nav')
    const sidebar = document.querySelector('#sidebar')
    const tagsBar = document.querySelector('#tags-bar')
    const rightToc = document.querySelector('#right-toc')
    if (scrollS >= windowTop && scrollS > 10) {
      nav && nav.classList.replace('top-0', '-top-16')
      tagsBar && tagsBar.classList.replace('top-16', 'top-0')
      sidebar && sidebar.classList.replace('top-20', 'top-2')
      rightToc && rightToc.classList.replace('top-16', 'top-0')
      windowTop = scrollS
    } else {
      nav && nav.classList.replace('-top-16', 'top-0')
      tagsBar && tagsBar.classList.replace('top-0', 'top-16')
      sidebar && sidebar.classList.replace('top-2', 'top-20')
      rightToc && rightToc.classList.replace('top-0', 'top-16')
      windowTop = scrollS
    }
  }, 200))

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
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
      <main className='flex bg-gray-100'>
        <SideBar tags={tags} post={post} />
        <div className='flex flex-grow' ref={targetRef}>
          {children}
          <JumpToTop targetRef={targetRef} showPercent={true} />
        </div>
      </main>

      <Footer />

    </div>
  )
}

BaseLayout.propTypes = {
  children: PropTypes.node
}

export default BaseLayout
