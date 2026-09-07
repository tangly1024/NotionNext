import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG from '../config'
import DarkModeButton from './DarkModeButton'

const matchesPath = (path, href) =>
  href === '/'
    ? path === '/'
    : path === href || path.startsWith(`${href}/`)

export default function Header({ customNav, customMenu, searchModal }) {
  const { locale } = useGlobal()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  let links = [
    {
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('EDITORIAL_MENU_ARCHIVE', true, CONFIG)
    },
    {
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('EDITORIAL_MENU_CATEGORY', true, CONFIG)
    },
    {
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('EDITORIAL_MENU_TAG', true, CONFIG)
    }
  ]

  if (Array.isArray(customNav)) links = links.concat(customNav)
  if (siteConfig('CUSTOM_MENU') && Array.isArray(customMenu)) links = customMenu
  links = links.filter(link => link && link.show !== false && link.href)

  const openSearch = () => {
    if (siteConfig('ALGOLIA_APP_ID') && searchModal?.current) {
      searchModal.current.openSearch()
    } else {
      router.push('/search')
    }
  }

  return (
    <header className='editorial-header'>
      <div className='editorial-header-inner'>
        <SmartLink href='/' className='editorial-brand'>
          <span className='editorial-brand-mark' aria-hidden='true'>
            ◇
          </span>
          <span>{siteConfig('TITLE')}</span>
        </SmartLink>

        <nav className='editorial-nav' aria-label='Main navigation'>
          {links.map(link => (
            <SmartLink
              key={`${link.href}-${link.name}`}
              href={link.href}
              target={link.target}
              className={`editorial-nav-link ${matchesPath(router.asPath, link.href) ? 'active' : ''}`}>
              {link.name}
            </SmartLink>
          ))}
        </nav>

        <div className='editorial-header-actions'>
          {siteConfig('EDITORIAL_MENU_SEARCH', true, CONFIG) && (
            <button
              type='button'
              className='editorial-icon-button'
              onClick={openSearch}
              aria-label={locale.NAV.SEARCH}>
              <i className='fas fa-search' aria-hidden='true' />
            </button>
          )}
          <DarkModeButton />
          <button
            type='button'
            className='editorial-mobile-toggle'
            onClick={() => setMobileOpen(value => !value)}
            aria-expanded={mobileOpen}
            aria-label='Toggle navigation'>
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className='editorial-mobile-nav' aria-label='Mobile navigation'>
          {links.map(link => (
            <SmartLink
              key={`mobile-${link.href}-${link.name}`}
              href={link.href}
              target={link.target}
              className='editorial-mobile-link'
              onClick={() => setMobileOpen(false)}>
              {link.name}
            </SmartLink>
          ))}
        </nav>
      )}
    </header>
  )
}
