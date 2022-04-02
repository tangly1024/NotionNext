import BLOG from '@/blog.config'
import { Giscus } from '@giscus/react'

/**
 * Giscus评论 @see https://giscus.app/zh-CN
 * Contribute by @txs https://github.com/txs/NotionNext/commit/1bf7179d0af21fb433e4c7773504f244998678cb
 * @returns {JSX.Element}
 * @constructor
 */

const GiscusComponent = ({ isDarkMode }) => {
  const theme = isDarkMode ? 'dark' : 'light'
  return (
    <Giscus
      repo={BLOG.COMMENT_GISCUS_REPO}
      repoId={BLOG.COMMENT_GISCUS_REPO_ID}
      categoryId={BLOG.COMMENT_GISCUS_CATEGORY_ID}
      mapping={BLOG.COMMENT_GISCUS_MAPPING}
      reactionsEnabled={BLOG.COMMENT_GISCUS_REACTIONS_ENABLED}
      emitMetadata={BLOG.COMMENT_GISCUS_EMIT_METADATA}
      theme={theme}
      inputPosition={BLOG.COMMENT_GISCUS_INPUT_POSITION}
      lang={BLOG.COMMENT_GISCUS_LANG}
      loading={BLOG.COMMENT_GISCUS_LOADING}
      crossorigin={BLOG.COMMENT_GISCUS_CROSSORIGIN}
    />
  )
}

export default GiscusComponent
