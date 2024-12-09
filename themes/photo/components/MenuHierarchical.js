import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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
  const closeModal = () => {
    setIsOpen(false)
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

  const [title, setTitle] = useState(siteConfig('BIO'))

  useEffect(() => {
    const currentLink = links.find(link => link.href === router.pathname)
    if (currentLink) {
      setTitle(currentLink.name)
    }
    closeModal()
  }, [router])

  return (
    <div className='absolute top-0 mt-7 italic text-gray-700 dark:text-gray-200'>
      {/* 菜单按钮 */}
      <div
        onClick={toggleMenuOpen}
        className=' whitespace-nowrap cursor-pointer'>
        {title}
      </div>
      <Collapse
        className='z-50'
        collapseRef={collapseRef}
        type='vertical'
        isOpen={isOpen}>
        {/* 移动端菜单 */}
        <menu id='nav-menu-mobile' className='my-4 space-y-4 justify-start'>
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
      {/* 遮罩 */}
      {isOpen && (
        <div
          onClick={closeModal}
          className='-z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-glassmorphism'
        />
      )}
    </div>
  )
}
