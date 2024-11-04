import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { usePhotoGlobal } from '..'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'

/**
 * 三级菜单
 */
export default function MenuHierarchical(props) {
  const router = useRouter()
  const { customNav, customMenu } = props
  const { locale } = useGlobal()
  const [isOpen, setIsOpen] = useState(false)
  const { collapseRef } = usePhotoGlobal()

  const toggleMenuOpen = () => {
    setIsOpen(!isOpen)
  }
  let links = [
    {
      id: 1,
      icon: 'fa-solid fa-house',
      name: locale.NAV.INDEX,
      href: '/',
      show: siteConfig('MOVIE_MENU_INDEX', null, CONFIG)
    },
    {
      id: 2,
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('MOVIE_MENU_SEARCH', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('MOVIE_MENU_ARCHIVE', null, CONFIG)
    }
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

  return (
    <div className='absolute top-0'>
      {/* 菜单按钮 */}
      <div onClick={toggleMenuOpen} className='w-8 cursor-pointer'>
        {isOpen ? (
          <i className='fas fa-times' />
        ) : (
          <i className='fas fa-bars' />
        )}
      </div>
      <Collapse collapseRef={collapseRef} type='vertical' isOpen={isOpen}>
        {/* 移动端菜单 */}
        <menu id='nav-menu-mobile' className='my-auto justify-start'>
          {links?.map(
            (link, index) =>
              link &&
              link.show && (
                <MenuItemCollapse
                  onHeightChange={param =>
                    collapseRef.current?.updateCollapseHeight(param)
                  }
                  key={index}
                  link={link}
                />
              )
          )}
        </menu>
      </Collapse>
    </div>
  )
}
