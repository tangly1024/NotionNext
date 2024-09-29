'use client'

/**
 * # NAV 主题说明
 * 主题开发者 [emengweb](https://github.com/emengweb)
 * 开启方式 在blog.config.js 将主题配置为 `NAV`
 */

import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import Live2D from '@/components/Live2D'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import Announcement from './components/Announcement'
import { ArticleLock } from './components/ArticleLock'
import BlogArchiveItem from './components/BlogArchiveItem'
import BlogPostCard from './components/BlogPostCard'
import BlogPostListAll from './components/BlogPostListAll'
import CategoryItem from './components/CategoryItem'
import FloatButtonCatalog from './components/FloatButtonCatalog'
import Footer from './components/Footer'
import JumpToTopButton from './components/JumpToTopButton'
import LogoBar from './components/LogoBar'
import { MenuItem } from './components/MenuItem'
import PageNavDrawer from './components/PageNavDrawer'
import TagItemMini from './components/TagItemMini'
import TocDrawer from './components/TocDrawer'
import TopNavBar from './components/TopNavBar'
import CONFIG from './config'
import { Style } from './style'

const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })

// 主题全局变量
const ThemeGlobalNav = createContext()
export const useNavGlobal = () => useContext(ThemeGlobalNav)

/**
 * 基础布局
 * 采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const {
    customMenu,
    children,
    post,
    allNavPages,
    categoryOptions,
    slotLeft,
    slotTop
  } = props
  const { onLoading } = useGlobal()
  const [tocVisible, changeTocVisible] = useState(false)
  const [pageNavVisible, changePageNavVisible] = useState(false)
  const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)

  const showTocButton = post?.toc?.length > 1

  useEffect(() => {
    setFilteredNavPages(allNavPages)
  }, [post])

  let links = customMenu

  // 默认使用自定义菜单，否则将遍历所有的category生成菜单
  if (!siteConfig('NAV_USE_CUSTOM_MENU', null, CONFIG)) {
    links =
      categoryOptions &&
      categoryOptions?.map(c => {
        return {
          id: c.name,
          title: `# ${c.name}`,
          href: `/category/${c.name}`,
          show: true
        }
      })
  }

  return (
    <ThemeGlobalNav.Provider
      value={{
        tocVisible,
        changeTocVisible,
        filteredNavPages,
        setFilteredNavPages,
        allNavPages,
        pageNavVisible,
        changePageNavVisible,
        categoryOptions
      }}>
      {/* 样式 */}
      <Style />

      {/* 主题样式根基 */}
      <div
        id='theme-onenav'
        className={`${siteConfig('FONT_STYLE')} dark:bg-hexo-black-gray w-full h-screen min-h-screen justify-center dark:text-gray-300 scroll-smooth`}>
        {/* 端顶部导航栏 */}
        <TopNavBar {...props} />

        {/* 左右布局区块 */}
        <main
          id='wrapper'
          className={
            (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
              ? 'flex-row-reverse'
              : '') + ' relative flex justify-between w-full h-screen mx-auto'
          }>
          {/* 左侧推拉抽屉 */}
          <div
            className={
              ' hidden md:block dark:border-transparent relative z-10 mx-4 w-52 max-h-full pb-44'
            }>
            {/* 图标Logo */}
            <div className='hidden md:block w-full top-0 left-5 md:left-4 z-40 pt-3 md:pt-4'>
              <LogoBar {...props} />
            </div>
            <div className='main-menu z-20 pl-9 pr-7 pb-5 sticky pt-1 top-20 overflow-y-scroll h-fit max-h-full scroll-hidden bg-white dark:bg-neutral-800 rounded-xl '>
              {/* 嵌入 */}
              {slotLeft}

              <div className='grid pt-2'>
                {/* 显示菜单 */}
                {links &&
                  links?.map((link, index) => (
                    <MenuItem key={index} link={link} />
                  ))}
              </div>
            </div>

            {/* 页脚站点信息 */}
            <div className='w-56 fixed left-0 bottom-0 z-0'>
              <Live2D />
              <Footer {...props} />
            </div>
          </div>

          {/* 右侧主要内容区块 */}
          <div
            id='center-wrapper'
            className='flex flex-col justify-between w-full relative z-10 pt-20 md:pt-5 pb-8 min-h-screen overflow-y-auto'>
            <div
              id='container-inner'
              className='w-full px-6 pb-6 md:pb-20 max-w-8xl justify-center mx-auto'>
              {slotTop}
              {/* 广告植入 */}
              <WWAds className='w-full' orientation='horizontal' />

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
                {children}
              </Transition>

              {/* Google广告 */}
              <AdSlot type='in-article' />
              <WWAds className='w-full' orientation='horizontal' />

              {/* 回顶按钮 */}
              <JumpToTopButton />
            </div>

            {/* 底部 */}
            <div className='md:hidden'>
              <Footer {...props} />
            </div>
          </div>
        </main>

        {/* 移动端悬浮目录按钮 */}
        {showTocButton && !tocVisible && (
          <div className='md:hidden fixed right-0 bottom-52 z-30 bg-white border-l border-t border-b dark:border-neutral-800 rounded'>
            <FloatButtonCatalog {...props} />
          </div>
        )}

        {/* 移动端导航抽屉 */}
        <PageNavDrawer {...props} filteredNavPages={filteredNavPages} />
      </div>
    </ThemeGlobalNav.Provider>
  )
}

