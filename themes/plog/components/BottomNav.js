import FullScreenButton from '@/components/FullScreenButton'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import InformationButton from './InformationButton'
import LogoBar from './LogoBar'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 桌面端底部导航
 * @param {*} props
 * @returns
 */
const BottomNav = props => {
  return (
    <>
      <div
        id='bottom-nav'
        className={
          'dark:bg-black dark:bg-opacity-50z-20 px-4 hidden glassmorphism md:fixed bottom-0 w-screen py-4 md:flex flex-row justify-between items-center'
        }>
        {/* 左侧logo文字栏 */}
        <LogoBar {...props} />
        {/* 右下角菜单栏 */}
        <MenuList {...props} />
      </div>
    </>
  )
}

/**
 * 菜单
 * @param {*} props
 * @returns
 */
const MenuList = props => {
  const { customMenu, customNav } = props

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
      <ul className='hidden md:flex flex-row'>
        {links?.map((link, index) => (
          <MenuItemDrop key={index} link={link} />
        ))}
        <li className='my-auto px-2'>
          <FullScreenButton />
        </li>
        <li className='my-auto px-2'>
          <InformationButton />
        </li>
      </ul>
    </div>
  )
}

export default BottomNav
