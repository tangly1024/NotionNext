import { siteConfig } from '@/lib/config'
import { 
  generateDynamicKeywords, 
  formatKeywordsString, 
  optimizeMetaDescription,
  optimizePageTitle
} from '@/lib/seo/seoUtils'
import { generateCanonicalUrl, ensureAbsoluteUrl } from '@/lib/seo/urlUtils'
import { safeCheckUrl, forceFixUrl } from '@/lib/seo/urlSafetyCheck'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

/**
 * 动态Meta标签组件
 * 根据页面类型和内容动态生成优化的meta标签
 */
export default function DynamicMetaTags({
  post,
  siteInfo,
  pageType = 'website',
  customMeta = {},
  category,
  tag,
  keyword,
  page
}) {
  const router = useRouter()
  
  // 生成优化的Meta数据
  const metaData = useMemo(() => {
    const baseUrl = siteConfig('LINK')?.replace(/\/$/, '') || 'https://example.com'
    
    // 记录调试信息
    console.log('[SEO调试] 基础URL:', baseUrl)
    console.log('[SEO调试] 当前路径:', router.asPath)
    
    // 根据页面类型生成页面数据
    const pageData = generatePageData(router, post, siteInfo, { category, tag, keyword, page })
    
    // 生成动态关键词
    const dynamicKeywords = generateDynamicKeywords(pageData, siteInfo, pageType)
    
    // 格式化关键词字符串（限制长度避免过长）
    const keywordsString = formatKeywordsString(dynamicKeywords, 120)
    
    // 优化标题和描述
    const optimizedTitle = optimizePageTitle(
      customMeta.title || pageData.title,
      siteInfo?.title
    )
    
    const optimizedDescription = optimizeMetaDescription(
      customMeta.description || pageData.description
    )
    
    // 使用URL工具函数生成规范的canonical URL
    console.log('[SEO调试] 生成URL前:', { baseUrl, path: router.asPath })
    const canonicalUrl = generateCanonicalUrl(router.asPath, baseUrl)
    console.log('[SEO调试] 生成URL后:', canonicalUrl)
    
    return {
      title: optimizedTitle,
      description: optimizedDescription,
      keywords: keywordsString,
      canonicalUrl,
      pageType,
      pageData
    }
  }, [router, post, siteInfo, pageType, customMeta, category, tag, keyword, page])
  
  // 最后验证所有URL格式
  let validatedCanonicalUrl = metaData.canonicalUrl
  
  // 强制修复已知的错误格式
  validatedCanonicalUrl = forceFixUrl(validatedCanonicalUrl)
  
  // 安全检查，确保URL格式正确
  const baseUrl = siteConfig('LINK')?.replace(/\/$/, '') || 'https://example.com'
  validatedCanonicalUrl = safeCheckUrl(validatedCanonicalUrl, baseUrl)
  
  // 记录URL生成过程（仅在开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log('[SEO调试] 最终Canonical URL:', validatedCanonicalUrl)
  }
  
  // 硬编码修复 - 如果仍然有问题，直接使用正确的格式
  if (router.asPath.startsWith('/article/') && validatedCanonicalUrl.includes('/http')) {
    const articleSlug = router.asPath.split('/').pop()
    validatedCanonicalUrl = `${baseUrl}/article/${articleSlug}`
    console.log('[SEO修复] 硬编码修复文章URL:', validatedCanonicalUrl)
  }
  
  return (
    <Head>
      {/* 基础Meta标签 */}
      <title>{metaData.title}</title>
      <meta name="description" content={metaData.description} />
      <meta name="keywords" content={metaData.keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={validatedCanonicalUrl} />
      
      {/* 页面类型特定的Meta标签 */}
      {renderPageSpecificMeta(metaData, post, siteInfo)}
      
      {/* Open Graph优化 */}
      {renderOpenGraphMeta(metaData, post, siteInfo)}
      
      {/* Twitter Card优化 */}
      {renderTwitterCardMeta(metaData, post, siteInfo)}
      
      {/* 结构化数据提示 */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    </Head>
  )
}

/**
 * 根据路由和数据生成页面数据
 */
function generatePageData(router, post, siteInfo, { category, tag, keyword, page }) {
  const route = router.route
  
  switch (route) {
    case '/':
      return {
        title: siteInfo?.title,
        description: siteInfo?.description,
        keywords: siteInfo?.keywords?.split(',') || [],
        type: 'homepage'
      }
      
    case '/archive':
      return {
        title: '文章归档',
        description: `浏览 ${siteInfo?.title} 的所有文章归档，按时间顺序查看历史内容`,
        keywords: ['文章归档', '博客归档', '历史文章', siteInfo?.title],
        type: 'archive'
      }
      
    case '/category':
      return {
        title: '所有分类',
        description: `浏览 ${siteInfo?.title} 的所有文章分类，快速找到感兴趣的内容`,
        keywords: ['文章分类', '内容分类', '博客分类', siteInfo?.title],
        type: 'category_list'
      }
      
    case '/category/[category]':
    case '/category/[category]/page/[page]':
      return {
        title: `${category} 分类`,
        description: `${category} 分类下的所有文章 - ${siteInfo?.title}`,
        keywords: [category, `${category}文章`, `${category}内容`, `${category}相关`, siteInfo?.title],
        type: 'category',
        category
      }
      
    case '/tag':
      return {
        title: '所有标签',
        description: `浏览 ${siteInfo?.title} 的所有文章标签，发现更多相关内容`,
        keywords: ['文章标签', '内容标签', '博客标签', siteInfo?.title],
        type: 'tag_list'
      }
      
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} 标签`,
        description: `标签为 "${tag}" 的所有文章 - ${siteInfo?.title}`,
        keywords: [tag, `${tag}相关`, `${tag}文章`, `${tag}内容`, siteInfo?.title],
        type: 'tag',
        tag
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
        keywords: keyword 
          ? [keyword, `${keyword}搜索`, `${keyword}结果`, '搜索', siteInfo?.title]
          : ['搜索', '查找', '内容搜索', siteInfo?.title],
        type: 'search',
        keyword
      }
      
    case '/page/[page]':
      return {
        title: `第 ${page} 页`,
        description: `${siteInfo?.title} 第 ${page} 页内容`,
        keywords: [`第${page}页`, '分页', '更多文章', siteInfo?.title],
        type: 'pagination',
        page
      }
      
    case '/404':
      return {
        title: '页面未找到 - 404错误',
        description: `抱歉，您访问的页面在 ${siteInfo?.title} 中不存在，请检查URL或返回首页`,
        keywords: ['404错误', '页面未找到', '错误页面', siteInfo?.title],
        type: 'error'
      }
      
    default:
      // 文章页面或其他页面
      if (post) {
        return {
          title: post.title,
          description: post.summary || `${post.title} - ${siteInfo?.title}`,
          keywords: [
            ...(post.tags || []),
            ...(post.category || []),
            post.title,
            siteInfo?.title
          ].filter(Boolean),
          type: 'post',
          category: post.category?.[0],
          tags: post.tags,
          publishDate: post.publishDay,
          author: post.author || siteInfo?.author
        }
      }
      
      return {
        title: siteInfo?.title,
        description: siteInfo?.description,
        keywords: siteInfo?.keywords?.split(',') || [],
        type: 'website'
      }
  }
}

/**
 * 渲染页面类型特定的Meta标签
 */
function renderPageSpecificMeta(metaData, post, siteInfo) {
  const { pageType, pageData } = metaData
  
  switch (pageType) {
    case 'post':
    case 'article':
      return (
        <>
          {/* 文章特定Meta标签 */}
          <meta name="author" content={pageData.author || siteInfo?.author} />
          {pageData.publishDate && (
            <meta name="article:published_time" content={pageData.publishDate} />
          )}
          {post?.lastEditedDay && (
            <meta name="article:modified_time" content={post.lastEditedDay} />
          )}
          {pageData.category && (
            <meta name="article:section" content={pageData.category} />
          )}
          {pageData.tags && pageData.tags.map(tag => (
            <meta key={tag} name="article:tag" content={tag} />
          ))}
          
          {/* 阅读时间估算 */}
          {post?.content && (
            <>
              <meta name="twitter:label1" content="阅读时间" />
              <meta name="twitter:data1" content={`${Math.ceil((post.content.length || 0) / 500)} 分钟`} />
            </>
          )}
        </>
      )
      
    case 'category':
      return (
        <>
          <meta name="page-type" content="category" />
          <meta name="category" content={pageData.category} />
        </>
      )
      
    case 'tag':
      return (
        <>
          <meta name="page-type" content="tag" />
          <meta name="tag" content={pageData.tag} />
        </>
      )
      
    case 'search':
      return (
        <>
          <meta name="page-type" content="search" />
          {pageData.keyword && (
            <meta name="search-query" content={pageData.keyword} />
          )}
        </>
      )
      
    default:
      return null
  }
}

/**
 * 渲染Open Graph Meta标签
 */
function renderOpenGraphMeta(metaData, post, siteInfo) {
  const baseUrl = siteConfig('LINK')?.replace(/\/$/, '') || 'https://example.com'
  
  // 使用URL工具函数确保图片URL是绝对URL
  const ogImage = ensureAbsoluteUrl(
    post?.pageCoverThumbnail || post?.pageCover || siteInfo?.pageCover || '/bg_image.jpg',
    baseUrl
  )
  
  // 强制修复og:url
  let ogUrl = metaData.canonicalUrl
  
  // 检测并修复错误格式
  if (ogUrl.includes('/http')) {
    const matches = ogUrl.match(/^(.*?)\/(https?:\/\/.*?)$/)
    if (matches && matches.length >= 3) {
      const path = matches[1]
      const domain = matches[2]
      ogUrl = `${domain}/${path}`
      console.log('[SEO修复] 强制修复og:url:', ogUrl)
    }
  }
  
  return (
    <>
      <meta property="og:title" content={metaData.title} />
      <meta property="og:description" content={metaData.description} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteInfo?.title} />
      <meta property="og:type" content={metaData.pageType === 'post' ? 'article' : 'website'} />
      <meta property="og:locale" content={siteConfig('LANG', 'zh-CN').replace('-', '_')} />
      
      {/* 文章特定的Open Graph */}
      {metaData.pageType === 'post' && post && (
        <>
          {post.publishDay && (
            <meta property="article:published_time" content={post.publishDay} />
          )}
          {post.lastEditedDay && (
            <meta property="article:modified_time" content={post.lastEditedDay} />
          )}
          {post.author && (
            <meta property="article:author" content={post.author} />
          )}
          {post.category?.[0] && (
            <meta property="article:section" content={post.category[0]} />
          )}
          {post.tags && post.tags.map(tag => (
            <meta key={`og-tag-${tag}`} property="article:tag" content={tag} />
          ))}
        </>
      )}
    </>
  )
}

/**
 * 渲染Twitter Card Meta标签
 */
function renderTwitterCardMeta(metaData, post, siteInfo) {
  const baseUrl = siteConfig('LINK')?.replace(/\/$/, '') || 'https://example.com'
  
  // 使用URL工具函数确保图片URL是绝对URL
  const twitterImage = ensureAbsoluteUrl(
    post?.pageCoverThumbnail || post?.pageCover || siteInfo?.pageCover || '/bg_image.jpg',
    baseUrl
  )
  const twitterHandle = siteConfig('TWITTER_HANDLE')
  
  return (
    <>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaData.title} />
      <meta name="twitter:description" content={metaData.description} />
      <meta name="twitter:image" content={twitterImage} />
      {twitterHandle && (
        <>
          <meta name="twitter:site" content={`@${twitterHandle}`} />
          <meta name="twitter:creator" content={`@${twitterHandle}`} />
        </>
      )}
      
      {/* 文章特定的Twitter Card */}
      {metaData.pageType === 'post' && post && (
        <>
          <meta name="twitter:label1" content="作者" />
          <meta name="twitter:data1" content={post.author || siteInfo?.author || '未知'} />
          
          {post.category?.[0] && (
            <>
              <meta name="twitter:label2" content="分类" />
              <meta name="twitter:data2" content={post.category[0]} />
            </>
          )}
        </>
      )}
    </>
  )
}