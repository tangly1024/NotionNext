import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { useEffect, useRef, useState } from 'react'
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

  const { locale } = useGlobal()

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
    const nav = document.querySelector('#top-navbar')

    const narrowNav = scrollS > 50
    if (narrowNav) {
      nav && nav.classList.replace('h-24', 'h-14')
    } else {
      nav && nav.classList.replace('h-14', 'h-24')
    }
  }, throttleMs)

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
        className='px-4 flex w-full mx-auto max-w-screen-xl h-24 transition-all duration-200 items-between'>
        {/* 左侧图标Logo */}
        <LogoBar {...props} />

        {/* 移动端折叠按钮 */}
        <div className='mr-1 flex md:hidden justify-end items-center text-lg space-x-4 font-serif dark:text-gray-200'>
          <div onClick={toggleMenuOpen} className='cursor-pointer'>
            {isOpen ? (
              <i className='fas fa-times' />
            ) : (
              <i className='fas fa-bars' />
            )}
          </div>
        </div>

        {/* 桌面端顶部菜单 */}
        <div className='hidden md:flex items-center'>
          {links &&
            links?.map(link => <MenuItemDrop key={link?.id} link={link} />)}
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
