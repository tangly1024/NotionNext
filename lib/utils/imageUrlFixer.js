/**
 * 图片URL修复工具
 * 用于批量检查和修复Notion图片链接
 */

import { 
  isNotionImageUrl, 
  convertToProxyUrl, 
  extractNotionImageUrls,
  checkImageUrl,
  checkMultipleImageUrls,
  isNotionImageExpiring
} from './imageProxy'

/**
 * 扫描页面内容中的所有图片URL
 */
export async function scanPageImages(content, baseUrl = '') {
  if (!content || typeof content !== 'string') {
    return {
      totalImages: 0,
      notionImages: 0,
      expiringImages: 0,
      brokenImages: 0,
      images: []
    }
  }

  // 提取所有图片URL
  const allImageUrls = extractAllImageUrls(content)
  const notionImageUrls = extractNotionImageUrls(content)
  
  // 检查图片可访问性
  const imageResults = await checkMultipleImageUrls(allImageUrls, 3)
  
  // 分析结果
  const images = imageResults.map(result => ({
    url: result.url,
    isNotion: isNotionImageUrl(result.url),
    isExpiring: isNotionImageUrl(result.url) ? isNotionImageExpiring(result.url, 48) : false,
    isAccessible: result.accessible,
    status: result.status,
    statusText: result.statusText,
    proxyUrl: isNotionImageUrl(result.url) ? convertToProxyUrl(result.url) : null,
    needsProxy: isNotionImageUrl(result.url) && (isNotionImageExpiring(result.url, 48) || !result.accessible)
  }))

  const stats = {
    totalImages: allImageUrls.length,
    notionImages: notionImageUrls.length,
    expiringImages: images.filter(img => img.isExpiring).length,
    brokenImages: images.filter(img => !img.isAccessible).length,
    needsProxyImages: images.filter(img => img.needsProxy).length,
    images
  }

  return stats
}

/**
 * 修复页面内容中的图片URL
 */
export function fixPageImageUrls(content, baseUrl = '', options = {}) {
  const {
    forceProxy = false, // 是否强制使用代理
    onlyExpiring = true, // 是否只修复即将过期的图片
    preserveOriginal = true // 是否保留原始URL作为备注
  } = options

  if (!content || typeof content !== 'string') {
    return {
      content,
      changes: 0,
      replacements: []
    }
  }

  let modifiedContent = content
  const replacements = []
  let changes = 0

  // 提取所有Notion图片URL
  const notionUrls = extractNotionImageUrls(content)

  for (const originalUrl of notionUrls) {
    const shouldReplace = forceProxy || 
      (onlyExpiring && isNotionImageExpiring(originalUrl, 48)) ||
      (!onlyExpiring)

    if (shouldReplace) {
      const proxyUrl = convertToProxyUrl(originalUrl)
      
      // 替换URL
      modifiedContent = modifiedContent.replace(
        new RegExp(escapeRegExp(originalUrl), 'g'),
        proxyUrl
      )

      replacements.push({
        original: originalUrl,
        proxy: proxyUrl,
        isExpiring: isNotionImageExpiring(originalUrl, 48)
      })

      changes++
    }
  }

  return {
    content: modifiedContent,
    changes,
    replacements
  }
}

/**
 * 生成图片修复报告
 */
export async function generateImageReport(content, baseUrl = '') {
  const scanResult = await scanPageImages(content, baseUrl)
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalImages: scanResult.totalImages,
      notionImages: scanResult.notionImages,
      healthyImages: scanResult.images.filter(img => img.isAccessible && !img.isExpiring).length,
      expiringImages: scanResult.expiringImages,
      brokenImages: scanResult.brokenImages,
      needsProxyImages: scanResult.needsProxyImages
    },
    details: {
      healthyImages: scanResult.images.filter(img => img.isAccessible && !img.isExpiring),
      expiringImages: scanResult.images.filter(img => img.isExpiring),
      brokenImages: scanResult.images.filter(img => !img.isAccessible),
      needsProxyImages: scanResult.images.filter(img => img.needsProxy)
    },
    recommendations: generateRecommendations(scanResult)
  }

  return report
}

/**
 * 生成修复建议
 */
