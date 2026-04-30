import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const AdjacentCard = ({ label, post, align = 'left' }) => {
  if (!post) return <div className='fuwari-card p-4 opacity-50'>{label}</div>
  return (
    <SmartLink href={post.href || `/${post.slug}`} className='fuwari-card p-4 block'>
      <p className='text-xs uppercase tracking-wider text-[var(--fuwari-muted)] mb-1'>{label}</p>
      <p className={`text-sm font-medium ${align === 'right' ? 'text-right' : ''}`}>{post.title}</p>
    </SmartLink>
  )
}

const ArticleAdjacent = ({ prev, next }) => {
  if (!siteConfig('FUWARI_ARTICLE_ADJACENT', true, CONFIG)) return null
  if (!prev && !next) return null

  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6'>
      <AdjacentCard label='Previous' post={prev} />
      <AdjacentCard label='Next' post={next} align='right' />
    </section>
  )
}

export default ArticleAdjacent

