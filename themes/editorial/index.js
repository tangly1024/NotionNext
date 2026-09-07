import { AdSlot } from '@/components/GoogleAdsense'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef } from 'react'
import ArticleAround from './components/ArticleAround'
import ArticleInfo from './components/ArticleInfo'
import BlogListPage from './components/BlogListPage'
import Catalog from './components/Catalog'
import Footer from './components/Footer'
import Header from './components/Header'
import RecommendPosts from './components/RecommendPosts'
import CONFIG from './config'
import { Style } from './style'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)
const ArticleLock = dynamic(() => import('../simple/components/ArticleLock'), {
  ssr: false
})
const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const SearchInput = dynamic(() => import('../simple/components/SearchInput'), {
  ssr: false
})
const JumpToTopButton = dynamic(
  () => import('../simple/components/JumpToTopButton'),
  { ssr: false }
)
const WWAds = dynamic(() => import('@/components/WWAds'), { ssr: false })

const EditorialContext = createContext(null)
export const useEditorialGlobal = () => useContext(EditorialContext)

const LayoutBase = props => {
  const { children } = props
  const { onLoading } = useGlobal()
  const searchModal = useRef(null)
  const router = useRouter()
  const isArticle = router.pathname === '/[prefix]' || Boolean(props.post?.toc)
  const showToc =
    isArticle &&
    props.post?.toc?.length > 0 &&
    siteConfig('EDITORIAL_TOC_ENABLE', true, CONFIG)

  return (
    <EditorialContext.Provider value={{ searchModal }}>
      <div
        id='theme-editorial'
        className={`${siteConfig('FONT_STYLE')} ${router.pathname === '/' ? 'editorial-home' : 'editorial-subpage'}`}>
        <Style />
        <Header
          customNav={props.customNav}
          customMenu={props.customMenu}
          searchModal={searchModal}
        />
        <main
          className={`editorial-shell ${showToc ? 'editorial-shell-with-toc' : ''}`}>
          <div className='editorial-main'>
            {onLoading ? (
              <div className='editorial-loading' aria-label='Loading'>
                <span />
              </div>
            ) : (
              children
            )}
            <AdSlot type='native' />
          </div>
          {showToc && (
            <aside className='editorial-toc-aside'>
              <Catalog post={props.post} />
            </aside>
          )}
        </main>
        <Footer />
        {siteConfig('EDITORIAL_WIDGET_TO_TOP', true, CONFIG) && (
          <div className='editorial-to-top'>
            <JumpToTopButton />
          </div>
        )}
        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </EditorialContext.Provider>
  )
}

const HomeHero = () => {
  if (!siteConfig('EDITORIAL_SHOW_HERO', true, CONFIG)) return null

  const title =
    siteConfig('EDITORIAL_HERO_TITLE', '', CONFIG) || siteConfig('TITLE')
  const description =
    siteConfig('EDITORIAL_HERO_DESCRIPTION', '', CONFIG) ||
    siteConfig('BIO') ||
    siteConfig('DESCRIPTION')

  return (
    <section className='editorial-hero'>
      <div className='editorial-kicker'>
        {siteConfig('EDITORIAL_KICKER', 'ESSAYS · NOTES · IDEAS', CONFIG)}
      </div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      <div className='editorial-hero-rule'>
        <span>Independent journal</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </section>
  )
}

const LayoutIndex = props => (
  <>
    <HomeHero />
    <BlogListPage {...props} home />
  </>
)

const ListHeading = ({ tag, category }) => {
  const { locale } = useGlobal()
  const title = tag
    ? `${locale.COMMON.TAGS}: ${tag}`
    : category
      ? `${locale.COMMON.CATEGORY}: ${category}`
      : null
  return title ? (
    <header className='editorial-page-heading'>
      <span>Collection</span>
      <h1>{title}</h1>
    </header>
  ) : null
}

const LayoutPostList = props => (
  <>
    <ListHeading tag={props.tag} category={props.category} />
    <BlogListPage {...props} />
  </>
)

const LayoutSearch = props => {
  const { keyword } = props

  useEffect(() => {
    if (!isBrowser) return
    replaceSearchResult({
      doms: document.getElementById('posts-wrapper'),
      search: keyword,
      target: {
        element: 'span',
        className: 'editorial-search-mark'
      }
    })
  }, [keyword])

  return (
    <>
      {!siteConfig('ALGOLIA_APP_ID') && <SearchInput {...props} />}
      <LayoutPostList {...props} />
    </>
  )
}

const LayoutArchive = ({ archivePosts }) => (
  <section className='editorial-archive'>
    <header className='editorial-page-heading'>
      <span>Chronicle</span>
      <h1>Archive</h1>
    </header>
    {Object.keys(archivePosts || {})
      .sort((a, b) => b.localeCompare(a))
      .map(month => (
        <div className='editorial-archive-group' key={month}>
          <h2 id={month}>{month}</h2>
          <ol>
            {archivePosts[month].map(post => (
              <li key={post.id}>
                <SmartLink href={post.href}>{post.title}</SmartLink>
                <time>{post.date?.start_date}</time>
              </li>
            ))}
          </ol>
        </div>
      ))}
  </section>
)

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts } = props

  return (
    <>
      {lock && <ArticleLock validPassword={validPassword} />}
      {!lock && post && (
        <article className='editorial-article'>
          <ArticleInfo post={post} />
          <WWAds orientation='horizontal' className='w-full' />
          <div id='article-wrapper'>
            <NotionPage post={post} />
          </div>
          <AdSlot type='in-article' />
          {post.type === 'Post' && (
            <>
              <ArticleAround prev={prev} next={next} />
              <RecommendPosts recommendPosts={recommendPosts} />
            </>
          )}
          <Comment frontMatter={post} />
        </article>
      )}
    </>
  )
}

const Layout404 = () => (
  <section className='editorial-empty'>
    <span>404</span>
    <h1>Page not found.</h1>
    <SmartLink href='/'>Return home →</SmartLink>
  </section>
)

const LayoutCategoryIndex = ({ categoryOptions = [] }) => (
  <Taxonomy
    eyebrow='Index'
    title='Categories'
    items={categoryOptions}
    basePath='/category/'
    icon='folder'
  />
)

const LayoutTagIndex = ({ tagOptions = [] }) => (
  <Taxonomy
    eyebrow='Index'
    title='Tags'
    items={tagOptions}
    basePath='/tag/'
    icon='tag'
  />
)

const Taxonomy = ({ eyebrow, title, items, basePath, icon }) => (
  <section className='editorial-taxonomy'>
    <header className='editorial-page-heading'>
      <span>{eyebrow}</span>
      <h1>{title}</h1>
    </header>
    <div className='editorial-taxonomy-grid'>
      {items.map(item => (
        <SmartLink
          key={item.name}
          href={`${basePath}${encodeURIComponent(item.name)}`}
          className='editorial-taxonomy-item'>
          <i className={`fas fa-${icon}`} aria-hidden='true' />
          <strong>{item.name}</strong>
          <small>{String(item.count || 0).padStart(2, '0')}</small>
        </SmartLink>
      ))}
    </div>
  </section>
)

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
