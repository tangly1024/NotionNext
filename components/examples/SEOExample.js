/**
 * SEO组件使用示例
 * 展示如何在不同页面类型中使用增强版SEO组件
 */

import SEO from '@/components/SEO'
import DynamicMetaTags from '@/components/DynamicMetaTags'

/**
 * 文章页面SEO示例
 */
export function ArticlePageSEO({ post, siteInfo }) {
  return (
    <SEO
      useEnhanced={true}
      post={post}
      siteInfo={siteInfo}
      breadcrumbs={[
        { name: '首页', url: '/' },
        { name: post.category?.[0] || '文章', url: `/category/${post.category?.[0]}` },
        { name: post.title, url: `/${post.slug}` }
      ]}
      customMeta={{
        keywords: post.tags?.slice(0, 5), // 限制关键词数量
        twitterHandle: 'your_twitter_handle'
      }}
    />
  )
}

/**
 * 首页SEO示例
 */
export function HomePageSEO({ siteInfo, latestPosts }) {
  return (
    <SEO
      useEnhanced={true}
      siteInfo={siteInfo}
      posts={latestPosts}
      customMeta={{
        title: siteInfo.title,
        description: siteInfo.description,
        keywords: ['博客', '技术分享', '前端开发']
      }}
    />
  )
}

/**
 * 分类页面SEO示例
 */
export function CategoryPageSEO({ category, siteInfo, posts }) {
  return (
    <SEO
      useEnhanced={true}
      siteInfo={siteInfo}
      posts={posts}
      breadcrumbs={[
        { name: '首页', url: '/' },
        { name: '分类', url: '/category' },
        { name: category, url: `/category/${category}` }
      ]}
      customMeta={{
        title: `${category} 分类`,
        description: `浏览 ${siteInfo.title} 中 ${category} 分类的所有文章，共 ${posts?.length || 0} 篇文章。`,
        keywords: [category, '分类', '文章列表']
      }}
    />
  )
}

/**
 * 搜索页面SEO示例
 */
export function SearchPageSEO({ keyword, siteInfo, searchResults }) {
  return (
    <SEO
      useEnhanced={true}
      siteInfo={siteInfo}
      customMeta={{
        title: keyword ? `搜索: ${keyword}` : '搜索',
        description: keyword 
          ? `在 ${siteInfo.title} 中搜索 "${keyword}" 找到 ${searchResults?.length || 0} 个结果。`
          : `在 ${siteInfo.title} 中搜索您感兴趣的内容。`,
        keywords: keyword ? [keyword, '搜索', '结果'] : ['搜索'],
        robots: 'noindex, follow' // 搜索页面通常不需要被索引
      }}
    />
  )
}

/**
 * 使用DynamicMetaTags的示例
 */
export function CustomPageSEO({ pageData, siteInfo }) {
  return (
    <DynamicMetaTags
      title={pageData.title}
      description={pageData.description}
      keywords={pageData.keywords}
      image={pageData.coverImage}
      url={`${siteInfo.link}/${pageData.slug}`}
      type="article"
      siteName={siteInfo.title}
      author={siteInfo.author}
      publishedTime={pageData.publishedTime}
      modifiedTime={pageData.modifiedTime}
      section={pageData.category}
      tags={pageData.tags}
      locale="zh_CN"
      twitterHandle="your_twitter_handle"
    />
  )
}

/**
 * 404页面SEO示例
 */
export function NotFoundPageSEO({ siteInfo }) {
  return (
    <SEO
      useEnhanced={true}
      siteInfo={siteInfo}
      customMeta={{
        title: '页面未找到 - 404',
        description: `抱歉，您访问的页面在 ${siteInfo.title} 中不存在。请检查URL是否正确，或返回首页浏览其他内容。`,
        robots: 'noindex, nofollow' // 404页面不应该被索引
      }}
    />
  )
}

/**
 * 标签页面SEO示例
 */
export function TagPageSEO({ tag, siteInfo, posts }) {
  return (
    <SEO
      useEnhanced={true}
      siteInfo={siteInfo}
      posts={posts}
      breadcrumbs={[
        { name: '首页', url: '/' },
        { name: '标签', url: '/tag' },
        { name: tag, url: `/tag/${tag}` }
      ]}
      customMeta={{
        title: `${tag} 标签`,
        description: `浏览 ${siteInfo.title} 中标签为 ${tag} 的所有文章，发现相关的精彩内容。`,
        keywords: [tag, '标签', '相关文章']
      }}
    />
  )
}

/**
 * 归档页面SEO示例
 */
export function ArchivePageSEO({ siteInfo, posts, year, month }) {
  const timeDesc = year && month 
    ? `${year}年${month}月` 
    : year 
    ? `${year}年` 
    : '所有时间'
    
  return (
    <SEO
      useEnhanced={true}
      siteInfo={siteInfo}
      posts={posts}
      breadcrumbs={[
        { name: '首页', url: '/' },
        { name: '归档', url: '/archive' },
        ...(year ? [{ name: `${year}年`, url: `/archive/${year}` }] : []),
        ...(month ? [{ name: `${month}月`, url: `/archive/${year}/${month}` }] : [])
      ]}
      customMeta={{
        title: `文章归档 - ${timeDesc}`,
        description: `浏览 ${siteInfo.title} ${timeDesc}的文章归档，共 ${posts?.length || 0} 篇文章。`,
        keywords: ['归档', '文章列表', timeDesc]
      }}
    />
  )
}