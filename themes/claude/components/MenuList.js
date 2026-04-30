import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'

/**
 * 菜单导航 — Claude Docs 风格
 * 简洁文字链接，带左边框活跃指示器
 */
export const MenuList = ({ customNav, customMenu }) => {
  const { locale } = useGlobal()
  const router = useRouter()

  const renderMenuIcon = icon => {
    if (!icon || typeof icon !== 'string') {
      return null
    }
    const normalizedIcon = icon.trim()
    if (!normalizedIcon) {
      return null
    }

    // Notion icon 字段可直接写 Font Awesome 类名，例如 "fas fa-clock-rotate-left"
    const isFontAwesomeIcon = /(^|\s)fa[srldb]?\s/.test(normalizedIcon) || /(^|\s)fa-[\w-]+/.test(normalizedIcon)
    if (isFontAwesomeIcon) {
      return <i className={`${normalizedIcon} claude-nav-icon`} aria-hidden='true' />
    }

    return (
      <span className='claude-nav-icon-emoji' aria-hidden='true'>
        {normalizedIcon}
      </span>
    )
  }

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

  if (siteConfig('CUSTOM_MENU') && Array.isArray(customMenu) && customMenu.length > 0) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <>
      {/* 桌面端 — 垂直列表 */}
      <div id='nav-menu-pc' className='hidden md:flex md:flex-col md:gap-0.5'>
        {links?.filter(l => l?.show !== false).map((link, index) => {
          const isActive = router.asPath === link.href ||
            (link.href !== '/' && router.asPath.startsWith(link.href))
          return (
            <SmartLink key={index} href={link.href}>
              <div className={`claude-nav-link ${isActive ? 'active' : ''}`}>
                {renderMenuIcon(link.icon)}
                <span className='claude-nav-label'>{link.name}</span>
              </div>
            </SmartLink>
          )
        })}
      </div>

      {/* 移动端 — 水平行 */}
      <div id='nav-menu-mobile' className='flex md:hidden justify-center gap-4'>
        {links?.filter(l => l?.show !== false).map((link, index) => (
          <SmartLink key={index} href={link.href}>
            <div className='claude-nav-link'>
              {renderMenuIcon(link.icon)}
              <span className='claude-nav-label'>{link.name}</span>
            </div>
          </SmartLink>
        ))}
      </div>
    </>
  )
}
