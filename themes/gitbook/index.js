'use client'

import CONFIG from './config'
import { useRouter } from 'next/router'
import { useEffect, useState, createContext, useContext, useRef } from 'react'
import { isBrowser } from '@/lib/utils'
import Footer from './components/Footer'
import InfoCard from './components/InfoCard'
import RevolverMaps from './components/RevolverMaps'
import TopNavBar from './components/TopNavBar'
import SearchInput from './components/SearchInput'
import { useGlobal } from '@/lib/global'
import Live2D from '@/components/Live2D'
import NavPostList from './components/NavPostList'
import ArticleInfo from './components/ArticleInfo'
import Catalog from './components/Catalog'
import Announcement from './components/Announcement'
import PageNavDrawer from './components/PageNavDrawer'
import FloatTocButton from './components/FloatTocButton'
import { AdSlot } from '@/components/GoogleAdsense'
import JumpToTopButton from './components/JumpToTopButton'
import ShareBar from '@/components/ShareBar'
import CategoryItem from './components/CategoryItem'
import TagItemMini from './components/TagItemMini'
import ArticleAround from './components/ArticleAround'
import Comment from '@/components/Comment'
import TocDrawer from './components/TocDrawer'
import NotionPage from '@/components/NotionPage'
import { ArticleLock } from './components/ArticleLock'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import BlogArchiveItem from './components/BlogArchiveItem'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { siteConfig } from '@/lib/config'
import NotionIcon from '@/components/NotionIcon'

const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })

// 主题全局变量
const ThemeGlobalGitbook = createContext()
export const useGitBookGlobal = () => useContext(ThemeGlobalGitbook)

/**
 * 给最新的文章标一个红点
 */
function getNavPagesWithLatest(allNavPages, latestPosts, post) {
  // localStorage 保存id和上次阅读时间戳： posts_read_time = {"${post.id}":"Date()"}
  const postReadTime = JSON.parse(localStorage.getItem('post_read_time') || '{}');
  if (post) {
    postReadTime[post.id] = new Date().getTime();
  }
  // 更新
  localStorage.setItem('post_read_time', JSON.stringify(postReadTime));

  return allNavPages?.map(item => {
    const res = {
      id: item.id,
      title: item.title || '',
      pageCoverThumbnail: item.pageCoverThumbnail || '',
      category: item.category || null,
      tags: item.tags || null,
      summary: item.summary || null,
      slug: item.slug,
      pageIcon: item.pageIcon || '',
      lastEditedDate: item.lastEditedDate
    }
    // 属于最新文章通常6篇 && (无阅读记录 || 最近更新时间大于上次阅读时间)
    if (latestPosts.some(post => post.id === item.id) &&
    (!postReadTime[item.id] || postReadTime[item.id] < new Date(item.lastEditedDate).getTime())
    ) {
      return { ...res, isLatest: true };
    } else {
      return res;
    }
  })
}

