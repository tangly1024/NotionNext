import CONFIG from './config'

import CommonHead from '@/components/CommonHead'
import { useEffect, useRef } from 'react'
import Footer from './components/Footer'
import SideRight from './components/SideRight'
import NavBar from './components/NavBar'
import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import Hero from './components/Hero'
import { useRouter } from 'next/router'
import Mark from 'mark.js'
import Card from './components/Card'
import SearchNav from './components/SearchNav'
import BlogPostArchive from './components/BlogPostArchive'
import { ArticleLock } from './components/ArticleLock'
import PostHeader from './components/PostHeader'
import TocDrawer from './components/TocDrawer'
import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import ArticleRecommend from './components/ArticleRecommend'
import ShareBar from '@/components/ShareBar'
import Link from 'next/link'
import CategoryBar from './components/CategoryBar'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import { NoticeBar } from './components/NoticeBar'
import { HashTag } from '@/components/HeroIcons'

/**
 * 基础布局 采用上中下布局，移动端使用顶部侧边导航栏
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, headerSlot, slotTop, slotRight, meta, siteInfo } = props
  const { onLoading } = useGlobal()

  // 加载主题样式
  if (isBrowser()) {
    loadExternalResource('/css/theme-hexo.css', 'css')
  }

  return (
        <div id='theme-heo' className='bg-[#f7f9fe] h-full min-h-screen flex flex-col overflow-hidden'>
            {/* 网页SEO */}
            <CommonHead meta={meta} siteInfo={siteInfo} />
            <Style />

            {/* 顶部嵌入 导航栏，首页放hero，文章页放文章详情 */}
            {headerSlot}

            {/* 主区块 */}
            <main id="wrapper-outer" className={'flex-grow w-full max-w-[86rem] mx-auto relative px-5'}>

                <div id="container-inner" className={'w-full mx-auto lg:flex lg:space-x-4 justify-center relative z-10'} >

                    <Transition
                        show={!onLoading}
                        appear={true}
                        enter="transition ease-in-out duration-700 transform order-first"
                        enterFrom="opacity-0 translate-y-16"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-16"
                        unmount={false}
                    >
                        {/* 主区上部嵌入 */}
                        {slotTop}

                        {children}
                    </Transition>

                    <Transition
                        show={!onLoading}
                        appear={true}
                        enter="transition ease-in-out duration-700 transform order-first"
                        enterFrom="opacity-0 translate-y-16"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-16"
                        unmount={false}
                    >
                        {/* 主区快右侧 */}
                        {slotRight}

                    </Transition>
                </div>
            </main>

            {/* 页脚 */}
            <Footer title={siteInfo?.title || BLOG.TITLE} />
        </div>
  )
}

/**
 * 首页
 * 是一个博客列表，嵌入一个Hero大图
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  const headerSlot = <header>
        {/* 顶部导航 */}
        <div id='nav-bar-wrapper' className='h-16'><NavBar {...props} /></div>
        {/* 通知横幅 */}
        <NoticeBar />
        <Hero {...props} />
    </header>

  return <LayoutPostList {...props} headerSlot={headerSlot} />
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = (props) => {
  // 右侧栏
  const slotRight = <SideRight {...props} />

  return <LayoutBase {...props} slotRight={slotRight}>
        {/* 文章分类条 */}
        <CategoryBar {...props} />

        {BLOG.POST_LIST_STYLE === 'page'
          ? <BlogPostListPage {...props} />
          : <BlogPostListScroll {...props} />}
    </LayoutBase>
}

