import Collapse from '@/components/Collapse'
import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRef, useState } from 'react'
import CONFIG from '../config'
import LogoBar from './LogoBar'
import { MenuBarMobile } from './MenuBarMobile'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 页头：顶部导航栏 + 菜单
 * @param {} param0
 * @returns
 */
export default function Header(props) {
  const { className, customNav, customMenu } = props
  const [isOpen, changeShow] = useState(false)
  const collapseRef = useRef(null)

  const { locale } = useGlobal()

  const defaultLinks = [
    {
      icon: 'fas fa-th',
      name: locale.COMMON.CATEGORY,
      to: '/category',
      show: siteConfig('GITBOOK_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      to: '/tag',
      show: siteConfig('GITBOOK_BOOK_MENU_TAG', null, CONFIG)
    },
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      to: '/archive',
      show: siteConfig('GITBOOK_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      to: '/search',
      show: siteConfig('GITBOOK_MENU_SEARCH', null, CONFIG)
    }
  ]

  let links = defaultLinks.concat(customNav)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  // 如果 开启自定义菜单，则覆盖Page生成的菜单
  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  return (
    <div id='top-nav' className={'fixed top-0 w-full z-20 ' + className}>
      {/* 移动端折叠菜单 */}
      <Collapse
        type='vertical'
        collapseRef={collapseRef}
        isOpen={isOpen}
        className='md:hidden'>
        <div className='bg-white dark:bg-hexo-black-gray pt-1 py-2 lg:hidden '>
          <MenuBarMobile
            {...props}
            onHeightChange={param =>
              collapseRef.current?.updateCollapseHeight(param)
            }
          />
        </div>
      </Collapse>

      {/* 导航栏菜单 */}
      <div className='flex w-full h-14 shadow glassmorphism bg-white dark:bg-hexo-black-gray px-7 items-between'>
        {/* 左侧图标Logo */}
        <LogoBar {...props} />

        {/* 折叠按钮、仅移动端显示 */}
        <div className='mr-1 flex md:hidden justify-end items-center space-x-4  dark:text-gray-200'>
          <DarkModeButton className='flex text-md items-center h-full' />
          <div
            onClick={toggleMenuOpen}
            className='cursor-pointer text-lg hover:scale-110 duration-150'>
            {isOpen ? (
              <i className='fas fa-times' />
            ) : (
              <i className='fa-solid fa-ellipsis-vertical' />
            )}
          </div>
        </div>

        {/* 桌面端顶部菜单 */}
        <div className='hidden md:flex'>
          {links &&
            links?.map((link, index) => (
              <MenuItemDrop key={index} link={link} />
            ))}
          <DarkModeButton className='text-sm flex items-center h-full' />
        </div>
      </div>
    </div>
  )
}
