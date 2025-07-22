/**
 * 图片Sitemap API
 * 生成符合Google标准的图片sitemap
 */

import { generateFullImageSitemap, getImageSitemapStats, validateImageSitemap } from '@/lib/seo/imageSitemapGenerator'
import { getGlobalData } from '@/lib/db/getSiteData'
import { siteConfig } from '@/lib/config'

export default async function handler(req, res) {
  const { method, query } = req
  
  // 设置缓存头
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200')
  
  try {
    switch (method) {
      case 'GET':
        await handleGetRequest(req, res, query)
        break
      case 'POST':
        await handlePostRequest(req, res)
        break
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Image sitemap API error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

/**
 * 处理GET请求 - 生成图片sitemap
 */
async function handleGetRequest(req, res, query) {
  const {
    format = 'xml',
    category,
    validate = 'false',
    stats = 'false'
  } = query

  // 获取所有文章
  const globalData = await getGlobalData({ from: 'sitemap-images' })
  const posts = globalData.allPages?.filter(post => 
    post.type === 'Post' && post.status === 'Published'
  ) || []
  
  if (!posts || posts.length === 0) {
    return res.status(404).json({ error: 'No posts found' })
  }

  // 过滤分类（如果指定）
  const filteredPosts = category 
    ? posts.filter(post => post.category === category)
    : posts

  const baseUrl = siteConfig('LINK') || 'https://example.com'

  // 生成sitemap选项
  const options = {
    baseUrl,
    includeStaticImages: true,
    maxImagesPerPage: 1000,
    filterImages: (image) => {
      // 过滤掉无效的图片
      return image.src && 
             !image.src.includes('placeholder') &&
             !image.src.includes('loading')
    }
  }

  if (stats === 'true') {
    // 返回统计信息
    const statistics = getImageSitemapStats(filteredPosts)
    return res.status(200).json({
      success: true,
      stats: statistics
    })
  }

  // 生成图片sitemap
  const sitemap = await generateFullImageSitemap(filteredPosts, options)
  
  if (!sitemap) {
    return res.status(404).json({ error: 'No images found' })
  }

  // 验证sitemap（如果请求）
  let validation = null
  if (validate === 'true') {
    validation = validateImageSitemap(sitemap)
  }

  if (format === 'json') {
    return res.status(200).json({
      success: true,
      sitemap,
      validation,
      generatedAt: new Date().toISOString()
    })
  }

  // 返回XML格式
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.status(200).send(sitemap)
}

/**
 * 处理POST请求 - 验证图片sitemap
 */
async function handlePostRequest(req, res) {
  const { sitemap } = req.body
  
  if (!sitemap) {
    return res.status(400).json({ error: 'Sitemap content is required' })
  }

  // 验证sitemap
  const validation = validateImageSitemap(sitemap)
  
  res.status(200).json({
    success: true,
    validation,
    validatedAt: new Date().toISOString()
  })
}

/**
 * 获取图片sitemap配置信息
 */
export async function getImageSitemapConfig() {
  return {
    enabled: siteConfig('SEO_SITEMAP_IMAGES', true),
    maxImagesPerSitemap: 50000,
    maxImagesPerUrl: 1000,
    supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
    baseUrl: siteConfig('LINK'),
    includeStaticImages: true,
    autoGenerate: true,
    updateFrequency: 'daily'
  }
}