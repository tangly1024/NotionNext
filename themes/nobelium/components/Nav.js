import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { SvgIcon } from './SvgIcon'
import { MenuItemDrop } from './MenuItemDrop'
import Collapse from '@/components/Collapse'
import { MenuItemCollapse } from './MenuItemCollapse'
import LazyImage from '@/components/LazyImage'
import RandomPostButton from './RandomPostButton'
import SearchButton from './SearchButton'
import { siteConfig } from '@/lib/config'

const Nav = props => {
  const { navBarTitle, fullWidth, siteInfo } = props
  const useSticky = !JSON.parse(siteConfig('NOBELIUM_AUTO_COLLAPSE_NAV_BAR', true))
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
    return () => {
      if (sentinalRef.current) obvserver.unobserve(sentinalRef.current)
    }
  }, [sentinalRef])
  return <>
        <div className="observer-element h-4 md:h-12" ref={sentinalRef}></div>
        <div
            className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60 ${!fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
                }`}
            id="sticky-nav"
            ref={navRef}
        >
            <div className="flex items-center">
                <Link href="/" aria-label={siteConfig('TITLE')}>

                    <div className="h-6 w-6">
                        {/* <SvgIcon/> */}
                        {siteConfig('NOBELIUM_NAV_NOTION_ICON', null, CONFIG)
                          ? <LazyImage src={siteInfo?.icon} width={24} height={24} alt={siteConfig('AUTHOR')} />
                          : <SvgIcon />}

                    </div>

                </Link>
                {navBarTitle
                  ? (
                        <p className="ml-2 font-medium text-gray-800 dark:text-gray-300 header-name">
                            {navBarTitle}
                        </p>
                    )
                  : (
                        <p className="ml-2 font-medium text-gray-800 dark:text-gray-300 header-name whitespace-nowrap">
                            {siteConfig('TITLE')}
                            {/* ,{' '}<span className="font-normal">{siteConfig('DESCRIPTION')}</span> */}
                        </p>
                    )}
            </div>
            <NavBar {...props} />
        </div>
    </>
}

const NavBar = props => {
  const { customMenu, customNav } = props
  const [isOpen, changeOpen] = useState(false)
  const toggleOpen = () => {
    changeOpen(!isOpen)
  }
  const collapseRef = useRef(null)

  const { locale } = useGlobal()
  let links = [
    { id: 2, name: locale.NAV.RSS, to: '/feed', show: siteConfig('ENABLE_RSS') && siteConfig('NOBELIUM_MENU_RSS', null, CONFIG), target: '_blank' },
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: siteConfig('NOBELIUM_MENU_SEARCH', null, CONFIG) },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: siteConfig('NOBELIUM_MENU_ARCHIVE', null, CONFIG) },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: siteConfig('NOBELIUM_MENU_CATEGORY', null, CONFIG) },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: siteConfig('NOBELIUM_MENU_TAG', null, CONFIG) }
  ]
  if (customNav) {
    links = links.concat(customNav)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
        <div className="flex-shrink-0 flex">
            <ul className="hidden md:flex flex-row">
                {links?.map((link, index) => <MenuItemDrop key={index} link={link} />)}
            </ul>
            <div className='md:hidden'>
                <Collapse collapseRef={collapseRef} isOpen={isOpen} type='vertical' className='fixed top-16 right-6'>
                    <div className='dark:border-black bg-white dark:bg-black rounded border p-2 text-sm'>
                        {links?.map((link, index) => <MenuItemCollapse key={index} link={link} onHeightChange={(param) => collapseRef.current?.updateCollapseHeight(param)}/>)}
                    </div>
                </Collapse>
            </div>

            {JSON.parse(siteConfig('NOBELIUM_MENU_RANDOM_POST', null, CONFIG)) && <RandomPostButton {...props} />}
            {JSON.parse(siteConfig('NOBELIUM_MENU_SEARCH_BUTTON', null, CONFIG)) && <SearchButton {...props}/>}
            <i onClick={toggleOpen} className='fas fa-bars cursor-pointer px-5 flex justify-center items-center md:hidden'></i>
        </div>
  )
}

export default Nav
