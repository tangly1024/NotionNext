import replaceSearchResult from '@/components/Mark'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import algoliasearch from 'algoliasearch'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import {
  Fragment,
  useCallback,
  useMemo,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const ShortCutActions = [
  {
    key: '↑ ↓',
    action: '选择'
  },
  {
    key: 'Enter',
    action: '跳转'
  },
  {
    key: 'Esc',
    action: '关闭'
  }
]

/**
 * 结合 Algolia 实现的弹出式搜索框
 * 打开方式 cRef.current.openSearch()
 * https://www.algolia.com/doc/api-reference/search-api-parameters/
 */
export default function AlgoliaSearchModal({ cRef }) {
  const [searchResults, setSearchResults] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState(null)
  const [totalPage, setTotalPage] = useState(0)
  const [totalHit, setTotalHit] = useState(0)
  const [useTime, setUseTime] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const [searchError, setSearchError] = useState('')
  const searchTimer = useRef(null)
  const highlightTimer = useRef(null)
  const requestVersion = useRef(0)
  const invalidateSearch = useCallback(() => {
    requestVersion.current++
    clearTimeout(searchTimer.current)
    clearTimeout(highlightTimer.current)
  }, [])
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  const returnFocusRef = useRef(null)
  const restoringFocus = useRef(false)
  const titleId = useId()
  const router = useRouter()
  const appId = siteConfig('ALGOLIA_APP_ID')
  const searchKey = siteConfig('ALGOLIA_SEARCH_ONLY_APP_KEY')
  const indexName = siteConfig('ALGOLIA_INDEX')
  const index = useMemo(() => appId && searchKey && indexName
    ? algoliasearch(appId, searchKey).initIndex(indexName) : null,
  [appId, searchKey, indexName])
  const hasSearchIndex = Boolean(index)

  const closeModal = useCallback(() => {
    invalidateSearch()
    setIsModalOpen(false)
  }, [invalidateSearch])

  function openSearch() {
    if (!appId || restoringFocus.current) return
    if (!searchKey || !indexName) {
      void router.push('/search')
      return
    }
    if (isModalOpen) return
    returnFocusRef.current = document.activeElement
    setIsModalOpen(true)
  }

  /**
   * 快捷键设置
   */
  useHotkeys(
    'ctrl+k',
    e => {
      e.preventDefault()
      openSearch()
    },
    { enabled: Boolean(appId) }
  )
  // 修改快捷键的使用逻辑
  useHotkeys(
    'down',
    e => {
      if (isModalOpen && isInputFocused) {
        // 只有在聚焦时才触发
        e.preventDefault()
        if (activeIndex < searchResults.length - 1) {
          setActiveIndex(activeIndex + 1)
        }
      }
    },
    { enableOnFormTags: true }
  )
  useHotkeys(
    'up',
    e => {
      if (isModalOpen && isInputFocused) {
        e.preventDefault()
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1)
        }
      }
    },
    { enableOnFormTags: true }
  )
  useHotkeys(
    'enter',
    e => {
      if (isModalOpen && isInputFocused && searchResults.length > 0) {
        onJumpSearchResult()
      }
    },
    { enableOnFormTags: true }
  )
  // 跳转Search结果
  const onJumpSearchResult = (targetIndex) => {
    const i = targetIndex !== undefined ? targetIndex : activeIndex
    if (searchResults.length > 0 && searchResults[i]) {
      const searchResult = searchResults[i]
      window.location.href = `${siteConfig('SUB_PATH', '')}/${searchResult.slug || searchResult.objectID}`
    }
  }

  const resetSearch = useCallback(() => {
    invalidateSearch()
    setIsLoading(false)
    setSearchError('')
    setActiveIndex(0)
    setKeyword('')
    setSearchResults([])
    setUseTime(0)
    setTotalPage(0)
    setTotalHit(0)
    if (inputRef.current) inputRef.current.value = ''
  }, [invalidateSearch])

  /**
   * 页面路径变化后，自动关闭此modal
   */
  useEffect(() => {
    setIsModalOpen(false)
  }, [router.asPath])

  /**
   * 管理整个弹窗的键盘操作与焦点，关闭或卸载时还原到打开入口。
   */
  useEffect(() => {
    if (!isModalOpen || !hasSearchIndex) {
      if (!hasSearchIndex) setIsModalOpen(false)
      resetSearch()
      return
    }
    const dialog = dialogRef.current
    const focusInput = () => (inputRef.current || dialog)?.focus()
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeModal()
        return
      }
      if (event.key !== 'Tab') return
      // Re-read after results, retries and pagination change the available controls.
      const focusable = Array.from(dialog.querySelectorAll(
        'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )).filter(element => element.tabIndex >= 0 && !element.closest('[hidden], [inert], [aria-hidden="true"]'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const outside = !dialog.contains(document.activeElement)
      if (!first) {
        event.preventDefault()
        dialog.focus()
      } else if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
        event.preventDefault()
        first.focus()
      }
    }
    const keepFocusInside = event => {
      if (!dialog.contains(event.target)) focusInput()
    }
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('focusin', keepFocusInside)
    focusInput()
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('focusin', keepFocusInside)
      const target = returnFocusRef.current
      returnFocusRef.current = null
      if (target?.isConnected) {
        // GitBook opens search on focus; returning focus must not reopen it.
        restoringFocus.current = true
        try {
          target.focus({ preventScroll: true })
        } finally {
          restoringFocus.current = false
        }
      }
    }
  }, [isModalOpen, hasSearchIndex, closeModal, resetSearch])

  /**
   * 对外暴露方法
   **/
  useImperativeHandle(cRef, () => {
    return {
      openSearch
    }
  })

  useEffect(() => invalidateSearch, [invalidateSearch, index])

  const handleSearch = async (query, page = 0) => {
    invalidateSearch()
    const version = requestVersion.current
    setKeyword(query)
    setPage(page)
    setSearchResults([])
    setSearchError('')
    setUseTime(0)
    setTotalPage(0)
    setTotalHit(0)
    setActiveIndex(0)
    setIsLoading(Boolean(query && index))
    if (!query || !index) return
    try {
      const { hits, nbHits, nbPages, processingTimeMS } = await index.search(query, { page, hitsPerPage: 10 })
      if (version !== requestVersion.current) return
      setUseTime(processingTimeMS)
      setTotalPage(nbPages)
      setTotalHit(nbHits)
      setSearchResults(hits)
      highlightTimer.current = setTimeout(() => {
        if (version !== requestVersion.current) return
        const doms = document.getElementById('search-wrapper')?.getElementsByClassName('replace')
        if (doms) replaceSearchResult({ doms, search: query, target: { element: 'span', className: 'font-bold border-b border-dashed' } })
      }, 0)
    } catch {
      if (version === requestVersion.current) setSearchError('搜索暂时不可用，请重试。')
    } finally {
      if (version === requestVersion.current) setIsLoading(false)
    }
  }

  const handleInputChange = event => {
    const query = event.target.value
    invalidateSearch() // Invalidate immediately, including the debounce window.
    setKeyword(query)
    setSearchResults([])
    setSearchError('')
    setIsLoading(Boolean(query))
    if (!query) {
      resetSearch()
      return
    }
    searchTimer.current = setTimeout(() => { void handleSearch(query) }, 600)
  }

  const switchPage = page => handleSearch(keyword, page)

  if (!index) {
    return <></>
  }
  return (
    <div
      id='search-wrapper'
      aria-hidden={!isModalOpen}
      inert={isModalOpen ? undefined : ''}
      className={`${
        isModalOpen ? 'opacity-100' : 'invisible opacity-0 pointer-events-none'
      } z-30 fixed h-screen w-screen left-0 top-0 sm:mt-[10vh] flex items-start justify-center mt-0`}>
      {/* 模态框 */}
      <div
        ref={dialogRef}
        role='dialog'
        aria-modal={isModalOpen ? true : undefined}
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`${
          isModalOpen ? 'opacity-100' : 'invisible opacity-0 translate-y-10'
        } max-h-[80vh] flex flex-col justify-between w-full min-h-[10rem] h-full md:h-fit max-w-xl dark:bg-hexo-black-gray dark:border-gray-800 bg-white dark:bg- p-5 rounded-lg z-50 shadow border hover:border-blue-600 duration-300 transition-all `}>
        <div className='flex justify-between items-center'>
          <div id={titleId} className='text-2xl text-blue-600 dark:text-yellow-600 font-bold'>
            搜索
          </div>
          <div>
            <button type='button' aria-label='关闭搜索'
              className='text-gray-600 fa-solid fa-xmark p-1 cursor-pointer hover:text-blue-600'
              onClick={closeModal} />
          </div>
        </div>

        <input
          type='text'
          aria-label='搜索关键词'
          placeholder='在这里输入搜索关键词...'
          onChange={e => handleInputChange(e)}
          onFocus={() => setIsInputFocused(true)} // 聚焦时
          onBlur={() => setIsInputFocused(false)} // 失去焦点时
          className='text-black dark:text-gray-200 bg-gray-50 dark:bg-gray-600 outline-blue-500 w-full px-4 my-2 py-1 mb-4 border rounded-md'
          ref={inputRef}
        />

        {/* 标签组 */}
        <div className='mb-4'>
          <TagGroups />
        </div>
        {isLoading && <p role='status' className='text-center text-gray-500'>正在搜索…</p>}
        {searchError && <p role='alert' className='text-center text-red-600'>{searchError} <button type='button' className='underline' onClick={() => { void handleSearch(keyword, page) }}>重试</button></p>}
        {searchResults.length === 0 && keyword && !isLoading && !searchError && (
          <div>
            <p className=' text-slate-600 text-center my-4 text-base'>
              {' '}
              无法找到相关结果
              <span className='font-semibold'>&quot;{keyword}&quot;</span>
            </p>
          </div>
        )}
        <ul className='flex-1 overflow-auto'>
          {searchResults.map((result, index) => (
            <li
              key={result.objectID}
              onMouseEnter={() => setActiveIndex(index)}
              className={`cursor-pointer replace my-2 duration-100
              rounded-lg
              ${activeIndex === index ? 'bg-blue-600 dark:bg-yellow-600' : ''}`}>
              <a
                href={`${siteConfig('SUB_PATH', '')}/${result.slug || result.objectID}`}
                className={`block p-2 ${activeIndex === index ? ' text-white' : ' text-black dark:text-gray-300 '}`}>
                {result.title}
              </a>
            </li>
          ))}
        </ul>
        <Pagination totalPage={totalPage} page={page} switchPage={switchPage} />
        <div className='flex items-center justify-between mt-2 sm:text-sm text-xs dark:text-gray-300'>
          {totalHit === 0 && (
            <div className='flex items-center'>
              {ShortCutActions.map((action, index) => {
                return (
                  <Fragment key={index}>
                    <div className='border-gray-300 dark:text-gray-300 text-gray-600 px-2 rounded border inline-block'>
                      {action.key}
                    </div>
                    <span className='ml-2 mr-4  text-gray-600 dark:text-gray-300'>
                      {action.action}
                    </span>
                  </Fragment>
                )
              })}
            </div>
          )}
          <div>
            {totalHit > 0 && (
              <p>
                共搜索到 {totalHit} 条结果，用时 {useTime} 毫秒
              </p>
            )}
          </div>
          <div className='text-gray-600 dark:text-gray-300  text-right'>
            <span>
              <i className='fa-brands fa-algolia'></i> Algolia 提供搜索服务
            </span>
          </div>
        </div>
      </div>

      {/* 遮罩 */}
      <div
        onClick={closeModal}
        className='z-30 fixed top-0 left-0 w-full h-full flex items-center justify-center glassmorphism'
      />
    </div>
  )
}

