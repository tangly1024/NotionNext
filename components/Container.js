import PropTypes from 'prop-types'
import React, { useCallback, useEffect } from 'react'
import CommonHead from '@/components/CommonHead'
import TopNav from '@/components/TopNav'
import throttle from 'lodash.throttle'
import BLOG from '@/blog.config'
import { useTheme } from '@/lib/theme'

const Container = ({ children, layout, fullWidth, tags, meta, ...customMeta }) => {
  let windowTop = 0
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    const nav = document.querySelector('#sticky-nav')
    const sidebar = document.querySelector('#sidebar')
    const tagsBar = document.querySelector('#tags-bar')
    const rightToc = document.querySelector('#right-toc')
    if (scrollS >= windowTop && scrollS > 10) {
      nav && nav.classList.add('-mt-16')
      tagsBar && tagsBar.classList.add('-mt-32')
      sidebar && sidebar.classList.replace('top-20', 'top-2')
      rightToc && rightToc.classList.replace('top-16', 'top-0')
      windowTop = scrollS
    } else {
      nav && nav.classList.remove('-mt-16')
      tagsBar && tagsBar.classList.remove('-mt-32')
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
  return (
    <div className={[BLOG.font, theme].join(' ')}>
      <CommonHead meta={meta} />
      {children}
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node
}

export default Container
