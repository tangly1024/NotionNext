import { useGlobal } from '@/lib/global'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import throttle from 'lodash.throttle'
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
  const scrollToCenter = () => {
    document.getElementById('wrapper').scrollIntoView({ behavior: 'smooth' })
  }

  const { theme } = useGlobal()
  // 监听滚动
  let windowTop = 0
  const scrollTrigger = useCallback(throttle(() => {
    if (window.scrollY > windowTop & window.scrollY < window.innerHeight) {
      scrollToCenter()
    }
    if (window.scrollY < windowTop & window.scrollY < window.innerHeight) {
      window.scroll({ top: 0, behavior: 'smooth' })
    }
    windowTop = window.scrollY
    updateTopNav()
  }, 500))

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
      <div onClick={scrollToCenter} className='cursor-pointer w-full text-center text-2xl animate-bounce absolute bottom-10 text-white'><FontAwesomeIcon icon={faArrowDown} /></div>
    </div>

    <div className='bg-black bg-cover bg-center h-screen md:-mt-14  animate__fadeInRight animate_fadeIn'
        style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0,0,0,0.4), rgba(0, 0, 0, 0.5) ),url("./bg_image.jpg")' }}>
    </div>
</header>
}
