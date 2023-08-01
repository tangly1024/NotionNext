import { useImperativeHandle, useRef, useState } from 'react'
import { deepClone } from '@/lib/utils'
import { useGitBookGlobal } from '@/themes/gitbook'
let lock = false

const SearchInput = ({ currentSearch, cRef, className }) => {
  const searchInputRef = useRef()
  const { setFilteredNavPages, allNavPages } = useGitBookGlobal()

  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })

  const handleSearch = () => {
    let keyword = searchInputRef.current.value
    if (keyword) {
      keyword = keyword.trim()
    } else {
      setFilteredNavPages(allNavPages)
    }
    const filterAllNavPages = deepClone(allNavPages)
    // for (const filterGroup of filterAllNavPages) {
    //   for (let i = filterGroup.items.length - 1; i >= 0; i--) {
    //     const post = filterGroup.items[i]
    //     const articleInfo = post.title + ''
    //     const hit = articleInfo.toLowerCase().indexOf(keyword.toLowerCase()) > -1
    //     if (!hit) {
    //       // 删除
    //       filterGroup.items.splice(i, 1)
    //     }
    //   }
    //   if (filterGroup.items && filterGroup.items.length > 0) {
    //     filterPosts.push(filterGroup)
    //   }
    // }
    for (let i = filterAllNavPages.length - 1; i >= 0; i--) {
      const post = filterAllNavPages[i]
      const articleInfo = post.title + ''
      const hit = articleInfo.toLowerCase().indexOf(keyword.toLowerCase()) > -1
      if (!hit) {
        // 删除
        filterAllNavPages.splice(i, 1)
      }
    }

    // 更新完
    setFilteredNavPages(filterAllNavPages)
  }

  /**
   * 回车键
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
   * 清理搜索
   */
  const cleanSearch = () => {
    searchInputRef.current.value = ''
    handleSearch()
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
  function lockSearchInput () {
    lock = true
  }

  function unLockSearchInput () {
    lock = false
  }

  return <div className={'flex w-full'}>
    <input
      ref={searchInputRef}
      type='text'
      className={`${className} outline-none w-full text-sm pl-2 transition focus:shadow-lg font-light leading-10 text-black bg-gray-100 dark:bg-gray-900 dark:text-white`}
      onKeyUp={handleKeyUp}
      onCompositionStart={lockSearchInput}
      onCompositionUpdate={lockSearchInput}
      onCompositionEnd={unLockSearchInput}
      onChange={e => updateSearchKey(e.target.value)}
      defaultValue={currentSearch}
    />

    <div className='flex -ml-8 cursor-pointer float-right items-center justify-center py-2'
      onClick={handleSearch}>
        <i className={'hover:text-black transform duration-200 text-gray-500  dark:hover:text-gray-300 cursor-pointer fas fa-search'} />
    </div>

    {(showClean &&
      <div className='-ml-12 cursor-pointer float-right items-center justify-center py-2'>
        <i className='fas fa-times hover:text-black transform duration-200 text-gray-400 cursor-pointer   dark:hover:text-gray-300' onClick={cleanSearch} />
      </div>
      )}
  </div>
}

export default SearchInput
