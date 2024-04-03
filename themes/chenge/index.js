import CONFIG from './config'
import { createContext, useContext, useEffect, useRef } from 'react'
import Footer from './components/Footer'
import SideRight from './components/SideRight'
import TopNav from './components/TopNav'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import Hero from './components/Hero'
import { useRouter } from 'next/router'
import Card from './components/Card'
import RightFloatArea from './components/RightFloatArea'
import SearchNav from './components/SearchNav'
import BlogPostArchive from './components/BlogPostArchive'
import { ArticleLock } from './components/ArticleLock'
import PostHeader from './components/PostHeader'
import CatHeader from './components/CatHeader'
import JumpToCommentButton from './components/JumpToCommentButton'
import TocDrawer from './components/TocDrawer'
import TocDrawerButton from './components/TocDrawerButton'
import Comment from '@/components/Comment'
import NotionPage from '@/components/NotionPage'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import ArticleRecommend from './components/ArticleRecommend'
import ShareBar from '@/components/ShareBar'
import TagItemMini from './components/TagItemMini'
import Link from 'next/link'
import SlotBar from './components/SlotBar'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import replaceSearchResult from '@/components/Mark'
import { siteConfig } from '@/lib/config'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import BlogMemos from './components/BlogMemos'
import AISummary from './components/AISummary'

