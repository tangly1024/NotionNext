import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import BlogPostListPage from '../components/BlogPostListPage'
import BlogPostListScroll from '../components/BlogPostListScroll'
import CategoryBar from '../components/CategoryBar'

const LayoutPostList = props => {
  const { locale } = useGlobal()
  const { category, tag, postCount = 0 } = props
  const isCategoryPage = Boolean(category)
  const isTagPage = Boolean(tag)
  const heroLabel = isCategoryPage
    ? locale.locale === 'en-US'
      ? 'Category'
      : '分类专题'
    : isTagPage
      ? locale.locale === 'en-US'
        ? 'Tag'
        : '标签专题'
      : null
  const heroTitle = category || tag || ''
  const heroDescription = isCategoryPage
    ? locale.locale === 'en-US'
      ? `A focused archive for ${category}. Browse related posts, practical notes, and connected ideas in one stream.`
      : `这里聚合了和“${category}”相关的文章、方法、观察与实践内容，适合按主题连续阅读。`
    : isTagPage
      ? locale.locale === 'en-US'
        ? `Posts connected by the tag ${tag}. Use this page to follow one recurring keyword or working idea.`
        : `这里聚合了带有“${tag}”标签的内容，适合沿着一个关键词或方法脉络继续看下去。`
      : ''

  return (
    <div id='post-outer-wrapper' className='px-5  md:px-0'>
      {(isCategoryPage || isTagPage) && (
        <div className='mb-5 overflow-hidden rounded-[30px] border border-slate-200 bg-white px-6 py-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)] dark:border-gray-800 dark:bg-[#1e1e1e] sm:px-8'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='max-w-3xl'>
              <div className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-gray-400'>
                {heroLabel}
              </div>
              <h1 className='mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-gray-100 sm:text-5xl'>
                {heroTitle}
              </h1>
              <p className='mt-4 text-sm leading-7 text-slate-600 dark:text-gray-400 sm:text-base'>
                {heroDescription}
              </p>
            </div>

            <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-gray-700 dark:bg-[#161616]'>
              <div className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-gray-400'>
                {locale.locale === 'en-US' ? 'Published posts' : '已发布文章'}
              </div>
              <div className='mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-gray-100'>
                {postCount}
              </div>
            </div>
          </div>
        </div>
      )}
      <CategoryBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}

export default LayoutPostList
