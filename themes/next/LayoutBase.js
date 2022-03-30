import CommonHead from '@/components/CommonHead'
import FloatDarkModeButton from './components/FloatDarkModeButton'
import Footer from './components/Footer'
import JumpToBottomButton from './components/JumpToBottomButton'
import JumpToTopButton from './components/JumpToTopButton'
import LoadingCover from './components/LoadingCover'
import SideAreaLeft from './components/SideAreaLeft'
import SideAreaRight from './components/SideAreaRight'
import TopNav from './components/TopNav'
import { useGlobal } from '@/lib/global'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import smoothscroll from 'smoothscroll-polyfill'
import CONFIG_NEXT from './config_next'
import Live2D from '@/components/Live2D'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, headerSlot, meta, sideBarSlot, floatSlot, rightAreaSlot, siteInfo } = props
  const { onLoading } = useGlobal()
  const targetRef = useRef(null)
  const leftAreaSlot = <Live2D/>

  const [show, switchShow] = useState(false)
  const [percent, changePercent] = useState(0) // 页面阅读百分比
  const scrollListener = () => {
    const targetRef = document.getElementById('wrapper')
    const clientHeight = targetRef?.clientHeight
    const scrollY = window.pageYOffset
    const fullHeight = clientHeight - window.outerHeight
    let per = parseFloat(((scrollY / fullHeight * 100)).toFixed(0))
    if (per > 100) per = 100
    const shouldShow = scrollY > 100 && per > 0

    if (shouldShow !== show) {
      switchShow(shouldShow)
    }
    changePercent(per)
  }
  useEffect(() => {
    smoothscroll.polyfill()
    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [show])

  return (<>

      <CommonHead meta={meta} />

      <TopNav slot={sideBarSlot} {...props}/>

      <>{headerSlot}</>

      <div className='h-0.5 w-full bg-gray-700 dark:bg-gray-600 hidden lg:block'/>

      <main id='wrapper' className='flex justify-center flex-1 pb-12'>
          <SideAreaLeft slot={leftAreaSlot} targetRef={targetRef} {...props}/>
          <section id='center' className={`${CONFIG_NEXT.NAV_TYPE !== 'normal' ? 'mt-40' : ''} lg:max-w-3xl xl:max-w-4xl flex-grow md:mt-0 min-h-screen w-full`} ref={targetRef}>
            {onLoading ? <LoadingCover/> : <> {children}</> }
          </section>
          <SideAreaRight targetRef={targetRef} slot={rightAreaSlot} {...props}/>
      </main>

      {/* 右下角悬浮 */}
      <div className='right-8 bottom-12 lg:right-2 fixed justify-end z-20 font-sans'>
        <div className={(show ? 'animate__animated ' : 'hidden') + ' animate__fadeInUp rounded-md glassmorphism justify-center duration-500  animate__faster flex space-x-2 items-center cursor-pointer '}>
          <JumpToTopButton percent={percent}/>
          <JumpToBottomButton />
          <FloatDarkModeButton/>
          {floatSlot}
        </div>
      </div>

      <Footer title={siteInfo?.title}/>
      </>
  )
}

LayoutBase.propTypes = {
  children: PropTypes.node
}

export default LayoutBase
