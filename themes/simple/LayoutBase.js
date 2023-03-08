import CommonHead from '@/components/CommonHead'
import React from 'react'
import { Header } from './components/Header'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
// import { Title } from './components/Title'
import { SideBar } from './components/SideBar'
import JumpToTopButton from './components/JumpToTopButton'
import BLOG from '@/blog.config'
import { TopBar } from './components/TopBar'
import CONFIG_SIMPLE from './config_simple'
import { isBrowser, loadExternalResource } from '@/lib/utils'
/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta } = props
  if (isBrowser()) {
    loadExternalResource('/css/theme-simple.css', 'css')
  }
  return (
        <div id='theme-simple' className='dark:text-gray-300  bg-white dark:bg-black'>
            <CommonHead meta={meta} />

            {CONFIG_SIMPLE.TOP_BAR && <TopBar {...props} />}

            {/* 顶部LOGO */}
            <Header {...props} />

            {/* 菜单 */}
            <Nav {...props} />

            {/* 主体 */}
            <div id='container-inner' className="w-full relative z-10">

                {/* <Title {...props} /> */}

                <div className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + ' w-full relative container mx-auto justify-start md:flex items-start pt-12 px-2'}>

                    <div className='w-full max-w-6xl'>{children}</div>

                    <SideBar {...props} />

                </div>

            </div>

            <div className='fixed right-4 bottom-4 z-10'>
                <JumpToTopButton />
            </div>

            <Footer {...props} />

        </div>
  )
}

export default LayoutBase
