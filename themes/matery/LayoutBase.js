import CommonHead from '@/components/CommonHead'
import { useEffect, useState } from 'react'

import Footer from './components/Footer'
import JumpToTopButton from './components/JumpToTopButton'
import TopNav from './components/TopNav'
import smoothscroll from 'smoothscroll-polyfill'
import Live2D from '@/components/Live2D'
import LoadingCover from './components/LoadingCover'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import FloatDarkModeButton from './components/FloatDarkModeButton'

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

  const scrollListener = () => {
    const targetRef = document.getElementById('wrapper')
    const clientHeight = targetRef?.clientHeight
    const scrollY = window.pageYOffset
    const fullHeight = clientHeight - window.outerHeight
    let per = parseFloat(((scrollY / fullHeight) * 100).toFixed(0))
    if (per > 100) per = 100
    const shouldShow = scrollY > 300 && per > 0

    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
    // changePercent(per)
  }
  useEffect(() => {
    smoothscroll.polyfill()
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (
        <div id="outer-wrapper" className="min-h-screen flex flex-col justify-between bg-hexo-background-gray dark:bg-black w-full">

            <CommonHead meta={meta} siteInfo={siteInfo} />

            <TopNav {...props} />

            {headerSlot}

            <main id="wrapper" className="flex-1 w-full py-8 md:px-8 lg:px-24 relative">
                <div id="container-inner" className="w-full max-w-6xl mx-auto lg:flex lg:space-x-4 justify-center relative z-10">
                    {onLoading ? <LoadingCover /> : children}
                </div>
            </main>

            {/* 左下角悬浮 */}
            <div className="bottom-4 -left-14 fixed justify-end z-40">
                <Live2D />
            </div>

            <div className="bottom-40 right-2 fixed justify-end z-20">
                <FloatDarkModeButton />
            </div>

            {/* 右下角悬浮 */}
            <div className="bottom-12 right-2 fixed justify-end z-20">
                <div className={
                    (show ? 'animate__animated ' : 'hidden') +
                    ' animate__fadeInUp justify-center duration-300  animate__faster flex flex-col items-center cursor-pointer '
                }
                >
                    <JumpToTopButton />
                </div>
            </div>

            <Footer title={siteInfo?.title || BLOG.TITLE} />
        </div>
  )
}

export default LayoutBase
