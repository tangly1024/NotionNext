import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import CategoryGroup from './CategoryGroup'
import Logo from './Logo'
import SearchDrawer from './SearchDrawer'
import TagGroups from './TagGroups'
import { MenuListTop } from './MenuListTop'
import { useRouter } from 'next/router'
import throttle from 'lodash.throttle'
import SideBar from './SideBar'
import SideBarDrawer from './SideBarDrawer'
import { siteConfig } from '@/lib/config'
import SearchButton from './SearchButton'
import CONFIG from '../config'

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
  const { isDarkMode } = useGlobal()
  const router = useRouter()

  const [isOpen, changeShow] = useState(false)
  const showSearchButton = siteConfig('HEXO_MENU_SEARCH',false,CONFIG)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const toggleSideBarClose = () => {
    changeShow(false)
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

  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY
    const nav = document.querySelector('#sticky-nav')
    const header = document.querySelector('#header')
    // 是否将导航栏透明
    const navTransparent = (scrollS < document.documentElement.clientHeight - 12 && router.route === '/') || scrollS < 300 // 透明导航条的条件

    if (header && navTransparent) {
      nav && nav.classList.replace('bg-white', 'bg-none')
      nav && nav.classList.replace('text-black', 'text-white')
      nav && nav.classList.replace('border', 'border-transparent')
      nav && nav.classList.replace('drop-shadow-md', 'shadow-none')
      nav && nav.classList.replace('dark:bg-hexo-black-gray', 'transparent')
    } else {
      nav && nav.classList.replace('bg-none', 'bg-white')
      nav && nav.classList.replace('text-white', 'text-black')
      nav && nav.classList.replace('border-transparent', 'border')
      nav && nav.classList.replace('shadow-none', 'drop-shadow-md')
      nav && nav.classList.replace('transparent', 'dark:bg-hexo-black-gray')
    }

    const showNav = scrollS <= windowTop || scrollS < 5 || (header && scrollS <= header.clientHeight)// 非首页无大图时影藏顶部 滚动条置顶时隐藏
    if (!showNav) {
      nav && nav.classList.replace('top-0', '-top-20')
      windowTop = scrollS
    } else {
      nav && nav.classList.replace('-top-20', 'top-0')
      windowTop = scrollS
    }
    navDarkMode()
  }, throttleMs)
  )

  const navDarkMode = () => {
    const nav = document.getElementById('sticky-nav')
    const header = document.querySelector('#header')
    if (!isDarkMode && nav && header) {
      if (window.scrollY < header.clientHeight) {
        nav?.classList?.add('dark')
      } else {
        nav?.classList?.remove('dark')
      }
    }
  }

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
        <div id='sticky-nav' style={{ backdropFilter: 'blur(3px)' }} className={'top-0 duration-300 transition-all  shadow-none fixed bg-none dark:bg-hexo-black-gray dark:text-gray-200 text-black w-full z-20 transform border-transparent dark:border-transparent'}>
            <div className='w-full flex justify-between items-center px-4 py-2'>
                <div className='flex'>
                    <Logo {...props} />
                </div>

                {/* 右侧功能 */}
                <div className='mr-1 flex justify-end items-center '>
                    <div className='hidden lg:flex'> <MenuListTop {...props} /></div>
                    <div onClick={toggleMenuOpen} className='w-8 justify-center items-center h-8 cursor-pointer flex lg:hidden'>
                        {isOpen ? <i className='fas fa-times' /> : <i className='fas fa-bars' />}
                    </div>
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
