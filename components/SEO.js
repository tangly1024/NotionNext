import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { generateLocaleDict } from '@/lib/lang'
import { getEnhancedPostDescription, getEnhancedPostTitle } from '@/lib/seo/postEnhancements'
import { loadExternalResource } from '@/lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const LOW_VALUE_ROUTES = new Set([
  '/search',
  '/search/[keyword]',
  '/search/[keyword]/page/[page]',
  '/tag/[tag]/page/[page]',
  '/category/[category]/page/[page]',
  '/page/[page]'
])

const LOCALE_PREFIX_REGEX = /^\/[a-z]{2}(?:-[A-Za-z]{2})?(?=\/|$)/i

const normalizePath = path => {
  if (!path || path === '/') {
    return '/'
  }

  let sanitized = String(path).split('?')[0].split('#')[0].trim()
  try {
    sanitized = decodeURIComponent(sanitized)
  } catch (error) {
    // 保持原始路径，避免 malformed URI 直接中断 SEO 渲染
  }

  if (!sanitized || sanitized === '/') {
    return '/'
  }

  return `/${sanitized.replace(/^\/+|\/+$/g, '')}`
}

const joinSiteUrl = (baseUrl, path = '/') => {
  const normalizedBase = String(baseUrl || '').replace(/\/+$/g, '')
  const normalizedPath = normalizePath(path)
  return normalizedPath === '/'
    ? `${normalizedBase}/`
    : `${normalizedBase}${normalizedPath}`
}

const toAbsoluteUrl = (value, baseUrl) => {
  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  return joinSiteUrl(baseUrl, value)
}

const getCanonicalPath = ({ meta, post }) => {
  const preferredSlug =
    typeof post?.slug === 'string' && post.slug.trim()
      ? post.slug
      : meta?.slug

  if (!preferredSlug) {
    return '/'
  }

  return normalizePath(preferredSlug)
}

const normalizeLocaleCode = localeCode => {
  if (!localeCode) {
    return 'zh-CN'
  }

  const normalized = String(localeCode).replace('_', '-')
  if (normalized === 'en') {
    return 'en-US'
  }
  if (normalized === 'zh') {
    return 'zh-CN'
  }

  return normalized
}

const getCurrentLocaleCode = (router, globalLang) => {
  const routeLocale = normalizeLocaleCode(router?.locale)
  if (routeLocale) {
    return routeLocale
  }

  const pathMatch = String(router?.asPath || '').match(LOCALE_PREFIX_REGEX)
  if (pathMatch?.[0]) {
    return normalizeLocaleCode(pathMatch[0].slice(1))
  }

  return normalizeLocaleCode(globalLang)
}

const getLocalizedCanonicalPath = ({ router, meta, post }) => {
  const currentPath = normalizePath(router?.asPath || router?.pathname)
  const hasLocalePrefix = LOCALE_PREFIX_REGEX.test(currentPath)

  if (hasLocalePrefix || LOW_VALUE_ROUTES.has(router?.route)) {
    return currentPath
  }

  return getCanonicalPath({ meta, post })
}

const getLocalePrefix = localeCode => {
  const normalizedLocale = normalizeLocaleCode(localeCode)
  if (!normalizedLocale || normalizedLocale === 'zh-CN') {
    return ''
  }

  return `/${normalizedLocale}`
}

const isUuidLikeValue = value =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  )

const hasUuidLikeSlugTail = slug => {
  if (typeof slug !== 'string') {
    return false
  }

  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '')
  if (!normalizedSlug) {
    return false
  }

  const segments = normalizedSlug.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  return isUuidLikeValue(lastSegment)
}

const localizePath = (path, localeCode) => {
  const normalizedPath = normalizePath(path)
  const localePrefix = getLocalePrefix(localeCode)

  if (!localePrefix || normalizedPath === '/' || normalizedPath.startsWith(`${localePrefix}/`) || normalizedPath === localePrefix) {
    return normalizedPath
  }

  return `${localePrefix}${normalizedPath === '/' ? '' : normalizedPath}`
}

