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
      changeType(new Typed('#typed', {
        strings: BLOG.headerStrings,
        typeSpeed: 200,
        backSpeed: 100,
        backDelay: 400,
        showCursor: true,
        smartBackspace: true
      }))
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
    if (window.scrollY > windowTop & window.scrollY < window.innerHeight & !autoScroll) {
      autoScroll = true
      scrollTo(window.innerHeight, autoScrollEnd)
    }
    if (window.scrollY < windowTop & window.scrollY < window.innerHeight & !autoScroll) {
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

  useEffect(() => {
    updateHeaderHeight()
    updateTopNav()
    window.addEventListener('scroll', scrollTrigger)
    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return <header id='header' className='h-screen w-full bg-cover bg-center md:-mt-14'
    style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0,0,0,0.4), rgba(0, 0, 0, 0.5) ),url("./bg_image.jpg")' }}>
    <div className='static z-10 flex h-full items-center justify-center w-full text-4xl md:text-7xl text-white'>
      <div id="typed" className='text-center font-serif'></div>
      <div onClick={() => { scrollTo(window.innerHeight, autoScrollEnd) }} className='cursor-pointer w-full text-center text-2xl animate-bounce absolute bottom-10 text-white'><FontAwesomeIcon icon={faArrowDown} /></div>
    </div>
</header>
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
      callback()
    }
  }

  window.addEventListener('scroll', onScroll)
  onScroll()
  window.scrollTo({
    top: offset,
    behavior: 'smooth'
  })
}

function updateHeaderHeight () {
  if (window) {
    const headerElement = document.getElementById('header')
    console.log(headerElement, window.innerHeight)
    headerElement.style.setProperty('height', window.innerHeight + 'px')
  }
}
