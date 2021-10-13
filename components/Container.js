import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import CommonHead from '@/components/CommonHead'
import TopNav from '@/components/TopNav'

const Container = ({ children, layout, fullWidth, tags, meta, ...customMeta }) => {
  let windowTop = 0
  // 监听滚动
  useEffect(() => {
    function scrollTrigger () {
      const scrollS = window.scrollY
      const nav = document.querySelector('#sticky-nav')
      const tagsBar = document.querySelector('#tags-bar')
      console.log(windowTop, scrollS)
      if (scrollS >= windowTop) {
        nav && nav.classList.add('-mt-16')
        tagsBar && tagsBar.classList.add('-mt-32')
        windowTop = scrollS
      } else {
        nav && nav.classList.remove('-mt-16')
        tagsBar && tagsBar.classList.remove('-mt-32')
        windowTop = scrollS
      }
    }

    window.addEventListener('scroll', scrollTrigger)
  })
  return (
    <>
      <CommonHead meta={meta} />
      <TopNav tags={tags}/>
      {children}
    </>
  )
}

Container.propTypes = {
  children: PropTypes.node
}

export default Container
