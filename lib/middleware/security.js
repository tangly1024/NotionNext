import { Validator, Sanitizer, globalRateLimiter } from '@/lib/utils/validation'
import { siteConfig } from '@/lib/config'

/**
 * 安全中间件
 * 提供API安全保护功能
 */

/**
 * 获取客户端IP地址
 * @param {NextApiRequest} req 
 * @returns {string}
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  const realIp = req.headers['x-real-ip']
  const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return remoteAddress || 'unknown'
}

/**
 * 速率限制中间件
 * @param {object} options 配置选项
 * @returns {function}
 */
export function rateLimitMiddleware(options = {}) {
  const {
    limit = 100,
    windowMs = 60000,
    message = 'Too many requests',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options

  return (req, res, next) => {
    const ip = getClientIp(req)
    const identifier = `${ip}:${req.url}`
    
    if (globalRateLimiter.isRateLimited(identifier, limit, windowMs)) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }
    
    // 记录原始的res.json方法
    const originalJson = res.json
    res.json = function(data) {
      const statusCode = res.statusCode
      
      // 根据配置决定是否跳过计数
      if (
        (skipSuccessfulRequests && statusCode < 400) ||
        (skipFailedRequests && statusCode >= 400)
      ) {
        // 从计数中移除这次请求
        const userRequests = globalRateLimiter.requests.get(identifier) || []
        if (userRequests.length > 0) {
          userRequests.pop()
        }
      }
      
      return originalJson.call(this, data)
    }
    
    next()
  }
}

/**
 * 输入验证中间件
 * @param {object} schema 验证模式
 * @returns {function}
 */
export function validateInputMiddleware(schema) {
  return (req, res, next) => {
    const errors = []
    
    // 验证请求体
    if (schema.body) {
      const bodyErrors = validateObject(req.body, schema.body, 'body')
      errors.push(...bodyErrors)
    }
    
    // 验证查询参数
    if (schema.query) {
      const queryErrors = validateObject(req.query, schema.query, 'query')
      errors.push(...queryErrors)
    }
    
    // 验证路径参数
    if (schema.params) {
      const paramsErrors = validateObject(req.params, schema.params, 'params')
      errors.push(...paramsErrors)
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      })
    }
    
    next()
  }
}

/**
 * 验证对象
 * @param {object} obj 要验证的对象
 * @param {object} schema 验证模式
 * @param {string} prefix 错误前缀
 * @returns {array} 错误列表
 */
function validateObject(obj, schema, prefix) {
  const errors = []
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = obj?.[key]
    const fieldPath = `${prefix}.${key}`
    
    // 检查必填字段
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${fieldPath} is required`)
      continue
    }
    
    // 如果字段不存在且不是必填，跳过验证
    if (value === undefined || value === null) {
      continue
    }
    
    // 类型验证
    if (rules.type) {
      if (!validateType(value, rules.type)) {
        errors.push(`${fieldPath} must be of type ${rules.type}`)
        continue
      }
    }
    
    // 长度验证
    if (rules.minLength !== undefined || rules.maxLength !== undefined) {
      if (!Validator.isValidLength(value, rules.minLength, rules.maxLength)) {
        errors.push(`${fieldPath} length must be between ${rules.minLength || 0} and ${rules.maxLength || 'unlimited'}`)
      }
    }
    
    // 数值范围验证
    if (rules.min !== undefined || rules.max !== undefined) {
      if (!Validator.isValidNumber(value, rules.min, rules.max)) {
        errors.push(`${fieldPath} must be between ${rules.min || '-∞'} and ${rules.max || '∞'}`)
      }
    }
    
    // 正则表达式验证
    if (rules.pattern) {
      if (typeof value === 'string' && !rules.pattern.test(value)) {
        errors.push(`${fieldPath} format is invalid`)
      }
    }
    
    // 自定义验证函数
    if (rules.validator) {
      const result = rules.validator(value)
      if (result !== true) {
        errors.push(`${fieldPath}: ${result}`)
      }
    }
    
    // 清理输入
    if (rules.sanitize && typeof value === 'string') {
      obj[key] = Sanitizer.sanitizeXss(value)
    }
  }
  
  return errors
}

/**
 * 验证数据类型
 * @param {any} value 
 * @param {string} type 
 * @returns {boolean}
 */
function validateType(value, type) {
  switch (type) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'array':
      return Array.isArray(value)
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value)
    case 'email':
      return Validator.isValidEmail(value)
    case 'url':
      return Validator.isValidUrl(value)
    case 'slug':
      return Validator.isValidSlug(value)
    case 'notionId':
      return Validator.isValidNotionId(value)
    default:
      return true
  }
}

/**
 * CORS中间件
 * @param {object} options CORS配置
 * @returns {function}
 */
export function corsMiddleware(options = {}) {
  const {
    origin = siteConfig('LINK'),
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    credentials = false,
    maxAge = 86400
  } = options

  return (req, res, next) => {
    // 设置CORS头部
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', methods.join(', '))
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '))
    res.setHeader('Access-Control-Allow-Credentials', credentials.toString())
    res.setHeader('Access-Control-Max-Age', maxAge.toString())
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }
    
    next()
  }
}

/**
 * 安全头部中间件
 * @returns {function}
 */
export function securityHeadersMiddleware() {
  return (req, res, next) => {
    // 设置安全头部
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('X-DNS-Prefetch-Control', 'off')
    res.setHeader('X-Download-Options', 'noopen')
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
    
    // 移除敏感头部
    res.removeHeader('X-Powered-By')
    res.removeHeader('Server')
    
    next()
  }
}

/**
 * 请求日志中间件
 * @returns {function}
 */
export function requestLogMiddleware() {
  return (req, res, next) => {
    const start = Date.now()
    const ip = getClientIp(req)
    const userAgent = req.headers['user-agent'] || 'unknown'
    
    // 记录原始的res.end方法
    const originalEnd = res.end
    res.end = function(...args) {
      const duration = Date.now() - start
      const statusCode = res.statusCode
      
      // 记录请求日志
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${statusCode} ${duration}ms - ${ip} - ${userAgent}`)
      
      // 如果是错误请求，记录更详细的信息
      if (statusCode >= 400) {
        console.error(`[ERROR] ${req.method} ${req.url} - ${statusCode} - IP: ${ip}`)
        if (req.body && Object.keys(req.body).length > 0) {
          console.error('Request body:', JSON.stringify(req.body, null, 2))
        }
      }
      
      return originalEnd.apply(this, args)
    }
    
    next()
  }
}

/**
 * 组合安全中间件
 * @param {object} options 配置选项
 * @returns {function}
 */
export function securityMiddleware(options = {}) {
  const middlewares = []
  
  // 添加各种安全中间件
  if (options.rateLimit !== false) {
    middlewares.push(rateLimitMiddleware(options.rateLimit))
  }
  
  if (options.cors !== false) {
    middlewares.push(corsMiddleware(options.cors))
  }
  
  if (options.securityHeaders !== false) {
    middlewares.push(securityHeadersMiddleware())
  }
  
  if (options.requestLog !== false) {
    middlewares.push(requestLogMiddleware())
  }
  
  // 返回组合中间件
  return (req, res, next) => {
    let index = 0
    
    function runNext() {
      if (index >= middlewares.length) {
        return next()
      }
      
      const middleware = middlewares[index++]
      middleware(req, res, runNext)
    }
    
    runNext()
  }
}

export default {
  rateLimitMiddleware,
  validateInputMiddleware,
  corsMiddleware,
  securityHeadersMiddleware,
  requestLogMiddleware,
  securityMiddleware,
  getClientIp
}
