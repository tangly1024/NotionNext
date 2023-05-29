import CommonHead from '@/components/CommonHead'
import { useCallback, useEffect, useState } from 'react'

import Footer from './components/Footer'
import JumpToTopButton from './components/JumpToTopButton'
import TopNav from './components/TopNav'
import Live2D from '@/components/Live2D'
import LoadingCover from './components/LoadingCover'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import FloatDarkModeButton from './components/FloatDarkModeButton'
import throttle from 'lodash.throttle'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import SocialButton from './components/SocialButton'
import CONFIG_MATERY from './config_matery'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, headerSlot, meta, siteInfo } = props
  const [show, switchShow] = useState(false)
  const { onLoading } = useGlobal()

  const throttleMs = 200
  const scrollListener = useCallback(throttle(() => {
    const scrollY = window.pageYOffset
    const shouldShow = scrollY > 300
    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
  }, throttleMs))

  useEffect(() => {
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [])

  if (isBrowser()) {
    loadExternalResource('/css/theme-matery.css', 'css')
  }

  return (
        <div id='theme-matery' className="min-h-screen flex flex-col justify-between bg-hexo-background-gray dark:bg-black w-full">

            <CommonHead meta={meta} siteInfo={siteInfo} />

            <TopNav {...props} />

            {headerSlot}

            <main id="wrapper" className={`${CONFIG_MATERY.HOME_BANNER_ENABLE ? '' : 'pt-16'} flex-1 w-full py-8 md:px-8 lg:px-24 relative`}>
                {/* 嵌入区域 */}
                               <div id="container-slot" className={`w-full max-w-6xl ${props?.post && ' lg:max-w-3xl 2xl:max-w-4xl '} mt-6 px-3 mx-auto lg:flex lg:space-x-4 justify-center relative z-10`}>
                   {props.containerSlot}
                </div>

                <div id="container-inner" className="w-full max-w-6xl mx-auto lg:flex lg:space-x-4 justify-center relative z-10">
                    {onLoading ? <LoadingCover /> : children}
                </div>

            </main>

            {/* 左下角悬浮 */}
            <div className="bottom-4 -left-14 fixed justify-end z-40">
                <Live2D />
            </div>

            {/* 右下角悬浮 */}
            <div className="bottom-40 right-2 fixed justify-end space-y-2 z-20">
                <FloatDarkModeButton />
                <JumpToTopButton />
                <SocialButton/>
                {/* 可扩展的右下角悬浮 */}
                {props.floatRightBottom}
            </div>

            <Footer title={siteInfo?.title || BLOG.TITLE} />
        </div>
  )
}

export default LayoutBase
