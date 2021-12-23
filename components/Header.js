import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useState } from 'react'
import Typed from 'typed.js'

/**
 *
 * @returns 头图
 */
export default function Header () {
  const [typed, changeType] = useState()
  useEffect(() => {
    if (!typed && window && document.getElementById('typed')) {
      changeType(
        new Typed('#typed', {
          strings: BLOG.headerStrings,
          typeSpeed: 200,
          backSpeed: 100,
          backDelay: 400,
          showCursor: true,
          smartBackspace: true
        })
      )
    }
  })
  const { theme } = useGlobal()
  // 监听滚动
  let windowTop = 0
  let autoScroll = false

  const autoScrollEnd = () => {
    windowTop = window.scrollY
    autoScroll = false
  }
  const scrollTrigger = useCallback(() => {
    if (
      (window.scrollY > windowTop) &
      (window.scrollY < window.innerHeight) &
      !autoScroll
    ) {
      autoScroll = true
      scrollTo(wrapperTop, autoScrollEnd)
    }
    if (
      (window.scrollY < windowTop) &
      (window.scrollY < window.innerHeight) &
      !autoScroll
    ) {
      autoScroll = true
      scrollTo(0, autoScrollEnd)
    }
    windowTop = window.scrollY

    updateTopNav()
  })

  const updateTopNav = () => {
    if (theme !== 'dark') {
      const stickyNavElement = document.getElementById('sticky-nav')
      if (window.scrollY < window.innerHeight) {
        stickyNavElement.classList.add('dark')
      } else {
        stickyNavElement.classList.remove('dark')
      }
    }
  }

  let wrapperTop = 0
  function updateHeaderHeight () {
    if (window) {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement.offsetTop
    }
  }

  useEffect(() => {
    updateHeaderHeight()
    updateTopNav()
    window.addEventListener('scroll', scrollTrigger)
    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
      window.removeEventListener('resize', updateHeaderHeight)
    }
  })

  return (
    <header
      id="header"
      className="duration-500 w-full bg-cover bg-center md:-mt-14 bg-black"
      style={{
        height: 'calc(100vh + 1px)',
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0,0,0,0.4), rgba(0, 0, 0, 0.5) ),url("./bg_image.jpg")'
      }}
    >
      <div className="absolute z-10 flex h-full items-center -mt-14 justify-center w-full text-4xl md:text-7xl text-white">
        <div id='typed' className='flex text-center font-serif'/>
      </div>
      <div
        onClick={() => {
          scrollTo(wrapperTop, autoScrollEnd)
        }}
        className="cursor-pointer w-full text-center text-2xl animate-bounce absolute bottom-10 text-white"
      >
        <FontAwesomeIcon icon={faArrowDown} />
      </div>
    </header>
  )
}

/**
 * Native scrollTo with callback
 * @param offset - offset to scroll to
 * @param callback - callback function
 */
function scrollTo (offset, callback) {
  const fixedOffset = offset.toFixed()
  const onScroll = function () {
    if (window.pageYOffset.toFixed() === fixedOffset) {
      window.removeEventListener('scroll', onScroll)
      window.onscroll = function () {}
      callback()
    }
  }

  window.addEventListener('scroll', onScroll)
  window.onscroll = onScroll()
  window.scrollTo({
    top: offset,
    behavior: 'smooth'
  })
}
