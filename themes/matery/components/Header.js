import { useEffect, useState } from 'react'
import Typed from 'typed.js'
import CONFIG_MATERY from '../config_matery'

let wrapperTop = 0
let windowTop = 0
let autoScroll = false

/**
 *
 * @returns 头图
 */
const Header = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  useEffect(() => {
    scrollTrigger()
    updateHeaderHeight()
    if (!typed && window && document.getElementById('typed')) {
      changeType(
        new Typed('#typed', {
          strings: CONFIG_MATERY.HOME_BANNER_GREETINGS,
          typeSpeed: 200,
          backSpeed: 100,
          backDelay: 400,
          showCursor: true,
          smartBackspace: true
        })
      )
    }
    window.addEventListener('scroll', scrollTrigger)
    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
      window.removeEventListener('resize', updateHeaderHeight)
    }
  })

  const autoScrollEnd = () => {
    if (autoScroll) {
      windowTop = window.scrollY
      autoScroll = false
    }
  }

  /**
   * 吸附滚动，移动端关闭
   * @returns
   */
  const scrollTrigger = () => {
    if (screen.width <= 768) {
      return
    }

    const scrollS = window.scrollY

    // 自动滚动
    if ((scrollS > windowTop) & (scrollS < window.innerHeight) && !autoScroll
    ) {
      autoScroll = true
      window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
      setTimeout(autoScrollEnd, 500)
    }
    if ((scrollS < windowTop) && (scrollS < window.innerHeight) && !autoScroll) {
      autoScroll = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(autoScrollEnd, 500)
    }
    windowTop = scrollS
  }

  function updateHeaderHeight () {
    setTimeout(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    }, 500)
  }

  return (
    <header
      id="header"
      className="duration-500 md:bg-fixed w-full bg-cover bg-center h-screen bg-black text-white"
      style={{
        backgroundImage:
          `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0,0,0,0.5), rgba(0,0,0,0.3), rgba(0,0,0,0.5), rgba(0, 0, 0, 0.9) ),url("${siteInfo?.pageCover}")`
      }}
    >
      <div className="absolute flex flex-col h-full items-center justify-center w-full ">
        <div className='text-4xl md:text-5xl text-white shadow-text'>{siteInfo?.title}</div>
        <div className='mt-2 h-12 items-center text-center shadow-text text-white text-lg'>
          <span id='typed'/>
        </div>
        <div onClick={() => { window.scrollTo({ top: wrapperTop, behavior: 'smooth' }) }}
             className="mt-12 border cursor-pointer w-40 text-center pt-4 pb-3 text-md text-white hover:bg-orange-600 duration-300 rounded-3xl">
            <i className='animate-bounce fas fa-angle-double-down'/> <span>开始阅读</span>
        </div>
      </div>

    </header>
  )
}

export default Header
