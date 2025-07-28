/**
 * DirectiveSyntaxValidator - robots.txt指令语法验证器
 * 
 * 专门负责验证robots.txt指令的语法格式，包括：
 * - User-agent、Allow、Disallow等指令的语法格式
 * - 指令参数的有效性和格式规范
 * - 识别无效或不支持的指令
 * - 指令值的格式验证
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { ValidationCheck } from './robotsValidatorModels.js'

/**
 * 指令语法验证器类
 */
export class DirectiveSyntaxValidator {
  constructor(options = {}) {
    this.options = {
      // 严格模式选项
      strictMode: options.strictMode || false,
      allowUnknownDirectives: options.allowUnknownDirectives !== false,
      
      // 指令特定选项
      requireUserAgent: options.requireUserAgent !== false,
      allowEmptyDisallow: options.allowEmptyDisallow !== false,
      validateUrls: options.validateUrls !== false,
      
      ...options
    }
    
    // 指令定义和验证规则
    this.directiveRules = {
      'user-agent': {
        required: true,
        allowEmpty: false,
        pattern: /^[a-zA-Z0-9\-_*+.\/\s]+$/,
        description: '用户代理标识符'
      },
      'disallow': {
        required: false,
        allowEmpty: true,
        pattern: /^[^\s]*$/,
        description: '禁止访问的路径'
      },
      'allow': {
        required: false,
        allowEmpty: false,
        pattern: /^[^\s]*$/,
        description: '允许访问的路径'
      },
      'crawl-delay': {
        required: false,
        allowEmpty: false,
        pattern: /^\d+(\.\d+)?$/,
        description: '爬取延迟（秒）'
      },
      'sitemap': {
        required: false,
        allowEmpty: false,
        pattern: /^https?:\/\/.+/i,
        description: 'Sitemap文件URL'
      },
      'host': {
        required: false,
        allowEmpty: false,
        pattern: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        description: '主机域名'
      },
      'request-rate': {
        required: false,
        allowEmpty: false,
        pattern: /^\d+\/\d+[smh]?$/,
        description: '请求频率限制'
      },
      'visit-time': {
        required: false,
        allowEmpty: false,
        pattern: /^\d{4}-\d{4}$/,
        description: '访问时间窗口'
      }
    }
    
    // 验证结果
    this.checks = []
  }

  /**
   * 执行指令语法验证
   * @param {string} content - 文件内容
   * @param {Object} context - 验证上下文
   * @returns {ValidationCheck[]} 验证检查结果
   */
  async validate(content, context = {}) {
    this.checks = []
    
    try {
      const lines = content.split('\n')
      const directives = this._parseDirectives(lines)
      
      // 1. 验证指令结构
      this._validateDirectiveStructure(directives)
      
      // 2. 验证指令语法
      this._validateDirectiveSyntax(directives)
      
      // 3. 验证指令参数
      this._validateDirectiveParameters(directives)
      
      // 4. 验证指令关系
      this._validateDirectiveRelationships(directives)
      
      // 5. 验证必需指令
      this._validateRequiredDirectives(directives)
      
      return this.checks
      
    } catch (error) {
      this._addCheck(
        'directive-syntax-error',
        '指令语法验证错误',
        'error',
        `指令语法验证过程中发生错误: ${error.message}`,
        null,
        '请检查指令格式和语法',
        'critical'
      )
      
      return this.checks
    }
  }

