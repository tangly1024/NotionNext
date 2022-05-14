import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'

const SearchInput = ({ currentTag, currentSearch, cRef }) => {
  const [searchKey, setSearchKey] = useState(currentSearch || '')
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
  const handleSearch = (key) => {
    if (key && key !== '') {
      setLoadingState(true)
      router.push({ pathname: '/search', query: { s: key } }).then(r => {
        setLoadingState(false)
      })
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
    setSearchKey('')
  }

  let lock = false
  const updateSearchKey = (val) => {
    if (!lock) {
      setSearchKey(val)
    }
  }
  function lockSearchInput () {
    lock = true
  }

  function unLockSearchInput () {
    lock = false
  }
  return <div className='flex w-full bg-gray-100'>
    <input
      ref={searchInputRef}
      type='text'
      className={'w-full text-sm pl-2 transition focus:shadow-lg font-light leading-10 text-black bg-gray-100 dark:bg-gray-800 dark:text-white'}
      onKeyUp={handleKeyUp}
      onCompositionStart={lockSearchInput}
      onCompositionUpdate={lockSearchInput}
      onCompositionEnd={unLockSearchInput}
      onChange={e => updateSearchKey(e.target.value)}
      defaultValue={searchKey}
    />

    <div className='-ml-8 cursor-pointer float-right items-center justify-center py-2'
      onClick={() => { handleSearch(searchKey) }}>
        <i className={`hover:text-black transform duration-200  text-gray-500 cursor-pointer fas ${onLoading ? 'fa-spinner animate-spin' : 'fa-search'}`} />
    </div>

    {(searchKey && searchKey.length &&
      <div className='-ml-12 cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-800 float-right items-center justify-center py-2'>
        <i className='hover:text-black transform duration-200 text-gray-400 cursor-pointer fas fa-times' onClick={cleanSearch} />
      </div>
      )}
  </div>
}

export default SearchInput
