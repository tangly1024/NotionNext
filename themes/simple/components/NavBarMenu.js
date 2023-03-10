import BLOG from '@/blog.config'
import Collapse from '@/components/Collapse'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG_SIMPLE from '../config_simple'
import { CollapseMenu } from './CollapseMenu'
import { DropMenu } from './DropMenu'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export const NavBarMenu = ({ customNav, customMenu }) => {
  const { locale } = useGlobal()
  const [isOpen, changeIsOpen] = useState(false)
  const toggleIsOpen = () => {
    changeIsOpen(!isOpen)
  }
  const closeMenu = (e) => {
    changeIsOpen(false)
  }
  const router = useRouter()
  useEffect(() => {
    router.events.on('routeChangeStart', closeMenu)
  })

  let links = [
    { icon: 'fas fa-search', name: locale.NAV.SEARCH, to: '/search', show: CONFIG_SIMPLE.MENU_SEARCH },
    { icon: 'fas fa-archive', name: locale.NAV.ARCHIVE, to: '/archive', show: CONFIG_SIMPLE.MENU_ARCHIVE },
    { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, to: '/category', show: CONFIG_SIMPLE.MENU_CATEGORY },
    { icon: 'fas fa-tag', name: locale.COMMON.TAGS, to: '/tag', show: CONFIG_SIMPLE.MENU_TAG }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  if (BLOG.CUSTOM_MENU) {
    links = customMenu
  }
  if (!links || links.length === 0) {
    return null
  }

  return (<>
        <div id='nav-menu-pc' className='hidden md:flex my-auto'>
            {links?.map(link => {
              if (link?.show) {
                return <DropMenu key={link.id} link={link} />
              } else {
                return null
              }
            })}
        </div>
        <div id='nav-menu-mobile' className='flex md:hidden my-auto justify-start'>
            <div onClick={toggleIsOpen} className='cursor-pointer hover:text-red-400 transition-all duration-200'>
                <i className='fa fa-bars mr-3' />
                <span>{!isOpen ? 'MENU' : 'CLOSE'}</span>
            </div>

            <Collapse className='absolute w-full top-12 left-0' isOpen={isOpen}>
                <div id='menu-wrap' className='bg-white dark:border-hexo-black-gray border'>
                {links?.map(link => {
                  if (link?.show) {
                    return <CollapseMenu key={link.id} link={link} />
                  } else {
                    return null
                  }
                })}
                </div>
            </Collapse>
        </div>
    </>

  )
}
