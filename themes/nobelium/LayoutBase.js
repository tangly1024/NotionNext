import CommonHead from '@/components/CommonHead'
import React from 'react'
import Nav from './components/Nav'
import { Footer } from './components/Footer'
import JumpToTopButton from './components/JumpToTopButton'
import Live2D from '@/components/Live2D'
/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, meta, post } = props

  const fullWidth = post?.fullWidth ?? false

  return (
        <div className='nobelium dark:text-gray-300  w-full  bg-white dark:bg-black min-h-screen'>
            <CommonHead meta={meta} />

            {/* 顶部导航栏 */}
            <Nav {...props} />

            <main className={`m-auto flex-grow w-full transition-all ${
                !fullWidth ? 'max-w-2xl px-4' : 'px-4 md:px-24'
                }`}>

                {children}

            </main>

            <Footer {...props} />

            <div className='fixed right-4 bottom-4'>
                <JumpToTopButton />
            </div>

            {/* 左下角悬浮 */}
            <div className="bottom-4 -left-14 fixed justify-end z-40">
                <Live2D />
            </div>
        </div>
  )
}

export default LayoutBase
