/**
 * 输入验证工具类
 * 提供各种数据验证和清理功能
 */

// 常用正则表达式
const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  notionId: /^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/i,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  phoneNumber: /^[\+]?[1-9][\d]{0,15}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}

// XSS 防护
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi
]

/**
 * 验证器类
 */
export class Validator {
  /**
   * 验证邮箱地址
   * @param {string} email 
   * @returns {boolean}
   */
  static isValidEmail(email) {
    if (!email || typeof email !== 'string') return false
    return REGEX_PATTERNS.email.test(email.trim())
  }

  /**
   * 验证URL
   * @param {string} url 
   * @returns {boolean}
   */
  static isValidUrl(url) {
    if (!url || typeof url !== 'string') return false
    return REGEX_PATTERNS.url.test(url.trim())
  }

  /**
   * 验证Slug（URL友好的字符串）
   * @param {string} slug 
   * @returns {boolean}
   */
  static isValidSlug(slug) {
    if (!slug || typeof slug !== 'string') return false
    return REGEX_PATTERNS.slug.test(slug.trim())
  }

  /**
   * 验证Notion ID
   * @param {string} id 
   * @returns {boolean}
   */
  static isValidNotionId(id) {
    if (!id || typeof id !== 'string') return false
    return REGEX_PATTERNS.notionId.test(id.trim())
  }

  /**
   * 验证十六进制颜色值
   * @param {string} color 
   * @returns {boolean}
   */
  static isValidHexColor(color) {
    if (!color || typeof color !== 'string') return false
    return REGEX_PATTERNS.hexColor.test(color.trim())
  }

  /**
   * 验证IP地址
   * @param {string} ip 
   * @returns {boolean}
   */
  static isValidIpAddress(ip) {
    if (!ip || typeof ip !== 'string') return false
    return REGEX_PATTERNS.ipAddress.test(ip.trim())
  }

  /**
   * 验证用户名
   * @param {string} username 
   * @returns {boolean}
   */
  static isValidUsername(username) {
    if (!username || typeof username !== 'string') return false
    return REGEX_PATTERNS.username.test(username.trim())
  }

  /**
   * 验证密码强度
   * @param {string} password 
   * @returns {boolean}
   */
  static isValidPassword(password) {
    if (!password || typeof password !== 'string') return false
    return REGEX_PATTERNS.password.test(password)
  }

  /**
   * 验证字符串长度
   * @param {string} str 
   * @param {number} min 
   * @param {number} max 
   * @returns {boolean}
   */
  static isValidLength(str, min = 0, max = Infinity) {
    if (typeof str !== 'string') return false
    const length = str.trim().length
    return length >= min && length <= max
  }

  /**
   * 验证数字范围
   * @param {number} num 
   * @param {number} min 
   * @param {number} max 
   * @returns {boolean}
   */
  static isValidNumber(num, min = -Infinity, max = Infinity) {
    if (typeof num !== 'number' || isNaN(num)) return false
    return num >= min && num <= max
  }

  /**
   * 验证数组
   * @param {any} arr 
   * @param {number} minLength 
   * @param {number} maxLength 
   * @returns {boolean}
   */
  static isValidArray(arr, minLength = 0, maxLength = Infinity) {
    if (!Array.isArray(arr)) return false
    return arr.length >= minLength && arr.length <= maxLength
  }
}

/**
 * 数据清理器类
 */
export class Sanitizer {
  /**
   * 清理HTML标签
   * @param {string} str 
   * @returns {string}
   */
  static stripHtml(str) {
    if (!str || typeof str !== 'string') return ''
    return str.replace(/<[^>]*>/g, '')
  }

  /**
   * 防XSS清理
   * @param {string} str 
   * @returns {string}
   */
  static sanitizeXss(str) {
    if (!str || typeof str !== 'string') return ''
    
    let cleaned = str
    XSS_PATTERNS.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '')
    })
    
    return cleaned
  }

  /**
   * 清理SQL注入
   * @param {string} str 
   * @returns {string}
   */
  static sanitizeSql(str) {
    if (!str || typeof str !== 'string') return ''
    
    // 移除常见的SQL注入模式
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(--|\/\*|\*\/|;|'|"|`)/g,
      /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/gi
    ]
    
    let cleaned = str
    sqlPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '')
    })
    
    return cleaned.trim()
  }

  /**
   * 清理文件名
   * @param {string} filename 
   * @returns {string}
   */
  static sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') return ''
    
    return filename
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // 移除非法字符
      .replace(/^\.+/, '') // 移除开头的点
      .replace(/\.+$/, '') // 移除结尾的点
      .replace(/\s+/g, '_') // 空格替换为下划线
      .substring(0, 255) // 限制长度
  }

  /**
   * 清理URL
   * @param {string} url 
   * @returns {string}
   */
  static sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return ''
    
    // 只允许http和https协议
    if (!url.match(/^https?:\/\//)) {
      return ''
    }
    
    try {
      const urlObj = new URL(url)
      return urlObj.toString()
    } catch {
      return ''
    }
  }

  /**
   * 转义HTML实体
   * @param {string} str 
   * @returns {string}
   */
  static escapeHtml(str) {
    if (!str || typeof str !== 'string') return ''
    
    const htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    }
    
    return str.replace(/[&<>"'/]/g, char => htmlEntities[char])
  }

  /**
   * 清理并验证JSON
   * @param {string} jsonStr 
   * @returns {object|null}
   */
  static sanitizeJson(jsonStr) {
    if (!jsonStr || typeof jsonStr !== 'string') return null
    
    try {
      const parsed = JSON.parse(jsonStr)
      // 递归清理对象中的字符串值
      return this.deepSanitizeObject(parsed)
    } catch {
      return null
    }
  }

  /**
   * 深度清理对象
   * @param {any} obj 
   * @returns {any}
   */
  static deepSanitizeObject(obj) {
    if (typeof obj === 'string') {
      return this.sanitizeXss(obj)
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.deepSanitizeObject(item))
    } else if (obj && typeof obj === 'object') {
      const cleaned = {}
      for (const [key, value] of Object.entries(obj)) {
        const cleanKey = this.sanitizeXss(key)
        cleaned[cleanKey] = this.deepSanitizeObject(value)
      }
      return cleaned
    }
    return obj
  }
}

/**
 * 速率限制器
 */
export class RateLimiter {
  constructor() {
    this.requests = new Map()
  }

  /**
   * 检查是否超过速率限制
   * @param {string} identifier 标识符（IP、用户ID等）
   * @param {number} limit 限制次数
   * @param {number} windowMs 时间窗口（毫秒）
   * @returns {boolean}
   */
  isRateLimited(identifier, limit = 100, windowMs = 60000) {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [])
    }
    
    const userRequests = this.requests.get(identifier)
    
    // 清理过期的请求记录
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart)
    this.requests.set(identifier, validRequests)
    
    // 检查是否超过限制
    if (validRequests.length >= limit) {
      return true
    }
    
    // 记录当前请求
    validRequests.push(now)
    return false
  }

  /**
   * 清理过期的记录
   */
  cleanup() {
    const now = Date.now()
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > now - 3600000) // 1小时
      if (validRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, validRequests)
      }
    }
  }
}

// 创建全局速率限制器实例
export const globalRateLimiter = new RateLimiter()

// 定期清理过期记录
if (typeof window === 'undefined') { // 只在服务端运行
  setInterval(() => {
    globalRateLimiter.cleanup()
  }, 300000) // 5分钟清理一次
}

export default { Validator, Sanitizer, RateLimiter, globalRateLimiter }
