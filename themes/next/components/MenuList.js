import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'

export const MenuList = props => {
  const { postCount, customNav, customMenu } = props
  const { locale } = useGlobal()
  const archiveSlot = (
    <div className='bg-gray-300 dark:bg-gray-500 rounded-md text-gray-50 px-1 text-xs'>
      {postCount}
    </div>
  )

  const defaultLinks = [
    {
      id: 1,
      icon: 'fas fa-home',
      name: locale.NAV.INDEX,
      href: '/' || '/',
      show: true
    },
    {
      id: 2,
      icon: 'fas fa-th',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('NEXT_MENU_CATEGORY', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('NEXT_MENU_TAG', null, CONFIG)
    },
    {
      id: 4,
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      slot: archiveSlot,
      show: siteConfig('NEXT_MENU_ARCHIVE', null, CONFIG)
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

  if (!links || links.length === 0) {
    return null
  }

  return (
    <>
      {/* 大屏模式菜单 */}
      <menu
        id='nav'
        data-aos='fade-down'
        data-aos-duration='500'
        data-aos-delay='400'
        data-aos-once='true'
        data-aos-anchor-placement='top-bottom'
        className='hidden md:block leading-8 text-gray-500 dark:text-gray-400 '>
        {links.map(
          (link, index) =>
            link && link.show && <MenuItemDrop key={index} link={link} />
        )}
      </menu>

      {/* 移动端菜单 */}
      <menu
        id='nav-menu-mobile'
        className='block md:hidden my-auto justify-start bg-white'>
        {links?.map(
          (link, index) =>
            link &&
            link.show && (
              <MenuItemCollapse
                onHeightChange={props.onHeightChange}
                key={index}
                link={link}
              />
            )
        )}
      </menu>
    </>
  )
}