// 主题全局状态
const ThemeGlobalHexo = createContext()
export const useHexoGlobal = () => useContext(ThemeGlobalHexo)

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { post, children, slotTop, className } = props
  const { onLoading, fullWidth } = useGlobal()

  const router = useRouter()
  const headerPaths = ['/archive', '/category', '/tag','/memos'];
  const headerSlot = post
    ? <PostHeader {...props} />
    : (router.route === '/' && siteConfig('HEXO_HOME_BANNER_ENABLE', null, CONFIG)
        ? <Hero {...props} />
        : (headerPaths.includes(router.route)
        ? <CatHeader {...props} />
        : null))

  const drawerRight = useRef(null)
  const tocRef = isBrowser ? document.getElementById('article-wrapper') : null

  const floatSlot = <>
        {post && <div className="block lg:hidden">
            <TocDrawerButton
                onClick={() => {
                  drawerRight?.current?.handleSwitchVisible()
                }}
            />
        </div>}
        {post && <JumpToCommentButton />}
    </>

  // Algolia搜索框
  const searchModal = useRef(null)

  return (
    <ThemeGlobalHexo.Provider value={{ searchModal }}>
        <div id='theme-hexo' className="bg-hexo-background">
            <Style/>

            {/* 顶部导航 */}
            <TopNav {...props} />

            {/* 顶部嵌入 */}
            <Transition
                show={!onLoading}
                appear={true}
                enter="transition ease-in-out duration-700 transform order-first"
                enterFrom="opacity-0 -translate-y-0"
                enterTo="opacity-100"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="opacity-100"
                leaveTo="opacity-0 translate-y-0"
                unmount={false}
            >
                {headerSlot}
            </Transition>

            {/* 主区块 */}
            <main id="wrapper" className={`${siteConfig('HEXO_HOME_BANNER_ENABLE', null, CONFIG) ? '' : 'pt-16'} bg-hexo-background w-full px-2 sm:px-6 lg:px-8 pt-8 min-h-screen relative`}>
                <div id="container-inner" className={(JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE')) ? 'flex-row-reverse' : '') + 'lg:max-w-75p mx-auto lg:flex lg:space-x-4 justify-center relative z-10'} >
                    <div id="content-wrapper" className={`w-full ${className || ''} ${fullWidth ? '' : 'lg:max-w-custom'} h-full rounded-md overflow-hidden ${post ? 'shadow-main' : ''}`}>

                        <Transition
                            show={!onLoading}
                            appear={true}
                            enter="transition ease-in-out duration-700 transform order-first"
                            enterFrom="opacity-0 translate-y-0"
                            enterTo="opacity-100"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 -translate-y-0"
                            unmount={false}
                        >
                            {/* 主区上部嵌入 */}
                            {slotTop}

                            {children}
                        </Transition>
                    </div>

                    {/* 右侧栏 */}
                    <SideRight {...props} className={`space-y-4 lg:w-60 pt-4 ${post ? 'lg:pt-0' : 'lg:pt-4'}`} />
                </div>
            </main>

            <div className='block lg:hidden'>
              <TocDrawer props={props} post={post} cRef={drawerRight} targetRef={tocRef} />
            </div>

            {/* 悬浮菜单 */}
            <RightFloatArea floatSlot={floatSlot} />

            {/* 全文搜索 */}
            <AlgoliaSearchModal cRef={searchModal} {...props}/>

            {/* 页脚 */}
            <Footer title={siteConfig('TITLE')} fullWidth={fullWidth} />
        </div>
    </ThemeGlobalHexo.Provider>
  )
}

/**
 * 首页
 * 是一个博客列表，嵌入一个Hero大图
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  return <LayoutPostList {...props} className='pt-8' />
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = (props) => {
  return <div className='pt-8'>
        <SlotBar {...props} />
        {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
    </div>
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
        <div className='pt-8'>
            {!currentSearch
              ? <SearchNav {...props} />
              : <div id="posts-wrapper"> {siteConfig('POST_LIST_STYLE') === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}  </div>}
        </div>
  )
}

/**
 * 归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = (props) => {
  const { archivePosts } = props
  return <div className='pt-8'>
        <Card className='w-full'>
            <div className="mb-10 md:p-5 p-3 min-h-full ">
                {Object.keys(archivePosts).map(archiveTitle => (
                    <BlogPostArchive
                        key={archiveTitle}
                        posts={archivePosts[archiveTitle]}
                        archiveTitle={archiveTitle}
                    />
                ))}
            </div>
        </Card>
    </div>
}

/**
 * 说说
 * @param {*} props
 * @returns
 */
const LayoutMemos = (props) => {
  const memoPageInfo = {
    id: "9e6c78642def47bcbabe35f526307639", // 固定ID，确保唯一性
    type: "Memos",
    title: "我的说说",
  };
  return  (
  <div className="w-full lg:hover:shadow rounded-md lg:rounded-md lg:px-2 lg:py-4 article">
    <div id="article-wrapper" className="overflow-x-auto flex-grow mx-auto md:w-full px-3 font-serif">
      <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased overflow-y-hidden overflow-x-hidden" >
        {/* Notion文章主体 */}
        <section className='justify-center mx-auto max-w-2xl lg:max-w-full'>
            <BlogMemos {...props}/>
        </section>
      </article>
      <div className='pt-4 border-dashed'></div>
      {/* 评论互动 */}
      <div className="duration-200 overflow-x-auto px-3">
        <Comment frontMatter={memoPageInfo} />
      </div>
    </div>
  </div>)
}

/**
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props

  return (
        <>
            <div className="w-full lg:hover:shadow rounded-md lg:rounded-md lg:px-2 lg:py-4 article">
                {lock && <ArticleLock validPassword={validPassword} />}

                {!lock && <div id="article-wrapper" className="overflow-x-auto flex-grow mx-auto md:w-full px-3 font-serif">

                    <article itemScope itemType="https://schema.org/Movie" className="subpixel-antialiased overflow-y-hidden" >
                        {/* Notion文章主体 */}
                        <section className='justify-center mx-auto max-w-2xl lg:max-w-full'>
                          {post && <AISummary post={post} />}
                          {post && <NotionPage post={post} />}
                        </section>

                        {/* 分享 */}
                        <ShareBar post={post} />
                        {post?.type === 'Post' && <>
                            <ArticleCopyright {...props} />
                            <ArticleRecommend {...props} />
                            <ArticleAdjacent {...props} />
                        </>}

                    </article>

                    <div className='pt-4 border-dashed'></div>

                    {/* 评论互动 */}
                    <div className="duration-200 overflow-x-auto px-3">
                        <Comment frontMatter={post} />
                    </div>
                </div>}
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
            <div className="text-black w-full h-screen text-center justify-center content-center items-center flex flex-col">
                <div className="dark:text-gray-200">
                    <h2 className="inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top">
                        404
                    </h2>
                    <div className="inline-block text-left h-32 leading-10 items-center">
                        <h2 className="m-0 p-0">页面未找到</h2>
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
        <div className='mt-8'>
            <Card className="w-full min-h-screen">
                <div className="dark:text-gray-200 mb-5 mx-3">
                    <i className="mr-4 fas fa-th" />  {locale.COMMON.CATEGORY}:
                </div>
                <div id="category-list" className="duration-200 flex flex-wrap mx-8">
                    {categoryOptions?.map(category => {
                      return (
                            <Link key={category.name} href={`/category/${category.name}`} passHref legacyBehavior>
                                <div className={' duration-300 dark:hover:text-white px-5 cursor-pointer py-2 hover:text-indigo-400'}>
                                    <i className="mr-4 fas fa-folder" />  {category.name}({category.count})
                                </div>
                            </Link>
                      )
                    })}
                </div>
            </Card>
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
        <div className='mt-8'>
            <Card className='w-full'>
                <div className="dark:text-gray-200 mb-5 ml-4">
                    <i className="mr-4 fas fa-tag" /> {locale.COMMON.TAGS}:
                </div>
                <div id="tags-list" className="duration-200 flex flex-wrap ml-8">
                    {tagOptions.map(tag => <div key={tag.name} className="p-2">
                        <TagItemMini key={tag.name} tag={tag} />
                    </div>)}
                </div>
            </Card>
        </div>
  )
}

export {
  CONFIG as THEME_CONFIG,
  LayoutBase,
  LayoutIndex,
  LayoutSearch,
  LayoutArchive,
  LayoutMemos,
  LayoutSlug,
  Layout404,
  LayoutCategoryIndex,
  LayoutPostList,
  LayoutTagIndex
}
