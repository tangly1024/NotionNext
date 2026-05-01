import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, memo } from 'react'
import BlogPostBar from './components/BlogPostBar'
import CONFIG from './config'
import { Style } from './style'
import Catalog from './components/Catalog'
import ProfileHome from './components/ProfileHome'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

// 主题组件

const BlogArchiveItem = dynamic(() => import('./components/BlogArchiveItem'), {
  ssr: false
})
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})
const ArticleInfo = dynamic(() => import('./components/ArticleInfo'), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleAround = dynamic(() => import('./components/ArticleAround'), {
  ssr: false
})
const TopBar = dynamic(() => import('./components/TopBar'), { ssr: false })
const NavBar = dynamic(() => import('./components/NavBar'), { ssr: false })
const JumpToTopButton = dynamic(() => import('./components/JumpToTopButton'), {
  ssr: false
})
const Footer = dynamic(() => import('./components/Footer'), { ssr: false })
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })
const BlogListPage = dynamic(() => import('./components/BlogListPage'), {
  ssr: false
})
const RecommendPosts = dynamic(() => import('./components/RecommendPosts'), {
  ssr: false
})

// 主题全局状态
const ThemeGlobalSimple = createContext()
export const useSimpleGlobal = () => useContext(ThemeGlobalSimple)

/**
 * 左侧栏内容 — 使用 React.memo 阻止父组件 props 变化引起的重新渲染。
 * 仅在浏览器刷新（组件重新挂载）时重新加载；客户端路由切换不会触发重渲染。
 * 内部的 MenuList 通过 useRouter() 订阅路由上下文，仍可正常更新菜单激活状态。
 */
const SidebarContent = memo(function SidebarContent(props) {
  return (
    <div className='flex flex-col justify-between h-full py-6 px-5'>
      <div>
        <NavBar {...props} />
      </div>
      <div className='mt-auto'>
        <Footer />
      </div>
    </div>
  )
}, () => true)

/**
 * 基础布局 — 三栏: 左侧导航 | 中间内容 | 右侧目录
 * 模仿 Claude Code Docs 布局
 */
const LayoutBase = props => {
  const { children } = props
  const { onLoading } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)
  const hasToc = props.post?.toc && props.post.toc.length > 0
  const tocEnable = siteConfig('CLAUDE_TOC_ENABLE', true, CONFIG)
  const isHomePage = router?.pathname === '/'

  useEffect(() => {
    const shouldBlockImageAction = target => {
      return target instanceof Element && Boolean(target.closest('#theme-claude img'))
    }

    const handleImageContextMenu = e => {
      if (shouldBlockImageAction(e.target)) {
        e.preventDefault()
      }
    }

    const handleImageDragStart = e => {
      if (shouldBlockImageAction(e.target)) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleImageContextMenu, true)
    document.addEventListener('dragstart', handleImageDragStart, true)

    return () => {
      document.removeEventListener('contextmenu', handleImageContextMenu, true)
      document.removeEventListener('dragstart', handleImageDragStart, true)
    }
  }, [])

  return (
    <ThemeGlobalSimple.Provider value={{ searchModal }}>
      <div
        id='theme-claude'
        className={`${siteConfig('FONT_STYLE')} ${isHomePage ? 'claude-page-home' : 'claude-page-subpage'} h-screen flex flex-col overflow-hidden`}>
        <Style />

        {siteConfig('SIMPLE_TOP_BAR', null, CONFIG) && <TopBar {...props} />}

        <div className='flex flex-1 overflow-hidden'>
          {/* ====== LEFT SIDEBAR — 导航栏 (桌面端) ====== */}
          {/* 使用 SidebarContent (React.memo) 避免客户端导航时重新加载侧边栏 */}
          <div className='claude-sidebar hidden md:flex md:flex-col md:flex-shrink-0 md:w-[296px] lg:w-[320px] h-full overflow-y-auto overflow-x-hidden'>
            <SidebarContent customNav={props.customNav} customMenu={props.customMenu} />
          </div>

          {/* ====== CENTER — 主内容区 ====== */}
          <div className='flex-1 overflow-hidden flex justify-center'>
            <div
              id='container-inner'
              className='h-full w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-5 md:px-8 overflow-y-auto scroll-hidden'>

              {/* 移动端导航 */}
              <div className='md:hidden pt-4'>
                <NavBar {...props} />
              </div>

              {/* 内容区域 */}
              <div className='py-6 md:py-10'>
                {onLoading ? (
                  <div className='flex items-center justify-center min-h-[500px] w-full'>
                    <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 dark:border-white'></div>
                  </div>
                ) : (
                  <>{children}</>
                )}
              </div>

              <AdSlot type='native' />

              {/* 移动端页脚 */}
              <div className='md:hidden pb-6'>
                <Footer {...props} />
              </div>
            </div>
          </div>

          {/* ====== RIGHT SIDEBAR — 目录 (桌面端，仅文章页) ====== */}
          {tocEnable && hasToc && (
            <div className='hidden lg:flex lg:flex-col lg:flex-shrink-0 lg:w-[240px] h-full overflow-hidden pt-16 pr-8 pl-2'>
              <Catalog post={props.post} />
            </div>
          )}
        </div>

        <div className='fixed right-4 bottom-4 z-20'>
          <JumpToTopButton />
        </div>

        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalSimple.Provider>
  )
}