const toIsoDate = value => {
  if (!value && value !== 0) {
    return undefined
  }

  const date = typeof value === 'number' ? new Date(value) : new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  const PATH = siteConfig('PATH')
  const LINK = siteConfig('LINK')
  const SUB_PATH = siteConfig('SUB_PATH', '')
  // 确保 URL 格式正确，避免双斜杠
  let url = PATH?.length ? `${LINK}${LINK.endsWith('/') ? '' : '/'}${SUB_PATH}` : LINK
  // 确保 URL 末尾没有斜杠
  url = url.endsWith('/') ? url.slice(0, -1) : url
  let image
  const router = useRouter()
  const globalState = useGlobal()
  const currentLocaleCode = getCurrentLocaleCode(router, globalState?.lang)
  const currentLocale =
    globalState?.lang === currentLocaleCode
      ? globalState?.locale
      : generateLocaleDict(currentLocaleCode)
  const meta = getSEOMeta(props, router, currentLocale, currentLocaleCode)
  const webFontUrl = siteConfig('FONT_URL')

  useEffect(() => {
    // 使用WebFontLoader字体加载
    loadExternalResource(
      'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
      'js'
    ).then(url => {
      const WebFont = window?.WebFont
      if (WebFont) {
        // console.log('LoadWebFont', webFontUrl)
        WebFont.load({
          custom: {
            // families: ['"LXGW WenKai"'],
            urls: webFontUrl
          }
        })
      }
    })
  }, [webFontUrl])

  // SEO关键词
  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    image = meta.image || '/bg_image.jpg'
  }
  const absoluteImage = toAbsoluteUrl(image, url)
  const canonicalPath =
    router.route === '/404'
      ? localizePath('/404', currentLocaleCode)
      : localizePath(
          getLocalizedCanonicalPath({ router, meta, post }),
          currentLocaleCode
        )
  const canonicalUrl = joinSiteUrl(url, canonicalPath)
  const ogUrl = canonicalUrl.endsWith('/')
    ? canonicalUrl.slice(0, -1)
    : canonicalUrl
  const siteRootUrl = joinSiteUrl(url, '/')
  const localePrefix = getLocalePrefix(currentLocaleCode)
  const searchUrl = `${siteRootUrl.replace(/\/$/, '')}${localePrefix}/search?keyword={search_term_string}`
  const currentPath = localizePath(normalizePath(router?.asPath), currentLocaleCode)
  const isAliasPath =
    ['Post', 'Page'].includes(post?.type) &&
    currentPath !== '/' &&
    currentPath !== canonicalPath
  const isUuidSlugPost =
    ['Post', 'Page'].includes(post?.type) && hasUuidLikeSlugTail(post?.slug)
  const shouldNoIndex =
    LOW_VALUE_ROUTES.has(router.route) || isAliasPath || isUuidSlugPost || router.route === '/404'
  const robotsContent = shouldNoIndex ? 'noindex, follow' : 'follow, index'
  const TITLE = siteConfig('TITLE')
  const title = meta?.title || TITLE
  const description = meta?.description || `${siteInfo?.description}`
  const type = meta?.type || 'website'
  const lang = currentLocaleCode.replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = meta?.category || KEYWORDS // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類
  const favicon = siteConfig('BLOG_FAVICON')
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

  const SEO_BAIDU_SITE_VERIFICATION = siteConfig(
    'SEO_BAIDU_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
    'SEO_GOOGLE_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)

  const COMMENT_WEBMENTION_ENABLE = siteConfig(
    'COMMENT_WEBMENTION_ENABLE',
    null,
    NOTION_CONFIG
  )

  const COMMENT_WEBMENTION_HOSTNAME = siteConfig(
    'COMMENT_WEBMENTION_HOSTNAME',
    null,
    NOTION_CONFIG
  )
  const COMMENT_WEBMENTION_AUTH = siteConfig(
    'COMMENT_WEBMENTION_AUTH',
    null,
    NOTION_CONFIG
  )
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig(
    'ANALYTICS_BUSUANZI_ENABLE',
    null,
    NOTION_CONFIG
  )

  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)

  const AUTHOR = siteConfig('AUTHOR')
  const siteTitle = siteInfo?.title || TITLE
  const articleJsonLd =
    meta?.type === 'Post'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          image: absoluteImage ? [absoluteImage] : undefined,
          datePublished: toIsoDate(post?.publishDate) || toIsoDate(meta.publishDate) || meta.publishDay,
          dateModified:
            toIsoDate(post?.lastEditedDate) ||
            toIsoDate(meta.lastEditedDate) ||
            toIsoDate(post?.publishDate) ||
            toIsoDate(meta.publishDate) ||
            meta.publishDay,
          author: AUTHOR
            ? {
                '@type': 'Person',
                name: AUTHOR
              }
            : undefined,
          publisher: {
            '@type': 'Organization',
            name: siteTitle,
            logo: BLOG_FAVICON
              ? {
                  '@type': 'ImageObject',
                  url: toAbsoluteUrl(BLOG_FAVICON, url)
                }
              : undefined
          },
          mainEntityOfPage: canonicalUrl
        }
      : null
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: siteRootUrl,
    description: description || siteInfo?.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: searchUrl,
      'query-input': 'required name=search_term_string'
    }
  }
  return (
    <Head>
      <link rel='icon' href={BLOG_FAVICON} />
      <title>{title}</title>
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      <meta name='robots' content={robotsContent} />
      <meta charSet='UTF-8' />
      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name='google-site-verification'
          content={SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {SEO_BAIDU_SITE_VERIFICATION && (
        <meta
          name='baidu-site-verification'
          content={SEO_BAIDU_SITE_VERIFICATION}
        />
      )}
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta property='og:locale' content={lang} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={ogUrl} />
      <link rel='canonical' href={canonicalUrl} />
      <meta property='og:image' content={absoluteImage} />
      <meta property='og:site_name' content={siteTitle} />
      <meta property='og:type' content={type} />
      {/* Twitter Card 标签 */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@charlilai' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={absoluteImage} />

      {COMMENT_WEBMENTION_ENABLE && (
        <>
          <link
            rel='webmention'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/webmention`}
          />
          <link
            rel='pingback'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/xmlrpc`}
          />
          {COMMENT_WEBMENTION_AUTH && (
            <link href={COMMENT_WEBMENTION_AUTH} rel='me' />
          )}
        </>
      )}

      {ANALYTICS_BUSUANZI_ENABLE && (
        <meta name='referrer' content='no-referrer-when-downgrade' />
      )}
      {meta?.type === 'Post' && (
        <>
          <meta
            property='article:published_time'
            content={toIsoDate(post?.publishDate) || toIsoDate(meta.publishDate) || meta.publishDay}
          />
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:publisher' content={FACEBOOK_PAGE} />

          {/* 添加文章的结构化数据 */}
          {articleJsonLd && (
            <script
              type='application/ld+json'
              dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
          )}
        </>
      )}

      {/* 添加网站的结构化数据 */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {children}
    </Head>
  )
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale, localeCode) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.s
  const isEnglish = localeCode?.startsWith('en')

  const TITLE = siteConfig('TITLE')
  switch (router.route) {
    case '/':
      return {
        title: `${siteInfo?.title} | AI Tools, Research Workflows, AIGC, and Practical Guides`,
        description:
          'CharliiAI shares practical guides on AI tools, AIGC workflows, research automation, voice input, and agent systems, with bilingual articles for builders, researchers, and creators.',
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      }
    case '/archive':
      if (isEnglish) {
        return {
          title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title} - Browse all archived posts`,
          description: `Browse the full archive on ${siteInfo?.title}, with past articles organized by time so readers can quickly find topics, guides, and research updates.`,
          image: `${siteInfo?.pageCover}`,
          slug: 'archive',
          type: 'website'
        }
      }
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title} - 查看所有历史文章和内容`,
        description: `浏览${siteInfo?.title}的完整文章归档，按时间顺序整理的所有历史内容，方便您查找感兴趣的主题和文章。包含各类专业知识、教程和最新研究成果。`,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      if (isEnglish) {
        return {
          title: `Page ${page} | ${siteInfo?.title} - Explore more posts`,
          description: `Browse page ${page} on ${siteInfo?.title} for more articles, tutorials, and practical notes across AI, XR, multimodal interaction, and related topics.`,
          image: `${siteInfo?.pageCover}`,
          slug: 'page/' + page,
          type: 'website'
        }
      }
      return {
        title: `第${page}页 | ${siteInfo?.title} - 探索更多精彩内容`,
        description: `浏览${siteInfo?.title}的第${page}页内容，这里汇集了AI、XR、多模态交互等领域的专业文章、教程和研究成果，帮助您了解最新技术动态和应用实践。`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
      if (isEnglish) {
        return {
          title: `${category} | ${siteInfo?.title} - Category archive`,
          description: `Browse every post in the ${category} category on ${siteInfo?.title}, including practical guides, commentary, and research-driven updates.`,
          slug: 'category/' + category,
          image: `${siteInfo?.pageCover}`,
          type: 'website'
        }
      }
      return {
        title: `${category}分类 | ${siteInfo?.title} - 专业内容分类浏览`,
        description: `浏览${siteInfo?.title}中关于"${category}"的所有文章和资源，这里汇集了该主题下的专业知识、教程和研究成果，帮助您深入了解${category}领域的最新动态和实践应用。`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      if (isEnglish) {
        return {
          title: `${tag} | ${siteInfo?.title} - Tagged posts`,
          description: `Browse posts tagged ${tag} on ${siteInfo?.title}, including tutorials, practical workflows, and related research notes.`,
          image: `${siteInfo?.pageCover}`,
          slug: 'tag/' + tag,
          type: 'website'
        }
      }
      return {
        title: `${tag}标签 | ${siteInfo?.title} - 相关主题内容汇总`,
        description: `浏览${siteInfo?.title}中标记为"${tag}"的所有文章和资源，这里汇集了与${tag}相关的专业知识、教程和研究成果，帮助您深入了解该领域的最新动态和实践应用。`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      if (isEnglish) {
        return {
          title: `${keyword || locale.NAV.SEARCH} | ${siteInfo?.title} - Find the content you need`,
          description: keyword
            ? `Search ${siteInfo?.title} for content related to "${keyword}" and quickly find the most relevant articles, guides, and resources.`
            : `Search across ${siteInfo?.title} to quickly find articles, guides, and resources relevant to your work.`,
          image: `${siteInfo?.pageCover}`,
          slug: 'search',
          type: 'website'
        }
      }
      return {
        title: `${keyword || '站内搜索'}${keyword ? ' | 搜索结果' : ''} | ${siteInfo?.title} - 找到您需要的内容`,
        description: `在${siteInfo?.title}中搜索${keyword ? `"${keyword}"相关的` : '您感兴趣的'}内容，我们提供全站内容检索，帮助您快速找到所需的文章、教程和资源，提升您的阅读和学习体验。`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      if (isEnglish) {
        return {
          title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
          description: `Search results on ${siteInfo?.title} for ${keyword || 'the current keyword'}.`,
          image: `${siteInfo?.pageCover}`,
          slug: 'search',
          type: 'website'
        }
      }
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: TITLE,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/404':
      if (isEnglish) {
        return {
          title: `Page not found | ${siteInfo?.title} - Return to the homepage`,
          description: `The page you requested does not exist or has been removed. Return to ${siteInfo?.title} or use search to find what you need.`,
          image: `${siteInfo?.pageCover}`
        }
      }
      return {
        title: `页面未找到 | ${siteInfo?.title} - 返回首页继续浏览`,
        description: `您访问的页面不存在或已被移除，请返回${siteInfo?.title}首页继续浏览其他内容，或使用搜索功能查找您需要的信息。`,
        image: `${siteInfo?.pageCover}`
      }
    case '/tag':
      if (isEnglish) {
        return {
          title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
          description: `Browse all topic tags on ${siteInfo?.title}.`,
          image: `${siteInfo?.pageCover}`,
          slug: 'tag',
          type: 'website'
        }
      }
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      if (isEnglish) {
        return {
          title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
          description: `Browse all content categories on ${siteInfo?.title}.`,
          image: `${siteInfo?.pageCover}`,
          slug: 'category',
          type: 'website'
        }
      }
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'category',
        type: 'website'
      }
    default:
      return {
        title: post
          ? `${getEnhancedPostTitle(post)} | ${siteInfo?.title}`
          : `${siteInfo?.title} | loading`,
        description: getEnhancedPostDescription(post),
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        publishDate: post?.publishDate,
        publishDay: post?.publishDay,
        lastEditedDate: post?.lastEditedDate,
        category: post?.category?.[0],
        tags: post?.tags
      }
  }
}

export default SEO
