import { useGlobal } from '@/lib/global'
import CONFIG_FUKA from '../config'
import BLOG from '@/blog.config'
import { MenuItemDrop } from './MenuItemDrop'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuList = (props) => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    { name: locale.NAV.INDEX, to: '/' || '/', show: true },
    { name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_FUKA.MENU_CATEGORY },
    { name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_FUKA.MENU_TAG },
    { name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG_FUKA.MENU_ARCHIVE },
    { name: locale.NAV.SEARCH, to: '/search', show: CONFIG_FUKA.MENU_SEARCH }
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
