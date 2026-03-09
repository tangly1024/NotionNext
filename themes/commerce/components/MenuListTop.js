import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemDrop } from './MenuItemDrop'

export const MenuListTop = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    {
      id: 1,
      icon: 'fa-solid fa-house',
      name: locale.NAV.INDEX,
      href: '/',
      show: CONFIG.MENU_INDEX
    },
    {
      id: 2,
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: CONFIG.MENU_SEARCH
    },
    {
      id: 3,
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: CONFIG.MENU_ARCHIVE
    }
    // { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, href: '/category', show: CONFIG.MENU_CATEGORY },
    // { icon: 'fas fa-tag', name: locale.COMMON.TAGS, href: '/tag', show: CONFIG.MENU_TAG }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  for (let i = 0; i < links.length; i++) {
    if (links[i].id !== i) {
      links[i].id = i
    }
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <>
      <nav
        id='nav-mobile'
        className='leading-8 justify-center font-light w-full flex'>
        {links?.map(
          link =>
            link && link.show && <MenuItemDrop key={link?.id} link={link} />
        )}
      </nav>
    </>
  )
}
