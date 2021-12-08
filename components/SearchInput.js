import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'

const SearchInput = ({ currentTag, currentSearch }) => {
  const { locale } = useGlobal()
  const [searchKey, setSearchKey] = useState(currentSearch)
  const [onLoading, setLoadingState] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef()
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

  return <div className='flex border dark:border-gray-600 w-full bg-gray-100 dark:bg-gray-900'>
    <input
      ref={searchInputRef}
      type='text'
      placeholder={currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`}
      className={'w-full pl-2 transition leading-10 border-gray-300 text-black bg-gray-100 dark:bg-gray-900 dark:text-white'}
      onKeyUp={handleKeyUp}
      onChange={e => updateSearchKey(e.target.value)}
      defaultValue={currentSearch}
    />
    {(searchKey && searchKey.length && <FontAwesomeIcon icon={faTimes} className='text-gray-300 float-right m-3 cursor-pointer' onClick={cleanSearch} />)}

    <div className='p-3 text-xl bg-gray-50 flex border-l dark:border-gray-700 dark:hover:bg-gray-800 dark:bg-gray-600 justify-center align-middle cursor-pointer'
      onClick={() => { handleSearch(searchKey) }}>
        <FontAwesomeIcon spin={onLoading} icon={onLoading ? faSpinner : faSearch} className='hover:scale-125 hover:text-black transform duration-200 dark:text-gray-300 dark:hover:text-white text-gray-600 cursor-pointer ' />
    </div>
  </div>
}

export default SearchInput
