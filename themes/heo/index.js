/**
 *   HEO 主题说明
 *  > 主题设计者 [张洪](https://zhheo.com/)
 *  > 主题开发者 [tangly1024](https://github.com/tangly1024)
 *  1. 开启方式 在blog.config.js 将主题配置为 `HEO`
 *  2. 更多说明参考此[文档](https://docs.tangly1024.com/article/notionnext-heo)
 */

import CONFIG from './config'
import CommonHead from '@/components/CommonHead'
import { useEffect, useState } from 'react'
import Footer from './components/Footer'
import SideRight from './components/SideRight'
import NavBar from './components/NavBar'
import { useGlobal } from '@/lib/global'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import Hero from './components/Hero'
import { useRouter } from 'next/router'
import SearchNav from './components/SearchNav'
import BlogPostArchive from './components/BlogPostArchive'
import { ArticleLock } from './components/ArticleLock'
import PostHeader from './components/PostHeader'
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
import LatestPostsGroup from './components/LatestPostsGroup'
import FloatTocButton from './components/FloatTocButton'
import replaceSearchResult from '@/components/Mark'
import LazyImage from '@/components/LazyImage'
import WWAds from '@/components/WWAds'
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'

/**
 * 基础布局 采用上中下布局，移动端使用顶部侧边导航栏
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const {
    children,
    headerSlot,
    slotTop,
    slotRight,
    className,
    meta
  } = props

  return (
    <div
      id="theme-heo"
      className="bg-[#f7f9fe] dark:bg-[#18171d] h-full min-h-screen flex flex-col"
    >
      {/* SEO信息 */}
      <CommonHead meta={meta} />
      <Style />

      {/* 顶部嵌入 导航栏，首页放hero，文章页放文章详情 */}
      {headerSlot}

      {/* 主区块 */}
      <main
        id="wrapper-outer"
        className={'flex-grow w-full max-w-[86rem] mx-auto relative md:px-5'}
      >
        <div
          id="container-inner"
          className={
            'w-full mx-auto lg:flex lg:space-x-4 justify-center relative z-10'
          }
        >
          <div className={`w-full h-auto ${className || ''}`}>
            {/* 主区上部嵌入 */}
            {slotTop}
            {children}
          </div>

          <div className="hidden xl:block">
            {/* 主区快右侧 */}
            {slotRight}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <Footer title={siteConfig('TITLE')} />
    </div>
  )
}

/**
 * 首页
 * 是一个博客列表，嵌入一个Hero大图
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  const headerSlot = (
    <header>
      {/* 顶部导航 */}
      <div id="nav-bar-wrapper" className="h-16">
        <NavBar {...props} />
      </div>
      {/* 通知横幅 */}
      <NoticeBar />
      <Hero {...props} />
      <div className="max-w-[86rem] mx-auto px-3">
        <WWAds className="w-full" orientation="horizontal" />
      </div>
    </header>
  )

  // 右侧栏 用户信息+标签列表
  const slotRight = <SideRight {...props} />

  return (
    <LayoutBase {...props} slotRight={slotRight} headerSlot={headerSlot}>
      <div id="post-outer-wrapper" className="px-5 md:px-0">
        {/* 文章分类条 */}
        <CategoryBar {...props} />
        {siteConfig('POST_LIST_STYLE') === 'page'
          ? (
          <BlogPostListPage {...props} />
            )
          : (
          <BlogPostListScroll {...props} />
            )}
      </div>
    </LayoutBase>
  )
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  // 右侧栏
  const slotRight = <SideRight {...props} />
  const headerSlot = (
    <header>
      {/* 顶部导航 */}
      <div id="nav-bar-wrapper" className="h-16">
        <NavBar {...props} />
      </div>
    </header>
  )

  return (
    <LayoutBase {...props} slotRight={slotRight} headerSlot={headerSlot}>
      <div id="post-outer-wrapper" className="px-5  md:px-0">
        {/* 文章分类条 */}
        <CategoryBar {...props} />
        {siteConfig('POST_LIST_STYLE') === 'page'
          ? (
          <BlogPostListPage {...props} />
            )
          : (
          <BlogPostListScroll {...props} />
            )}
      </div>
    </LayoutBase>
  )
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
  const headerSlot = (
    <header className="post-bg">
      {/* 顶部导航 */}
      <div id="nav-bar-wrapper">
        <NavBar {...props} />
      </div>
      <PostHeader {...props} />
    </header>
  )

  useEffect(() => {
    // 高亮搜索结果
    if (currentSearch) {
      setTimeout(() => {
        replaceSearchResult({
          doms: document.getElementsByClassName('replace'),
          search: currentSearch,
          target: {
            element: 'span',
            className: 'text-red-500 border-b border-dashed'
          }
        })
      }, 100)
    }
  }, [])
  return (
    <LayoutBase
      {...props}
      currentSearch={currentSearch}
      headerSlot={headerSlot}
    >
      <div id="post-outer-wrapper" className="px-5  md:px-0">
        {!currentSearch
          ? (
          <SearchNav {...props} />
            )
          : (
          <div id="posts-wrapper">
            {siteConfig('POST_LIST_STYLE') === 'page'
              ? (
              <BlogPostListPage {...props} />
                )
              : (
              <BlogPostListScroll {...props} />
                )}
          </div>
            )}
      </div>
    </LayoutBase>
  )
}

