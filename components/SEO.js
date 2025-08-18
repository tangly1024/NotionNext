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
  // 确保 URL 格式正确，避免双斜杠
  let url = PATH?.length ? `${LINK}${LINK.endsWith('/') ? '' : '/'}${SUB_PATH}` : LINK
  // 确保 URL 末尾没有斜杠
  url = url.endsWith('/') ? url.slice(0, -1) : url
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
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
  }, [])

  // SEO关键词
  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    // 只有当 meta.slug 不为空时才添加
    if (meta.slug) {
      url = `${url}/${meta.slug}`
    }
    image = meta.image || '/bg_image.jpg'
  }
  
  // 确保规范链接格式正确
  const canonicalUrl = url.endsWith('/') ? url : `${url}/`
  const TITLE = siteConfig('TITLE')
  const title = meta?.title || TITLE
  const description = meta?.description || `${siteInfo?.description}`
  const type = meta?.type || 'website'
  const lang = siteConfig('LANG').replace('-', '_') // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
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
  return (
    <Head>
      <link rel='icon' href={BLOG_FAVICON} />
      <title>{title}</title>
      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      <meta name='robots' content='follow, index' />
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
      <meta property='og:url' content={url} />
      <link rel='canonical' href={canonicalUrl} />
      <meta property='og:image' content={image} />
      <meta property='og:site_name' content={title} />
      <meta property='og:type' content={type} />
      {/* Twitter Card 标签 */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@charlilai' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      <link rel='icon' href={BLOG_FAVICON} />

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
          <meta property='article:published_time' content={meta.publishDay} />
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:publisher' content={FACEBOOK_PAGE} />
          
          {/* 添加文章的结构化数据 */}
          <script type="application/ld+json">{`
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "${title}",
              "image": "${image}",
              "author": {
                "@type": "Person",
                "name": "${AUTHOR}"
              },
              "publisher": {
                "@type": "Organization",
                "name": "${title}",
                "logo": {
                  "@type": "ImageObject",
                  "url": "${BLOG_FAVICON}"
                }
              },
              "datePublished": "${meta.publishDay}",
              "description": "${description}"
            }
          `}</script>
        </>
      )}
      
      {/* 添加网站的结构化数据 */}
      <script type="application/ld+json">{`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "${title}",
          "url": "${url}",
          "description": "${description}",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "${url}/search?keyword={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      `}</script>
      
      {children}
    </Head>
  )
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
        title: `${siteInfo?.title} - ${siteInfo?.description} | 专业内容分享平台`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title} - 查看所有历史文章和内容`,
        description: `浏览${siteInfo?.title}的完整文章归档，按时间顺序整理的所有历史内容，方便您查找感兴趣的主题和文章。包含各类专业知识、教程和最新研究成果。`,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `第${page}页 | ${siteInfo?.title} - 探索更多精彩内容`,
        description: `浏览${siteInfo?.title}的第${page}页内容，这里汇集了AI、XR、多模态交互等领域的专业文章、教程和研究成果，帮助您了解最新技术动态和应用实践。`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
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
      return {
        title: `${tag}标签 | ${siteInfo?.title} - 相关主题内容汇总`,
        description: `浏览${siteInfo?.title}中标记为"${tag}"的所有文章和资源，这里汇集了与${tag}相关的专业知识、教程和研究成果，帮助您深入了解该领域的最新动态和实践应用。`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || '站内搜索'}${keyword ? ' | 搜索结果' : ''} | ${siteInfo?.title} - 找到您需要的内容`,
        description: `在${siteInfo?.title}中搜索${keyword ? `"${keyword}"相关的` : '您感兴趣的'}内容，我们提供全站内容检索，帮助您快速找到所需的文章、教程和资源，提升您的阅读和学习体验。`,
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
        title: `页面未找到 | ${siteInfo?.title} - 返回首页继续浏览`,
        description: `您访问的页面不存在或已被移除，请返回${siteInfo?.title}首页继续浏览其他内容，或使用搜索功能查找您需要的信息。`,
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
        tags: post?.tags
      }
  }
}

export default SEO
