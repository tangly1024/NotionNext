import Comment from '@/components/Comment'
import Live2D from '@/components/Live2D'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import Tabs from '@/components/Tabs'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import Announcement from './components/Announcement'
import ArticleAround from './components/ArticleAround'
import ArticleInfo from './components/ArticleInfo'
import { ArticleLock } from './components/ArticleLock'
import BlogArchiveItem from './components/BlogArchiveItem'
import BlogPostBar from './components/BlogPostBar'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import BottomMenuBar from './components/BottomMenuBar'
import Catalog from './components/Catalog'
import CategoryGroup from './components/CategoryGroup'
import CategoryItem from './components/CategoryItem'
import Footer from './components/Footer'
import InfoCard from './components/InfoCard'
import JumpToTopButton from './components/JumpToTopButton'
import RevolverMaps from './components/RevolverMaps'
import SearchInput from './components/SearchInput'
import TagGroups from './components/TagGroups'
import TagItemMini from './components/TagItemMini'
import TocDrawer from './components/TocDrawer'
import TopNavBar from './components/TopNavBar'
import CONFIG from './config'
import { Style } from './style'

// 主题全局状态
const ThemeGlobalMedium = createContext()
export const useMediumGlobal = () => useContext(ThemeGlobalMedium)

/**
 * 基础布局
 * 采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, showInfoCard = true, post, notice } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [tocVisible, changeTocVisible] = useState(false)
  const { onLoading, fullWidth } = useGlobal()
  const [slotRight, setSlotRight] = useState(null)

  useEffect(() => {
    if (post?.toc?.length > 0) {
      setSlotRight(
        <div key={locale.COMMON.TABLE_OF_CONTENTS}>
          <Catalog toc={post?.toc} />
        </div>
      )
    } else {
      setSlotRight(null)
    }
  }, [post])

  const slotTop = <BlogPostBar {...props} />

  return (
    <ThemeGlobalMedium.Provider value={{ tocVisible, changeTocVisible }}>
      {/* CSS样式 */}
      <Style />

      <div
        id='theme-medium'
        className={`${siteConfig('FONT_STYLE')} bg-white dark:bg-hexo-black-gray w-full h-full min-h-screen justify-center dark:text-gray-300 scroll-smooth`}>
        <main
          id='wrapper'
          className={
            (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
              ? 'flex-row-reverse'
              : '') + 'relative flex justify-between w-full h-full mx-auto'
          }>
          {/* 桌面端左侧菜单 */}
          {/* <LeftMenuBar/> */}

          {/* 主区 */}
          <div id='container-wrapper' className='w-full relative z-10'>
            {/* 顶部导航栏 */}
            <TopNavBar {...props} />

            <div
              id='container-inner'
              className={`px-7 ${fullWidth ? '' : 'max-w-5xl'} justify-center mx-auto min-h-screen`}>
              <Transition
                show={!onLoading}
                appear={true}
                enter='transition ease-in-out duration-700 transform order-first'
                enterFrom='opacity-0 translate-y-16'
                enterTo='opacity-100'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='opacity-100'
                leaveTo='opacity-0 -translate-y-16'
                unmount={false}>
                {slotTop}
                {children}
              </Transition>

              <JumpToTopButton />
            </div>

            {/* 底部 */}
            <Footer title={siteConfig('TITLE')} />
          </div>

          {/* 桌面端右侧 */}
          {fullWidth ? null : (
            <div
              className={`hidden xl:block border-l dark:border-transparent w-80 flex-shrink-0 relative z-10 ${siteConfig('MEDIUM_RIGHT_PANEL_DARK', null, CONFIG) ? 'bg-hexo-black-gray dark' : ''}`}>
              <div className='py-14 px-6 sticky top-0'>
                <Tabs>
                  {slotRight}
                  <div key={locale.NAV.ABOUT}>
                    {router.pathname !== '/search' && (
                      <SearchInput className='mt-6  mb-12' />
                    )}
                    {showInfoCard && <InfoCard {...props} />}
                    {siteConfig('MEDIUM_WIDGET_REVOLVER_MAPS', null, CONFIG) ===
                      'true' && <RevolverMaps />}
                  </div>
                </Tabs>
                <Announcement post={notice} />
                <Live2D />
              </div>
            </div>
          )}
        </main>

        {/* 移动端底部导航栏 */}
        <BottomMenuBar {...props} className='block md:hidden' />
      </div>
    </ThemeGlobalMedium.Provider>
  )
}

