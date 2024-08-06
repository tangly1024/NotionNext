'use client'

import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import WWAds from '@/components/WWAds'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef } from 'react'
import ArticleDetail from './components/ArticleDetail'
import ArticleLock from './components/ArticleLock'
import AsideLeft from './components/AsideLeft'
import BlogListPage from './components/BlogListPage'
import BlogListScroll from './components/BlogListScroll'
import BlogArchiveItem from './components/BlogPostArchive'
import Header from './components/Header'
import TagItemMini from './components/TagItemMini'
import CONFIG from './config'
import { Style } from './style'

const Live2D = dynamic(() => import('@/components/Live2D'))

// 主题全局状态
const ThemeGlobalFukasawa = createContext()
export const useFukasawaGlobal = () => useContext(ThemeGlobalFukasawa)

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param children
 * @param layout
 * @param tags
 * @param meta
 * @param post
 * @param currentSearch
 * @param currentCategory
 * @param currentTag
 * @param categories
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, headerSlot } = props
  const leftAreaSlot = <Live2D />
  const { onLoading, fullWidth } = useGlobal()
  const searchModal = useRef(null)
  return (
    <ThemeGlobalFukasawa.Provider value={{ searchModal }}>
      <div
        id='theme-fukasawa'
        className={`${siteConfig('FONT_STYLE')} dark:bg-black scroll-smooth`}>
        <Style />
        {/* 页头导航，此主题只在移动端生效 */}
        <Header {...props} />

        <div
          className={
            (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
              ? 'flex-row-reverse'
              : '') + ' flex'
          }>
          {/* 侧边抽屉 */}
          <AsideLeft {...props} slot={leftAreaSlot} />

          <main
            id='wrapper'
            className='relative flex w-full py-8 justify-center bg-day dark:bg-night'>
            <div
              id='container-inner'
              className={`${fullWidth ? '' : '2xl:max-w-6xl md:max-w-4xl'} w-full relative z-10`}>
              <Transition
                show={!onLoading}
                appear={true}
                className='w-full'
                enter='transition ease-in-out duration-700 transform order-first'
                enterFrom='opacity-0 translate-y-16'
                enterTo='opacity-100'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 -translate-y-16'
                unmount={false}>
                <div> {headerSlot} </div>
                <div> {children} </div>
              </Transition>

              <div className='mt-2'>
                <AdSlot type='native' />
              </div>
            </div>
          </main>
        </div>

        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalFukasawa.Provider>
  )
}

/**
 * 首页
 * @param {*} props notion数据
 * @returns 首页就是一个博客列表
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}

/**
 * 博客列表
 * @param {*} props
 */
const LayoutPostList = props => {
  const POST_LIST_STYLE = siteConfig('POST_LIST_STYLE')
  return (
    <>
      <div className='w-full p-2'>
        <WWAds className='w-full' orientation='horizontal' />
      </div>
      { POST_LIST_STYLE=== 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
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
  const { post, lock, validPassword } = props
  const router = useRouter()
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
    <>
      {lock ? (
        <ArticleLock validPassword={validPassword} />
      ) : (
        <ArticleDetail {...props} />
      )}
    </>
  )
}

/**
 * 搜索页
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
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
  }, [router])
  return <LayoutPostList {...props} />
}

/**
 * 归档页面
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <>
      <div className='mb-10 pb-20 bg-white md:p-12 p-3 dark:bg-gray-800 shadow-md min-h-full'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogArchiveItem
            key={archiveTitle}
            posts={archivePosts[archiveTitle]}
            archiveTitle={archiveTitle}
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
  return <>404</>
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { locale } = useGlobal()
  const { categoryOptions } = props
  return (
    <>
      <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
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
  const { locale } = useGlobal()
  const { tagOptions } = props
  return (
    <>
      <div className='bg-white dark:bg-gray-700 px-10 py-10 shadow'>
        <div className='dark:text-gray-200 mb-5'>
          <i className='mr-4 fas fa-tag' />
          {locale.COMMON.TAGS}:
        </div>
        <div id='tags-list' className='duration-200 flex flex-wrap ml-8'>
          {tagOptions.map(tag => {
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
