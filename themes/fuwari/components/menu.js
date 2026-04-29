import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

export function getFuwariMenuLinks({ locale, customNav, customMenu }) {
  let links = [
    {
      id: 1,
      name: locale?.NAV?.INDEX || locale?.COMMON?.HOME || 'Home',
      href: '/',
      show: siteConfig('FUWARI_MENU_INDEX', true, CONFIG)
    },
    {
      id: 2,
      name: locale?.NAV?.ARCHIVE || locale?.COMMON?.ARCHIVE || 'Archive',
      href: '/archive',
      show: siteConfig('FUWARI_MENU_ARCHIVE', true, CONFIG)
    },
    {
      id: 3,
      name: locale?.COMMON?.CATEGORY || 'Category',
      href: '/category',
      show: siteConfig('FUWARI_MENU_CATEGORY', true, CONFIG)
    },
    {
      id: 4,
      name: locale?.COMMON?.TAGS || 'Tags',
      href: '/tag',
      show: siteConfig('FUWARI_MENU_TAG', true, CONFIG)
    },
    {
      id: 5,
      name: locale?.NAV?.SEARCH || locale?.COMMON?.SEARCH || 'Search',
      href: '/search',
      show: siteConfig('FUWARI_MENU_SEARCH', true, CONFIG)
    }
  ]

  if (Array.isArray(customNav) && customNav.length > 0) {
    links = links.concat(customNav)
  }

  // 与 heo/hexo 兼容: 开启 CUSTOM_MENU 后完全使用 Notion Config 菜单
  if (siteConfig('CUSTOM_MENU') && Array.isArray(customMenu)) {
    links = customMenu
  }

  return links.filter(link => link && link.show !== false && link.href)
}

