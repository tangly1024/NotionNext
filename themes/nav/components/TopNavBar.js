import { useCallback, useEffect, useRef, useState } from 'react'
import Collapse from '@/components/Collapse'
import { MenuBarMobile } from './MenuBarMobile'
import throttle from 'lodash.throttle'
import SearchInput from './SearchInput'
import DarkModeButton from '@/components/DarkModeButton'
import LogoBar from './LogoBar'

/**
 * 顶部导航栏 + 菜单
 * @param {} param0
 * @returns
 */
export default function TopNavBar(props) {
  const { className } = props
  const [isOpen, changeShow] = useState(false)
  const collapseRef = useRef(null)

  let windowTop = 0

  // 监听滚动
  useEffect(() => {
    scrollTrigger()
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  const throttleMs = 200

  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    const nav = document.querySelector('#nav-bg')
    // const header = document.querySelector('#top-nav')
    const header = document.querySelector('#container-inner')
    const showNav = scrollS <= windowTop || scrollS < 5 || (scrollS <= header.clientHeight)// 非首页无大图时影藏顶部 滚动条置顶时隐藏
    if (!showNav) {
      nav && nav.classList.replace('-top-20', 'top-0')
      windowTop = scrollS
    } else {
      nav && nav.classList.replace('top-0', '-top-20')
      windowTop = scrollS
    }
  }, throttleMs)
  )

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  return (
        <div id='top-nav' className={'fixed top-0 w-full z-40 bg-white dark:bg-neutral-900 shadow bg-opacity-70 dark:bg-opacity-60 backdrop-filter backdrop-blur-lg  md:shadow-none pb-2 md:pb-0 ' + className}>
            {/* 图标Logo */}
            <div className='fixed top-0 left-5 md:left-4 z-40 pt-3 md:pt-4'>
                <LogoBar {...props} />
            </div>

            {/* 移动端折叠菜单 */}
            <Collapse type='vertical' collapseRef={collapseRef} isOpen={isOpen} className='md:hidden mt-16'>
                <div className='pt-1 py-3 lg:hidden '>
                    <MenuBarMobile {...props} onHeightChange={(param) => collapseRef.current?.updateCollapseHeight(param)} />
                </div>
            </Collapse>

            {/* 导航栏菜单 */}
            <div className='h-18 px-5'>

              <div className='absolute top-0 right-5'>
                {/* 搜索框、折叠按钮、仅移动端显示 */}
                <div className='pt-1 flex md:hidden justify-end items-center space-x-3 font-serif dark:text-gray-200 '>
                <div className='relative md:hidden top-0 right-0'>
                  <SearchInput className='my-3 rounded-full' />
                </div>
                    <DarkModeButton className='flex text-md items-center h-full' />
                    <div onClick={toggleMenuOpen} className='w-4 text-center cursor-pointer text-lg hover:scale-110 duration-150'>
                        {isOpen ? <i className='fas fa-times' /> : <i className="fa-solid fa-ellipsis-vertical"/>}
                    </div>
                </div>

                {/* 桌面端顶部菜单 */}
                <div className='hidden md:flex'>
                    {/* {links && links?.map((link, index) => <MenuItemDrop key={index} link={link} />)} */}
                    <SearchInput className='my-3 rounded-full' />
                    <DarkModeButton className='my-5 mr-6 text-sm flex items-center h-full pt-px' />
                </div>
              </div>
            </div>
        </div>
  )
}
