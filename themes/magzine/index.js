import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import LoadingCover from '@/components/LoadingCover'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import WWAds from '@/components/WWAds'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { SignIn, SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import ArticleInfo from './components/ArticleInfo'
import { ArticleLock } from './components/ArticleLock'
import BannerFullWidth from './components/BannerFullWidth'
import CTA from './components/CTA'
import Catalog from './components/Catalog'
import CatalogFloat from './components/CatalogFloat'
import CategoryGroup from './components/CategoryGroup'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import PostBannerGroupByCategory from './components/PostBannerGroupByCategory'
import PostGroupArchive from './components/PostGroupArchive'
import PostGroupLatest from './components/PostGroupLatest'
import PostListPage from './components/PostListPage'
import PostListRecommend from './components/PostListRecommend'
import PostListScroll from './components/PostListScroll'
import PostSimpleListHorizontal from './components/PostListSimpleHorizontal'
import PostNavAround from './components/PostNavAround'
import TagGroups from './components/TagGroups'
import TagItemMini from './components/TagItemMini'
import TouchMeCard from './components/TouchMeCard'
import CONFIG from './config'
import { Style } from './style'

// 主题全局状态
const ThemeGlobalMagzine = createContext()
export const useMagzineGlobal = () => useContext(ThemeGlobalMagzine)

/**
 * 基础布局
 * 采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children } = props
  const [tocVisible, changeTocVisible] = useState(false)
  const searchModal = useRef(null)

  return (
    <ThemeGlobalMagzine.Provider
      value={{ searchModal, tocVisible, changeTocVisible }}>
      {/* CSS样式 */}
      <Style />

      <div
        id='theme-magzine'
        className={`${siteConfig('FONT_STYLE')} bg-white dark:bg-hexo-black-gray w-full h-full min-h-screen justify-center dark:text-gray-300 scroll-smooth`}>
        <main
          id='wrapper'
          className={'relative flex justify-between w-full h-full mx-auto'}>
          {/* 主区 */}
          <div id='container-wrapper' className='w-full relative z-10'>
            <Header {...props} />
            <div id='main' role='main'>
              {children}
            </div>
            {/* 行动呼吁 */}
            <CTA {...props} />
            <Footer title={siteConfig('TITLE')} />
          </div>
        </main>

        {/* 全局Loading */}
        <LoadingCover />
        {/* 全局搜索遮罩 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalMagzine.Provider>
  )
}

/**
 * 首页
 * 首页就是一个博客列表
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  const { posts } = props
  // 最新文章 从第4个元素开始截取出4个
  const newPosts = posts.slice(3, 7)

  return (
    <div className='pt-10 md:pt-18'>
      {/* 首屏宣传区块 */}
      <Hero posts={posts} />

      {/* 最新文章区块 */}
      <PostSimpleListHorizontal
        title='最新文章'
        href='/archive'
        posts={newPosts}
      />

      {/* 文章分类陈列区 */}
      <PostBannerGroupByCategory {...props} />

      {/* 文章推荐  */}
      <PostListRecommend {...props} />
    </div>
  )
}

/**
 * 博客列表
 * @returns
 */
const LayoutPostList = props => {
  // 当前筛选的分类或标签
  const { category, tag } = props

  return (
    <div className=' max-w-screen-3xl mx-auto w-full px-2 lg:px-0'>
      {/* 一个顶部条 */}
      <h2 className='py-8 text-2xl font-bold'>{category || tag}</h2>

      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <PostListPage {...props} />
      ) : (
        <PostListScroll {...props} />
      )}
    </div>
  )
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, recommendPosts, prev, next, lock, validPassword } = props
  const { locale } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector('#article-wrapper #notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        siteConfig('POST_WAITING_TIME_FOR_404') * 1000
      )
    }
  }, [post])

  return (
    <>
      <div {...props} className='w-full mx-auto max-w-screen-3xl'>
        {/* 广告位 */}
        <WWAds orientation='horizontal' />

        {/* 文章锁 */}
        {lock && <ArticleLock validPassword={validPassword} />}

        {!lock && post && (
          <div className='w-full max-w-screen-3xl mx-auto'>
            {/* 文章信息 */}
            <ArticleInfo {...props} />

            {/* 文章区块分为三列 */}
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 py-12'>
              <div className='h-full lg:col-span-1 hidden lg:block'>
                <Catalog
                  post={post}
                  toc={post?.toc || []}
                  className='sticky top-20'
                />
              </div>

              {/* Notion文章主体 */}
              <article className='max-w-3xl lg:col-span-3 w-full mx-auto px-2 lg:px-0'>
                <div id='article-wrapper'>
                  <NotionPage post={post} />
                </div>

                {/* 文章底部区域  */}
                <section>
                  <div className='py-2 flex justify-end'>
                    {siteConfig('MAGZINE_POST_DETAIL_TAG') &&
                      post?.tagItems?.map(tag => (
                        <TagItemMini key={tag.name} tag={tag} />
                      ))}
                  </div>
                  {/* 分享 */}
                  <ShareBar post={post} />
                  {/* 上一篇下一篇 */}
                  <PostNavAround prev={prev} next={next} />

                  {/* 评论区 */}
                  <Comment frontMatter={post} />
                </section>
              </article>

              <div className='lg:col-span-1 flex flex-col justify-between px-2 lg:px-0 space-y-2 lg:space-y-0'>
                {/* meta信息 */}
                <section className='text-lg gap-y-6 text-center lg:text-left'>
                  <div className='text-gray-500 py-1 dark:text-gray-600 '>
                    {/* <div className='whitespace-nowrap'>
                      <i className='far fa-calendar mr-2' />
                      {post?.publishDay}
                    </div> */}
                    <div className='whitespace-nowrap mr-2'>
                      <i className='far fa-calendar-check mr-2' />
                      {post?.lastEditedDay}
                    </div>
                    <div className='hidden busuanzi_container_page_pv  mr-2 whitespace-nowrap'>
                      <i className='mr-1 fas fa-fire' />
                      <span className='busuanzi_value_page_pv' />
                    </div>
                  </div>
                </section>

                {/* 最新文章区块 */}
                <div>
                  <PostGroupLatest {...props} vertical={true} />
                </div>

                {/* Adsense */}
                <div>
                  <AdSlot />
                </div>

                {/* 留白 */}
                <div></div>

                {/* 文章分类区块 */}
                <div>
                  <CategoryGroup {...props} />
                </div>

                <div>
                  <TouchMeCard />
                </div>

                <div>
                  <WWAds />
                </div>

                {/* 底部留白 */}
                <div></div>
              </div>
            </div>

            {/* 移动端目录 */}
            <CatalogFloat {...props} />
          </div>
        )}
      </div>

      <div>
        {/* 广告醒图 */}
        <BannerFullWidth />
        {/* 推荐关联文章 */}
        {recommendPosts && recommendPosts.length > 0 && (
          <PostSimpleListHorizontal
            title={locale.COMMON.RELATE_POSTS}
            posts={recommendPosts}
          />
        )}
      </div>
    </>
  )
}

