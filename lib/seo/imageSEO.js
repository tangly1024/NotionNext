/**
 * 图片SEO优化工具
 * 提供图片alt属性生成、文件名优化、图片sitemap等功能
 */

/**
 * 自动生成图片alt属性
 * @param {string} imageSrc - 图片源地址
 * @param {Object} context - 上下文信息
 * @returns {Promise<string>} 生成的alt属性
 */
export async function generateImageAlt(imageSrc, context = {}) {
  if (!imageSrc) return ''
  
  // 从文件名提取信息
  const filename = extractFilename(imageSrc)
  const filenameAlt = generateAltFromFilename(filename)
  
  // 从上下文生成alt
  const contextAlt = generateAltFromContext(context)
  
  // 使用AI/ML服务生成alt（如果可用）
  const aiAlt = await generateAltFromAI(imageSrc, context)
  
  // 组合生成最终alt
  const combinedAlt = combineAltTexts(filenameAlt, contextAlt, aiAlt, context)
  
  // 清理和优化alt文本
  return cleanAndOptimizeAlt(combinedAlt)
}

/**
 * 批量优化图片alt属性
 * @param {string} content - 内容文本
 * @param {Object} context - 上下文信息
 * @returns {Promise<string>} 优化后的内容
 */
export async function optimizeImageAlts(content, context = {}) {
  if (!content) return content
  
  // 匹配Markdown图片语法
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  const matches = Array.from(content.matchAll(imageRegex))
  
  let optimizedContent = content
  
  // 处理每个匹配的图片
  for (const match of matches) {
    const [fullMatch, currentAlt, imageSrc] = match
    
    // 如果已有alt且不为空，保持原有alt
    if (currentAlt && currentAlt.trim()) {
      continue
    }
    
    try {
      // 生成新的alt属性
      const newAlt = await generateImageAlt(imageSrc, {
        ...context,
        surroundingText: extractSurroundingText(content, fullMatch)
      })
      
      if (newAlt) {
        const newImageTag = `![${newAlt}](${imageSrc})`
        optimizedContent = optimizedContent.replace(fullMatch, newImageTag)
      }
    } catch (error) {
      console.warn(`Failed to generate alt for image: ${imageSrc}`, error)
    }
  }
  
  return optimizedContent
}

/**
 * 优化图片文件名
 * @param {string} filename - 原始文件名
 * @param {Object} options - 优化选项
 * @returns {string} 优化后的文件名
 */
export function optimizeImageFilename(filename, options = {}) {
  const {
    keywords = [],
    maxLength = 50,
    includeDate = false,
    separator = '-'
  } = options
  
  if (!filename) return ''
  
  // 提取文件扩展名
  const extension = getFileExtension(filename)
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  
  // 清理文件名
  let optimizedName = cleanFilename(nameWithoutExt)
  
  // 添加关键词
  if (keywords.length > 0) {
    const keywordString = keywords.slice(0, 3).join(separator)
    optimizedName = `${keywordString}${separator}${optimizedName}`
  }
  
  // 添加日期（如果需要）
  if (includeDate) {
    const dateString = new Date().toISOString().split('T')[0]
    optimizedName = `${optimizedName}${separator}${dateString}`
  }
  
  // 限制长度
  if (optimizedName.length > maxLength) {
    optimizedName = optimizedName.substring(0, maxLength)
  }
  
  // 确保以字母或数字结尾
  optimizedName = optimizedName.replace(/[^a-z0-9]+$/, '')
  
  return `${optimizedName}.${extension}`
}

/**
 * 生成图片sitemap
 * @param {Array} images - 图片列表
 * @param {string} baseUrl - 基础URL
 * @returns {string} 图片sitemap XML
 */
