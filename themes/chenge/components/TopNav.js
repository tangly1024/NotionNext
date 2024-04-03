import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import CategoryGroup from './CategoryGroup'
import Logo from './Logo'
import SearchDrawer from './SearchDrawer'
import TagGroups from './TagGroups'
import { MenuListTop } from './MenuListTop'
import throttle from 'lodash.throttle'
import SideBar from './SideBar'
import SideBarDrawer from './SideBarDrawer'
import { siteConfig } from '@/lib/config'
import SearchButton from './SearchButton'
import CONFIG from '../config'
import { useRouter } from 'next/router'
import DarkModeButton from '@/components/DarkModeButton'

let windowTop = 0

/**
 * 顶部导航
 * @param {*} param0
 * @returns
 */
const TopNav = props => {
  const searchDrawer = useRef()
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [isOpen, changeShow] = useState(false)
  const showSearchButton = siteConfig('HEXO_MENU_SEARCH', false, CONFIG)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const toggleSideBarClose = () => {
    changeShow(false)
  }

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', topNavStyleHandler)
    router.events.on('routeChangeComplete', topNavStyleHandler)
    topNavStyleHandler()
    return () => {
      router.events.off('routeChangeComplete', topNavStyleHandler)
      window.removeEventListener('scroll', topNavStyleHandler)
    }
  }, [])

  const throttleMs = 200

  const topNavStyleHandler = useCallback(throttle(() => {
    const scrollS = window.scrollY
    const nav = document.querySelector('#sticky-nav')
    const menu = document.querySelector('#active-menu')
    // 首页和文章页会有头图
    const header = document.querySelector('#header')
    // 导航栏和头图是否重叠
    const scrollInHeader = header && (scrollS < 10 || scrollS < header?.clientHeight - 50) // 透明导航条的条件

    // const textWhite = header && scrollInHeader
    if (scrollInHeader) {
      nav && nav.classList.replace('bg-gradient', 'bg-none')
      nav && nav.classList.replace('border', 'border-transparent')
      nav && nav.classList.replace('drop-shadow-md', 'shadow-none')
      nav && nav.classList.replace('text-shadow-none','text-shadow')
      nav && nav.classList.replace('dark:bg-hexo-black-grey', 'transparent')
      nav && nav.classList.replace('text-hexo-grey', 'text-white')
      menu && menu.classList.replace('text-hexo-aqua','text-white')
      menu && menu.classList.replace('border-hexo-aqua', 'border-white')
    } else {
      nav && nav.classList.replace('bg-none', 'bg-gradient')
      nav && nav.classList.replace('border-transparent', 'border')
      nav && nav.classList.replace('shadow-none', 'drop-shadow-md')
      nav && nav.classList.replace('text-shadow', 'text-shadow-none')
      nav && nav.classList.replace('transparent', 'dark:bg-hexo-black-grey')
      nav && nav.classList.replace('text-white', 'text-hexo-grey')
      menu && menu.classList.replace('text-white','text-hexo-aqua')
      menu && menu.classList.replace('border-white','border-hexo-aqua')
    }

    // 导航栏不在头图里，且页面向下滚动一定程度 隐藏导航栏
    const showNav = scrollS <= windowTop || scrollS < 5 || (header && scrollS <= header.clientHeight + 100)
    if (!showNav) {
      nav && nav.classList.replace('top-0', '-top-20')
      windowTop = scrollS
    } else {
      nav && nav.classList.replace('-top-20', 'top-0')
      windowTop = scrollS
    }
  }, throttleMs)
  )

  const searchDrawerSlot = <>
        {categories && (
            <section className='mt-8'>
                <div className='text-sm flex flex-nowrap justify-between font-light px-2'>
                    <div className='text-gray-600 dark:text-gray-200'><i className='mr-2 fas fa-th-list' />{locale.COMMON.CATEGORY}</div>
                    <Link
                        href={'/category'}
                        passHref
                        className='mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>

                        {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />

                    </Link>
                </div>
                <CategoryGroup currentCategory={currentCategory} categories={categories} />
            </section>
        )}

        {tags && (
            <section className='mt-4'>
                <div className='text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200'>
                    <div className='text-gray-600 dark:text-gray-200'><i className='mr-2 fas fa-tag' />{locale.COMMON.TAGS}</div>
                    <Link
                        href={'/tag'}
                        passHref
                        className='text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer'>

                        {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />

                    </Link>
                </div>
                <div className='p-2'>
                    <TagGroups tags={tags} currentTag={currentTag} />
                </div>
            </section>
        )}
    </>

  return (<div id='top-nav' className='z-40'>
        <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />

        {/* 导航栏 */}
        <div id='sticky-nav' style={{ backdropFilter: 'blur(3px)' }} className={'top-0 duration-300 transition-all shadow-none fixed bg-none text-shadow dark:bg-hexo-black-grey text-hexo-grey w-full z-20 transform border-transparent dark:border-transparent'}>
            <div className='lg:max-w-75p mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center py-1'>
                <div className='flex justify-start items-center space-x-4'>
                    <Logo {...props} />
                    <div className='hidden lg:flex'> <MenuListTop {...props} /></div>
                </div>

                {/* 右侧功能 */}
                <div className='mr-1 flex justify-end items-center '>
                    
                    <div onClick={toggleMenuOpen} className='w-8 justify-center items-center h-8 cursor-pointer flex lg:hidden'>
                        {isOpen ? <i className='fas fa-times' /> : <i className='fas fa-bars' />}
                    </div>
                    <DarkModeButton />
                    {showSearchButton && <SearchButton />}
                </div>
            </div>
        </div>

        {/* 折叠侧边栏 */}
        <SideBarDrawer isOpen={isOpen} onClose={toggleSideBarClose}>
            <SideBar {...props} />
        </SideBarDrawer>
    </div>)
}

export default TopNav
