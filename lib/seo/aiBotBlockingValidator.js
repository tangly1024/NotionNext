/**
 * AIBotBlockingValidator - AI机器人屏蔽验证器
 * 
 * 负责验证AI训练机器人的屏蔽配置，包括：
 * - AI机器人屏蔽规则的语法正确性
 * - AI机器人屏蔽配置的完整性
 * - AI机器人屏蔽的最佳实践建议
 * - 内容保护策略分析
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { ValidationCheck } from './robotsValidatorModels.js'

/**
 * AI机器人屏蔽验证器类
 */
export class AIBotBlockingValidator {
  constructor(options = {}) {
    this.options = {
      // 验证选项
      strictMode: options.strictMode || false,
      checkAIBotBlocking: options.checkAIBotBlocking !== false,
      validateBlockingCompleteness: options.validateBlockingCompleteness !== false,
      
      // AI保护选项
      recommendAIProtection: options.recommendAIProtection !== false,
      analyzeContentProtection: options.analyzeContentProtection !== false,
      checkLegalCompliance: options.checkLegalCompliance !== false,
      
      ...options
    }
    
    // AI机器人数据库
    this.aiBots = {
      // OpenAI
      'gptbot': {
        name: 'OpenAI GPT',
        company: 'OpenAI',
        purpose: 'AI训练',
        riskLevel: 'high',
        blockRecommended: true,
        description: 'OpenAI的网页抓取机器人，用于训练GPT模型'
      },
      'chatgpt-user': {
        name: 'ChatGPT User',
        company: 'OpenAI',
        purpose: 'AI训练',
        riskLevel: 'high',
        blockRecommended: true,
        description: 'ChatGPT用户代理'
      },
      
      // Anthropic
      'anthropic-ai': {
        name: 'Anthropic AI',
        company: 'Anthropic',
        purpose: 'AI训练',
        riskLevel: 'high',
        blockRecommended: true,
        description: 'Anthropic的AI训练机器人'
      },
      'claude-web': {
        name: 'Claude Web',
        company: 'Anthropic',
        purpose: 'AI训练',
        riskLevel: 'high',
        blockRecommended: true,
        description: 'Claude AI的网页访问机器人'
      },
      
      // Common Crawl
      'ccbot': {
        name: 'Common Crawl',
        company: 'Common Crawl',
        purpose: 'AI训练数据收集',
        riskLevel: 'medium',
        blockRecommended: true,
        description: '通用爬虫，数据常被AI公司使用'
      },
      
      // Google AI
      'google-extended': {
        name: 'Google Extended',
        company: 'Google',
        purpose: 'AI训练',
        riskLevel: 'medium',
        blockRecommended: false,
        description: 'Google的AI训练数据收集（可选择退出）'
      },
      
      // Meta
      'meta-externalagent': {
        name: 'Meta External Agent',
        company: 'Meta',
        purpose: 'AI训练',
        riskLevel: 'medium',
        blockRecommended: true,
        description: 'Meta的外部数据收集代理'
      },
      
      // 其他AI机器人
      'perplexitybot': {
        name: 'Perplexity Bot',
        company: 'Perplexity AI',
        purpose: 'AI搜索',
        riskLevel: 'low',
        blockRecommended: false,
        description: 'Perplexity AI搜索引擎机器人'
      },
      
      'bytespider': {
        name: 'ByteSpider',
        company: 'ByteDance',
        purpose: 'AI训练',
        riskLevel: 'medium',
        blockRecommended: true,
        description: '字节跳动的网页抓取机器人'
      }
    }
    
    // 验证结果
    this.checks = []
  }

