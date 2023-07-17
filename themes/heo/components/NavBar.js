import { useCallback, useEffect, useRef, useState } from 'react'
import Logo from './Logo'

import { MenuListTop } from './MenuListTop'
import throttle from 'lodash.throttle'
import RandomPostButton from './RandomPostButton'
import SearchButton from './SearchButton'
import SlideOver from './SlideOver'
import ReadingProgress from './ReadingProgress'
/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const NavBar = props => {
  const [fixedNav, setFixedNav] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [navBgWhite, setBgWhite] = useState(false)
  const slideOverRef = useRef()

  const toggleMenuOpen = () => {
    slideOverRef?.current?.toggleSlideOvers()
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

    // 导航栏设置 白色背景
    if (scrollS <= 0) {
      setFixedNav(false)
      setBgWhite(false)

      // 文章详情页特殊处理
      if (document.querySelector('#post-bg')) {
        setFixedNav(true)
        setTextWhite(true)
        setBgWhite(false)
      }
    } else {
      // 向下滚动后的导航样式
      setFixedNav(true)
      setTextWhite(false)
      setBgWhite(true)
    }
  }, throttleMs))

  return (<>
        {/* 顶部导航菜单栏 */}
        <nav id='nav' className={`${fixedNav ? 'fixed' : 'relative bg-none'} ${textWhite ? 'text-white ' : 'text-black dark:text-white'}  ${navBgWhite ? 'bg-white dark:bg-[#18171d]' : 'bg-none'} z-20 h-16 top-0 w-full`}>
            <div className='flex h-full mx-auto justify-between items-center max-w-[86rem] px-8'>
                {/* 左侧logo */}
                <div className='flex'>
                    <Logo {...props} />
                </div>

                {/* 中间菜单 */}
                <div className='mr-1 justify-end items-center hidden lg:block'>
                    <div className='hidden lg:flex'> <MenuListTop {...props} /></div>
                </div>

                {/* 右侧固定 */}
                <div className='flex justify-center items-center space-x-1'>
                    <RandomPostButton {...props} />
                    <SearchButton />
                    <ReadingProgress/>

                    {/* 移动端菜单按钮 */}
                    <div onClick={toggleMenuOpen} className='flex lg:hidden w-8 justify-center items-center h-8 cursor-pointer'>
                        <i className='fas fa-bars' />
                    </div>
                </div>

                {/* 右边侧拉抽屉 */}
                <SlideOver cRef={slideOverRef} {...props}/>
            </div>
        </nav>
    </>)
}

export default NavBar
