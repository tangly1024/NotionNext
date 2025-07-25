import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import {
  optimizeMetaDescription,
  optimizePageTitle,
  generateCanonicalUrl,
  generateHreflangData,
  extractOptimizedKeywords,
  generateOgImageUrl,
  getTwitterCardType,
  generateDynamicKeywords,
  formatKeywordsString
} from '@/lib/seo/seoUtils'
import {
  generateArticleSchema,
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateBlogSchema,
  combineSchemas
} from '@/lib/seo/structuredData'
import {
  generateImageStructuredData,
  extractImagesFromContent
} from '@/lib/seo/imageSEO'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'

/**
 * 增强版SEO组件
 * 支持结构化数据、高级meta标签优化、canonical URL和hreflang
 * @param {Object} props 组件属性
 * @returns {JSX.Element} SEO Head元素
 */
const SEOEnhanced = props => {
  const { 
    children, 
    siteInfo, 
    post, 
    posts,
    breadcrumbs,
    customMeta = {},
    NOTION_CONFIG 
  } = props
  
  const router = useRouter()
  const global = useGlobal()
  const locale = global?.locale
  
  // 基础配置
  const LINK = siteConfig('LINK')
  const LANG = siteConfig('LANG')
  const AUTHOR = siteConfig('AUTHOR')
  const KEYWORDS = siteConfig('KEYWORDS')
  const SUB_PATH = siteConfig('SUB_PATH', '')
  
  // 字体加载
  const webFontUrl = siteConfig('FONT_URL')
  useEffect(() => {
    if (webFontUrl) {
      loadExternalResource(
        'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
        'js'
      ).then(() => {
        const WebFont = window?.WebFont
        if (WebFont) {
          WebFont.load({
            custom: {
              urls: Array.isArray(webFontUrl) ? webFontUrl : [webFontUrl]
            }
          })
        }
      })
    }
  }, [webFontUrl])
  
  // 生成SEO数据
  const seoData = useMemo(() => {
    const meta = getSEOMeta(props, router, locale)
    const baseUrl = LINK?.replace(/\/$/, '')
    
    // 基础信息
    const pageTitle = customMeta.title || meta?.title || siteInfo?.title
    const siteTitle = siteInfo?.title
    const rawDescription = customMeta.description || meta?.description || post?.summary || siteInfo?.description
    const slug = meta?.slug || ''
    
    // 优化标题和描述
    const optimizedTitle = optimizePageTitle(pageTitle, siteTitle)
    const optimizedDescription = optimizeMetaDescription(rawDescription)
    
    // 生成URLs - 使用router.asPath而不是slug
    console.log('[SEO调试] SEOEnhanced组件:', {
      baseUrl,
      slug,
      routerAsPath: router.asPath,
      meta
    })
    
    // 直接使用router.asPath生成canonical URL
    const cleanPath = router.asPath.split('?')[0]
    const canonicalUrl = cleanPath === '/' ? baseUrl : `${baseUrl}${cleanPath}`
    
    console.log('[SEO调试] SEOEnhanced生成的URL:', canonicalUrl)
    const ogImageUrl = generateOgImageUrl(
      customMeta.image || meta?.image || post?.pageCoverThumbnail || siteInfo?.pageCover,
      baseUrl
    )
    
    // 动态关键词生成（优化版）
    const pageData = {
      title: pageTitle,
      summary: rawDescription,
      tags: post?.tags || [],
      category: post?.category?.[0] || meta?.category,
      content: post?.content || post?.summary || '',
      keyword: router.query?.s || router.query?.keyword,
      tag: router.query?.tag,
      category: router.query?.category
    }
    
    const dynamicKeywords = generateDynamicKeywords(
      pageData, 
      siteInfo, 
      meta?.type === 'Post' ? 'post' : getPageTypeFromRoute(router.route)
    )
    
    const keywords = customMeta.keywords || formatKeywordsString(dynamicKeywords, 120) || KEYWORDS
    
    // 多语言支持
    const locales = router.locales || [LANG]
    const hreflangData = generateHreflangData(baseUrl, router.asPath, locales, router.locale)
    
    // 结构化数据
    const schemas = []
    
    // 网站基础结构化数据
    if (router.pathname === '/') {
      schemas.push(generateWebsiteSchema(siteInfo, baseUrl))
      schemas.push(generateOrganizationSchema(siteInfo, baseUrl))
      if (posts && posts.length > 0) {
        schemas.push(generateBlogSchema(posts, siteInfo, baseUrl))
      }
    }
    
    // 文章结构化数据
    if (post && meta?.type === 'Post') {
      schemas.push(generateArticleSchema(post, siteInfo, baseUrl))
      
      // 为文章添加图片结构化数据
      if (post.content || post.summary) {
        const content = post.content || post.summary || ''
        const images = extractImagesFromContent(content, baseUrl)
        
        // 添加文章封面图片
        if (post.pageCover || post.pageCoverThumbnail) {
          images.unshift({
            src: post.pageCover || post.pageCoverThumbnail,
            alt: post.title || '',
            title: post.title || '',
            caption: post.summary || '',
            format: 'jpg'
          })
        }
        
        if (images.length > 0) {
          const imageSchema = generateImageStructuredData(images, {
            title: post.title,
            author: AUTHOR,
            publishDate: post.publishDay,
            category: post.category?.[0]
          })
          
          if (imageSchema) {
            schemas.push(imageSchema)
          }
        }
      }
    }
    
    // 面包屑结构化数据
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push(generateBreadcrumbSchema(breadcrumbs, baseUrl))
    }
    
    const structuredData = combineSchemas(schemas)
    
    return {
      title: optimizedTitle,
      description: optimizedDescription,
      keywords,
      canonicalUrl,
      ogImageUrl,
      ogType: meta?.type === 'Post' ? 'article' : 'website',
      twitterCard: getTwitterCardType(ogImageUrl),
      structuredData,
      hreflangData,
      lang: LANG.replace('-', '_'),
      publishedTime: post?.publishDay,
      modifiedTime: post?.lastEditedDay || post?.publishDay,
      category: post?.category?.[0] || meta?.category,
      tags: post?.tags
    }
  }, [props, router, locale, LINK, LANG, AUTHOR, KEYWORDS, SUB_PATH, customMeta])
  
  // 验证配置
  const verificationCodes = {
    google: siteConfig('SEO_GOOGLE_SITE_VERIFICATION', null, NOTION_CONFIG),
    baidu: siteConfig('SEO_BAIDU_SITE_VERIFICATION', null, NOTION_CONFIG),
    bing: siteConfig('SEO_BING_SITE_VERIFICATION', null, NOTION_CONFIG)
  }
  
  // 其他配置
  const favicon = siteConfig('BLOG_FAVICON', '/favicon.ico', NOTION_CONFIG)
  const themeColor = siteConfig('BACKGROUND_DARK', '#000000', NOTION_CONFIG)
  const facebookPage = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)
  
  // WebMention配置
  const webmentionConfig = {
    enabled: siteConfig('COMMENT_WEBMENTION_ENABLE', false, NOTION_CONFIG),
    hostname: siteConfig('COMMENT_WEBMENTION_HOSTNAME', null, NOTION_CONFIG),
    auth: siteConfig('COMMENT_WEBMENTION_AUTH', null, NOTION_CONFIG)
  }
  
  return (
    <Head>
      {/* 基础meta标签 */}
      <meta charSet="UTF-8" />
      <meta 
        name="viewport" 
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0" 
      />
      <meta name="theme-color" content={themeColor} />
      
      {/* 标题和描述 */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoData.canonicalUrl} />
      
      {/* 网站验证 */}
      {verificationCodes.google && (
        <meta name="google-site-verification" content={verificationCodes.google} />
      )}
      {verificationCodes.baidu && (
        <meta name="baidu-site-verification" content={verificationCodes.baidu} />
      )}
      {verificationCodes.bing && (
        <meta name="msvalidate.01" content={verificationCodes.bing} />
      )}
      
      {/* 爬虫指令 */}
      <meta name="robots" content="follow, index" />
      
      {/* Open Graph */}
      <meta property="og:type" content={seoData.ogType} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta property="og:image" content={seoData.ogImageUrl} />
      <meta property="og:site_name" content={siteInfo?.title} />
      <meta property="og:locale" content={seoData.lang} />
      
      {/* 文章特定的Open Graph */}
      {seoData.ogType === 'article' && (
        <>
          {seoData.publishedTime && (
            <meta property="article:published_time" content={seoData.publishedTime} />
          )}
          {seoData.modifiedTime && (
            <meta property="article:modified_time" content={seoData.modifiedTime} />
          )}
          {AUTHOR && (
            <meta property="article:author" content={AUTHOR} />
          )}
          {seoData.category && (
            <meta property="article:section" content={seoData.category} />
          )}
          {seoData.tags && seoData.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
          {facebookPage && (
            <meta property="article:publisher" content={facebookPage} />
          )}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      {seoData.ogImageUrl && (
        <meta name="twitter:image" content={seoData.ogImageUrl} />
      )}
      
      {/* Hreflang */}
      {seoData.hreflangData.map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
      
      {/* 图标 */}
      <link rel="icon" href={favicon} />
      <link rel="shortcut icon" href={favicon} />
      
      {/* DNS预解析和预连接 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* WebMention */}
      {webmentionConfig.enabled && webmentionConfig.hostname && (
        <>
          <link
            rel="webmention"
            href={`https://webmention.io/${webmentionConfig.hostname}/webmention`}
          />
          <link
            rel="pingback"
            href={`https://webmention.io/${webmentionConfig.hostname}/xmlrpc`}
          />
          {webmentionConfig.auth && (
            <link href={webmentionConfig.auth} rel="me" />
          )}
        </>
      )}
      
      {/* 结构化数据 */}
      {seoData.structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
      
      {/* 其他meta标签 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* 不统计访问量时的referrer策略 */}
      {!siteConfig('ANALYTICS_BUSUANZI_ENABLE', false, NOTION_CONFIG) && (
        <meta name="referrer" content="no-referrer-when-downgrade" />
      )}
      
      {children}
    </Head>
  )
}

/**
 * 根据路由获取页面类型
 * @param {string} route - Next.js路由
 * @returns {string} 页面类型
 */
const getPageTypeFromRoute = (route) => {
  if (route === '/') return 'home'
  if (route === '/archive') return 'archive'
  if (route.startsWith('/category')) return 'category'
  if (route.startsWith('/tag')) return 'tag'
  if (route.startsWith('/search')) return 'search'
  if (route.startsWith('/page')) return 'pagination'
  if (route === '/404') return 'error'
  return 'website'
}

/**
 * 获取SEO元数据
 * @param {Object} props 组件属性
 * @param {Object} router Next.js路由对象
 * @param {Object} locale 语言配置
 * @returns {Object} SEO元数据
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.s
  
  switch (router.route) {
    case '/':
      return {
        title: '精选学习、职场、AI高价值资源分享平台 - 提升思维认知',
        description: siteInfo?.description,
        image: siteInfo?.pageCover,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale?.NAV?.ARCHIVE || 'Archive'}`,
        description: `浏览 ${siteInfo?.title} 的所有文章归档`,
        image: siteInfo?.pageCover,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `第 ${page} 页`,
        description: `${siteInfo?.title} 第 ${page} 页内容`,
        image: siteInfo?.pageCover,
        slug: `page/${page}`,
        type: 'website'
      }
    case '/category/[category]':
    case '/category/[category]/page/[page]':
      return {
        title: `${category} 分类`,
        description: `浏览 ${siteInfo?.title} 中 ${category} 分类的所有文章`,
        slug: `category/${category}`,
        image: siteInfo?.pageCover,
        type: 'website',
        category
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} 标签`,
        description: `浏览 ${siteInfo?.title} 中标签为 ${tag} 的所有文章`,
        image: siteInfo?.pageCover,
        slug: `tag/${tag}`,
        type: 'website'
      }
    case '/search':
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      const searchTitle = keyword ? `搜索: ${keyword}` : '搜索'
      return {
        title: searchTitle,
        description: keyword 
          ? `在 ${siteInfo?.title} 中搜索 "${keyword}" 的结果`
          : `在 ${siteInfo?.title} 中搜索内容`,
        image: siteInfo?.pageCover,
        slug: keyword ? `search/${keyword}` : 'search',
        type: 'website'
      }
    case '/404':
      return {
        title: '页面未找到',
        description: `抱歉，您访问的页面在 ${siteInfo?.title} 中不存在`,
        image: siteInfo?.pageCover,
        slug: '404',
        type: 'website'
      }
    case '/tag':
      return {
        title: '所有标签',
        description: `浏览 ${siteInfo?.title} 的所有文章标签`,
        image: siteInfo?.pageCover,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: '所有分类',
        description: `浏览 ${siteInfo?.title} 的所有文章分类`,
        image: siteInfo?.pageCover,
        slug: 'category',
        type: 'website'
      }
    default:
      // 文章页面或其他页面
      if (post) {
        return {
          title: post.title,
          description: post.summary,
          type: 'Post',
          slug: post.slug,
          image: post.pageCoverThumbnail || post.pageCover,
          category: post.category?.[0],
          tags: post.tags,
          publishDay: post.publishDay
        }
      }
      
      return {
        title: siteInfo?.title,
        description: siteInfo?.description,
        image: siteInfo?.pageCover,
        slug: '',
        type: 'website'
      }
  }
}

export default SEOEnhanced