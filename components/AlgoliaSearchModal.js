import { useState, useImperativeHandle, useRef } from 'react'
import BLOG from '@/blog.config'
import algoliasearch from 'algoliasearch'
import replaceSearchResult from '@/components/Mark'
import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash/throttle'

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

  /**
     * 对外暴露方法
     */
  useImperativeHandle(cRef, () => {
    return {
      openSearch: () => {
        setIsModalOpen(true)
      }
    }
  })

  const client = algoliasearch(BLOG.ALGOLIA_APP_ID, BLOG.ALGOLIA_SEARCH_ONLY_APP_KEY)
  const index = client.initIndex(BLOG.ALGOLIA_INDEX)

  /**
   * 搜索
   * @param {*} query
   */
  const handleSearch = async (query, page) => {
    setKeyword(query)
    setPage(page)
    setSearchResults([])
    setUseTime(0)
    setTotalPage(0)
    setTotalHit(0)
    if (!query || query === '') {
      return
    }

    try {
      const res = await index.search(query, { page, hitsPerPage: 10 })
      const { hits, nbHits, nbPages, processingTimeMS } = res
      setUseTime(processingTimeMS)
      setTotalPage(nbPages)
      setTotalHit(nbHits)
      setSearchResults(hits)

      const doms = document.getElementById('search-wrapper').getElementsByClassName('replace')

      setTimeout(() => {
        replaceSearchResult({
          doms,
          search: query,
          target: {
            element: 'span',
            className: 'text-blue-600 border-b border-dashed'
          }
        })
      }, 150)
    } catch (error) {
      console.error('Algolia search error:', error)
    }
  }

  const throttledHandleSearch = useRef(throttle(handleSearch, 300)) // 设置节流延迟时间

  // 修改input的onChange事件处理函数
  const handleInputChange = (e) => {
    const query = e.target.value
    throttledHandleSearch.current(query, 0)
  }

  /**
   * 切换页码
   * @param {*} page
   */
  const switchPage = (page) => {
    throttledHandleSearch.current(keyword, page)
  }

  /**
   * 关闭弹窗
   */
  const closeModal = () => {
    setIsModalOpen(false)
  }

  if (!BLOG.ALGOLIA_APP_ID) {
    return <></>
  }

  return (
        <div id='search-wrapper' className={`${isModalOpen ? 'opacity-100' : 'invisible opacity-0 pointer-events-none'} z-30 fixed h-screen w-screen left-0 top-0 mt-12 flex items-start justify-center`}>

            {/* 模态框 */}
            <div className={`${isModalOpen ? 'opacity-100' : 'invisible opacity-0 translate-y-10'} flex flex-col justify-between w-full min-h-[10rem] max-w-xl dark:bg-hexo-black-gray dark:border-gray-800 bg-white dark:bg- p-5 rounded-lg z-50 shadow border hover:border-blue-600 duration-300 transition-all `}>

                <div className='flex justify-between items-center'>
                    <div className='text-2xl text-blue-600 font-bold'>搜索</div>
                    <div><i className="text-gray-600 fa-solid fa-xmark p-1 cursor-pointer hover:text-blue-600" onClick={closeModal} ></i></div>
                </div>

                <input type="text" placeholder="在这里输入搜索关键词..." onChange={(e) => handleInputChange(e)}
                    className="text-black dark:text-gray-200 bg-gray-50 dark:bg-gray-600 outline-blue-500 w-full px-4 my-2 py-1 mb-4 border rounded-md" />

                {/* 标签组 */}
                <div className='mb-4'>
                    <TagGroups/>
                </div>

                <ul>
                    {searchResults.map((result) => (
                        <li key={result.objectID} className="replace my-2">
                            <a href={`${BLOG.SUB_PATH}/${result.slug}`} className="font-bold hover:text-blue-600 text-black dark:text-gray-200">
                                {result.title}
                            </a>
                        </li>
                    ))}
                </ul>

                <Pagination totalPage={totalPage} page={page} switchPage={switchPage}/>
                <div>{totalHit > 0 && <div>共搜索到 {totalHit} 条结果，用时 {useTime} 毫秒</div> }</div>
                <div className='text-gray-600 mt-2'><span><i className="fa-brands fa-algolia"></i> Algolia 提供搜索服务</span> </div>
            </div>

            {/* 遮罩 */}
            <div onClick={closeModal} className="z-30 fixed top-0 left-0 w-full h-full flex items-center justify-center glassmorphism" />

        </div>
  )
}

/**
 * 标签组
 */
function TagGroups(props) {
  const { tagOptions } = useGlobal()
  //  获取tagOptions数组前十个
  const firstTenTags = tagOptions?.slice(0, 10)

  return <div id='tags-group' className='dark:border-gray-700 space-y-2'>
            {
                firstTenTags?.map((tag, index) => {
                  return <Link passHref
                        key={index}
                        href={`/tag/${encodeURIComponent(tag.name)}`}
                        className={'cursor-pointer inline-block whitespace-nowrap'}>
                        <div className={' flex items-center text-black dark:text-gray-300 hover:bg-blue-600 dark:hover:bg-yellow-600 hover:scale-110 hover:text-white rounded-lg px-2 py-0.5 duration-150 transition-all'}>
                            <div className='text-lg'>{tag.name} </div>{tag.count ? <sup className='relative ml-1'>{tag.count}</sup> : <></>}
                        </div>

                    </Link>
                })
            }
        </div>
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
  const pagesElement = []

  for (let i = 0; i < totalPage; i++) {
    const selected = page === i
    pagesElement.push(getPageElement(i, selected, switchPage))
  }
  return <div className='flex space-x-1 w-full justify-center py-1'>
        {pagesElement.map(p => p)}
  </div>
}

/**
 * 获取分页按钮
 * @param {*} i
 * @param {*} selected
 */
function getPageElement(i, selected, switchPage) {
  return <div onClick={() => switchPage(i)} className={`${selected ? 'font-bold text-white bg-blue-600 rounded' : 'hover:text-blue-600 hover:font-bold'} text-center cursor-pointer  w-6 h-6 `}>
    {i + 1}
  </div>
}
