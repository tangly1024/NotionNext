'use client'

// 引入所需模組
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import { siteConfig } from '@/lib/config'
import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import BlogListPage from './components/BlogListPage'
import BlogListScroll from './components/BlogListScroll'
import BlogListArchive from './components/BlogListArchive'
import Header from './components/Header'
import Footer from './components/Footer'
import SideBar from './components/SideBar'
import TitleBar from './components/TitleBar'
import SearchInput from './components/SearchInput'
import PostLock from './components/PostLock'
import PostMeta from './components/PostMeta'
import replaceSearchResult from '@/components/Mark'
import CONFIG from './config'

/**
 * 基本佈局，用於封裝網站內容，包含左右佈局、標題、側邊欄等
 */
const LayoutBase = ({ children, post, slotTop }) => {
  const { onLoading, fullWidth, locale } = useGlobal()
  const LAYOUT_VERTICAL = post && siteConfig('EXAMPLE_ARTICLE_LAYOUT_VERTICAL', false, CONFIG)
  const LAYOUT_SIDEBAR_REVERSE = siteConfig('LAYOUT_SIDEBAR_REVERSE', false)

  return (
    <div id='theme-example' className={`${siteConfig('FONT_STYLE')} dark:text-gray-300 bg-white dark:bg-black scroll-smooth`}>
      <Header />
      <TitleBar />
      <div id='container-inner' className='w-full relative z-10'>
        <div id='container-wrapper' className={`relative mx-auto justify-center md:flex py-8 px-2 ${LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : ''} ${LAYOUT_VERTICAL ? 'items-center flex-col' : 'items-start'}`}>
          <div className={`${fullWidth ? '' : LAYOUT_VERTICAL ? 'max-w-5xl' : 'max-w-3xl'} w-full xl:px-14 lg:px-4`}>
            <Transition show={!onLoading} appear enter='transition ease-in-out duration-700 transform' enterFrom='opacity-0 translate-y-16' enterTo='opacity-100' leave='transition ease-in-out duration-300 transform' leaveFrom='opacity-100' leaveTo='opacity-0 -translate-y-16'>
              {slotTop}
              {children}
            </Transition>
          </div>
          {!fullWidth && <div className={`${LAYOUT_VERTICAL ? 'flex flex-col w-full max-w-5xl justify-center xl:px-14 lg:px-4' : 'md:w-64 sticky top-8'}`}><SideBar /></div>}
        </div>
      </div>
      <Footer />
      <div className='fixed right-4 bottom-4 z-10' title={locale.POST.TOP} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className='fas fa-angle-up text-2xl' />
      </div>
    </div>
  )
}

/**
 * 列表頁（文章列表）
 */
const LayoutPostList = ({ category, tag, ...props }) => (
  <>
    {category && <div className='pb-12'><i className='mr-1 fas fa-folder-open' />{category}</div>}
    {tag && <div className='pb-12'>#{tag}</div>}
    {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}
  </>
)

/**
 * 文章詳情頁
 */
const LayoutSlug = ({ post, lock, validPassword }) => {
  const router = useRouter()
  useEffect(() => {
    if (!post && isBrowser) {
      const article = document.getElementById('notion-article')
      if (!article) {
        router.push('/404')
      }
    }
  }, [post])

  return lock ? <PostLock validPassword={validPassword} /> : <><PostMeta post={post} /><NotionPage post={post} /><ShareBar post={post} /><Comment frontMatter={post} /></>
}

/**
 * 搜索頁面
 */
const LayoutSearch = ({ keyword, ...props }) => {
  useEffect(() => {
    if (isBrowser && keyword) {
      const container = document.getElementById('posts-wrapper')
      container && replaceSearchResult({ doms: container, search: keyword, target: { element: 'span', className: 'text-red-500 border-b border-dashed' } })
    }
  }, [keyword])

  return (
    <>
      <div className='pb-12'><SearchInput {...props} /></div>
      <LayoutPostList {...props} />
    </>
  )
}

export {
  LayoutBase,
  LayoutPostList,
  LayoutSlug,
  LayoutSearch,
  CONFIG as THEME_CONFIG
}
