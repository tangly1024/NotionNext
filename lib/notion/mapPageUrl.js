import { uuidToId } from 'notion-utils'
import { checkStrIsNotionId, getLastPartOfUrl, isBrowser } from '../utils'

/**
 * 处理页面内连接跳转:
 * 1. 若是本站域名，则在当前窗口打开、不开新窗口
 * 2. 若是Notion笔记中的内链，尝试转换成博客中现有的文章地址
 */
export const mapPageUrl = allPages => {
  if (isBrowser) {
    const currentURL = window.location.origin + window.location.pathname
    const allAnchorTags = document.getElementsByTagName('a') // 或者使用 document.querySelectorAll('a') 获取 NodeList
    for (const anchorTag of allAnchorTags) {
      // 检查url
      if (anchorTag?.href) {
        // 如果url是一个Notion_id，尝试匹配成博客的文章内链
        const slug = getLastPartOfUrl(anchorTag.href)
        if (checkStrIsNotionId(slug)) {
          const slugPage = allPages?.find(page => uuidToId(page.id) === slug)
          if (slugPage) {
            anchorTag.href = slugPage?.href
          }
        }
      }

      if (anchorTag?.target === '_blank') {
        const hrefWithoutQueryHash = anchorTag.href.split('?')[0].split('#')[0]
        const hrefWithRelativeHash =
          currentURL.split('#')[0] + anchorTag.href.split('#')[1]

        if (
          currentURL === hrefWithoutQueryHash ||
          currentURL === hrefWithRelativeHash
        ) {
          anchorTag.target = '_self'
        }
      }
    }
  }
}
