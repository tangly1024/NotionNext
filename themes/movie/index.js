'use client'

import CONFIG from './config'
import { createContext, useContext, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Title } from './components/Title'
import { SideBar } from './components/SideBar'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { useGlobal } from '@/lib/global'
import { ArticleLock } from './components/ArticleLock'
import { ArticleInfo } from './components/ArticleInfo'
import JumpToTopButton from './components/JumpToTopButton'
import NotionPage from '@/components/NotionPage'
import Comment from '@/components/Comment'
import ShareBar from '@/components/ShareBar'
import SearchInput from './components/SearchInput'
import replaceSearchResult from '@/components/Mark'
import { isBrowser } from '@/lib/utils'
import BlogListGroupByDate from './components/BlogListGroupByDate'
import CategoryItem from './components/CategoryItem'
import TagItem from './components/TagItem'
import { useRouter } from 'next/router'
import { Transition } from '@headlessui/react'
import { Style } from './style'
import { siteConfig } from '@/lib/config'
import AlgoliaSearchModal from '@/components/AlgoliaSearchModal'
import LatestPostsGroup from './components/LatestPostsGroup'
import CategoryGroup from './components/CategoryGroup'
import { formatDateFmt } from '@/lib/utils/formatDate'
import ArchiveDateList from './components/ArchiveDateList'
import TagGroups from './components/TagGroups'

// 主题全局状态
const ThemeGlobalMovie = createContext()
export const useMovieGlobal = () => useContext(ThemeGlobalMovie)

/**
 * 基础布局框架
 * 1.其它页面都嵌入在LayoutBase中
 * 2.采用左右两侧布局，移动端使用顶部导航栏
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = props => {
  const { children, slotTop } = props
  const { onLoading, fullWidth } = useGlobal()
  const router = useRouter()
  const { category, tag } = props
  const searchModal = useRef(null)

  // 增加一个状态以触发 Transition 组件的动画
  //   const [showTransition, setShowTransition] = useState(true)
  //   useEffect(() => {
  //     // 当 location 或 children 发生变化时，触发动画
  //     setShowTransition(false)
  //     setTimeout(() => setShowTransition(true), 5)
  //   }, [onLoading])

  return (
    <ThemeGlobalMovie.Provider value={{ searchModal }}>
      <div
        id="theme-movie"
        className={`${siteConfig('FONT_STYLE')} dark:text-gray-300  bg-white dark:bg-[#2A2A2A] scroll-smooth min-h-screen flex flex-col justify-between`}
      >
        <Style />

        {/* 页头 */}
        <Header {...props} />

        {/* 主体 */}
        <div id="container-inner" className="w-full relative z-10">
          {/* 标题栏 */}
          {/* {fullWidth ? null : <Title {...props} />} */}

          <div
            id="container-wrapper"
            className={
              (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
                ? 'flex-row-reverse'
                : '') +
              'relative mx-auto justify-center md:flex items-start py-8 px-2'
            }
          >
            {/* 内容 */}
            <div className={`w-full ${fullWidth ? '' : ''} xl:px-32 lg:px-4`}>
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
                {/* 嵌入模块 */}
                {slotTop}
                {children}
              </Transition>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <Footer {...props} />

        {/* 搜索框 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />

        {/* 回顶按钮 */}
        <div className="fixed right-4 bottom-4 z-10">
          <JumpToTopButton />
        </div>
      </div>
    </ThemeGlobalMovie.Provider>
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
  return (
    <>
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
        <div id="article-wrapper" className="px-2">
          <ArticleInfo post={post} />
          <NotionPage post={post} />
          <ShareBar post={post} />
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
  const { locale } = useGlobal()
  const { searchModal } = useMovieGlobal()
  const router = useRouter()
  // 展示搜索框
  const toggleShowSearchInput = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    }
  }

  const onKeyUp = e => {
    if (e.keyCode === 13) {
      const search = document.getElementById('search').value
      if (search) {
        router.push({ pathname: '/search/' + search })
      }
    }
  }

  return (
    <>
      <div className="h-52">
        <h2 className="text-4xl">{locale.COMMON.NO_RESULTS_FOUND}</h2>
        <hr className="my-4" />
        <div className="max-w-md relative">
          <input
            autoFocus
            id="search"
            onClick={toggleShowSearchInput}
            onKeyUp={onKeyUp}
            className="float-left w-full outline-none h-full p-2 rounded dark:bg-[#383838] bg-gray-100"
            aria-label="Submit search"
            type="search"
            name="s"
            autoComplete="off"
            placeholder="Type then hit enter to search..."
          />
          <i className="fas fa-search absolute right-0 my-auto p-2"></i>
        </div>
      </div>
      {/* 底部导航 */}
      <div className="h-full flex-grow grid grid-cols-4 gap-4">
        <LatestPostsGroup {...props} />
        <CategoryGroup {...props} />
        <ArchiveDateList {...props} />
        <TagGroups {...props} />
      </div>
    </>
  )
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

  return <LayoutPostList {...props} />
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
      <div className="mb-10 pb-20 md:py-12 p-3  min-h-screen w-full">
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogListGroupByDate
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
      <div id="category-list" className="duration-200 flex flex-wrap">
        {categoryOptions?.map(category => (
          <CategoryItem key={category.name} category={category} />
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
      <div id="tags-list" className="duration-200 flex flex-wrap">
        {tagOptions.map(tag => (
          <TagItem key={tag.name} tag={tag} />
        ))}
      </div>
    </>
  )
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
