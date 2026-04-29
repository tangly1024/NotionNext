'use client'

import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import { generateLocaleDict } from '@/lib/utils/lang'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import ArchiveList from './components/ArchiveList'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import ArticleHeader from './components/ArticleHeader'
import ArticleLock from './components/ArticleLock'
import Footer from './components/Footer'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import Pagination from './components/Pagination'
import PostList from './components/PostList'
import RightFloatArea from './components/RightFloatArea'
import SidePanel from './components/SidePanel'
import CONFIG from './config'
import { Style } from './style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const Lenis = dynamic(() => import('@/components/Lenis'), { ssr: false })
const CursorDot = dynamic(() => import('@/components/CursorDot'), { ssr: false })
const getLocale = () => generateLocaleDict(siteConfig('LANG', 'zh-CN'))

const LayoutBase = props => {
  const { children } = props
  const locale = getLocale()
  const searchModal = useRef(null)
  const router = useRouter()
  const showHomeHero =
    !props.post &&
    (router.pathname === '/' || router.pathname === '/page/[page]')

  return (
    <div
      id='theme-fuwari'
      className={`${siteConfig('FONT_STYLE')} fuwari-bg min-h-screen text-[var(--fuwari-text)]`}>
      <Style />
      <Header
        locale={locale}
        customNav={props.customNav}
        customMenu={props.customMenu}
        searchModal={searchModal}
      />
      <AlgoliaSearchModal cRef={searchModal} {...props} />

      {showHomeHero && <HeroBanner siteInfo={props.siteInfo} />}

      <main className={`max-w-6xl mx-auto px-3 md:px-4 pb-12 ${showHomeHero ? 'fuwari-main-overlap' : ''}`}>
        <div className='grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4 lg:gap-6 items-start'>
          <div className='hidden lg:block sticky top-4'>
            <SidePanel {...props} />
          </div>
          <section>
            {children}
            <div className='lg:hidden mt-4'>
              <SidePanel {...props} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <RightFloatArea post={props.post} />
      {siteConfig('FUWARI_EFFECT_LENIS', false, CONFIG) && <Lenis />}
      {siteConfig('FUWARI_EFFECT_CURSOR_DOT', false, CONFIG) && <CursorDot />}
    </div>
  )
}

const LayoutIndex = props => <LayoutPostList {...props} />

const LayoutPostList = props => {
  const locale = getLocale()
  const { category, tag } = props
  return (
    <>
      {(category || tag) && (
        <div className='fuwari-card p-5 mb-4'>
          <p className='text-sm uppercase tracking-widest text-[var(--fuwari-muted)] mb-2'>
            {category ? (locale?.COMMON?.CATEGORY || '分类') : (locale?.COMMON?.TAGS || '标签')}
          </p>
          <div className='flex items-center gap-2'>
            <h1 className='fuwari-section-title text-2xl font-bold'>
              {category || `#${tag}`}
            </h1>
            <span className='fuwari-chip'>{category ? (locale?.COMMON?.CATEGORY || '分类') : (locale?.COMMON?.TAGS || '标签')}</span>
          </div>
        </div>
      )}
      <PostList posts={props.posts} />
      <Pagination page={props.page} postCount={props.postCount} />
    </>
  )
}

const LayoutSlug = props => {
  const locale = getLocale()
  const { post, lock, validPassword, prev, next } = props
  if (!post) return null
  return (
    <>
      {lock ? (
        <ArticleLock validPassword={validPassword} />
      ) : (
        <article className='fuwari-card p-6'>
          <ArticleHeader post={post} />
          <div id='article-wrapper' className='fuwari-prose'>
            <NotionPage post={post} />
            {siteConfig('FUWARI_ARTICLE_SHARE', true, CONFIG) && <ShareBar post={post} />}
          </div>
          <ArticleCopyright post={post} />
          <ArticleAdjacent prev={prev} next={next} />
          {siteConfig('FUWARI_ARTICLE_COMMENT', true, CONFIG) && <Comment frontMatter={post} />}
        </article>
      )}
    </>
  )
}

const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()

  useEffect(() => {
    if (isBrowser && keyword) {
      replaceSearchResult({
        doms: document.getElementById('posts-wrapper'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  }, [router, keyword])

  return <LayoutPostList {...props} />
}

const LayoutArchive = props => {
  const locale = getLocale()
  return (
    <>
      <div className='fuwari-card p-6 mb-4'>
        <p className='text-sm uppercase tracking-widest text-[var(--fuwari-muted)] mb-2'>
          {locale?.NAV?.ARCHIVE || '归档'}
        </p>
        <h1 className='text-3xl font-bold leading-tight'>{locale?.NAV?.ARCHIVE || '归档'}</h1>
      </div>
      <ArchiveList archivePosts={props.archivePosts || {}} />
    </>
  )
}

const Layout404 = () => {
  const locale = getLocale()
  return (
    <div className='fuwari-card p-8 text-center'>
      <h1 className='text-4xl font-bold mb-2'>404</h1>
      <p className='text-sm text-[var(--fuwari-muted)] mb-4'>
        {locale?.NAV?.['404'] || '页面不存在'}
      </p>
      <SmartLink href='/' className='fuwari-link'>{locale?.NAV?.INDEX || '首页'}</SmartLink>
    </div>
  )
}

const LayoutCategoryIndex = props => {
  const locale = getLocale()
  const { categoryOptions } = props
  return (
    <div className='fuwari-card p-5'>
      <h2 className='fuwari-section-title text-2xl font-semibold mb-4'>{locale?.COMMON?.CATEGORY || '分类'}</h2>
      <div className='flex flex-wrap gap-2'>
        {(categoryOptions || []).map(c => (
          <SmartLink
            key={c.name}
            href={`/category/${encodeURIComponent(c.name)}`}
            className='fuwari-chip'>
            {c.name} {c.count ? `(${c.count})` : ''}
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

const LayoutTagIndex = props => {
  const locale = getLocale()
  const { tagOptions } = props
  return (
    <div className='fuwari-card p-5'>
      <h2 className='fuwari-section-title text-2xl font-semibold mb-4'>{locale?.COMMON?.TAGS || '标签'}</h2>
      <div className='flex flex-wrap gap-2'>
        {(tagOptions || []).map(t => (
          <SmartLink
            key={t.name}
            href={`/tag/${encodeURIComponent(t.name)}`}
            className='fuwari-chip'>
            #{t.name} {t.count ? `(${t.count})` : ''}
          </SmartLink>
        ))}
      </div>
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

