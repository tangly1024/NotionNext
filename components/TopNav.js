import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faBars, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import throttle from 'lodash.throttle'
import { useCallback, useEffect, useRef, useState } from 'react'
import Collapse from './Collapse'
import Logo from './Logo'
import MenuButtonGroup from './MenuButtonGroup'
import SearchDrawer from './SearchDrawer'

let windowTop = 0

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const TopNav = ({ tags, currentTag, post, slot, categories, currentCategory, autoHide = true, postCount }) => {
  const { locale } = useGlobal()
  const searchDrawer = useRef()

  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    if (scrollS >= windowTop && scrollS > 10) {
      const nav = document.querySelector('#sticky-nav')
      nav && nav.classList.replace('top-0', '-top-16')
      windowTop = scrollS
    } else {
      const nav = document.querySelector('#sticky-nav')
      nav && nav.classList.replace('-top-16', 'top-0')
      windowTop = scrollS
    }
  }, 200), [])

  // 监听滚动
  useEffect(() => {
    if (BLOG.topNavType === 'autoCollapse') {
      scrollTrigger()
      window.addEventListener('scroll', scrollTrigger)
    }
    return () => {
      BLOG.autoCollapsedNavBar && window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  const [isOpen, changeShow] = useState(false)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  return (<div id='top-nav' className='z-40 block lg:hidden'>
      <SearchDrawer cRef={searchDrawer}/>

    {/* 导航栏 */}
    <div id='sticky-nav' className={`${BLOG.topNavType !== 'normal' ? 'fixed' : ''} animate__animated animate__fadeIn  lg:relative w-full top-0 z-20 transform duration-500`}>
      <div className='w-full flex justify-between items-center p-4 bg-black text-white'>
        {/* 左侧LOGO 标题 */}
        <div className='flex flex-none flex-grow-0'>
          <div onClick={toggleMenuOpen} className='w-8 cursor-pointer'>
          { isOpen ? <FontAwesomeIcon icon={faTimes} size={'lg'}/> : <FontAwesomeIcon icon={faBars} size={'lg'}/> }
          </div>
        </div>

        <div className='flex'>
         <Logo/>
        </div>

        {/* 右侧功能 */}
        <div className='mr-1 flex justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
          <div className="cursor-pointer block lg:hidden" onClick={() => { searchDrawer?.current?.show() }}>
            <FontAwesomeIcon icon={faSearch} className="mr-2" />{locale.NAV.SEARCH}
          </div>
        </div>
      </div>

      <Collapse isOpen={isOpen}>
        <div className='bg-white py-1'>
          <MenuButtonGroup postCount={postCount}/>
          </div>
      </Collapse>
    </div>

  </div>)
}

export default TopNav
