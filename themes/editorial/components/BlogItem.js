import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

export default function BlogItem({ post, featured = false }) {
  const showCover = siteConfig('EDITORIAL_POST_LIST_COVER', true, CONFIG)
  const showCategory = siteConfig(
    'EDITORIAL_POST_LIST_CATEGORY',
    true,
    CONFIG
  )
  const showTags = siteConfig('EDITORIAL_POST_LIST_TAG', false, CONFIG)
  const cover = post?.pageCoverThumbnail || post?.pageCover

  return (
    <article className={`editorial-post-card ${featured ? 'featured' : ''}`}>
      {showCover && cover && (
        <SmartLink href={post.href} className='editorial-post-cover'>
          <LazyImage src={cover} className='editorial-post-cover-image' />
        </SmartLink>
      )}
      <div className='editorial-post-copy'>
        <div className='editorial-post-eyebrow'>
          {showCategory && post.category && (
            <SmartLink
              href={`/category/${encodeURIComponent(post.category)}`}>
              {post.category}
            </SmartLink>
          )}
          <span>{post.date?.start_date || post.createdTime}</span>
        </div>
        <h2 className='editorial-post-title'>
          <SmartLink href={post.href}>{post.title}</SmartLink>
        </h2>
        {post.summary && <p className='editorial-post-summary'>{post.summary}</p>}
        {showTags && post.tags?.length > 0 && (
          <div className='editorial-post-tags'>
            {post.tags.map(tag => (
              <SmartLink key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
                #{tag}
              </SmartLink>
            ))}
          </div>
        )}
        <SmartLink href={post.href} className='editorial-read-more'>
          Read article <span aria-hidden='true'>↗</span>
        </SmartLink>
      </div>
    </article>
  )
}
