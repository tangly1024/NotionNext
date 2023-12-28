import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Giscus from '@giscus/react'

/**
 * Giscus评论 @see https://giscus.app/zh-CN
 * Contribute by @txs https://github.com/txs/NotionNext/commit/1bf7179d0af21fb433e4c7773504f244998678cb
 * @returns {JSX.Element}
 * @constructor
 */

const GiscusComponent = () => {
  const { isDarkMode } = useGlobal()
  const theme = isDarkMode ? 'dark' : 'light'

  return (
    <Giscus
      repo={siteConfig('COMMENT_GISCUS_REPO')}
      repoId={siteConfig('COMMENT_GISCUS_REPO_ID')}
      categoryId={siteConfig('COMMENT_GISCUS_CATEGORY_ID')}
      mapping={siteConfig('COMMENT_GISCUS_MAPPING')}
      reactionsEnabled={siteConfig('COMMENT_GISCUS_REACTIONS_ENABLED')}
      emitMetadata={siteConfig('COMMENT_GISCUS_EMIT_METADATA')}
      theme={theme}
      inputPosition={siteConfig('COMMENT_GISCUS_INPUT_POSITION')}
      lang={siteConfig('COMMENT_GISCUS_LANG')}
      loading={siteConfig('COMMENT_GISCUS_LOADING')}
      crossorigin={siteConfig('COMMENT_GISCUS_CROSSORIGIN')}
    />
  )
}

export default GiscusComponent