/**
 * 博客首页
 */
const LayoutIndex = props => {
  return <ProfileHome {...props} />
}

/**
 * 博客列表
 */
const LayoutPostList = props => {
  return (
    <>
      <BlogPostBar {...props} />
      <BlogListPage {...props} />
    </>
  )
}

/**
 * 搜索页
 */
const LayoutSearch = props => {
  const { keyword } = props

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
  }, [keyword])

  return <LayoutPostList {...props} />
}

function groupArticlesByYearArray(articles) {
  const grouped = {};
  for (const article of articles) {
    const year = new Date(article.publishDate).getFullYear().toString();
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(article);
  }
  for (const year in grouped) {
    grouped[year].sort((a, b) => b.publishDate - a.publishDate);
  }
  return Object.entries(grouped)
    .sort(([a], [b]) => b - a)
    .map(([year, posts]) => ({ year, posts }));
}

/**
 * 归档页
 */
const LayoutArchive = props => {
  const { posts } = props
  const sortPosts = groupArticlesByYearArray(posts)
  return (
    <>
      <div className='mb-10 pb-20 md:pb-12 min-h-screen w-full'>
        {sortPosts.map(p => (
          <BlogArchiveItem
            key={p.year}
            archiveTitle={p.year}
            archivePosts={p.posts}
          />
        ))}
      </div>
    </>
  )
}

/**
 * 文章详情
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <div className='w-full'>
          {/* 文章信息 */}
          <ArticleInfo post={post} />

          <WWAds orientation='horizontal' className='w-full' />

          <div id='article-wrapper'>
            {!lock && <NotionPage post={post} />}
          </div>

          <AdSlot type={'in-article'} />

          {post?.type === 'Post' && (
            <>
              <ArticleAround prev={prev} next={next} />
              <RecommendPosts recommendPosts={recommendPosts} />
            </>
          )}

          {/* 评论区 */}
          <Comment frontMatter={post} />
        </div>
      )}
    </>
  )
}

/**
 * 404
 */
const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    if (!post) {
      const timer = setTimeout(() => {
        if (isBrowser) {
          const article = document.querySelector('#article-wrapper #notion-article')
          if (!article) {
            router.push('/404').then(() => {
              console.warn('找不到页面', router.asPath)
            })
          }
        }
      }, waiting404)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [post, router, waiting404])

  return <>404 Not found.</>
}

/**
 * 分类列表
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  return (
    <>
      <div id='category-list' className='duration-200 flex flex-wrap gap-2'>
        {categoryOptions?.map(category => {
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior>
              <div className='claude-nav-link cursor-pointer'>
                <i className='mr-2 fas fa-folder text-xs' />
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
 * 标签列表
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  return (
    <>
      <div id='tags-list' className='duration-200 flex flex-wrap gap-2'>
        {tagOptions.map(tag => {
          return (
            <SmartLink
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              passHref
              className='claude-nav-link cursor-pointer text-sm'>
              <i className='mr-1 fas fa-tag text-xs' />
              {tag.name + (tag.count ? `(${tag.count})` : '')}
            </SmartLink>
          )
        })}
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
