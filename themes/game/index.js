/* eslint-disable @next/next/no-img-element */
import Comment from '@/components/Comment'
import { Draggable } from '@/components/Draggable'
import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { PWA as initialPWA } from '@/components/PWA'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { loadWowJS } from '@/lib/plugins/wow'
import { deepClone, isBrowser, shuffleArray } from '@/lib/utils'
import Link from 'next/link'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Announcement from './components/Announcement'
import { ArticleLock } from './components/ArticleLock'
import BlogArchiveItem from './components/BlogArchiveItem'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import BlogPostBar from './components/BlogPostBar'
import DownloadButton from './components/DownloadButton'
import { Footer } from './components/Footer'
import FullScreenButton from './components/FullScreenButton'
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
  const { allNavPages, children } = props
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
    setRecentGames(
      localStorage.getItem('recent_games')
        ? JSON.parse(localStorage.getItem('recent_games'))
        : []
    )
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
                <Header />
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
          <main className='flex-grow w-full h-full flex flex-col min-h-screen overflow-x-auto'>
            <div className='flex-grow h-full'>{children}</div>

            <Footer />
          </main>
        </div>

        <SideBarDrawer
          isOpen={sideBarVisible}
          onClose={() => {
            setSideBarVisible(false)
          }}>
          <SideBarContent {...props} />
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
  const { tagOptions, currentTag, categoryOptions, currentCategory } = props
  return (
    <>
      {/* 首页移动端顶部导航 */}
      <div className='p-2 xl:hidden'>
        <Header />
      </div>
      {/* 最近游戏 */}
      <GameListRecent />
      {/* 游戏列表 */}
      <LayoutPostList {...props} />

      {/* 广告 */}
      <div className='w-full'>
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
  const { post, siteInfo, allNavPages, recommendPosts, lock, validPassword } =
    props
  const game = deepClone(post)
  const [loading, setLoading] = useState(true)
  const url = game?.ext?.href
  const relateGames = recommendPosts
  const randomGames = shuffleArray(deepClone(allNavPages))

  // 初始化可安装应用
  initialPWA(game, siteInfo)

  // 将当前游戏加入到最近游玩
  useEffect(() => {
    // 更新最新游戏
    const recentGames = localStorage.getItem('recent_games')
      ? JSON.parse(localStorage.getItem('recent_games'))
      : []

    const existedIndex = recentGames.findIndex(item => item?.id === game?.id)
    if (existedIndex === -1) {
      recentGames.unshift(game) // 将游戏插入到数组头部
    } else {
      // 如果游戏已存在于数组中，将其移至数组头部
      const existingGame = recentGames.splice(existedIndex, 1)[0]
      recentGames.unshift(existingGame)
    }
    localStorage.setItem('recent_games', JSON.stringify(recentGames))

    const iframe = document.getElementById('game-wrapper')

    // 定义一个函数来处理iframe加载成功事件
    function iframeLoaded() {
      if (game) {
        setLoading(false)
      }
    }

    // 绑定加载事件
    if (iframe?.attachEvent) {
      iframe?.attachEvent('onload', iframeLoaded)
    } else {
      if (iframe) iframe.onload = iframeLoaded
    }

    // 更改iFrame的title
    if (
      document
        ?.getElementById('game-wrapper')
        ?.contentDocument.querySelector('title')?.textContent
    ) {
      document
        .getElementById('game-wrapper')
        .contentDocument.querySelector('title').textContent = `${
        game?.title || ''
      } - Play ${game?.title || ''} on ${siteConfig('TITLE')}`
    }
  }, [game])

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && (
        <div id='article-wrapper' className='md:px-2'>
          {/* 游戏区域 */}
          <div className='game-detail-wrapper w-full grow flex md:px-2'>
            {/* 移动端返回主页按钮 */}
            <Draggable stick='left'>
              <div
                style={{ left: '0px', top: '1rem' }}
                className='fixed xl:hidden group space-x-1 flex items-center z-20 pr-3 pl-1 bg-[#202030] rounded-r-2xl  shadow-lg '>
                <Link
                  href='/'
                  className='px-1 py-3 hover:scale-125 duration-200 transition-all'
                  passHref>
                  <i className='fas fa-arrow-left' />
                </Link>{' '}
                <span
                  className='text-white font-serif'
                  onClick={() => {
                    document.querySelector('.game-info').scrollIntoView({
                      behavior: 'smooth',
                      block: 'end',
                      inline: 'nearest'
                    })
                  }}>
                  G
                </span>
              </div>
            </Draggable>

            <div className={`w-full py-1 md:py-4 `}>
              {/* 游戏区  */}
              <div
                className={`${url ? '' : 'hidden'} bg-black w-full xl:h-[calc(100vh-8rem)] h-screen rounded-md relative`}>
                {/* Loading遮罩 */}
                {loading && (
                  <div className='absolute z-20 w-full xl:h-[calc(100vh-8rem)] h-screen rounded-md overflow-hidden '>
                    <div className='z-20 absolute bg-black bg-opacity-75 w-full h-full flex flex-col gap-4 justify-center items-center'>
                      <h2 className='text-3xl text-white flex gap-2 items-center'>
                        <i className='fas fa-spinner animate-spin'></i>
                        {siteInfo?.title || siteConfig('TITLE')}
                      </h2>
                      <h3 className='text-xl text-white'>
                        {siteInfo?.description || siteConfig('DESCRIPTION')}
                      </h3>
                    </div>

                    {/* 游戏封面图 */}
                    {game?.pageCoverThumbnail && (
                      <img
                        src={game?.pageCoverThumbnail}
                        className='w-full h-full object-cover blur-md absolute top-0 left-0 z-0'
                      />
                    )}
                  </div>
                )}

                <iframe
                  id='game-wrapper'
                  src={url}
                  className={`relative w-full xl:h-[calc(100vh-8rem)] h-screen md:rounded-md overflow-hidden`}
                />

                {/* 游戏窗口装饰器 */}
                {game && !loading && (
                  <div className='game-decorator bg-[#0B0D14] right-0 bottom-0 flex justify-center z-10 md:absolute'>
                    <DownloadButton />
                    <FullScreenButton />
                  </div>
                )}
              </div>

              {/* 游戏资讯 */}
              <div className='game-info dark:text-white py-4 px-2 md:px-0 mt-14 md:mt-0'>
                {/* 关联游戏 */}
                <div className='w-full'>
                  <GameListRelate posts={relateGames} />
                </div>

                {game && (
                  <div className='bg-white shadow-md my-2 p-2 rounded-md dark:bg-black'>
                    <PostInfo post={post} />
                    <NotionPage post={post} />
                    {/* 广告嵌入 */}
                    <AdSlot />
                    <ShareBar post={post} />
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
  return <>404 Not found.</>
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
            <Link
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
            </Link>
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
              <Link
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                passHref
                className={` select-none cursor-pointer flex bg-white rounded-lg hover:bg-gray-500 hover:text-white duration-200 mr-2 py-1 px-2 text-xs whitespace-nowrap dark:hover:text-white  hover:shadow-xl  dark:bg-gray-800`}>
                <i className='mr-1 fas fa-tag' />{' '}
                {tag.name + (tag.count ? `(${tag.count})` : '')}{' '}
              </Link>
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
