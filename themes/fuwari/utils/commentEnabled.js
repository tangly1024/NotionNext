import { siteConfig } from '@/lib/config'
import { hasEnabledComments } from '@/lib/utils/comments'

/**
 * 是否与 `components/Comment.js` 中实际会渲染的评论源一致。
 * 未配置任何服务时不在主题中占位，避免空白「评论区」。
 */
export function isCommentServiceConfigured() {
  return hasEnabledComments(siteConfig)
}
