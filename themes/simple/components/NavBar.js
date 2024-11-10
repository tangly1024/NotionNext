import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSimpleGlobal } from '..'
import { MenuList } from './MenuList'

export default function NavBar(props) {
  const [showSearchInput, setShowSearchInput] = useState(false)
  const router = useRouter()
  const { searchModal } = useSimpleGlobal()

  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      setShowSearchInput(!showSearchInput)
    }
  }

  const onKeyUp = (e) => {
    if (e.key === 'Enter') {
      const search = e.target.value.trim()
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

  return (
    <nav className="relative w-full border-y border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-9/10 flex h-12 items-center justify-between">
        <div className="flex flex-1 items-center justify-between">
          {showSearchInput ? (
            <input
              autoFocus
              id="simple-search"
              onKeyUp={onKeyUp}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
              aria-label="Submit search"
              type="search"
              name="s"
              autoComplete="off"
              placeholder="Type then hit enter to search..."
            />
          ) : (
            <MenuList {...props} />
          )}
          
          <button
            onClick={toggleShowSearchInput}
            className="ml-2 rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label={showSearchInput ? "Close search" : "Open search"}
          >
            <i
              className={`${
                showSearchInput ? 'fa-regular fa-circle-xmark' : 'fa-solid fa-magnifying-glass'
              } text-lg`}
            ></i>
          </button>
        </div>
      </div>
    </nav>
  )
}