import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { useState } from 'react'
import CONFIG_SIMPLE from '../config_simple'
import { DropMenu } from './DropMenu'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export const Nav = ({ customNav, customMenu }) => {
  const { locale } = useGlobal()
  const [showSearchInput, changeShowSearchInput] = useState(false)

  const toggleShowSearchInput = () => {
    changeShowSearchInput(!showSearchInput)
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
        <nav className="w-full bg-white md:pt-0 px-6 relative z-20 shadow-md border-t border-gray-100 dark:border-hexo-black-gray dark:bg-black">
            <div className="container mx-auto max-w-8xl md:flex justify-between items-center text-sm md:text-md md:justify-start">
                <div className="w-full h-12 text-center md:text-left flex flex-wrap justify-center items-stretch md:justify-start md:items-start space-x-4">
                    {showSearchInput && <input className='h-full px-4 w-full' aria-label="Submit search" type="search" name="s" autoComplete="off" placeholder="Type then hit enter to search..."/>}

                    {!showSearchInput && links?.map(link => {
                      if (link?.show) {
                        return <DropMenu key={link.id} link={link}/>
                      } else {
                        return null
                      }
                    })}
                </div>

                <div className="w-full md:w-1/3 text-center md:text-right hidden md:block">
                    {/* <!-- extra links --> */}
                    <i className="fa-solid fa-magnifying-glass cursor-pointer" onClick={toggleShowSearchInput}></i>
                </div>
            </div>
        </nav>
  )
}