export function generateImageSitemap(images, baseUrl) {
  if (!images || images.length === 0) return ''
  
  const urlEntries = []
  
  // 按页面分组图片
  const imagesByPage = groupImagesByPage(images)
  
  Object.entries(imagesByPage).forEach(([pageUrl, pageImages]) => {
    const imageElements = pageImages.map(image => `
    <image:image>
      <image:loc>${escapeXml(image.src)}</image:loc>
      <image:title>${escapeXml(image.title || image.alt || '')}</image:title>
      <image:caption>${escapeXml(image.caption || image.alt || '')}</image:caption>
      ${image.geoLocation ? `<image:geo_location>${escapeXml(image.geoLocation)}</image:geo_location>` : ''}
      ${image.license ? `<image:license>${escapeXml(image.license)}</image:license>` : ''}
    </image:image>`).join('')
    
    urlEntries.push(`
  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>${imageElements}
  </url>`)
  })
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join('')}
</urlset>`
}

/**
 * 分析图片SEO质量
 * @param {Array} images - 图片列表
 * @returns {Object} 分析结果
 */
export function analyzeImageSEO(images) {
  if (!images || images.length === 0) {
    return {
      totalImages: 0,
      score: 100,
      issues: [],
      recommendations: []
    }
  }
  
  const analysis = {
    totalImages: images.length,
    imagesWithAlt: 0,
    imagesWithTitle: 0,
    imagesWithOptimizedFilename: 0,
    imagesWithModernFormat: 0,
    averageFileSize: 0,
    issues: [],
    recommendations: []
  }
  
  let totalFileSize = 0
  
  images.forEach((image, index) => {
    // 检查alt属性
    if (image.alt && image.alt.trim()) {
      analysis.imagesWithAlt++
      
      // 检查alt质量
      if (image.alt.length < 10) {
        analysis.issues.push({
          type: 'warning',
          message: `图片 ${index + 1} 的alt属性过短`,
          image: image.src
        })
      }
      
      if (image.alt.length > 125) {
        analysis.issues.push({
          type: 'warning',
          message: `图片 ${index + 1} 的alt属性过长`,
          image: image.src
        })
      }
    } else {
      analysis.issues.push({
        type: 'error',
        message: `图片 ${index + 1} 缺少alt属性`,
        image: image.src
      })
    }
    
    // 检查title属性
    if (image.title && image.title.trim()) {
      analysis.imagesWithTitle++
    }
    
    // 检查文件名优化
    if (isFilenameOptimized(image.src)) {
      analysis.imagesWithOptimizedFilename++
    } else {
      analysis.issues.push({
        type: 'warning',
        message: `图片 ${index + 1} 文件名未优化`,
        image: image.src
      })
    }
    
    // 检查图片格式
    if (isModernImageFormat(image.src)) {
      analysis.imagesWithModernFormat++
    } else {
      analysis.recommendations.push({
        type: 'optimization',
        message: `考虑将图片 ${index + 1} 转换为WebP或AVIF格式`,
        image: image.src
      })
    }
    
    // 估算文件大小（如果有的话）
    if (image.fileSize) {
      totalFileSize += image.fileSize
    }
  })
  
  analysis.averageFileSize = totalFileSize / images.length
  
  // 计算总体评分
  analysis.score = calculateImageSEOScore(analysis)
  
  // 生成建议
  analysis.recommendations.push(...generateImageSEORecommendations(analysis))
  
  return analysis
}

/**
 * 提取内容中的所有图片信息
 * @param {string} content - 内容文本
 * @param {string} baseUrl - 基础URL
 * @returns {Array} 图片信息列表
 */
export function extractImagesFromContent(content, baseUrl = '') {
  if (!content) return []
  
  const images = []
  
  // 匹配Markdown图片
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  let match
  
  while ((match = markdownImageRegex.exec(content)) !== null) {
    const alt = match[1]
    const src = match[2]
    
    images.push({
      src: resolveImageUrl(src, baseUrl),
      alt: alt || '',
      title: '',
      format: getImageFormat(src),
      context: extractImageContext(content, match.index)
    })
  }
  
  // 匹配HTML图片
  const htmlImageRegex = /<img[^>]+>/g
  while ((match = htmlImageRegex.exec(content)) !== null) {
    const imgTag = match[0]
    const src = extractAttributeFromTag(imgTag, 'src')
    const alt = extractAttributeFromTag(imgTag, 'alt')
    const title = extractAttributeFromTag(imgTag, 'title')
    
    if (src) {
      images.push({
        src: resolveImageUrl(src, baseUrl),
        alt: alt || '',
        title: title || '',
        format: getImageFormat(src),
        context: extractImageContext(content, match.index)
      })
    }
  }
  
  return images
}

/**
 * 生成图片结构化数据
 * @param {Array} images - 图片列表
 * @param {Object} pageInfo - 页面信息
 * @returns {Object} 结构化数据
 */
export function generateImageStructuredData(images, pageInfo = {}) {
  if (!images || images.length === 0) return null
  
  const imageObjects = images.map(image => ({
    "@type": "ImageObject",
    "url": image.src,
    "name": image.alt || image.title || '',
    "description": image.caption || image.alt || '',
    "contentUrl": image.src,
    "thumbnailUrl": generateThumbnailUrl(image.src),
    "encodingFormat": getImageMimeType(image.format),
    "width": image.width || null,
    "height": image.height || null,
    "uploadDate": image.uploadDate || pageInfo.publishDate || null,
    "author": pageInfo.author ? {
      "@type": "Person",
      "name": pageInfo.author
    } : null,
    "copyrightHolder": pageInfo.author ? {
      "@type": "Person", 
      "name": pageInfo.author
    } : null
  }))
  
  if (imageObjects.length === 1) {
    return {
      "@context": "https://schema.org",
      ...imageObjects[0]
    }
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": imageObjects.map((image, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": image
    }))
  }
}

/**
 * 综合图片SEO优化
 * @param {Array} images - 图片列表
 * @param {Object} context - 上下文信息
 * @returns {Promise<Object>} 优化结果
 */
export async function optimizeImagesSEO(images, context = {}) {
  if (!images || images.length === 0) {
    return {
      optimizedImages: [],
      optimizationReport: {
        totalImages: 0,
        optimizedCount: 0,
        improvements: []
      }
    }
  }

  const optimizedImages = []
  const improvements = []

  for (const image of images) {
    const optimizedImage = { ...image }
    let imageImprovements = []

    // 优化alt属性
    if (!image.alt || image.alt.trim() === '') {
      try {
        const generatedAlt = await generateImageAlt(image.src, context)
        if (generatedAlt) {
          optimizedImage.alt = generatedAlt
          imageImprovements.push('Generated alt attribute')
        }
      } catch (error) {
        console.warn('Failed to generate alt for image:', image.src, error)
      }
    }

    // 优化文件名
    if (image.filename && !isFilenameOptimized(image.src)) {
      const optimizedFilename = optimizeImageFilename(image.filename, {
        keywords: context.keywords || [],
        maxLength: 50
      })
      optimizedImage.optimizedFilename = optimizedFilename
      imageImprovements.push('Optimized filename')
    }

    // 检查图片格式
    if (!isModernImageFormat(image.src)) {
      const currentFormat = getImageFormat(image.src)
      optimizedImage.recommendedFormat = 'webp'
      imageImprovements.push(`Consider converting from ${currentFormat} to WebP`)
    }

    // 添加结构化数据
    if (!image.structuredData) {
      optimizedImage.structuredData = generateImageStructuredData([optimizedImage], context)
      imageImprovements.push('Added structured data')
    }

    // 性能优化建议
    if (image.fileSize && image.fileSize > IMAGE_SEO_CONFIG.fileSize.recommendedSize) {
      imageImprovements.push('Consider compressing image for better performance')
    }

    optimizedImages.push(optimizedImage)
    if (imageImprovements.length > 0) {
      improvements.push({
        src: image.src,
        improvements: imageImprovements
      })
    }
  }

  return {
    optimizedImages,
    optimizationReport: {
      totalImages: images.length,
      optimizedCount: improvements.length,
      improvements
    }
  }
}

/**
 * 生成图片SEO报告
 * @param {Array} images - 图片列表
 * @param {Object} options - 选项
 * @returns {Object} SEO报告
 */
export function generateImageSEOReport(images, options = {}) {
  const analysis = analyzeImageSEO(images)
  const report = {
    ...analysis,
    timestamp: new Date().toISOString(),
    url: options.url || '',
    recommendations: []
  }

  // 生成详细建议
  if (analysis.imagesWithAlt / analysis.totalImages < 0.9) {
    report.recommendations.push({
      priority: 'high',
      category: 'accessibility',
      message: 'Add descriptive alt attributes to all images',
      affectedImages: analysis.totalImages - analysis.imagesWithAlt,
      impact: 'Critical for accessibility and SEO'
    })
  }

  if (analysis.imagesWithOptimizedFilename / analysis.totalImages < 0.7) {
    report.recommendations.push({
      priority: 'medium',
      category: 'seo',
      message: 'Optimize image filenames with descriptive keywords',
      affectedImages: analysis.totalImages - analysis.imagesWithOptimizedFilename,
      impact: 'Improves search engine understanding'
    })
  }

  if (analysis.imagesWithModernFormat / analysis.totalImages < 0.5) {
    report.recommendations.push({
      priority: 'medium',
      category: 'performance',
      message: 'Convert images to modern formats (WebP/AVIF)',
      affectedImages: analysis.totalImages - analysis.imagesWithModernFormat,
      impact: 'Reduces file size and improves loading speed'
    })
  }

  return report
}

/**
 * 验证图片SEO最佳实践
 * @param {Object} image - 图片对象
 * @returns {Object} 验证结果
 */
export function validateImageSEO(image) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: [],
    score: 100
  }

  // 检查必需的alt属性
  if (!image.alt || image.alt.trim() === '') {
    validation.isValid = false
    validation.errors.push('Missing alt attribute')
    validation.score -= 30
  } else {
    // 检查alt属性质量
    if (image.alt.length < IMAGE_SEO_CONFIG.altText.minLength) {
      validation.warnings.push('Alt text is too short')
      validation.score -= 10
    }
    if (image.alt.length > IMAGE_SEO_CONFIG.altText.maxLength) {
      validation.warnings.push('Alt text is too long')
      validation.score -= 10
    }
  }

  // 检查文件名
  if (!isFilenameOptimized(image.src)) {
    validation.warnings.push('Filename could be more descriptive')
    validation.score -= 15
  }

  // 检查图片格式
  if (!isModernImageFormat(image.src)) {
    validation.warnings.push('Consider using modern image format (WebP/AVIF)')
    validation.score -= 15
  }

  // 检查尺寸属性
  if (!image.width || !image.height) {
    validation.warnings.push('Missing width/height attributes (may cause CLS)')
    validation.score -= 10
  }

  // 检查loading属性
  if (!image.loading) {
    validation.warnings.push('Consider adding loading attribute for performance')
    validation.score -= 5
  }

  validation.score = Math.max(0, validation.score)
  return validation
}

// ==================== 辅助函数 ====================

function extractFilename(imageSrc) {
  if (!imageSrc) return ''
  return imageSrc.split('/').pop().split('?')[0]
}

function generateAltFromFilename(filename) {
  if (!filename) return ''
  
  // 移除扩展名
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  
  // 替换分隔符为空格
  let alt = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // 处理驼峰命名
    .toLowerCase()
  
  // 清理多余空格
  alt = alt.replace(/\s+/g, ' ').trim()
  
  // 首字母大写
  return alt.charAt(0).toUpperCase() + alt.slice(1)
}

function generateAltFromContext(context) {
  if (!context) return ''
  
  const { title, category, tags, surroundingText } = context
  
  let contextAlt = ''
  
  // 从标题提取
  if (title) {
    contextAlt += title
  }
  
  // 从分类提取
  if (category) {
    contextAlt += ` ${category}`
  }
  
  // 从标签提取
  if (tags && tags.length > 0) {
    contextAlt += ` ${tags.slice(0, 2).join(' ')}`
  }
  
  // 从周围文本提取
  if (surroundingText) {
    const keywords = extractKeywordsFromText(surroundingText)
    if (keywords.length > 0) {
      contextAlt += ` ${keywords.slice(0, 2).join(' ')}`
    }
  }
  
  return contextAlt.trim()
}

async function generateAltFromAI(imageSrc, context) {
  try {
    // 增强的智能alt生成逻辑
    
    // 检查是否是占位符图片
    if (imageSrc.includes('placeholder') || imageSrc.includes('via.placeholder')) {
      return 'Placeholder image'
    }
    
    // 检查是否是常见的图标或logo
    if (imageSrc.includes('logo') || imageSrc.includes('icon') || imageSrc.includes('favicon')) {
      const siteName = context.title || context.siteName || 'Website'
      return `${siteName} logo`
    }
    
    // 检查是否是头像或个人资料图片
    if (imageSrc.includes('avatar') || imageSrc.includes('profile') || imageSrc.includes('user')) {
      const author = context.author || context.userName || 'User'
      return `${author} profile picture`
    }
    
    // 检查是否是截图
    if (imageSrc.includes('screenshot') || imageSrc.includes('screen') || imageSrc.includes('capture')) {
      const pageTitle = context.title || 'application'
      return `Screenshot of ${pageTitle}`
    }
    
    // 检查是否是图表、图形或数据可视化
    if (imageSrc.includes('chart') || imageSrc.includes('graph') || 
        imageSrc.includes('diagram') || imageSrc.includes('plot') ||
        imageSrc.includes('visualization')) {
      const topic = context.category || context.title || 'data'
      return `Chart showing ${topic} information`
    }
    
    // 检查是否是缩略图
    if (imageSrc.includes('thumb') || imageSrc.includes('thumbnail')) {
      const content = context.title || 'content'
      return `Thumbnail for ${content}`
    }
    
    // 检查是否是横幅或封面图片
    if (imageSrc.includes('banner') || imageSrc.includes('cover') || 
        imageSrc.includes('hero') || imageSrc.includes('header')) {
      const topic = context.title || context.category || 'page'
      return `Banner image for ${topic}`
    }
    
    // 检查是否是产品图片
    if (imageSrc.includes('product') || imageSrc.includes('item')) {
      const productName = context.title || 'product'
      return `${productName} product image`
    }
    
    // 基于文件名生成更智能的alt
    const filename = extractFilename(imageSrc)
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
    
    if (nameWithoutExt && nameWithoutExt.length > 3) {
      let smartAlt = nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\d+/g, '') // 移除数字
        .toLowerCase()
        .trim()
      
      // 移除常见的无意义词汇
      const meaninglessWords = ['img', 'image', 'pic', 'photo', 'file', 'untitled']
      meaninglessWords.forEach(word => {
        smartAlt = smartAlt.replace(new RegExp(`\\b${word}\\b`, 'gi'), '').trim()
      })
      
      if (smartAlt.length > 2) {
        // 添加上下文信息
        if (context.category) {
          smartAlt += ` related to ${context.category}`
        } else if (context.tags && context.tags.length > 0) {
          smartAlt += ` about ${context.tags[0]}`
        }
        
        return smartAlt.charAt(0).toUpperCase() + smartAlt.slice(1)
      }
    }
    
    // 基于周围文本生成alt
    if (context.surroundingText) {
      const keywords = extractKeywordsFromText(context.surroundingText)
      if (keywords.length > 0) {
        const keywordPhrase = keywords.slice(0, 2).join(' and ')
        return `Image illustrating ${keywordPhrase}`
      }
    }
    
    // 基于页面内容生成通用alt
    if (context.title && context.category) {
      return `Image from ${context.title} in ${context.category}`
    } else if (context.title) {
      return `Illustration for ${context.title}`
    } else if (context.category) {
      return `Image related to ${context.category}`
    }
    
    // 最后的备用选项
    return 'Content image'
  } catch (error) {
    console.warn('AI alt generation failed:', error)
    return ''
  }
}

function combineAltTexts(filenameAlt, contextAlt, aiAlt, context) {
  const alts = [filenameAlt, contextAlt, aiAlt].filter(alt => alt && alt.trim())
  
  if (alts.length === 0) return ''
  if (alts.length === 1) return alts[0]
  
  // 优先级：AI生成 > 上下文 > 文件名
  if (aiAlt && aiAlt.trim()) return aiAlt
  if (contextAlt && contextAlt.trim()) return contextAlt
  if (filenameAlt && filenameAlt.trim()) return filenameAlt
  
  // 智能组合多个来源
  const combined = alts.join(' - ')
  
  // 如果太长，选择最好的一个
  if (combined.length > 100) {
    return aiAlt || contextAlt || filenameAlt
  }
  
  return combined
}

function cleanAndOptimizeAlt(alt) {
  if (!alt) return ''
  
  // 清理HTML标签
  alt = alt.replace(/<[^>]*>/g, '')
  
  // 清理多余空格
  alt = alt.replace(/\s+/g, ' ').trim()
  
  // 移除常见的无用词汇
  const stopWords = ['image', 'picture', 'photo', 'img', '图片', '照片', '图像']
  stopWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    alt = alt.replace(regex, '').trim()
  })
  
  // 限制长度
  if (alt.length > 125) {
    alt = alt.substring(0, 122) + '...'
  }
  
  // 确保首字母大写
  if (alt.length > 0) {
    alt = alt.charAt(0).toUpperCase() + alt.slice(1)
  }
  
  return alt
}

function extractSurroundingText(content, imageMatch) {
  const index = content.indexOf(imageMatch)
  if (index === -1) return ''
  
  const start = Math.max(0, index - 200)
  const end = Math.min(content.length, index + imageMatch.length + 200)
  
  return content.substring(start, end)
}

function getFileExtension(filename) {
  const match = filename.match(/\.([^.]+)$/)
  return match ? match[1].toLowerCase() : ''
}

function cleanFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
    .replace(/^-|-$/g, '') // 移除开头和结尾的连字符
}

function groupImagesByPage(images) {
  const grouped = {}
  
  images.forEach(image => {
    const pageUrl = image.pageUrl || '/'
    if (!grouped[pageUrl]) {
      grouped[pageUrl] = []
    }
    grouped[pageUrl].push(image)
  })
  
  return grouped
}

function escapeXml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function isFilenameOptimized(imageSrc) {
  const filename = extractFilename(imageSrc)
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  
  // 检查是否包含有意义的词汇
  if (nameWithoutExt.length < 3) return false
  
  // 检查是否使用了连字符分隔
  if (!/^[a-z0-9-]+$/.test(nameWithoutExt)) return false
  
  // 检查是否避免了无意义的名称
  const meaninglessPatterns = [
    /^img\d+$/,
    /^image\d+$/,
    /^photo\d+$/,
    /^screenshot\d+$/,
    /^\d+$/
  ]
  
  return !meaninglessPatterns.some(pattern => pattern.test(nameWithoutExt))
}

function isModernImageFormat(imageSrc) {
  const format = getImageFormat(imageSrc)
  return ['webp', 'avif'].includes(format)
}

function getImageFormat(imageSrc) {
  const extension = getFileExtension(imageSrc)
  return extension || 'unknown'
}

function calculateImageSEOScore(analysis) {
  if (analysis.totalImages === 0) return 100
  
  let score = 100
  
  // Alt属性评分 (40%)
  const altRatio = analysis.imagesWithAlt / analysis.totalImages
  score -= (1 - altRatio) * 40
  
  // 文件名优化评分 (25%)
  const filenameRatio = analysis.imagesWithOptimizedFilename / analysis.totalImages
  score -= (1 - filenameRatio) * 25
  
  // 现代格式评分 (20%)
  const modernFormatRatio = analysis.imagesWithModernFormat / analysis.totalImages
  score -= (1 - modernFormatRatio) * 20
  
  // Title属性评分 (15%)
  const titleRatio = analysis.imagesWithTitle / analysis.totalImages
  score -= (1 - titleRatio) * 15
  
  return Math.max(0, Math.round(score))
}

function generateImageSEORecommendations(analysis) {
  const recommendations = []
  
  if (analysis.imagesWithAlt / analysis.totalImages < 0.8) {
    recommendations.push({
      type: 'critical',
      message: '为所有图片添加描述性的alt属性',
      priority: 'high'
    })
  }
  
  if (analysis.imagesWithOptimizedFilename / analysis.totalImages < 0.5) {
    recommendations.push({
      type: 'optimization',
      message: '优化图片文件名，使用描述性关键词',
      priority: 'medium'
    })
  }
  
  if (analysis.imagesWithModernFormat / analysis.totalImages < 0.3) {
    recommendations.push({
      type: 'performance',
      message: '考虑使用WebP或AVIF等现代图片格式',
      priority: 'medium'
    })
  }
  
  if (analysis.averageFileSize > 500000) { // 500KB
    recommendations.push({
      type: 'performance',
      message: '压缩图片文件大小以提升加载速度',
      priority: 'high'
    })
  }
  
  return recommendations
}

function resolveImageUrl(src, baseUrl) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('//')) return `https:${src}`
  if (src.startsWith('/')) return `${baseUrl}${src}`
  return `${baseUrl}/${src}`
}

function extractImageContext(content, imageIndex) {
  const start = Math.max(0, imageIndex - 100)
  const end = Math.min(content.length, imageIndex + 100)
  return content.substring(start, end)
}

function extractAttributeFromTag(tag, attribute) {
  const regex = new RegExp(`${attribute}=["']([^"']*)["']`, 'i')
  const match = tag.match(regex)
  return match ? match[1] : ''
}

function extractKeywordsFromText(text) {
  if (!text) return []
  
  const words = text.toLowerCase().match(/[\u4e00-\u9fa5]+|\b[a-z]+\b/g) || []
  const stopWords = new Set(['的', '了', '在', 'the', 'a', 'an', 'and', 'or', 'but'])
  
  return words
    .filter(word => word.length >= 2 && !stopWords.has(word))
    .slice(0, 5)
}

function generateThumbnailUrl(imageSrc) {
  // 简单的缩略图URL生成逻辑
  if (imageSrc.includes('?')) {
    return `${imageSrc}&w=300&h=200`
  }
  return `${imageSrc}?w=300&h=200`
}

function getImageMimeType(format) {
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'svg': 'image/svg+xml'
  }
  
  return mimeTypes[format] || 'image/jpeg'
}

/**
 * 图片SEO优化配置
 */
export const IMAGE_SEO_CONFIG = {
  altText: {
    minLength: 10,
    maxLength: 125,
    required: true
  },
  filename: {
    maxLength: 50,
    separator: '-',
    includeKeywords: true
  },
  formats: {
    preferred: ['webp', 'avif'],
    supported: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']
  },
  fileSize: {
    maxSize: 500000, // 500KB
    recommendedSize: 100000 // 100KB
  },
  performance: {
    enableLazyLoading: true,
    enablePreloading: true,
    enableResponsiveImages: true
  },
  seo: {
    enableStructuredData: true,
    enableImageSitemap: true,
    autoGenerateAlt: true
  }
}