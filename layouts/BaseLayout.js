import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useRef } from 'react'
import CommonHead from '@/components/CommonHead'
import throttle from 'lodash.throttle'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import SideArea from '@/components/SideArea'
import JumpToTopButton from '@/components/JumpToTopButton'
import { useGlobal } from '@/lib/global'
import LoadingCover from '@/components/LoadingCover'
import FloatDarkModeButton from '@/components/FloatDarkModeButton'

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
 * @param currentTag
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
  currentTag,
  categories,
  ...customMeta
}) => {
  let windowTop = 0
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
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
  }, [])
  const { onLoading, theme } = useGlobal()
  const targetRef = useRef(null)

  return (
    <div id='wrapper' className={theme}>
      <CommonHead meta={meta} />

      {/* 顶部导航栏 */}
      <TopNav tags={tags} post={post} posts={totalPosts} currentSearch={currentSearch} categories={categories} currentCategory={currentCategory} />

      {/* Middle Wrapper */}
      <div className='flex bg-gray-100 dark:bg-gray-900 xl:px-32 md:px-16 md:pt-20 pb-12'>
        <div className='hidden lg:block'>
          <SideArea title={meta.title} post={post} posts={totalPosts} tags={tags} currentSearch={currentSearch} currentTag={currentTag} categories={categories} currentCategory={currentCategory} />
        </div>

        <div className='flex flex-grow min-h-screen' ref={targetRef}>
          {onLoading
            ? <LoadingCover/>
            : <div className='flex-grow  md:pl-10'>
              {children}
            </div>
          }
        </div>
      </div>

      <Footer title={meta.title}/>

      <JumpToTopButton targetRef={targetRef} showPercent={true} />
      <FloatDarkModeButton/>
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

    const stickyBar = document.querySelector('#sticky-bar')
    stickyBar && stickyBar.classList.replace('top-14', 'top-0')

    const tocDrawerButton = document.querySelector('#toc-drawer-button')
    tocDrawerButton && tocDrawerButton.classList.replace('hidden', 'block')
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

    const stickyBar = document.querySelector('#sticky-bar')
    stickyBar && stickyBar.classList.replace('top-0', 'top-14')
  }
}

BaseLayout.propTypes = {
  children: PropTypes.node
}

export default BaseLayout
