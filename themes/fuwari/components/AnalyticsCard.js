import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

const Item = ({ label, value, href }) => (
  <SmartLink
    href={href}
    className='fuwari-card fuwari-analytics-item fuwari-analytics-link p-3 text-center min-w-0 block no-underline text-inherit hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fuwari-primary)]'>
    <div className='text-lg font-semibold leading-none text-[var(--fuwari-text)]'>{value}</div>
    <div className='fuwari-analytics-label mt-1'>{label}</div>
  </SmartLink>
)

const AnalyticsCard = ({ postCount = 0, categoryOptions = [], tagOptions = [] }) => {
  const { locale, lang } = useGlobal()
  if (!siteConfig('FUWARI_WIDGET_ANALYTICS', true, CONFIG)) return null

  // zh-* 的 COMMON.POSTS 多为「篇文章」，不适合单独作统计标签，改用「文章」
  const postsLabel = /^zh-(CN|TW|HK)$/i.test(lang || '')
    ? locale?.COMMON?.ARTICLE || '文章'
    : locale?.COMMON?.POSTS || locale?.COMMON?.ARTICLE || 'Posts'

  const title = locale?.COMMON?.ANALYTICS || 'Analytics'
  const categoryLabel = locale?.COMMON?.CATEGORY || 'Categories'
  const tagsLabel = locale?.COMMON?.TAGS || 'Tags'

  return (
    <section>
      <h3 className='text-sm font-semibold mb-2 tracking-wide uppercase text-[var(--fuwari-muted)] px-1'>
        {title}
      </h3>
      <div className='grid grid-cols-3 gap-2'>
        <Item label={postsLabel} value={postCount || 0} href='/archive' />
        <Item label={categoryLabel} value={categoryOptions?.length || 0} href='/category' />
        <Item label={tagsLabel} value={tagOptions?.length || 0} href='/tag' />
      </div>
    </section>
  )
}

export default AnalyticsCard

