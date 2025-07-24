/**
 * 图片代理工具 - 处理Notion图片URL过期问题
 */

/**
 * 检查是否为Notion图片URL
 */
export function isNotionImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  
  try {
    const urlObj = new URL(url)
    const validDomains = [
      'file.notion.so',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ]
    
    return validDomains.some(domain => urlObj.hostname.includes(domain))
  } catch (error) {
    return false
  }
}

/**
 * 检查Notion图片URL是否即将过期
 */
export function isNotionImageExpiring(url, hoursThreshold = 24) {
  if (!isNotionImageUrl(url)) return false
  
  try {
    const urlObj = new URL(url)
    const expirationParam = urlObj.searchParams.get('expirationTimestamp')
    
    if (!expirationParam) return false
    
    const expirationTime = parseInt(expirationParam)
    const currentTime = Date.now()
    const thresholdTime = hoursThreshold * 60 * 60 * 1000 // 转换为毫秒
    
    return (expirationTime - currentTime) < thresholdTime
  } catch (error) {
    return false
  }
}

/**
 * 将Notion图片URL转换为代理URL
 */
export function convertToProxyUrl(originalUrl, baseUrl = '') {
  if (!isNotionImageUrl(originalUrl)) {
    return originalUrl
  }
  
  try {
    // 编码原始URL
    const encodedUrl = encodeURIComponent(originalUrl)
    
    // 构建代理URL
    const proxyUrl = `${baseUrl}/api/image-proxy?url=${encodedUrl}`
    
    return proxyUrl
  } catch (error) {
    console.error('Error converting to proxy URL:', error)
    return originalUrl
  }
}

/**
 * 批量转换图片URL
 */
export function convertImageUrls(content, baseUrl = '') {
  if (!content || typeof content !== 'string') return content
  
  // 匹配图片URL的正则表达式
  const imageUrlRegex = /https:\/\/file\.notion\.so\/[^\s"')]+/g
  
  return content.replace(imageUrlRegex, (match) => {
    return convertToProxyUrl(match, baseUrl)
  })
}

/**
 * 从HTML内容中提取所有Notion图片URL
 */
export function extractNotionImageUrls(content) {
  if (!content || typeof content !== 'string') return []
  
  const urls = []
  const imageUrlRegex = /https:\/\/file\.notion\.so\/[^\s"')]+/g
  let match
  
  while ((match = imageUrlRegex.exec(content)) !== null) {
    urls.push(match[0])
  }
  
  return [...new Set(urls)] // 去重
}

/**
 * 检查图片URL是否可访问
 */
export async function checkImageUrl(url, timeout = 5000) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NotionNext/1.0)'
      }
    })
    
    clearTimeout(timeoutId)
    
    return {
      accessible: response.ok,
      status: response.status,
      statusText: response.statusText
    }
  } catch (error) {
    return {
      accessible: false,
      status: 0,
      statusText: error.message
    }
  }
}

/**
 * 批量检查图片URL可访问性
 */
export async function checkMultipleImageUrls(urls, concurrency = 5) {
  const results = []
  
  // 分批处理，避免同时发起太多请求
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency)
    const batchPromises = batch.map(async (url) => {
      const result = await checkImageUrl(url)
      return { url, ...result }
    })
    
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
  }
  
  return results
}

/**
 * 获取图片的基本信息
 */
export async function getImageInfo(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NotionNext/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      cacheControl: response.headers.get('cache-control')
    }
  } catch (error) {
    throw new Error(`Failed to get image info: ${error.message}`)
  }
}

/**
 * 生成图片的缓存键
 */
export function generateImageCacheKey(url) {
  try {
    const urlObj = new URL(url)
    // 移除时间戳参数，使用文件路径作为缓存键
    const pathParts = urlObj.pathname.split('/')
    const fileId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2]
    return `notion_image_${fileId}`
  } catch (error) {
    // 如果URL解析失败，使用URL的hash作为缓存键
    return `notion_image_${Buffer.from(url).toString('base64').slice(0, 32)}`
  }
}