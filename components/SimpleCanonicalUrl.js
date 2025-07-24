import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'

/**
 * 简单的Canonical URL生成组件
 * 用于测试和验证URL生成逻辑
 */
export default function SimpleCanonicalUrl() {
  const router = useRouter()
  const baseUrl = siteConfig('LINK')?.replace(/\/$/, '') || 'https://example.com'
  
  // 简单直接的URL生成
  const generateSimpleCanonicalUrl = () => {
    const path = router.asPath.split('?')[0]
    
    if (path === '/') {
      return baseUrl
    }
    
    // 确保路径以/开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}${normalizedPath}`
  }
  
  const canonicalUrl = generateSimpleCanonicalUrl()
  
  // 在开发环境中显示调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('[简单URL生成]', {
      baseUrl,
      path: router.asPath,
      canonicalUrl
    })
  }
  
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
    </>
  )
}