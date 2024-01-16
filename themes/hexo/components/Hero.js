// import Image from 'next/image'
import { useEffect, useState } from 'react'
import Typed from 'typed.js'
import CONFIG from '../config'
import NavButtonGroup from './NavButtonGroup'
import { useGlobal } from '@/lib/global'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'

let wrapperTop = 0

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  const { locale } = useGlobal()
  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
  }
  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',')
  useEffect(() => {
    updateHeaderHeight()

    if (!typed && window && document.getElementById('typed')) {
      changeType(
        new Typed('#typed', {
          strings: GREETING_WORDS,
          typeSpeed: 200,
          backSpeed: 100,
          backDelay: 400,
          showCursor: true,
          smartBackspace: true
        })
      )
    }

    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  })

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    })
  }

  return (
        <header id="header" style={{ zIndex: -100 }} className="w-full h-screen relative bg-black opacity-0">
            <div className='z-101 text-white absolute bottom-12 flex flex-col h-full items-center justify-center w-full'>
                {/* 站点标题 */}
                <div className='z-101 font-black text-4xl md:text-5xl shadow-text opacity-100'>{siteConfig('TITLE')}</div>
                {/* 站点欢迎语 */}
                <div className='z-103 mt-2 h-12 items-center text-center font-medium shadow-text text-lg opacity-100'>
                    <span id='typed' />
                </div>

                {/* 首页导航大按钮 */}
                {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && <NavButtonGroup {...props} />}

                {/* 滚动按钮 */}
                <div onClick={scrollToWrapper} className="z-104 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-6 text-white opacity-100">
                    <div className="opacity-70 animate-bounce text-xs opacity-100">{siteConfig('HEXO_SHOW_START_READING', null, CONFIG) && locale.COMMON.START_READING}</div>
                    <i className='opacity-70 animate-bounce fas fa-angle-down' />
                </div>
            </div>

            <LazyImage id='header-cover' src={siteInfo?.pageCover}
                className={`opacity-100 z-100 header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`} />

        </header>
  )
}

export default Hero
