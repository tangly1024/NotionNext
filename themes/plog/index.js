import CONFIG from './config'
import { createContext, useContext, useEffect, useState } from 'react'
import Header from './components/Nav'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { isBrowser } from '@/lib/utils'
import SearchNavBar from './components/SearchNavBar'
import BlogArchiveItem from './components/BlogArchiveItem'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'
import { ArticleInfo } from './components/ArticleInfo'
import Comment from '@/components/Comment'
import { ArticleFooter } from './components/ArticleFooter'
import ShareBar from '@/components/ShareBar'
import Link from 'next/link'
import { Transition } from '@headlessui/react'
import BottomNav from './components/BottomNav'
import Modal from './components/Modal'
import { Style } from './style'
import replaceSearchResult from '@/components/Mark'
import { useRouter } from 'next/router'

// 主题全局状态
const ThemeGlobalPlog = createContext()
export const usePlogGlobal = () => useContext(ThemeGlobalPlog)

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, topSlot } = props
  const { onLoading } = useGlobal()
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)

  // 页面切换关闭遮罩
  const router = useRouter()
  const closeModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', closeModal)
    return () => {
      router.events.off('routeChangeComplete', closeModal)
    }
  }, [router.events])

  return (
    <ThemeGlobalPlog.Provider value={{ showModal, setShowModal, modalContent, setModalContent }}>
        <div id='theme-plog' className='plog relative dark:text-gray-300 w-full dark:bg-black min-h-screen'>

            <Style/>

            {/* 移动端顶部导航栏 */}
            <Header {...props} />

            {/* 主区 */}
            <main id='out-wrapper' className={'relative m-auto flex-grow w-full transition-all pb-16 pt-16 md:pt-0'}>

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

            {/* 弹出框 - 用于放大显示首页图片等作用 */}
            <Modal {...props}/>

            {/* 桌面端底部导航栏 */}
            <BottomNav {...props} />
        </div>
        </ThemeGlobalPlog.Provider >
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
        <LayoutPostList {...props} />
  )
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  return (
        <>
            {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}
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
  const { keyword } = props

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

  return <LayoutPostList {...props} topSlot={<SearchNavBar {...props} />} />
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

            {!lock && <div id="article-wrapper" className="px-2 my-16 max-w-6xl mx-auto">
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
