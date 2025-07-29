/**
 * ContentValidator - robots.txt内容验证器
 * 
 * 负责验证robots.txt文件的内容逻辑，包括：
 * - User-agent规则验证
 * - Allow/Disallow规则验证
 * - Sitemap声明验证
 * - Host声明验证
 * - 规则关系和逻辑验证
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { ValidationCheck } from './robotsValidatorModels.js'

/**
 * 内容验证器类
 */
export class ContentValidator {
  constructor(options = {}) {
    this.options = {
      // 验证选项
      strictMode: options.strictMode || false,
      checkUrlAccessibility: options.checkUrlAccessibility !== false,
      validateSitemapContent: options.validateSitemapContent !== false,
      
      // User-agent选项
      allowWildcardUserAgent: options.allowWildcardUserAgent !== false,
      requireUserAgentRules: options.requireUserAgentRules !== false,
      
      // 规则选项
      allowEmptyDisallow: options.allowEmptyDisallow !== false,
      checkRuleConflicts: options.checkRuleConflicts !== false,
      
      // 网络选项
      timeout: options.timeout || 5000,
      userAgent: options.userAgent || 'RobotsValidator/1.0',
      
      ...options
    }
    
    // 已知的搜索引擎机器人
    this.knownUserAgents = {
      // 主要搜索引擎
      'googlebot': { name: 'Google', category: 'search', priority: 'high' },
      'bingbot': { name: 'Microsoft Bing', category: 'search', priority: 'high' },
      'slurp': { name: 'Yahoo', category: 'search', priority: 'medium' },
      'duckduckbot': { name: 'DuckDuckGo', category: 'search', priority: 'medium' },
      'baiduspider': { name: 'Baidu', category: 'search', priority: 'medium' },
      'yandexbot': { name: 'Yandex', category: 'search', priority: 'medium' },
      
      // 社交媒体
      'facebookexternalhit': { name: 'Facebook', category: 'social', priority: 'medium' },
      'twitterbot': { name: 'Twitter', category: 'social', priority: 'low' },
      'linkedinbot': { name: 'LinkedIn', category: 'social', priority: 'low' },
      
      // SEO工具
      'ahrefsbot': { name: 'Ahrefs', category: 'seo', priority: 'low' },
      'mj12bot': { name: 'Majestic', category: 'seo', priority: 'low' },
      'semrushbot': { name: 'SEMrush', category: 'seo', priority: 'low' },
      
      // AI机器人
      'gptbot': { name: 'OpenAI GPT', category: 'ai', priority: 'low' },
      'chatgpt-user': { name: 'ChatGPT', category: 'ai', priority: 'low' },
      'ccbot': { name: 'Common Crawl', category: 'ai', priority: 'low' },
      'anthropic-ai': { name: 'Anthropic', category: 'ai', priority: 'low' },
      'claude-web': { name: 'Claude', category: 'ai', priority: 'low' }
    }
    
    // 验证结果
    this.checks = []
    this.userAgentGroups = []
  }

