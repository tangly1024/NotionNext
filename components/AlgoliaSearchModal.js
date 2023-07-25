import { useState, useImperativeHandle } from 'react'
import BLOG from '@/blog.config'
import algoliasearch from 'algoliasearch'
import replaceSearchResult from '@/components/Mark'

/**
 * 结合 Algolia 实现的弹出式搜索框
 * 打开方式 cRef.current.openSearch()
 * https://www.algolia.com/doc/api-reference/search-api-parameters/
 */
export default function AlgoliaSearchModal({ cRef }) {
  const [searchResults, setSearchResults] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  if (!BLOG.ALGOLIA_APP_ID) {
    return <></>
  }

  const client = algoliasearch(BLOG.ALGOLIA_APP_ID, BLOG.ALGOLIA_SEARCH_ONLY_APP_KEY)
  const index = client.initIndex(BLOG.ALGOLIA_INDEX)

  const handleSearch = async (query) => {
    try {
      const res = await index.search(query)
      console.log(res)
      const { hits } = res
      setSearchResults(hits)
      const doms = document.getElementById('search-wrapper').getElementsByClassName('replace')
      replaceSearchResult({
        doms,
        search: query,
        target: {
          element: 'span',
          className: 'text-blue-600 border-b border-dashed'
        }
      })
    } catch (error) {
      console.error('Algolia search error:', error)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
        <div id='search-wrapper' className={`${isModalOpen ? 'opacity-100' : 'invisible opacity-0 pointer-events-none'} fixed h-screen w-screen left-0 top-0 flex items-center justify-center`}>
            {/* 内容 */}
            <div className={`${isModalOpen ? 'opacity-100' : 'invisible opacity-0 translate-y-10'} flex flex-col justify-between w-full min-h-[10rem] max-w-xl dark:bg-hexo-black-gray dark:border-gray-800 bg-white dark:bg- p-5 rounded-lg z-50 shadow border hover:border-blue-600 duration-300 transition-all `}>

                <div className='flex justify-between items-center'>
                    <div className='text-2xl text-blue-600 font-bold'>搜索</div>
                    <div><i class="text-gray-600 fa-solid fa-xmark p-1 cursor-pointer hover:text-blue-600" onClick={closeModal} ></i></div>
                </div>

                <input type="text" placeholder="在这里输入搜索关键词..." onChange={(e) => handleSearch(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-600 outline-blue-500 w-full px-4 my-2 py-1 mb-4 border rounded-md" />

                {/* 标签组 */}
                <div>

                </div>

                <ul>
                    {searchResults.map((result) => (
                        <li key={result.objectID} className="replace my-2">
                            <a href={`${BLOG.SUB_PATH}/${result.slug}`} className="font-bold hover:text-blue-600 ">
                                {result.title}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className='text-gray-600'><i class="fa-brands fa-algolia"></i> Algolia 提供搜索服务</div>
            </div>

            {/* 遮罩 */}
            <div onClick={closeModal} className="z-30 fixed top-0 left-0 w-full h-full flex items-center justify-center glassmorphism" />

        </div>
  )
}
