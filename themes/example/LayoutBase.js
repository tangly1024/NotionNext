import CommonHead from '@/components/CommonHead'
import React from 'react'
import { Header } from './components/Header'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Title } from './components/Title'
import { SideBar } from './components/SideBar'
import JumpToTopButton from './components/JumpToTopButton'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta } = props
  const { onLoading } = useGlobal()

  const LoadingCover = <div id='cover-loading' className={`${onLoading ? 'z-50 opacity-50' : '-z-10 opacity-0'} pointer-events-none transition-all duration-300`}>
        <div className='w-full h-screen flex justify-center items-center'>
            <i className="fa-solid fa-spinner text-2xl text-black dark:text-white animate-spin">  </i>
        </div>
    </div>

  return (
        <div id='theme-example' className='dark:text-gray-300  bg-white dark:bg-black'>
            <CommonHead meta={meta} />
            {/* 顶栏LOGO */}
            <Header {...props} />

            {/* 菜单 */}
            <Nav {...props} />

            {/* 主体 */}
            <div id='container-inner' className="w-full relative z-10">

                <Title {...props} />

                <div className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + 'relative container mx-auto justify-center md:flex items-start py-8 px-2'}>

                    <div className='w-full max-w-3xl xl:px-14 lg:px-4 '> {onLoading ? LoadingCover : children}</div>

                    <SideBar {...props} />

                </div>

            </div>

            <Footer {...props} />

            <div className='fixed right-4 bottom-4 z-10'>
                <JumpToTopButton />
            </div>
        </div>
  )
}

export default LayoutBase
