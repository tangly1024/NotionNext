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
        strings: ['Hi，我是一个程序员', 'Hi，我是一个打工人', 'Hi，我是一个干饭人', '欢迎来到我的博客🎉'],
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
    console.log('滚动结束回调', windowTop)
  }
  const scrollTrigger = useCallback(() => {
    console.log('触发 top', windowTop, 'y', window.scrollY, autoScroll)
    if (window.scrollY > windowTop & window.scrollY < window.innerHeight & !autoScroll) {
      // console.log('滚中间', windowTop, window.scrollY, window.innerHeight)
      autoScroll = true
      scrollTo(window.innerHeight, autoScrollEnd)
    }
    if (window.scrollY < windowTop & window.scrollY < window.innerHeight & !autoScroll) {
      // console.log('滚上', windowTop, window.scrollY, window.innerHeight)
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

  // 监听滚动
  useEffect(() => {
    updateTopNav()
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return <header className='h-screen w-full'>

    <div className='absolute z-10 flex h-screen items-center justify-center w-full text-4xl md:text-7xl text-white'>
      <div id="typed" className=' text-center font-serif'></div>
      <div onClick={() => { scrollTo(window.innerHeight, autoScrollEnd) }} className='cursor-pointer w-full text-center text-2xl animate-bounce absolute bottom-10 text-white'><FontAwesomeIcon icon={faArrowDown} /></div>
    </div>

    <div className='bg-black bg-cover bg-center h-screen md:-mt-14  animate__fadeInRight animate_fadeIn'
        style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0,0,0,0.4), rgba(0, 0, 0, 0.5) ),url("./bg_image.jpg")' }}>
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
