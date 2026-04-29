import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG from '../config'

const getCurrentSearchQuery = router => {
  const queryString = router?.asPath?.split('?')[1]?.split('#')[0] || ''
  const params = new URLSearchParams(queryString)
  const query = {}
  params.forEach((value, key) => {
    query[key] = value
  })
  return query
}

const getArchiveHref = (publishDay, router) => {
  const query = getCurrentSearchQuery(router)
  if (!publishDay) return { pathname: '/archive', query }
  const str = String(publishDay)
  const matched = str.match(/^(\d{4})[-/.](\d{1,2})/)
  if (!matched) return { pathname: '/archive', query }
  const year = matched[1]
  const month = matched[2].padStart(2, '0')
  return {
    pathname: '/archive',
    query,
    hash: `archive-${year}-${month}`
  }
}

const PostCard = ({ post }) => {
  const router = useRouter()
  const coverSrc =
    post.pageCoverThumbnail ||
    (siteConfig('FUWARI_POST_LIST_COVER_DEFAULT', true, CONFIG) &&
      siteConfig('HOME_BANNER_IMAGE'))
  const [coverFailed, setCoverFailed] = useState(false)
  const showCover = Boolean(coverSrc) && !coverFailed
  const showRail = !showCover

  return (
    <article className='fuwari-card fuwari-card-hover p-4 relative'>
      <div
        className={`md:grid md:gap-4 md:items-stretch min-h-[178px] ${
          showRail
            ? 'md:grid-cols-[minmax(0,1fr)_220px_56px]'
            : 'md:grid-cols-[minmax(0,1fr)_220px]'
        }`}>
        <div className='min-w-0 flex-1 md:pr-1'>
          <h2 className='fuwari-post-title text-[2rem] font-bold mb-1.5 leading-tight'>
            <SmartLink href={post.href || `/${post.slug}`} className='hover:opacity-90 transition-opacity'>
              {post.title}
            </SmartLink>
          </h2>
          <div className='fuwari-meta-row mb-2.5'>
            <SmartLink href={getArchiveHref(post.publishDay, router)} className='fuwari-meta-item'>
              <i className='far fa-calendar-alt fuwari-meta-icon' />
              <span className='fuwari-meta-text'>{post.publishDay}</span>
            </SmartLink>
            {siteConfig('FUWARI_POST_LIST_TAG', true, CONFIG) && (
              <>
                {post.category && (
                  <SmartLink
                    href={`/category/${encodeURIComponent(post.category)}`}
                    className='fuwari-meta-item'>
                    <i className='far fa-bookmark fuwari-meta-icon' />
                    <span className='fuwari-meta-text'>{post.category}</span>
                  </SmartLink>
                )}
                {!!post.tagItems?.length && (
                  <span className='fuwari-meta-tags'>
                    <i className='fas fa-hashtag' />
                    {post.tagItems.slice(0, 3).map((tag, idx) => (
                      <SmartLink key={tag.name} href={`/tag/${encodeURIComponent(tag.name)}`} className='hover:underline'>
                        {idx > 0 ? ' / ' : ''}
                        {tag.name}
                      </SmartLink>
                    ))}
                  </span>
                )}
              </>
            )}
          </div>
          {siteConfig('FUWARI_POST_LIST_SUMMARY', true, CONFIG) && post.summary && (
            <p className='text-sm leading-7 text-[var(--fuwari-muted)] fuwari-summary'>
              {post.summary}
            </p>
          )}
        </div>
        {siteConfig('FUWARI_POST_LIST_COVER', true, CONFIG) && (
          <div className='mt-4 md:mt-0'>
            {showCover ? (
              <SmartLink href={post.href || `/${post.slug}`}>
                <div
                  className={`fuwari-cover-wrap h-full ${siteConfig('FUWARI_POST_LIST_COVER_HOVER_ENLARGE', true, CONFIG) ? 'fuwari-cover-enlarge' : ''}`}>
                  <img
                    src={coverSrc}
                    alt={post.title}
                    className='w-full h-40 md:h-full object-cover rounded-2xl'
                    onError={() => setCoverFailed(true)}
                  />
                </div>
              </SmartLink>
            ) : (
              <div className='hidden md:block h-full' />
            )}
          </div>
        )}
        {showRail && (
          <SmartLink href={post.href || `/${post.slug}`} className='hidden md:flex fuwari-readmore-rail'>
            <i className='fas fa-chevron-right' />
          </SmartLink>
        )}
      </div>
    </article>
  )
}

const PostList = ({ posts = [] }) => {
  return (
    <div id='posts-wrapper' className='grid gap-4'>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default PostList

