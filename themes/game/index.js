/* eslint-disable @next/next/no-img-element */
import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { PWA as initialPWA } from '@/components/PWA'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { deepClone, isBrowser, shuffleArray } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Announcement from './components/Announcement'
import { ArticleLock } from './components/ArticleLock'
import BlogArchiveItem from './components/BlogArchiveItem'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import BlogPostBar from './components/BlogPostBar'
import { Footer } from './components/Footer'
import GameEmbed from './components/GameEmbed'
import { GameListIndexCombine } from './components/GameListIndexCombine'
import { GameListRelate } from './components/GameListRealate'
import { GameListRecent } from './components/GameListRecent'
import GroupCategory from './components/GroupCategory'
import GroupTag from './components/GroupTag'
import Header from './components/Header'
import { MenuList } from './components/MenuList'
import PostInfo from './components/PostInfo'
import SideBarContent from './components/SideBarContent'
import SideBarDrawer from './components/SideBarDrawer'
import CONFIG from './config'
import { Style } from './style'

// const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })

// 主题全局状态
const ThemeGlobalGame = createContext()
export const useGameGlobal = () => useContext(ThemeGlobalGame)

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏

 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const {
    allNavPages,
    children,
    siteInfo,
    tagOptions,
    currentTag,
    categoryOptions,
    currentCategory
  } = props
  const searchModal = useRef(null)
  // 在列表中进行实时过滤
  const [filterKey, setFilterKey] = useState('')

  const [filterGames, setFilterGames] = useState(
    deepClone(
      allNavPages?.filter(item =>
        item.tags?.some(
          t => t === siteConfig('GAME_RECOMMEND_TAG', 'Recommend', CONFIG)
        )
      )
    )
  )
  const [recentGames, setRecentGames] = useState([])
  const [sideBarVisible, setSideBarVisible] = useState(false)

  useEffect(() => {
    loadWowJS()
  }, [])

  return (
    <ThemeGlobalGame.Provider
      value={{
        searchModal,
        filterKey,
        setFilterKey,
        recentGames,
        setRecentGames,
        filterGames,
        setFilterGames,
        sideBarVisible,
        setSideBarVisible
      }}>
      <div
        id='theme-game'
        className={`${siteConfig('FONT_STYLE')} w-full h-full min-h-screen justify-center dark:bg-black dark:bg-opacity-50 dark:text-gray-300 scroll-smooth`}>
        <Style />

        {/* 左右布局 */}
        <div
          id='wrapper'
          className={'relative flex justify-between w-full h-full mx-auto'}>
          {/* PC端左侧 */}
          <div className='w-52 hidden xl:block relative z-10'>
            <div className='py-4 px-2 sticky top-0 h-screen flex flex-col justify-between'>
              <div className='select-none'>
                {/* 抬头logo等 */}
                <Header siteInfo={siteInfo} />
                {/* 菜单栏 */}
                <MenuList {...props} />
              </div>

              {/* 左侧广告栏目 */}
              <div className='w-full'>
                <AdSlot />
              </div>
            </div>
          </div>

          {/* 右侧 */}
          <main className='flex-grow w-full h-full flex flex-col min-h-screen overflow-x-auto md:p-2'>
            <div className='flex-grow h-full'>{children}</div>
            {/* 广告 */}
            <div className='w-full py-4'>
              <AdSlot type='in-article' />
            </div>

            {/* 主区域下方 导览 */}
            <div className='w-full bg-white dark:bg-hexo-black-gray rounded-lg p-2'>
              {/* 标签汇总             */}
              <GroupCategory
                categoryOptions={categoryOptions}
                currentCategory={currentCategory}
              />
              <hr />
              <GroupTag tagOptions={tagOptions} currentTag={currentTag} />
              {/* 站点公告信息 */}
              <Announcement {...props} className='p-2' />
            </div>
            <Footer />
          </main>
        </div>

        <SideBarDrawer
          isOpen={sideBarVisible}
          onClose={() => {
            setSideBarVisible(false)
          }}>
          <SideBarContent siteInfo={siteInfo} {...props} />
        </SideBarDrawer>
      </div>
    </ThemeGlobalGame.Provider>
  )
}

/**
 * 首页
 * 首页是个博客列表，加上顶部嵌入一个公告
 * @param {*} props
 * @returns
 */
const LayoutIndex = props => {
  const { siteInfo } = props
  return (
    <>
      {/* 首页移动端顶部导航 */}
      <div className='p-2 xl:hidden'>
        <Header siteInfo={siteInfo} />
      </div>
      {/* 最近游戏 */}
      <GameListRecent />
      {/* 游戏列表 */}
      <LayoutPostList {...props} />
    </>
  )
}

/**
 * 博客列表
 * @param {*} props
 * @returns
 */
