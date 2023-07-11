import Link from 'next/link'
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { SvgIcon } from './SvgIcon'
import { MenuItemDrop } from './MenuItemDrop'
import FullScreenButton from '@/components/FullScreenButton'

/**
 * 桌面端底部导航
 * @param {*} props
 * @returns
 */
const BottomNav = props => {
  const { navBarTitle, siteInfo } = props

  return <>
        <div id="bottom-nav" style={{ backgroundColor: '#00000063' }} className={'px-4 hidden glassmorphism md:fixed bottom-0 w-screen py-4 md:flex flex-row justify-between items-center'}>
            <div className="flex items-center">
                <Link href="/" aria-label={BLOG.title}>
                    <div className="h-6 w-6">
                        {/* <SvgIcon/> */}
                        {CONFIG.NAV_NOTION_ICON
                        /* eslint-disable-next-line @next/next/no-img-element */
                          ? <img src={siteInfo?.icon} className='rounded-full' width={24} height={24} alt={BLOG.AUTHOR} />
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
                        <p className="ml-2 font-medium text-gray-800 dark:text-gray-300 header-name">
                            {siteInfo?.title}
                            {' '}<span className="font-normal text-sm text-gray-00 dark:text-gray-400">{siteInfo?.description}</span>
                        </p>
                    )}
            </div>
            <MenuList {...props} />
        </div>
    </>
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
    { id: 2, name: locale.NAV.RSS, to: '/feed', show: BLOG.ENABLE_RSS && CONFIG.MENU_RSS, target: '_blank' },
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: CONFIG.MENU_SEARCH },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG.MENU_ARCHIVE },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG.MENU_TAG }
  ]
  if (customNav) {
    links = links.concat(customNav)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (BLOG.CUSTOM_MENU) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
        <div className="flex-shrink-0">
            <ul className="hidden md:flex flex-row">
                {links?.map(link => <MenuItemDrop key={link?.id} link={link} />)}
                <li className='my-auto px-2'>
                    <FullScreenButton/>
                </li>
            </ul>
        </div>
  )
}

export default BottomNav
