import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export const MenuList = ({ customNav, customMenu }) => {
  const { locale } = useGlobal()
  const [isOpen, changeIsOpen] = useState(false)
  const toggleIsOpen = () => {
    changeIsOpen(!isOpen)
  }
  const closeMenu = e => {
    changeIsOpen(false)
  }
  const router = useRouter()
  const collapseRef = useRef(null)

  useEffect(() => {
    router.events.on('routeChangeStart', closeMenu)
  })

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('TYPOGRAPHY_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('TYPOGRAPHY_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('TYPOGRAPHY_MENU_TAG', null, CONFIG)
    }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  // 如果 开启自定义菜单，则覆盖 Page 生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <>
      {/* 大屏模式菜单 - 垂直排列 */}
      <div id='nav-menu-pc' className='hidden md:flex md:flex-col md:gap-2'>
        {links?.map((link, index) => (
          <MenuItemDrop key={index} link={link} />
        ))}
      </div>
      {/* 移动端小屏菜单 - 水平排列 */}
      <div
        id='nav-menu-mobile'
        className='flex md:hidden my-auto justify-center space-x-4'>
        {links?.map((link, index) => (
          <MenuItemDrop key={index} link={link} />
        ))}
      </div>
    </>
  )
}
