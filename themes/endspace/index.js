'use client'

import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import BlogListArchive from './components/BlogListArchive'
import { BlogPostCard } from './components/BlogPostCard'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import { Footer } from './components/Footer'
import { PostLock } from './components/PostLock'
import { PostMeta } from './components/PostMeta'
import SearchInput from './components/SearchInput'
import { SideBar } from './components/SideBar'
import { SideNav } from './components/SideNav'
import TitleBar from './components/TitleBar'
import LoadingCover from './components/LoadingCover'
import MobileNav from './components/MobileNav'
import ArticleAdjacent from './components/ArticleAdjacent'
import FloatingControls from './components/FloatingControls'
import useViewportScale from './components/useViewportScale'
import CONFIG from './config'
import { Style } from './style'
import { IconChevronUp, IconFolder, IconTag, IconLoader2 } from '@tabler/icons-react'

/**
 * Endspace Theme - Endfield Style
 * Base layout framework
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase = (props) => {
  const { children, post } = props
  const { onLoading, fullWidth, locale } = useGlobal()
  const toc = post?.toc

  // Article detail page vertical layout
  const LAYOUT_VERTICAL =
    post && siteConfig('ENDSPACE_ARTICLE_LAYOUT_VERTICAL', false, CONFIG)

  // Website sidebar reverse layout
  const LAYOUT_SIDEBAR_REVERSE = siteConfig('LAYOUT_SIDEBAR_REVERSE', false)

  // Loading animation
  const LOADING_COVER = siteConfig('ENDSPACE_LOADING_COVER', true, CONFIG)

  // Viewport scale - Endfield style (using hook default params: 1920x1080 landscape / 390x844 portrait)
  useViewportScale()

  return (
    <div
      id="theme-endspace"
      className={`${siteConfig('FONT_STYLE')} min-h-screen relative`}
    >
      <Style />

      {/* Nest Animation Support - Container for nest.js canvas */}
      {siteConfig('NEST') && (
        <div 
          id="__nest" 
          zindex="-1"
          opacity="0.5"
          color="100,100,100"
          count="99"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            pointerEvents: 'none',
            zIndex: 0 
          }} 
        />
      )}

      {/* Loading animation */}
      {LOADING_COVER && <LoadingCover />}

      {/* Left vertical navigation (desktop) */}
      <SideNav {...props} />

      {/* Mobile bottom navigation */}
      <MobileNav {...props} />

      {/* Main content area - using flex layout for sticky footer */}
      <div className="md:ml-[5rem] flex flex-col min-h-screen">
        {/* Title bar */}
        {!fullWidth && <TitleBar {...props} />}

        {/* Content container - flex-grow to fill remaining space */}
        <div id="container-inner" className="w-full relative z-10 flex-grow">
          <div
            id="container-wrapper"
            className="relative mx-auto justify-center md:flex py-8 px-4 md:px-8 lg:px-12 max-w-screen-xl xl:max-w-screen-2xl items-start"
          >
            {/* Main content - Centered */}
            <div
              className={`${
                fullWidth
                  ? 'w-full'
                  : 'max-w-4xl w-full mx-auto'
              }`}
            >
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
                {props.slotTop}
                {children}
              </Transition>
            </div>
            
            {/* Spacer for structure consistency */}
            {!fullWidth && (
               <div />
            )}
          </div>
        </div>

        {/* Footer */}
        {!fullWidth && <Footer />}

        {/* Floating Controls (Unified) */}
        <FloatingControls toc={toc} {...props} />
      </div>
    </div>
  )
}

/**
 * Homepage Layout
 * @param {*} props
 * @returns
 */
const LayoutIndex = (props) => {
  return <LayoutPostList {...props} />
}

/**
 * Article List Layout
 * @param {*} props
 * @returns
 */
const LayoutPostList = (props) => {
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
 * Article Detail Layout
 * @param {*} props
 * @returns
 */
const LayoutSlug = (props) => {
  const { post, lock, validPassword } = props
  const router = useRouter()
  
  // Use configurable timeout from post.config.js (default 9 seconds)
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    // Important: Store timeout ID and clean up on unmount to prevent
    // 404 redirects when user navigates away quickly
    const timeoutId = setTimeout(() => {
      const article = isBrowser && document.getElementById('article-wrapper')
      if (!article) {
        router.push('/404').then(() => {
          console.warn('Page not found:', router.asPath)
        })
      }
    }, waiting404)
    
    // Cleanup: cancel timeout when component unmounts or router changes
    return () => clearTimeout(timeoutId)
  }, [router])

  return (
    <>
      {lock ? (
        <PostLock validPassword={validPassword} />
      ) : (
        post && (
          <div className="relative">
            {/* Post Metadata Header */}
            <PostMeta post={post} />

             {/* Article Content Frame */}
            <div id="article-wrapper" className="endspace-frame p-8 md:p-12 mb-12">
               {/* Content Watermark/Background decoration - 可在config.js中自定义 */}
               <div className="absolute top-4 right-4 text-[var(--endspace-text-muted)] opacity-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black pointer-events-none select-none z-0">
                 {siteConfig('ENDSPACE_ARTICLE_WATERMARK_TEXT', 'CLOUD09', CONFIG)}
               </div>
               
              <div className="relative z-10">
                <NotionPage post={post} />
              </div>

              {/* Footer of the card - Share Bar */}
              {siteConfig('POST_SHARE_BAR_ENABLE') === 'true' && (
                <div className="mt-12 pt-8 border-t border-[var(--endspace-border-base)] flex justify-end items-center">
                   <ShareBar post={post} />
                </div>
              )}
            </div>

            {/* Previous / Next Article Navigation */}
            <ArticleAdjacent prev={props.prev} next={props.next} />

            <div id="comments">
              <Comment frontMatter={post} />
            </div>
          </div>
        )
      )}
    </>
  )
}

