import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'

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

  const updateSearchKey = (val) => {
    setSearchKey(val)
  }

  return <div className='flex'>
    <input
      ref={searchInputRef}
      type='text'
      className={'w-full rounded-lg bg-white text-sm pl-2 transition focus:shadow-lg font-light leading-10 text-black bg-gray-100'}
      onKeyUp={handleKeyUp}
      onChange={e => updateSearchKey(e.target.value)}
      defaultValue={searchKey}
    />

    <div className='-ml-8 cursor-pointer dark:hover:bg-gray-800 float-right items-center justify-center py-2'
      onClick={() => { handleSearch(searchKey) }}>
        <FontAwesomeIcon spin={onLoading} icon={onLoading ? faSpinner : faSearch} className='hover:text-black transform duration-200 text-gray-500 cursor-pointer' />
    </div>

    {(searchKey && searchKey.length &&
      <div className='-ml-12 cursor-pointer dark:hover:bg-gray-800 float-right items-center justify-center py-2'>
        <FontAwesomeIcon icon={faTimes} className='hover:text-black transform duration-200 text-gray-400 cursor-pointer' onClick={cleanSearch} />
      </div>
      )}
  </div>
}

export default SearchInput
