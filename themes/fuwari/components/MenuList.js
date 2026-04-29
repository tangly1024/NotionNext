import SmartLink from '@/components/SmartLink'
import { getFuwariMenuLinks } from './menu'

const MenuList = ({ locale, customNav, customMenu, mobile = false }) => {
  const links = getFuwariMenuLinks({ locale, customNav, customMenu })
  if (!links.length) return null

  const displayLinks = mobile ? links.slice(0, 4) : links

  return (
    <nav
      className={
        mobile
          ? 'flex items-center justify-between text-sm text-[var(--fuwari-muted)]'
          : 'hidden md:flex items-center justify-center gap-0.5 text-[13px] text-[var(--fuwari-muted)]'
      }>
      {displayLinks.map((link, index) => (
        <SmartLink
          key={link.id || `${link.href}-${index}`}
          href={link.href}
          className='px-3 py-1.5 rounded-lg font-semibold hover:bg-[var(--fuwari-bg-soft)]'>
          {link.name || link.title}
        </SmartLink>
      ))}
    </nav>
  )
}

export default MenuList