  /**
   * 解析指令
   * @private
   * @param {string[]} lines - 文件行数组
   * @returns {Object[]} 解析后的指令数组
   */
  _parseDirectives(lines) {
    const directives = []
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1
      const trimmed = line.trim()
      
      // 跳过空行和注释
      if (!trimmed || trimmed.startsWith('#')) {
        return
      }
      
      // 检查是否包含冒号
      if (!trimmed.includes(':')) {
        return
      }
      
      const colonIndex = trimmed.indexOf(':')
      const directive = trimmed.substring(0, colonIndex).trim().toLowerCase()
      const value = trimmed.substring(colonIndex + 1).trim()
      
      directives.push({
        line: lineNumber,
        originalLine: line,
        directive,
        value,
        raw: trimmed
      })
    })
    
    return directives
  }

  /**
   * 验证指令结构
   * @private
   * @param {Object[]} directives - 指令数组
   */
  _validateDirectiveStructure(directives) {
    directives.forEach(({ line, directive, value, raw }) => {
      // 检查指令名称格式
      if (!/^[a-z-]+$/.test(directive)) {
        this._addCheck(
          'invalid-directive-name',
          '指令名称格式检查',
          'error',
          `第${line}行指令名称格式无效: "${directive}"`,
          line,
          '指令名称应只包含小写字母和连字符',
          'high'
        )
      }
      
      // 检查指令是否受支持
      if (!this.directiveRules[directive] && !this.options.allowUnknownDirectives) {
        this._addCheck(
          'unsupported-directive',
          '指令支持检查',
          'error',
          `第${line}行包含不支持的指令: "${directive}"`,
          line,
          `使用支持的指令: ${Object.keys(this.directiveRules).join(', ')}`,
          'high'
        )
      } else if (!this.directiveRules[directive] && this.options.allowUnknownDirectives) {
        this._addCheck(
          'unknown-directive-warning',
          '指令支持检查',
          'warning',
          `第${line}行包含未知指令: "${directive}"`,
          line,
          '确认指令名称拼写正确',
          'medium'
        )
      }
      
      // 检查冒号前后的空格
      const colonIndex = raw.indexOf(':')
      const beforeColon = raw.substring(0, colonIndex)
      const afterColon = raw.substring(colonIndex + 1)
      
      if (beforeColon !== beforeColon.trim()) {
        this._addCheck(
          'directive-name-whitespace',
          '指令格式检查',
          'warning',
          `第${line}行指令名称包含多余空格`,
          line,
          '移除指令名称前后的空格',
          'low'
        )
      }
      
      if (afterColon !== afterColon.trim() && afterColon.trim() !== '') {
        this._addCheck(
          'directive-value-whitespace',
          '指令格式检查',
          'warning',
          `第${line}行指令值包含多余空格`,
          line,
          '移除指令值前后的多余空格',
          'low'
        )
      }
    })
  }

  /**
   * 验证指令语法
   * @private
   * @param {Object[]} directives - 指令数组
   */
  _validateDirectiveSyntax(directives) {
    directives.forEach(({ line, directive, value }) => {
      const rule = this.directiveRules[directive]
      
      if (!rule) {
        return // 未知指令已在结构验证中处理
      }
      
      // 检查空值
      if (!value && !rule.allowEmpty) {
        this._addCheck(
          'empty-directive-value',
          '指令值检查',
          'error',
          `第${line}行指令 "${directive}" 不能为空`,
          line,
          `为 "${directive}" 指令提供有效值`,
          'high'
        )
        return
      }
      
      // 检查值格式
      if (value && rule.pattern && !rule.pattern.test(value)) {
        this._addCheck(
          'invalid-directive-format',
          '指令格式检查',
          'error',
          `第${line}行指令 "${directive}" 的值格式无效: "${value}"`,
          line,
          `${rule.description}格式应符合规范`,
          'high'
        )
      }
    })
  }

  /**
   * 验证指令参数
   * @private
   * @param {Object[]} directives - 指令数组
   */
  _validateDirectiveParameters(directives) {
    directives.forEach(({ line, directive, value }) => {
      switch (directive) {
        case 'user-agent':
          this._validateUserAgentParameter(line, value)
          break
        case 'disallow':
        case 'allow':
          this._validatePathParameter(line, directive, value)
          break
        case 'crawl-delay':
          this._validateCrawlDelayParameter(line, value)
          break
        case 'sitemap':
          this._validateSitemapParameter(line, value)
          break
        case 'host':
          this._validateHostParameter(line, value)
          break
        case 'request-rate':
          this._validateRequestRateParameter(line, value)
          break
        case 'visit-time':
          this._validateVisitTimeParameter(line, value)
          break
      }
    })
  }

  /**
   * 验证User-agent参数
   * @private
   * @param {number} line - 行号
   * @param {string} value - 参数值
   */
  _validateUserAgentParameter(line, value) {
    if (!value) return
    
    // 检查通配符使用
    if (value === '*') {
      this._addCheck(
        'user-agent-wildcard',
        'User-agent参数检查',
        'pass',
        `第${line}行使用通配符User-agent`,
        line,
        null,
        'low'
      )
    } else {
      // 检查常见的User-agent名称
      const commonBots = [
        'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
        'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot'
      ]
      
      const lowerValue = value.toLowerCase()
      const isCommonBot = commonBots.some(bot => lowerValue.includes(bot))
      
      if (isCommonBot) {
        this._addCheck(
          'known-user-agent',
          'User-agent参数检查',
          'pass',
          `第${line}行使用已知的User-agent: ${value}`,
          line,
          null,
          'low'
        )
      } else {
        this._addCheck(
          'custom-user-agent',
          'User-agent参数检查',
          'info',
          `第${line}行使用自定义User-agent: ${value}`,
          line,
          '确认User-agent名称正确',
          'low'
        )
      }
    }
    
    // 检查特殊字符
    if (/[<>\"'&]/.test(value)) {
      this._addCheck(
        'user-agent-special-chars',
        'User-agent参数检查',
        'warning',
        `第${line}行User-agent包含特殊字符`,
        line,
        '避免在User-agent中使用特殊字符',
        'medium'
      )
    }
  }

  /**
   * 验证路径参数
   * @private
   * @param {number} line - 行号
   * @param {string} directive - 指令名称
   * @param {string} value - 参数值
   */
  _validatePathParameter(line, directive, value) {
    // Disallow可以为空，Allow不能为空
    if (!value && directive === 'allow') {
      this._addCheck(
        'empty-allow-path',
        '路径参数检查',
        'error',
        `第${line}行Allow指令不能为空`,
        line,
        '为Allow指令提供有效路径',
        'high'
      )
      return
    }
    
    if (!value) return // 空的Disallow是允许的
    
    // 检查路径格式
    if (!value.startsWith('/')) {
      this._addCheck(
        'invalid-path-format',
        '路径参数检查',
        'error',
        `第${line}行路径应以"/"开头: ${value}`,
        line,
        '路径应以"/"开头',
        'high'
      )
    }
    
    // 检查通配符使用
    if (value.includes('*')) {
      const wildcardPattern = /\*+/g
      const wildcards = value.match(wildcardPattern)
      
      if (wildcards && wildcards.some(w => w.length > 1)) {
        this._addCheck(
          'multiple-wildcards',
          '路径参数检查',
          'warning',
          `第${line}行路径包含多个连续通配符`,
          line,
          '使用单个通配符"*"',
          'medium'
        )
      }
    }
    
    // 检查URL编码
    if (/%[0-9A-Fa-f]{2}/.test(value)) {
      this._addCheck(
        'url-encoded-path',
        '路径参数检查',
        'info',
        `第${line}行路径包含URL编码字符`,
        line,
        '确认URL编码是必需的',
        'low'
      )
    }
    
    // 检查特殊字符
    if (/[<>\"']/.test(value)) {
      this._addCheck(
        'path-special-chars',
        '路径参数检查',
        'warning',
        `第${line}行路径包含特殊字符`,
        line,
        '避免在路径中使用特殊字符',
        'medium'
      )
    }
  }

  /**
   * 验证Crawl-delay参数
   * @private
   * @param {number} line - 行号
   * @param {string} value - 参数值
   */
  _validateCrawlDelayParameter(line, value) {
    if (!value) return
    
    const delay = parseFloat(value)
    
    if (isNaN(delay)) {
      this._addCheck(
        'invalid-crawl-delay',
        'Crawl-delay参数检查',
        'error',
        `第${line}行Crawl-delay值无效: ${value}`,
        line,
        'Crawl-delay应为数字（秒）',
        'high'
      )
      return
    }
    
    if (delay < 0) {
      this._addCheck(
        'negative-crawl-delay',
        'Crawl-delay参数检查',
        'error',
        `第${line}行Crawl-delay不能为负数: ${value}`,
        line,
        'Crawl-delay应为正数',
        'high'
      )
    } else if (delay > 86400) { // 24小时
      this._addCheck(
        'excessive-crawl-delay',
        'Crawl-delay参数检查',
        'warning',
        `第${line}行Crawl-delay过长: ${value}秒`,
        line,
        '考虑使用更合理的延迟时间',
        'medium'
      )
    } else if (delay > 0) {
      this._addCheck(
        'valid-crawl-delay',
        'Crawl-delay参数检查',
        'pass',
        `第${line}行Crawl-delay设置合理: ${value}秒`,
        line,
        null,
        'low'
      )
    }
  }

  /**
   * 验证Sitemap参数
   * @private
   * @param {number} line - 行号
   * @param {string} value - 参数值
   */
  _validateSitemapParameter(line, value) {
    if (!value) return
    
    // 检查协议
    if (!value.match(/^https?:\/\//i)) {
      this._addCheck(
        'invalid-sitemap-protocol',
        'Sitemap参数检查',
        'error',
        `第${line}行Sitemap URL缺少协议: ${value}`,
        line,
        'Sitemap URL应以http://或https://开头',
        'high'
      )
      return
    }
    
    // 推荐使用HTTPS
    if (value.startsWith('http://')) {
      this._addCheck(
        'sitemap-http-protocol',
        'Sitemap参数检查',
        'warning',
        `第${line}行建议Sitemap使用HTTPS协议`,
        line,
        '使用HTTPS协议提高安全性',
        'medium'
      )
    }
    
    // 检查文件扩展名
    if (!value.match(/\.(xml|txt|gz)(\?.*)?$/i)) {
      this._addCheck(
        'sitemap-extension',
        'Sitemap参数检查',
        'warning',
        `第${line}行Sitemap文件扩展名可能不正确`,
        line,
        'Sitemap文件通常使用.xml、.txt或.gz扩展名',
        'medium'
      )
    }
  }

  /**
   * 验证Host参数
   * @private
   * @param {number} line - 行号
   * @param {string} value - 参数值
   */
  _validateHostParameter(line, value) {
    if (!value) return
    
    // 检查是否包含协议
    if (value.match(/^https?:\/\//i)) {
      this._addCheck(
        'host-with-protocol',
        'Host参数检查',
        'error',
        `第${line}行Host不应包含协议: ${value}`,
        line,
        'Host应只包含域名，不包含http://或https://',
        'high'
      )
      return
    }
    
    // 检查域名格式
    const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    if (!domainPattern.test(value)) {
      this._addCheck(
        'invalid-host-format',
        'Host参数检查',
        'error',
        `第${line}行Host域名格式无效: ${value}`,
        line,
        '提供有效的域名格式',
        'high'
      )
    } else {
      this._addCheck(
        'valid-host-format',
        'Host参数检查',
        'pass',
        `第${line}行Host域名格式正确: ${value}`,
        line,
        null,
        'low'
      )
    }
  }

  /**
   * 验证Request-rate参数
   * @private
   * @param {number} line - 行号
   * @param {string} value - 参数值
   */
  _validateRequestRateParameter(line, value) {
    if (!value) return
    
    const ratePattern = /^(\d+)\/(\d+)([smh]?)$/
    const match = value.match(ratePattern)
    
    if (!match) {
      this._addCheck(
        'invalid-request-rate',
        'Request-rate参数检查',
        'error',
        `第${line}行Request-rate格式无效: ${value}`,
        line,
        'Request-rate格式应为"请求数/时间单位"，如"1/10s"',
        'high'
      )
      return
    }
    
    const [, requests, time, unit] = match
    const requestCount = parseInt(requests)
    const timeValue = parseInt(time)
    
    if (requestCount <= 0 || timeValue <= 0) {
      this._addCheck(
        'invalid-request-rate-values',
        'Request-rate参数检查',
        'error',
        `第${line}行Request-rate值无效: ${value}`,
        line,
        '请求数和时间值应为正整数',
        'high'
      )
    }
  }

  /**
   * 验证Visit-time参数
   * @private
   * @param {number} line - 行号
   * @param {string} value - 参数值
   */
  _validateVisitTimeParameter(line, value) {
    if (!value) return
    
    const timePattern = /^(\d{4})-(\d{4})$/
    const match = value.match(timePattern)
    
    if (!match) {
      this._addCheck(
        'invalid-visit-time',
        'Visit-time参数检查',
        'error',
        `第${line}行Visit-time格式无效: ${value}`,
        line,
        'Visit-time格式应为"HHMM-HHMM"，如"0900-1700"',
        'high'
      )
      return
    }
    
    const [, startTime, endTime] = match
    const startHour = parseInt(startTime.substring(0, 2))
    const startMin = parseInt(startTime.substring(2, 4))
    const endHour = parseInt(endTime.substring(0, 2))
    const endMin = parseInt(endTime.substring(2, 4))
    
    // 验证时间格式
    if (startHour >= 24 || startMin >= 60 || endHour >= 24 || endMin >= 60) {
      this._addCheck(
        'invalid-visit-time-values',
        'Visit-time参数检查',
        'error',
        `第${line}行Visit-time时间值无效: ${value}`,
        line,
        '时间格式应为有效的24小时制时间',
        'high'
      )
    }
  }

  /**
   * 验证指令关系
   * @private
   * @param {Object[]} directives - 指令数组
   */
  _validateDirectiveRelationships(directives) {
    const userAgents = directives.filter(d => d.directive === 'user-agent')
    const rules = directives.filter(d => ['allow', 'disallow'].includes(d.directive))
    
    // 检查是否有孤立的规则（没有对应的User-agent）
    if (rules.length > 0 && userAgents.length === 0) {
      this._addCheck(
        'orphaned-rules',
        '指令关系检查',
        'error',
        '发现Allow/Disallow规则但没有User-agent指令',
        null,
        '在Allow/Disallow规则前添加User-agent指令',
        'high'
      )
    }
    
    // 检查重复的Host声明
    const hosts = directives.filter(d => d.directive === 'host')
    if (hosts.length > 1) {
      this._addCheck(
        'multiple-host-declarations',
        '指令关系检查',
        'warning',
        `发现${hosts.length}个Host声明`,
        null,
        '只应有一个Host声明',
        'medium'
      )
    }
  }

  /**
   * 验证必需指令
   * @private
   * @param {Object[]} directives - 指令数组
   */
  _validateRequiredDirectives(directives) {
    if (this.options.requireUserAgent) {
      const hasUserAgent = directives.some(d => d.directive === 'user-agent')
      
      if (!hasUserAgent) {
        this._addCheck(
          'missing-user-agent',
          '必需指令检查',
          'error',
          '缺少User-agent指令',
          null,
          '添加至少一个User-agent指令',
          'high'
        )
      } else {
        this._addCheck(
          'has-user-agent',
          '必需指令检查',
          'pass',
          '找到User-agent指令',
          null,
          null,
          'low'
        )
      }
    }
  }

  /**
   * 添加验证检查
   * @private
   * @param {string} id - 检查ID
   * @param {string} name - 检查名称
   * @param {string} status - 状态
   * @param {string} message - 消息
   * @param {number|null} line - 行号
   * @param {string|null} suggestion - 建议
   * @param {string} severity - 严重程度
   */
  _addCheck(id, name, status, message, line = null, suggestion = null, severity = 'medium') {
    this.checks.push(new ValidationCheck(id, name, status, message, line, suggestion, severity))
  }

  /**
   * 获取指令规则
   * @returns {Object} 指令规则对象
   */
  getDirectiveRules() {
    return { ...this.directiveRules }
  }

  /**
   * 检查指令是否有效
   * @param {string} directive - 指令名称
   * @returns {boolean} 是否有效
   */
  isValidDirective(directive) {
    return this.directiveRules.hasOwnProperty(directive.toLowerCase())
  }
}

export default DirectiveSyntaxValidator