import CONFIG from './config'
import { createContext, useEffect, useState, useContext, useRef } from 'react'
import Nav from './components/Nav'
import { Footer } from './components/Footer'
import JumpToTopButton from './components/JumpToTopButton'
import Live2D from '@/components/Live2D'
import { useGlobal } from '@/lib/global'
import Announcement from './components/Announcement'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { deepClone, isBrowser } from '@/lib/utils'
import SearchNavBar from './components/SearchNavBar'
import BlogArchiveItem from './components/BlogArchiveItem'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'
import { ArticleInfo } from './components/ArticleInfo'
import Comment from '@/components/Comment'
import { ArticleFooter } from './components/ArticleFooter'
import ShareBar from '@/components/ShareBar'
import Link from 'next/link'
import BlogListBar from './components/BlogListBar'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import replaceSearchResult from '@/components/Mark'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import { siteConfig } from '@/lib/config'

// 主题全局状态
const ThemeGlobalNobelium = createContext()
export const useNobeliumGlobal = () => useContext(ThemeGlobalNobelium)

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, post } = props
  const fullWidth = post?.fullWidth ?? false
  const { onLoading } = useGlobal()
  const searchModal = useRef(null)
  // 在列表中进行实时过滤
  const [filterKey, setFilterKey] = useState('')
  const topSlot = <BlogListBar {...props}/>

  return (
        <ThemeGlobalNobelium.Provider value={{ searchModal, filterKey, setFilterKey }}>
            <div id='theme-nobelium' className='nobelium relative dark:text-gray-300  w-full  bg-white dark:bg-black min-h-screen flex flex-col'>

                <Style />

                {/* 顶部导航栏 */}
                <Nav {...props} />

                {/* 主区 */}
                <main id='out-wrapper' className={`relative m-auto flex-grow w-full transition-all ${!fullWidth ? 'max-w-2xl px-4' : 'px-4 md:px-24'}`}>

                    <Transition
                        show={!onLoading}
                        appear={true}
                        enter="transition ease-in-out duration-700 transform order-first"
                        enterFrom="opacity-0 translate-y-16"
                        enterTo="opacity-100"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-16"
                        unmount={false}
                    >
                        {/* 顶部插槽 */}
                        {topSlot}
                        {children}
                    </Transition>

                </main>

                {/* 页脚 */}
                <Footer {...props} />

                {/* 右下悬浮 */}
                <div className='fixed right-4 bottom-4'>
                    <JumpToTopButton />
                </div>

                {/* 左下悬浮 */}
                <div className="bottom-4 -left-14 fixed justify-end z-40">
                    <Live2D />
                </div>

                {/* 搜索框 */}
                <AlgoliaSearchModal cRef={searchModal} {...props}/>

            </div>
        </ThemeGlobalNobelium.Provider>
  )
}

/**
 * 首页
 * 首页是个博客列表，加上顶部嵌入一个公告
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  return (
        <LayoutPostList {...props} topSlot={<Announcement {...props} />} />
  )
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  const { posts, topSlot, tag } = props
  const { filterKey } = useNobeliumGlobal()
  let filteredBlogPosts = []
  if (filterKey && posts) {
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(filterKey.toLowerCase())
    })
  } else {
    filteredBlogPosts = deepClone(posts)
  }

  return (
        <>
            {topSlot}
            {tag && <SearchNavBar {...props} />}
            {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogListPage {...props} posts={filteredBlogPosts} /> : <BlogListScroll {...props} posts={filteredBlogPosts} />}
        </>
  )
}

/**
 * 搜索
 * 页面是博客列表，上方嵌入一个搜索引导条
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword, posts } = props
  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [])

  // 在列表中进行实时过滤
  const { filterKey } = useNobeliumGlobal()
  let filteredBlogPosts = []
  if (filterKey && posts) {
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(filterKey.toLowerCase())
    })
  } else {
    filteredBlogPosts = deepClone(posts)
  }

  return <>
    <SearchNavBar {...props} />
    {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogListPage {...props} posts={filteredBlogPosts} /> : <BlogListScroll {...props} posts={filteredBlogPosts} />}
  </>
}

/**
 * 归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
        <>
            <div className="mb-10 pb-20 md:py-12 p-3  min-h-screen w-full">
                {Object.keys(archivePosts).map(archiveTitle => <BlogArchiveItem key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />)}
            </div>
        </>
  )
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  return (
        <>

            {lock && <ArticleLock validPassword={validPassword} />}

            {!lock && <div id="article-wrapper" className="px-2">
                <>
                    <ArticleInfo post={post} />
                    <NotionPage post={post} />
                    <ShareBar post={post} />
                    <Comment frontMatter={post} />
                    <ArticleFooter />
                </>
            </div>}

        </>
  )
}

/**
 * 404 页面
 * @param {*} props
 * @returns
 */
const Layout404 = (props) => {
  return <>
        404 Not found.
    </>
}

/**
 * 文章分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = (props) => {
  const { categoryOptions } = props

  return (
        <>
            <div id='category-list' className='duration-200 flex flex-wrap'>
                {categoryOptions?.map(category => {
                  return (
                        <Link
                            key={category.name}
                            href={`/category/${category.name}`}
                            passHref
                            legacyBehavior>
                            <div
                                className={'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}>
                                <i className='mr-4 fas fa-folder' />{category.name}({category.count})
                            </div>
                        </Link>
                  )
                })}
            </div>
        </>
  )
}

/**
 * 文章标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = (props) => {
  const { tagOptions } = props
  return (
        <>
            <div>
                <div id='tags-list' className='duration-200 flex flex-wrap'>
                    {tagOptions.map(tag => {
                      return (
                            <div key={tag.name} className='p-2'>
                                <Link key={tag} href={`/tag/${encodeURIComponent(tag.name)}`} passHref
                                    className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200 mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background dark:bg-gray-800`}>
                                    <div className='font-light dark:text-gray-400'><i className='mr-1 fas fa-tag' /> {tag.name + (tag.count ? `(${tag.count})` : '')} </div>
                                </Link>
                            </div>
                      )
                    })}
                </div>
            </div>
        </>
  )
}

export {
  CONFIG as THEME_CONFIG,
  LayoutBase,
  LayoutIndex,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutPostList,
  LayoutCategoryIndex,
  LayoutTagIndex
}
