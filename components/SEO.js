import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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
  let url = PATH?.length ? `${LINK}/${SUB_PATH}` : LINK
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const webFontUrl = siteConfig('FONT_URL')

  useEffect(() => {
    // 使用WebFontLoader字体加载
    loadExternalResource(
      'https://cdn.jsdmirror.com/npm/webfontloader@1.6.28/webfontloader.js',
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
  }, [])

  // SEO关键词 
  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    url = `${url}/${meta.slug}`
    image = meta.image || '/bg_image.jpg'
  }
  const TITLE = siteConfig('TITLE')
  const title = meta?.title || TITLE
  const description = meta?.description || `${siteInfo?.description}`
  const type = meta?.type || 'website'
  const lang = 'zh_CN' // og:locale 需要 zh_CN 格式
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

  const ORIGIN = siteConfig('LINK')?.replace(/\/+$/,'')
  const toAbsolute = (u) => {
    if (!u) return ''
    if (/^https?:\/\//i.test(u)) return u
    return `${ORIGIN}${u.startsWith('/') ? '' : '/'}${u}`
  }

  const isThin = router.route === '/search' || router.route === '/search/[keyword]' || router.route === '/404'
  const robots = isThin
    ? 'noindex, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  return (
    <Head>
      <meta charSet='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <link rel='icon' href={favicon} />
      <link rel='apple-touch-icon' href={favicon} />
      <title>{title}</title>
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta name='robots' content={robots} />
      {robots.startsWith('index') && <link rel='canonical' href={toAbsolute(url)} />}
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={title} />

      {/* 搜索引擎验证 */}
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

      {/* 基础SEO元数据 */}
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description?.substring(0, 160)} />
      <meta name='author' content={AUTHOR} />
      <meta name='generator' content='茉灵智库' />

      {/* 语言和地区 */}
      <meta httpEquiv='content-language' content='zh-CN' />
      <meta name='geo.region' content={siteConfig('GEO_REGION', 'CN')} />
      <meta name='geo.country' content={siteConfig('GEO_COUNTRY', 'CN')} />
      {/* Open Graph 元数据 */}
      <meta property='og:locale' content={lang} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description?.substring(0, 200)} />
      <meta property='og:url' content={toAbsolute(url)} />
      <meta property='og:image' content={toAbsolute(image)} />
      <meta property='og:image:secure_url' content={toAbsolute(image)} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:alt' content={title} />
      <meta property='og:site_name' content= '茉灵智库' />
      <meta property='og:type' content={meta?.type === 'Post' ? 'article' : (type || 'website')} />

      {/* Twitter Card 元数据 */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@茉灵智库' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description?.substring(0, 200)} />
      <meta name='twitter:image' content={toAbsolute(image)} />
      <meta name='twitter:image:alt' content={title} />

      {/* 微信分享优化 */}
      <meta property='weixin:title' content={title} />
      <meta property='weixin:description' content={description?.substring(0, 160)} />
      <meta property='weixin:image' content={toAbsolute(image)} />

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
      {/* 文章特定元数据 */}
      {meta?.type === 'Post' && (
        <>
          <meta property='article:published_time' content={meta.publishDay} />
          <meta property='article:modified_time' content={meta.lastEditedDay} />
          <meta property='og:updated_time' content={meta.lastEditedDay || meta.publishDay} />
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:tag' content={keywords} />
          {FACEBOOK_PAGE && <meta property='article:publisher' content={FACEBOOK_PAGE} />}
        </>
      )}

      {/* 结构化数据 */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(meta, siteInfo, url, image, AUTHOR))
        }}
      />

      {/* DNS预取和预连接 */}
      <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      <link rel='dns-prefetch' href='//www.google-analytics.com' />
      <link rel='dns-prefetch' href='//www.googletagmanager.com' />
      <link rel='preconnect' href='https://cdn.jsdmirror.com' crossOrigin='anonymous' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
      <meta httpEquiv='x-dns-prefetch-control' content='on' />

      {/* 预加载关键资源 */}
      <link rel='preload' href='/fonts/inter-var.woff2' as='font' type='font/woff2' crossOrigin='anonymous' />

      {children}
    </Head>
  )
}

/**
 * 生成结构化数据
 * @param {*} meta
 * @param {*} siteInfo
 * @param {*} url
 * @param {*} image
 * @param {*} author
 * @returns
 */
const generateStructuredData = (meta, siteInfo, url, image, author) => {
  const origin = siteConfig('LINK')?.replace(/\/+$/,'')
  const abs = (u) => (/^https?:\/\//i.test(u) ? u : `${origin}${u?.startsWith('/') ? '' : '/'}${u || ''}`)

  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteInfo?.title,
    description: siteInfo?.description?.substring(0, 160),
    url: origin,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/search?s={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: siteInfo?.title,
      logo: { '@type': 'ImageObject', url: abs(siteInfo?.icon) }
    }
  }

  if (meta?.type === 'Post') {
    const images = Array.isArray(image) ? image.map(abs) : [abs(image)]
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: origin
          },
          meta?.category ? {
            '@type': 'ListItem',
            position: 2,
            name: meta.category,
            item: `${origin}/category/${encodeURIComponent(meta.category)}`
          } : null,
          {
            '@type': 'ListItem',
            position: meta?.category ? 3 : 2,
            name: meta.title,
            item: abs(url)
          }
        ].filter(Boolean)
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: meta.title,
        description: meta.description?.substring(0, 160),
        image: images,
        url: abs(url),
        mainEntityOfPage: { '@type': 'WebPage', '@id': abs(url) },
        datePublished: meta.publishDay,
        dateModified: meta.lastEditedDay || meta.publishDay,
        author: { '@type': 'Person', name: author },
        publisher: {
          '@type': 'Organization',
          name: siteInfo?.title,
          logo: { '@type': 'ImageObject', url: abs(siteInfo?.icon) }
        },
        keywords: Array.isArray(meta.tags) ? meta.tags.join(', ') : '',
        articleSection: meta.category || '',
        wordCount: meta.wordCount,
        isAccessibleForFree: true,
        inLanguage: 'zh-CN'
      }
    ]
  }

  return baseData
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.s

  const TITLE = siteConfig('TITLE')
  switch (router.route) {
    case '/':
      return {
        title: `${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
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
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: TITLE,
        image: `${siteInfo?.pageCover}`,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${siteInfo?.title} | ${locale.NAV.PAGE_NOT_FOUND}`,
        image: `${siteInfo?.pageCover}`
      }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
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
          ? `${post?.title} | ${siteInfo?.title}`
          : `${siteInfo?.title} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        category: post?.category?.[0],
        tags: post?.tags,
        wordCount: post?.wordCount,
        publishDay: post?.publishDay,
        lastEditedDay: post?.lastEditedDay
      }
  }
}

export default SEO