/**
 * 首页
 * 首页就是一个博客列表
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}

/**
 * 博客列表
 * @returns
 */
const LayoutPostList = props => {
  return (
    <>
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </>
  )
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, prev, next, lock, validPassword } = props
  const { locale } = useGlobal()
  const slotRight = post?.toc && post?.toc?.length >= 3 && (
    <div key={locale.COMMON.TABLE_OF_CONTENTS}>
      <Catalog toc={post?.toc} />
    </div>
  )

  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(
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
    }
  }, [post])

  return (
    <div>
      {/* 文章锁 */}
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div>
          {/* 文章信息 */}
          <ArticleInfo {...props} />

          {/* Notion文章主体 */}
          <article id='article-wrapper' className='px-1 max-w-4xl'>
            {post && <NotionPage post={post} />}
          </article>

          {/* 文章底部区域  */}
          <section>
            {/* 分享 */}
            <ShareBar post={post} />
            {/* 文章分类和标签信息 */}
            <div className='flex justify-between'>
              {siteConfig('MEDIUM_POST_DETAIL_CATEGORY', null, CONFIG) &&
                post?.category && <CategoryItem category={post?.category} />}
              <div>
                {siteConfig('MEDIUM_POST_DETAIL_TAG', null, CONFIG) &&
                  post?.tagItems?.map(tag => (
                    <TagItemMini key={tag.name} tag={tag} />
                  ))}
              </div>
            </div>
            {/* 上一篇下一篇文章 */}
            {post?.type === 'Post' && <ArticleAround prev={prev} next={next} />}
            {/* 评论区 */}
            <Comment frontMatter={post} />
          </section>

          {/* 移动端目录 */}
          <TocDrawer {...props} />
        </div>
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
    <>
      {/* 搜索导航栏 */}
      <div className='py-12'>
        <div className='pb-4 w-full'>{locale.NAV.SEARCH}</div>
        <SearchInput currentSearch={currentSearch} {...props} />
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
            <BlogPostListPage {...props} />
          ) : (
            <BlogPostListScroll {...props} />
          )}
        </div>
      )}
    </>
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
      <div className='mb-10 pb-20 md:py-12 py-3  min-h-full'>
        {Object.keys(archivePosts)?.map(archiveTitle => (
          <BlogArchiveItem
            key={archiveTitle}
            archiveTitle={archiveTitle}
            archivePosts={archivePosts}
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
  const router = useRouter()
  useEffect(() => {
    // 延时3秒如果加载失败就返回首页
    setTimeout(() => {
      const article =
        typeof document !== 'undefined' &&
        document.getElementById('notion-article')
      if (!article) {
        router.push('/').then(() => {
          // console.log('找不到页面', router.asPath)
        })
      }
    }, 3000)
  })
  return (
    <>
      <div className='text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
        <div className='dark:text-gray-200'>
          <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'>
            404
          </h2>
          <div className='inline-block text-left h-32 leading-10 items-center'>
            <h2 className='m-0 p-0'>页面未找到</h2>
          </div>
        </div>
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
    <>
      <div className='bg-white dark:bg-gray-700 py-10'>
        <div className='dark:text-gray-200 mb-5'>
          <i className='mr-4 fas fa-th' />
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
                  <i className='mr-4 fas fa-folder' />
                  {category.name}({category.count})
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
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
    <>
      <div className='bg-white dark:bg-gray-700 py-10'>
        <div className='dark:text-gray-200 mb-5'>
          <i className='mr-4 fas fa-tag' />
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
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