function generateRecommendations(scanResult) {
  const recommendations = []

  if (scanResult.expiringImages > 0) {
    recommendations.push({
      type: 'warning',
      title: '图片链接即将过期',
      description: `发现 ${scanResult.expiringImages} 个即将过期的Notion图片链接`,
      action: '建议使用图片代理或重新获取图片链接',
      priority: 'high'
    })
  }

  if (scanResult.brokenImages > 0) {
    recommendations.push({
      type: 'error',
      title: '图片链接已失效',
      description: `发现 ${scanResult.brokenImages} 个无法访问的图片链接`,
      action: '需要立即修复或替换这些图片',
      priority: 'critical'
    })
  }

  if (scanResult.notionImages > 0 && scanResult.expiringImages === 0 && scanResult.brokenImages === 0) {
    recommendations.push({
      type: 'info',
      title: '图片链接状态良好',
      description: `所有 ${scanResult.notionImages} 个Notion图片链接当前都可正常访问`,
      action: '建议定期检查图片链接状态',
      priority: 'low'
    })
  }

  if (scanResult.needsProxyImages > 0) {
    recommendations.push({
      type: 'suggestion',
      title: '建议使用图片代理',
      description: `${scanResult.needsProxyImages} 个图片建议使用代理以提高稳定性`,
      action: '可以批量转换为代理URL',
      priority: 'medium'
    })
  }

  return recommendations
}

/**
 * 批量修复多个页面的图片URL
 */
export async function batchFixImageUrls(pages, baseUrl = '', options = {}) {
  const results = []
  
  for (const page of pages) {
    try {
      const fixResult = fixPageImageUrls(page.content, baseUrl, options)
      
      results.push({
        pageId: page.id || page.url || 'unknown',
        pageName: page.name || page.title || 'Untitled',
        success: true,
        changes: fixResult.changes,
        replacements: fixResult.replacements,
        newContent: fixResult.content
      })
    } catch (error) {
      results.push({
        pageId: page.id || page.url || 'unknown',
        pageName: page.name || page.title || 'Untitled',
        success: false,
        error: error.message,
        changes: 0,
        replacements: []
      })
    }
  }

  const summary = {
    totalPages: pages.length,
    successfulPages: results.filter(r => r.success).length,
    failedPages: results.filter(r => !r.success).length,
    totalChanges: results.reduce((sum, r) => sum + r.changes, 0),
    totalReplacements: results.reduce((sum, r) => sum + r.replacements.length, 0)
  }

  return {
    summary,
    results
  }
}

/**
 * 创建图片URL监控任务
 */
export function createImageMonitoringTask(urls, options = {}) {
  const {
    checkInterval = 24 * 60 * 60 * 1000, // 24小时
    expirationThreshold = 48, // 48小时
    onExpiringDetected,
    onBrokenDetected
  } = options

  let intervalId = null

  const checkImages = async () => {
    try {
      const results = await checkMultipleImageUrls(urls)
      
      const expiringImages = results.filter(result => 
        isNotionImageUrl(result.url) && 
        isNotionImageExpiring(result.url, expirationThreshold)
      )

      const brokenImages = results.filter(result => !result.accessible)

      if (expiringImages.length > 0 && onExpiringDetected) {
        onExpiringDetected(expiringImages)
      }

      if (brokenImages.length > 0 && onBrokenDetected) {
        onBrokenDetected(brokenImages)
      }

      return {
        timestamp: new Date().toISOString(),
        totalChecked: results.length,
        expiringCount: expiringImages.length,
        brokenCount: brokenImages.length,
        expiringImages,
        brokenImages
      }
    } catch (error) {
      console.error('Image monitoring task failed:', error)
      return null
    }
  }

  const start = () => {
    if (intervalId) return // 已经在运行

    // 立即执行一次检查
    checkImages()

    // 设置定期检查
    intervalId = setInterval(checkImages, checkInterval)
  }

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const checkNow = () => {
    return checkImages()
  }

  return {
    start,
    stop,
    checkNow,
    isRunning: () => intervalId !== null
  }
}

// 辅助函数

/**
 * 提取所有图片URL（不仅仅是Notion）
 */
function extractAllImageUrls(content) {
  const urls = []
  
  // 匹配img标签中的src
  const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  let match
  while ((match = imgTagRegex.exec(content)) !== null) {
    urls.push(match[1])
  }

  // 匹配Markdown格式的图片
  const markdownImgRegex = /!\[[^\]]*\]\(([^)]+)\)/g
  while ((match = markdownImgRegex.exec(content)) !== null) {
    urls.push(match[1])
  }

  // 匹配直接的HTTP图片链接
  const directUrlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)/gi
  while ((match = directUrlRegex.exec(content)) !== null) {
    urls.push(match[0])
  }

  return [...new Set(urls)] // 去重
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}