/**
 * 首页
 * @param {*} props
 * @returns 此主题首页就是列表
 */
const LayoutIndex = props => {
  return <LayoutPostListIndex {...props} />
}

/**
 * 首页列表
 * @param {*} props
 * @returns
 */
const LayoutPostListIndex = props => {
  // const { customMenu, children, post, allNavPages, categoryOptions, slotLeft, slotRight, slotTop, meta } = props
  // const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)
  return (
    <>
      <Announcement {...props} />
      <BlogPostListAll {...props} />
    </>
  )
}

/**
 * 文章列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  const { posts } = props
  // 顶部如果是按照分类或标签查看文章列表，列表顶部嵌入一个横幅
  // 如果是搜索，则列表顶部嵌入 搜索框
  return (
    <>
      <div className='w-full max-w-7xl mx-auto justify-center mt-8'>
        <div
          id='posts-wrapper'
          class='card-list grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {posts?.map(post => (
            <BlogPostCard key={post.id} post={post} className='card' />
          ))}
        </div>
      </div>
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
      {/* 文章锁 */}
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && (
        <div id='container'>
          {/* title */}
          <h1 className='text-3xl pt-4 md:pt-12  dark:text-gray-300'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post?.pageIcon} />
            )}
            {post?.title}
          </h1>

          {/* Notion文章主体 */}
          {post && (
            <section className='px-1'>
              <div id='article-wrapper'>
                <NotionPage post={post} />
              </div>

              {/* 分享 */}
              {/* <ShareBar post={post} /> */}
              {/* 文章分类和标签信息 */}
              <div className='flex justify-between'>
                {CONFIG.POST_DETAIL_CATEGORY && post?.category && (
                  <CategoryItem category={post.category} />
                )}
                <div>
                  {CONFIG.POST_DETAIL_TAG &&
                    post?.tagItems?.map(tag => (
                      <TagItemMini key={tag.name} tag={tag} />
                    ))}
                </div>
              </div>

              {/* 上一篇、下一篇文章 */}
              {/* {post?.type === 'Post' && <ArticleAround prev={prev} next={next} />} */}

              <AdSlot />
              <WWAds className='w-full' orientation='horizontal' />

              <Comment frontMatter={post} />
            </section>
          )}

          <TocDrawer {...props} />
        </div>
      )}
    </>
  )
}

/**
 * 没有搜索
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  return <></>
}

/**
 * 归档页面基本不会用到
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <>
      <div className='mb-10 pb-20 md:py-12 p-3  min-h-screen w-full'>
        {Object.keys(archivePosts).map(archiveTitle => (
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
 */
const LayoutTagIndex = props => {
  return <></>
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
