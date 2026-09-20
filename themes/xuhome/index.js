import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import dynamic from 'next/dynamic'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CONFIG from './config'
import { Style } from './style'
import Header from './components/Header'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SideBar from './components/SideBar'
import BlogItem from './components/BlogItem'
import BlogListPage from './components/BlogListPage'
import BlogListScroll from './components/BlogListScroll'
import BlogArchiveItem from './components/BlogArchiveItem'
import ArticleLock from './components/ArticleLock'
import ArticleInfo from './components/ArticleInfo'
import ArticleAround from './components/ArticleAround'
import ShareBar from './components/ShareBar'
import SearchInput from './components/SearchInput'
import RecommendPosts from './components/RecommendPosts'
import JumpToTopButton from './components/JumpToTopButton'
import NotionAudioEnhancer from './components/NotionAudioEnhancer'
import HeroSection from './components/HeroSection'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

const LayoutBase = props => {
  const { children } = props
  const { fullWidth } = useGlobal()
  const showSidebar = !fullWidth && siteConfig('XUHOME_SIDEBAR', false, CONFIG)
  const bgImage = siteConfig('XUHOME_BG_IMAGE', null, CONFIG)

  return (
    <div
      id='theme-xuhome'
      className='min-h-screen'
      style={
        bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }
          : {}
      }
    >
      <Style />

      <div className='fixed inset-0 bg-[#faf8f5]/55 dark:bg-slate-900/85 z-0 pointer-events-none' />

      <div className='relative z-10'>
        <NavBar {...props} />

        <div className='max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-4'>
          <Header {...props} />
        </div>

        <div
          className='max-w-6xl mx-auto px-4 md:px-6'
          style={{ minHeight: 'calc(100vh - 200px)' }}
        >
          <div className='flex flex-col lg:flex-row gap-8'>
            <main className='flex-1 min-w-0 pb-16'>{children}</main>

            {showSidebar && (
              <aside className='w-60 shrink-0 hidden lg:block'>
                <div className='top-24'>
                  <SideBar {...props} />
                </div>
              </aside>
            )}
          </div>
        </div>

        <Footer {...props} />

        <div className='fixed right-4 bottom-4 z-30'>
          <JumpToTopButton />
        </div>

        <AlgoliaSearchModal {...props} />
      </div>
    </div>
  )
}

const LayoutIndex = props => {
  const showHero = siteConfig('XUHOME_HERO_ENABLE', false, CONFIG)

  return (
    <>
      {showHero && <HeroSection {...props} />}
      <LayoutPostList {...props} />
    </>
  )
}

const LayoutPostList = props => {
  const { category, tag } = props

  return (
    <div id='posts-wrapper'>
      {category && (
        <div className='inline-block border-2 border-[#0284c7] rounded-sm shadow-[2px_2px_0px_0px_#0284c7] bg-[#fde68a] px-3 py-1 mb-6 font-black text-xs uppercase tracking-wider text-[#0284c7]'>
          {category}
        </div>
      )}
      {tag && (
        <div className='inline-block border-2 border-[#0284c7] rounded-sm shadow-[2px_2px_0px_0px_#0284c7] bg-[#fde68a] px-3 py-1 mb-6 font-black text-xs uppercase tracking-wider text-[#0284c7]'>
          #{tag}
        </div>
      )}

      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogListPage {...props} />
      ) : (
        <BlogListScroll {...props} />
      )}
    </div>
  )
}

const LayoutSearch = props => {
  const { keyword } = props

  useEffect(() => {
    if (isBrowser) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'bg-[#fde68a] text-[#0284c7] font-black px-1 rounded-sm'
        }
      })
    }
  }, [keyword])

  return (
    <>
      <div className='mb-8'>
        <SearchInput key={keyword} {...props} />
      </div>
      <LayoutPostList {...props} />
    </>
  )
}

