import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const normalizeSubMenus = subMenus =>
  (Array.isArray(subMenus) ? subMenus : [])
    .map((item, index) => {
      if (!item) return null
      return {
        id: item.id || `sub-${index}`,
        name: item.name || item.title || item.label || '',
        href: item.href || item.url || '',
        target: item.target
      }
    })
    .filter(item => item && item.name && item.href)

const normalizeMenu = links =>
  (Array.isArray(links) ? links : [])
    .map((link, index) => {
      if (!link) return null
      const subMenus = normalizeSubMenus(link.subMenus || link.children)
      return {
        ...link,
        id: link.id || `menu-${index}`,
        name: link.name || link.title || link.label || '',
        href: link.href || link.url || '',
        subMenus
      }
    })
    .filter(link => link && link.show !== false && (link.href || link.subMenus?.length))

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

  return normalizeMenu(links)
}

