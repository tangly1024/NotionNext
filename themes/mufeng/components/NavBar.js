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
    <nav className='w-full bg-white relative z-20 shadow-sm border-b border-gray-100 dark:border-gray-800 dark:bg-black'>
      <div
        id='nav-bar-inner'
        className='h-10 mx-auto max-w-5xl flex justify-between items-center'>
        {/* 左侧菜单 */}
        <div className='h-full flex-grow flex items-center'>
          {showSearchInput ? (
            <input
              autoFocus
              id='simple-search'
              onKeyUp={onKeyUp}
              className='w-full outline-none h-full px-4'
              aria-label='Submit search'
              type='search'
              name='s'
              autoComplete='off'
              placeholder='Type then hit enter to search...'
            />
          ) : (
            <MenuList {...props} />
          )}
        </div>

        <div className='flex items-center px-4 h-full cursor-pointer text-blue-400'>
          <i
            className={
              showSearchInput
                ? 'fa-regular fa-circle-xmark'
                : 'fa-solid fa-magnifying-glass'
            }
            onClick={toggleShowSearchInput}></i>
        </div>
      </div>
    </nav>
  )
}
