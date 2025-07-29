/**
 * RFCComplianceValidator - RFC 9309标准合规验证器
 * 
 * 负责验证robots.txt文件是否符合RFC 9309规范，包括：
 * - 指令格式和语法的标准合规性
 * - 必需指令的存在性检查
 * - 指令顺序和结构验证
 * - 标准规范的完整性检查
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { ValidationCheck } from './robotsValidatorModels.js'

/**
 * RFC 9309标准合规验证器类
 */
export class RFCComplianceValidator {
  constructor(options = {}) {
    this.options = {
      // 验证选项
      strictMode: options.strictMode || false,
      allowExtensions: options.allowExtensions !== false,
      requireUserAgent: options.requireUserAgent !== false,
      
      // RFC 9309特定选项
      enforceDirectiveOrder: options.enforceDirectiveOrder || false,
      allowDeprecatedDirectives: options.allowDeprecatedDirectives !== false,
      validateFieldNames: options.validateFieldNames !== false,
      
      ...options
    }
    
    // RFC 9309标准指令
    this.standardDirectives = {
      // 核心指令
      'user-agent': { required: true, repeatable: true, hasValue: true },
      'disallow': { required: false, repeatable: true, hasValue: true },
      'allow': { required: false, repeatable: true, hasValue: true },
      
      // 扩展指令
      'crawl-delay': { required: false, repeatable: false, hasValue: true },
      'request-rate': { required: false, repeatable: false, hasValue: true },
      'visit-time': { required: false, repeatable: false, hasValue: true },
      'sitemap': { required: false, repeatable: true, hasValue: true },
      'host': { required: false, repeatable: false, hasValue: true }
    }
    
    // 已弃用的指令
    this.deprecatedDirectives = {
      'noindex': { replacement: 'meta robots tag', reason: 'Not part of robots.txt standard' },
      'nofollow': { replacement: 'meta robots tag', reason: 'Not part of robots.txt standard' },
      'noarchive': { replacement: 'meta robots tag', reason: 'Not part of robots.txt standard' },
      'nosnippet': { replacement: 'meta robots tag', reason: 'Not part of robots.txt standard' }
    }
    
    // 非标准但常见的指令
    this.extensionDirectives = {
      'clean-param': { source: 'Yandex', description: 'URL parameter handling' },
      'cache-delay': { source: 'Yandex', description: 'Cache delay setting' },
      'indexing-delay': { source: 'Yandex', description: 'Indexing delay setting' }
    }
    
    // 验证结果
    this.checks = []
  }

  /**
   * 执行RFC 9309标准合规验证
   * @param {string} content - 文件内容
   * @param {Object} context - 验证上下文
   * @returns {ValidationCheck[]} 验证检查结果
   */
  async validate(content, context = {}) {
    this.checks = []
    
    try {
      // 解析内容结构
      const structure = this._parseContent(content)
      
      // 1. 验证文件结构合规性
      await this._validateFileStructure(structure)
      
      // 2. 验证指令格式合规性
      await this._validateDirectiveCompliance(structure)
      
      // 3. 验证必需指令存在性
      await this._validateRequiredDirectives(structure)
      
      // 4. 验证指令顺序和分组
      await this._validateDirectiveOrder(structure)
      
      // 5. 验证字段名称规范
      await this._validateFieldNames(structure)
      
      // 6. 检查非标准指令使用
      await this._validateNonStandardDirectives(structure)
      
      return this.checks
      
    } catch (error) {
      this._addCheck(
        'rfc-validation-error',
        'RFC 9309标准验证错误',
        'error',
        `RFC标准验证过程中发生错误: ${error.message}`,
        null,
        '请检查文件内容和结构',
        'critical'
      )
      
      return this.checks
    }
  }

