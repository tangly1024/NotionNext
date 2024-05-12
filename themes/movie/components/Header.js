import Collapse from '@/components/Collapse'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useMovieGlobal } from '..'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'
import { MenuItemDrop } from './MenuItemDrop'

/**
 * 网站顶部
 * @returns
 */
export const Header = props => {
  const { collapseRef, searchModal } = useMovieGlobal()
  const router = useRouter()
  const { customNav, customMenu } = props
  const { locale } = useGlobal()
  const [isOpen, setIsOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
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
    // { icon: 'fas fa-folder', name: locale.COMMON.CATEGORY, href: '/category', show: siteConfig('MENU_CATEGORY', null, CONFIG) },
    // { icon: 'fas fa-tag', name: locale.COMMON.TAGS, href: '/tag', show: siteConfig('MENU_TAG', null, CONFIG) }
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

  // 展示搜索框
  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      setShowSearch(!showSearch)
    }
  }

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => {
        document.getElementById('search').focus()
      }, 100)
    }
  }, [showSearch])

  const onKeyUp = e => {
    if (e.keyCode === 13) {
      const search = document.getElementById('search').value
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

  const handleSearch = () => {
    const search = document.getElementById('search').value
    if (search) {
      router.push({ pathname: '/search/' + search })
    }
  }

  return (
    <>
      <header className='w-full px-8 relative z-20 flex lg:flex-row md:flex-col justify-between items-center'>
        <Link
          href='/'
          className='whitespace-nowrap py-6 text-2xl md:text-3xl font-bold text-gray-dark no-underline flex items-center'>
          {siteConfig('TITLE')}
        </Link>

        <div className='md:w-auto text-center flex'>
          {/* 右侧菜单 */}
          <>
            <nav
              id='nav-mobile'
              className='leading-8 justify-center w-full hidden md:flex'>
              {links?.map(
                (link, index) =>
                  link && link.show && <MenuItemDrop key={index} link={link} />
              )}
            </nav>

            <div
              onClick={toggleShowSearchInput}
              className='flex items-center cursor-pointer'>
              <i className='fas fa-search dark:text-white'></i>
            </div>
            <div
              className={`${showSearch ? 'top-16 visible opacity-100' : 'top-10 invisible opacity-0'} duration-200 transition-all max-w-md absolute  w-80 right-4 p-2 flex flex-col gap-2`}>
              <input
                autoFocus
                id='search'
                onClick={toggleShowSearchInput}
                onKeyUp={onKeyUp}
                className='float-left w-full outline-none h-full p-2 rounded text-black bg-gray-100'
                aria-label='Submit search'
                type='search'
                name='s'
                autoComplete='off'
                placeholder='Type then hit enter to search...'
              />
              <button
                onClick={handleSearch}
                className='w-full bg-[#383838] rounded py-2'>
                {locale.COMMON.SEARCH} 搜索
              </button>
            </div>

            {/* 移动端按钮 */}
            <div className='md:hidden'>
              <div onClick={toggleMenuOpen} className='w-8 cursor-pointer'>
                {isOpen ? (
                  <i className='fas fa-times' />
                ) : (
                  <i className='fas fa-bars' />
                )}
              </div>
            </div>
          </>
        </div>
      </header>

      <Collapse collapseRef={collapseRef} type='vertical' isOpen={isOpen}>
        {/* 移动端菜单 */}
        <menu
          id='nav-menu-mobile'
          className='block md:hidden my-auto justify-start'>
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
    </>
  )
}
