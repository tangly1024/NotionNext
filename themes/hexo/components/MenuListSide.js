import React from 'react'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import { MenuItemCollapse } from './MenuItemCollapse'
import CONFIG_HEXO from '../config_hexo'

export const MenuListSide = (props) => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG_HEXO.MENU_ARCHIVE },
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: CONFIG_HEXO.MENU_SEARCH },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_HEXO.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_HEXO.MENU_TAG }
  ]

  if (customNav) {
    links = customNav.concat(links)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (BLOG.CUSTOM_MENU) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
        <nav>
            {/* {links.map(link => <MenuItemNormal key={link?.id} link={link} />)} */}
            {links?.map(link => <MenuItemCollapse key={link?.id} link={link} />)}
        </nav>
  )
}
