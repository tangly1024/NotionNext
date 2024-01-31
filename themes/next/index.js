import CONFIG from './config'
import FloatDarkModeButton from './components/FloatDarkModeButton'
import Footer from './components/Footer'
import JumpToBottomButton from './components/JumpToBottomButton'
import JumpToTopButton from './components/JumpToTopButton'
import SideAreaLeft from './components/SideAreaLeft'
import SideAreaRight from './components/SideAreaRight'
import TopNav from './components/TopNav'
import { useGlobal } from '@/lib/global'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import StickyBar from './components/StickyBar'
import { isBrowser } from '@/lib/utils'
import TocDrawerButton from './components/TocDrawerButton'
import TocDrawer from './components/TocDrawer'
import { ArticleLock } from './components/ArticleLock'
import BlogPostArchive from './components/BlogPostArchive'
import TagItem from './components/TagItem'
import { useRouter } from 'next/router'
import ArticleDetail from './components/ArticleDetail'
import Link from 'next/link'
import BlogListBar from './components/BlogListBar'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import replaceSearchResult from '@/components/Mark'
import CommonHead from '@/components/CommonHead'
import { siteConfig } from '@/lib/config'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'

// 主题全局状态
const ThemeGlobalNext = createContext()
export const useNextGlobal = () => useContext(ThemeGlobalNext)

/**
 * 基础布局 采用左中右三栏布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, headerSlot, rightAreaSlot, meta, post } = props
  const { onLoading } = useGlobal()
  const targetRef = useRef(null)
  const floatButtonGroup = useRef(null)
  const [showRightFloat, switchShow] = useState(false)
  const [percent, changePercent] = useState(0) // 页面阅读百分比
  const scrollListener = () => {
    const targetRef = document.getElementById('wrapper')
    const clientHeight = targetRef?.clientHeight
    const scrollY = window.pageYOffset
    const fullHeight = clientHeight - window.outerHeight
    let per = parseFloat(((scrollY / fullHeight * 100)).toFixed(0))
    if (per > 100) per = 100
    const shouldShow = scrollY > 100 && per > 0

    if (shouldShow !== showRightFloat) {
      switchShow(shouldShow)
    }
    changePercent(per)
  }

  useEffect(() => {
    // facebook messenger 插件需要调整右下角悬浮按钮的高度
    const fb = document.getElementsByClassName('fb-customerchat')
    if (fb.length === 0) {
      floatButtonGroup?.current?.classList.replace('bottom-24', 'bottom-12')
    } else {
      floatButtonGroup?.current?.classList.replace('bottom-12', 'bottom-24')
    }

    document.addEventListener('scroll', scrollListener)
    return () => document.removeEventListener('scroll', scrollListener)
  }, [showRightFloat])

  // 悬浮抽屉
  const drawerRight = useRef(null)
  const floatSlot = <div className='block lg:hidden'>
    <TocDrawerButton onClick={() => {
      drawerRight?.current?.handleSwitchVisible()
    }} />
 </div>

  const tocRef = isBrowser ? document.getElementById('article-wrapper') : null

  const searchModal = useRef(null)

  return (
    <ThemeGlobalNext.Provider value={{ searchModal }}>
        <div id='theme-next'>
            {/* SEO相关 */}
            <CommonHead meta={meta}/>
            <Style/>

            {/* 移动端顶部导航栏 */}
            <TopNav {...props} />

            <AlgoliaSearchModal cRef={searchModal} {...props}/>

            <>{headerSlot}</>

            {/* 顶部黑线装饰 */}
            <div className='h-0.5 w-full bg-gray-700 dark:bg-gray-600 hidden lg:block' />

            {/* 主区 */}
            <main id='wrapper' className={(JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'flex-row-reverse' : '') + ' next relative flex justify-center flex-1 pb-12'}>
                {/* 左侧栏样式 */}
                <SideAreaLeft targetRef={targetRef} {...props} />

                {/* 中央内容 */}
                <section id='container-inner' className={`${siteConfig('NEXT_NAV_TYPE', null, CONFIG) !== 'normal' ? 'mt-24' : ''} lg:max-w-3xl xl:max-w-4xl flex-grow md:mt-0 min-h-screen w-full relative z-10`} ref={targetRef}>
                    <Transition
                        show={!onLoading}
                        appear={true}
                        enter="transition ease-in-out duration-700 transform order-first"
                        enterFrom="opacity-0 translate-y-16"
                        enterTo="opacity-100"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0 -translate-y-16"
                        unmount={false}
                    >
                        {children}
                    </Transition>
                </section>

                {/* 右侧栏样式 */}
                {siteConfig('NEXT_RIGHT_BAR', null, CONFIG) && <SideAreaRight targetRef={targetRef} slot={rightAreaSlot} {...props} />}

            </main>

            {/* 悬浮目录按钮 */}
            {post && <div className='block lg:hidden'>
                <TocDrawer post={post} cRef={drawerRight} targetRef={tocRef} />
            </div>}

            {/* 右下角悬浮 */}
            <div ref={floatButtonGroup} className='right-8 bottom-12 lg:right-2 fixed justify-end z-20 font-sans'>
                <div className={(showRightFloat ? 'animate__animated ' : 'hidden') + ' animate__fadeInUp rounded-md glassmorphism justify-center duration-500  animate__faster flex space-x-2 items-center cursor-pointer '}>
                    <JumpToTopButton percent={percent} />
                    <JumpToBottomButton />
                    <FloatDarkModeButton />
                    {floatSlot}
                </div>
            </div>

            {/* 页脚 */}
            <Footer title={siteConfig('TITLE')} />
        </div>
      </ThemeGlobalNext.Provider>
  )
}

