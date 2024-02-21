import React from 'react'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import BLOG from '@/blog.config'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuBarMobile = (props) => {
  const { customMenu, customNav } = props
  const { locale } = useGlobal()

  let links = [
    // { name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG.MENU_CATEGORY },
    { name: locale.COMMON.TAGS, to: '/tag', show: CONFIG.MENU_TAG },
    { name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG.MENU_ARCHIVE }
    // { name: locale.NAV.SEARCH, to: '/search', show: CONFIG.MENU_SEARCH }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  // 如果 开启自定义菜单，则不再使用 Page生成菜单。
  if (BLOG.CUSTOM_MENU) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <nav id='nav' className=' text-md'>
        {/* {links.map(link => <NormalMenu key={link?.id} link={link}/>)} */}
        {links?.map((link, index) => <MenuItemCollapse onHeightChange={props.onHeightChange} key={index} link={link}/>)}

    </nav>
  )
}