  /**
   * 执行AI机器人屏蔽验证
   * @param {string} content - 文件内容
   * @param {Object} context - 验证上下文
   * @returns {ValidationCheck[]} 验证检查结果
   */
  async validate(content, context = {}) {
    this.checks = []
    
    try {
      // 解析内容结构
      const structure = this._parseContent(content)
      
      // 1. 检查AI机器人屏蔽配置
      await this._checkAIBotBlocking(structure)
      
      // 2. 验证屏蔽配置完整性
      await this._validateBlockingCompleteness(structure)
      
      // 3. 分析内容保护策略
      await this._analyzeContentProtection(structure)
      
      // 4. 生成AI保护建议
      await this._generateAIProtectionRecommendations(structure)
      
      return this.checks
      
    } catch (error) {
      this._addCheck(
        'ai-bot-validation-error',
        'AI机器人验证错误',
        'error',
        `AI机器人验证过程中发生错误: ${error.message}`,
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
      aiBotGroups: new Map(),
      blockedAIBots: new Set(),
      allowedAIBots: new Set()
    }
    
    let currentGroup = null
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1
      const trimmed = line.trim()
      
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes(':')) {
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
        currentGroup = {
          userAgent: directiveObj,
          rules: []
        }
        structure.userAgentGroups.push(currentGroup)
        
        // 检查是否为AI机器人
        const userAgentLower = value.toLowerCase()
        if (this.aiBots[userAgentLower]) {
          structure.aiBotGroups.set(userAgentLower, currentGroup)
        }
      } else if (currentGroup && ['allow', 'disallow'].includes(directive)) {
        currentGroup.rules.push(directiveObj)
        
        // 分析AI机器人的访问权限
        const userAgentLower = currentGroup.userAgent.value.toLowerCase()
        if (this.aiBots[userAgentLower]) {
          if (directive === 'disallow' && (value === '/' || value === '')) {
            structure.blockedAIBots.add(userAgentLower)
          } else if (directive === 'allow' && (value === '/' || value === '')) {
            structure.allowedAIBots.add(userAgentLower)
          }
        }
      }
    })
    
    return structure
  }

  /**
   * 检查AI机器人屏蔽配置
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _checkAIBotBlocking(structure) {
    const configuredAIBots = Array.from(structure.aiBotGroups.keys())
    const blockedAIBots = Array.from(structure.blockedAIBots)
    const allowedAIBots = Array.from(structure.allowedAIBots)
    
    // 检查已配置的AI机器人
    if (configuredAIBots.length === 0) {
      this._addCheck(
        'no-ai-bot-rules',
        'AI机器人屏蔽检查',
        'warning',
        '未发现任何AI机器人的专门配置',
        null,
        '考虑添加AI机器人屏蔽规则以保护内容',
        'medium'
      )
    } else {
      this._addCheck(
        'ai-bot-rules-found',
        'AI机器人屏蔽检查',
        'pass',
        `发现${configuredAIBots.length}个AI机器人的配置`,
        null,
        null,
        'low'
      )
    }
    
    // 分析每个配置的AI机器人
    for (const botName of configuredAIBots) {
      const botConfig = this.aiBots[botName]
      const group = structure.aiBotGroups.get(botName)
      
      this._analyzeAIBotConfiguration(botName, botConfig, group, structure)
    }
    
    // 检查高风险AI机器人的屏蔽情况
    this._checkHighRiskAIBots(structure)
  }

  /**
   * 分析AI机器人配置
   * @private
   * @param {string} botName - 机器人名称
   * @param {Object} botConfig - 机器人配置
   * @param {Object} group - User-agent组
   * @param {Object} structure - 解析后的结构
   */
  _analyzeAIBotConfiguration(botName, botConfig, group, structure) {
    const isBlocked = structure.blockedAIBots.has(botName)
    const isAllowed = structure.allowedAIBots.has(botName)
    
    if (isBlocked) {
      this._addCheck(
        'ai-bot-blocked',
        'AI机器人屏蔽分析',
        'pass',
        `${botConfig.name}已被正确屏蔽`,
        group.userAgent.line,
        null,
        'low'
      )
    } else if (isAllowed) {
      if (botConfig.blockRecommended) {
        this._addCheck(
          'high-risk-ai-bot-allowed',
          'AI机器人屏蔽分析',
          'warning',
          `高风险AI机器人${botConfig.name}被允许访问`,
          group.userAgent.line,
          `考虑屏蔽${botConfig.name}以保护内容版权`,
          'medium'
        )
      } else {
        this._addCheck(
          'low-risk-ai-bot-allowed',
          'AI机器人屏蔽分析',
          'info',
          `低风险AI机器人${botConfig.name}被允许访问`,
          group.userAgent.line,
          null,
          'low'
        )
      }
    } else {
      this._addCheck(
        'ai-bot-partial-access',
        'AI机器人屏蔽分析',
        'info',
        `${botConfig.name}有部分访问权限`,
        group.userAgent.line,
        '检查具体的访问规则是否符合预期',
        'low'
      )
    }
  }

  /**
   * 检查高风险AI机器人
   * @private
   * @param {Object} structure - 解析后的结构
   */
  _checkHighRiskAIBots(structure) {
    const highRiskBots = Object.entries(this.aiBots)
      .filter(([_, config]) => config.riskLevel === 'high' && config.blockRecommended)
      .map(([name, _]) => name)
    
    const configuredHighRiskBots = highRiskBots.filter(bot => 
      structure.aiBotGroups.has(bot)
    )
    
    const unconfiguredHighRiskBots = highRiskBots.filter(bot => 
      !structure.aiBotGroups.has(bot)
    )
    
    if (unconfiguredHighRiskBots.length > 0) {
      this._addCheck(
        'unconfigured-high-risk-ai-bots',
        'AI机器人屏蔽检查',
        'warning',
        `${unconfiguredHighRiskBots.length}个高风险AI机器人未配置屏蔽规则`,
        null,
        `建议屏蔽: ${unconfiguredHighRiskBots.map(bot => this.aiBots[bot].name).join(', ')}`,
        'medium'
      )
    }
    
    if (configuredHighRiskBots.length > 0) {
      const blockedCount = configuredHighRiskBots.filter(bot => 
        structure.blockedAIBots.has(bot)
      ).length
      
      this._addCheck(
        'high-risk-ai-bot-protection',
        'AI机器人屏蔽检查',
        'pass',
        `${blockedCount}/${configuredHighRiskBots.length}个高风险AI机器人已被屏蔽`,
        null,
        null,
        'low'
      )
    }
  }

  /**
   * 验证屏蔽配置完整性
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateBlockingCompleteness(structure) {
    if (!this.options.validateBlockingCompleteness) {
      return
    }
    
    const totalAIBots = Object.keys(this.aiBots).length
    const configuredAIBots = structure.aiBotGroups.size
    const blockedAIBots = structure.blockedAIBots.size
    
    const completenessScore = Math.round((configuredAIBots / totalAIBots) * 100)
    const blockingEffectiveness = configuredAIBots > 0 ? 
      Math.round((blockedAIBots / configuredAIBots) * 100) : 0
    
    if (completenessScore >= 70) {
      this._addCheck(
        'high-ai-bot-coverage',
        '屏蔽配置完整性',
        'pass',
        `AI机器人覆盖度高 (${completenessScore}%)`,
        null,
        null,
        'low'
      )
    } else if (completenessScore >= 40) {
      this._addCheck(
        'moderate-ai-bot-coverage',
        '屏蔽配置完整性',
        'info',
        `AI机器人覆盖度中等 (${completenessScore}%)`,
        null,
        '考虑添加更多AI机器人的屏蔽规则',
        'low'
      )
    } else {
      this._addCheck(
        'low-ai-bot-coverage',
        '屏蔽配置完整性',
        'warning',
        `AI机器人覆盖度较低 (${completenessScore}%)`,
        null,
        '建议增加AI机器人屏蔽配置以保护内容',
        'medium'
      )
    }
    
    if (blockingEffectiveness >= 80) {
      this._addCheck(
        'effective-ai-blocking',
        '屏蔽配置完整性',
        'pass',
        `AI机器人屏蔽效果好 (${blockingEffectiveness}%被屏蔽)`,
        null,
        null,
        'low'
      )
    } else {
      this._addCheck(
        'ineffective-ai-blocking',
        '屏蔽配置完整性',
        'warning',
        `AI机器人屏蔽效果有限 (${blockingEffectiveness}%被屏蔽)`,
        null,
        '考虑加强AI机器人的屏蔽力度',
        'medium'
      )
    }
  }

  /**
   * 分析内容保护策略
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _analyzeContentProtection(structure) {
    if (!this.options.analyzeContentProtection) {
      return
    }
    
    const hasWildcardBlocking = structure.userAgentGroups.some(group => 
      group.userAgent.value === '*' && 
      group.rules.some(rule => rule.directive === 'disallow' && rule.value === '/')
    )
    
    const hasSelectiveAIBlocking = structure.aiBotGroups.size > 0
    
    let protectionStrategy = 'unknown'
    let strategyDescription = ''
    
    if (hasWildcardBlocking && !hasSelectiveAIBlocking) {
      protectionStrategy = 'blanket-blocking'
      strategyDescription = '全面屏蔽策略 - 阻止所有机器人'
    } else if (!hasWildcardBlocking && hasSelectiveAIBlocking) {
      protectionStrategy = 'selective-ai-blocking'
      strategyDescription = '选择性AI屏蔽策略 - 仅屏蔽特定AI机器人'
    } else if (hasWildcardBlocking && hasSelectiveAIBlocking) {
      protectionStrategy = 'layered-protection'
      strategyDescription = '分层保护策略 - 全面屏蔽+特定AI规则'
    } else {
      protectionStrategy = 'minimal-protection'
      strategyDescription = '最小保护策略 - 基本无AI屏蔽'
    }
    
    this._addCheck(
      'content-protection-strategy',
      '内容保护策略分析',
      'pass',
      `检测到保护策略: ${strategyDescription}`,
      null,
      null,
      'low'
    )
    
    // 根据策略提供建议
    this._provideProtectionStrategyAdvice(protectionStrategy, structure)
  }

  /**
   * 提供保护策略建议
   * @private
   * @param {string} strategy - 保护策略
   * @param {Object} structure - 解析后的结构
   */
  _provideProtectionStrategyAdvice(strategy, structure) {
    switch (strategy) {
      case 'blanket-blocking':
        this._addCheck(
          'blanket-blocking-advice',
          '内容保护策略建议',
          'warning',
          '全面屏蔽可能影响合法搜索引擎',
          null,
          '考虑为搜索引擎添加例外规则',
          'medium'
        )
        break
        
      case 'selective-ai-blocking':
        this._addCheck(
          'selective-blocking-advice',
          '内容保护策略建议',
          'pass',
          '选择性AI屏蔽是推荐的平衡策略',
          null,
          '继续监控新出现的AI机器人',
          'low'
        )
        break
        
      case 'layered-protection':
        this._addCheck(
          'layered-protection-advice',
          '内容保护策略建议',
          'pass',
          '分层保护提供了最强的内容保护',
          null,
          '确保搜索引擎有适当的访问权限',
          'low'
        )
        break
        
      case 'minimal-protection':
        this._addCheck(
          'minimal-protection-advice',
          '内容保护策略建议',
          'warning',
          '当前保护策略可能不足以防止AI训练',
          null,
          '建议添加AI机器人屏蔽规则',
          'medium'
        )
        break
    }
  }

  /**
   * 生成AI保护建议
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _generateAIProtectionRecommendations(structure) {
    if (!this.options.recommendAIProtection) {
      return
    }
    
    const recommendations = []
    
    // 检查高风险AI机器人
    const highRiskBots = Object.entries(this.aiBots)
      .filter(([_, config]) => config.riskLevel === 'high' && config.blockRecommended)
    
    const unprotectedHighRiskBots = highRiskBots.filter(([name, _]) => 
      !structure.aiBotGroups.has(name) || !structure.blockedAIBots.has(name)
    )
    
    if (unprotectedHighRiskBots.length > 0) {
      unprotectedHighRiskBots.forEach(([name, config]) => {
        recommendations.push({
          priority: 'high',
          category: 'AI机器人屏蔽',
          botName: name,
          suggestion: `屏蔽${config.name}`,
          reason: config.description,
          implementation: `User-agent: ${name}\nDisallow: /`
        })
      })
    }
    
    // 检查是否需要通用AI保护
    if (structure.aiBotGroups.size === 0) {
      recommendations.push({
        priority: 'medium',
        category: '通用AI保护',
        suggestion: '添加基础AI机器人屏蔽',
        reason: '保护内容不被用于AI训练',
        implementation: 'User-agent: GPTBot\nDisallow: /\n\nUser-agent: ChatGPT-User\nDisallow: /'
      })
    }
    
    // 生成建议报告
    if (recommendations.length > 0) {
      recommendations.forEach((rec, index) => {
        this._addCheck(
          `ai-protection-recommendation-${index + 1}`,
          'AI保护建议',
          'info',
          `${rec.category}: ${rec.suggestion}`,
          null,
          `${rec.reason}。建议实现: ${rec.implementation}`,
          rec.priority === 'high' ? 'medium' : 'low'
        )
      })
      
      this._addCheck(
        'ai-protection-recommendations-summary',
        'AI保护建议',
        'info',
        `生成了${recommendations.length}条AI保护建议`,
        null,
        '实施这些建议可以更好地保护您的内容',
        'low'
      )
    } else {
      this._addCheck(
        'ai-protection-adequate',
        'AI保护建议',
        'pass',
        'AI机器人保护配置已经比较完善',
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
   * 获取支持的AI机器人列表
   * @returns {Object} AI机器人配置
   */
  getSupportedAIBots() {
    return { ...this.aiBots }
  }

  /**
   * 检查是否为已知AI机器人
   * @param {string} userAgent - User-agent名称
   * @returns {boolean} 是否为已知AI机器人
   */
  isKnownAIBot(userAgent) {
    return this.aiBots.hasOwnProperty(userAgent.toLowerCase())
  }

  /**
   * 获取AI机器人配置
   * @param {string} userAgent - User-agent名称
   * @returns {Object|null} AI机器人配置
   */
  getAIBotConfig(userAgent) {
    return this.aiBots[userAgent.toLowerCase()] || null
  }

  /**
   * 获取推荐屏蔽的AI机器人列表
   * @returns {Array} 推荐屏蔽的AI机器人列表
   */
  getRecommendedBlockList() {
    return Object.entries(this.aiBots)
      .filter(([_, config]) => config.blockRecommended)
      .map(([name, config]) => ({
        name,
        displayName: config.name,
        company: config.company,
        riskLevel: config.riskLevel,
        description: config.description
      }))
  }
}

export default AIBotBlockingValidator