/**
 * SEO URL工具函数
 * 用于处理和验证URL格式
 */

/**
 * 确保URL是绝对URL
 * @param {string} url - 输入URL
 * @param {string} baseUrl - 基础URL
 * @returns {string} - 格式化后的绝对URL
 */
export function ensureAbsoluteUrl(url, baseUrl) {
  // 如果URL已经是绝对URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 规范化baseUrl（移除尾部斜杠）
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  
  // 规范化路径（确保有前导斜杠）
  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  
  // 拼接完整URL
  return `${normalizedBaseUrl}${normalizedPath}`
}

/**
 * 验证URL格式是否正确
 * @param {string} url - 要验证的URL
 * @returns {boolean} - URL是否有效
 */
export function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 修复URL中的常见问题
 * @param {string} url - 输入URL
 * @returns {string} - 修复后的URL
 */
export function fixUrlFormat(url) {
  if (!url) return url
  
  // 记录原始URL用于调试
  const originalUrl = url
  let fixedUrl = url
  
  try {
    // 检查是否有路径和域名颠倒的问题
    const pathDomainReversedPattern = /^(.*?)\/(https?:\/\/.*?)$/i
    if (pathDomainReversedPattern.test(fixedUrl)) {
      const matches = fixedUrl.match(pathDomainReversedPattern)
      if (matches && matches.length >= 3) {
        const path = matches[1]
        const domain = matches[2]
        fixedUrl = `${domain}/${path}`
        console.log(`[URL修复] 域名路径颠倒: ${originalUrl} -> ${fixedUrl}`)
      }
    }
    
    // 修复多个斜杠问题
    const multipleSlashPattern = /([^:]\/)\/+/g
    if (multipleSlashPattern.test(fixedUrl)) {
      fixedUrl = fixedUrl.replace(multipleSlashPattern, '$1')
      console.log(`[URL修复] 多余斜杠: ${originalUrl} -> ${fixedUrl}`)
    }
    
    // 修复协议后的单斜杠问题
    const protocolSlashPattern = /^(https?:\/)[^\/]/i
    if (protocolSlashPattern.test(fixedUrl)) {
      fixedUrl = fixedUrl.replace(protocolSlashPattern, '$1/$2')
      console.log(`[URL修复] 协议斜杠: ${originalUrl} -> ${fixedUrl}`)
    }
    
    // 确保URL格式正确
    try {
      new URL(fixedUrl)
    } catch (e) {
      // 如果URL无效，尝试添加协议
      if (!fixedUrl.startsWith('http')) {
        fixedUrl = 'https://' + fixedUrl
        console.log(`[URL修复] 添加协议: ${originalUrl} -> ${fixedUrl}`)
      }
    }
    
    return fixedUrl
  } catch (error) {
    console.error(`[URL修复失败] ${originalUrl}`, error)
    return originalUrl
  }
}

/**
 * 生成规范的canonical URL
 * @param {string} path - 页面路径
 * @param {string} baseUrl - 网站基础URL
 * @returns {string} - 规范的canonical URL
 */
export function generateCanonicalUrl(path, baseUrl) {
  // 移除查询参数
  const cleanPath = path.split('?')[0]
  
  // 确保baseUrl不包含尾部斜杠
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  
  // 确保路径包含前导斜杠
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  
  // 检查是否有URL颠倒的问题（路径中包含http://或https://）
  if (normalizedPath.includes('http://') || normalizedPath.includes('https://')) {
    // 提取域名和路径
    const urlMatch = normalizedPath.match(/^\/?(.*?)\/(https?:\/\/.*?)$/)
    if (urlMatch && urlMatch.length >= 3) {
      const actualPath = urlMatch[1]
      const actualDomain = urlMatch[2]
      
      // 如果域名与baseUrl匹配，则使用正确的顺序
      if (actualDomain.includes(baseUrl.replace(/^https?:\/\//, ''))) {
        return `${actualDomain}/${actualPath}`
      }
    }
  }
  
  // 拼接并返回完整URL
  const canonicalUrl = `${normalizedBaseUrl}${normalizedPath}`
  
  // 最后验证并修复URL格式
  return fixUrlFormat(canonicalUrl)
}