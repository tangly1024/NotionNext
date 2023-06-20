import CommonHead from '@/components/CommonHead'
import React from 'react'
import { Header } from './components/Header'
import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
// import { Title } from './components/Title'
import { SideBar } from './components/SideBar'
import JumpToTopButton from './components/JumpToTopButton'
import BLOG from '@/blog.config'
import { TopBar } from './components/TopBar'
import CONFIG_SIMPLE from './config_simple'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import { useGlobal } from '@/lib/global'
import { AdSlot } from '@/components/GoogleAdsense'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta } = props
  const { onLoading } = useGlobal()

  /**
     * 路由跳转时的遮罩
     */
  const LoadingCover = <div id='cover-loading' className={`${onLoading ? 'z-50 opacity-50' : '-z-10 opacity-0'} pointer-events-none transition-all duration-300`}>
        <div className='w-full h-96 flex justify-center items-center'>
            <i className="fa-solid fa-spinner text-2xl text-black dark:text-white animate-spin">  </i>
        </div>
    </div>

  if (isBrowser()) {
    loadExternalResource('/css/theme-simple.css', 'css')
  }
  return (
        <div id='theme-simple' className='min-h-screen flex flex-col dark:text-gray-300  bg-white dark:bg-black'>
            <CommonHead meta={meta} />

            {CONFIG_SIMPLE.TOP_BAR && <TopBar {...props} />}

            {/* 顶部LOGO */}
            <Header {...props} />

            {/* 导航栏 */}
            <NavBar {...props} />

            {/* 主体 */}
            <div id='container-wrapper' className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + ' w-full flex-1 flex items-start max-w-9/10 mx-auto pt-12'}>
                <div id='container-inner ' className='w-full flex-grow'>
                    {onLoading ? LoadingCover : children}
                    <AdSlot type='native'/>
                </div>

                <div id='right-sidebar' className="hidden xl:block flex-none sticky top-8 w-96 border-l dark:border-gray-800 pl-12 border-gray-100">
                    <SideBar {...props} />
                </div>

            </div>

            <div className='fixed right-4 bottom-4 z-20'>
                <JumpToTopButton />
            </div>

            <Footer {...props} />

        </div>
  )
}

export default LayoutBase
