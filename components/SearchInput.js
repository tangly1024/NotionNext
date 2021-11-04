import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useState } from 'react'

const SearchInput = ({ currentTag, currentSearch }) => {
  const { locale } = useGlobal()
  const [searchKey, setSearchKey] = useState(currentSearch)
  const router = useRouter()
  const handleSearch = () => {
    if (searchKey && searchKey !== '') {
      router.push({ pathname: '/search', query: { s: searchKey } }).then(r => {
      })
    } else {
      router.push({ pathname: '/' }).then(r => {
      })
    }
  }
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSearch()
    }
  }

  return <div className='flex border dark:border-gray-600 w-full'>
    <input
      type='text'
      placeholder={currentTag ? `${locale.SEARCH.TAGS} #${currentTag}` : `${locale.SEARCH.ARTICLES}`}
      className={'pl-2 w-full transition duration-200 leading-10 border-gray-300 bg-white text-black dark:bg-gray-900 dark:text-white'}
      onKeyUp={handleKeyUp}
      onChange={e => setSearchKey(e.target.value)}
      defaultValue={currentSearch}
    />
    <div className='py-3 px-5 bg-gray-50 flex border-l dark:border-gray-700 dark:bg-gray-500 justify-center align-middle cursor-pointer'
         onClick={handleSearch}>
      <i className='fa fa-search text-black absolute cursor-pointer' />
    </div>
  </div>
}

export default SearchInput
