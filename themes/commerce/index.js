import CONFIG from './config'

import LazyImage from '@/components/LazyImage'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser, scanAndConvertToLinks } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { ArticleLock } from './components/ArticleLock'
import BlogPostArchive from './components/BlogPostArchive'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import Card from './components/Card'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import PostHeader from './components/PostHeader'
import ProductCategories from './components/ProductCategories'
import ProductCenter from './components/ProductCenter'
import RightFloatArea from './components/RightFloatArea'
import SearchNav from './components/SearchNav'
import SlotBar from './components/SlotBar'
import TagItemMini from './components/TagItemMini'
import TocDrawer from './components/TocDrawer'
import { Style } from './style'

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, post, floatSlot, slotTop, className } = props
  const { onLoading } = useGlobal()
  const router = useRouter()
  // 查找页面上的 链接，并便成为可点击
  useEffect(() => {
    scanAndConvertToLinks(document.getElementById('theme-commerce'))
  }, [router])

  const slotRight = router.route !== '/' && !post && (
    <ProductCategories {...props} />
  )

  let headerSlot = null
  if (router.route === '/' && !post) {
    headerSlot = JSON.parse(siteConfig('COMMERCE_HOME_BANNER_ENABLE', true)) ? (
      <Hero {...props} />
    ) : (
      <></>
    )
  } else if (post) {
    headerSlot = <PostHeader {...props} />
  }

  return (
    <div
      id='theme-commerce'
      className='flex flex-col min-h-screen justify-between'>
      <Style />

      {/* 顶部导航 */}
      <Header {...props} />

      {/* 顶部嵌入 */}
      <div>{headerSlot}</div>

      {/* 主区块 */}
      <main
        id='wrapper'
        className={`${CONFIG.HOME_BANNER_ENABLE ? '' : 'pt-16'} bg-hexo-background-gray dark:bg-black w-full py-8 md:px-8 lg:px-24 relative`}>
        <div
          id='container-inner'
          className={
            (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
              ? 'flex-row-reverse'
              : '') +
            ' w-full mx-auto lg:flex lg:space-x-4 justify-center relative z-10'
          }>
          <div
            className={`${className || ''} w-full h-full max-w-screen-xl overflow-hidden`}>
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
              {/* 主区上部嵌入 */}
              {slotTop}

              {children}
            </Transition>
          </div>

          {slotRight}
        </div>
      </main>

      {/* 悬浮菜单 */}
      <RightFloatArea floatSlot={floatSlot} />

      {/* 页脚 */}
      <Footer {...props} />
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
  const { notice } = props
  return (
    <>
      {/* 产品中心 */}
      <ProductCenter {...props} />

      {/* 首页企业/品牌介绍 这里展示公告 */}
      {notice && (
        <div id='brand-introduction' className='w-full'>
          <div className='w-full text-center text-4xl font-bold pt-12'>
            {notice.title}
          </div>
          <NotionPage post={notice} className='text-2xl text-justify' />
        </div>
      )}

      {/* 铺开导航菜单 */}
    </>
  )
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  return (
    <div className='bg-white border-[#D2232A] p-4'>
      <SlotBar {...props} />
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
    if (currentSearch) {
      replaceSearchResult({
        doms: document.getElementsByClassName('replace'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  })

  return (
    <>
      {!currentSearch ? (
        <SearchNav {...props} />
      ) : (
        <div id='posts-wrapper'>
          {' '}
          {siteConfig('POST_LIST_STYLE') === 'page' ? (
            <BlogPostListPage {...props} />
          ) : (
            <BlogPostListScroll {...props} />
          )}{' '}
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
      <Card className='w-full'>
        <div className='mb-10 pb-20 bg-white md:p-12 p-3 min-h-full dark:bg-hexo-black-gray'>
          {Object.keys(archivePosts).map(archiveTitle => (
            <BlogPostArchive
              key={archiveTitle}
              posts={archivePosts[archiveTitle]}
              archiveTitle={archiveTitle}
            />
          ))}
        </div>
      </Card>
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
  const drawerRight = useRef(null)

  const targetRef = isBrowser
    ? document.getElementById('article-wrapper')
    : null
  const headerImage = post?.pageCover
    ? post.pageCover
    : siteConfig('HOME_BANNER_IMAGE')

  return (
    <>
      <div className='w-full max-w-screen-xl mx-auto lg:hover:shadow lg:border lg:px-2 lg:py-4 bg-white dark:bg-hexo-black-gray dark:border-black article'>
        {lock && <ArticleLock validPassword={validPassword} />}

        {!lock && (
          <div
            id='article-wrapper'
            className='overflow-x-auto flex-grow mx-auto md:w-full md:px-5 '>
            {/* 预览区块 */}

            {post?.type === 'Post' && (
              <div className='flex md:flex-row flex-col w-full justify-between py-4'>
                <div
                  id='left-img'
                  className='md:w-1/2 flex justify-center items-center border'>
                  <LazyImage
                    src={headerImage}
                    className='m-auto w-full h-auto aspect-square object-cover object-center'
                  />
                </div>

                <div id='info-right' className='md:w-1/2 p-4'>
                  <div>{post?.title}</div>
                  <div
                    dangerouslySetInnerHTML={{ __html: post?.summary }}></div>
                </div>
              </div>
            )}

            <hr className='border-2 border-[#D2232A]' />

            <article
              itemScope
              itemType='https://schema.org/Movie'
              className='subpixel-antialiased overflow-y-hidden'>
              {/* Notion文章主体 */}
              <section className='px-5 justify-center mx-auto max-w-2xl lg:max-w-full'>
                {post && <NotionPage post={post} />}
              </section>
            </article>
          </div>
        )}
      </div>

      <div className='block lg:hidden'>
        <TocDrawer post={post} cRef={drawerRight} targetRef={targetRef} />
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
      if (isBrowser) {
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
      <Card className='w-full min-h-screen'>
        <div className='dark:text-gray-200 mb-5 mx-3'>
          <i className='mr-4 fas fa-th' /> {locale.COMMON.CATEGORY}:
        </div>
        <div id='category-list' className='duration-200 flex flex-wrap mx-8'>
          {categoryOptions?.map(category => {
            return (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior>
                <div
                  className={
                    ' duration-300 dark:hover:text-white px-5 cursor-pointer py-2 hover:text-red-400'
                  }>
                  <i className='mr-4 fas fa-folder' /> {category.name}(
                  {category.count})
                </div>
              </Link>
            )
          })}
        </div>
      </Card>
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
      <Card className='w-full'>
        <div className='dark:text-gray-200 mb-5 ml-4'>
          <i className='mr-4 fas fa-tag' /> {locale.COMMON.TAGS}:
        </div>
        <div id='tags-list' className='duration-200 flex flex-wrap ml-8'>
          {tagOptions.map(tag => (
            <div key={tag.name} className='p-2'>
              <TagItemMini key={tag.name} tag={tag} />
            </div>
          ))}
        </div>
      </Card>
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