/**
 * 404 Page
 * @param {*} props
 * @returns
 */
const Layout404 = (props) => {
  const router = useRouter()
  const { locale } = useGlobal()

  useEffect(() => {
    // Delay 3 seconds, if loading fails redirect to home
    setTimeout(() => {
      const article = isBrowser && document.getElementById('article-wrapper')
      if (!article) {
        router.push('/').then(() => {
          // console.log('Page not found:', router.asPath)
        })
      }
    }, 3000)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="endspace-card p-12 text-center tech-corner max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="relative flex justify-center items-center mb-6">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#FBFB46] opacity-90 pointer-events-none" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
             <div className="relative text-8xl font-black text-black z-10">
               404
             </div>
          </div>
          <div className="text-2xl font-bold text-[var(--endspace-text-primary)] mb-2">PAGE_NOT_FOUND</div>
          <div className="text-[var(--endspace-text-muted)] text-sm font-mono">
            The requested resource could not be located
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-cyan-400 mb-8">
          <IconLoader2 size={16} stroke={1.5} className="animate-spin" />
          <span className="tech-text text-sm">Redirecting to home...</span>
        </div>

        <SmartLink href="/">
          <button className="endspace-button-primary px-8 py-3">
            <span className="tech-text">RETURN_HOME</span>
          </button>
        </SmartLink>

        {/* Status indicators */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex items-center justify-center gap-4 text-xs text-gray-600 tech-text">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>ERROR</span>
          </div>
          <span>|</span>
          <div>CODE: 404</div>
          <span>|</span>
          <div>STATUS: NOT_FOUND</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Search Page
 * @param {*} props
 * @returns
 */
const LayoutSearch = (props) => {
  const { keyword, posts = [] } = props
  const router = useRouter()

  useEffect(() => {
    if (isBrowser) {
      // Highlight search results
      const container = document.getElementById('posts-wrapper')
      if (keyword && container) {
        replaceSearchResult({
          doms: container,
          search: keyword,
          target: {
            element: 'span',
            className: 'text-yellow-400 bg-yellow-400/20 px-1'
          }
        })
      }
    }
  }, [router])

  return (
    <>
      <div className="mb-8">
        <SearchInput {...props} />
      </div>
      {/* Search results list - no pagination */}
      <div className="w-full">
        <div id="posts-wrapper">
          {posts?.map((post) => (
            <BlogPostCard key={post.id} post={post} showSummary={true} />
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * Archive List
 * @param {*} props
 * @returns Articles grouped by date
 */
const LayoutArchive = (props) => {
  const { archivePosts } = props
  return (
    <>
      <div className="mb-10 pb-20 min-h-screen w-full">
        {Object.keys(archivePosts).map((archiveTitle) => (
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
 * Category Index
 * @param {*} props
 * @returns
 */
const LayoutCategoryIndex = (props) => {
  const { categoryOptions } = props
  return (
    <>
      <Style />
      <div className="endspace-card p-8">
        <h2 className="text-3xl font-black text-[var(--endspace-text-primary)] mb-8 uppercase tracking-wide">
          ALL_CATEGORIES
        </h2>
        <div
          id="category-list"
          className="flex flex-wrap gap-3"
        >
          {categoryOptions?.map((category) => (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              legacyBehavior
            >
              <a className="ef-btn group">
                <span className="ef-btn-indicator"></span>
                <span className="ef-btn-text">{category.name}</span>
              </a>
            </SmartLink>
          ))}
        </div>
      </div>
    </>
  )
}

/**
 * Tag Index
 * @param {*} props
 * @returns
 */
const LayoutTagIndex = (props) => {
  const { tagOptions } = props
  return (
    <>
      <Style />
      <div className="endspace-frame p-8">
        <h2 className="text-3xl font-black text-[var(--endspace-text-primary)] mb-8 uppercase tracking-wide">
          ALL_TAGS
        </h2>
        <div id="tags-list" className="flex flex-wrap gap-3">
          {tagOptions.map((tag) => (
            <SmartLink
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              passHref
              legacyBehavior
            >
              <a className="ef-btn group">
                <span className="ef-btn-indicator"></span>
                <span className="ef-btn-text">#{tag.name}</span>
              </a>
            </SmartLink>
          ))}
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
