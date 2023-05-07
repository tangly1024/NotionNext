// import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import Typed from 'typed.js'
import CONFIG_MATERY from '../config_matery'
import throttle from 'lodash.throttle'
import { useGlobal } from '@/lib/global'

let wrapperTop = 0
let windowTop = 0
let autoScroll = false
const enableAutoScroll = false // 是否开启自动吸附滚动
const throttleMs = 200

/**
 *
 * @returns 头图
 */
const Header = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  const { locale } = useGlobal()

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
    if (enableAutoScroll) {
      scrollTrigger()
      window.addEventListener('scroll', scrollTrigger)
    }
    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      if (enableAutoScroll) {
        window.removeEventListener('scroll', scrollTrigger)
      } window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

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
  const scrollTrigger = useCallback(throttle(() => {
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
  }, throttleMs))

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    })
  }

  return (
        <header
            id="header" style={{ zIndex: 1 }}
            className=" w-full h-screen bg-black text-white relative"
        >

            <div className="absolute flex flex-col h-full items-center justify-center w-full ">
                <div className='text-4xl md:text-5xl text-white shadow-text'>{siteInfo?.title}</div>
                <div className='mt-2 h-12 items-center text-center shadow-text text-white text-lg'>
                    <span id='typed' />
                </div>
                <div onClick={() => { window.scrollTo({ top: wrapperTop, behavior: 'smooth' }) }}
                    className="mt-12 border cursor-pointer w-40 text-center pt-4 pb-3 text-md text-white hover:bg-orange-600 duration-300 rounded-3xl z-40">
                    <i className='animate-bounce fas fa-angle-double-down' /> <span>{locale.COMMON.START_READING}</span>
                </div>
            </div>

            <div id='header-cover' style={{ backgroundImage: `url('${siteInfo.pageCover}')` }}
                className={`header-cover bg-center w-full h-screen bg-cover ${CONFIG_MATERY.HOME_NAV_BACKGROUND_IMG_FIXED ? 'bg-fixed' : ''}`}/>

        </header>
  )
}

export default Header