const LayoutPostList = props => {
  const { posts } = props
  const { filterKey } = useGameGlobal()
  let filteredBlogPosts = []
  if (filterKey && posts) {
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(filterKey.toLowerCase())
    })
  } else {
    filteredBlogPosts = deepClone(posts)
  }

  return (
    <>
      <BlogPostBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage posts={filteredBlogPosts} {...props} />
      ) : (
        <BlogListScroll posts={filteredBlogPosts} {...props} />
      )}
    </>
  )
}

/**
 * 搜索
 * 页面是博客列表，上方嵌入一个搜索引导条
 * @param {*} props
 * @returns
 */
const LayoutSearch = props => {
  const { keyword, posts } = props
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

  // 在列表中进行实时过滤
  const { filterKey } = useGameGlobal()
  let filteredBlogPosts = []
  if (filterKey && posts) {
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post?.tags ? post?.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(filterKey.toLowerCase())
    })
  } else {
    filteredBlogPosts = deepClone(posts)
  }

  return (
    <>
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage {...props} posts={filteredBlogPosts} />
      ) : (
        <BlogListScroll {...props} posts={filteredBlogPosts} />
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
 * 文章详情
 * @param {*} props
 * @returns
 */
const LayoutSlug = props => {
  const { setRecentGames } = useGameGlobal()
  const { post, siteInfo, allNavPages, recommendPosts, lock, validPassword } =
    props

  const relateGames = recommendPosts
  const randomGames = shuffleArray(deepClone(allNavPages))

  // 初始化可安装应用
  initialPWA(post, siteInfo)

  useEffect(() => {
    // 更新最新游戏
    const recentGames = localStorage.getItem('recent_games')
      ? JSON.parse(localStorage.getItem('recent_games'))
      : []

    const existedIndex = recentGames.findIndex(item => item?.id === post?.id)
    if (existedIndex === -1) {
      recentGames.unshift(post) // 将游戏插入到数组头部
    } else {
      // 如果游戏已存在于数组中，将其移至数组头部
      const existingGame = recentGames.splice(existedIndex, 1)[0]
      recentGames.unshift(existingGame)
    }
    localStorage.setItem('recent_games', JSON.stringify(recentGames))

    setRecentGames(recentGames)
  }, [post])

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div id='article-wrapper'>
          <div className='game-detail-wrapper w-full grow flex'>
            <div className={`w-full md:py-2`}>
              {/* 游戏窗口 */}
              <GameEmbed post={post} siteInfo={siteInfo} />

              {/* 资讯 */}
              <div className='game-info  dark:text-white py-2 px-2 md:px-0 mt-14 md:mt-0'>
                {/* 关联游戏 */}
                <div className='w-full'>
                  <GameListRelate posts={relateGames} />
                </div>

                {/* 详情描述 */}
                {post && (
                  <div className='bg-white shadow-md my-2 p-4 rounded-md dark:bg-black'>
                    <PostInfo post={post} />
                    <NotionPage post={post} />
                    {/* 广告嵌入 */}
                    <AdSlot />
                    {/* 分享栏目 */}
                    <ShareBar post={post} />
                    {/* 评论区 */}
                    <Comment frontMatter={post} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 其它游戏列表 */}
          <GameListIndexCombine posts={randomGames} />
        </div>
      )}
    </>
  )
}

/**
 * 404 页面
 * @param {*} props
 * @returns
 */
const Layout404 = props => {
  const router = useRouter()
  const { locale } = useGlobal()
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

  return (
    <>
      <div className='md:-mt-20 text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
        <div className='dark:text-gray-200'>
          <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'>
            <i className='mr-2 fas fa-spinner animate-spin' />
            404
          </h2>
          <div className='inline-block text-left h-32 leading-10 items-center'>
            <h2 className='m-0 p-0'>{locale.NAV.PAGE_NOT_FOUND_REDIRECT}</h2>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * 文章分类列表
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props

  return (
    <>
      <div
        id='category-list'
        className='duration-200 flex flex-wrap my-4 gap-2'>
        {categoryOptions?.map(category => {
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior>
              <div
                className={
                  'bg-white rounded-lg hover:text-black dark:hover:text-white dark:text-gray-300 dark:hover:bg-gray-600 px-5 cursor-pointer py-2 hover:bg-gray-100'
                }>
                {/* <i className='mr-4 fas fa-folder' /> */}
                {category.name}({category.count})
              </div>
            </SmartLink>
          )
        })}
      </div>
    </>
  )
}

/**
 * 文章标签列表
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <>
      <div>
        <div id='tags-list' className='duration-200 flex flex-wrap my-4 gap-2'>
          {tagOptions.map(tag => {
            return (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                passHref
                className={` select-none cursor-pointer flex bg-white rounded-lg hover:bg-gray-500 hover:text-white duration-200 mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white  hover:shadow-xl  dark:bg-gray-800`}>
                <i className='mr-1 fas fa-tag' />{' '}
                {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
              </SmartLink>
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