/**
 * 搜索
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { locale } = useGlobal()
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

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

  return (
    <div className='max-w-screen-3xl w-full mx-auto'>
      {/* 搜索导航栏 */}
      <div className='py-12'>
        <div className='pb-4 w-full'>{locale.NAV.SEARCH}</div>
        {!currentSearch && (
          <>
            <TagGroups {...props} />
            <CategoryGroup {...props} />
          </>
        )}
      </div>

      {/* 文章列表 */}
      {currentSearch && (
        <div>
          {siteConfig('POST_LIST_STYLE') === 'page' ? (
            <PostListPage {...props} />
          ) : (
            <PostListScroll {...props} />
          )}
        </div>
      )}
    </div>
  )
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
      <div className='w-full max-w-screen-3xl mx-auto mt-14 min-h-full'>
        {Object.keys(archivePosts)?.map(archiveTitle => (
          <PostGroupArchive
            key={archiveTitle}
            archiveTitle={archiveTitle}
            posts={archivePosts[archiveTitle]}
          />
        ))}
      </div>
    </>
  )
}

/**
 * 404
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  return (
    <>
      <div className='w-full h-96 py-80 flex justify-center items-center'>
        404 Not found.
      </div>
    </>
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
  return (
    <div className='w-full max-w-screen-3xl mx-auto min-h-96'>
      <div className='bg-white dark:bg-gray-700 py-10'>
        <div className='dark:text-gray-200 mb-5 text-2xl font-bold'>
          {/* <i className='mr-4 fas fa-th' /> */}
          {locale.COMMON.CATEGORY}:
        </div>
        <div id='category-list' className='duration-200 flex flex-wrap'>
          {categoryOptions?.map(category => {
            return (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior>
                <div
                  className={
                    'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'
                  }>
                  {/* <i className='mr-4 fas fa-folder' /> */}
                  {category.name}({category.count})
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
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
    <div className='w-full max-w-screen-3xl mx-auto min-h-96'>
      <div className='bg-white dark:bg-gray-700 py-10'>
        <div className='dark:text-gray-200 mb-5  text-2xl font-bold'>
          {/* <i className='mr-4 fas fa-tag' /> */}
          {locale.COMMON.TAGS}:
        </div>
        <div id='tags-list' className='duration-200 flex flex-wrap'>
          {tagOptions?.map(tag => {
            return (
              <div key={tag.name} className='p-2'>
                <TagItemMini key={tag.name} tag={tag} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * 登录页面
 * @param {*} props
 * @returns
 */
const LayoutSignIn = props => {
  const { post } = props
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <>
      <div className='grow mt-20'>
        {/* clerk预置表单 */}
        {enableClerk && (
          <div className='flex justify-center py-6'>
            <SignIn />
          </div>
        )}
        <div id='article-wrapper'>
          <NotionPage post={post} />
        </div>
      </div>
    </>
  )
}

/**
 * 注册页面
 * @param {*} props
 * @returns
 */
const LayoutSignUp = props => {
  const { post } = props
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <>
      <div className='grow mt-20'>
        {/* clerk预置表单 */}
        {enableClerk && (
          <div className='flex justify-center py-6'>
            <SignUp />
          </div>
        )}
        <div id='article-wrapper'>
          <NotionPage post={post} />
        </div>
      </div>
    </>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSignIn,
  LayoutSignUp,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
