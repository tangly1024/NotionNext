import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useMagzineGlobal } from '..'
import CONFIG from '../config'
import LogoBar from './LogoBar'
import { MenuBarMobile } from './MenuBarMobile'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 顶部导航栏 + 菜单
 * @param {} param0
 * @returns
 */
export default function Header(props) {
  const { customNav, customMenu } = props
  const [isOpen, changeShow] = useState(false)
  const collapseRef = useRef(null)
  const lastScrollY = useRef(0) // 用于存储上一次的滚动位置
  const { locale } = useGlobal()
  const router = useRouter()
  const { searchModal } = useMagzineGlobal()

  const defaultLinks = [
    {
      icon: 'fas fa-th',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: CONFIG.MENU_CATEGORY
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: CONFIG.MENU_TAG
    },
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: CONFIG.MENU_ARCHIVE
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: CONFIG.MENU_SEARCH
    }
  ]

  let links = defaultLinks.concat(customNav)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  // 向下滚动时，调整导航条高度
  useEffect(() => {
    scrollTrigger()
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  const throttleMs = 150

  const scrollTrigger = throttle(() => {
    const scrollS = window.scrollY
    if (scrollS === lastScrollY.current) return // 如果滚动位置没有变化，则不做任何操作

    const nav = document.querySelector('#top-navbar')
    const narrowNav = scrollS > 60
    if (narrowNav) {
      nav && nav.classList.replace('h-20', 'h-14')
    } else {
      nav && nav.classList.replace('h-14', 'h-20')
    }

    lastScrollY.current = scrollS // 更新上一次的滚动位置
  }, throttleMs)

  const [showSearchInput, changeShowSearchInput] = useState(false)

  // 展示搜索框
  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      changeShowSearchInput(!showSearchInput)
    }
  }

  const onKeyUp = e => {
    if (e.keyCode === 13) {
      const search = document.getElementById('simple-search').value
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <div
      id='top-navbar-wrapper'
      className={
        'sticky top-0 w-full z-40 shadow bg-white dark:bg-hexo-black-gray '
      }>
      {/* 导航栏菜单内容 */}
      <div
        id='top-navbar'
        className='px-4 lg:px-0 flex w-full mx-auto max-w-screen-3xl h-20 transition-all duration-200 items-center justify-between'>
        {/* 搜索栏 */}
        {showSearchInput && (
          <input
            autoFocus
            id='simple-search'
            onKeyUp={onKeyUp}
            className='outline-none dark:bg-hexo-black-gray dark:text flex flex-row text-base relative w-full border-b py-2'
            aria-label='Submit search'
            type='search'
            name='s'
            autoComplete='off'
            placeholder='Type then hit enter to search...'
          />
        )}

        {/* 默认菜单 */}
        {!showSearchInput && (
          <>
            {/* 左侧图标Logo */}
            <div className='flex gap-x-8 h-full'>
              <LogoBar {...props} />
              {/* 桌面端顶部菜单 */}
              <div className='hidden md:flex items-center gap-x-3'>
                {links &&
                  links?.map((link, index) => (
                    <MenuItemDrop key={index} link={link} />
                  ))}
              </div>
            </div>
          </>
        )}

        {/* 右侧移动端折叠按钮 */}
        <div className='flex items-center gap-x-2 pr-2'>
          {/* 搜索按钮 */}
          <div
            onClick={toggleShowSearchInput}
            className='flex text-center items-center cursor-pointer p-2'>
            <i
              className={
                showSearchInput
                  ? 'fa-regular fa-circle-xmark'
                  : 'fa-solid fa-magnifying-glass' + ' align-middle'
              }></i>
          </div>
          <div className='mr-1 flex md:hidden justify-end items-center text-lg space-x-4 font-serif dark:text-gray-200'>
            <div onClick={toggleMenuOpen} className='cursor-pointer p-2'>
              {isOpen ? (
                <i className='fas fa-times' />
              ) : (
                <i className='fas fa-bars' />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 移动端折叠菜单 */}
      <Collapse
        type='vertical'
        collapseRef={collapseRef}
        isOpen={isOpen}
        className='md:hidden'>
        <div className='bg-white dark:bg-hexo-black-gray pt-1 py-2 lg:hidden '>
          <MenuBarMobile
            {...props}
            onHeightChange={param =>
              collapseRef.current?.updateCollapseHeight(param)
            }
          />
        </div>
      </Collapse>
    </div>
  )
}
