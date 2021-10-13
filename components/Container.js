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
    const tagsBar = document.querySelector('#tags-bar')
    if (scrollS >= windowTop && scrollS > 10) {
      nav && nav.classList.add('-mt-16')
      tagsBar && tagsBar.classList.add('-mt-32')
      windowTop = scrollS
    } else {
      nav && nav.classList.remove('-mt-16')
      tagsBar && tagsBar.classList.remove('-mt-32')
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
      <TopNav tags={tags}/>
      {children}
    </div>
  )
}

Container.propTypes = {
  children: PropTypes.node
}

export default Container