  /**
   * 解析文件内容结构
   * @private
   * @param {string} content - 文件内容
   * @returns {Object} 解析后的结构
   */
  _parseContent(content) {
    const lines = content.split('\n')
    const structure = {
      userAgentGroups: [],
      globalDirectives: [],
      comments: [],
      emptyLines: [],
      allDirectives: []
    }
    
    let currentGroup = null
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1
      const trimmed = line.trim()
      
      if (!trimmed) {
        structure.emptyLines.push({ line: lineNumber, content: line })
        return
      }
      
      if (trimmed.startsWith('#')) {
        structure.comments.push({ line: lineNumber, content: trimmed })
        return
      }
      
      if (!trimmed.includes(':')) {
        // 无效行，但不在这里处理
        return
      }
      
      const colonIndex = trimmed.indexOf(':')
      const directive = trimmed.substring(0, colonIndex).trim().toLowerCase()
      const value = trimmed.substring(colonIndex + 1).trim()
      
      const directiveObj = {
        line: lineNumber,
        directive,
        value,
        raw: trimmed,
        originalDirective: trimmed.substring(0, colonIndex).trim() // 保留原始大小写
      }
      
      structure.allDirectives.push(directiveObj)
      
      if (directive === 'user-agent') {
        // 开始新的User-agent组
        currentGroup = {
          userAgent: directiveObj,
          rules: [],
          crawlDelay: null,
          requestRate: null,
          visitTime: null
        }
        structure.userAgentGroups.push(currentGroup)
      } else if (currentGroup && ['allow', 'disallow', 'crawl-delay', 'request-rate', 'visit-time'].includes(directive)) {
        // 添加到当前User-agent组
        if (directive === 'crawl-delay') {
          currentGroup.crawlDelay = directiveObj
        } else if (directive === 'request-rate') {
          currentGroup.requestRate = directiveObj
        } else if (directive === 'visit-time') {
          currentGroup.visitTime = directiveObj
        } else {
          currentGroup.rules.push(directiveObj)
        }
      } else {
        // 全局指令（如Sitemap、Host）
        structure.globalDirectives.push(directiveObj)
      }
    })
    
    return structure
  }

  /**
   * 验证文件结构合规性
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateFileStructure(structure) {
    const totalLines = structure.allDirectives.length + structure.comments.length + structure.emptyLines.length
    
    // 检查文件是否为空
    if (structure.allDirectives.length === 0) {
      this._addCheck(
        'empty-robots-file',
        'RFC 9309文件结构验证',
        'error',
        'robots.txt文件为空或不包含任何有效指令',
        null,
        '添加至少一个User-agent指令和相应的规则',
        'critical'
      )
      return
    }
    
    // 检查文件大小合理性
    if (totalLines > 1000) {
      this._addCheck(
        'large-robots-file',
        'RFC 9309文件结构验证',
        'warning',
        `robots.txt文件过大（${totalLines}行），可能影响解析性能`,
        null,
        '考虑简化规则或使用更高效的配置',
        'medium'
      )
    } else {
      this._addCheck(
        'reasonable-file-size',
        'RFC 9309文件结构验证',
        'pass',
        `文件大小合理（${totalLines}行）`,
        null,
        null,
        'low'
      )
    }
    
    // 检查注释使用
    const commentRatio = structure.comments.length / totalLines
    if (commentRatio > 0.5) {
      this._addCheck(
        'excessive-comments',
        'RFC 9309文件结构验证',
        'info',
        `注释行过多（${Math.round(commentRatio * 100)}%），可能影响可读性`,
        null,
        '保持注释简洁明了',
        'low'
      )
    }
    
    // 检查空行使用
    const emptyLineRatio = structure.emptyLines.length / totalLines
    if (emptyLineRatio > 0.3) {
      this._addCheck(
        'excessive-empty-lines',
        'RFC 9309文件结构验证',
        'info',
        `空行过多（${Math.round(emptyLineRatio * 100)}%）`,
        null,
        '减少不必要的空行',
        'low'
      )
    }
  }

  /**
   * 验证指令格式合规性
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateDirectiveCompliance(structure) {
    for (const directive of structure.allDirectives) {
      await this._validateSingleDirective(directive)
    }
    
    // 验证指令分布
    this._validateDirectiveDistribution(structure)
  }

  /**
   * 验证单个指令
   * @private
   * @param {Object} directive - 指令对象
   */
  async _validateSingleDirective(directive) {
    const directiveName = directive.directive
    const line = directive.line
    const value = directive.value
    const originalDirective = directive.originalDirective
    
    // 检查指令名称大小写
    if (originalDirective !== directiveName) {
      this._addCheck(
        'directive-case-mismatch',
        'RFC 9309指令格式验证',
        'info',
        `第${line}行指令使用了大写字母: ${originalDirective}`,
        line,
        '建议使用小写字母以保持一致性',
        'low'
      )
    }
    
    // 检查是否为标准指令
    if (this.standardDirectives[directiveName]) {
      const spec = this.standardDirectives[directiveName]
      
      // 验证指令值
      if (spec.hasValue && !value) {
        this._addCheck(
          'missing-directive-value',
          'RFC 9309指令格式验证',
          'error',
          `第${line}行${directiveName}指令缺少值`,
          line,
          `为${directiveName}指令提供有效值`,
          'high'
        )
      } else if (!spec.hasValue && value) {
        this._addCheck(
          'unexpected-directive-value',
          'RFC 9309指令格式验证',
          'warning',
          `第${line}行${directiveName}指令不应该有值`,
          line,
          `移除${directiveName}指令的值`,
          'medium'
        )
      } else if (spec.hasValue && value) {
        this._addCheck(
          'valid-directive-format',
          'RFC 9309指令格式验证',
          'pass',
          `第${line}行${directiveName}指令格式正确`,
          line,
          null,
          'low'
        )
      }
    } else if (this.deprecatedDirectives[directiveName]) {
      // 已弃用的指令
      const deprecated = this.deprecatedDirectives[directiveName]
      this._addCheck(
        'deprecated-directive',
        'RFC 9309指令格式验证',
        'warning',
        `第${line}行使用了已弃用的指令: ${directiveName}`,
        line,
        `使用${deprecated.replacement}替代，原因：${deprecated.reason}`,
        'medium'
      )
    } else if (this.extensionDirectives[directiveName]) {
      // 扩展指令
      if (this.options.allowExtensions) {
        const extension = this.extensionDirectives[directiveName]
        this._addCheck(
          'extension-directive',
          'RFC 9309指令格式验证',
          'info',
          `第${line}行使用了扩展指令: ${directiveName} (${extension.source})`,
          line,
          `${extension.description}`,
          'low'
        )
      } else {
        this._addCheck(
          'non-standard-directive',
          'RFC 9309指令格式验证',
          'warning',
          `第${line}行使用了非标准指令: ${directiveName}`,
          line,
          '考虑使用标准RFC 9309指令',
          'medium'
        )
      }
    } else {
      // 未知指令
      this._addCheck(
        'unknown-directive',
        'RFC 9309指令格式验证',
        'error',
        `第${line}行使用了未知指令: ${directiveName}`,
        line,
        '检查指令名称拼写或使用标准指令',
        'high'
      )
    }
  }

  /**
   * 验证指令分布
   * @private
   * @param {Object} structure - 解析后的结构
   */
  _validateDirectiveDistribution(structure) {
    const directiveCounts = {}
    
    // 统计指令使用情况
    structure.allDirectives.forEach(directive => {
      const name = directive.directive
      directiveCounts[name] = (directiveCounts[name] || 0) + 1
    })
    
    // 检查指令重复性
    Object.entries(directiveCounts).forEach(([directive, count]) => {
      const spec = this.standardDirectives[directive]
      
      if (spec && !spec.repeatable && count > 1) {
        this._addCheck(
          'non-repeatable-directive-repeated',
          'RFC 9309指令格式验证',
          'error',
          `指令${directive}不可重复，但出现了${count}次`,
          null,
          `移除多余的${directive}指令`,
          'high'
        )
      }
    })
    
    // 生成指令使用统计
    const standardDirectiveCount = Object.keys(directiveCounts).filter(d => 
      this.standardDirectives[d]
    ).length
    
    const totalDirectiveCount = Object.keys(directiveCounts).length
    
    this._addCheck(
      'directive-compliance-summary',
      'RFC 9309指令格式验证',
      'pass',
      `使用了${standardDirectiveCount}/${totalDirectiveCount}个标准指令`,
      null,
      null,
      'low'
    )
  }

  /**
   * 验证必需指令存在性
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateRequiredDirectives(structure) {
    // 检查User-agent指令
    if (structure.userAgentGroups.length === 0) {
      this._addCheck(
        'missing-user-agent',
        'RFC 9309必需指令验证',
        'error',
        '缺少必需的User-agent指令',
        null,
        '添加至少一个User-agent指令',
        'critical'
      )
      return
    }
    
    // 检查每个User-agent组是否有相应的规则
    let hasValidRules = false
    
    for (const group of structure.userAgentGroups) {
      if (group.rules.length > 0) {
        hasValidRules = true
        break
      }
    }
    
    if (!hasValidRules) {
      this._addCheck(
        'no-access-rules',
        'RFC 9309必需指令验证',
        'warning',
        '所有User-agent组都没有访问规则（Allow/Disallow）',
        null,
        '为User-agent添加Allow或Disallow规则',
        'medium'
      )
    } else {
      this._addCheck(
        'has-access-rules',
        'RFC 9309必需指令验证',
        'pass',
        '包含有效的访问控制规则',
        null,
        null,
        'low'
      )
    }
    
    // 检查基本结构完整性
    const hasUserAgent = structure.userAgentGroups.length > 0
    const hasRules = hasValidRules
    const hasSitemap = structure.globalDirectives.some(d => d.directive === 'sitemap')
    
    let completenessScore = 0
    if (hasUserAgent) completenessScore += 40
    if (hasRules) completenessScore += 40
    if (hasSitemap) completenessScore += 20
    
    if (completenessScore >= 80) {
      this._addCheck(
        'structure-completeness-good',
        'RFC 9309必需指令验证',
        'pass',
        `文件结构完整性良好（${completenessScore}%）`,
        null,
        null,
        'low'
      )
    } else if (completenessScore >= 60) {
      this._addCheck(
        'structure-completeness-fair',
        'RFC 9309必需指令验证',
        'info',
        `文件结构完整性一般（${completenessScore}%）`,
        null,
        '考虑添加Sitemap指令以提高完整性',
        'low'
      )
    } else {
      this._addCheck(
        'structure-completeness-poor',
        'RFC 9309必需指令验证',
        'warning',
        `文件结构完整性较差（${completenessScore}%）`,
        null,
        '添加必要的指令以符合RFC 9309标准',
        'medium'
      )
    }
  }

  /**
   * 验证指令顺序和分组
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateDirectiveOrder(structure) {
    if (!this.options.enforceDirectiveOrder) {
      this._addCheck(
        'directive-order-not-enforced',
        'RFC 9309指令顺序验证',
        'info',
        '指令顺序验证已禁用',
        null,
        null,
        'low'
      )
      return
    }
    
    // RFC 9309建议的指令顺序：
    // 1. User-agent
    // 2. Allow/Disallow (与User-agent关联)
    // 3. Crawl-delay, Request-rate, Visit-time (与User-agent关联)
    // 4. Sitemap (全局)
    // 5. Host (全局)
    
    const allDirectives = structure.allDirectives
    let currentUserAgentIndex = -1
    let orderIssues = []
    
    for (let i = 0; i < allDirectives.length; i++) {
      const directive = allDirectives[i]
      const directiveName = directive.directive
      
      if (directiveName === 'user-agent') {
        currentUserAgentIndex = i
      } else if (['allow', 'disallow', 'crawl-delay', 'request-rate', 'visit-time'].includes(directiveName)) {
        if (currentUserAgentIndex === -1) {
          orderIssues.push({
            line: directive.line,
            issue: `${directiveName}指令出现在User-agent指令之前`,
            suggestion: '将User-agent指令放在相关规则之前'
          })
        }
      } else if (['sitemap', 'host'].includes(directiveName)) {
        // 全局指令，检查是否在User-agent组之间
        const nextUserAgent = allDirectives.slice(i + 1).find(d => d.directive === 'user-agent')
        if (nextUserAgent) {
          orderIssues.push({
            line: directive.line,
            issue: `全局指令${directiveName}出现在User-agent组之间`,
            suggestion: '将全局指令移到文件末尾'
          })
        }
      }
    }
    
    if (orderIssues.length === 0) {
      this._addCheck(
        'directive-order-correct',
        'RFC 9309指令顺序验证',
        'pass',
        '指令顺序符合RFC 9309建议',
        null,
        null,
        'low'
      )
    } else {
      orderIssues.forEach(issue => {
        this._addCheck(
          'directive-order-issue',
          'RFC 9309指令顺序验证',
          'info',
          `第${issue.line}行：${issue.issue}`,
          issue.line,
          issue.suggestion,
          'low'
        )
      })
    }
  }

  /**
   * 验证字段名称规范
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateFieldNames(structure) {
    if (!this.options.validateFieldNames) {
      return
    }
    
    const fieldNameIssues = []
    
    structure.allDirectives.forEach(directive => {
      const originalName = directive.originalDirective
      const standardName = directive.directive
      
      // 检查字段名称中的特殊字符
      if (/[^a-zA-Z0-9\-]/.test(originalName)) {
        fieldNameIssues.push({
          line: directive.line,
          issue: `字段名称包含特殊字符: ${originalName}`,
          suggestion: '字段名称只应包含字母、数字和连字符'
        })
      }
      
      // 检查字段名称长度
      if (originalName.length > 20) {
        fieldNameIssues.push({
          line: directive.line,
          issue: `字段名称过长: ${originalName}`,
          suggestion: '使用更简洁的字段名称'
        })
      }
      
      // 检查是否使用了标准字段名称
      if (this.standardDirectives[standardName]) {
        this._addCheck(
          'standard-field-name',
          'RFC 9309字段名称验证',
          'pass',
          `第${directive.line}行使用标准字段名称: ${originalName}`,
          directive.line,
          null,
          'low'
        )
      }
    })
    
    // 报告字段名称问题
    fieldNameIssues.forEach(issue => {
      this._addCheck(
        'field-name-issue',
        'RFC 9309字段名称验证',
        'warning',
        `第${issue.line}行：${issue.issue}`,
        issue.line,
        issue.suggestion,
        'medium'
      )
    })
    
    if (fieldNameIssues.length === 0) {
      this._addCheck(
        'field-names-compliant',
        'RFC 9309字段名称验证',
        'pass',
        '所有字段名称符合RFC 9309规范',
        null,
        null,
        'low'
      )
    }
  }

  /**
   * 验证非标准指令使用
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateNonStandardDirectives(structure) {
    const nonStandardDirectives = []
    const extensionDirectives = []
    const deprecatedDirectives = []
    
    structure.allDirectives.forEach(directive => {
      const name = directive.directive
      
      if (this.deprecatedDirectives[name]) {
        deprecatedDirectives.push(directive)
      } else if (this.extensionDirectives[name]) {
        extensionDirectives.push(directive)
      } else if (!this.standardDirectives[name]) {
        nonStandardDirectives.push(directive)
      }
    })
    
    // 生成非标准指令使用报告
    if (nonStandardDirectives.length > 0) {
      this._addCheck(
        'non-standard-directives-found',
        'RFC 9309非标准指令验证',
        'warning',
        `发现${nonStandardDirectives.length}个非标准指令`,
        null,
        '考虑使用RFC 9309标准指令',
        'medium'
      )
    }
    
    if (extensionDirectives.length > 0) {
      this._addCheck(
        'extension-directives-found',
        'RFC 9309非标准指令验证',
        'info',
        `发现${extensionDirectives.length}个扩展指令`,
        null,
        '扩展指令可能不被所有搜索引擎支持',
        'low'
      )
    }
    
    if (deprecatedDirectives.length > 0) {
      this._addCheck(
        'deprecated-directives-found',
        'RFC 9309非标准指令验证',
        'warning',
        `发现${deprecatedDirectives.length}个已弃用指令`,
        null,
        '更新为现代标准指令',
        'medium'
      )
    }
    
    // 计算标准合规性得分
    const totalDirectives = structure.allDirectives.length
    const standardDirectives = totalDirectives - nonStandardDirectives.length - deprecatedDirectives.length
    const complianceScore = totalDirectives > 0 ? Math.round((standardDirectives / totalDirectives) * 100) : 100
    
    if (complianceScore >= 90) {
      this._addCheck(
        'high-rfc-compliance',
        'RFC 9309非标准指令验证',
        'pass',
        `RFC 9309合规性优秀（${complianceScore}%）`,
        null,
        null,
        'low'
      )
    } else if (complianceScore >= 70) {
      this._addCheck(
        'moderate-rfc-compliance',
        'RFC 9309非标准指令验证',
        'info',
        `RFC 9309合规性良好（${complianceScore}%）`,
        null,
        '考虑提高标准指令使用率',
        'low'
      )
    } else {
      this._addCheck(
        'low-rfc-compliance',
        'RFC 9309非标准指令验证',
        'warning',
        `RFC 9309合规性较低（${complianceScore}%）`,
        null,
        '建议使用更多标准指令以提高合规性',
        'medium'
      )
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
   * 获取支持的标准指令列表
   * @returns {Object} 标准指令列表
   */
  getStandardDirectives() {
    return { ...this.standardDirectives }
  }

  /**
   * 获取已弃用指令列表
   * @returns {Object} 已弃用指令列表
   */
  getDeprecatedDirectives() {
    return { ...this.deprecatedDirectives }
  }

  /**
   * 获取扩展指令列表
   * @returns {Object} 扩展指令列表
   */
  getExtensionDirectives() {
    return { ...this.extensionDirectives }
  }

  /**
   * 检查指令是否为标准指令
   * @param {string} directive - 指令名称
   * @returns {boolean} 是否为标准指令
   */
  isStandardDirective(directive) {
    return this.standardDirectives.hasOwnProperty(directive.toLowerCase())
  }

  /**
   * 检查指令是否已弃用
   * @param {string} directive - 指令名称
   * @returns {boolean} 是否已弃用
   */
  isDeprecatedDirective(directive) {
    return this.deprecatedDirectives.hasOwnProperty(directive.toLowerCase())
  }

  /**
   * 检查指令是否为扩展指令
   * @param {string} directive - 指令名称
   * @returns {boolean} 是否为扩展指令
   */
  isExtensionDirective(directive) {
    return this.extensionDirectives.hasOwnProperty(directive.toLowerCase())
  }
}

export default RFCComplianceValidator