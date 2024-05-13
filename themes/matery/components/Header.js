import SideBarDrawer from '@/components/SideBarDrawer'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import CategoryGroup from './CategoryGroup'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import SearchButton from './SearchButton'
import SearchDrawer from './SearchDrawer'
import SideBar from './SideBar'
import TagGroups from './TagGroups'

let windowTop = 0

/**
 * 顶部导航(页头)
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const searchDrawer = useRef()
  const { isDarkMode } = useGlobal()
  const throttleMs = 200
  const showSearchButton = siteConfig('MATERY_MENU_SEARCH', false, CONFIG)

  const router = useRouter()
  const scrollTrigger = useCallback(
    throttle(() => {
      requestAnimationFrame(() => {
        const scrollS = window.scrollY
        const nav = document.querySelector('#sticky-nav')
        const header = document.querySelector('#header')
        const showNav =
          scrollS <= windowTop ||
          scrollS < 5 ||
          (header && scrollS <= header.clientHeight * 2) // 非首页无大图时影藏顶部 滚动条置顶时隐藏// 非首页无大图时影藏顶部 滚动条置顶时隐藏
        // 是否将导航栏透明
        const navTransparent = header && scrollS < 300 // 透明导航条的条件

        if (navTransparent) {
          nav && nav.classList.replace('bg-indigo-700', 'bg-none')
          nav && nav.classList.replace('text-black', 'text-white')
          nav && nav.classList.replace('shadow-xl', 'shadow-none')
          nav && nav.classList.replace('dark:bg-hexo-black-gray', 'transparent')
        } else {
          nav && nav.classList.replace('bg-none', 'bg-indigo-700')
          nav && nav.classList.replace('text-white', 'text-black')
          nav && nav.classList.replace('shadow-none', 'shadow-xl')
          nav && nav.classList.replace('transparent', 'dark:bg-hexo-black-gray')
        }

        if (!showNav) {
          nav && nav.classList.replace('top-0', '-top-20')
          windowTop = scrollS
        } else {
          nav && nav.classList.replace('-top-20', 'top-0')
          windowTop = scrollS
        }
        navDarkMode()
      })
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

  // 监听滚动
  useEffect(() => {
    scrollTrigger()

    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [router])

  const [isOpen, changeShow] = useState(false)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const toggleMenuClose = () => {
    changeShow(false)
  }

  const searchDrawerSlot = (
    <>
      {categories && (
        <section className='mt-8'>
          <div className='text-sm flex flex-nowrap justify-between font-light px-2'>
            <div className='text-gray-600 dark:text-gray-200'>
              <i className='mr-2 fas fa-th-list' />
              {locale.COMMON.CATEGORY}
            </div>
            <Link
              href={'/category'}
              passHref
              className='mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
              {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />
            </Link>
          </div>
          <CategoryGroup
            currentCategory={currentCategory}
            categories={categories}
          />
        </section>
      )}

      {tags && (
        <section className='mt-4'>
          <div className='text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200'>
            <div className='text-gray-600 dark:text-gray-200'>
              <i className='mr-2 fas fa-tag' />
              {locale.COMMON.TAGS}
            </div>
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
  )

  return (
    <div id='top-nav'>
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />
      {/* 导航栏 */}
      <div
        id='sticky-nav'
        className={
          'flex justify-center top-0 shadow-none fixed bg-none dark:bg-hexo-black-gray text-gray-200 w-full z-30 transform transition-all duration-200'
        }>
        <div className='w-full max-w-6xl flex justify-between items-center px-4 py-2'>
          {/* 左侧功能 */}
          <div className='justify-start items-center block lg:hidden '>
            <div
              onClick={toggleMenuOpen}
              className='w-8 justify-center items-center h-8 cursor-pointer flex lg:hidden'>
              {isOpen ? (
                <i className='fas fa-times' />
              ) : (
                <i className='fas fa-bars' />
              )}
            </div>
          </div>

          <div className='flex'>
            <Logo {...props} />
          </div>

          {/* 右侧功能 */}
          <div className='mr-1 justify-end items-center flex'>
            <div className='hidden lg:flex'>
              {' '}
              <MenuListTop {...props} />
            </div>
            {showSearchButton && <SearchButton />}
          </div>
        </div>
      </div>

      <SideBarDrawer isOpen={isOpen} onClose={toggleMenuClose}>
        <SideBar {...props} />
      </SideBarDrawer>
    </div>
  )
}

export default Header
