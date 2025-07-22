import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * 404页面SEO优化组件
 * 提供优化的meta标签、结构化数据和用户体验
 */
export default function SEO404({ locale, siteInfo }) {
  const router = useRouter()
  const [suggestions, setSuggestions] = useState([])
  
  const lang = siteConfig('LANG', BLOG.LANG, locale) || 'zh-CN'
  const siteTitle = siteConfig('TITLE', BLOG.TITLE, siteInfo)
  const siteDescription = siteConfig('DESCRIPTION', BLOG.DESCRIPTION, siteInfo)
  
  // 404页面的SEO配置
  const seo404Config = {
    title: `页面未找到 - ${siteTitle}`,
    description: '抱歉，您访问的页面不存在。请检查URL是否正确，或浏览我们的其他内容。',
    noindex: true, // 404页面不应被索引
    nofollow: true,
    canonical: null // 404页面不设置canonical
  }

  // 生成结构化数据
  const generateStructuredData = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo404Config.title,
      description: seo404Config.description,
      url: typeof window !== 'undefined' ? window.location.href : '',
      isPartOf: {
        '@type': 'WebSite',
        name: siteTitle,
        url: siteConfig('LINK', BLOG.LINK, siteInfo)
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteConfig('LINK', BLOG.LINK, siteInfo)}/search/{search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  }

  // 分析URL并生成智能重定向建议
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const suggestions = generateRedirectSuggestions(currentPath)
      setSuggestions(suggestions)
      
      // 记录404错误用于监控
      logNotFoundError(currentPath, document.referrer)
    }
  }, [])

  return (
    <>
      {/* SEO Meta标签 */}
      <title>{seo404Config.title}</title>
      <meta name="description" content={seo404Config.description} />
      <meta name="robots" content="noindex,nofollow" />
      <meta property="og:title" content={seo404Config.title} />
      <meta property="og:description" content={seo404Config.description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={seo404Config.title} />
      <meta name="twitter:description" content={seo404Config.description} />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
      
      {/* 404页面内容 */}
      <div className="404-seo-optimized">
        <h1>404 - 页面未找到</h1>
        <p>{seo404Config.description}</p>
        
        {/* 智能重定向建议 */}
        {suggestions.length > 0 && (
          <div className="redirect-suggestions">
            <h2>您可能在寻找：</h2>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <a href={suggestion.url} title={suggestion.title}>
                    {suggestion.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 搜索功能 */}
        <div className="search-section">
          <h2>搜索内容</h2>
          <form onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="搜索文章、标签或分类..."
              aria-label="搜索网站内容"
            />
            <button type="submit">搜索</button>
          </form>
        </div>
        
        {/* 导航链接 */}
        <nav className="404-navigation" aria-label="404页面导航">
          <ul>
            <li><a href="/">返回首页</a></li>
            <li><a href="/archive">文章归档</a></li>
            <li><a href="/category">分类浏览</a></li>
            <li><a href="/tag">标签云</a></li>
          </ul>
        </nav>
      </div>
    </>
  )
}

/**
 * 生成智能重定向建议
 */
function generateRedirectSuggestions(currentPath) {
  const suggestions = []
  
  // 基于URL路径分析可能的重定向
  if (currentPath.includes('/post/') || currentPath.includes('/article/')) {
    suggestions.push({
      url: '/archive',
      title: '文章归档 - 浏览所有文章'
    })
  }
  
  if (currentPath.includes('/category/')) {
    suggestions.push({
      url: '/category',
      title: '分类浏览 - 按分类查看文章'
    })
  }
  
  if (currentPath.includes('/tag/')) {
    suggestions.push({
      url: '/tag',
      title: '标签云 - 按标签查看文章'
    })
  }
  
  // 总是包含首页建议
  suggestions.push({
    url: '/',
    title: '返回首页'
  })
  
  return suggestions.slice(0, 5) // 限制建议数量
}

/**
 * 记录404错误用于监控
 */
function logNotFoundError(path, referrer) {
  // 发送到分析服务
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_not_found', {
      page_path: path,
      referrer: referrer || 'direct'
    })
  }
  
  // 可以添加其他监控服务
  console.warn(`404 Error: ${path} (referrer: ${referrer || 'direct'})`)
}

/**
 * 处理搜索表单提交
 */
function handleSearch(e) {
  e.preventDefault()
  const query = e.target.querySelector('input[type="search"]').value
  if (query.trim()) {
    window.location.href = `/search/${encodeURIComponent(query.trim())}`
  }
}