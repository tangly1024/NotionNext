import { useCallback, useEffect, useState } from 'react'
import Logo from './Logo'

import { MenuListTop } from './MenuListTop'
import throttle from 'lodash.throttle'
/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const NavBar = props => {
  const [isOpen, changeShow] = useState(false)
  const [fixedNav, setFixedNav] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [navBgWhite, setBgWhite] = useState(false)

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

    // 导航栏设置 白色背景
    if (scrollS <= 0) {
      setFixedNav(false)
      setBgWhite(false)

      // 文章详情页特殊处理
      const postHeader = document.querySelector('#post-bg')
      if (postHeader) {
        setFixedNav(true)
        setTextWhite(true)
        setBgWhite(false)
      }
      return
    }

    // 向下滚动后的导航样式
    setFixedNav(true)
    setTextWhite(false)
    setBgWhite(true)
  }, throttleMs))

  return (<>
        {/* 头条 */}
        <nav id='nav' className={`${fixedNav ? 'fixed' : 'relative bg-none'} ${textWhite ? 'text-white ' : 'text-black dark:text-white'}  ${navBgWhite ? 'bg-white dark:bg-[#18171d]' : 'bg-none'} z-20 h-16 top-0 w-full`}>
            <div className='flex h-full mx-auto justify-between items-center max-w-[86rem] px-8'>
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

export default NavBar