/**
 * 标签组
 */
function TagGroups() {
  const { tagOptions } = useGlobal()
  //  获取tagOptions数组前十个
  const firstTenTags = tagOptions?.slice(0, 10)

  return (
    <div id='tags-group' className='dark:border-gray-700 space-y-2'>
      {firstTenTags?.map((tag, index) => {
        return (
          <SmartLink
            passHref
            key={index}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={'cursor-pointer inline-block whitespace-nowrap'}>
            <div
              className={
                'flex items-center text-black dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-yellow-600 hover:scale-110 hover:text-white rounded-lg px-2 py-0.5 duration-150 transition-all'
              }>
              <div className='text-lg'>{tag.name} </div>
              {tag.count ? (
                <sup className='relative ml-1'>{tag.count}</sup>
              ) : (
                <></>
              )}
            </div>
          </SmartLink>
        )
      })}
    </div>
  )
}

/**
 * 分页
 * @param {*} param0
 */
function Pagination(props) {
  const { totalPage, page, switchPage } = props
  if (totalPage <= 0) {
    return <></>
  }
  return (
    <div className='flex space-x-1 w-full justify-center py-1'>
      {Array.from({ length: totalPage }, (_, i) => {
        const classNames =
          page === i
            ? 'font-bold text-white bg-blue-600 dark:bg-yellow-600 rounded'
            : 'hover:text-blue-600 hover:font-bold dark:text-gray-300'

        return (
          <button
            type='button'
            aria-label={`第 ${i + 1} 页`}
            aria-current={page === i ? 'page' : undefined}
            onClick={() => switchPage(i)}
            className={`text-center cursor-pointer w-6 h-6 ${classNames}`}
            key={i}>
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}
