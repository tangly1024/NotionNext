import CONFIG from './config'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { useEffect } from 'react'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import BlogArchiveItem from './components/BlogArchiveItem'
import { ArticleLock } from './components/ArticleLock'
import NotionPage from '@/components/NotionPage'
import { ArticleInfo } from './components/ArticleInfo'
import Comment from '@/components/Comment'
import ArticleAround from './components/ArticleAround'
import ShareBar from '@/components/ShareBar'
import { AdSlot } from '@/components/GoogleAdsense'
import Link from 'next/link'
import { TopBar } from './components/TopBar'
import { Header } from './components/Header'
import { NavBar } from './components/NavBar'
import BLOG from '@/blog.config'
import { SideBar } from './components/SideBar'
import JumpToTopButton from './components/JumpToTopButton'
import { Footer } from './components/Footer'
import { useGlobal } from '@/lib/global'
import SearchInput from './components/SearchInput'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import replaceSearchResult from '@/components/Mark'
import CommonHead from '@/components/CommonHead'

/**
 * 基础布局
 *
 * @param {*} props
 * @returns
 */
const LayoutBase = props => {
  const { children, slotTop, meta } = props
  const { onLoading } = useGlobal()

  if (isBrowser) {
    loadExternalResource('/css/theme-simple.css', 'css')
  }
  return (
        <div id='theme-simple' className='min-h-screen flex flex-col dark:text-gray-300  bg-white dark:bg-black'>
            {/* SEO相关 */}
            <CommonHead meta={meta}/>
            <Style/>

            {CONFIG.TOP_BAR && <TopBar {...props} />}

            {/* 顶部LOGO */}
            <Header {...props} />

            {/* 导航栏 */}
            <NavBar {...props} />

            {/* 主体 */}
            <div id='container-wrapper' className={(BLOG.LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : '') + ' w-full flex-1 flex items-start max-w-9/10 mx-auto pt-12'}>
                <div id='container-inner ' className='w-full flex-grow min-h-fit'>
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
                        {slotTop}

                        {children}
                    </Transition>
                    <AdSlot type='native' />
                </div>

                <div id='right-sidebar' className="hidden xl:block flex-none sticky top-8 w-96 border-l dark:border-gray-800 pl-12 border-gray-100">
                    <SideBar {...props} />
                </div>

            </div>

            <div className='fixed right-4 bottom-4 z-20'>
                <JumpToTopButton />
            </div>

            <Footer {...props} />

        </div>
  )
}

/**
 * 博客首页
 * 首页就是列表
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}
/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  return (
        <LayoutBase {...props}>
            {BLOG.POST_LIST_STYLE === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}
        </LayoutBase>
  )
}

/**
 * 搜索页
 * 也是博客列表
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

  return <LayoutPostList {...props} slotTop={<SearchInput {...props} />} />
}

/**
 * 归档页
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
        <LayoutBase {...props}>
            <div className="mb-10 pb-20 md:py-12 p-3  min-h-screen w-full">
                {Object.keys(archivePosts).map(archiveTitle => <BlogArchiveItem key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />)}
            </div>
        </LayoutBase>
  )
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next } = props

  return (
        <LayoutBase {...props}>

            {lock && <ArticleLock validPassword={validPassword} />}

            <div id="article-wrapper" className="px-2 xl:max-w-4xl 2xl:max-w-6xl ">

                {/* 文章信息 */}
                <ArticleInfo post={post} />

                {/* 广告嵌入 */}
                <AdSlot type={'in-article'} />

                {/* Notion文章主体 */}
                {!lock && <NotionPage post={post} />}

                {/* 分享 */}
                <ShareBar post={post} />

                {/* 广告嵌入 */}
                <AdSlot type={'in-article'} />

                {post?.type === 'Post' && <ArticleAround prev={prev} next={next} />}

                {/* 评论区 */}
                <Comment frontMatter={post} />

            </div>

        </LayoutBase>
  )
}

/**
 * 404
 * @param {*} props
 * @returns
 */
const Layout404 = (props) => {
  return <LayoutBase {...props}>
        404 Not found.
    </LayoutBase>
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
        <LayoutBase {...props}>
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
        </LayoutBase>
  )
}

/**
 * 标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = (props) => {
  const { tagOptions } = props
  return (
        <LayoutBase {...props}>
            <div id='tags-list' className='duration-200 flex flex-wrap'>
                {tagOptions.map(tag => {
                  return (
                        <div key={tag.name} className='p-2'>
                            <Link
                                key={tag}
                                href={`/tag/${encodeURIComponent(tag.name)}`}
                                passHref
                                className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200  mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background dark:bg-gray-800`}>
                                <div className='font-light dark:text-gray-400'><i className='mr-1 fas fa-tag' /> {tag.name + (tag.count ? `(${tag.count})` : '')} </div>
                            </Link>
                        </div>
                  )
                })}
            </div>
        </LayoutBase>
  )
}

export {
  CONFIG as THEME_CONFIG,
  LayoutIndex,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutCategoryIndex,
  LayoutPostList,
  LayoutTagIndex
}