/**
 * 基础布局
 * 采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, post, allNavPages, latestPosts, slotLeft, slotRight, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const router = useRouter()
  const [tocVisible, changeTocVisible] = useState(false)
  const [pageNavVisible, changePageNavVisible] = useState(false)
  const [filteredNavPages, setFilteredNavPages] = useState(allNavPages)

  const showTocButton = post?.toc?.length > 1
  const searchModal = useRef(null)

  useEffect(() => {
    setFilteredNavPages(getNavPagesWithLatest(allNavPages, latestPosts, post))
  }, [router])

  return (
        <ThemeGlobalGitbook.Provider value={{ searchModal, tocVisible, changeTocVisible, filteredNavPages, setFilteredNavPages, allNavPages, pageNavVisible, changePageNavVisible }}>
            <Style/>

            <div id='theme-gitbook' className={`${siteConfig('FONT_STYLE')} scroll-smooth bg-white dark:bg-hexo-black-gray w-full h-full min-h-screen justify-center dark:text-gray-300`}>
                <AlgoliaSearchModal cRef={searchModal} {...props}/>

                {/* 顶部导航栏 */}
                <TopNavBar {...props} />

                <main id='wrapper' className={(JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'flex-row-reverse' : '') + 'relative flex justify-between w-full h-full mx-auto'}>

                    {/* 左侧推拉抽屉 */}
                    {fullWidth
                      ? null
                      : (<div className={'hidden md:block border-r dark:border-transparent relative z-10 dark:bg-hexo-black-gray'}>
                        <div className='w-72 py-14 px-6 sticky top-0 overflow-y-scroll h-screen scroll-hidden'>
                            {slotLeft}
                            <SearchInput className='my-3 rounded-md' />
                            <div className='mb-20'>
                                {/* 所有文章列表 */}
                                <NavPostList filteredNavPages={filteredNavPages} />
                            </div>

                        </div>

                        <div className='w-72 fixed left-0 bottom-0 z-20 bg-white'>
                            <Footer {...props} />
                        </div>
                    </div>) }

                    <div id='center-wrapper' className='flex flex-col justify-between w-full relative z-10 pt-14 min-h-screen dark:bg-black'>

                        <div id='container-inner' className={`w-full px-7 ${fullWidth ? 'px-10' : 'max-w-3xl'} justify-center mx-auto`}>
                            {slotTop}
                            <WWAds className='w-full' orientation='horizontal'/>

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
                                {children}
                            </Transition>

                            {/* Google广告 */}
                            <AdSlot type='in-article' />
                            <WWAds className='w-full' orientation='horizontal'/>

                            {/* 回顶按钮 */}
                            <JumpToTopButton />
                        </div>

                        {/* 底部 */}
                        <div className='md:hidden'>
                            <Footer {...props} />
                        </div>
                    </div>

                    {/*  右侧侧推拉抽屉 */}
                    {fullWidth
                      ? null
                      : <div style={{ width: '20rem' }} className={'hidden xl:block dark:border-transparent flex-shrink-0 relative z-10 '}>
                      <div className='py-14 px-6 sticky top-0'>
                          <ArticleInfo post={props?.post ? props?.post : props.notice} />

                          <div className='py-4'>
                              <Catalog {...props} />
                              {slotRight}
                              {router.route === '/' && <>
                                  <InfoCard {...props} />
                                  {siteConfig('GITBOOK_WIDGET_REVOLVER_MAPS', null, CONFIG) === 'true' && <RevolverMaps />}
                                  <Live2D />
                              </>}
                              {/* gitbook主题首页只显示公告 */}
                              <Announcement {...props} />
                          </div>

                          <AdSlot type='in-article' />
                          <Live2D />

                      </div>
                  </div>}

                </main>

                {/* 移动端悬浮目录按钮 */}
                {showTocButton && !tocVisible && <div className='md:hidden fixed right-0 bottom-52 z-30 bg-white border-l border-t border-b dark:border-gray-800 rounded'>
                    <FloatTocButton {...props} />
                </div>}

                {/* 移动端导航抽屉 */}
                <PageNavDrawer {...props} filteredNavPages={filteredNavPages} />

                {/* 移动端底部导航栏 */}
                {/* <BottomMenuBar {...props} className='block md:hidden' /> */}

            </div>
        </ThemeGlobalGitbook.Provider>
  )
}

