/**
 * 图片Sitemap生成器
 * 自动生成符合Google标准的图片sitemap
 */

import { siteConfig } from '@/lib/config'
import { extractImagesFromContent, generateImageSitemap } from './imageSEO'

/**
 * 生成完整的图片sitemap
 * @param {Array} posts - 文章列表
 * @param {Object} options - 配置选项
 * @returns {Promise<string>} 图片sitemap XML
 */
export async function generateFullImageSitemap(posts, options = {}) {
  const {
    baseUrl = siteConfig('LINK') || 'https://example.com',
    includeStaticImages = true,
    maxImagesPerPage = 1000,
    filterImages = null
  } = options

  const allImages = []
  
  // 从文章内容中提取图片
  for (const post of posts) {
    if (!post || !post.blockMap) continue
    
    const pageUrl = `${baseUrl}/${post.slug || post.id}`
    const content = extractContentFromBlocks(post.blockMap)
    const images = extractImagesFromContent(content, baseUrl)
    
    // 为每个图片添加页面信息
    images.forEach(image => {
      allImages.push({
        ...image,
        pageUrl,
        title: image.alt || post.title || '',
        caption: image.alt || '',
        publishDate: post.publishDate || post.date,
        author: post.author || siteConfig('AUTHOR'),
        category: post.category,
        tags: post.tags
      })
    })
  }
  
  // 包含静态图片（如果启用）
  if (includeStaticImages) {
    const staticImages = await getStaticImages(baseUrl)
    allImages.push(...staticImages)
  }
  
  // 过滤图片（如果提供了过滤函数）
  let filteredImages = allImages
  if (typeof filterImages === 'function') {
    filteredImages = allImages.filter(filterImages)
  }
  
  // 限制每页图片数量
  if (filteredImages.length > maxImagesPerPage) {
    filteredImages = filteredImages.slice(0, maxImagesPerPage)
  }
  
  // 生成sitemap
  return generateImageSitemap(filteredImages, baseUrl)
}

/**
 * 生成图片sitemap索引文件
 * @param {Array} sitemapUrls - sitemap URL列表
 * @param {string} baseUrl - 基础URL
 * @returns {string} sitemap索引XML
 */
export function generateImageSitemapIndex(sitemapUrls, baseUrl) {
  const sitemapEntries = sitemapUrls.map(url => `
  <sitemap>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`
}

/**
 * 按分类生成图片sitemap
 * @param {Array} posts - 文章列表
 * @param {string} baseUrl - 基础URL
 * @returns {Object} 按分类分组的sitemap
 */
export async function generateImageSitemapsByCategory(posts, baseUrl) {
  const sitemapsByCategory = {}
  
  // 按分类分组文章
  const postsByCategory = groupPostsByCategory(posts)
  
  // 为每个分类生成sitemap
  for (const [category, categoryPosts] of Object.entries(postsByCategory)) {
    const sitemap = await generateFullImageSitemap(categoryPosts, { baseUrl })
    if (sitemap) {
      sitemapsByCategory[category] = sitemap
    }
  }
  
  return sitemapsByCategory
}

/**
 * 获取图片sitemap统计信息
 * @param {Array} posts - 文章列表
 * @returns {Object} 统计信息
 */
export async function getImageSitemapStats(posts) {
  let totalImages = 0
  let imagesWithAlt = 0
  let imagesWithTitle = 0
  let imagesByFormat = {}
  let imagesByCategory = {}
  
  for (const post of posts) {
    if (!post || !post.blockMap) continue
    
    const content = extractContentFromBlocks(post.blockMap)
    const images = extractImagesFromContent(content)
    
    totalImages += images.length
    
    images.forEach(image => {
      // 统计alt属性
      if (image.alt && image.alt.trim()) {
        imagesWithAlt++
      }
      
      // 统计title属性
      if (image.title && image.title.trim()) {
        imagesWithTitle++
      }
      
      // 统计格式
      const format = image.format || 'unknown'
      imagesByFormat[format] = (imagesByFormat[format] || 0) + 1
      
      // 统计分类
      const category = post.category || 'uncategorized'
      imagesByCategory[category] = (imagesByCategory[category] || 0) + 1
    })
  }
  
  return {
    totalImages,
    imagesWithAlt,
    imagesWithTitle,
    altCoverage: totalImages > 0 ? (imagesWithAlt / totalImages * 100).toFixed(1) : 0,
    titleCoverage: totalImages > 0 ? (imagesWithTitle / totalImages * 100).toFixed(1) : 0,
    imagesByFormat,
    imagesByCategory,
    generatedAt: new Date().toISOString()
  }
}

/**
 * 验证图片sitemap
 * @param {string} sitemapXml - sitemap XML内容
 * @returns {Object} 验证结果
 */
export function validateImageSitemap(sitemapXml) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      totalUrls: 0,
      totalImages: 0,
      averageImagesPerUrl: 0
    }
  }
  
  try {
    // 基本XML格式检查
    if (!sitemapXml || !sitemapXml.includes('<?xml')) {
      validation.isValid = false
      validation.errors.push('Invalid XML format')
      return validation
    }
    
    // 检查必需的命名空间
    if (!sitemapXml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
      validation.errors.push('Missing image namespace declaration')
    }
    
    // 统计URL和图片数量
    const urlMatches = sitemapXml.match(/<url>/g)
    const imageMatches = sitemapXml.match(/<image:image>/g)
    
    validation.stats.totalUrls = urlMatches ? urlMatches.length : 0
    validation.stats.totalImages = imageMatches ? imageMatches.length : 0
    validation.stats.averageImagesPerUrl = validation.stats.totalUrls > 0 
      ? (validation.stats.totalImages / validation.stats.totalUrls).toFixed(1) 
      : 0
    
    // 检查图片数量限制
    if (validation.stats.totalImages > 1000) {
      validation.warnings.push('Sitemap contains more than 1000 images, consider splitting into multiple sitemaps')
    }
    
    // 检查每个URL的图片数量
    const urlSections = sitemapXml.split('<url>')
    urlSections.forEach((section, index) => {
      if (index === 0) return // 跳过第一个空段
      
      const imageCount = (section.match(/<image:image>/g) || []).length
      if (imageCount > 1000) {
        validation.warnings.push(`URL ${index} contains ${imageCount} images, exceeding the recommended limit of 1000`)
      }
    })
    
  } catch (error) {
    validation.isValid = false
    validation.errors.push(`Validation error: ${error.message}`)
  }
  
  return validation
}

