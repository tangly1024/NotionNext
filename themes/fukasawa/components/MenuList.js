import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'
/**
 * 菜单列表
 * @param {*} props
 * @returns
 */
export const MenuList = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    { name: locale.NAV.INDEX, href: '/' || '/', show: true },
    {
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('FUKASAWA_MENU_CATEGORY', null, CONFIG)
    },
    {
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('FUKASAWA_MENU_TAG', null, CONFIG)
    },
    {
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('FUKASAWA_MENU_ARCHIVE', null, CONFIG)
    },
    {
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('FUKASAWA_MENU_SEARCH', null, CONFIG)
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
    <>
      <menu id='nav-pc' className='hidden md:block  text-sm z-10'>
        {links?.map((link, index) => (
          <MenuItemDrop key={index} link={link} />
        ))}
      </menu>
      <menu id='nav-mobile' className='block md:hidden  text-sm z-10 pb-1'>
        {links?.map((link, index) => (
          <MenuItemCollapse
            key={index}
            link={link}
            onHeightChange={props.onHeightChange}
          />
        ))}
      </menu>
    </>
  )
}