/**
 * 归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts } = props

  // 右侧栏
  const slotRight = <SideRight {...props} />
  const headerSlot = (
    <header>
      {/* 顶部导航 */}
      <div id="nav-bar-wrapper" className="h-16">
        <NavBar {...props} />
      </div>
    </header>
  )

  // 归档页顶部显示条，如果是默认归档则不显示。分类详情页显示分类列表，标签详情页显示当前标签

  return (
    <LayoutBase {...props} slotRight={slotRight} headerSlot={headerSlot}>
      <div className="p-5 rounded-xl border dark:border-gray-600 max-w-6xl w-full bg-white dark:bg-[#1e1e1e]">
        {/* 文章分类条 */}
        <CategoryBar {...props} border={false} />

        <div className="px-3">
          {Object.keys(archivePosts).map(archiveTitle => (
            <BlogPostArchive
              key={archiveTitle}
              posts={archivePosts[archiveTitle]}
              archiveTitle={archiveTitle}
            />
          ))}
        </div>
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
  const { post, lock, validPassword } = props
  const { locale } = useGlobal()

  const [hasCode, setHasCode] = useState(false)

  useEffect(() => {
    const hasCode = document.querySelectorAll('[class^="language-"]').length > 0
    setHasCode(hasCode)
  }, [])

  // 右侧栏
  const slotRight = <SideRight {...props} />
  const headerSlot = (
    <header
      data-aos="fade-up"
      data-aos-duration="300"
      data-aos-once="false"
      data-aos-anchor-placement="top-bottom"
      className="post-bg"
    >
      {/* 顶部导航 */}
      <div id="nav-bar-wrapper">
        <NavBar {...props} />
      </div>
      <PostHeader {...props} />
    </header>
  )
  const commentEnable = siteConfig('COMMENT_TWIKOO_ENV_ID') || siteConfig('COMMENT_WALINE_SERVER_URL') || siteConfig('COMMENT_VALINE_APP_ID') ||
        siteConfig('COMMENT_GISCUS_REPO') || siteConfig('COMMENT_CUSDIS_APP_ID') || siteConfig('COMMENT_UTTERRANCES_REPO') ||
        siteConfig('COMMENT_GITALK_CLIENT_ID') || siteConfig('COMMENT_WEBMENTION_ENABLE')

  return (
    <LayoutBase
      {...props}
      headerSlot={headerSlot}
      showCategory={false}
      showTag={false}
      slotRight={slotRight}
    >
      <div className={`w-full xl:max-w-5xl ${hasCode ? 'xl:w-[73.15vw]' : ''} lg:hover:shadow lg:border rounded-2xl lg:px-2 lg:py-4 bg-white dark:bg-[#18171d] dark:border-gray-600 article`}>
        {lock && <ArticleLock validPassword={validPassword} />}

        {!lock && (
          <div
            id="article-wrapper"
            className="overflow-x-auto flex-grow mx-auto md:w-full md:px-5 "
          >
            <article
              data-aos="fade-up"
              data-aos-duration="300"
              data-aos-once="false"
              data-aos-anchor-placement="top-bottom"
              itemScope
              itemType="https://schema.org/Movie"
              className="subpixel-antialiased overflow-y-hidden"
            >
              {/* Notion文章主体 */}
              <section className="px-5 justify-center mx-auto">
                <WWAds orientation="horizontal" className="w-full" />
                {post && <NotionPage post={post} />}
                <WWAds orientation="horizontal" className="w-full" />
              </section>

              {/* 分享 */}
              <ShareBar post={post} />
              {post?.type === 'Post' && (
                <div className="px-5">
                  {/* 版权 */}
                  <ArticleCopyright {...props} />
                  {/* 文章推荐 */}
                  <ArticleRecommend {...props} />
                  {/* 上一篇\下一篇文章 */}
                  <ArticleAdjacent {...props} />
                </div>
              )}
            </article>

            <div className={`${commentEnable && post ? '' : 'hidden'}`}>
              <hr className="my-4 border-dashed" />

              {/* 评论互动 */}
              <div className="duration-200 overflow-x-auto px-5">
                <div className="text-2xl dark:text-white">
                  <i className="fas fa-comment mr-1" />
                  {locale.COMMON.COMMENTS}
                </div>
                <Comment frontMatter={post} className="" />
                <div className="py-2">
                  <AdSlot />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <FloatTocButton {...props} />
    </LayoutBase>
  )
}

/**
 * 404
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const { meta, siteInfo } = props
  const { onLoading } = useGlobal()
  return (
    <div
      id="theme-heo"
      className="bg-[#f7f9fe] dark:bg-[#18171d] h-full min-h-screen flex flex-col"
    >
      {/* 网页SEO */}
      <CommonHead meta={meta} siteInfo={siteInfo} />
      <Style />

      {/* 顶部嵌入 导航栏，首页放hero，文章页放文章详情 */}
      <header>
        {/* 顶部导航 */}
        <div id="nav-bar-wrapper" className="h-16">
          <NavBar {...props} />
        </div>
      </header>

      {/* 主区块 */}
      <main
        id="wrapper-outer"
        className={'flex-grow max-w-4xl w-screen mx-auto px-5'}
      >
        <div id="error-wrapper" className={'w-full mx-auto justify-center'}>
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
            {/* 404卡牌 */}
            <div className="error-content flex flex-col md:flex-row w-full mt-12 h-[30rem] md:h-96 justify-center items-center bg-white dark:bg-[#1B1C20] border dark:border-gray-800 rounded-3xl">
              {/* 左侧动图 */}
              <LazyImage
                className="error-img h-60 md:h-full p-4"
                src={'https://bu.dusays.com/2023/03/03/6401a7906aa4a.gif'}
              ></LazyImage>

              {/* 右侧文字 */}
              <div className="error-info flex-1 flex flex-col justify-center items-center space-y-4">
                <h1 className="error-title font-extrabold md:text-9xl text-7xl dark:text-white">
                  404
                </h1>
                <div className='dark:text-white'>请尝试站内搜索寻找文章</div>
                <Link href="/">
                  <button className="bg-blue-500 py-2 px-4 text-white shadow rounded-lg hover:bg-blue-600 hover:shadow-md duration-200 transition-all">
                    回到主页
                  </button>
                </Link>
              </div>
            </div>

            {/* 404页面底部显示最新文章 */}
            <div className="mt-12">
              <LatestPostsGroup {...props} />
            </div>
          </Transition>
        </div>
      </main>
    </div>
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
  const headerSlot = (
    <header>
      {/* 顶部导航 */}
      <div id="nav-bar-wrapper" className="h-16">
        <NavBar {...props} />
      </div>
    </header>
  )

  return (
    <LayoutBase {...props} className="mt-8" headerSlot={headerSlot}>
      <div id="category-outer-wrapper" className="px-5 md:px-0">
        <div className="text-4xl font-extrabold dark:text-gray-200 mb-5">
          {locale.COMMON.CATEGORY}
        </div>
        <div
          id="category-list"
          className="duration-200 flex flex-wrap m-10 justify-center"
        >
          {categoryOptions?.map(category => {
            return (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior
              >
                <div
                  className={
                    'group mr-5 mb-5 flex flex-nowrap items-center border bg-white text-2xl rounded-xl dark:hover:text-white px-4 cursor-pointer py-3 hover:text-white hover:bg-indigo-600 transition-all hover:scale-110 duration-150'
                  }
                >
                  <HashTag className={'w-5 h-5 stroke-gray-500 stroke-2'} />
                  {category.name}
                  <div className="bg-[#f1f3f8] ml-1 px-2 rounded-lg group-hover:text-indigo-600 ">
                    {category.count}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
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
  const headerSlot = (
    <header>
      {/* 顶部导航 */}
      <div id="nav-bar-wrapper" className="h-16">
        <NavBar {...props} />
      </div>
    </header>
  )
  return (
    <LayoutBase {...props} className="mt-8" headerSlot={headerSlot}>
      <div id="tag-outer-wrapper" className="px-5  md:px-0">
        <div className="text-4xl font-extrabold dark:text-gray-200 mb-5">
          {locale.COMMON.TAGS}
        </div>
        <div
          id="tag-list"
          className="duration-200 flex flex-wrap space-x-5 space-y-5 m-10 justify-center"
        >
          {tagOptions.map(tag => {
            return (
              <Link
                key={tag.name}
                href={`/tag/${tag.name}`}
                passHref
                legacyBehavior
              >
                <div
                  className={
                    'group flex flex-nowrap items-center border bg-white text-2xl rounded-xl dark:hover:text-white px-4 cursor-pointer py-3 hover:text-white hover:bg-indigo-600 transition-all hover:scale-110 duration-150'
                  }
                >
                  <HashTag className={'w-5 h-5 stroke-gray-500 stroke-2'} />
                  {tag.name}
                  <div className="bg-[#f1f3f8] ml-1 px-2 rounded-lg group-hover:text-indigo-600 ">
                    {tag.count}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
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