const LayoutArchive = props => {
  const { archivePosts } = props

  return (
    <div>
      {Object.keys(archivePosts).map(archiveTitle => (
        <BlogArchiveItem
          key={archiveTitle}
          archiveTitle={archiveTitle}
          archivePosts={archivePosts[archiveTitle]}
        />
      ))}
    </div>
  )
}

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}

      {!lock && post && (
        <article>
          {post?.pageCover && (
            <div className='w-full mb-8'>
              <div
                className='w-full h-48 md:h-64 bg-cover bg-center rounded-sm border-[3px] border-[#0284c7] shadow-[4px_4px_0px_0px_#0284c7]'
                style={{ backgroundImage: `url(${post.pageCover})` }}
              />
            </div>
          )}

          <ArticleInfo post={post} />

          <div
            id='article-wrapper'
            className='border-2 border-[#0284c7] rounded-sm shadow-[4px_4px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-6 md:p-10 mt-6'
          >
            <NotionPage post={post} />
            <NotionAudioEnhancer post={post} />
          </div>

          <ShareBar post={post} />
          <AdSlot type='in-article' />

          {post?.type === 'Post' && (
            <>
              <ArticleAround prev={prev} next={next} />
              {siteConfig('XUHOME_ARTICLE_RECOMMEND_POSTS', true, CONFIG) && (
                <RecommendPosts recommendPosts={recommendPosts} />
              )}
            </>
          )}

          <div className='mt-8'>
            <Comment frontMatter={post} />
          </div>
        </article>
      )}
    </>
  )
}

const Layout404 = props => {
  const { post } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000

  useEffect(() => {
    if (!post) {
      const timer = setTimeout(() => {
        if (isBrowser) {
          const article = document.querySelector(
            '#article-wrapper #notion-article'
          )
          if (!article) {
            router.push('/404').then(() => console.warn('Page not found'))
          }
        }
      }, waiting404)
      return () => clearTimeout(timer)
    }
  }, [post, router, waiting404])

  return (
    <div className='flex items-center justify-center min-h-[50vh] py-20'>
      <div className='text-center'>
        <div
          className='text-8xl font-black text-[#0284c7] mb-4'
          style={{ textShadow: '4px 4px 0 var(--xuhome-accent)' }}
        >
          404
        </div>
        <div className='border-2 border-[#0284c7] rounded-sm shadow-[2px_2px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 px-6 py-3 inline-block'>
          <span className='font-black uppercase tracking-wider text-sm text-[#0284c7]'>
            Page not found
          </span>
        </div>
      </div>
    </div>
  )
}

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {categoryOptions?.map(category => (
        <SmartLink
          key={category.name}
          href={`/category/${category.name}`}
          passHref
          legacyBehavior
        >
          <div className='border-2 border-[#0284c7] rounded-sm shadow-[4px_4px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 p-5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#0284c7] transition-all cursor-pointer group'>
            <div className='font-black text-lg text-[#0284c7] group-hover:text-[#0ea5e9] transition-colors uppercase tracking-wider'>
              {category.name}
            </div>
            <div className='font-extrabold text-xs text-slate-500 dark:text-slate-400 mt-2 tabular-nums'>
              {category.count} posts
            </div>
          </div>
        </SmartLink>
      ))}
    </div>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props

  return (
    <div className='flex flex-wrap gap-3'>
      {tagOptions.map(tag => (
        <SmartLink
          key={tag.name}
          href={`/tag/${encodeURIComponent(tag.name)}`}
          passHref
        >
          <span className='inline-flex items-center border-2 border-[#0284c7] rounded-sm shadow-[2px_2px_0px_0px_#0284c7] bg-[#ffffff] dark:bg-slate-800 hover:bg-[#fde68a] px-4 py-2 font-black text-sm text-[#0284c7] uppercase tracking-wider transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'>
            {tag.name}
            {tag.count ? (
              <span className='ml-2 text-xs opacity-70'>{tag.count}</span>
            ) : (
              ''
            )}
          </span>
        </SmartLink>
      ))}
    </div>
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
