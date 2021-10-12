import React, { useState } from 'react'
import { useLocale } from '@/lib/locale'
import Router, { useRouter } from 'next/router'

const SearchInput = ({ currentTag }) => {
  const locale = useLocale()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const handleSearch = () => {
    if (searchValue && searchValue !== '') {
      Router.push({ pathname: '/', query: { s: searchValue } }).then(r => {
        console.log(r)
      })
    } else {
      Router.push({ pathname: '/' }).then(r => {
        console.log(r)
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
      className={'pl-2 w-full transition duration-200 leading-10 border-gray-300 bg-white text-black dark:bg-gray-800 dark:text-white'}
      onKeyUp={handleKeyUp}
      onChange={e => setSearchValue(e.target.value)}
      defaultValue={router.query.s ?? ''}
    />
    <div className='py-3 px-5 bg-gray-50 flex border-l dark:border-gray-700 dark:bg-gray-500 justify-center align-middle cursor-pointer'
         onClick={handleSearch}>
      <i className='fa fa-search text-black absolute cursor-pointer' />
    </div>
  </div>
}

export default SearchInput