/**
 * 首页
 * 首页就是一个博客列表
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  return <LayoutPostList {...props} />
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = (props) => {
  return <>

        <BlogListBar {...props} />

        {siteConfig('POST_LIST_STYLE') !== 'page'
          ? <BlogPostListScroll {...props} showSummary={true} />
          : <BlogPostListPage {...props} />
        }
    </>
}

/**
 * 搜索
 * @param {*} props
 * @returns
 */
const LayoutSearch = (props) => {
  const { locale } = useGlobal()
  const { posts, keyword } = props

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
            <StickyBar>
                <div className="p-4 dark:text-gray-200">
                    <i className="mr-1 fas fa-search" />{' '}
                    {posts?.length} {locale.COMMON.RESULT_OF_SEARCH}
                </div>
            </StickyBar>
            <div className="md:mt-5">
                {siteConfig('POST_LIST_STYLE') !== 'page'
                  ? <BlogPostListScroll {...props} showSummary={true} />
                  : <BlogPostListPage {...props} />
                }
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
 * 归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = (props) => {
  const { archivePosts } = props

  return (
        <>
            <div className="mb-10 pb-20 bg-white md:p-12 p-3 dark:bg-hexo-black-gray shadow-md min-h-full">
                {Object.keys(archivePosts).map(archiveTitle => (
                    <BlogPostArchive
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
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = (props) => {
  const { post, lock, validPassword } = props
  return (
        <>

            {post && !lock && <ArticleDetail {...props} />}

            {post && lock && <ArticleLock validPassword={validPassword} />}

        </>
  )
}

/**
 * 分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = (props) => {
  const { allPosts, categoryOptions } = props
  const { locale } = useGlobal()
  return (
        <div totalPosts={allPosts} {...props}>
            <div className='bg-white dark:bg-hexo-black-gray px-10 py-10 shadow h-full'>
                <div className='dark:text-gray-200 mb-5'>
                    <i className='mr-4 fas faTh' />{locale.COMMON.CATEGORY}:
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
        </div>
  )
}

/**
 * 标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = (props) => {
  const { tagOptions } = props
  const { locale } = useGlobal()
  return <>
        <div className='bg-white dark:bg-hexo-black-gray px-10 py-10 shadow h-full'>
            <div className='dark:text-gray-200 mb-5'><i className='fas fa-tags mr-4' />{locale.COMMON.TAGS}:</div>
            <div id='tags-list' className='duration-200 flex flex-wrap'>
                {tagOptions.map(tag => {
                  return <div key={tag.name} className='p-2'><TagItem key={tag.name} tag={tag} /></div>
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
  LayoutCategoryIndex,
  LayoutPostList,
  LayoutTagIndex
}