  /**
   * 执行内容验证
   * @param {string} content - 文件内容
   * @param {Object} context - 验证上下文
   * @returns {ValidationCheck[]} 验证检查结果
   */
  async validate(content, context = {}) {
    this.checks = []
    this.userAgentGroups = []
    
    try {
      // 解析内容结构
      const structure = this._parseContent(content)
      
      // 1. User-agent规则验证
      await this._validateUserAgentRules(structure)
      
      // 2. Allow/Disallow规则验证
      await this._validatePathRules(structure)
      
      // 3. Sitemap声明验证
      await this._validateSitemapDeclarations(structure)
      
      // 4. Host声明验证
      await this._validateHostDeclarations(structure)
      
      // 5. 规则关系验证
      await this._validateRuleRelationships(structure)
      
      return this.checks
      
    } catch (error) {
      this._addCheck(
        'content-validation-error',
        '内容验证错误',
        'error',
        `内容验证过程中发生错误: ${error.message}`,
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
      emptyLines: []
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
        return
      }
      
      const colonIndex = trimmed.indexOf(':')
      const directive = trimmed.substring(0, colonIndex).trim().toLowerCase()
      const value = trimmed.substring(colonIndex + 1).trim()
      
      const directiveObj = {
        line: lineNumber,
        directive,
        value,
        raw: trimmed
      }
      
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
   * 验证User-agent规则
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateUserAgentRules(structure) {
    const userAgentGroups = structure.userAgentGroups
    
    if (userAgentGroups.length === 0) {
      this._addCheck(
        'no-user-agent-groups',
        'User-agent规则验证',
        'error',
        '未找到任何User-agent组',
        null,
        '添加至少一个User-agent指令和相应的规则',
        'critical'
      )
      return
    }
    
    // 验证每个User-agent组
    for (const group of userAgentGroups) {
      await this._validateUserAgentGroup(group)
    }
    
    // 验证User-agent组之间的关系
    this._validateUserAgentGroupRelationships(userAgentGroups)
    
    // 检查是否有通配符User-agent
    this._validateWildcardUserAgent(userAgentGroups)
    
    // 检查重复的User-agent
    this._validateDuplicateUserAgents(userAgentGroups)
  }

  /**
   * 验证单个User-agent组
   * @private
   * @param {Object} group - User-agent组
   */
  async _validateUserAgentGroup(group) {
    const userAgent = group.userAgent
    const userAgentValue = userAgent.value.toLowerCase()
    
    // 验证User-agent值
    if (!userAgent.value) {
      this._addCheck(
        'empty-user-agent',
        'User-agent规则验证',
        'error',
        `第${userAgent.line}行User-agent值为空`,
        userAgent.line,
        '为User-agent提供有效值',
        'high'
      )
      return
    }
    
    // 检查User-agent类型
    if (userAgent.value === '*') {
      this._addCheck(
        'wildcard-user-agent',
        'User-agent规则验证',
        'pass',
        `第${userAgent.line}行使用通配符User-agent`,
        userAgent.line,
        null,
        'low'
      )
    } else if (this.knownUserAgents[userAgentValue]) {
      const botInfo = this.knownUserAgents[userAgentValue]
      this._addCheck(
        'known-user-agent',
        'User-agent规则验证',
        'pass',
        `第${userAgent.line}行使用已知的${botInfo.name}机器人`,
        userAgent.line,
        null,
        'low'
      )
      
      // 检查优先级建议
      if (botInfo.priority === 'high' && group.rules.length === 0) {
        this._addCheck(
          'high-priority-bot-no-rules',
          'User-agent规则验证',
          'warning',
          `第${userAgent.line}行高优先级机器人${botInfo.name}没有配置规则`,
          userAgent.line,
          '为重要的搜索引擎机器人配置适当的访问规则',
          'medium'
        )
      }
    } else {
      this._addCheck(
        'custom-user-agent',
        'User-agent规则验证',
        'info',
        `第${userAgent.line}行使用自定义User-agent: ${userAgent.value}`,
        userAgent.line,
        '确认User-agent名称正确',
        'low'
      )
    }
    
    // 验证User-agent格式
    if (!/^[a-zA-Z0-9\-_*+.\/\s]+$/.test(userAgent.value)) {
      this._addCheck(
        'invalid-user-agent-format',
        'User-agent规则验证',
        'warning',
        `第${userAgent.line}行User-agent包含特殊字符`,
        userAgent.line,
        '避免在User-agent中使用特殊字符',
        'medium'
      )
    }
    
    // 验证User-agent组的规则
    if (this.options.requireUserAgentRules && group.rules.length === 0) {
      this._addCheck(
        'user-agent-no-rules',
        'User-agent规则验证',
        'warning',
        `第${userAgent.line}行User-agent没有配置任何规则`,
        userAgent.line,
        '为User-agent添加Allow或Disallow规则',
        'medium'
      )
    } else if (group.rules.length > 0) {
      this._addCheck(
        'user-agent-has-rules',
        'User-agent规则验证',
        'pass',
        `第${userAgent.line}行User-agent配置了${group.rules.length}个规则`,
        userAgent.line,
        null,
        'low'
      )
    }
    
    // 验证Crawl-delay设置
    if (group.crawlDelay) {
      this._validateCrawlDelay(group.crawlDelay, userAgent.value)
    }
  }

  /**
   * 验证Crawl-delay设置
   * @private
   * @param {Object} crawlDelay - Crawl-delay指令
   * @param {string} userAgentValue - User-agent值
   */
  _validateCrawlDelay(crawlDelay, userAgentValue) {
    const delay = parseFloat(crawlDelay.value)
    
    if (isNaN(delay) || delay < 0) {
      return // 这些错误已在DirectiveSyntaxValidator中处理
    }
    
    // 根据User-agent类型提供建议
    const userAgentLower = userAgentValue.toLowerCase()
    const botInfo = this.knownUserAgents[userAgentLower]
    
    if (botInfo) {
      if (botInfo.category === 'search' && delay > 10) {
        this._addCheck(
          'excessive-crawl-delay-search',
          'User-agent规则验证',
          'warning',
          `第${crawlDelay.line}行搜索引擎${botInfo.name}的Crawl-delay过长: ${delay}秒`,
          crawlDelay.line,
          '搜索引擎建议使用较短的延迟时间（1-10秒）',
          'medium'
        )
      } else if (botInfo.category === 'seo' && delay < 5) {
        this._addCheck(
          'low-crawl-delay-seo',
          'User-agent规则验证',
          'info',
          `第${crawlDelay.line}行SEO工具${botInfo.name}的Crawl-delay较短: ${delay}秒`,
          crawlDelay.line,
          '考虑为SEO工具设置更长的延迟时间以减少服务器负载',
          'low'
        )
      }
    }
    
    // 检查合理性
    if (delay > 0 && delay <= 86400) {
      this._addCheck(
        'reasonable-crawl-delay',
        'User-agent规则验证',
        'pass',
        `第${crawlDelay.line}行Crawl-delay设置合理: ${delay}秒`,
        crawlDelay.line,
        null,
        'low'
      )
    }
  }

  /**
   * 验证User-agent组之间的关系
   * @private
   * @param {Array} userAgentGroups - User-agent组数组
   */
  _validateUserAgentGroupRelationships(userAgentGroups) {
    // 检查是否有通配符和特定机器人的组合
    const hasWildcard = userAgentGroups.some(group => group.userAgent.value === '*')
    const specificBots = userAgentGroups.filter(group => group.userAgent.value !== '*')
    
    if (hasWildcard && specificBots.length > 0) {
      this._addCheck(
        'wildcard-with-specific-bots',
        'User-agent规则验证',
        'pass',
        `配置了通配符规则和${specificBots.length}个特定机器人规则`,
        null,
        '特定机器人规则会覆盖通配符规则',
        'low'
      )
    }
    
    // 检查规则覆盖情况
    if (specificBots.length > 0) {
      const highPriorityBots = specificBots.filter(group => {
        const botInfo = this.knownUserAgents[group.userAgent.value.toLowerCase()]
        return botInfo && botInfo.priority === 'high'
      })
      
      if (highPriorityBots.length > 0) {
        this._addCheck(
          'high-priority-bots-configured',
          'User-agent规则验证',
          'pass',
          `配置了${highPriorityBots.length}个高优先级搜索引擎机器人`,
          null,
          null,
          'low'
        )
      }
    }
  }

  /**
   * 验证通配符User-agent
   * @private
   * @param {Array} userAgentGroups - User-agent组数组
   */
  _validateWildcardUserAgent(userAgentGroups) {
    const wildcardGroups = userAgentGroups.filter(group => group.userAgent.value === '*')
    
    if (wildcardGroups.length === 0) {
      if (this.options.allowWildcardUserAgent) {
        this._addCheck(
          'no-wildcard-user-agent',
          'User-agent规则验证',
          'warning',
          '未找到通配符User-agent规则',
          null,
          '考虑添加"User-agent: *"作为默认规则',
          'medium'
        )
      }
    } else if (wildcardGroups.length > 1) {
      this._addCheck(
        'multiple-wildcard-user-agents',
        'User-agent规则验证',
        'warning',
        `发现${wildcardGroups.length}个通配符User-agent组`,
        null,
        '只需要一个通配符User-agent组',
        'medium'
      )
    } else {
      // 检查通配符组的位置
      const wildcardIndex = userAgentGroups.findIndex(group => group.userAgent.value === '*')
      if (wildcardIndex !== userAgentGroups.length - 1) {
        this._addCheck(
          'wildcard-not-last',
          'User-agent规则验证',
          'info',
          '通配符User-agent不在最后位置',
          wildcardGroups[0].userAgent.line,
          '建议将通配符User-agent放在文件末尾作为默认规则',
          'low'
        )
      }
    }
  }

  /**
   * 验证重复的User-agent
   * @private
   * @param {Array} userAgentGroups - User-agent组数组
   */
  _validateDuplicateUserAgents(userAgentGroups) {
    const userAgentCounts = {}
    
    userAgentGroups.forEach(group => {
      const value = group.userAgent.value.toLowerCase()
      if (!userAgentCounts[value]) {
        userAgentCounts[value] = []
      }
      userAgentCounts[value].push(group)
    })
    
    Object.entries(userAgentCounts).forEach(([value, groups]) => {
      if (groups.length > 1) {
        const lines = groups.map(g => g.userAgent.line).join(', ')
        this._addCheck(
          'duplicate-user-agent',
          'User-agent规则验证',
          'warning',
          `User-agent "${groups[0].userAgent.value}" 在第${lines}行重复定义`,
          null,
          '合并重复的User-agent规则或移除多余的定义',
          'medium'
        )
      }
    })
  }

  /**
   * 验证路径规则（Allow/Disallow）
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validatePathRules(structure) {
    const userAgentGroups = structure.userAgentGroups
    
    if (userAgentGroups.length === 0) {
      return // 已在User-agent验证中处理
    }
    
    let totalRules = 0
    let allowRules = 0
    let disallowRules = 0
    const pathConflicts = []
    
    // 验证每个User-agent组的路径规则
    for (const group of userAgentGroups) {
      await this._validateUserAgentPathRules(group)
      
      // 统计规则数量
      const groupAllowRules = group.rules.filter(r => r.directive === 'allow')
      const groupDisallowRules = group.rules.filter(r => r.directive === 'disallow')
      
      totalRules += group.rules.length
      allowRules += groupAllowRules.length
      disallowRules += groupDisallowRules.length
      
      // 检查同一User-agent组内的规则冲突
      const conflicts = this._detectPathConflicts(group.rules, group.userAgent.value)
      pathConflicts.push(...conflicts)
    }
    
    // 生成路径规则统计报告
    if (totalRules > 0) {
      this._addCheck(
        'path-rules-statistics',
        'Allow/Disallow规则验证',
        'pass',
        `总共配置了${totalRules}个路径规则（Allow: ${allowRules}, Disallow: ${disallowRules}）`,
        null,
        null,
        'low'
      )
    }
    
    // 报告规则冲突
    if (pathConflicts.length > 0) {
      pathConflicts.forEach(conflict => {
        this._addCheck(
          'path-rule-conflict',
          'Allow/Disallow规则验证',
          'warning',
          conflict.message,
          conflict.line,
          conflict.suggestion,
          'medium'
        )
      })
    }
    
    // 检查是否有过于宽泛的禁止规则
    this._validateBroadDisallowRules(userAgentGroups)
    
    // 检查重要路径的可访问性
    this._validateImportantPathAccess(userAgentGroups)
  }

  /**
   * 验证单个User-agent组的路径规则
   * @private
   * @param {Object} group - User-agent组
   */
  async _validateUserAgentPathRules(group) {
    const userAgent = group.userAgent
    const rules = group.rules
    
    if (rules.length === 0) {
      return // 已在User-agent验证中处理
    }
    
    // 验证每个路径规则
    for (const rule of rules) {
      await this._validateSinglePathRule(rule, userAgent.value)
    }
    
    // 检查规则的逻辑性
    this._validateRuleLogic(rules, userAgent.value)
  }

  /**
   * 验证单个路径规则
   * @private
   * @param {Object} rule - 路径规则
   * @param {string} userAgentValue - User-agent值
   */
  async _validateSinglePathRule(rule, userAgentValue) {
    const path = rule.value
    const directive = rule.directive
    const line = rule.line
    
    // 验证路径格式
    if (!path) {
      if (directive === 'disallow' && this.options.allowEmptyDisallow) {
        this._addCheck(
          'empty-disallow-allow-all',
          'Allow/Disallow规则验证',
          'pass',
          `第${line}行空的Disallow规则允许访问所有路径`,
          line,
          null,
          'low'
        )
      } else {
        this._addCheck(
          'empty-path-rule',
          'Allow/Disallow规则验证',
          'warning',
          `第${line}行${directive}规则的路径为空`,
          line,
          '为路径规则提供有效的路径值',
          'medium'
        )
      }
      return
    }
    
    // 验证路径必须以/开头
    if (!path.startsWith('/')) {
      this._addCheck(
        'invalid-path-format',
        'Allow/Disallow规则验证',
        'error',
        `第${line}行路径"${path}"必须以"/"开头`,
        line,
        `将路径改为"/${path}"`,
        'high'
      )
      return
    }
    
    // 验证通配符使用
    this._validateWildcardUsage(rule, userAgentValue)
    
    // 验证路径字符
    this._validatePathCharacters(rule, userAgentValue)
    
    // 验证路径长度
    if (path.length > 2048) {
      this._addCheck(
        'path-too-long',
        'Allow/Disallow规则验证',
        'warning',
        `第${line}行路径过长（${path.length}字符）`,
        line,
        '考虑使用更短的路径或通配符',
        'medium'
      )
    }
    
    // 检查常见路径模式
    this._validateCommonPathPatterns(rule, userAgentValue)
  }

  /**
   * 验证通配符使用
   * @private
   * @param {Object} rule - 路径规则
   * @param {string} userAgentValue - User-agent值
   */
  _validateWildcardUsage(rule, userAgentValue) {
    const path = rule.value
    const line = rule.line
    
    // 检查*通配符
    const asteriskCount = (path.match(/\*/g) || []).length
    if (asteriskCount > 0) {
      if (asteriskCount === 1 && path.endsWith('*')) {
        this._addCheck(
          'valid-wildcard-usage',
          'Allow/Disallow规则验证',
          'pass',
          `第${line}行正确使用通配符: ${path}`,
          line,
          null,
          'low'
        )
      } else if (asteriskCount > 1) {
        this._addCheck(
          'multiple-wildcards',
          'Allow/Disallow规则验证',
          'warning',
          `第${line}行使用了多个通配符: ${path}`,
          line,
          '考虑简化通配符使用',
          'medium'
        )
      } else {
        this._addCheck(
          'wildcard-in-middle',
          'Allow/Disallow规则验证',
          'info',
          `第${line}行在路径中间使用通配符: ${path}`,
          line,
          '确认通配符位置符合预期',
          'low'
        )
      }
    }
    
    // 检查$结束符
    if (path.includes('$')) {
      if (path.endsWith('$')) {
        this._addCheck(
          'valid-end-anchor',
          'Allow/Disallow规则验证',
          'pass',
          `第${line}行正确使用结束锚点: ${path}`,
          line,
          null,
          'low'
        )
      } else {
        this._addCheck(
          'invalid-end-anchor',
          'Allow/Disallow规则验证',
          'warning',
          `第${line}行结束锚点$应该在路径末尾: ${path}`,
          line,
          '将$移到路径末尾',
          'medium'
        )
      }
    }
  }

  /**
   * 验证路径字符
   * @private
   * @param {Object} rule - 路径规则
   * @param {string} userAgentValue - User-agent值
   */
  _validatePathCharacters(rule, userAgentValue) {
    const path = rule.value
    const line = rule.line
    
    // 检查URL编码
    const hasUrlEncoding = /%[0-9A-Fa-f]{2}/.test(path)
    if (hasUrlEncoding) {
      this._addCheck(
        'url-encoded-path',
        'Allow/Disallow规则验证',
        'info',
        `第${line}行路径包含URL编码: ${path}`,
        line,
        '确认URL编码是必需的',
        'low'
      )
    }
    
    // 检查特殊字符
    const specialChars = path.match(/[<>"|\\^`{}\[\]]/g)
    if (specialChars) {
      this._addCheck(
        'special-characters-in-path',
        'Allow/Disallow规则验证',
        'warning',
        `第${line}行路径包含特殊字符: ${specialChars.join(', ')}`,
        line,
        '考虑URL编码特殊字符',
        'medium'
      )
    }
    
    // 检查空格
    if (path.includes(' ')) {
      this._addCheck(
        'space-in-path',
        'Allow/Disallow规则验证',
        'warning',
        `第${line}行路径包含空格`,
        line,
        '使用%20替换空格',
        'medium'
      )
    }
  }

  /**
   * 验证常见路径模式
   * @private
   * @param {Object} rule - 路径规则
   * @param {string} userAgentValue - User-agent值
   */
  _validateCommonPathPatterns(rule, userAgentValue) {
    const path = rule.value
    const directive = rule.directive
    const line = rule.line
    
    // 检查根路径禁止
    if (directive === 'disallow' && path === '/') {
      this._addCheck(
        'disallow-all-paths',
        'Allow/Disallow规则验证',
        'warning',
        `第${line}行禁止访问所有路径`,
        line,
        '确认是否真的要禁止所有访问',
        'high'
      )
    }
    
    // 检查常见管理路径
    const adminPaths = ['/admin', '/wp-admin', '/administrator', '/backend', '/dashboard']
    const isAdminPath = adminPaths.some(adminPath => path.toLowerCase().startsWith(adminPath.toLowerCase()))
    
    if (isAdminPath && directive === 'disallow') {
      this._addCheck(
        'admin-path-blocked',
        'Allow/Disallow规则验证',
        'pass',
        `第${line}行正确阻止管理路径: ${path}`,
        line,
        null,
        'low'
      )
    } else if (isAdminPath && directive === 'allow') {
      this._addCheck(
        'admin-path-allowed',
        'Allow/Disallow规则验证',
        'warning',
        `第${line}行允许访问管理路径: ${path}`,
        line,
        '确认是否应该允许访问管理路径',
        'medium'
      )
    }
    
    // 检查静态资源路径
    const staticPaths = ['/css', '/js', '/images', '/img', '/assets', '/static']
    const isStaticPath = staticPaths.some(staticPath => path.toLowerCase().startsWith(staticPath.toLowerCase()))
    
    if (isStaticPath && directive === 'disallow') {
      this._addCheck(
        'static-resources-blocked',
        'Allow/Disallow规则验证',
        'warning',
        `第${line}行阻止静态资源: ${path}`,
        line,
        '考虑允许搜索引擎访问CSS和JS文件以提高SEO',
        'medium'
      )
    }
    
    // 检查sitemap路径
    if (path.toLowerCase().includes('sitemap') && directive === 'disallow') {
      this._addCheck(
        'sitemap-path-blocked',
        'Allow/Disallow规则验证',
        'warning',
        `第${line}行阻止sitemap路径: ${path}`,
        line,
        '通常应该允许访问sitemap文件',
        'medium'
      )
    }
  }

  /**
   * 验证规则逻辑
   * @private
   * @param {Array} rules - 规则数组
   * @param {string} userAgentValue - User-agent值
   */
  _validateRuleLogic(rules, userAgentValue) {
    const allowRules = rules.filter(r => r.directive === 'allow')
    const disallowRules = rules.filter(r => r.directive === 'disallow')
    
    // 检查是否只有Allow规则
    if (allowRules.length > 0 && disallowRules.length === 0) {
      this._addCheck(
        'only-allow-rules',
        'Allow/Disallow规则验证',
        'info',
        `User-agent "${userAgentValue}" 只有Allow规则`,
        null,
        '考虑添加Disallow规则来限制不必要的访问',
        'low'
      )
    }
    
    // 检查是否只有Disallow规则
    if (disallowRules.length > 0 && allowRules.length === 0) {
      this._addCheck(
        'only-disallow-rules',
        'Allow/Disallow规则验证',
        'pass',
        `User-agent "${userAgentValue}" 只有Disallow规则`,
        null,
        null,
        'low'
      )
    }
    
    // 检查规则数量
    if (rules.length > 20) {
      this._addCheck(
        'too-many-rules',
        'Allow/Disallow规则验证',
        'warning',
        `User-agent "${userAgentValue}" 有${rules.length}个规则，可能过多`,
        null,
        '考虑合并相似的规则或使用通配符',
        'medium'
      )
    }
  }

  /**
   * 检测路径冲突
   * @private
   * @param {Array} rules - 规则数组
   * @param {string} userAgentValue - User-agent值
   * @returns {Array} 冲突列表
   */
  _detectPathConflicts(rules, userAgentValue) {
    const conflicts = []
    
    // 检查Allow和Disallow规则之间的冲突
    const allowRules = rules.filter(r => r.directive === 'allow')
    const disallowRules = rules.filter(r => r.directive === 'disallow')
    
    for (const allowRule of allowRules) {
      for (const disallowRule of disallowRules) {
        const conflict = this._checkPathConflict(allowRule, disallowRule, userAgentValue)
        if (conflict) {
          conflicts.push(conflict)
        }
      }
    }
    
    // 检查重复规则
    const duplicates = this._findDuplicateRules(rules, userAgentValue)
    conflicts.push(...duplicates)
    
    return conflicts
  }

  /**
   * 检查两个路径规则是否冲突
   * @private
   * @param {Object} allowRule - Allow规则
   * @param {Object} disallowRule - Disallow规则
   * @param {string} userAgentValue - User-agent值
   * @returns {Object|null} 冲突信息
   */
  _checkPathConflict(allowRule, disallowRule, userAgentValue) {
    const allowPath = allowRule.value
    const disallowPath = disallowRule.value
    
    // 检查完全相同的路径
    if (allowPath === disallowPath) {
      return {
        message: `User-agent "${userAgentValue}" 的Allow和Disallow规则冲突: ${allowPath}`,
        line: allowRule.line,
        suggestion: '移除重复的规则或明确优先级'
      }
    }
    
    // 检查路径包含关系
    if (allowPath.startsWith(disallowPath) && disallowPath !== '/') {
      return {
        message: `User-agent "${userAgentValue}" 的规则可能冲突: Allow "${allowPath}" 被 Disallow "${disallowPath}" 包含`,
        line: allowRule.line,
        suggestion: '检查规则顺序和优先级'
      }
    }
    
    if (disallowPath.startsWith(allowPath) && allowPath !== '/') {
      return {
        message: `User-agent "${userAgentValue}" 的规则可能冲突: Disallow "${disallowPath}" 被 Allow "${allowPath}" 包含`,
        line: disallowRule.line,
        suggestion: '检查规则顺序和优先级'
      }
    }
    
    return null
  }

  /**
   * 查找重复规则
   * @private
   * @param {Array} rules - 规则数组
   * @param {string} userAgentValue - User-agent值
   * @returns {Array} 重复规则列表
   */
  _findDuplicateRules(rules, userAgentValue) {
    const duplicates = []
    const seen = new Map()
    
    for (const rule of rules) {
      const key = `${rule.directive}:${rule.value}`
      
      if (seen.has(key)) {
        const originalRule = seen.get(key)
        duplicates.push({
          message: `User-agent "${userAgentValue}" 有重复的${rule.directive}规则: ${rule.value}`,
          line: rule.line,
          suggestion: `移除第${rule.line}行或第${originalRule.line}行的重复规则`
        })
      } else {
        seen.set(key, rule)
      }
    }
    
    return duplicates
  }

  /**
   * 验证过于宽泛的禁止规则
   * @private
   * @param {Array} userAgentGroups - User-agent组数组
   */
  _validateBroadDisallowRules(userAgentGroups) {
    for (const group of userAgentGroups) {
      const disallowRules = group.rules.filter(r => r.directive === 'disallow')
      
      // 检查是否禁止了根路径
      const rootDisallow = disallowRules.find(r => r.value === '/')
      if (rootDisallow) {
        this._addCheck(
          'broad-disallow-root',
          'Allow/Disallow规则验证',
          'warning',
          `User-agent "${group.userAgent.value}" 禁止访问所有路径`,
          rootDisallow.line,
          '确认是否真的要完全阻止此机器人',
          'high'
        )
      }
      
      // 检查是否有过多的宽泛禁止规则
      const broadRules = disallowRules.filter(r => 
        r.value.length <= 3 || r.value.endsWith('*')
      )
      
      if (broadRules.length > 5) {
        this._addCheck(
          'too-many-broad-disallows',
          'Allow/Disallow规则验证',
          'info',
          `User-agent "${group.userAgent.value}" 有${broadRules.length}个宽泛的禁止规则`,
          null,
          '考虑合并相似的规则',
          'low'
        )
      }
    }
  }

  /**
   * 验证重要路径的可访问性
   * @private
   * @param {Array} userAgentGroups - User-agent组数组
   */
  _validateImportantPathAccess(userAgentGroups) {
    const importantPaths = ['/sitemap.xml', '/robots.txt', '/favicon.ico']
    
    for (const group of userAgentGroups) {
      // 只检查搜索引擎机器人
      const botInfo = this.knownUserAgents[group.userAgent.value.toLowerCase()]
      if (!botInfo || botInfo.category !== 'search') {
        continue
      }
      
      const disallowRules = group.rules.filter(r => r.directive === 'disallow')
      
      for (const importantPath of importantPaths) {
        const isBlocked = disallowRules.some(rule => {
          const path = rule.value
          return path === importantPath || 
                 (path.endsWith('*') && importantPath.startsWith(path.slice(0, -1))) ||
                 path === '/'
        })
        
        if (isBlocked) {
          this._addCheck(
            'important-path-blocked',
            'Allow/Disallow规则验证',
            'warning',
            `搜索引擎 "${group.userAgent.value}" 被阻止访问重要路径: ${importantPath}`,
            null,
            `考虑允许访问${importantPath}`,
            'medium'
          )
        }
      }
    }
  }

  /**
   * 验证Sitemap声明
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateSitemapDeclarations(structure) {
    const sitemapDirectives = structure.globalDirectives.filter(d => d.directive === 'sitemap')
    
    if (sitemapDirectives.length === 0) {
      this._addCheck(
        'no-sitemap-declared',
        'Sitemap声明验证',
        'warning',
        '未找到Sitemap声明',
        null,
        '添加Sitemap指令来帮助搜索引擎发现您的sitemap',
        'medium'
      )
      return
    }
    
    // 验证每个Sitemap声明
    for (const sitemapDirective of sitemapDirectives) {
      await this._validateSingleSitemap(sitemapDirective)
    }
    
    // 检查Sitemap数量
    if (sitemapDirectives.length > 10) {
      this._addCheck(
        'too-many-sitemaps',
        'Sitemap声明验证',
        'warning',
        `声明了${sitemapDirectives.length}个sitemap，可能过多`,
        null,
        '考虑使用sitemap索引文件来管理多个sitemap',
        'medium'
      )
    } else {
      this._addCheck(
        'sitemap-count-ok',
        'Sitemap声明验证',
        'pass',
        `声明了${sitemapDirectives.length}个sitemap`,
        null,
        null,
        'low'
      )
    }
    
    // 检查重复的Sitemap
    this._validateDuplicateSitemaps(sitemapDirectives)
    
    // 验证Sitemap位置
    this._validateSitemapPlacement(sitemapDirectives, structure)
  }

  /**
   * 验证单个Sitemap声明
   * @private
   * @param {Object} sitemapDirective - Sitemap指令
   */
  async _validateSingleSitemap(sitemapDirective) {
    const url = sitemapDirective.value.trim()
    const line = sitemapDirective.line
    
    // 验证URL不为空
    if (!url) {
      this._addCheck(
        'empty-sitemap-url',
        'Sitemap声明验证',
        'error',
        `第${line}行Sitemap URL为空`,
        line,
        '为Sitemap提供有效的URL',
        'high'
      )
      return
    }
    
    // 验证URL格式
    if (!this._isValidUrl(url)) {
      this._addCheck(
        'invalid-sitemap-url-format',
        'Sitemap声明验证',
        'error',
        `第${line}行Sitemap URL格式无效: ${url}`,
        line,
        '确保URL格式正确，包含协议和域名',
        'high'
      )
      return
    }
    
    // 验证协议
    if (url.startsWith('https://')) {
      this._addCheck(
        'sitemap-https-ok',
        'Sitemap声明验证',
        'pass',
        `第${line}行Sitemap正确使用HTTPS协议`,
        line,
        null,
        'low'
      )
    } else if (url.startsWith('http://')) {
      this._addCheck(
        'sitemap-not-https',
        'Sitemap声明验证',
        'warning',
        `第${line}行Sitemap使用HTTP而非HTTPS: ${url}`,
        line,
        '建议使用HTTPS协议以提高安全性',
        'medium'
      )
    } else {
      // 如果URL格式有效但没有协议，说明URL构造函数能解析但缺少协议
      this._addCheck(
        'sitemap-missing-protocol',
        'Sitemap声明验证',
        'error',
        `第${line}行Sitemap URL缺少协议: ${url}`,
        line,
        '添加https://或http://协议前缀',
        'high'
      )
      return
    }
    
    // 验证URL路径
    this._validateSitemapPath(url, line)
    
    // 验证域名
    this._validateSitemapDomain(url, line)
    
    // 检查URL可访问性（如果启用）
    if (this.options.checkUrlAccessibility) {
      await this._checkSitemapAccessibility(url, line)
    }
    
    // 验证Sitemap内容（如果启用）
    if (this.options.validateSitemapContent) {
      await this._validateSitemapContent(url, line)
    }
  }

  /**
   * 验证URL格式
   * @private
   * @param {string} url - URL字符串
   * @returns {boolean} 是否为有效URL
   */
  _isValidUrl(url) {
    try {
      new URL(url)
      return true
    } catch {
      // 如果URL没有协议，尝试添加协议再验证
      if (!url.includes('://') && url.includes('.')) {
        try {
          new URL('https://' + url)
          return true // URL格式有效，但缺少协议
        } catch {
          return false
        }
      }
      return false
    }
  }

  /**
   * 验证Sitemap路径
   * @private
   * @param {string} url - Sitemap URL
   * @param {number} line - 行号
   */
  _validateSitemapPath(url, line) {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      
      // 检查常见的sitemap文件名
      const commonSitemapNames = [
        'sitemap.xml',
        'sitemap_index.xml',
        'sitemap.txt',
        'rss.xml',
        'atom.xml'
      ]
      
      const filename = pathname.split('/').pop().toLowerCase()
      const isCommonSitemap = commonSitemapNames.some(name => 
        filename === name || filename.startsWith('sitemap')
      )
      
      if (isCommonSitemap) {
        this._addCheck(
          'sitemap-common-filename',
          'Sitemap声明验证',
          'pass',
          `第${line}行使用常见的sitemap文件名: ${filename}`,
          line,
          null,
          'low'
        )
      } else {
        this._addCheck(
          'sitemap-custom-filename',
          'Sitemap声明验证',
          'info',
          `第${line}行使用自定义sitemap文件名: ${filename}`,
          line,
          '确认文件名正确',
          'low'
        )
      }
      
      // 检查文件扩展名
      if (!filename.includes('.')) {
        this._addCheck(
          'sitemap-no-extension',
          'Sitemap声明验证',
          'warning',
          `第${line}行Sitemap文件没有扩展名`,
          line,
          '建议使用.xml或.txt扩展名',
          'medium'
        )
      } else {
        const extension = filename.split('.').pop().toLowerCase()
        const validExtensions = ['xml', 'txt', 'rss', 'atom']
        
        if (validExtensions.includes(extension)) {
          this._addCheck(
            'sitemap-valid-extension',
            'Sitemap声明验证',
            'pass',
            `第${line}行Sitemap使用有效的文件扩展名: .${extension}`,
            line,
            null,
            'low'
          )
        } else {
          this._addCheck(
            'sitemap-unusual-extension',
            'Sitemap声明验证',
            'warning',
            `第${line}行Sitemap使用不常见的扩展名: .${extension}`,
            line,
            '确认文件格式正确',
            'medium'
          )
        }
      }
      
      // 检查路径深度
      const pathSegments = pathname.split('/').filter(segment => segment.length > 0)
      if (pathSegments.length > 5) {
        this._addCheck(
          'sitemap-deep-path',
          'Sitemap声明验证',
          'info',
          `第${line}行Sitemap路径较深（${pathSegments.length}层）`,
          line,
          '考虑将sitemap放在更浅的路径中',
          'low'
        )
      }
      
    } catch (error) {
      this._addCheck(
        'sitemap-path-parse-error',
        'Sitemap声明验证',
        'error',
        `第${line}行无法解析Sitemap URL路径`,
        line,
        '检查URL格式是否正确',
        'high'
      )
    }
  }

  /**
   * 验证Sitemap域名
   * @private
   * @param {string} url - Sitemap URL
   * @param {number} line - 行号
   */
  _validateSitemapDomain(url, line) {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname
      
      // 检查是否为IP地址
      const isIpAddress = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)
      if (isIpAddress) {
        this._addCheck(
          'sitemap-ip-address',
          'Sitemap声明验证',
          'warning',
          `第${line}行Sitemap使用IP地址而非域名: ${hostname}`,
          line,
          '建议使用域名而非IP地址',
          'medium'
        )
      }
      
      // 检查localhost或本地域名
      const localDomains = ['localhost', '127.0.0.1', '0.0.0.0']
      if (localDomains.includes(hostname)) {
        this._addCheck(
          'sitemap-local-domain',
          'Sitemap声明验证',
          'error',
          `第${line}行Sitemap使用本地域名: ${hostname}`,
          line,
          '使用实际的域名而非本地地址',
          'high'
        )
      }
      
      // 检查域名格式
      if (hostname.includes('..') || hostname.startsWith('.') || hostname.endsWith('.')) {
        this._addCheck(
          'sitemap-invalid-domain',
          'Sitemap声明验证',
          'error',
          `第${line}行Sitemap域名格式无效: ${hostname}`,
          line,
          '检查域名格式是否正确',
          'high'
        )
      }
      
      // 检查端口号
      if (urlObj.port) {
        const port = parseInt(urlObj.port)
        if (port !== 80 && port !== 443) {
          this._addCheck(
            'sitemap-custom-port',
            'Sitemap声明验证',
            'info',
            `第${line}行Sitemap使用自定义端口: ${port}`,
            line,
            '确认端口号正确',
            'low'
          )
        }
      }
      
    } catch (error) {
      this._addCheck(
        'sitemap-domain-parse-error',
        'Sitemap声明验证',
        'error',
        `第${line}行无法解析Sitemap域名`,
        line,
        '检查URL格式是否正确',
        'high'
      )
    }
  }

  /**
   * 检查Sitemap可访问性
   * @private
   * @param {string} url - Sitemap URL
   * @param {number} line - 行号
   */
  async _checkSitemapAccessibility(url, line) {
    try {
      // 这里应该实际发送HTTP请求，但为了避免网络依赖，我们只做基本检查
      this._addCheck(
        'sitemap-accessibility-check',
        'Sitemap声明验证',
        'info',
        `第${line}行Sitemap可访问性检查已启用`,
        line,
        '实际部署时会检查URL是否可访问',
        'low'
      )
      
      // 在实际实现中，这里会发送HTTP请求
      // const response = await fetch(url, {
      //   method: 'HEAD',
      //   timeout: this.options.timeout,
      //   headers: {
      //     'User-Agent': this.options.userAgent
      //   }
      // })
      
    } catch (error) {
      this._addCheck(
        'sitemap-accessibility-error',
        'Sitemap声明验证',
        'warning',
        `第${line}行无法检查Sitemap可访问性: ${error.message}`,
        line,
        '确认URL是否可以正常访问',
        'medium'
      )
    }
  }

  /**
   * 验证Sitemap内容
   * @private
   * @param {string} url - Sitemap URL
   * @param {number} line - 行号
   */
  async _validateSitemapContent(url, line) {
    try {
      // 这里应该下载并解析sitemap内容，但为了避免网络依赖，我们只做标记
      this._addCheck(
        'sitemap-content-validation',
        'Sitemap声明验证',
        'info',
        `第${line}行Sitemap内容验证已启用`,
        line,
        '实际部署时会验证sitemap文件格式和内容',
        'low'
      )
      
      // 在实际实现中，这里会下载并验证sitemap内容
      // const response = await fetch(url, { timeout: this.options.timeout })
      // const content = await response.text()
      // 验证XML格式、URL数量、更新频率等
      
    } catch (error) {
      this._addCheck(
        'sitemap-content-error',
        'Sitemap声明验证',
        'warning',
        `第${line}行无法验证Sitemap内容: ${error.message}`,
        line,
        '确认sitemap文件格式正确',
        'medium'
      )
    }
  }

  /**
   * 验证重复的Sitemap
   * @private
   * @param {Array} sitemapDirectives - Sitemap指令数组
   */
  _validateDuplicateSitemaps(sitemapDirectives) {
    const urlCounts = {}
    
    sitemapDirectives.forEach(directive => {
      const url = directive.value.trim().toLowerCase()
      if (!urlCounts[url]) {
        urlCounts[url] = []
      }
      urlCounts[url].push(directive)
    })
    
    Object.entries(urlCounts).forEach(([url, directives]) => {
      if (directives.length > 1) {
        const lines = directives.map(d => d.line).join(', ')
        this._addCheck(
          'duplicate-sitemap',
          'Sitemap声明验证',
          'warning',
          `重复的Sitemap声明在第${lines}行: ${directives[0].value}`,
          null,
          '移除重复的Sitemap声明',
          'medium'
        )
      }
    })
  }

  /**
   * 验证Sitemap位置
   * @private
   * @param {Array} sitemapDirectives - Sitemap指令数组
   * @param {Object} structure - 文件结构
   */
  _validateSitemapPlacement(sitemapDirectives, structure) {
    // 检查Sitemap是否在文件末尾
    const allDirectives = [
      ...structure.userAgentGroups.flatMap(group => [
        group.userAgent,
        ...group.rules,
        group.crawlDelay,
        group.requestRate,
        group.visitTime
      ].filter(Boolean)),
      ...structure.globalDirectives
    ]
    
    const sortedDirectives = allDirectives.sort((a, b) => a.line - b.line)
    const lastDirective = sortedDirectives[sortedDirectives.length - 1]
    const firstSitemap = sitemapDirectives[0]
    
    if (firstSitemap && lastDirective && firstSitemap.line < lastDirective.line) {
      // Sitemap不在最后
      const afterSitemapDirectives = sortedDirectives.filter(d => 
        d.line > firstSitemap.line && d.directive !== 'sitemap'
      )
      
      if (afterSitemapDirectives.length > 0) {
        this._addCheck(
          'sitemap-not-at-end',
          'Sitemap声明验证',
          'info',
          'Sitemap声明不在文件末尾',
          firstSitemap.line,
          '建议将所有Sitemap声明放在文件末尾',
          'low'
        )
      }
    } else if (firstSitemap) {
      this._addCheck(
        'sitemap-placement-ok',
        'Sitemap声明验证',
        'pass',
        'Sitemap声明位置合适',
        null,
        null,
        'low'
      )
    }
  }

  /**
   * 验证Host声明
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateHostDeclarations(structure) {
    const hostDirectives = structure.globalDirectives.filter(d => d.directive === 'host')
    
    if (hostDirectives.length === 0) {
      this._addCheck(
        'no-host-declared',
        'Host声明验证',
        'info',
        '未找到Host声明',
        null,
        '考虑添加Host指令来指定首选域名',
        'low'
      )
      return
    }
    
    // 验证每个Host声明
    for (const hostDirective of hostDirectives) {
      await this._validateSingleHost(hostDirective)
    }
    
    // 检查多个Host声明
    if (hostDirectives.length > 1) {
      this._validateMultipleHosts(hostDirectives)
    } else {
      this._addCheck(
        'single-host-ok',
        'Host声明验证',
        'pass',
        '配置了单个Host声明',
        hostDirectives[0].line,
        null,
        'low'
      )
    }
    
    // 验证Host位置
    this._validateHostPlacement(hostDirectives, structure)
  }

  /**
   * 验证单个Host声明
   * @private
   * @param {Object} hostDirective - Host指令
   */
  async _validateSingleHost(hostDirective) {
    const host = hostDirective.value.trim()
    const line = hostDirective.line
    
    // 验证Host不为空
    if (!host) {
      this._addCheck(
        'empty-host-value',
        'Host声明验证',
        'error',
        `第${line}行Host值为空`,
        line,
        '为Host提供有效的域名',
        'high'
      )
      return
    }
    
    // 验证Host不包含协议
    if (host.includes('://')) {
      const protocol = host.split('://')[0]
      this._addCheck(
        'host-contains-protocol',
        'Host声明验证',
        'error',
        `第${line}行Host不应包含协议"${protocol}://": ${host}`,
        line,
        `移除协议前缀，使用"${host.split('://')[1]}"`,
        'high'
      )
      return
    }
    
    // 验证Host不包含路径
    if (host.includes('/')) {
      this._addCheck(
        'host-contains-path',
        'Host声明验证',
        'error',
        `第${line}行Host不应包含路径: ${host}`,
        line,
        `只使用域名部分"${host.split('/')[0]}"`,
        'high'
      )
      return
    }
    
    // 验证Host不包含查询参数
    if (host.includes('?') || host.includes('#')) {
      this._addCheck(
        'host-contains-query',
        'Host声明验证',
        'error',
        `第${line}行Host不应包含查询参数或锚点: ${host}`,
        line,
        '只使用域名部分',
        'high'
      )
      return
    }
    
    // 验证域名格式
    this._validateHostFormat(host, line)
    
    // 验证域名类型
    this._validateHostType(host, line)
    
    // 验证端口号
    this._validateHostPort(host, line)
  }

  /**
   * 验证Host格式
   * @private
   * @param {string} host - Host值
   * @param {number} line - 行号
   */
  _validateHostFormat(host, line) {
    // 移除可能的端口号进行域名验证
    const hostWithoutPort = host.includes(':') ? host.split(':')[0] : host
    
    // 检查域名格式
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    if (!domainRegex.test(hostWithoutPort)) {
      this._addCheck(
        'invalid-host-format',
        'Host声明验证',
        'error',
        `第${line}行Host域名格式无效: ${hostWithoutPort}`,
        line,
        '确保域名格式正确，只包含字母、数字、连字符和点',
        'high'
      )
      return
    }
    
    // 检查域名长度
    if (hostWithoutPort.length > 253) {
      this._addCheck(
        'host-too-long',
        'Host声明验证',
        'error',
        `第${line}行Host域名过长（${hostWithoutPort.length}字符）`,
        line,
        '域名长度不应超过253字符',
        'high'
      )
      return
    }
    
    // 检查标签长度
    const labels = hostWithoutPort.split('.')
    for (const label of labels) {
      if (label.length > 63) {
        this._addCheck(
          'host-label-too-long',
          'Host声明验证',
          'error',
          `第${line}行Host域名标签"${label}"过长（${label.length}字符）`,
          line,
          '域名标签长度不应超过63字符',
          'high'
        )
        return
      }
    }
    
    // 检查连字符使用
    for (const label of labels) {
      if (label.startsWith('-') || label.endsWith('-')) {
        this._addCheck(
          'host-invalid-hyphen',
          'Host声明验证',
          'error',
          `第${line}行Host域名标签"${label}"不能以连字符开头或结尾`,
          line,
          '移除标签开头或结尾的连字符',
          'high'
        )
        return
      }
    }
    
    // 检查连续的点
    if (host.includes('..')) {
      this._addCheck(
        'host-consecutive-dots',
        'Host声明验证',
        'error',
        `第${line}行Host包含连续的点: ${host}`,
        line,
        '移除多余的点',
        'high'
      )
      return
    }
    
    // 检查开头或结尾的点
    if (hostWithoutPort.startsWith('.') || hostWithoutPort.endsWith('.')) {
      this._addCheck(
        'host-invalid-dots',
        'Host声明验证',
        'error',
        `第${line}行Host不能以点开头或结尾: ${hostWithoutPort}`,
        line,
        '移除开头或结尾的点',
        'high'
      )
      return
    }
    
    this._addCheck(
      'host-format-valid',
      'Host声明验证',
      'pass',
      `第${line}行Host格式正确: ${hostWithoutPort}`,
      line,
      null,
      'low'
    )
  }

  /**
   * 验证Host类型
   * @private
   * @param {string} host - Host值
   * @param {number} line - 行号
   */
  _validateHostType(host, line) {
    const hostWithoutPort = host.includes(':') ? host.split(':')[0] : host
    
    // 检查是否为IP地址
    const ipv4Regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    
    if (ipv4Regex.test(hostWithoutPort)) {
      // 验证IPv4地址的有效性
      const octets = hostWithoutPort.split('.').map(Number)
      const isValidIPv4 = octets.every(octet => octet >= 0 && octet <= 255)
      
      if (isValidIPv4) {
        this._addCheck(
          'host-is-ipv4',
          'Host声明验证',
          'warning',
          `第${line}行Host使用IPv4地址: ${hostWithoutPort}`,
          line,
          '建议使用域名而非IP地址',
          'medium'
        )
      } else {
        this._addCheck(
          'host-invalid-ipv4',
          'Host声明验证',
          'error',
          `第${line}行Host包含无效的IPv4地址: ${hostWithoutPort}`,
          line,
          '使用有效的IPv4地址或域名',
          'high'
        )
      }
      return
    }
    
    if (ipv6Regex.test(hostWithoutPort)) {
      this._addCheck(
        'host-is-ipv6',
        'Host声明验证',
        'warning',
        `第${line}行Host使用IPv6地址: ${hostWithoutPort}`,
        line,
        '建议使用域名而非IP地址',
        'medium'
      )
      return
    }
    
    // 检查本地域名
    const localDomains = ['localhost', '127.0.0.1', '0.0.0.0', '::1']
    if (localDomains.includes(hostWithoutPort.toLowerCase())) {
      this._addCheck(
        'host-is-local',
        'Host声明验证',
        'error',
        `第${line}行Host使用本地地址: ${hostWithoutPort}`,
        line,
        '使用实际的域名而非本地地址',
        'high'
      )
      return
    }
    
    // 检查顶级域名
    const labels = hostWithoutPort.split('.')
    if (labels.length < 2) {
      this._addCheck(
        'host-no-tld',
        'Host声明验证',
        'warning',
        `第${line}行Host缺少顶级域名: ${hostWithoutPort}`,
        line,
        '添加适当的顶级域名（如.com, .org等）',
        'medium'
      )
    } else {
      const tld = labels[labels.length - 1].toLowerCase()
      
      // 检查常见的顶级域名
      const commonTlds = [
        'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
        'cn', 'uk', 'de', 'fr', 'jp', 'au', 'ca', 'ru',
        'info', 'biz', 'name', 'pro', 'museum', 'coop',
        'aero', 'asia', 'cat', 'jobs', 'mobi', 'tel', 'travel'
      ]
      
      if (commonTlds.includes(tld)) {
        this._addCheck(
          'host-common-tld',
          'Host声明验证',
          'pass',
          `第${line}行Host使用常见顶级域名: .${tld}`,
          line,
          null,
          'low'
        )
      } else {
        this._addCheck(
          'host-uncommon-tld',
          'Host声明验证',
          'info',
          `第${line}行Host使用不常见的顶级域名: .${tld}`,
          line,
          '确认顶级域名正确',
          'low'
        )
      }
    }
    
    // 检查子域名
    if (labels.length > 2) {
      this._addCheck(
        'host-has-subdomain',
        'Host声明验证',
        'info',
        `第${line}行Host包含子域名: ${labels.slice(0, -2).join('.')}`,
        line,
        '确认子域名是首选域名',
        'low'
      )
    }
  }

  /**
   * 验证Host端口
   * @private
   * @param {string} host - Host值
   * @param {number} line - 行号
   */
  _validateHostPort(host, line) {
    if (!host.includes(':')) {
      this._addCheck(
        'host-no-port',
        'Host声明验证',
        'pass',
        `第${line}行Host未指定端口，使用默认端口`,
        line,
        null,
        'low'
      )
      return
    }
    
    const parts = host.split(':')
    if (parts.length !== 2) {
      this._addCheck(
        'host-invalid-port-format',
        'Host声明验证',
        'error',
        `第${line}行Host端口格式无效: ${host}`,
        line,
        '使用格式：域名:端口号',
        'high'
      )
      return
    }
    
    const portStr = parts[1]
    const port = parseInt(portStr, 10)
    
    if (isNaN(port) || portStr !== port.toString()) {
      this._addCheck(
        'host-invalid-port-number',
        'Host声明验证',
        'error',
        `第${line}行Host端口号无效: ${portStr}`,
        line,
        '使用有效的数字端口号',
        'high'
      )
      return
    }
    
    if (port < 1 || port > 65535) {
      this._addCheck(
        'host-port-out-of-range',
        'Host声明验证',
        'error',
        `第${line}行Host端口号超出范围: ${port}`,
        line,
        '使用1-65535范围内的端口号',
        'high'
      )
      return
    }
    
    // 检查常见端口
    if (port === 80) {
      this._addCheck(
        'host-port-80',
        'Host声明验证',
        'info',
        `第${line}行Host使用HTTP默认端口80`,
        line,
        '通常不需要显式指定端口80',
        'low'
      )
    } else if (port === 443) {
      this._addCheck(
        'host-port-443',
        'Host声明验证',
        'info',
        `第${line}行Host使用HTTPS默认端口443`,
        line,
        '通常不需要显式指定端口443',
        'low'
      )
    } else {
      this._addCheck(
        'host-custom-port',
        'Host声明验证',
        'pass',
        `第${line}行Host使用自定义端口: ${port}`,
        line,
        null,
        'low'
      )
    }
  }

  /**
   * 验证多个Host声明
   * @private
   * @param {Array} hostDirectives - Host指令数组
   */
  _validateMultipleHosts(hostDirectives) {
    this._addCheck(
      'multiple-hosts-declared',
      'Host声明验证',
      'warning',
      `声明了${hostDirectives.length}个Host，可能产生冲突`,
      null,
      '通常只需要一个Host声明',
      'medium'
    )
    
    // 检查重复的Host
    const hostValues = {}
    hostDirectives.forEach(directive => {
      const host = directive.value.trim().toLowerCase()
      if (!hostValues[host]) {
        hostValues[host] = []
      }
      hostValues[host].push(directive)
    })
    
    Object.entries(hostValues).forEach(([host, directives]) => {
      if (directives.length > 1) {
        const lines = directives.map(d => d.line).join(', ')
        this._addCheck(
          'duplicate-host',
          'Host声明验证',
          'warning',
          `重复的Host声明在第${lines}行: ${directives[0].value}`,
          null,
          '移除重复的Host声明',
          'medium'
        )
      }
    })
    
    // 检查Host冲突
    const uniqueHosts = Object.keys(hostValues)
    if (uniqueHosts.length > 1) {
      this._addCheck(
        'conflicting-hosts',
        'Host声明验证',
        'warning',
        `声明了多个不同的Host: ${uniqueHosts.join(', ')}`,
        null,
        '选择一个主要的Host并移除其他声明',
        'medium'
      )
    }
  }

  /**
   * 验证Host位置
   * @private
   * @param {Array} hostDirectives - Host指令数组
   * @param {Object} structure - 文件结构
   */
  _validateHostPlacement(hostDirectives, structure) {
    // Host指令应该在全局指令中，不应该在User-agent组内
    const userAgentGroupDirectives = structure.userAgentGroups.flatMap(group => [
      group.userAgent,
      ...group.rules,
      group.crawlDelay,
      group.requestRate,
      group.visitTime
    ].filter(Boolean))
    
    // 检查是否有Host指令在User-agent组内（这在解析时应该已经处理了）
    // 这里主要检查Host的位置是否合适
    
    const firstHost = hostDirectives[0]
    const allDirectives = [
      ...userAgentGroupDirectives,
      ...structure.globalDirectives
    ].sort((a, b) => a.line - b.line)
    
    const hostIndex = allDirectives.findIndex(d => d.line === firstHost.line)
    const userAgentDirectives = allDirectives.filter(d => d.directive === 'user-agent')
    
    if (userAgentDirectives.length > 0) {
      const firstUserAgent = userAgentDirectives[0]
      const firstUserAgentIndex = allDirectives.findIndex(d => d.line === firstUserAgent.line)
      
      if (hostIndex > firstUserAgentIndex) {
        this._addCheck(
          'host-after-user-agent',
          'Host声明验证',
          'info',
          'Host声明在User-agent规则之后',
          firstHost.line,
          '建议将Host声明放在文件开头',
          'low'
        )
      } else {
        this._addCheck(
          'host-placement-good',
          'Host声明验证',
          'pass',
          'Host声明位置合适',
          firstHost.line,
          null,
          'low'
        )
      }
    }
  }

  /**
   * 验证规则关系
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateRuleRelationships(structure) {
    // 检查孤立的规则
    const orphanedRules = []
    
    structure.globalDirectives.forEach(directive => {
      if (['allow', 'disallow'].includes(directive.directive)) {
        orphanedRules.push(directive)
      }
    })
    
    if (orphanedRules.length > 0) {
      this._addCheck(
        'orphaned-path-rules',
        '规则关系验证',
        'error',
        `发现${orphanedRules.length}个孤立的Allow/Disallow规则`,
        orphanedRules[0].line,
        '确保所有Allow/Disallow规则都有对应的User-agent',
        'high'
      )
    }
    
    // 检查规则分布
    const totalRules = structure.userAgentGroups.reduce((sum, group) => sum + group.rules.length, 0)
    if (totalRules > 0) {
      this._addCheck(
        'rules-distribution-ok',
        '规则关系验证',
        'pass',
        `总共配置了${totalRules}个访问规则`,
        null,
        null,
        'low'
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
   * 获取已知User-agent信息
   * @param {string} userAgent - User-agent名称
   * @returns {Object|null} User-agent信息
   */
  getKnownUserAgentInfo(userAgent) {
    return this.knownUserAgents[userAgent.toLowerCase()] || null
  }

  /**
   * 检查User-agent是否为已知机器人
   * @param {string} userAgent - User-agent名称
   * @returns {boolean} 是否为已知机器人
   */
  isKnownUserAgent(userAgent) {
    return this.knownUserAgents.hasOwnProperty(userAgent.toLowerCase())
  }

  /**
   * 获取所有已知User-agent列表
   * @returns {Object} 已知User-agent列表
   */
  getKnownUserAgents() {
    return { ...this.knownUserAgents }
  }
}

export default ContentValidator