import { siteConfig } from '@/lib/config'
import { hasEnabledComments } from '@/lib/utils/comments'
import CONFIG from '../config'

/**
 * 是否与 `components/Comment.js` 中实际会渲染的评论源一致。
 * 未配置任何服务时不在主题中占位，避免空白「评论区」。
 */
export function isCommentServiceConfigured() {
  return hasEnabledComments(siteConfig)
}

/** 评论区与浮动入口共用同一显示条件，避免入口指向不存在的评论区。 */
export function shouldShowFuwariComments({ post, lock }) {
  return Boolean(
    post &&
      !lock &&
      post.comment !== 'Hide' &&
      siteConfig('FUWARI_ARTICLE_COMMENT', true, CONFIG) &&
      isCommentServiceConfigured()
  )
}
