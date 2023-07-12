import { useCallback, useEffect, useState } from 'react'
import Logo from './Logo'

import { MenuListTop } from './MenuListTop'
import throttle from 'lodash.throttle'
/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const [isOpen, changeShow] = useState(false)
  const [headerBgShow, setHeaderBgShow] = useState(false)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  // 监听滚动
  useEffect(() => {
    scrollTrigger()
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  const throttleMs = 200

  /**
         * 根据滚动条，切换导航栏样式
         */
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    const header = document.querySelector('#header')

    // 导航栏设置 白色背景
    if (header && scrollS > 60) {
      setHeaderBgShow(true)
    } else {
      setHeaderBgShow(false)
    }
  }, throttleMs))

  return (<>
        {/* 头条 */}
        <nav id='header' className={`${headerBgShow ? 'bg-white border-b' : 'bg-none'} h-16 flex justify-center items-center top-0 duration-300 transition-all sticky text-black w-full z-20 transform`}>
            <div className='w-full max-w-[88rem] mx-auto flex justify-between items-center px-5'>
                <div className='flex'>
                    <Logo {...props} />
                </div>

                {/* 右侧功能 */}
                <div className='mr-1 justify-end items-center '>
                    <div className='hidden lg:flex'> <MenuListTop {...props} /></div>
                    <div onClick={toggleMenuOpen} className='w-8 justify-center items-center h-8 cursor-pointer flex lg:hidden'>
                        {isOpen ? <i className='fas fa-times' /> : <i className='fas fa-bars' />}
                    </div>
                </div>
            </div>
        </nav>
    </>)
}

export default Header
