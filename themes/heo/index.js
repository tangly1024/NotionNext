/**
 *   HEO 主题说明
 *  > 主题设计者 [张洪](https://zhheo.com/)
 *  > 主题开发者 [tangly1024](https://github.com/tangly1024)
 *  1. 开启方式 在blog.config.js 将主题配置为 `HEO`
 *  2. 更多说明参考此[文档](https://docs.tangly1024.com/article/notionnext-heo)
 */

import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import { HashTag } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import LoadingCover from '@/components/LoadingCover'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import WWAds from '@/components/WWAds'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { isBrowser } from '@/lib/utils'
import { buildSlugMap, toSlug } from '@/lib/utils/slugMap'
import { Transition } from '@headlessui/react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import BlogPostCard from './components/BlogPostCard'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import CategoryBar from './components/CategoryBar'
import FloatTocButton from './components/FloatTocButton'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import LatestPostsGroup from './components/LatestPostsGroup'
import { NoticeBar } from './components/NoticeBar'
import PostAdjacent from './components/PostAdjacent'
import PostCopyright from './components/PostCopyright'
import PostHeader from './components/PostHeader'
import { PostLock } from './components/PostLock'
import PostRecommend from './components/PostRecommend'
import SearchNav from './components/SearchNav'
import SideRight from './components/SideRight'
import CONFIG from './config'
import { Style } from './style'
import AISummary from '@/components/AISummary'
import ArticleExpirationNotice from '@/components/ArticleExpirationNotice'

