import { siteConfig } from '@/lib/config'
// import twikoo from 'twikoo'

/**
 * 获取博客的评论数，用与在列表中展示
 * @returns {JSX.Element}
 * @constructor
 */

const TwikooCommentCount = ({ post, className }) => {
  if (!JSON.parse(siteConfig('COMMENT_TWIKOO_COUNT_ENABLE'))) {
    return null
  }
  return <a href={`${post.slug}?target=comment`} className={`mx-1 hidden comment-count-wrapper-${post.id} ${className || ''}`}>
        <i className="far fa-comment mr-1"></i>
        <span className={`comment-count-text-${post.id}`}>
            {/* <i className='fa-solid fa-spinner animate-spin' /> */}
        </span>
    </a>
}

export default TwikooCommentCount
