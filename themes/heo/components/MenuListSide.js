import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuListSide = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()
  const lang = siteConfig('LANG', null, CONFIG)
  const fixedLinks = [
    {
      icon: 'fas fa-graduation-cap',
      name: lang === 'zh-CN' ? '学习中心' : 'Learn',
      href: 'https://learn.charliiai.com/',
      target: '_blank',
      show: true
    },
    {
      icon: 'fas fa-images',
      name: 'Imgly',
      href: 'https://imgly.charliiai.com/#/',
      target: '_blank',
      show: true
    }
  ]

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('HEO_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('HEO_MENU_SEARCH', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('HEO_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('HEO_MENU_TAG', null, CONFIG)
    }
  ]

  if (customNav) {
    links = customNav.concat(links)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  links = (links || []).concat(fixedLinks)

  if (!links || links.length === 0) {
    return null
  }

  return (
    <nav className='flex-col space-y-1'>
      {links?.map((link, index) => (
        <MenuItemCollapse key={index} link={link} />
      ))}
    </nav>
  )
}
