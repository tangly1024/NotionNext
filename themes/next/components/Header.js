import { useGlobal } from '@/lib/global'
import { useEffect, useState } from 'react'
import Typed from 'typed.js'
import CONFIG_NEXT from '../config_next'

let wrapperTop = 0
let windowTop = 0
let autoScroll = false

/**
 *
 * @returns 头图
 */
export default function Header(props) {
  const { siteInfo } = props
  const [typed, changeType] = useState()
  useEffect(() => {
    if (!typed && window && document.getElementById('typed')) {
      changeType(
        new Typed('#typed', {
          strings: CONFIG_NEXT.HOME_BANNER_Strings,
          typeSpeed: 200,
          backSpeed: 100,
          backDelay: 400,
          showCursor: true,
          smartBackspace: true
        })
      )
    }
  }, [])
  const { isDarkMode } = useGlobal()

  const autoScrollEnd = () => {
    if (autoScroll) {
      windowTop = window.scrollY
      autoScroll = false
    }
  }

  const scrollTrigger = () => {
    if (
      (window.scrollY > windowTop) &
      (window.scrollY < window.innerHeight) &&
      !autoScroll
    ) {
      autoScroll = true
      window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
      setTimeout(autoScrollEnd, 500)
    }
    if (
      (window.scrollY < windowTop) &
      (window.scrollY < window.innerHeight) &&
      !autoScroll
    ) {
      autoScroll = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(autoScrollEnd, 500)
    }
    windowTop = window.scrollY

    updateTopNav()
  }

  const updateTopNav = () => {
    if (!isDarkMode) {
      const stickyNavElement = document.getElementById('sticky-nav')
      if (window.scrollY < window.innerHeight) {
        stickyNavElement.classList.add('dark')
      } else {
        stickyNavElement.classList.remove('dark')
      }
    }
  }

  function updateHeaderHeight() {
    setTimeout(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement.offsetTop
    }, 500)
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
  }, [])

  return (
    <header
      id="header"
      className="duration-500 md:bg-fixed w-full bg-cover bg-center h-screen bg-black"
      style={{
        backgroundImage:
          `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0,0,0,0.2), rgba(0, 0, 0, 0.8) ),url("${siteInfo?.pageCover}")`
      }}
    >
      <div className="absolute flex h-full items-center lg:-mt-14 justify-center w-full text-4xl md:text-7xl text-white">
        <div id='typed' className='flex text-center font-serif' />
      </div>
      <div
        onClick={() => {
          window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
        }}
        className="cursor-pointer w-full text-center py-4 text-5xl absolute bottom-10 text-white"
      >
        <i className='animate-bounce fas fa-angle-down' />
      </div>
    </header>
  )
}
