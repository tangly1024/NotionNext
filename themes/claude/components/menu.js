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
        target: item.target,
        icon: item.icon
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
        id: link.id ?? `menu-${index}`,
        name: link.name || link.title || link.label || '',
        href: link.href || link.url || '',
        subMenus
      }
    })
    .filter(link => {
      if (!link || link.show === false) return false
      const subs = link.subMenus?.length > 0
      return Boolean(link.href) || subs
    })

/**
 * Claude 侧栏 / 移动导航菜单（支持 subMenus / children 二级项）
 * 与 fuwari / Notion CUSTOM_MENU 结构对齐
 */
export function getClaudeMenuLinks({ locale, customNav, customMenu }) {
  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('CLAUDE_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('CLAUDE_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('CLAUDE_MENU_TAG', null, CONFIG)
    }
  ]

  if (Array.isArray(customNav) && customNav.length > 0) {
    links = links.concat(customNav)
  }

  if (
    siteConfig('CUSTOM_MENU') &&
    Array.isArray(customMenu) &&
    customMenu.length > 0
  ) {
    links = customMenu
  }

  return normalizeMenu(links)
}
