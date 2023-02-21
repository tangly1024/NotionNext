import { useEffect, useRef } from 'react'
import Link from 'next/link'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import CONFIG_NOBELIUM from '../config_nobelium'
import { SvgIcon } from './SvgIcon'

const Nav = props => {
  const { navBarTitle, fullWidth, siteInfo } = props
  const useSticky = !BLOG.autoCollapsedNavBar
  const navRef = useRef(null)
  const sentinalRef = useRef([])
  const handler = ([entry]) => {
    if (navRef && navRef.current && useSticky) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current?.classList.add('sticky-nav-full')
      } else {
        navRef.current?.classList.remove('sticky-nav-full')
      }
    } else {
      navRef.current?.classList.add('remove-sticky')
    }
  }
  useEffect(() => {
    const obvserver = new window.IntersectionObserver(handler)
    obvserver.observe(sentinalRef.current)
    // Don't touch this, I have no idea how it works XD
    // return () => {
    //   if (sentinalRef.current) obvserver.unobserve(sentinalRef.current)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinalRef])
  return <>
    <div className="observer-element h-4 md:h-12" ref={sentinalRef}></div>
    <div
      className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60 ${
        !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
      }`}
      id="sticky-nav"
      ref={navRef}
    >
      <div className="flex items-center">
        <Link href="/" aria-label={BLOG.title}>

          <div className="h-6">
            {/* <SvgIcon/> */}
            {CONFIG_NOBELIUM.NAV_NOTION_ICON
            /* eslint-disable-next-line @next/next/no-img-element */
              ? <img src={siteInfo?.icon} width={24} height={24} alt={BLOG.AUTHOR}/>
              : <SvgIcon/>}

          </div>

        </Link>
        {navBarTitle
          ? (
          <p className="ml-2 font-medium text-day dark:text-night header-name">
            {navBarTitle}
          </p>
            )
          : (
          <p className="ml-2 font-medium text-day dark:text-night header-name">
            {siteInfo?.title}
            {/* ,{' '}<span className="font-normal">{siteInfo?.description}</span> */}
          </p>
            )}
      </div>
      <NavBar {...props}/>
    </div>
  </>
}

const NavBar = props => {
  const { customNav } = props

  const { locale } = useGlobal()
  let links = [
    { id: 2, name: locale.NAV.RSS, to: '/feed', show: CONFIG_NOBELIUM.MENU_RSS, target: '_blank' },
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: CONFIG_NOBELIUM.MENU_SEARCH },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG_NOBELIUM.MENU_ARCHIVE },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_NOBELIUM.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_NOBELIUM.MENU_TAG }
  ]
  if (customNav) {
    links = links.concat(customNav)
  }
  return (
    <div className="flex-shrink-0">
      <ul className="flex flex-row">
        {links.map(
          link =>
            link.show && (
              <li
                key={link.id}
                className="block ml-4 text-black dark:text-gray-50 nav"
              >
                <Link href={link.to} target={link.target}>
                  {link.name}
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  )
}

export default Nav
