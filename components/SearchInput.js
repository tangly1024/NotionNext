import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useRef, useState } from 'react'

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

  return <div className='flex border dark:border-gray-600 w-full'>
    <input
      ref={searchInputRef}
      type='text'
      placeholder={currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`}
      className={'pl-2 w-full transition leading-10 border-gray-300 bg-white text-black dark:bg-gray-900 dark:text-white'}
      onKeyUp={handleKeyUp}
      onChange={e => updateSearchKey(e.target.value)}
      defaultValue={currentSearch}
    />
    { (searchKey && searchKey.length && <i className='fa fa-close text-gray-300 float-right p-4 cursor-pointer' onClick={ cleanSearch } />)}

    <div className='py-4 px-4 bg-gray-50 flex border-l dark:border-gray-700 dark:bg-gray-500 justify-center align-middle cursor-pointer'
         onClick={() => { handleSearch(searchKey) }}>
      <i className={`fa ${onLoading ? 'fa-spinner animate-spin' : 'fa-search'} text-black cursor-pointer`}/>
    </div>
  </div>
}

export default SearchInput
