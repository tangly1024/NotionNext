import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useEffect, useRef, useState } from 'react'
import MenuList from './MenuList'
import MobileNav from './MobileNav'
import ThemeColorSwitch from './ThemeColorSwitch'

const Header = ({ locale, customNav, customMenu, searchModal }) => {
  const { isDarkMode, toggleDarkMode } = useGlobal()
  const [showPalette, setShowPalette] = useState(false)
  const panelRef = useRef(null)
  const algoliaEnabled = Boolean(siteConfig('ALGOLIA_APP_ID'))
  const paletteFixed = siteConfig('FUWARI_THEME_COLOR_FIXED', false)

  const handleSearch = () => {
    if (algoliaEnabled) {
      searchModal?.current?.openSearch()
      return
    }
    window.location.href = '/search'
  }

  useEffect(() => {
    const onClickOutside = e => {
      if (!showPalette) return
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPalette(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [showPalette])

  return (
    <header className='max-w-6xl mx-auto px-4 pt-0 pb-3 sticky top-0 z-40'>
      <div className='fuwari-card fuwari-navbar px-4 py-2.5 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]'>
        <SmartLink href='/' className='text-[1.35rem] md:text-[1.45rem] font-bold fuwari-title-gradient text-left'>
          {siteConfig('TITLE')}
        </SmartLink>
        <MenuList locale={locale} customNav={customNav} customMenu={customMenu} />
        <div className='hidden md:flex items-center justify-end gap-2 relative'>
          <button type='button' onClick={handleSearch} className='fuwari-tool-btn'>
            <i className='fas fa-search' />
          </button>
          {!paletteFixed && (
            <button
              type='button'
              onClick={() => setShowPalette(v => !v)}
              className='fuwari-tool-btn'>
              <i className='fas fa-palette' />
            </button>
          )}
          <button type='button' onClick={toggleDarkMode} className='fuwari-tool-btn'>
            {isDarkMode ? '☀' : '☾'}
          </button>
          {showPalette && !paletteFixed && (
            <div ref={panelRef} className='fuwari-card absolute right-0 top-12 p-0 w-80 z-50'>
              <ThemeColorSwitch />
            </div>
          )}
        </div>
        <div className='md:hidden flex items-center justify-end gap-2 relative'>
          <button type='button' onClick={handleSearch} className='fuwari-tool-btn'>
            <i className='fas fa-search' />
          </button>
          {!paletteFixed && (
            <button
              type='button'
              onClick={() => setShowPalette(v => !v)}
              className='fuwari-tool-btn'>
              <i className='fas fa-palette' />
            </button>
          )}
          <button type='button' onClick={toggleDarkMode} className='fuwari-tool-btn'>
            {isDarkMode ? '☀' : '☾'}
          </button>
          <MobileNav locale={locale} customNav={customNav} customMenu={customMenu} />
          {showPalette && !paletteFixed && (
            <div ref={panelRef} className='fuwari-card absolute right-0 top-12 p-0 w-72 z-50'>
              <ThemeColorSwitch />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

