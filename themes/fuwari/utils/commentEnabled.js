import { siteConfig } from '@/lib/config'

/**
 * 是否与 `components/Comment.js` 中实际会渲染的评论源一致。
 * 未配置任何服务时不在主题中占位，避免空白「评论区」。
 */
export function isCommentServiceConfigured() {
  return Boolean(
    siteConfig('COMMENT_ARTALK_SERVER') ||
      siteConfig('COMMENT_TWIKOO_ENV_ID') ||
      siteConfig('COMMENT_WALINE_SERVER_URL') ||
      siteConfig('COMMENT_VALINE_APP_ID') ||
      siteConfig('COMMENT_GISCUS_REPO') ||
      siteConfig('COMMENT_CUSDIS_APP_ID') ||
      siteConfig('COMMENT_UTTERRANCES_REPO') ||
      siteConfig('COMMENT_GITALK_CLIENT_ID') ||
      siteConfig('COMMENT_WEBMENTION_ENABLE')
  )
}
