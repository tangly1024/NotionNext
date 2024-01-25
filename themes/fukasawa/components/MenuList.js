import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { MenuItemDrop } from './MenuItemDrop'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuList = (props) => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    { name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { name: locale.COMMON.CATEGORY, to: '/category', show: siteConfig('FUKASAWA_MENU_CATEGORY', null, CONFIG) },
    { name: locale.COMMON.TAGS, to: '/tag', show: siteConfig('FUKASAWA_MENU_TAG', null, CONFIG) },
    { name: locale.NAV.ARCHIVE, to: '/archive', show: siteConfig('FUKASAWA_MENU_ARCHIVE', null, CONFIG) },
    { name: locale.NAV.SEARCH, to: '/search', show: siteConfig('FUKASAWA_MENU_SEARCH', null, CONFIG) }
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

  return (<>
        <menu id='nav-pc' className='hidden md:block font-sans text-sm z-10'>
            {links?.map((link, index) => <MenuItemDrop key={index} link={link} />)}
        </menu>
        <menu id='nav-mobile' className='block md:hidden font-sans text-sm z-10 pb-1'>
            {links?.map((link, index) => <MenuItemCollapse key={index} link={link} onHeightChange={props.onHeightChange}/>)}
        </menu>
    </>

  )
}
