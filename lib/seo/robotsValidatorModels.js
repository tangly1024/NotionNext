/**
 * RobotsValidator 数据模型类
 * 
 * 定义验证结果的数据结构，包括验证结果、验证类别、验证检查和建议等。
 * 
 * @author NotionNext
 * @version 1.0.0
 */

/**
 * 验证结果主类
 */
export class ValidationResult {
  constructor() {
    this.isValid = false
    this.score = 0
    this.summary = {
      totalChecks: 0,
      passed: 0,
      warnings: 0,
      errors: 0
    }
    this.categories = {}
    this.recommendations = []
    this.metadata = {
      fileSize: 0,
      userAgents: 0,
      sitemaps: 0,
      validatedAt: null
    }
  }

  /**
   * 添加建议
   * @param {Recommendation} recommendation - 建议对象
   */
  addRecommendation(recommendation) {
    this.recommendations.push(recommendation)
  }

  /**
   * 获取所有错误
   * @returns {ValidationCheck[]} 错误检查列表
   */
  getErrors() {
    const errors = []
    Object.values(this.categories).forEach(category => {
      errors.push(...category.checks.filter(check => check.status === 'error'))
    })
    return errors
  }

  /**
   * 获取所有警告
   * @returns {ValidationCheck[]} 警告检查列表
   */
  getWarnings() {
    const warnings = []
    Object.values(this.categories).forEach(category => {
      warnings.push(...category.checks.filter(check => check.status === 'warning'))
    })
    return warnings
  }

  /**
   * 获取通过的检查
   * @returns {ValidationCheck[]} 通过检查列表
   */
  getPassed() {
    const passed = []
    Object.values(this.categories).forEach(category => {
      passed.push(...category.checks.filter(check => check.status === 'pass'))
    })
    return passed
  }

  /**
   * 转换为JSON格式
   * @returns {Object} JSON对象
   */
  toJSON() {
    return {
      isValid: this.isValid,
      score: this.score,
      summary: { ...this.summary },
      categories: Object.fromEntries(
        Object.entries(this.categories).map(([key, category]) => [key, category.toJSON()])
      ),
      recommendations: this.recommendations.map(rec => rec.toJSON()),
      metadata: { ...this.metadata }
    }
  }

  /**
   * 从JSON创建实例
   * @param {Object} json - JSON对象
   * @returns {ValidationResult} 验证结果实例
   */
  static fromJSON(json) {
    const result = new ValidationResult()
    result.isValid = json.isValid
    result.score = json.score
    result.summary = { ...json.summary }
    result.metadata = { ...json.metadata }
    
    // 重建categories
    if (json.categories) {
      Object.entries(json.categories).forEach(([key, categoryData]) => {
        result.categories[key] = ValidationCategory.fromJSON(categoryData)
      })
    }
    
    // 重建recommendations
    if (json.recommendations) {
      result.recommendations = json.recommendations.map(rec => Recommendation.fromJSON(rec))
    }
    
    return result
  }
}

/**
 * 验证类别类
 */
export class ValidationCategory {
  constructor(name, id) {
    this.name = name
    this.id = id
    this.passed = false
    this.score = 0
    this.checks = []
    this.summary = ''
  }

  /**
   * 添加验证检查
   * @param {ValidationCheck} check - 验证检查对象
   */
  addCheck(check) {
    this.checks.push(check)
    this._updateSummary()
  }

  /**
   * 获取错误检查
   * @returns {ValidationCheck[]} 错误检查列表
   */
  getErrors() {
    return this.checks.filter(check => check.status === 'error')
  }

  /**
   * 获取警告检查
   * @returns {ValidationCheck[]} 警告检查列表
   */
  getWarnings() {
    return this.checks.filter(check => check.status === 'warning')
  }

  /**
   * 获取通过的检查
   * @returns {ValidationCheck[]} 通过检查列表
   */
  getPassed() {
    return this.checks.filter(check => check.status === 'pass')
  }

