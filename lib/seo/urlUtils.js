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
  // 修复多个斜杠问题
  let fixedUrl = url.replace(/([^:]\/)\/+/g, '$1')
  
  // 修复协议后的单斜杠问题
  fixedUrl = fixedUrl.replace(/^(https?:\/)[^\/]/i, '$1/$2')
  
  // 修复域名和路径顺序颠倒的问题
  const urlPattern = /^(.*?)\/(https?:\/\/.*?)$/i
  if (urlPattern.test(fixedUrl)) {
    const matches = fixedUrl.match(urlPattern)
    if (matches && matches.length >= 3) {
      fixedUrl = `${matches[2]}/${matches[1]}`
    }
  }
  
  return fixedUrl
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
  
  // 拼接并返回完整URL
  const canonicalUrl = `${normalizedBaseUrl}${normalizedPath}`
  
  // 最后验证并修复URL格式
  return fixUrlFormat(canonicalUrl)
}