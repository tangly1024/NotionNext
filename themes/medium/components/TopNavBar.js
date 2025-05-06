import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRef, useState } from 'react'
import CONFIG from '../config'
import LogoBar from './LogoBar'
import { MenuBarMobile } from './MenuBarMobile'
import { MenuItemDrop } from './MenuItemDrop'

import { useRouter } from 'next/router' // 加这一行

/**
 * 顶部导航栏 + 菜单
 * @param {} param0
 * @returns
 */
export default function TopNavBar(props) {
  const { className, customNav, customMenu } = props
const router = useRouter()
const isACategoryPage = router.asPath.startsWith('/category/Neurodivergent') // A是你想隐藏导航栏的分类slug

  
  const [isOpen, changeShow] = useState(false)
  const collapseRef = useRef(null)

  const { locale } = useGlobal()

  const defaultLinks = [
    {
      icon: 'fas fa-th',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('MEDIUM_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('MEDIUM_MENU_TAG', null, CONFIG)
    },
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('MEDIUM_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('MEDIUM_MENU_SEARCH', null, CONFIG)
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

  if (!links || links.length === 0) {
    return null
  }

 return (
  <>
    <div
      id='top-nav'
      className={'sticky top-0 lg:relative w-full z-40 ' + className}>
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
      <div className='flex w-full h-20 border-b bg-white dark:bg-hexo-black-gray px-4 items-between'>
        {/* 左侧图标Logo */}
        <LogoBar {...props} />

        {/* 折叠按钮、仅移动端显示 */}
        <div className='mr-0 flex md:hidden justify-end items-center text-sm space-x-4 font-serif dark:text-gray-200'>
          <div onClick={toggleMenuOpen} className='cursor-pointer'>
            {isOpen ? (
           <svg
           xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 24 24"
           fill="currentColor"
           className="w-5 h-5 text-gray-800 dark:text-gray-200">
           <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z" />
         </svg>
         ) : (
          <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-gray-800 dark:text-gray-200"
        >
          <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z" />
        </svg>
            )}
          </div>
        </div>

        {/* 桌面端顶部菜单 */}
        {!isACategoryPage && ( // ✅ 只判断右侧菜单，不影响上面LogoBar
          <div className='hidden md:flex'>
            {links &&
              links?.map((link, index) => (
                <MenuItemDrop key={index} link={link} />
              ))}
          </div>
        )}
      </div>
    </div>
  </>
)
}