  /**
   * 更新摘要信息
   * @private
   */
  _updateSummary() {
    const passed = this.getPassed().length
    const warnings = this.getWarnings().length
    const errors = this.getErrors().length
    const total = this.checks.length
    
    if (total === 0) {
      this.summary = '无检查项目'
      return
    }
    
    this.summary = `${passed}/${total} 通过`
    if (warnings > 0) this.summary += `, ${warnings} 警告`
    if (errors > 0) this.summary += `, ${errors} 错误`
  }

  /**
   * 转换为JSON格式
   * @returns {Object} JSON对象
   */
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      passed: this.passed,
      score: this.score,
      checks: this.checks.map(check => check.toJSON()),
      summary: this.summary
    }
  }

  /**
   * 从JSON创建实例
   * @param {Object} json - JSON对象
   * @returns {ValidationCategory} 验证类别实例
   */
  static fromJSON(json) {
    const category = new ValidationCategory(json.name, json.id)
    category.passed = json.passed
    category.score = json.score
    category.summary = json.summary
    
    if (json.checks) {
      category.checks = json.checks.map(check => ValidationCheck.fromJSON(check))
    }
    
    return category
  }
}

/**
 * 验证检查类
 */
export class ValidationCheck {
  constructor(id, name, status, message, line = null, suggestion = null, severity = 'medium') {
    this.id = id
    this.name = name
    this.status = status // 'pass', 'warning', 'error'
    this.message = message
    this.line = line
    this.suggestion = suggestion
    this.severity = severity // 'low', 'medium', 'high', 'critical'
    this.timestamp = new Date()
  }

  /**
   * 检查是否为错误
   * @returns {boolean} 是否为错误
   */
  isError() {
    return this.status === 'error'
  }

  /**
   * 检查是否为警告
   * @returns {boolean} 是否为警告
   */
  isWarning() {
    return this.status === 'warning'
  }

  /**
   * 检查是否通过
   * @returns {boolean} 是否通过
   */
  isPassed() {
    return this.status === 'pass'
  }

  /**
   * 获取严重程度权重
   * @returns {number} 权重值
   */
  getSeverityWeight() {
    const weights = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    }
    return weights[this.severity] || 2
  }

  /**
   * 转换为JSON格式
   * @returns {Object} JSON对象
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      message: this.message,
      line: this.line,
      suggestion: this.suggestion,
      severity: this.severity,
      timestamp: this.timestamp.toISOString()
    }
  }

  /**
   * 从JSON创建实例
   * @param {Object} json - JSON对象
   * @returns {ValidationCheck} 验证检查实例
   */
  static fromJSON(json) {
    const check = new ValidationCheck(
      json.id,
      json.name,
      json.status,
      json.message,
      json.line,
      json.suggestion,
      json.severity
    )
    
    if (json.timestamp) {
      check.timestamp = new Date(json.timestamp)
    }
    
    return check
  }
}

/**
 * 建议类
 */
export class Recommendation {
  constructor(type, priority, title, description, action, example = null) {
    this.type = type // 'fix', 'optimize', 'enhance'
    this.priority = priority // 'low', 'medium', 'high'
    this.title = title
    this.description = description
    this.action = action
    this.example = example
    this.timestamp = new Date()
  }

  /**
   * 检查是否为修复建议
   * @returns {boolean} 是否为修复建议
   */
  isFix() {
    return this.type === 'fix'
  }

  /**
   * 检查是否为优化建议
   * @returns {boolean} 是否为优化建议
   */
  isOptimization() {
    return this.type === 'optimize'
  }

  /**
   * 检查是否为增强建议
   * @returns {boolean} 是否为增强建议
   */
  isEnhancement() {
    return this.type === 'enhance'
  }

  /**
   * 获取优先级权重
   * @returns {number} 权重值
   */
  getPriorityWeight() {
    const weights = {
      'low': 1,
      'medium': 2,
      'high': 3
    }
    return weights[this.priority] || 2
  }

  /**
   * 转换为JSON格式
   * @returns {Object} JSON对象
   */
  toJSON() {
    return {
      type: this.type,
      priority: this.priority,
      title: this.title,
      description: this.description,
      action: this.action,
      example: this.example,
      timestamp: this.timestamp.toISOString()
    }
  }

