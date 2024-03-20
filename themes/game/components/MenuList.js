import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useGameGlobal } from '..'
import CONFIG from '../config'
import DarkModeButton from './DarkModeButton'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 导航菜单
 */
export const MenuList = props => {
  const { setSideBarVisible } = useGameGlobal()
  const { customNav, customMenu } = props
  const { locale } = useGlobal()
  const defaultLinks = [
    {
      id: 1,
      icon: 'fas fa-home',
      name: locale.NAV.INDEX,
      to: '/' || '/',
      show: true
    },
    {
      id: 2,
      icon: 'fas fa-th',
      name: locale.COMMON.CATEGORY,
      to: '/category',
      show: siteConfig('GAME_MENU_CATEGORY', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      to: '/tag',
      show: siteConfig('GAME_MENU_TAG', null, CONFIG)
    }
  ]

  let links = [].concat(defaultLinks)
  if (customNav) {
    links = defaultLinks.concat(customNav)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  return (
    <ul>
      <li className='py-4 px-2 font-bold'>
        <button
          className='flex items-center gap-2'
          onClick={() => {
            setSideBarVisible(true)
          }}>
          <i className='fas fa-search' />
          <span>Search</span>
        </button>
        <button className='flex items-center gap-2'>
          {/* 切换深色模式 */}
          <DarkModeButton className='text-center py-4' />
        </button>
      </li>

      {links?.map(
        (link, index) =>
          link && link.show && <MenuItemDrop key={index} link={link} />
      )}
    </ul>
  )
}
