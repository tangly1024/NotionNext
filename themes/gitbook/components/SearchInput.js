import { useImperativeHandle, useRef, useState } from 'react'
import { useMediumGlobal } from '../LayoutBase'
let lock = false

const SearchInput = ({ currentSearch, cRef, className }) => {
  const searchInputRef = useRef()
  const { setFilterPosts, allNavPages } = useMediumGlobal()

  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })

  const handleSearch = () => {
    let keyword = searchInputRef.current.value
    const filterPosts = []
    if (keyword) {
      keyword = keyword.trim()
    } else {
      setFilterPosts(allNavPages)
    }
    for (const post of allNavPages) {
      const tagContent = post.tags && Array.isArray(post.tags) ? post.tags.join(' ') : ''
      const categoryContent = post.category && Array.isArray(post.category) ? post.category.join(' ') : ''
      const articleInfo = post.title + post.summary + tagContent + categoryContent
      let hit = articleInfo.toLowerCase().indexOf(keyword) > -1
      const indexContent = [post.summary]
      // console.log('全文搜索缓存', cacheKey, page != null)
      post.results = []
      let hitCount = 0
      for (const i in indexContent) {
        const c = indexContent[i]
        if (!c) {
          continue
        }
        const index = c.toLowerCase().indexOf(keyword.toLowerCase())
        if (index > -1) {
          hit = true
          hitCount += 1
          post.results.push(c)
        } else {
          if ((post.results.length - 1) / hitCount < 3 || i === 0) {
            post.results.push(c)
          }
        }
      }
      if (hit) {
        filterPosts.push(post)
      }
    }
    setFilterPosts(filterPosts)
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

  return <div className={'flex w-full bg-gray-100 ' + className}>
    <input
      ref={searchInputRef}
      type='text'
      className={'outline-none w-full text-sm pl-2 transition focus:shadow-lg font-light leading-10 text-black bg-gray-100 dark:bg-gray-900 dark:text-white'}
      onKeyUp={handleKeyUp}
      onCompositionStart={lockSearchInput}
      onCompositionUpdate={lockSearchInput}
      onCompositionEnd={unLockSearchInput}
      onChange={e => updateSearchKey(e.target.value)}
      defaultValue={currentSearch}
    />

    <div className='-ml-8 cursor-pointer float-right items-center justify-center py-2'
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
