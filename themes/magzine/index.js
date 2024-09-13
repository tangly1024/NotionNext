import Comment from '@/components/Comment'
import LoadingCover from '@/components/LoadingCover'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import Announcement from './components/Announcement'
import ArchiveItem from './components/ArchiveItem'
import ArticleAround from './components/ArticleAround'
import ArticleInfo from './components/ArticleInfo'
import { ArticleLock } from './components/ArticleLock'
import Catalog from './components/Catalog'
import CategoryGroup from './components/CategoryGroup'
import CategoryItem from './components/CategoryItem'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import PostBannerGroupByCategory from './components/PostBannerGroupByCategory'
import PostListPage from './components/PostListPage'
import PostListRecommend from './components/PostListRecommend'
import PostListScroll from './components/PostListScroll'
import PostSimpleListHorizontal from './components/PostListSimpleHorizontal'
import SearchInput from './components/SearchInput'
import TagGroups from './components/TagGroups'
import TagItemMini from './components/TagItemMini'
import TocDrawer from './components/TocDrawer'
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
  const { children, notice, showInfoCard = true, post } = props
  const { locale } = useGlobal()
  const router = useRouter()
  const [tocVisible, changeTocVisible] = useState(false)
  const { onLoading, fullWidth } = useGlobal()
  const [slotRight, setSlotRight] = useState(null)

  return (
    <ThemeGlobalMagzine.Provider value={{ tocVisible, changeTocVisible }}>
      {/* CSS样式 */}
      <Style />

      <div
        id='theme-medium'
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
            {/* 底部 */}
            <Announcement
              post={notice}
              className={'text-center text-black bg-[#7BE986] py-16'}
            />
            <Footer title={siteConfig('TITLE')} />
          </div>
        </main>
        <LoadingCover />
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
  const { posts, categoryOptions, allNavPages, latestPosts } = props
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
  return (
    <>
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <PostListPage {...props} />
      ) : (
        <PostListScroll {...props} />
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
  const router = useRouter()
  const slotRight = post?.toc && post?.toc?.length >= 3 && (
    <div key={locale.COMMON.TABLE_OF_CONTENTS}>
      <Catalog toc={post?.toc} />
    </div>
  )
  console.log('post-文章', post)

  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.getElementById('notion-article')
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
    <div {...props} className='w-full mx-auto max-w-screen-2xl'>
      {/* 文章锁 */}
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && (
        <div>
          {/* 文章信息 */}
          <ArticleInfo {...props} />

          {/* Notion文章主体 */}
          <article id='article-wrapper' className='px-1 max-w-4xl'>
            <NotionPage post={post} />
          </article>

          {/* 文章底部区域  */}
          <section>
            {/* 分享 */}
            <ShareBar post={post} />
            {/* 文章分类和标签信息 */}
            <div className='flex justify-between'>
              {siteConfig('MAGZINE_POST_DETAIL_CATEGORY') && post?.category && (
                <CategoryItem category={post?.category} />
              )}
              <div>
                {siteConfig('MAGZINE_POST_DETAIL_TAG') &&
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
            <PostListPage {...props} />
          ) : (
            <PostListScroll {...props} />
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
          <ArchiveItem
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
