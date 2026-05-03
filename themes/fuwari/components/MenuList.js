import SmartLink from '@/components/SmartLink'
import { useState } from 'react'
import { getFuwariMenuLinks } from './menu'

const MenuList = ({ locale, customNav, customMenu, mobile = false }) => {
  const [hoverSubId, setHoverSubId] = useState(null)
  const [clickSubId, setClickSubId] = useState(null)
  const links = getFuwariMenuLinks({ locale, customNav, customMenu })
  if (!links.length) return null

  const displayLinks = mobile ? links.slice(0, 4) : links

  const isDesktopSubOpen = linkId =>
    linkId != null && (hoverSubId === linkId || clickSubId === linkId)

  const toggleDesktopSub = linkId => {
    setClickSubId(prev => (prev === linkId ? null : linkId))
  }

  if (mobile) {
    return (
      <nav className='flex items-center justify-between text-sm text-[var(--fuwari-muted)]'>
        {displayLinks.map((link, index) => (
          <SmartLink
            key={link.id || `${link.href}-${index}`}
            href={link.href || '/'}
            className='px-3 py-1.5 rounded-lg font-semibold hover:bg-[var(--fuwari-bg-soft)]'>
            {link.name || link.title}
          </SmartLink>
        ))}
      </nav>
    )
  }

  return (
    <nav className='hidden md:flex items-center justify-center gap-0.5 text-[13px] text-[var(--fuwari-muted)]'>
      {displayLinks.map((link, index) => (
        <div
          key={link.id || `${link.href}-${index}`}
          className='relative'
          onMouseEnter={() => setHoverSubId(link.id)}
          onMouseLeave={() => setHoverSubId(null)}>
          {!link.subMenus?.length && link.href ? (
            <SmartLink
              href={link.href}
              className='px-3 py-1.5 rounded-lg font-semibold hover:bg-[var(--fuwari-bg-soft)]'>
              {link.name || link.title}
            </SmartLink>
          ) : (
            <div
              className={`px-3 py-1.5 rounded-lg font-semibold hover:bg-[var(--fuwari-bg-soft)] select-none ${
                link.subMenus?.length ? 'cursor-pointer' : 'cursor-default'
              }`}
              role={link.subMenus?.length ? 'button' : undefined}
              tabIndex={link.subMenus?.length ? 0 : undefined}
              aria-expanded={
                link.subMenus?.length ? isDesktopSubOpen(link.id) : undefined
              }
              onClick={() => link.subMenus?.length && toggleDesktopSub(link.id)}
              onKeyDown={e => {
                if (
                  link.subMenus?.length &&
                  (e.key === 'Enter' || e.key === ' ')
                ) {
                  e.preventDefault()
                  toggleDesktopSub(link.id)
                }
              }}>
              {link.name || link.title}
              {!!link.subMenus?.length && (
                <i className='fas fa-angle-down ml-1 text-xs' aria-hidden />
              )}
            </div>
          )}

          {!!link.subMenus?.length && (
            <ul
              onMouseEnter={() => setHoverSubId(link.id)}
              onMouseLeave={() => setHoverSubId(null)}
              className={`${isDesktopSubOpen(link.id) ? 'visible opacity-100 translate-y-0 pointer-events-auto' : 'invisible opacity-0 -translate-y-1 pointer-events-none'} absolute left-0 top-10 min-w-[10rem] fuwari-card p-1.5 transition-all duration-200 z-40`}>
              <div className='absolute -top-2 left-0 w-full h-2' />
              {link.subMenus.map(sub => (
                <li key={sub.id || sub.href}>
                  <SmartLink
                    href={sub.href}
                    target={sub.target}
                    className='block px-3 py-1.5 rounded-md hover:bg-[var(--fuwari-bg-soft)] text-[13px] text-[var(--fuwari-text)]'>
                    {sub.name}
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}

export default MenuList

