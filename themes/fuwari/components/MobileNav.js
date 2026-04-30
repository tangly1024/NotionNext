import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { getFuwariMenuLinks } from './menu'

const MobileNav = ({ locale, customNav, customMenu }) => {
  const [open, setOpen] = useState(false)
  const [openSub, setOpenSub] = useState('')
  const panelRef = useRef(null)
  if (!siteConfig('FUWARI_MOBILE_MENU', true, CONFIG)) return null

  const links = getFuwariMenuLinks({ locale, customNav, customMenu }).slice(0, 5)

  useEffect(() => {
    const onClickOutside = e => {
      if (!open) return
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  return (
    <div className='relative md:hidden' ref={panelRef}>
      <button
        type='button'
        aria-label='Open Menu'
        className='fuwari-tool-btn'
        onClick={() => setOpen(v => !v)}>
        <i className={`fas ${open ? 'fa-times' : 'fa-bars'}`} />
      </button>
      {open && (
        <div className='fuwari-card absolute right-0 top-11 min-w-[9rem] p-2 z-50'>
          <nav className='flex flex-col text-sm text-[var(--fuwari-muted)]'>
            {links.map((link, index) => (
              <div key={link.id || `${link.href}-${index}`}>
                <div className='flex items-center'>
                  {!link.subMenus?.length && link.href ? (
                    <SmartLink
                      href={link.href}
                      className='flex-1 px-3 py-2 rounded-lg font-semibold hover:bg-[var(--fuwari-bg-soft)]'
                      onClick={() => setOpen(false)}>
                      {link.name || link.title}
                    </SmartLink>
                  ) : (
                    <span className='flex-1 px-3 py-2 rounded-lg font-semibold cursor-default select-none'>
                      {link.name || link.title}
                    </span>
                  )}
                  {!!link.subMenus?.length && (
                    <button
                      type='button'
                      className='px-2 py-2 text-xs'
                      onClick={() => setOpenSub(prev => (prev === link.id ? '' : link.id))}>
                      <i className={`fas ${openSub === link.id ? 'fa-angle-up' : 'fa-angle-down'}`} />
                    </button>
                  )}
                </div>
                {!!link.subMenus?.length && openSub === link.id && (
                  <div className='pl-3 pb-1'>
                    {link.subMenus.map(sub => (
                      <SmartLink
                        key={sub.id || sub.href}
                        href={sub.href}
                        target={sub.target}
                        className='block px-3 py-1.5 rounded-md text-xs hover:bg-[var(--fuwari-bg-soft)]'
                        onClick={() => setOpen(false)}>
                        {sub.name}
                      </SmartLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

export default MobileNav

