import { idToUuid } from 'notion-utils'
import { checkStrIsNotionId, getLastPartOfUrl, isBrowser } from '../utils'


/**
 * 终极站内外链判断函数（生产环境可用）
 * @param {HTMLAnchorElement} anchor - 待检测的链接元素
 * @returns {boolean} - true:站内链接 / false:站外链接
 */
function isInternalLink(anchor) {
  // 短路无效元素
  if (!(anchor instanceof HTMLAnchorElement)) return false;
  
  try {
    const href = anchor.href;
    // 提前处理空链接和自指向链接
    if (!href || href === window.location.href) return true;

    // 排除非HTTP协议
    const protocol = anchor.protocol;
    if (['tel:', 'mailto:', 'javascript:', 'file:'].includes(protocol)) {
      return false;
    }

    // 纯哈希锚点判断（支持无路径的#hash）
    if (anchor.hash && !anchor.search && anchor.pathname === '/') {
      return true;
    }

    // 标准化Origin对比（自动处理相对路径/大小写/端口）
    const currentOrigin = window.location.origin;
    const linkOrigin = new URL(href, currentOrigin).origin;
    
    return linkOrigin === currentOrigin;
  } catch (e) {
    // 异常URL统一按外链处理
    return false;
  }
}

/**
 * 处理页面内连接跳转:
 * 1.若是本站域名，则在当前窗口打开、不开新窗口
 * 2.url是notion-id，转成站内文章链接
 */
export const convertInnerUrl = ({ allPages, lang }) => {
  if (!isBrowser) {
    return
  }
  const allAnchorTags = document
    ?.getElementById('notion-article')
    ?.querySelectorAll('a.notion-link, a.notion-collection-card')

  if (!allAnchorTags) {
    return
  }
  const { origin, pathname } = window.location
  const currentURL = origin + pathname
  const currentPathLang = pathname.split('/').filter(Boolean)[0]
  const langPrefix = lang === currentPathLang ? '/' + lang : ''
  for (const anchorTag of allAnchorTags) {
    // url替换成slug
    if (anchorTag?.href) {
      // 如果url是一个Notion_id，尝试匹配成博客的文章内链
      const slug = getLastPartOfUrl(anchorTag.href)
      if (checkStrIsNotionId(slug)) {
        const slugPage = allPages?.find(page => {
          return idToUuid(slug).indexOf(page.short_id) === 14
        })
        if (slugPage) {
          anchorTag.href = langPrefix + slugPage?.href
        }
      }
    }
    // 链接在当前页面打开
    if (anchorTag?.target === '_blank' && isInternalLink(anchorTag)) {
      anchorTag.target = '_self'
      // const hrefWithoutQueryHash = anchorTag.href.split('?')[0].split('#')[0]
      // const hrefWithRelativeHash =
      //   currentURL.split('#')[0] || '' + anchorTag.href.split('#')[1] || ''
      // if (
      //   currentURL === hrefWithoutQueryHash ||
      //   currentURL === hrefWithRelativeHash
      // ) {
      //   anchorTag.target = '_self'
      // }
    }

    // 如果链接以#号结尾，则强制在新窗口打开
    if (anchorTag.href.endsWith('#')) {
      anchorTag.target = '_blank'
    }
  }

  for (const anchorTag of allAnchorTags) {
    const slug = getLastPartOfUrl(anchorTag.href)
    const slugPage = allPages?.find(page => {
      return page.slug.indexOf(slug) >= 0
    })
    if (slugPage) {
    }
  }
}
