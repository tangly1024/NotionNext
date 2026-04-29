import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { getFuwariMenuLinks } from './menu'

const MobileNav = ({ locale, customNav, customMenu }) => {
  const [open, setOpen] = useState(false)
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
              <SmartLink
                key={link.id || `${link.href}-${index}`}
                href={link.href}
                className='px-3 py-2 rounded-lg font-semibold hover:bg-[var(--fuwari-bg-soft)]'
                onClick={() => setOpen(false)}>
                {link.name || link.title}
              </SmartLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

export default MobileNav

