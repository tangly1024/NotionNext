import Collapse from '@/components/Collapse'
import DarkModeButton from '@/components/DarkModeButton'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'
import RandomPostButton from './RandomPostButton'
import SearchButton from './SearchButton'
import { SvgIcon } from './SvgIcon'

const normalizeLinkHref = link => {
  if (!link) {
    return '/'
  }
  if (link.href) {
    return link.href
  }
  if (link.slug) {
    return link.slug.startsWith('/') ? link.slug : `/${link.slug}`
  }
  return '/'
}

const normalizeNavLink = link => {
  if (!link) {
    return null
  }

  return {
    ...link,
    name: link.name || link.title || '',
    href: normalizeLinkHref(link),
    show: link.show !== false,
    subMenus: Array.isArray(link.subMenus)
      ? link.subMenus.map(subLink => ({
          ...subLink,
          name: subLink?.name || subLink?.title || '',
          href: normalizeLinkHref(subLink),
          show: subLink?.show !== false
        }))
      : []
  }
}
/**
 * 顶部导航
 */
const Nav = props => {
  const { post, fullWidth, siteInfo } = props
  const router = useRouter()
  const autoCollapseNavBar = siteConfig(
    'NOBELIUM_AUTO_COLLAPSE_NAV_BAR',
    true,
    CONFIG
  )
  const isHomePage = router.pathname === '/'
  const description = siteConfig('DESCRIPTION') || siteConfig('BIO')
  const navLogo =
    siteConfig('NOBELIUM_NAV_NOTION_ICON') && siteInfo?.icon
      ? siteInfo.icon
      : siteConfig('AVATAR') || siteConfig('BLOG_FAVICON')

  const navRef = useRef(null)
  const sentinalRef = useRef([])
  const handler = ([entry]) => {
    if (navRef && navRef.current && autoCollapseNavBar) {
      if (!entry?.isIntersecting) {
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
  return (
    <>
      <div className='observer-element h-4 md:h-12' ref={sentinalRef}></div>
      <div
        className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60 ${
          !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
        } ${isHomePage ? 'homepage-nav' : ''}`}
        id='sticky-nav'
        ref={navRef}>
        <div className='flex items-center'>
          <SmartLink href='/' aria-label={siteConfig('TITLE')}>
            <div className='h-6 w-6'>
              {navLogo ? (
                <LazyImage
                  className='blog-logo'
                  priority
                  src={navLogo}
                  width={24}
                  height={24}
                  alt={siteConfig('AUTHOR')}
                />
              ) : (
                <SvgIcon />
              )}
            </div>
          </SmartLink>
          {post ? (
            <p className='ml-2 max-h-12 line-clamp-2 overflow-ellipsis font-medium text-gray-800 dark:text-gray-300 header-name'>
              {post?.title}
            </p>
          ) : (
            <p className='logo line-clamp-1 overflow-ellipsis ml-2 font-medium text-gray-800 dark:text-gray-300 header-name whitespace-nowrap'>
              {siteConfig('TITLE')}
              {isHomePage && description ? (
                <>
                  , <span className='font-normal'>{description}</span>
                </>
              ) : null}
            </p>
          )}
        </div>
        <NavBar {...props} />
      </div>
    </>
  )
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
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('NOBELIUM_MENU_SEARCH')
    },
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('NOBELIUM_MENU_ARCHIVE')
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('NOBELIUM_MENU_CATEGORY')
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('NOBELIUM_MENU_TAG')
    }
  ]
  const normalizedCustomNav = customNav?.map(normalizeNavLink).filter(Boolean)
  const normalizedCustomMenu = customMenu
    ?.map(normalizeNavLink)
    .filter(Boolean)

  if (normalizedCustomNav?.length) {
    links = links.concat(normalizedCustomNav)
  }

  // 如果开启自定义菜单，则优先读取Menu/SubMenu；为空时回退到Page菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = normalizedCustomMenu?.length ? normalizedCustomMenu : normalizedCustomNav
  }

  const hasMenuLinks = !!(links && links.length > 0)

  return (
    <div className='flex-shrink-0 flex'>
      {hasMenuLinks && (
        <ul className='hidden md:flex flex-row'>
          {links?.map((link, index) => (
            <MenuItemDrop key={index} link={link} />
          ))}
        </ul>
      )}
      {hasMenuLinks && (
        <div className='md:hidden'>
          <Collapse
            collapseRef={collapseRef}
            isOpen={isOpen}
            type='vertical'
            className='fixed top-16 right-6'>
            <div className='dark:border-black bg-white dark:bg-black rounded border p-2 text-sm'>
              {links?.map((link, index) => (
                <MenuItemCollapse
                  key={index}
                  link={link}
                  onHeightChange={param =>
                    collapseRef.current?.updateCollapseHeight(param)
                  }
                />
              ))}
            </div>
          </Collapse>
        </div>
      )}

      {siteConfig('ENABLE_RSS') && siteConfig('NOBELIUM_MENU_RSS') && (
        <SmartLink
          href='/rss.xml'
          target='_blank'
          aria-label={locale.NAV.RSS}
          title={locale.NAV.RSS}
          className='cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-full w-10 h-10 flex justify-center items-center duration-200 transition-all'>
          <i className='fa-solid fa-rss' />
        </SmartLink>
      )}

      {siteConfig('NOBELIUM_MENU_DARKMODE_BUTTON') && (
        <DarkModeButton className='text-center p-2.5 hover:bg-black hover:bg-opacity-10 rounded-full' />
      )}

      {siteConfig('NOBELIUM_MENU_RANDOM_POST') && (
        <RandomPostButton {...props} />
      )}
      {siteConfig('NOBELIUM_MENU_SEARCH_BUTTON') && <SearchButton {...props} />}
      {hasMenuLinks && (
        <i
          onClick={toggleOpen}
          className='fas fa-bars cursor-pointer px-5 flex justify-center items-center md:hidden'></i>
      )}
    </div>
  )
}

export default Nav
