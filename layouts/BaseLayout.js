import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef } from 'react'
import CommonHead from '@/components/CommonHead'
import throttle from 'lodash.throttle'
import BLOG from '@/blog.config'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import SideBar from '@/components/SideBar'
import JumpToTopButton from '@/components/JumpToTopButton'
import { useGlobal } from '@/lib/global'
import DarkModeButton from '@/components/DarkModeButton'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param children
 * @param layout
 * @param fullWidth
 * @param tags
 * @param meta
 * @param post
 * @param totalPosts
 * @param currentSearch
 * @param currentCategory
 * @param categories
 * @param customMeta
 * @returns {JSX.Element}
 * @constructor
 */
const BaseLayout = ({
  children,
  layout,
  fullWidth,
  tags,
  meta,
  post,
  totalPosts,
  currentSearch,
  currentCategory,
  categories,
  ...customMeta
}) => {
  let windowTop = 0
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    console.log(scrollS)
    if (scrollS >= windowTop && scrollS > 10) {
      handleScrollDown()
      windowTop = scrollS
    } else {
      handleScrollUp()
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
  const { theme } = useGlobal()
  const targetRef = useRef(null)

  return (
    <div id='wrapper' className={[BLOG.font, 'subpixel-antialiased', theme].join(' ')}>
      <CommonHead meta={meta} />

      {/* 顶部导航栏 */}
      <div className='block lg:hidden'>
        <TopNav tags={tags} post={post} posts={totalPosts} currentSearch={currentSearch} categories={categories}
                currentCategory={currentCategory} />
      </div>

      {/* Middle Wrapper */}
      <main className='flex dark:bg-black'>
         <div className='hidden lg:block z-10'>
           <SideBar tags={tags} post={post} posts={totalPosts} categories={categories} currentCategory={currentCategory} />
         </div>
        <div className='flex flex-grow' ref={targetRef}>
          {children}
        </div>
        <JumpToTopButton targetRef={targetRef} showPercent={true} />
        <div className='hidden lg:block fixed right-4 top-4 p-1 rounded-full
         bg-white text-black
         dark:border-gray-500 dark:bg-gray-700 dark:text-white
         ' style={{ boxShadow: 'rgba(41, 50, 60, 0.5) 0px 2px 16px', borderRadius: '28px' }}>
          <DarkModeButton/>
        </div>
      </main>

      <Footer />
    </div>
  )
}

/**
 * 隐藏导航
 * 划到页面下方
 */
const handleScrollDown = () => {
  if (document) {
    const nav = document.querySelector('#sticky-nav')
    nav && nav.classList.replace('top-0', '-top-16')

    const tagsBar = document.querySelector('#tags-bar')
    tagsBar && tagsBar.classList.replace('top-16', 'top-0')

    const tocDrawerButton = document.querySelector('#toc-drawer-button')
    tocDrawerButton && tocDrawerButton.classList.replace('hidden', 'block')

    // const sidebar = document.querySelector('#sidebar')
    // sidebar && sidebar.classList.replace('top-20', 'top-2')
    // const rightToc = document.querySelector('#right-toc')
    // rightToc && rightToc.classList.replace('top-16', 'top-0')
  }
}

/**
 * 显示导航
 * 划到顶部
 */
const handleScrollUp = () => {
  if (document) {
    const nav = document.querySelector('#sticky-nav')
    nav && nav.classList.replace('-top-16', 'top-0')

    const tagsBar = document.querySelector('#tags-bar')
    tagsBar && tagsBar.classList.replace('top-0', 'top-16')

    // const tocDrawerButton = document.querySelector('#toc-drawer-button')
    // tocDrawerButton && tocDrawerButton.classList.replace('block', 'hidden')

    // const sidebar = document.querySelector('#sidebar')
    // sidebar && sidebar.classList.replace('top-2', 'top-20')

    // const rightToc = document.querySelector('#right-toc')
    // rightToc && rightToc.classList.replace('top-0', 'top-16')
  }
}

BaseLayout.propTypes = {
  children: PropTypes.node
}

export default BaseLayout
