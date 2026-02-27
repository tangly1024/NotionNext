import Collapse from '@/components/Collapse'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRef, useState } from 'react'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'
import { SvgIcon } from './SvgIcon'

const Header = props => {
  const { fullWidth, siteInfo } = props

  const title = siteConfig('TITLE')

  return (
    <div className='md:hidden fixed top-0 w-full z-20'>
      <div
        id='sticky-nav'
        className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8  glassmorphism ${
          !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
        }`}>
        <SmartLink
          href='/'
          aria-label={siteConfig('title')}
          className='flex items-center'>
          <>
            <div className='h-6 w-6'>
              {/* <SvgIcon/> */}
              {siteConfig('NOBELIUM_NAV_NOTION_ICON', null, CONFIG) ? (
                <LazyImage
                  src={siteInfo?.icon}
                  width={24}
                  height={24}
                  alt={siteConfig('AUTHOR')}
                />
              ) : (
                <SvgIcon />
              )}
            </div>
            <p className='ml-2 font-medium text-gray-800 dark:text-gray-300 header-name'>
              {title}{' '}
              {/* ,{' '}<span className="font-normal">{siteConfig('HOME_BANNER_IMAGE')}</span> */}
            </p>
          </>
        </SmartLink>

        <NavBar {...props} />
      </div>
    </div>
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
      id: 2,
      name: locale.NAV.RSS,
      href: '/feed',
      show:
        siteConfig('ENABLE_RSS') &&
        siteConfig('NOBELIUM_MENU_RSS', null, CONFIG),
      target: '_blank'
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('NOBELIUM_MENU_SEARCH', null, CONFIG)
    },
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('NOBELIUM_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('NOBELIUM_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('NOBELIUM_MENU_TAG', null, CONFIG)
    }
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
    <div className='flex-shrink-0'>
      <ul className=' hidden md:flex flex-row'>
        {links?.map((link, index) => (
          <MenuItemDrop key={index} link={link} />
        ))}
      </ul>
      <div className='md:hidden'>
        <i
          onClick={toggleOpen}
          className='fas fa-bars cursor-pointer px-5 block md:hidden'></i>
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
    </div>
  )
}

export default Header
