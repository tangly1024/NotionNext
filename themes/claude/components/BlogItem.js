import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

export const BlogItem = props => {
  const { post } = props
  const { NOTION_CONFIG } = useGlobal()
  const showPageCover = siteConfig('CLAUDE_POST_COVER_ENABLE', false, CONFIG)
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post.blockMap
  return (
    <div key={post.id} className='claude-article-item'>
      <div className='flex'>
        <div className='article-cover h-full'>
          {showPageCover && (
            <div className='overflow-hidden mr-3 w-48 h-full rounded-lg'>
              <SmartLink href={post.href} passHref legacyBehavior>
                <LazyImage
                  src={post?.pageCoverThumbnail}
                  className='w-48 h-full object-cover object-center hover:scale-105 duration-300'
                />
              </SmartLink>
            </div>
          )}
        </div>

        <article className='article-info flex-1'>
          <h2 className='mb-1'>
            <SmartLink
              href={post.href}
              className='text-lg font-medium text-[var(--claude-text-primary)] hover:text-[var(--claude-accent)] duration-200 transition-colors'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}
              {post.title}
            </SmartLink>
          </h2>

          {/* 文章信息 */}
          <div className='text-sm text-[var(--claude-text-tertiary)] flex flex-wrap items-center gap-x-3 mb-2'>
            <span>
              {post.date?.start_date || post.createdTime}
            </span>
            {post?.tags && post?.tags?.length > 0 && (
              <div className='flex flex-wrap gap-x-2'>
                {post.tags.map(t => (
                  <SmartLink
                    key={t}
                    href={`/tag/${t}`}
                    className='hover:text-[var(--claude-accent)] transition-colors duration-200'>
                    #{t}
                  </SmartLink>
                ))}
              </div>
            )}
          </div>

          <div className='text-sm text-[var(--claude-text-secondary)] line-clamp-2 leading-relaxed'>
            {!showPreview && post.summary}
            {showPreview && post?.blockMap && (
              <div className='line-clamp-2 overflow-hidden'>
                <NotionPage post={post} />
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