  /**
   * 从JSON创建实例
   * @param {Object} json - JSON对象
   * @returns {Recommendation} 建议实例
   */
  static fromJSON(json) {
    const recommendation = new Recommendation(
      json.type,
      json.priority,
      json.title,
      json.description,
      json.action,
      json.example
    )
    
    if (json.timestamp) {
      recommendation.timestamp = new Date(json.timestamp)
    }
    
    return recommendation
  }
}

/**
 * 验证配置类
 */
export class ValidationConfig {
  constructor(options = {}) {
    // 基本配置
    this.filePath = options.filePath || 'public/robots.txt'
    this.strict = options.strict || false
    
    // 输出配置
    this.outputFormat = options.outputFormat || 'console'
    this.verbose = options.verbose !== false
    this.colors = options.colors !== false
    
    // 验证选项
    this.checkAccessibility = options.checkAccessibility !== false
    this.validateSitemaps = options.validateSitemaps !== false
    this.checkSEO = options.checkSEO !== false
    
    // 网络配置
    this.timeout = options.timeout || 5000
    this.userAgent = options.userAgent || 'RobotsValidator/1.0'
    
    // 规则配置
    this.allowedUserAgents = options.allowedUserAgents || []
    this.blockedUserAgents = options.blockedUserAgents || []
    this.requiredSitemaps = options.requiredSitemaps || []
    
    // 报告配置
    this.reportPath = options.reportPath || './robots-validation-report'
    this.includeRecommendations = options.includeRecommendations !== false
    this.includeSuggestions = options.includeSuggestions !== false
    
    // 规则引擎配置
    this.rules = {
      'require-host': { enabled: true, severity: 'warning' },
      'https-sitemaps': { enabled: true, severity: 'error' },
      'block-ai-bots': { enabled: true, severity: 'info' },
      'require-user-agent': { enabled: true, severity: 'error' },
      'require-rules': { enabled: true, severity: 'warning' },
      ...options.rules
    }
  }

  /**
   * 获取规则配置
   * @param {string} ruleId - 规则ID
   * @returns {Object|null} 规则配置
   */
  getRule(ruleId) {
    return this.rules[ruleId] || null
  }

  /**
   * 检查规则是否启用
   * @param {string} ruleId - 规则ID
   * @returns {boolean} 是否启用
   */
  isRuleEnabled(ruleId) {
    const rule = this.getRule(ruleId)
    return rule ? rule.enabled !== false : false
  }

  /**
   * 获取规则严重程度
   * @param {string} ruleId - 规则ID
   * @returns {string} 严重程度
   */
  getRuleSeverity(ruleId) {
    const rule = this.getRule(ruleId)
    return rule ? rule.severity || 'medium' : 'medium'
  }

  /**
   * 转换为JSON格式
   * @returns {Object} JSON对象
   */
  toJSON() {
    return {
      filePath: this.filePath,
      strict: this.strict,
      outputFormat: this.outputFormat,
      verbose: this.verbose,
      colors: this.colors,
      checkAccessibility: this.checkAccessibility,
      validateSitemaps: this.validateSitemaps,
      checkSEO: this.checkSEO,
      timeout: this.timeout,
      userAgent: this.userAgent,
      allowedUserAgents: [...this.allowedUserAgents],
      blockedUserAgents: [...this.blockedUserAgents],
      requiredSitemaps: [...this.requiredSitemaps],
      reportPath: this.reportPath,
      includeRecommendations: this.includeRecommendations,
      includeSuggestions: this.includeSuggestions,
      rules: { ...this.rules }
    }
  }

  /**
   * 从JSON创建实例
   * @param {Object} json - JSON对象
   * @returns {ValidationConfig} 配置实例
   */
  static fromJSON(json) {
    return new ValidationConfig(json)
  }
}

// 导出所有模型类
export default {
  ValidationResult,
  ValidationCategory,
  ValidationCheck,
  Recommendation,
  ValidationConfig
}