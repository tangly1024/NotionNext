import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'
// import Giscus from '@giscus/react'

/**
 * Giscus评论 @see https://giscus.app/zh-CN
 * Contribute by @txs https://github.com/txs/NotionNext/commit/1bf7179d0af21fb433e4c7773504f244998678cb
 * @returns {JSX.Element}
 * @constructor
 */

const GiscusComponent = () => {
  const { isDarkMode } = useGlobal()
  const theme = isDarkMode ? 'dark' : 'light'
  useEffect(() => {
    loadExternalResource('/js/giscus.js', 'js').then(() => {
      if (window?.Giscus?.init) {
        window?.Giscus?.init('#giscus')
      }
    })
    return () => {
      window?.Giscus?.destroy()
    }
  }, [isDarkMode])

  return (
    <div
      id='giscus'
      data-repo={siteConfig('COMMENT_GISCUS_REPO')}
      data-repo-id={siteConfig('COMMENT_GISCUS_REPO_ID')}
      //   data-category='{{ $.Site.Params.giscus.dataCategory }}'
      data-category-id={siteConfig('COMMENT_GISCUS_CATEGORY_ID')}
      data-mapping={siteConfig('COMMENT_GISCUS_MAPPING')}
      //   data-strict='0'
      data-reactions-enabled={siteConfig('COMMENT_GISCUS_REACTIONS_ENABLED')}
      data-emit-metadata={siteConfig('COMMENT_GISCUS_EMIT_METADATA')}
      data-input-position={siteConfig('COMMENT_GISCUS_INPUT_POSITION')}
      data-theme={theme}
      data-lang={siteConfig('COMMENT_GISCUS_LANG')}
      data-loading={siteConfig('COMMENT_GISCUS_LOADING')}
      //   crossorigin={siteConfig('COMMENT_GISCUS_CROSSORIGIN')}
    ></div>
  )
}

export default GiscusComponent