/**
 * 搜索
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

  useEffect(() => {
    setTimeout(() => {
      if (currentSearch) {
        const targets = document.getElementsByClassName('replace')
        for (const container of targets) {
          if (container && container.innerHTML) {
            const re = new RegExp(currentSearch, 'gim')
            const instance = new Mark(container)
            instance.markRegExp(re, {
              element: 'span',
              className: 'text-red-500 border-b border-dashed'
            })
          }
        }
      }
    }, 100)
  })

  return (
        <LayoutBase {...props} currentSearch={currentSearch} className='pt-8'>
            {!currentSearch
              ? <SearchNav {...props} />
              : <div id="posts-wrapper"> {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}  </div>}
        </LayoutBase>
  )
}

/**
 * 归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = (props) => {
  const { archivePosts } = props
  return <LayoutBase {...props} className='pt-8'>
        <Card className='w-full'>
            <div className="mb-10 pb-20 bg-white md:p-12 p-3 min-h-full dark:bg-hexo-black-gray">
                {Object.keys(archivePosts).map(archiveTitle => (
                    <BlogPostArchive
                        key={archiveTitle}
                        posts={archivePosts[archiveTitle]}
                        archiveTitle={archiveTitle}
                    />
                ))}
            </div>
        </Card>
    </LayoutBase>
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const drawerRight = useRef(null)

  const targetRef = isBrowser() ? document.getElementById('article-wrapper') : null
  // 右侧栏
  const slotRight = <SideRight {...props} />
  const headerSlot = <header>
        {/* 顶部导航 */}
        <div id='nav-bar-wrapper'><NavBar {...props} /></div>
        <PostHeader {...props} />
    </header>

  return (
        <LayoutBase {...props} headerSlot={headerSlot} showCategory={false} showTag={false} slotRight={slotRight}>
            <div className="w-full lg:hover:shadow lg:border rounded-t-xl lg:rounded-xl lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray dark:border-black article">
                {lock && <ArticleLock validPassword={validPassword} />}

                {!lock && <div id="article-wrapper" className="overflow-x-auto flex-grow mx-auto md:w-full md:px-5 ">

                    <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased overflow-y-hidden" >
                        {/* Notion文章主体 */}
                        <section className='px-5 justify-center mx-auto max-w-2xl lg:max-w-full'>
                            {post && <NotionPage post={post} />}
                        </section>

                        {/* 分享 */}
                        <ShareBar post={post} />
                        {post?.type === 'Post' && <>
                            <ArticleCopyright {...props} />
                            <ArticleRecommend {...props} />
                            <ArticleAdjacent {...props} />
                        </>}

                    </article>

                    <div className='pt-4 border-dashed'></div>

                    {/* 评论互动 */}
                    <div className="duration-200 overflow-x-auto bg-white dark:bg-hexo-black-gray px-3">
                        <Comment frontMatter={post} />
                    </div>
                </div>}
            </div>

            <div className='block lg:hidden'>
                <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
            </div>

        </LayoutBase>
  )
}

/**
 * 404
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const router = useRouter()
  useEffect(() => {
    // 延时3秒如果加载失败就返回首页
    setTimeout(() => {
      if (isBrowser()) {
        const article = document.getElementById('notion-article')
        if (!article) {
          router.push('/').then(() => {
            // console.log('找不到页面', router.asPath)
          })
        }
      }
    }, 3000)
  })
  return (
        <LayoutBase {...props}>
            <div className="text-black w-full h-screen text-center justify-center content-center items-center flex flex-col">
                <div className="dark:text-gray-200">
                    <h2 className="inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top">
                        404
                    </h2>
                    <div className="inline-block text-left h-32 leading-10 items-center">
                        <h2 className="m-0 p-0">页面未找到</h2>
                    </div>
                </div>
            </div>
        </LayoutBase>
  )
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  const headerSlot = <header>
        {/* 顶部导航 */}
        <div id='nav-bar-wrapper' className='h-16'><NavBar {...props} /></div>
    </header>

  return (
        <LayoutBase {...props} className='mt-8' headerSlot={headerSlot}>
            <div className="text-4xl font-extrabold dark:text-gray-200 mb-5">
                {locale.COMMON.CATEGORY}
            </div>
            <div id="category-list" className="duration-200 flex flex-wrap space-x-5 m-10 justify-center">
                {categoryOptions.map(category => {
                  return (
                        <Link key={category.name} href={`/category/${category.name}`} passHref legacyBehavior>
                            <div className={'group flex flex-nowrap items-center border bg-white text-2xl rounded-xl dark:hover:text-white px-4 cursor-pointer py-3 hover:text-white hover:bg-indigo-600 transition-all hover:scale-110 duration-150'}>
                                <HashTag className={'w-5 h-5 stroke-gray-500 stroke-2'} />
                                {category.name}
                                <div className='bg-[#f1f3f8] ml-1 px-2 rounded-lg group-hover:text-indigo-600 '>
                                    {category.count}
                                </div>
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
const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()
  return (
        <LayoutBase {...props} className='mt-8'>
            <div className="text-4xl font-extrabold dark:text-gray-200 mb-5">
                {locale.COMMON.TAGS}
            </div>
            <div id="tag-list" className="duration-200 flex flex-wrap space-x-5 m-10 justify-center">
                {tagOptions.map(tag => {
                  return (
                        <Link key={tag.name} href={`/tag/${tag.name}`} passHref legacyBehavior>
                            <div className={'group flex flex-nowrap items-center border bg-white text-2xl rounded-xl dark:hover:text-white px-4 cursor-pointer py-3 hover:text-white hover:bg-indigo-600 transition-all hover:scale-110 duration-150'}>
                                <HashTag className={'w-5 h-5 stroke-gray-500 stroke-2'} />
                                {tag.name}
                                <div className='bg-[#f1f3f8] ml-1 px-2 rounded-lg group-hover:text-indigo-600 '>
                                    {tag.count}
                                </div>
                            </div>
                        </Link>
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
