const providers = [
  'COMMENT_ARTALK_SERVER',
  'COMMENT_TWIKOO_ENV_ID',
  'COMMENT_WALINE_SERVER_URL',
  'COMMENT_VALINE_APP_ID',
  'COMMENT_GISCUS_REPO',
  'COMMENT_CUSDIS_APP_ID',
  'COMMENT_UTTERRANCES_REPO',
  'COMMENT_GITALK_CLIENT_ID',
  'COMMENT_WEBMENTION_ENABLE'
]

export function hasEnabledComments(readConfig) {
  return (
    providers.some(key => {
      const value = readConfig(key)
      return Boolean(value) && value !== 'false'
    }) || [true, 'true'].includes(readConfig('COMMENT_NOTION_ENABLE'))
  )
}
