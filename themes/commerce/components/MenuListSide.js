import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuListSide = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
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
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: CONFIG.MENU_CATEGORY
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: CONFIG.MENU_TAG
    }
  ]

  if (customNav) {
    links = customNav.concat(links)
  }

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i
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
    <nav>
      {/* {links.map(link => <MenuItemNormal key={link?.id} link={link} />)} */}
      {links?.map(link => (
        <MenuItemCollapse key={link?.id} link={link} />
      ))}
    </nav>
  )
}
