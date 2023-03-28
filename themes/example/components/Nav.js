import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import CONFIG_EXAMPLE from '../config_example'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export const Nav = (props) => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: CONFIG_EXAMPLE.MENU_SEARCH },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG_EXAMPLE.MENU_ARCHIVE },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_EXAMPLE.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_EXAMPLE.MENU_TAG }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  // 如果 开启自定义菜单，则不再使用 Page生成菜单。
  if (BLOG.CUSTOM_MENU) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
        <nav className="w-full bg-white md:pt-0 px-6 relative z-20 border-t border-b border-gray-light dark:border-hexo-black-gray dark:bg-black">
            <div className="container mx-auto max-w-4xl md:flex justify-between items-center text-sm md:text-md md:justify-start">
                <ul className="w-full text-center md:text-left flex flex-wrap justify-center items-stretch md:justify-start md:items-start">
                    {/* {links.map(link => <NormalMenuItem key={link?.id} link={link}/>)} */}
                    {links.map(link => <MenuItemDrop key={link?.id} link={link} />)}
                </ul>
                {/* <div className="w-full md:w-1/3 text-center md:text-right"> */}
                    {/* <!-- extra links --> */}
                {/* </div> */}
            </div>
        </nav>
  )
}
