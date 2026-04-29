import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSimpleGlobal } from '..'
import { MenuList } from './MenuList'

/**
 * 菜单导航
 * @param {*} props
 * @returns
 */
export default function NavBar(props) {
  const [showSearchInput, changeShowSearchInput] = useState(false)
  const router = useRouter()
  const { searchModal } = useSimpleGlobal()

  // 展示搜索框
  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      changeShowSearchInput(!showSearchInput)
    }
  }

  const onKeyUp = e => {
    if (e.keyCode === 13) {
      const search = document.getElementById('simple-search').value
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

  return (
    <nav className='w-full bg-white md:pt-0 relative z-20 shadow border-t border-gray-100 dark:border-hexo-black-gray dark:bg-black'>
      <div
        id='nav-bar-inner'
        className='h-12 mx-auto flex max-w-[1140px] items-center justify-between px-6 text-sm md:text-md xl:px-0'>
        {/* 左侧菜单 */}
        <div className='h-full min-w-0 flex-1 text-center md:text-left flex flex-wrap items-stretch md:justify-start md:items-start space-x-4'>
          {showSearchInput && (
            <input
              autoFocus
              id='simple-search'
              onKeyUp={onKeyUp}
              className='w-full outline-none h-full bg-transparent pr-4'
              aria-label='Submit search'
              type='search'
              name='s'
              autoComplete='off'
              placeholder='Type then hit enter to search...'
            />
          )}
          {!showSearchInput && <MenuList {...props} />}
        </div>

        <div className='h-full shrink-0 text-center pl-4 flex items-center text-blue-400 cursor-pointer'>
          {/* <!-- extra links --> */}
          <i
            className={
              showSearchInput
                ? 'fa-regular fa-circle-xmark'
                : 'fa-solid fa-magnifying-glass' + ' align-middle'
            }
            onClick={toggleShowSearchInput}></i>
        </div>
      </div>
    </nav>
  )
}
