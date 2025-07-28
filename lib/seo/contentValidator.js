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
    // 这个方法将在任务3.2中实现
    this._addCheck(
      'path-rules-placeholder',
      'Allow/Disallow规则验证',
      'info',
      '路径规则验证将在后续任务中实现',
      null,
      null,
      'low'
    )
  }

  /**
   * 验证Sitemap声明
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateSitemapDeclarations(structure) {
    // 这个方法将在任务3.3中实现
    this._addCheck(
      'sitemap-validation-placeholder',
      'Sitemap声明验证',
      'info',
      'Sitemap验证将在后续任务中实现',
      null,
      null,
      'low'
    )
  }

  /**
   * 验证Host声明
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateHostDeclarations(structure) {
    // 这个方法将在任务3.4中实现
    this._addCheck(
      'host-validation-placeholder',
      'Host声明验证',
      'info',
      'Host验证将在后续任务中实现',
      null,
      null,
      'low'
    )
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