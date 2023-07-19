import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'

const SearchInput = (props) => {
  const { keyword, cRef } = props
  const [onLoading, setLoadingState] = useState(false)
  const { locale } = useGlobal()
  const router = useRouter()
  const searchInputRef = useRef()
  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })

  /**
   * 搜索
   */
  const handleSearch = () => {
    const key = searchInputRef.current.value
    if (key && key !== '') {
      setLoadingState(true)
      router.push({ pathname: '/search/' + key }).then(r => {
        setLoadingState(false)
      })
      // location.href = '/search/' + key
    } else {
      router.push({ pathname: '/' }).then(r => {
      })
    }
  }

  /**
   * 监听案件
   * @param {*} e
   */
  const handleKeyUp = (e) => {
    if (e.keyCode === 13) { // 回车
      handleSearch(searchInputRef.current.value)
    } else if (e.keyCode === 27) { // ESC
      cleanSearch()
    }
  }

  /**
   * 清理索索
   */
  const cleanSearch = () => {
    searchInputRef.current.value = ''
  }

  return <div className='flex w-full bg-gray-100'>
    <input
      ref={searchInputRef}
      type='text'
      placeholder={locale.SEARCH.ARTICLES}
      aria-label="Search"
      className={'outline-none w-full text-sm pl-2 transition focus:shadow-lg font-light leading-10 text-black bg-gray-100 dark:bg-gray-800 dark:text-white'}
      onKeyUp={handleKeyUp}
      defaultValue={keyword || ''}
    />

    <div className='-ml-8 cursor-pointer float-right items-center justify-center py-2'
      onClick={handleSearch}>
        <i className={`hover:text-black transform duration-200  text-gray-500 cursor-pointer fas ${onLoading ? 'fa-spinner animate-spin' : 'fa-search'}`} />
    </div>

    {(keyword && keyword.length &&
      <div className='-ml-12 cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-800 float-right items-center justify-center py-2'>
        <i className='hover:text-black transform duration-200 text-gray-400 cursor-pointer fas fa-times' onClick={cleanSearch} />
      </div>
      )}
  </div>
}

export default SearchInput
