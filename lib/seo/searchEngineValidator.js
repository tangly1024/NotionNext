/**
 * SearchEngineValidator - 搜索引擎特定规则验证器
 * 
 * 负责验证针对主要搜索引擎的特定规则，包括：
 * - Google、Bing、百度等搜索引擎的专门规则
 * - Crawl-delay设置的合理性检查
 * - 搜索引擎机器人的访问权限配置
 * - SEO最佳实践建议
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { ValidationCheck } from './robotsValidatorModels.js'

/**
 * 搜索引擎特定规则验证器类
 */
export class SearchEngineValidator {
  constructor(options = {}) {
    this.options = {
      // 验证选项
      strictMode: options.strictMode || false,
      checkCrawlDelayReasonableness: options.checkCrawlDelayReasonableness !== false,
      validateSearchEngineAccess: options.validateSearchEngineAccess !== false,
      
      // SEO优化选项
      recommendOptimalSettings: options.recommendOptimalSettings !== false,
      checkSEOBestPractices: options.checkSEOBestPractices !== false,
      analyzeIndexingStrategy: options.analyzeIndexingStrategy !== false,
      
      // 搜索引擎特定选项
      prioritizeGoogleBot: options.prioritizeGoogleBot !== false,
      checkBingSpecificRules: options.checkBingSpecificRules !== false,
      validateBaiduRules: options.validateBaiduRules !== false,
      
      ...options
    }
    
    // 主要搜索引擎配置
    this.searchEngines = {
      'googlebot': {
        name: 'Google',
        priority: 'critical',
        marketShare: 92.0,
        optimalCrawlDelay: { min: 0, max: 10, recommended: 1 },
        supportedDirectives: ['user-agent', 'allow', 'disallow', 'sitemap', 'crawl-delay'],
        specialFeatures: ['javascript-rendering', 'mobile-first-indexing', 'core-web-vitals'],
        recommendations: {
          allowCSSJS: true,
          allowImages: true,
          provideSitemap: true,
          useHTTPS: true
        }
      },
      'bingbot': {
        name: 'Microsoft Bing',
        priority: 'high',
        marketShare: 3.0,
        optimalCrawlDelay: { min: 0, max: 15, recommended: 2 },
        supportedDirectives: ['user-agent', 'allow', 'disallow', 'sitemap', 'crawl-delay'],
        specialFeatures: ['social-signals', 'exact-match-domains'],
        recommendations: {
          allowCSSJS: true,
          allowImages: true,
          provideSitemap: true,
          useHTTPS: true
        }
      },
      'baiduspider': {
        name: 'Baidu',
        priority: 'medium',
        marketShare: 1.0,
        optimalCrawlDelay: { min: 1, max: 30, recommended: 5 },
        supportedDirectives: ['user-agent', 'allow', 'disallow', 'sitemap'],
        specialFeatures: ['chinese-content-preference', 'icp-license-check'],
        recommendations: {
          allowCSSJS: false,
          allowImages: true,
          provideSitemap: true,
          useHTTPS: false
        }
      },
      'yandexbot': {
        name: 'Yandex',
        priority: 'medium',
        marketShare: 1.5,
        optimalCrawlDelay: { min: 0, max: 20, recommended: 3 },
        supportedDirectives: ['user-agent', 'allow', 'disallow', 'sitemap', 'crawl-delay', 'clean-param'],
        specialFeatures: ['cyrillic-content', 'regional-preferences'],
        recommendations: {
          allowCSSJS: true,
          allowImages: true,
          provideSitemap: true,
          useHTTPS: true
        }
      },
      'duckduckbot': {
        name: 'DuckDuckGo',
        priority: 'low',
        marketShare: 0.5,
        optimalCrawlDelay: { min: 0, max: 10, recommended: 2 },
        supportedDirectives: ['user-agent', 'allow', 'disallow', 'sitemap'],
        specialFeatures: ['privacy-focused', 'no-tracking'],
        recommendations: {
          allowCSSJS: true,
          allowImages: true,
          provideSitemap: true,
          useHTTPS: true
        }
      }
    }
    
    // 验证结果
    this.checks = []
  }  /**

   * 执行搜索引擎特定规则验证
   * @param {string} content - 文件内容
   * @param {Object} context - 验证上下文
   * @returns {ValidationCheck[]} 验证检查结果
   */
  async validate(content, context = {}) {
    this.checks = []
    
    try {
      // 解析内容结构
      const structure = this._parseContent(content)
      
      // 1. 验证主要搜索引擎配置
      await this._validateMajorSearchEngines(structure)
      
      // 2. 检查Crawl-delay设置合理性
      await this._validateCrawlDelaySettings(structure)
      
      // 3. 验证搜索引擎访问权限
      await this._validateSearchEngineAccess(structure)
      
      // 4. 分析SEO最佳实践
      await this._analyzeSEOBestPractices(structure)
      
      // 5. 检查索引策略
      await this._analyzeIndexingStrategy(structure)
      
      // 6. 生成SEO优化建议
      await this._generateSEORecommendations(structure)
      
      return this.checks
      
    } catch (error) {
      this._addCheck(
        'search-engine-validation-error',
        '搜索引擎验证错误',
        'error',
        `搜索引擎验证过程中发生错误: ${error.message}`,
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
      searchEngineGroups: new Map()
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
          rules: [],
          crawlDelay: null,
          requestRate: null,
          visitTime: null
        }
        structure.userAgentGroups.push(currentGroup)
        
        // 检查是否为已知搜索引擎
        const userAgentLower = value.toLowerCase()
        if (this.searchEngines[userAgentLower]) {
          structure.searchEngineGroups.set(userAgentLower, currentGroup)
        }
      } else if (currentGroup && ['allow', 'disallow', 'crawl-delay', 'request-rate', 'visit-time'].includes(directive)) {
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
        structure.globalDirectives.push(directiveObj)
      }
    })
    
    return structure
  }

  /**
   * 验证主要搜索引擎配置
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateMajorSearchEngines(structure) {
    const configuredEngines = Array.from(structure.searchEngineGroups.keys())
    const majorEngines = ['googlebot', 'bingbot']
    
    // 检查是否配置了主要搜索引擎
    for (const engine of majorEngines) {
      const engineConfig = this.searchEngines[engine]
      
      if (configuredEngines.includes(engine)) {
        const group = structure.searchEngineGroups.get(engine)
        this._addCheck(
          'major-search-engine-configured',
          '主要搜索引擎配置',
          'pass',
          `已配置${engineConfig.name}搜索引擎规则`,
          group.userAgent.line,
          null,
          'low'
        )
        
        // 验证特定搜索引擎的配置
        await this._validateSpecificSearchEngine(engine, group, engineConfig)
      } else {
        this._addCheck(
          'major-search-engine-missing',
          '主要搜索引擎配置',
          'warning',
          `未配置${engineConfig.name}搜索引擎规则`,
          null,
          `添加"User-agent: ${engine}"以优化${engineConfig.name}搜索`,
          engineConfig.priority === 'critical' ? 'high' : 'medium'
        )
      }
    }
    
    // 检查通配符规则对搜索引擎的影响
    this._analyzeWildcardImpact(structure)
    
    // 生成搜索引擎覆盖报告
    this._generateSearchEngineCoverage(structure, configuredEngines)
  }

  /**
   * 验证特定搜索引擎配置
   * @private
   * @param {string} engineName - 搜索引擎名称
   * @param {Object} group - User-agent组
   * @param {Object} engineConfig - 搜索引擎配置
   */
  async _validateSpecificSearchEngine(engineName, group, engineConfig) {
    const rules = group.rules
    const crawlDelay = group.crawlDelay
    
    // 检查规则数量
    if (rules.length === 0) {
      this._addCheck(
        'search-engine-no-rules',
        '搜索引擎规则配置',
        'warning',
        `${engineConfig.name}没有配置任何访问规则`,
        group.userAgent.line,
        '为搜索引擎添加适当的Allow或Disallow规则',
        'medium'
      )
    } else {
      this._addCheck(
        'search-engine-has-rules',
        '搜索引擎规则配置',
        'pass',
        `${engineConfig.name}配置了${rules.length}个访问规则`,
        group.userAgent.line,
        null,
        'low'
      )
    }
    
    // 验证Crawl-delay设置
    if (crawlDelay) {
      this._validateSearchEngineCrawlDelay(engineName, crawlDelay, engineConfig)
    }
    
    // 检查特定搜索引擎的最佳实践
    this._checkSearchEngineBestPractices(engineName, group, engineConfig)
  }

  /**
   * 验证搜索引擎Crawl-delay设置
   * @private
   * @param {string} engineName - 搜索引擎名称
   * @param {Object} crawlDelay - Crawl-delay指令
   * @param {Object} engineConfig - 搜索引擎配置
   */
  _validateSearchEngineCrawlDelay(engineName, crawlDelay, engineConfig) {
    const delay = parseFloat(crawlDelay.value)
    const optimal = engineConfig.optimalCrawlDelay
    
    if (isNaN(delay) || delay < 0) {
      return // 格式错误已在其他验证器中处理
    }
    
    if (delay >= optimal.min && delay <= optimal.max) {
      this._addCheck(
        'optimal-crawl-delay',
        'Crawl-delay优化',
        'pass',
        `${engineConfig.name}的Crawl-delay设置合理: ${delay}秒`,
        crawlDelay.line,
        null,
        'low'
      )
    } else if (delay > optimal.max) {
      this._addCheck(
        'excessive-crawl-delay',
        'Crawl-delay优化',
        'warning',
        `${engineConfig.name}的Crawl-delay过长: ${delay}秒（建议: ${optimal.recommended}秒）`,
        crawlDelay.line,
        `减少到${optimal.recommended}秒以提高抓取效率`,
        'medium'
      )
    } else {
      this._addCheck(
        'low-crawl-delay',
        'Crawl-delay优化',
        'info',
        `${engineConfig.name}的Crawl-delay较短: ${delay}秒`,
        crawlDelay.line,
        '确认服务器能够处理快速抓取',
        'low'
      )
    }
  }

  /**
   * 检查搜索引擎最佳实践
   * @private
   * @param {string} engineName - 搜索引擎名称
   * @param {Object} group - User-agent组
   * @param {Object} engineConfig - 搜索引擎配置
   */
  _checkSearchEngineBestPractices(engineName, group, engineConfig) {
    const rules = group.rules
    const recommendations = engineConfig.recommendations
    
    // 检查CSS/JS访问权限
    if (recommendations.allowCSSJS) {
      const cssJsBlocked = rules.some(rule => 
        rule.directive === 'disallow' && 
        (rule.value.includes('/css') || rule.value.includes('/js') || 
         rule.value.includes('.css') || rule.value.includes('.js'))
      )
      
      if (cssJsBlocked) {
        this._addCheck(
          'css-js-blocked',
          'SEO最佳实践',
          'warning',
          `${engineConfig.name}被阻止访问CSS/JS资源`,
          group.userAgent.line,
          '允许搜索引擎访问CSS和JavaScript文件以提高渲染质量',
          'medium'
        )
      } else {
        this._addCheck(
          'css-js-accessible',
          'SEO最佳实践',
          'pass',
          `${engineConfig.name}可以访问CSS/JS资源`,
          group.userAgent.line,
          null,
          'low'
        )
      }
    }
    
    // 检查图片访问权限
    if (recommendations.allowImages) {
      const imagesBlocked = rules.some(rule => 
        rule.directive === 'disallow' && 
        (rule.value.includes('/images') || rule.value.includes('/img') ||
         rule.value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i))
      )
      
      if (imagesBlocked) {
        this._addCheck(
          'images-blocked',
          'SEO最佳实践',
          'info',
          `${engineConfig.name}被阻止访问部分图片资源`,
          group.userAgent.line,
          '考虑允许搜索引擎访问重要图片以提高图片搜索排名',
          'low'
        )
      }
    }
    
    // 检查过度限制
    const rootBlocked = rules.some(rule => 
      rule.directive === 'disallow' && rule.value === '/'
    )
    
    if (rootBlocked) {
      this._addCheck(
        'search-engine-completely-blocked',
        'SEO最佳实践',
        'error',
        `${engineConfig.name}被完全阻止访问网站`,
        group.userAgent.line,
        '这将严重影响SEO，请检查是否为误配置',
        'critical'
      )
    }
  }  /**
  
 * 验证Crawl-delay设置合理性
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateCrawlDelaySettings(structure) {
    if (!this.options.checkCrawlDelayReasonableness) {
      return
    }
    
    const groupsWithDelay = structure.userAgentGroups.filter(g => g.crawlDelay)
    
    if (groupsWithDelay.length === 0) {
      this._addCheck(
        'no-crawl-delay-set',
        'Crawl-delay设置分析',
        'info',
        '未设置任何Crawl-delay',
        null,
        '考虑为高频访问的机器人设置适当的延迟',
        'low'
      )
      return
    }
    
    // 分析Crawl-delay分布
    const delays = groupsWithDelay.map(g => ({
      userAgent: g.userAgent.value,
      delay: parseFloat(g.crawlDelay.value),
      line: g.crawlDelay.line
    })).filter(d => !isNaN(d.delay))
    
    if (delays.length > 0) {
      const avgDelay = delays.reduce((sum, d) => sum + d.delay, 0) / delays.length
      const maxDelay = Math.max(...delays.map(d => d.delay))
      const minDelay = Math.min(...delays.map(d => d.delay))
      
      this._addCheck(
        'crawl-delay-distribution',
        'Crawl-delay设置分析',
        'pass',
        `Crawl-delay分布: 平均${avgDelay.toFixed(1)}秒, 范围${minDelay}-${maxDelay}秒`,
        null,
        null,
        'low'
      )
      
      // 检查异常值
      if (maxDelay > 60) {
        const extremeDelay = delays.find(d => d.delay === maxDelay)
        this._addCheck(
          'extreme-crawl-delay',
          'Crawl-delay设置分析',
          'warning',
          `${extremeDelay.userAgent}的Crawl-delay过长: ${maxDelay}秒`,
          extremeDelay.line,
          '过长的延迟可能严重影响抓取效率',
          'medium'
        )
      }
    }
  }

  /**
   * 验证搜索引擎访问权限
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _validateSearchEngineAccess(structure) {
    if (!this.options.validateSearchEngineAccess) {
      return
    }
    
    const wildcardGroups = structure.userAgentGroups.filter(g => g.userAgent.value === '*')
    const searchEngineGroups = Array.from(structure.searchEngineGroups.values())
    
    // 分析通配符规则对搜索引擎的影响
    if (wildcardGroups.length > 0) {
      const wildcardGroup = wildcardGroups[0]
      const hasRestrictiveRules = wildcardGroup.rules.some(rule => 
        rule.directive === 'disallow' && (rule.value === '/' || rule.value.length <= 3)
      )
      
      if (hasRestrictiveRules && searchEngineGroups.length === 0) {
        this._addCheck(
          'restrictive-wildcard-no-exceptions',
          '搜索引擎访问权限',
          'warning',
          '通配符规则限制性较强，但未为主要搜索引擎设置例外',
          wildcardGroup.userAgent.line,
          '考虑为Google、Bing等主要搜索引擎添加专门的规则',
          'medium'
        )
      }
    }
    
    // 检查搜索引擎的访问范围
    this._analyzeSearchEngineAccessScope(structure)
  }

  /**
   * 分析搜索引擎访问范围
   * @private
   * @param {Object} structure - 解析后的结构
   */
  _analyzeSearchEngineAccessScope(structure) {
    structure.searchEngineGroups.forEach((group, engineName) => {
      const engineConfig = this.searchEngines[engineName]
      const allowRules = group.rules.filter(r => r.directive === 'allow')
      const disallowRules = group.rules.filter(r => r.directive === 'disallow')
      
      let accessScope = 'unknown'
      let scopeDescription = ''
      
      if (disallowRules.length === 0) {
        accessScope = 'full'
        scopeDescription = '完全访问'
      } else if (disallowRules.some(r => r.value === '/')) {
        if (allowRules.length > 0) {
          accessScope = 'selective'
          scopeDescription = '选择性访问'
        } else {
          accessScope = 'blocked'
          scopeDescription = '完全阻止'
        }
      } else {
        accessScope = 'partial'
        scopeDescription = '部分限制'
      }
      
      const severity = accessScope === 'blocked' ? 'high' : 
                      accessScope === 'full' ? 'low' : 'medium'
      
      this._addCheck(
        'search-engine-access-scope',
        '搜索引擎访问范围',
        accessScope === 'blocked' ? 'error' : 'pass',
        `${engineConfig.name}访问范围: ${scopeDescription}`,
        group.userAgent.line,
        accessScope === 'blocked' ? '完全阻止搜索引擎将严重影响SEO' : null,
        severity
      )
    })
  }

  /**
   * 分析SEO最佳实践
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _analyzeSEOBestPractices(structure) {
    if (!this.options.checkSEOBestPractices) {
      return
    }
    
    // 检查Sitemap声明
    const sitemapDirectives = structure.globalDirectives.filter(d => d.directive === 'sitemap')
    
    if (sitemapDirectives.length === 0) {
      this._addCheck(
        'missing-sitemap-declaration',
        'SEO最佳实践',
        'warning',
        '未声明Sitemap，这可能影响搜索引擎发现内容',
        null,
        '添加Sitemap指令帮助搜索引擎更好地索引网站',
        'medium'
      )
    } else {
      this._addCheck(
        'sitemap-declared',
        'SEO最佳实践',
        'pass',
        `已声明${sitemapDirectives.length}个Sitemap`,
        sitemapDirectives[0].line,
        null,
        'low'
      )
    }
    
    // 检查重要页面的可访问性
    this._checkImportantPagesAccess(structure)
    
    // 分析机器人友好性
    this._analyzeBotFriendliness(structure)
  }

  /**
   * 检查重要页面的可访问性
   * @private
   * @param {Object} structure - 解析后的结构
   */
  _checkImportantPagesAccess(structure) {
    const importantPaths = [
      '/sitemap.xml',
      '/robots.txt',
      '/favicon.ico',
      '/manifest.json',
      '/.well-known/'
    ]
    
    const allDisallowRules = structure.userAgentGroups.flatMap(g => 
      g.rules.filter(r => r.directive === 'disallow')
    )
    
    importantPaths.forEach(path => {
      const isBlocked = allDisallowRules.some(rule => {
        const rulePath = rule.value
        return rulePath === path || 
               (rulePath.endsWith('*') && path.startsWith(rulePath.slice(0, -1))) ||
               rulePath === '/'
      })
      
      if (isBlocked) {
        this._addCheck(
          'important-page-blocked',
          'SEO最佳实践',
          'warning',
          `重要路径被阻止访问: ${path}`,
          null,
          `考虑允许搜索引擎访问${path}`,
          'medium'
        )
      }
    })
  }

  /**
   * 分析机器人友好性
   * @private
   * @param {Object} structure - 解析后的结构
   */
  _analyzeBotFriendliness(structure) {
    const totalGroups = structure.userAgentGroups.length
    const searchEngineGroups = structure.searchEngineGroups.size
    const wildcardGroups = structure.userAgentGroups.filter(g => g.userAgent.value === '*').length
    
    let friendlinessScore = 0
    let maxScore = 100
    
    // 搜索引擎覆盖度 (40分)
    if (searchEngineGroups >= 2) {
      friendlinessScore += 40
    } else if (searchEngineGroups === 1) {
      friendlinessScore += 25
    } else if (wildcardGroups > 0) {
      friendlinessScore += 15
    }
    
    // Sitemap声明 (20分)
    const hasSitemap = structure.globalDirectives.some(d => d.directive === 'sitemap')
    if (hasSitemap) {
      friendlinessScore += 20
    }
    
    // 规则合理性 (40分)
    const hasReasonableRules = structure.userAgentGroups.some(g => 
      g.rules.length > 0 && g.rules.length <= 10
    )
    if (hasReasonableRules) {
      friendlinessScore += 40
    }
    
    const friendlinessPercentage = Math.round((friendlinessScore / maxScore) * 100)
    
    if (friendlinessPercentage >= 80) {
      this._addCheck(
        'high-bot-friendliness',
        '机器人友好性分析',
        'pass',
        `机器人友好性优秀 (${friendlinessPercentage}%)`,
        null,
        null,
        'low'
      )
    } else if (friendlinessPercentage >= 60) {
      this._addCheck(
        'moderate-bot-friendliness',
        '机器人友好性分析',
        'info',
        `机器人友好性良好 (${friendlinessPercentage}%)`,
        null,
        '考虑添加更多搜索引擎规则和Sitemap声明',
        'low'
      )
    } else {
      this._addCheck(
        'low-bot-friendliness',
        '机器人友好性分析',
        'warning',
        `机器人友好性较低 (${friendlinessPercentage}%)`,
        null,
        '建议优化robots.txt配置以提高搜索引擎友好性',
        'medium'
      )
    }
  }

  /**
   * 分析索引策略
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _analyzeIndexingStrategy(structure) {
    if (!this.options.analyzeIndexingStrategy) {
      return
    }
    
    const allRules = structure.userAgentGroups.flatMap(g => g.rules)
    const allowRules = allRules.filter(r => r.directive === 'allow')
    const disallowRules = allRules.filter(r => r.directive === 'disallow')
    
    // 分析索引策略类型
    let strategyType = 'unknown'
    let strategyDescription = ''
    
    if (disallowRules.length === 0) {
      strategyType = 'open'
      strategyDescription = '开放式索引 - 允许访问所有内容'
    } else if (disallowRules.some(r => r.value === '/')) {
      if (allowRules.length > 0) {
        strategyType = 'whitelist'
        strategyDescription = '白名单式索引 - 默认禁止，选择性允许'
      } else {
        strategyType = 'blocked'
        strategyDescription = '阻止式索引 - 禁止所有访问'
      }
    } else {
      strategyType = 'blacklist'
      strategyDescription = '黑名单式索引 - 默认允许，选择性禁止'
    }
    
    this._addCheck(
      'indexing-strategy-analysis',
      '索引策略分析',
      'pass',
      `检测到索引策略: ${strategyDescription}`,
      null,
      null,
      'low'
    )
    
    // 根据策略类型提供建议
    this._provideStrategyRecommendations(strategyType, structure)
  }

  /**
   * 提供策略建议
   * @private
   * @param {string} strategyType - 策略类型
   * @param {Object} structure - 解析后的结构
   */
  _provideStrategyRecommendations(strategyType, structure) {
    switch (strategyType) {
      case 'open':
        this._addCheck(
          'open-strategy-recommendation',
          '索引策略建议',
          'info',
          '开放式策略适合内容丰富的网站',
          null,
          '确保没有敏感内容被意外暴露',
          'low'
        )
        break
        
      case 'whitelist':
        this._addCheck(
          'whitelist-strategy-recommendation',
          '索引策略建议',
          'info',
          '白名单策略提供精确控制',
          null,
          '确保重要页面都在允许列表中',
          'low'
        )
        break
        
      case 'blacklist':
        this._addCheck(
          'blacklist-strategy-recommendation',
          '索引策略建议',
          'pass',
          '黑名单策略是最常用的方式',
          null,
          '定期检查是否有新的敏感路径需要添加',
          'low'
        )
        break
        
      case 'blocked':
        this._addCheck(
          'blocked-strategy-warning',
          '索引策略建议',
          'error',
          '完全阻止策略将严重影响SEO',
          null,
          '除非是维护期间，否则不建议完全阻止搜索引擎',
          'high'
        )
        break
    }
  }

  /**
   * 生成SEO优化建议
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _generateSEORecommendations(structure) {
    if (!this.options.recommendOptimalSettings) {
      return
    }
    
    const recommendations = []
    
    // 检查是否配置了Google
    if (!structure.searchEngineGroups.has('googlebot')) {
      recommendations.push({
        priority: 'high',
        category: '搜索引擎配置',
        suggestion: '添加Google搜索引擎专门配置',
        reason: 'Google占据90%+的搜索市场份额',
        implementation: 'User-agent: Googlebot\nDisallow: /admin/\nAllow: /'
      })
    }
    
    // 检查Sitemap
    const hasSitemap = structure.globalDirectives.some(d => d.directive === 'sitemap')
    if (!hasSitemap) {
      recommendations.push({
        priority: 'medium',
        category: 'Sitemap配置',
        suggestion: '添加Sitemap声明',
        reason: '帮助搜索引擎发现和索引网站内容',
        implementation: 'Sitemap: https://yourdomain.com/sitemap.xml'
      })
    }
    
    // 检查CSS/JS访问
    const cssJsBlocked = structure.userAgentGroups.some(g => 
      g.rules.some(r => 
        r.directive === 'disallow' && 
        (r.value.includes('/css') || r.value.includes('/js'))
      )
    )
    
    if (cssJsBlocked) {
      recommendations.push({
        priority: 'medium',
        category: '资源访问',
        suggestion: '允许搜索引擎访问CSS和JavaScript',
        reason: '现代搜索引擎需要渲染页面以提供更好的索引',
        implementation: 'Allow: /css/\nAllow: /js/'
      })
    }
    
    // 生成建议报告
    if (recommendations.length > 0) {
      recommendations.forEach((rec, index) => {
        this._addCheck(
          `seo-recommendation-${index + 1}`,
          'SEO优化建议',
          'info',
          `${rec.category}: ${rec.suggestion}`,
          null,
          `${rec.reason}。建议实现: ${rec.implementation}`,
          rec.priority === 'high' ? 'medium' : 'low'
        )
      })
      
      this._addCheck(
        'seo-recommendations-summary',
        'SEO优化建议',
        'info',
        `生成了${recommendations.length}条SEO优化建议`,
        null,
        '实施这些建议可以提高搜索引擎优化效果',
        'low'
      )
    } else {
      this._addCheck(
        'seo-well-optimized',
        'SEO优化建议',
        'pass',
        'robots.txt配置已经很好地优化了SEO',
        null,
        null,
        'low'
      )
    }
  }

  /**
   * 分析通配符影响
   * @private
   * @param {Object} structure - 解析后的结构
   */
  _analyzeWildcardImpact(structure) {
    const wildcardGroups = structure.userAgentGroups.filter(g => g.userAgent.value === '*')
    const specificEngineGroups = structure.searchEngineGroups.size
    
    if (wildcardGroups.length > 0 && specificEngineGroups > 0) {
      this._addCheck(
        'wildcard-with-specific-engines',
        '通配符规则影响',
        'pass',
        `通配符规则与${specificEngineGroups}个特定搜索引擎规则共存`,
        wildcardGroups[0].userAgent.line,
        '特定搜索引擎规则会覆盖通配符规则',
        'low'
      )
    } else if (wildcardGroups.length > 0) {
      this._addCheck(
        'only-wildcard-rules',
        '通配符规则影响',
        'info',
        '只使用通配符规则，未针对特定搜索引擎优化',
        wildcardGroups[0].userAgent.line,
        '考虑为主要搜索引擎添加专门的规则',
        'low'
      )
    }
  }

  /**
   * 生成搜索引擎覆盖报告
   * @private
   * @param {Object} structure - 解析后的结构
   * @param {Array} configuredEngines - 已配置的搜索引擎
   */
  _generateSearchEngineCoverage(structure, configuredEngines) {
    const totalMarketShare = configuredEngines.reduce((sum, engine) => {
      return sum + (this.searchEngines[engine]?.marketShare || 0)
    }, 0)
    
    if (totalMarketShare >= 95) {
      this._addCheck(
        'excellent-search-engine-coverage',
        '搜索引擎覆盖度',
        'pass',
        `搜索引擎覆盖度优秀 (${totalMarketShare.toFixed(1)}%市场份额)`,
        null,
        null,
        'low'
      )
    } else if (totalMarketShare >= 90) {
      this._addCheck(
        'good-search-engine-coverage',
        '搜索引擎覆盖度',
        'pass',
        `搜索引擎覆盖度良好 (${totalMarketShare.toFixed(1)}%市场份额)`,
        null,
        null,
        'low'
      )
    } else {
      this._addCheck(
        'limited-search-engine-coverage',
        '搜索引擎覆盖度',
        'warning',
        `搜索引擎覆盖度有限 (${totalMarketShare.toFixed(1)}%市场份额)`,
        null,
        '考虑添加更多主要搜索引擎的配置',
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
   * 获取支持的搜索引擎列表
   * @returns {Object} 搜索引擎配置
   */
  getSupportedSearchEngines() {
    return { ...this.searchEngines }
  }

  /**
   * 检查是否为已知搜索引擎
   * @param {string} userAgent - User-agent名称
   * @returns {boolean} 是否为已知搜索引擎
   */
  isKnownSearchEngine(userAgent) {
    return this.searchEngines.hasOwnProperty(userAgent.toLowerCase())
  }

  /**
   * 获取搜索引擎配置
   * @param {string} userAgent - User-agent名称
   * @returns {Object|null} 搜索引擎配置
   */
  getSearchEngineConfig(userAgent) {
    return this.searchEngines[userAgent.toLowerCase()] || null
  }
}

export default SearchEngineValidator