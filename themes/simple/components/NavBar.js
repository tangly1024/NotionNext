import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG_SIMPLE from '../config_simple'
import { MenuList } from './MenuList'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export const NavBar = (props) => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()
  const [showSearchInput, changeShowSearchInput] = useState(false)
  const router = useRouter()

  const toggleShowSearchInput = () => {
    changeShowSearchInput(!showSearchInput)
  }

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      const search = document.getElementById('theme-simple-search').value
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

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

  return (
        <nav className="w-full bg-white md:pt-0  relative z-20 shadow border-t border-gray-100 dark:border-hexo-black-gray dark:bg-black">
            <div id="nav-bar-inner" className="h-12 mx-auto max-w-9/10 justify-between items-center text-sm md:text-md md:justify-start">
                {/* 左侧菜单 */}
                <div className="h-full w-full float-left text-center md:text-left flex flex-wrap items-stretch md:justify-start md:items-start space-x-4">
                    {showSearchInput && <input id="theme-simple-search" onKeyUp={onKeyUp} className='float-left w-full outline-none h-full px-4' aria-label="Submit search" type="search" name="s" autoComplete="off" placeholder="Type then hit enter to search..." />}
                    {!showSearchInput && (<MenuList {...props}/>)}
                </div>

                <div className="absolute right-12 h-full text-center px-2 flex items-center text-blue-400">
                    {/* <!-- extra links --> */}
                    <i className={showSearchInput ? 'fa-regular fa-circle-xmark' : 'fa-solid fa-magnifying-glass' + ' align-middle cursor-pointer'} onClick={toggleShowSearchInput}></i>
                </div>
            </div>
        </nav>
  )
}
