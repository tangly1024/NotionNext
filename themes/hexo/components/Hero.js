// import Image from 'next/image'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NavButtonGroup from './NavButtonGroup'

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
      loadExternalResource('/js/typed.min.js', 'js').then(() => {
        if (window.Typed) {
          changeType(
            new window.Typed('#typed', {
              strings: GREETING_WORDS,
              typeSpeed: 200,
              backSpeed: 100,
              backDelay: 400,
              showCursor: true,
              smartBackspace: true
            })
          )
        }
      })
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
    <header
      id='header'
      style={{ zIndex: 1 }}
      className='w-full h-screen relative bg-black'>
      <div className='text-white absolute bottom-0 grid grid-rows-[3.5fr_auto_1.5fr] h-full items-center justify-center w-full '>
        {/* 上部空间 */}
        <div></div>

        {/* 中心内容区域：标题、欢迎语和导航按钮垂直居中 */}
        <div className='flex flex-col items-center justify-center space-y-4'>
          {/* 站点标题 */}
          <div className='font-black text-4xl md:text-5xl text-[#001BA0]'>
            {siteInfo?.title || siteConfig('TITLE')}
          </div>
          {/* 站点欢迎语 */}
          <div className='h-12 flex items-center text-center font-medium text-lg text-[#001BA0]'>
            <span id='typed' />
          </div>

          {/* 首页导航大按钮 */}
          {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && (
            <NavButtonGroup {...props} />
          )}
        </div>

        {/* 下部空间 */}
        <div className='flex flex-col items-center justify-end pb-10'>
          {/* 滚动按钮 */}
          <div
            onClick={scrollToWrapper}
            className='z-10 cursor-pointer w-full text-center py-4 text-3xl text-white'>
            <div className='opacity-70 animate-bounce text-xs'>
              {siteConfig('HEXO_SHOW_START_READING', null, CONFIG) &&
                locale.COMMON.START_READING}
            </div>
            <i className='opacity-70 animate-bounce fas fa-angle-down' />
          </div>
        </div>
      </div>

      <LazyImage
        id='header-cover'
        alt={siteInfo?.title}
        src={siteInfo?.pageCover}
        className={`header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`}
      />
    </header>
  )
}

export default Hero
