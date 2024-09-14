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
      loadExternalResource(
        'https://cdn.bootcdn.net/ajax/libs/typed.js/2.0.12/typed.min.js',
        'js'
      ).then(() => {
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
      className='w-full h-96 relative bg-black'>

      <LazyImage
        id='header-cover'
        alt={siteInfo?.title}
        src={siteInfo?.pageCover}
        className={`header-cover w-full h-96 object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''
          }`}
        style={{ objectPosition: 'center' }}
      />

      <div
        id='hero-header-cover'
        className='bg-black bg-opacity-70 absolute top-0 w-full h-96 py-10 flex justify-center items-center'>
        <div className='text-white flex flex-col items-center justify-center w-full'>
          {/* 站点标题 */}
          <div className='font-black text-4xl md:text-5xl shadow-text'>
            {siteInfo?.title || siteConfig('TITLE')}
          </div>
        </div>
      </div>
    </header>
  )
}
export default Hero
