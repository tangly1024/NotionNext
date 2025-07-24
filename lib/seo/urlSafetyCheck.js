/**
 * URL安全检查工具
 * 用于确保所有URL格式正确
 */

/**
 * 检查并修复URL格式
 * @param {string} url - 输入URL
 * @param {string} baseUrl - 基础URL
 * @returns {string} - 修复后的URL
 */
export function safeCheckUrl(url, baseUrl) {
  if (!url) return baseUrl || 'https://example.com'
  
  try {
    // 检查是否有路径和域名颠倒的问题
    if (url.includes('/http')) {
      const matches = url.match(/^(.*?)\/(https?:\/\/.*?)$/)
      if (matches && matches.length >= 3) {
        const path = matches[1]
        const domain = matches[2]
        return `${domain}/${path}`
      }
    }
    
    // 检查是否是有效的URL
    try {
      new URL(url)
      return url
    } catch (e) {
      // 如果不是有效的URL，尝试添加baseUrl
      if (baseUrl) {
        const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
        const normalizedPath = url.startsWith('/') ? url : `/${url}`
        return `${normalizedBaseUrl}${normalizedPath}`
      }
    }
    
    return url
  } catch (error) {
    console.error('[URL安全检查失败]', error)
    return baseUrl || 'https://example.com'
  }
}

/**
 * 强制修复已知的URL格式问题
 * @param {string} url - 输入URL
 * @returns {string} - 修复后的URL
 */
export function forceFixUrl(url) {
  if (!url) return url
  
  // 修复article/example-6/http://www.shareking.vip格式
  if (url.includes('/http')) {
    const pattern = /^(.*?)\/(https?:\/\/.*?)$/
    if (pattern.test(url)) {
      const matches = url.match(pattern)
      if (matches && matches.length >= 3) {
        const path = matches[1]
        const domain = matches[2]
        return `${domain}/${path}`
      }
    }
  }
  
  return url
}