/**
 * 首页
 * 重定向到某个文章详情页
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  const router = useRouter()
  useEffect(() => {
    router.push(siteConfig('GITBOOK_INDEX_PAGE', null, CONFIG)).then(() => {
      // console.log('跳转到指定首页', siteConfig('INDEX_PAGE', null, CONFIG))
      setTimeout(() => {
        if (isBrowser) {
          const article = document.getElementById('notion-article')
          if (!article) {
            console.log('请检查您的Notion数据库中是否包含此slug页面： ', siteConfig('GITBOOK_INDEX_PAGE', null, CONFIG))
            const containerInner = document.querySelector('#theme-gitbook #container-inner')
            const newHTML = `<h1 class="text-3xl pt-12  dark:text-gray-300">配置有误</h1><blockquote class="notion-quote notion-block-ce76391f3f2842d386468ff1eb705b92"><div>请在您的notion中添加一个slug为${siteConfig('GITBOOK_INDEX_PAGE', null, CONFIG)}的文章</div></blockquote>`
            containerInner?.insertAdjacentHTML('afterbegin', newHTML)
          }
        }
      }, 7 * 1000)
    })
  }, [])

  return <></>
}

/**
 * 文章列表 无
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutPostList = (props) => {
  return <></>
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = (props) => {
  const { post, prev, next, lock, validPassword } = props
  const router = useRouter()
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(() => {
        if (isBrowser) {
          const article = document.getElementById('notion-article')
          if (!article) {
            router.push('/404').then(() => {
              console.warn('找不到页面', router.asPath)
            })
          }
        }
      }, siteConfig('POST_WAITING_TIME_FOR_404') * 1000)
    }
  }, [post])
  return (
        <>
            {/* 文章锁 */}
            {lock && <ArticleLock validPassword={validPassword} />}

            {!lock && <div id='container'>

                {/* title */}
                <h1 className="text-3xl pt-12  dark:text-gray-300">{siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}{post?.title}</h1>

                {/* Notion文章主体 */}
                {post && (<section id="article-wrapper" className="px-1">
                    <NotionPage post={post} />

                    {/* 分享 */}
                    <ShareBar post={post} />
                    {/* 文章分类和标签信息 */}
                    <div className='flex justify-between'>
                        {siteConfig('POST_DETAIL_CATEGORY', null, CONFIG) && post?.category && <CategoryItem category={post.category} />}
                        <div>
                            {siteConfig('POST_DETAIL_TAG', null, CONFIG) && post?.tagItems?.map(tag => <TagItemMini key={tag.name} tag={tag} />)}
                        </div>
                    </div>

                    {post?.type === 'Post' && <ArticleAround prev={prev} next={next} />}

                    <AdSlot />
                    <WWAds className='w-full' orientation='horizontal'/>

                    <Comment frontMatter={post} />
                </section>)}

                <TocDrawer {...props} />
            </div>}
        </>
  )
}

/**
 * 没有搜索
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutSearch = (props) => {
  return <></>
}

/**
 * 归档页面基本不会用到
 * 全靠页面导航
 * @param {*} props
 * @returns
 */
const LayoutArchive = (props) => {
  const { archivePosts } = props

  return <>
        <div className="mb-10 pb-20 md:py-12 py-3  min-h-full">
            {Object.keys(archivePosts)?.map(archiveTitle => <BlogArchiveItem key={archiveTitle} archiveTitle={archiveTitle} archivePosts={archivePosts} />)}
        </div>
  </>
}

/**
 * 404
 */
const Layout404 = props => {
  return <>
        <div className='w-full h-96 py-80 flex justify-center items-center'>404 Not found.</div>
    </>
}

/**
 * 分类列表
 */
const LayoutCategoryIndex = (props) => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  return <>
     <div className='bg-white dark:bg-gray-700 py-10'>
                <div className='dark:text-gray-200 mb-5'>
                    <i className='mr-4 fas fa-th' />{locale.COMMON.CATEGORY}:
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
                                    className={'hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'}>
                                    <i className='mr-4 fas fa-folder' />{category.name}({category.count})
                                </div>
                            </Link>
                      )
                    })}
                </div>
            </div>
  </>
}

/**
 * 标签列表
 */
const LayoutTagIndex = (props) => {
  const { tagOptions } = props
  const { locale } = useGlobal()

  return <>
     <div className="bg-white dark:bg-gray-700 py-10">
                <div className="dark:text-gray-200 mb-5">
                    <i className="mr-4 fas fa-tag" />
                    {locale.COMMON.TAGS}:
                </div>
                <div id="tags-list" className="duration-200 flex flex-wrap">
                    {tagOptions?.map(tag => {
                      return (
                            <div key={tag.name} className="p-2">
                                <TagItemMini key={tag.name} tag={tag} />
                            </div>
                      )
                    })}
                </div>
            </div>
  </>
}

export {
  CONFIG as THEME_CONFIG,
  LayoutBase,
  LayoutIndex,
  LayoutSearch,
  LayoutArchive,
  LayoutSlug,
  Layout404,
  LayoutPostList,
  LayoutCategoryIndex,
  LayoutTagIndex
}
