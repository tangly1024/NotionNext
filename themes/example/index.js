'use client'

import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import BlogListArchive from './components/BlogListArchive'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { PostLock } from './components/PostLock'
import { PostMeta } from './components/PostMeta'
import SearchInput from './components/SearchInput'
import { SideBar } from './components/SideBar'
import TitleBar from './components/TitleBar'
import CONFIG from './config'
import { Style } from './style'

/**
 * 基础布局框架
 * 1.其它页面都嵌入在LayoutBase中
 * 2.采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, post } = props
  const { onLoading, fullWidth, locale } = useGlobal()

  // 文章详情页左右布局改为上下布局
  const LAYOUT_VERTICAL =
    post && siteConfig('EXAMPLE_ARTICLE_LAYOUT_VERTICAL', false, CONFIG)

  // 网站左右布局颠倒
  const LAYOUT_SIDEBAR_REVERSE = siteConfig('LAYOUT_SIDEBAR_REVERSE', false)

  return (
    <div
      id='theme-example'
      className={`${siteConfig('FONT_STYLE')} dark:text-gray-300  bg-white dark:bg-black scroll-smooth`}>
      <Style />

      {/* 页头 */}
      <Header {...props} />
      {/* 标题栏 */}
      <TitleBar {...props} />

      {/* 主体 */}
      <div id='container-inner' className='w-full relative z-10'>
        <div
          id='container-wrapper'
          className={`relative mx-auto justify-center md:flex py-8 px-2
          ${LAYOUT_SIDEBAR_REVERSE ? 'flex-row-reverse' : ''} 
          ${LAYOUT_VERTICAL ? 'items-center flex-col' : 'items-start'} 
          `}>
          {/* 内容 */}
          <div
            className={`${fullWidth ? '' : LAYOUT_VERTICAL ? 'max-w-5xl' : 'max-w-3xl'} w-full xl:px-14 lg:px-4`}>
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
              {/* 嵌入模块 */}
              {props.slotTop}
              {children}
            </Transition>
          </div>

          {/* 侧边栏 */}
          {!fullWidth && (
            <div
              className={`${
                LAYOUT_VERTICAL
                  ? 'flex space-x-0 md:space-x-2 md:flex-row flex-col w-full max-w-5xl justify-center xl:px-14 lg:px-4'
                  : 'md:w-64 sticky top-8'
              }`}>
              <SideBar {...props} />
            </div>
          )}
        </div>
      </div>

      {/* 页脚 */}
      <Footer {...props} />

      {/* 回顶按钮 */}
      <div className='fixed right-4 bottom-4 z-10'>
        <div
          title={locale.POST.TOP}
          className='cursor-pointer p-2 text-center'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className='fas fa-angle-up text-2xl' />
        </div>
      </div>
    </div>
  )
}

/**
 * 首页
 * @param {*} props
 * @returns 此主题首页就是列表
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} />
}

/**
 * 文章列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  const { category, tag } = props

  return (
    <>
      {/* 显示分类 */}
      {category && (
        <div className='pb-12'>
          <i className='mr-1 fas fa-folder-open' />
          {category}
        </div>
      )}
      {/* 显示标签 */}
      {tag && <div className='pb-12'>#{tag}</div>}

      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
      )}
    </>
  )
}

/**
 * 文章详情页
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
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
        waiting404
      )
    }
  }, [post])
  return (
    <>
      {lock ? (
        <PostLock validPassword={validPassword} />
      ) : post && (
        <div>
          <PostMeta post={post} />
          <div id='article-wrapper'>
            <NotionPage post={post} />
            <ShareBar post={post} />
          </div>
          <Comment frontMatter={post} />
        </div>
      )}
    </>
  )
}

/**
 * 404页
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const router = useRouter()
  useEffect(() => {
    // 延时3秒如果加载失败就返回首页
    setTimeout(() => {
      const article = isBrowser && document.getElementById('article-wrapper')
      if (!article) {
        router.push('/').then(() => {
          // console.log('找不到页面', router.asPath)
        })
      }
    }, 3000)
  }, [])

  return <>
        <div className='md:-mt-20 text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
            <div className='dark:text-gray-200'>
                <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'><i className='mr-2 fas fa-spinner animate-spin' />404</h2>
                <div className='inline-block text-left h-32 leading-10 items-center'>
                    <h2 className='m-0 p-0'>页面无法加载，即将返回首页</h2>
                </div>
            </div>
        </div>
    </>
}

/**
 * 搜索页
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  useEffect(() => {
    if (isBrowser) {
      // 高亮搜索到的结果
      const container = document.getElementById('posts-wrapper')
      if (keyword && container) {
        replaceSearchResult({
          doms: container,
          search: keyword,
          target: {
            element: 'span',
            className: 'text-red-500 border-b border-dashed'
          }
        })
      }
    }
  }, [router])

  return (
    <>
      <div className='pb-12'>
        <SearchInput {...props} />
      </div>
      <LayoutPostList {...props} />
    </>
  )
}

/**
 * 归档列表
 * @param {*} props
 * @returns 按照日期将文章分组排序
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <>
      <div className='mb-10 pb-20 md:py-12 p-3  min-h-screen w-full'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogListArchive
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
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <>
      <div id='category-list' className='duration-200 flex flex-wrap'>
        {categoryOptions?.map(category => (
          <SmartLink
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
          </SmartLink>
        ))}
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
  return (
    <>
      <div id='tags-list' className='duration-200 flex flex-wrap'>
        {tagOptions.map(tag => (
          <div key={tag.name} className='p-2'>
            <SmartLink
              key={tag}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              passHref
              className={`cursor-pointer inline-block rounded hover:bg-gray-500 hover:text-white duration-200 mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white text-gray-600 hover:shadow-xl dark:border-gray-400 notion-${tag.color}_background dark:bg-gray-800`}>
              <div className='font-light dark:text-gray-400'>
                <i className='mr-1 fas fa-tag' />{' '}
                {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
              </div>
            </SmartLink>
          </div>
        ))}
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
