import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useState } from 'react'
import SmartLink from '@/components/SmartLink'
import { getClaudeMenuLinks } from './menu'

const pathMatches = (asPath, href) => {
  if (!href) return false
  if (asPath === href) return true
  if (href !== '/' && asPath.startsWith(href)) {
    const next = asPath.charAt(href.length)
    return next === '' || next === '/' || next === '?'
  }
  return false
}

/**
 * 菜单导航 — Claude Docs 风格；桌面侧栏 + 移动纵向列表，支持二级展开（subMenus / children）
 */
export const MenuList = ({ customNav, customMenu }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const [openSubId, setOpenSubId] = useState(null)

  const links = getClaudeMenuLinks({ locale, customNav, customMenu }).filter(
    l => l?.show !== false
  )

  const renderMenuIcon = icon => {
    if (!icon || typeof icon !== 'string') {
      return null
    }
    const normalizedIcon = icon.trim()
    if (!normalizedIcon) {
      return null
    }

    const isFontAwesomeIcon =
      /(^|\s)fa[srldb]?\s/.test(normalizedIcon) ||
      /(^|\s)fa-[\w-]+/.test(normalizedIcon)
    if (isFontAwesomeIcon) {
      return <i className={`${normalizedIcon} claude-nav-icon`} aria-hidden='true' />
    }

    return (
      <span className='claude-nav-icon-emoji' aria-hidden='true'>
        {normalizedIcon}
      </span>
    )
  }

  const toggleSub = id => {
    setOpenSubId(prev => (prev === id ? null : id))
  }

  const renderLeafLink = link => {
    const isActive = pathMatches(router.asPath, link.href)

    return (
      <SmartLink key={link.id} href={link.href} target={link.target}>
        <div className={`claude-nav-link ${isActive ? 'active' : ''}`}>
          {renderMenuIcon(link.icon)}
          <span className='claude-nav-label'>{link.name}</span>
        </div>
      </SmartLink>
    )
  }

  const renderGroup = link => {
    const hasSub = link.subMenus?.length > 0
    const isOpen = openSubId === link.id

    if (!hasSub && link.href) {
      return renderLeafLink(link)
    }

    const childActive = link.subMenus?.some(s => pathMatches(router.asPath, s.href))
    const parentLooksActive = childActive

    return (
      <div key={link.id} className='claude-nav-group'>
        <div className='claude-nav-parent-row'>
          <div
            className={`claude-nav-link claude-nav-parent-link claude-nav-parent-fallback ${parentLooksActive ? 'active' : ''}`}
            role='button'
            tabIndex={0}
            aria-expanded={isOpen}
            aria-controls={`claude-submenu-${link.id}`}
            onClick={() => toggleSub(link.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleSub(link.id)
              }
            }}>
            {renderMenuIcon(link.icon)}
            <span className='claude-nav-label'>{link.name}</span>
          </div>
          <button
            type='button'
            className='claude-nav-submenu-toggle'
            aria-expanded={isOpen}
            aria-controls={`claude-submenu-${link.id}`}
            aria-label={
              router.locale?.startsWith?.('zh')
                ? isOpen
                  ? '收起子菜单'
                  : '展开子菜单'
                : isOpen
                  ? 'Collapse submenu'
                  : 'Expand submenu'
            }
            onClick={() => toggleSub(link.id)}>
            <i className={`fas fa-angle-down claude-nav-chevron ${isOpen ? 'claude-nav-chevron-open' : ''}`} />
          </button>
        </div>
        {isOpen && (
          <div id={`claude-submenu-${link.id}`} className='claude-nav-submenu'>
            {link.subMenus.map(sub => (
              <SmartLink key={sub.id || sub.href} href={sub.href} target={sub.target}>
                <div
                  className={`claude-nav-link claude-nav-sublink ${pathMatches(router.asPath, sub.href) ? 'active' : ''}`}>
                  {renderMenuIcon(sub.icon)}
                  <span className='claude-nav-label'>{sub.name}</span>
                </div>
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!links.length) {
    return null
  }

  return (
    <>
      <div id='nav-menu-pc' className='hidden md:flex md:flex-col md:gap-0.5'>
        {links.map((link, index) =>
          link.subMenus?.length
            ? renderGroup({ ...link, id: link.id ?? `menu-${index}` })
            : renderLeafLink({ ...link, id: link.id ?? `menu-${index}` })
        )}
      </div>

      <div id='nav-menu-mobile' className='flex md:hidden flex-col gap-0.5 w-full'>
        {links.map((link, index) =>
          link.subMenus?.length
            ? renderGroup({ ...link, id: link.id ?? `menu-${index}` })
            : renderLeafLink({ ...link, id: link.id ?? `menu-${index}` })
        )}
      </div>
    </>
  )
}
