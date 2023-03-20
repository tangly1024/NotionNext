import React from 'react'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import CONFIG_HEXO from '../config_hexo'
import BLOG from '@/blog.config'
import { DropMenu } from './DropMenu'

const MenuList = (props) => {
  const { postCount, customNav, customMenu } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const archiveSlot = <div className='bg-gray-300 dark:bg-gray-500 rounded-md text-gray-50 px-1 text-xs'>{postCount}</div>

  let links = [
    { icon: 'fas fa-home', name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { icon: 'fas fa-th', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_HEXO.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_HEXO.MENU_TAG },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', slot: archiveSlot, show: CONFIG_HEXO.MENU_ARCHIVE },
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: CONFIG_HEXO.MENU_SEARCH }
  ]
  if (customNav) {
    links = links.concat(customNav)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (BLOG.CUSTOM_MENU) {
    links = customMenu
  }

  return (
    <nav id='nav' className='leading-8 text-gray-500 dark:text-gray-300 '>
      {links.map(link => {
        if (link && link.show) {
          const selected = (router.pathname === link.to) || (router.asPath === link.to)
          return <DropMenu key={link.id} selected={selected} link={link} />
        } else {
          return null
        }
      })}
    </nav>
  )
}
export default MenuList
