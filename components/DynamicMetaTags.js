import Head from 'next/head'
import { useMemo } from 'react'
import { 
  optimizeMetaDescription, 
  optimizePageTitle,
  validateMetaDescription 
} from '@/lib/seo/seoUtils'

/**
 * 动态Meta标签生成器
 * 根据页面类型和内容自动生成优化的meta标签
 * @param {Object} props 组件属性
 * @returns {JSX.Element} Head元素
 */
const DynamicMetaTags = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  siteName,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  locale = 'zh_CN',
  twitterHandle,
  facebookAppId
}) => {
  // 优化meta数据
  const optimizedMeta = useMemo(() => {
    const optimizedTitle = optimizePageTitle(title, siteName)
    const optimizedDescription = optimizeMetaDescription(description)
    const descriptionValidation = validateMetaDescription(optimizedDescription)
    
    // 处理关键词
    const allKeywords = [...new Set([...keywords, ...tags])].slice(0, 10)
    const keywordsString = allKeywords.join(', ')
    
    // 处理图片URL
    const imageUrl = image || '/bg_image.jpg'
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${url?.split('/').slice(0, 3).join('/')}${imageUrl}`
    
    return {
      title: optimizedTitle,
      description: optimizedDescription,
      keywords: keywordsString,
      image: absoluteImageUrl,
      descriptionValidation
    }
  }, [title, siteName, description, keywords, tags, image, url])
  
  // 生成Twitter Card类型
  const twitterCardType = optimizedMeta.image ? 'summary_large_image' : 'summary'
  
  return (
    <Head>
      {/* 基础meta标签 */}
      <title>{optimizedMeta.title}</title>
      <meta name="description" content={optimizedMeta.description} />
      {optimizedMeta.keywords && (
        <meta name="keywords" content={optimizedMeta.keywords} />
      )}
      
      {/* Open Graph标签 */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={optimizedMeta.title} />
      <meta property="og:description" content={optimizedMeta.description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={optimizedMeta.image} />
      {siteName && <meta property="og:site_name" content={siteName} />}
      <meta property="og:locale" content={locale} />
      
      {/* 文章特定的Open Graph标签 */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && (
            <meta property="article:author" content={author} />
          )}
          {section && (
            <meta property="article:section" content={section} />
          )}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={optimizedMeta.title} />
      <meta name="twitter:description" content={optimizedMeta.description} />
      <meta name="twitter:image" content={optimizedMeta.image} />
      {twitterHandle && (
        <>
          <meta name="twitter:site" content={`@${twitterHandle}`} />
          <meta name="twitter:creator" content={`@${twitterHandle}`} />
        </>
      )}
      
      {/* Facebook App ID */}
      {facebookAppId && (
        <meta property="fb:app_id" content={facebookAppId} />
      )}
      
      {/* 额外的meta标签 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* SEO质量警告（仅在开发环境） */}
      {process.env.NODE_ENV === 'development' && 
       !optimizedMeta.descriptionValidation.isValid && (
        <meta 
          name="seo-warning" 
          content={`SEO问题: ${optimizedMeta.descriptionValidation.issues.join(', ')}`} 
        />
      )}
    </Head>
  )
}

export default DynamicMetaTags