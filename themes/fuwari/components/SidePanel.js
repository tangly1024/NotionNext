import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import AdCard from './AdCard'
import AnalyticsCard from './AnalyticsCard'
import Announcement from './Announcement'
import ContactCard from './ContactCard'
import CONFIG from '../config'
import PluginCard from './PluginCard'
import SocialButton from './SocialButton'
import Toc from './Toc'

const SidePanel = props => {
  const {
    latestPosts = [],
    categoryOptions = [],
    tagOptions = [],
    post,
    notice,
    rightAreaSlot,
    postCount,
    siteInfo
  } = props
  const { locale } = useGlobal()
  const title = siteConfig('TITLE')
  const description = siteConfig('DESCRIPTION')
  const showToc =
    siteConfig('FUWARI_ARTICLE_TOC', true, CONFIG) &&
    post?.toc &&
    post.toc.length > 1

  return (
    <aside className='space-y-4'>
      <section className='fuwari-card fuwari-profile-card p-4'>
        <SmartLink href={siteConfig('FUWARI_PROFILE_PATH', '/about', CONFIG)} className='fuwari-profile-link block mb-2.5'>
          <div className='fuwari-profile-thumb relative overflow-hidden rounded-2xl'>
            <LazyImage
              src={siteInfo?.icon}
              alt={siteConfig('AUTHOR') || title}
              className='w-full aspect-square object-cover'
            />
            <span className='fuwari-profile-overlay' aria-hidden='true'>
              <i className='far fa-id-card' />
            </span>
          </div>
        </SmartLink>
        <h2 className='text-xl font-semibold mb-1'>{siteConfig('AUTHOR') || title}</h2>
        {description && (
          <p className='text-sm leading-6 text-[var(--fuwari-muted)]'>
            {description}
          </p>
        )}
        <div className='pt-3 mt-3 border-t border-[var(--fuwari-border)]'>
          <SocialButton />
        </div>
      </section>

      {showToc && (
        <section className='fuwari-card p-4'>
          <h3 className='text-sm font-semibold mb-3 px-3 tracking-wide uppercase text-[var(--fuwari-muted)]'>
            {locale?.ARTICLE?.TABLE_OF_CONTENT || '目录'}
          </h3>
          <Toc toc={post.toc} />
        </section>
      )}

      {siteConfig('FUWARI_WIDGET_NOTICE', true, CONFIG) &&
        notice &&
        Object.keys(notice).length > 0 && (
          <Announcement post={notice} title={locale?.COMMON?.ANNOUNCEMENT || '公告'} className='p-5' />
      )}

      {siteConfig('FUWARI_WIDGET_LATEST_POSTS', true, CONFIG) && latestPosts.length > 0 && (
        <section className='fuwari-card p-5'>
          <h3 className='text-sm font-semibold mb-3 tracking-wide uppercase text-[var(--fuwari-muted)]'>
            {locale?.COMMON?.LATEST_POSTS || '最新发布'}
          </h3>
          <div className='space-y-2'>
            {latestPosts.slice(0, 6).map(p => (
              <SmartLink
                key={p.id}
                href={p.href || `/${p.slug}`}
                className='block text-sm leading-6 hover:text-[var(--fuwari-primary)]'>
                {p.title}
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      {siteConfig('FUWARI_WIDGET_CATEGORY_LIST', true, CONFIG) && categoryOptions.length > 0 && (
        <section className='fuwari-card p-5'>
          <h3 className='fuwari-section-title text-sm font-semibold mb-3 tracking-wide uppercase text-[var(--fuwari-muted)]'>
            {locale?.COMMON?.CATEGORY || '分类'}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {categoryOptions.slice(0, 14).map(c => (
              <SmartLink
                key={c.name}
                href={`/category/${encodeURIComponent(c.name)}`}
                className='fuwari-chip'>
                {c.name} {c.count ? `(${c.count})` : ''}
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      {siteConfig('FUWARI_WIDGET_TAG_LIST', true, CONFIG) && tagOptions.length > 0 && (
        <section className='fuwari-card p-5'>
          <h3 className='fuwari-section-title text-sm font-semibold mb-3 tracking-wide uppercase text-[var(--fuwari-muted)]'>
            {locale?.COMMON?.TAGS || '标签'}
          </h3>
          <div className='flex flex-wrap gap-2'>
            {tagOptions.slice(0, 28).map(t => (
              <SmartLink
                key={t.name}
                href={`/tag/${encodeURIComponent(t.name)}`}
                className='fuwari-chip'>
                #{t.name}
              </SmartLink>
            ))}
          </div>
        </section>
      )}

      <ContactCard />
      <AnalyticsCard
        postCount={postCount}
        categoryOptions={categoryOptions}
        tagOptions={tagOptions}
      />
      <AdCard />
      <PluginCard rightAreaSlot={rightAreaSlot} />
    </aside>
  )
}

export default SidePanel

