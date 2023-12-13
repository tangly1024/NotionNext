import React from 'react'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import BLOG from '@/blog.config'
import { MenuItemDrop } from './MenuItemDrop'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuList = (props) => {
  const { postCount, customNav, customMenu } = props
  const { locale } = useGlobal()
  const archiveSlot = <div className='bg-gray-300 dark:bg-gray-500 rounded-md text-gray-50 px-1 text-xs'>{postCount}</div>

  const defaultLinks = [
    { id: 1, icon: 'fas fa-home', name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { id: 2, icon: 'fas fa-th', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG.MENU_CATEGORY },
    { id: 3, icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG.MENU_TAG },
    { id: 4, icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', slot: archiveSlot, show: CONFIG.MENU_ARCHIVE }
  ]

  let links = [].concat(defaultLinks)
  if (customNav) {
    links = defaultLinks.concat(customNav)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (BLOG.CUSTOM_MENU) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
        <>
            {/* 大屏模式菜单 */}
            <nav id='nav' data-aos="fade-down"
                data-aos-duration="500"
                data-aos-delay="400"
                data-aos-once="true"
                data-aos-anchor-placement="top-bottom"
                className='hidden md:block leading-8 text-gray-500 dark:text-gray-400 font-sans'>
                {links.map(link => link && link.show && <MenuItemDrop key={link?.id} link={link} />)}
            </nav>

            {/* 移动端菜单 */}
            <div id='nav-menu-mobile' className='block md:hidden my-auto justify-start bg-white'>
                {links?.map(link => link && link.show && <MenuItemCollapse onHeightChange={props.onHeightChange} key={link?.id} link={link} />)}
            </div>
        </>
  )
}