/**
 * 优化图片sitemap大小
 * @param {string} sitemapXml - 原始sitemap XML
 * @param {Object} options - 优化选项
 * @returns {string} 优化后的sitemap XML
 */
export function optimizeImageSitemap(sitemapXml, options = {}) {
  const {
    removeEmptyTitles = true,
    removeEmptyCaptions = true,
    compressWhitespace = true,
    maxImagesPerUrl = 1000
  } = options
  
  let optimizedXml = sitemapXml
  
  // 移除空的title标签
  if (removeEmptyTitles) {
    optimizedXml = optimizedXml.replace(/<image:title><\/image:title>/g, '')
    optimizedXml = optimizedXml.replace(/<image:title>\s*<\/image:title>/g, '')
  }
  
  // 移除空的caption标签
  if (removeEmptyCaptions) {
    optimizedXml = optimizedXml.replace(/<image:caption><\/image:caption>/g, '')
    optimizedXml = optimizedXml.replace(/<image:caption>\s*<\/image:caption>/g, '')
  }
  
  // 压缩空白字符
  if (compressWhitespace) {
    optimizedXml = optimizedXml.replace(/>\s+</g, '><')
    optimizedXml = optimizedXml.replace(/\n\s*\n/g, '\n')
  }
  
  // 限制每个URL的图片数量
  if (maxImagesPerUrl < 1000) {
    const urlSections = optimizedXml.split('<url>')
    const processedSections = urlSections.map((section, index) => {
      if (index === 0) return section // 保持第一个段落不变
      
      const imageMatches = section.match(/<image:image>.*?<\/image:image>/gs)
      if (imageMatches && imageMatches.length > maxImagesPerUrl) {
        const limitedImages = imageMatches.slice(0, maxImagesPerUrl).join('')
        return section.replace(/<image:image>.*?<\/image:image>/gs, '') + limitedImages
      }
      
      return section
    })
    
    optimizedXml = processedSections.join('<url>')
  }
  
  return optimizedXml
}

// ==================== 辅助函数 ====================

/**
 * 从Notion块中提取内容
 */
function extractContentFromBlocks(blockMap) {
  if (!blockMap) return ''
  
  let content = ''
  
  Object.values(blockMap).forEach(block => {
    if (!block || !block.value) return
    
    const blockValue = block.value
    
    // 提取文本内容
    if (blockValue.properties && blockValue.properties.title) {
      const title = blockValue.properties.title.map(item => item[0]).join('')
      content += title + '\n'
    }
    
    // 提取图片
    if (blockValue.type === 'image' && blockValue.properties) {
      const imageUrl = blockValue.properties.source?.[0]?.[0] || ''
      const caption = blockValue.properties.caption?.[0]?.[0] || ''
      content += `![${caption}](${imageUrl})\n`
    }
  })
  
  return content
}

/**
 * 获取静态图片列表
 */
async function getStaticImages(baseUrl) {
  const staticImages = []
  
  // 这里可以扫描public目录或其他静态资源
  // 目前返回一些常见的静态图片
  const commonStaticImages = [
    '/favicon.ico',
    '/avatar.png',
    '/avatar.svg',
    '/bg_image.jpg'
  ]
  
  commonStaticImages.forEach(imagePath => {
    staticImages.push({
      src: `${baseUrl}${imagePath}`,
      alt: `${siteConfig('TITLE')} - ${imagePath.split('/').pop()}`,
      title: siteConfig('TITLE'),
      pageUrl: baseUrl,
      format: imagePath.split('.').pop(),
      isStatic: true
    })
  })
  
  return staticImages
}

/**
 * 按分类分组文章
 */
function groupPostsByCategory(posts) {
  const grouped = {}
  
  posts.forEach(post => {
    const category = post.category || 'uncategorized'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(post)
  })
  
  return grouped
}

/**
 * XML转义函数
 */
function escapeXml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * 图片sitemap配置
 */
export const IMAGE_SITEMAP_CONFIG = {
  maxImagesPerSitemap: 50000,
  maxImagesPerUrl: 1000,
  maxSitemapSize: 50 * 1024 * 1024, // 50MB
  supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'],
  requiredFields: ['src', 'pageUrl'],
  optionalFields: ['title', 'caption', 'geoLocation', 'license']
}