/**
 * 基础布局 采用上中下布局，移动端使用顶部侧边导航栏
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, slotTop, className } = props

  // 全屏模式下的最大宽度
  const { fullWidth, isDarkMode } = useGlobal()
  const router = useRouter()

  const headerSlot = (
    <header>
      {/* 顶部导航 */}
      <Header {...props} />

      {/* 通知横幅 */}
      {router.route === '/' ? (
        <>
          <NoticeBar />
          <Hero {...props} />
        </>
      ) : null}
      {fullWidth ? null : <PostHeader {...props} isDarkMode={isDarkMode} />}
    </header>
  )

  // 右侧栏 用户信息+标签列表
  const slotRight =
    router.route === '/404' || fullWidth ? null : <SideRight {...props} />

  const maxWidth = fullWidth ? 'max-w-[96rem] mx-auto' : 'max-w-[86rem]' // 普通最大宽度是86rem和顶部菜单栏对齐，留空则与窗口对齐

  const HEO_HERO_BODY_REVERSE = siteConfig(
    'HEO_HERO_BODY_REVERSE',
    false,
    CONFIG
  )
  const HEO_LOADING_COVER = siteConfig('HEO_LOADING_COVER', true, CONFIG)

  // 加载wow动画
  useEffect(() => {
    loadWowJS()
  }, [])

  return (
    <div
      id='theme-heo'
      className={`${siteConfig('FONT_STYLE')} bg-[var(--heo-color-bg)] dark:bg-[var(--heo-color-bg-dark)] h-full min-h-screen flex flex-col scroll-smooth`}>
      <Style />

      {/* 顶部嵌入 导航栏，首页放hero，文章页放文章详情 */}
      {headerSlot}

      {/* 主区块 */}
      <main
        id='wrapper-outer'
        className={`flex-grow w-full ${maxWidth} mx-auto relative md:px-5`}>
        <div
          id='container-inner'
          className={`${HEO_HERO_BODY_REVERSE ? 'flex-row-reverse' : ''} w-full mx-auto lg:flex justify-center relative z-10`}>
          <div className={`w-full h-auto ${className || ''}`}>
            {/* 主区上部嵌入 */}
            {slotTop}
            {children}
          </div>

          <div className='lg:px-2'></div>

          <div className='hidden xl:block'>
            {/* 主区快右侧 */}
            {slotRight}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <Footer />

      {HEO_LOADING_COVER && <LoadingCover />}
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
  return (
    <div id='post-outer-wrapper' className='px-5 md:px-0'>
      {/* 文章分类条 */}
      <CategoryBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  return (
    <div id='post-outer-wrapper' className='px-5  md:px-0'>
      {/* 文章分类条 */}
      <CategoryBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
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

  useEffect(() => {
    // 高亮搜索结果
    if (currentSearch) {
      const timer = setTimeout(() => {
        replaceSearchResult({
          doms: document.getElementsByClassName('replace'),
          search: currentSearch,
          target: {
            element: 'span',
            className: 'text-red-500 border-b border-dashed'
          }
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [currentSearch])
  return (
    <div data-current-search={currentSearch || ''}>
      <div id='post-outer-wrapper' className='px-5  md:px-0'>
        {!currentSearch ? (
          <SearchNav {...props} />
        ) : (
          <div id='posts-wrapper'>
            {siteConfig('POST_LIST_STYLE') === 'page' ? (
              <BlogPostListPage {...props} />
            ) : (
              <BlogPostListScroll {...props} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts, siteInfo } = props

  // 归档页顶部显示条，如果是默认归档则不显示。分类详情页显示分类列表，标签详情页显示当前标签

  return (
    <div className='p-5 rounded-xl hover:border hover:border-[var(--heo-color-border)] dark:hover:border-[var(--heo-color-border-dark)] max-w-6xl w-full bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)]'>
      {/* 文章分类条 */}
      <CategoryBar {...props} border={false} />

      <div className='px-3'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <div key={archiveTitle}>
            <div className='pb-4 dark:text-gray-300' id={archiveTitle}>
              {archiveTitle}
            </div>
            {archivePosts[archiveTitle]?.map((post, index) => (
              <BlogPostCard
                key={post.id}
                index={index}
                post={post}
                siteInfo={siteInfo}
                compact
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const { locale, fullWidth } = useGlobal()

  const [hasCode, setHasCode] = useState(false)

  useEffect(() => {
    const hasCode = document.querySelectorAll('[class^="language-"]').length > 0
    setHasCode(hasCode)
  }, [])

  const commentEnable =
    siteConfig('COMMENT_TWIKOO_ENV_ID') ||
    siteConfig('COMMENT_WALINE_SERVER_URL') ||
    siteConfig('COMMENT_VALINE_APP_ID') ||
    siteConfig('COMMENT_GISCUS_REPO') ||
    siteConfig('COMMENT_CUSDIS_APP_ID') ||
    siteConfig('COMMENT_UTTERRANCES_REPO') ||
    siteConfig('COMMENT_GITALK_CLIENT_ID') ||
    siteConfig('COMMENT_WEBMENTION_ENABLE')

  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
    if (!post) {
      const timer = setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector(
              '#article-wrapper #notion-article'
            )
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        waiting404
      )
      return () => clearTimeout(timer)
    }
  }, [post, router, waiting404])
  return (
    <>
      <div
        className={`article h-full w-full ${fullWidth ? '' : 'xl:max-w-5xl'} ${hasCode ? 'xl:w-[73.15vw]' : ''}  bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-bg-dark)] border border-[var(--heo-color-border)] dark:border-[var(--heo-color-border-dark)] lg:hover:shadow rounded-2xl lg:px-2 lg:py-4 `}>
        {/* 文章锁 */}
        {lock && <PostLock validPassword={validPassword} />}

        {!lock && post && (
          <div className='mx-auto md:w-full md:px-5'>
            {/* 文章主体 */}
            <article id='article-wrapper'>
              {/* Notion文章主体 */}
              <section
                className='wow fadeInUp p-5 justify-center mx-auto'
                data-wow-delay='.2s'>
                <ArticleExpirationNotice post={post} />
                <AISummary aiSummary={post.aiSummary} />
                <WWAds orientation='horizontal' className='w-full' />
                {post && <NotionPage post={post} />}
                <WWAds orientation='horizontal' className='w-full' />
              </section>

              {/* 上一篇\下一篇文章 */}
              <PostAdjacent {...props} />

              {/* 分享 */}
              <ShareBar post={post} />
              {post?.type === 'Post' && (
                <div className='px-5'>
                  {/* 版权 */}
                  <PostCopyright {...props} />
                  {/* 文章推荐 */}
                  <PostRecommend {...props} />
                </div>
              )}
            </article>

            {/* 评论区 */}
            {fullWidth ? null : (
              <div className={`${commentEnable && post ? '' : 'hidden'}`}>
                <hr className='my-4 border-dashed' />
                {/* 评论区上方广告 */}
                <div className='py-2'>
                  <AdSlot />
                </div>
                {/* 评论互动 */}
                <div className='duration-200 overflow-x-auto px-5'>
                  <div className='text-2xl dark:text-white'>
                    <i className='fas fa-comment mr-1' />
                    {locale.COMMON.COMMENTS}
                  </div>
                  <Comment frontMatter={post} className='' />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FloatTocButton {...props} />
    </>
  )
}

/**
 * 404
 * @param {*} props
 * @returns
 */
const ERROR_IMAGES = [
  { src: '/images/404/404 (1).png', weight: 1 },
  { src: '/images/404/404 (2).png', weight: 1 },
  { src: '/images/404/404 (3).png', weight: 1 },
  { src: '/images/404/404 (4).png', weight: 1 },
  { src: '/images/404/404 (5).png', weight: 0.1 }
]

const pickRandomErrorImage = () => {
  const total = ERROR_IMAGES.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * total
  for (const item of ERROR_IMAGES) {
    random -= item.weight
    if (random < 0) {
      return item.src
    }
  }
  return ERROR_IMAGES[ERROR_IMAGES.length - 1].src
}

const Layout404 = props => {
  // const { meta, siteInfo } = props
  const { onLoading, fullWidth } = useGlobal()
  const [errorImage, setErrorImage] = useState(ERROR_IMAGES[0].src)
  useEffect(() => {
    setErrorImage(pickRandomErrorImage())
  }, [])
  return (
    <>
      {/* 主区块 */}
      <main
        id='wrapper-outer'
        className={`flex-grow ${fullWidth ? '' : 'max-w-4xl'} w-screen mx-auto px-5`}>
        <div id='error-wrapper' className={'w-full mx-auto justify-center'}>
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-in-out duration-700 transform order-first'
            enterFrom='opacity-0 translate-y-16'
            enterTo='opacity-100'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 -translate-y-16'
            unmount={false}>
            {/* 404卡牌 */}
            <div className='error-content flex flex-col md:flex-row w-full mt-12 h-[30rem] md:h-96 justify-center items-center bg-white dark:bg-[#1B1C20] border dark:border-gray-800 rounded-xl'>
              {/* 左侧动图 */}
              <div className='error-img h-60 md:h-full py-4 pr-4 pl-3 w-full md:w-1/2 flex justify-start items-center'>
                <LazyImage
                  className='h-full aspect-square object-cover rounded-xl'
                  src={errorImage}></LazyImage>
              </div>

              {/* 右侧文字 */}
              <div className='error-info flex-1 flex flex-col justify-center items-center space-y-4'>
                <div className='dark:text-white'>没有找到这个页面哦(´。＿。｀)</div>
                <h1 className='error-title font-extrabold md:text-9xl text-7xl dark:text-white'>
                  404
                </h1>
                <div className='dark:text-white'>请尝试站内搜索寻找文章</div>
                <SmartLink href='/'>
                  <button className='bg-[var(--heo-color-primary)] py-2 px-4 text-[var(--heo-color-primary-text)] shadow rounded-lg hover:bg-[var(--heo-color-primary-hover)] hover:shadow-md duration-200 transition-all'>
                    回到主页
                  </button>
                </SmartLink>
              </div>
            </div>

            {/* 404页面底部显示最新文章 */}
            <div className='mt-12'>
              <LatestPostsGroup {...props} />
            </div>
          </Transition>
        </div>
      </main>
    </>
  )
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
// 分类卡片循环使用的渐变色
const CATEGORY_GRADIENTS = [
  'from-orange-400 to-amber-300',
  'from-sky-400 to-cyan-300',
  'from-emerald-400 to-teal-300',
  'from-violet-400 to-purple-300',
  'from-rose-400 to-pink-300',
  'from-indigo-400 to-blue-300'
]

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  const slugMap = buildSlugMap(categoryOptions?.map(c => c.name) || [])
  // 按文章数量从多到少排序
  const categories = [...(categoryOptions || [])].sort(
    (a, b) => (b.count || 0) - (a.count || 0)
  )

  return (
    <div id='category-outer-wrapper' className='mt-8 px-5 md:px-0'>
      {/* 标题 + 分类总数 */}
      <div className='mb-5 flex items-center gap-3'>
        <i className='fas fa-folder-open text-2xl text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]' />
        <div className='text-4xl font-extrabold dark:text-gray-200'>
          {locale.COMMON.CATEGORY}
          <span className='ml-3 text-sm font-normal text-gray-400 dark:text-gray-500'>
            {categories.length} 个分类
          </span>
        </div>
      </div>

      {/* 分类卡片网格 */}
      <div
        id='category-list'
        className='duration-200 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
        {categories.length === 0 && (
          <div className='col-span-full py-10 text-center text-sm text-gray-400 dark:text-gray-500'>
            还没有分类
          </div>
        )}
        {categories.map((category, index) => {
          const gradient = CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length]
          return (
            <SmartLink
              key={category.name}
              href={`/category/${encodeURIComponent(toSlug(category.name, slugMap))}`}
              passHref
              legacyBehavior>
              <div
                className='group relative overflow-hidden cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-700 bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--heo-color-primary)] dark:hover:border-[var(--heo-color-accent)]'>
                {/* 顶部渐变装饰条 */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`}
                />
                <div className='flex items-center gap-3'>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md`}>
                    <i className='fas fa-folder text-lg' />
                  </div>
                  <div className='min-w-0'>
                    <div className='truncate text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-[var(--heo-color-primary)] dark:group-hover:text-[var(--heo-color-accent)]'>
                      {category.name}
                    </div>
                    <div className='text-xs text-gray-400 dark:text-gray-500'>
                      {category.count || 0} {locale.COMMON.POSTS}
                    </div>
                  </div>
                </div>
                <div className='mt-3 text-right text-xs text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                  查看分类 →
                </div>
              </div>
            </SmartLink>
          )
        })}
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
  const slugMap = buildSlugMap(tagOptions?.map(t => t.name) || [])
  const [keyword, setKeyword] = useState('')

  // 按文章数量从多到少排序，并支持关键词过滤
  const tags = (tagOptions || [])
    .filter(
      tag =>
        !keyword ||
        tag.name.toLowerCase().includes(keyword.toLowerCase())
    )
    .sort((a, b) => (b.count || 0) - (a.count || 0))

  return (
    <div id='tag-outer-wrapper' className='px-5 mt-8 md:px-0'>
      {/* 标题 + 标签总数 */}
      <div className='flex flex-wrap items-end justify-between gap-3 mb-5'>
        <div className='text-4xl font-extrabold dark:text-gray-200'>
          {locale.COMMON.TAGS}
          <span className='ml-3 text-sm font-normal text-gray-400 dark:text-gray-500'>
            {tagOptions?.length || 0} 个标签
          </span>
        </div>
      </div>

      {/* 标签搜索 */}
      <div className='mb-6 max-w-md'>
        <div className='relative'>
          <i className='fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500' />
          <input
            type='text'
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder='搜索标签…'
            className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-gray-100 outline-none transition-colors focus:border-[var(--heo-color-primary)] dark:focus:border-[var(--heo-color-accent)]'
          />
        </div>
      </div>

      {/* 标签列表 */}
      <div
        id='tag-list'
        className='duration-200 flex flex-wrap gap-3'>
        {tags.length === 0 && (
          <div className='w-full py-10 text-center text-sm text-gray-400 dark:text-gray-500'>
            没有找到匹配的标签
          </div>
        )}
        {tags.map((tag, index) => {
          const hot = index < 3
          return (
            <SmartLink
              key={tag.name}
              href={`/tag/${encodeURIComponent(toSlug(tag.name, slugMap))}`}
              passHref
              legacyBehavior>
              <div
                className={`group flex flex-nowrap items-center gap-1.5 rounded-full border bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] px-4 py-1.5 cursor-pointer transition-all duration-150 hover:scale-105 border-gray-200 dark:border-gray-700 hover:border-[var(--heo-color-primary)] dark:hover:border-[var(--heo-color-accent)] hover:bg-[var(--heo-color-primary)] dark:hover:bg-[var(--heo-color-accent)] hover:text-[var(--heo-color-primary-text)] ${
                  hot
                    ? 'text-base font-bold'
                    : 'text-sm font-normal'
                }`}>
                <HashTag className='w-3.5 h-3.5 stroke-gray-500 group-hover:stroke-[var(--heo-color-primary-text)]' />
                <span>{tag.name}</span>
                <span className='rounded-full bg-[var(--heo-color-card-muted)] dark:bg-white/10 px-2 text-xs leading-5 group-hover:bg-black/10 dark:group-hover:bg-black/30 group-hover:text-white'>
                  {tag.count}
                </span>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
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
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
