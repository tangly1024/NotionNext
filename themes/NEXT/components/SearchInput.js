import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useImperativeHandle, useRef, useState } from 'react'

let lock = false

const SearchInput = ({ currentTag, currentSearch, cRef }) => {
  const { locale } = useGlobal()
  // const [searchKey, setSearchKey] = useState(currentSearch || '')
  const [onLoading, setLoadingState] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef()
  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })
  const handleSearch = () => {
    const key = searchInputRef.current.value
    if (key && key !== '') {
      setLoadingState(true)
      // router.push({ pathname: '/search/' + key }).then(r => {
      //   setLoadingState(false)
      // })
      location.href = '/search/' + key
    } else {
      router.push({ pathname: '/' }).then(r => {
      })
    }
  }
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) { // 回车
      handleSearch(searchInputRef.current.value)
    } else if (e.keyCode === 27) { // ESC
      cleanSearch()
    }
  }
  const cleanSearch = () => {
    searchInputRef.current.value = ''
    setShowClean(false)
  }
  function lockSearchInput () {
    lock = true
  }

  function unLockSearchInput () {
    lock = false
  }
  const [showClean, setShowClean] = useState(false)
  const updateSearchKey = (val) => {
    if (lock) {
      return
    }
    searchInputRef.current.value = val
    if (val) {
      setShowClean(true)
    } else {
      setShowClean(false)
    }
  }

  return <div className='flex border dark:border-gray-600 w-full bg-gray-100 dark:bg-gray-900'>
    <input
      ref={searchInputRef}
      type='text'
      placeholder={currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`}
      className={'w-full text-sm pl-4 transition focus:shadow-lg font-light leading-10 border-gray-300 text-black bg-gray-100 dark:bg-gray-900 dark:text-white'}
      onKeyUp={handleKeyUp}
      onCompositionStart={lockSearchInput}
      onCompositionUpdate={lockSearchInput}
      onCompositionEnd={unLockSearchInput}
      onChange={e => updateSearchKey(e.target.value)}
      defaultValue={currentSearch}
    />
    {(showClean && <i className='fas fa-times text-gray-300 float-right m-3 cursor-pointer' onClick={cleanSearch} />)}

    <div className='p-3 bg-gray-50 flex border-l dark:border-gray-700 dark:hover:bg-gray-800 dark:bg-gray-600 justify-center items-center cursor-pointer'
      onClick={handleSearch}>
        <i className={`${onLoading ? 'fa-spinner animate-spin ' : 'fa-search'} fas hover:scale-125 hover:text-black transform duration-200 dark:text-gray-300 dark:hover:text-white text-gray-600 cursor-pointer`} />
    </div>
  </div>
}

export default SearchInput
