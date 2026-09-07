import NotionIcon from '@/components/NotionIcon'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

export default function ArticleInfo({ post }) {
  const showCategory = siteConfig('EDITORIAL_ARTICLE_CATEGORY', true, CONFIG)
  const showTags = siteConfig('EDITORIAL_ARTICLE_TAG', true, CONFIG)

  return (
    <header className='editorial-article-header'>
      <div className='editorial-article-kicker'>
        {showCategory && post?.category && (
          <SmartLink href={`/category/${encodeURIComponent(post.category)}`}>
            {post.category}
          </SmartLink>
        )}
        <span>{post?.date?.start_date || post?.createdTime}</span>
      </div>
      <h1 className='editorial-article-title'>
        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
        {post?.title}
      </h1>
      {post?.summary && <p className='editorial-article-deck'>{post.summary}</p>}
      {showTags && post?.tags?.length > 0 && (
        <div className='editorial-article-tags'>
          {post.tags.map(tag => (
            <SmartLink key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
              {tag}
            </SmartLink>
          ))}
        </div>
      )}
    </header>
  )
}
