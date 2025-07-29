/**
 * RuleConflictDetector - 规则冲突检测器
 * 
 * 负责检测robots.txt文件中的规则冲突，包括：
 * - Allow和Disallow规则之间的冲突
 * - 同一User-agent的重复或矛盾规则
 * - 规则优先级和执行顺序问题
 * - 路径覆盖和包含关系分析
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { ValidationCheck } from './robotsValidatorModels.js'

/**
 * 规则冲突检测器类
 */
export class RuleConflictDetector {
  constructor(options = {}) {
    this.options = {
      // 检测选项
      strictMode: options.strictMode || false,
      checkPathOverlaps: options.checkPathOverlaps !== false,
      analyzeWildcards: options.analyzeWildcards !== false,
      
      // 冲突严重程度设置
      exactMatchSeverity: options.exactMatchSeverity || 'high',
      pathOverlapSeverity: options.pathOverlapSeverity || 'medium',
      duplicateRuleSeverity: options.duplicateRuleSeverity || 'medium',
      
      // 分析深度
      maxPathDepth: options.maxPathDepth || 10,
      maxRuleAnalysis: options.maxRuleAnalysis || 100,
      
      ...options
    }
    
    // 验证结果
    this.checks = []
    this.conflictMatrix = new Map()
  }

  /**
   * 执行规则冲突检测
   * @param {string} content - 文件内容
   * @param {Object} context - 验证上下文
   * @returns {ValidationCheck[]} 验证检查结果
   */
  async validate(content, context = {}) {
    this.checks = []
    this.conflictMatrix.clear()
    
    try {
      // 解析内容结构
      const structure = this._parseContent(content)
      
      // 1. 检测User-agent组内的规则冲突
      await this._detectIntraGroupConflicts(structure)
      
      // 2. 检测User-agent组间的规则冲突
      await this._detectInterGroupConflicts(structure)
      
      // 3. 分析规则优先级问题
      await this._analyzeRulePriority(structure)
      
      // 4. 检测重复和冗余规则
      await this._detectDuplicateRules(structure)
      
      // 5. 分析路径覆盖关系
      await this._analyzePathCoverage(structure)
      
      // 6. 生成冲突摘要报告
      await this._generateConflictSummary(structure)
      
      return this.checks
      
    } catch (error) {
      this._addCheck(
        'conflict-detection-error',
        '规则冲突检测错误',
        'error',
        `规则冲突检测过程中发生错误: ${error.message}`,
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
      allRules: []
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
      } else if (currentGroup && ['allow', 'disallow'].includes(directive)) {
        currentGroup.rules.push(directiveObj)
        structure.allRules.push({
          ...directiveObj,
          userAgent: currentGroup.userAgent.value,
          groupIndex: structure.userAgentGroups.length - 1
        })
      } else if (currentGroup && ['crawl-delay', 'request-rate', 'visit-time'].includes(directive)) {
        if (directive === 'crawl-delay') {
          currentGroup.crawlDelay = directiveObj
        } else if (directive === 'request-rate') {
          currentGroup.requestRate = directiveObj
        } else if (directive === 'visit-time') {
          currentGroup.visitTime = directiveObj
        }
      } else {
        structure.globalDirectives.push(directiveObj)
      }
    })
    
    return structure
  }

  /**
   * 检测User-agent组内的规则冲突
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _detectIntraGroupConflicts(structure) {
    for (let i = 0; i < structure.userAgentGroups.length; i++) {
      const group = structure.userAgentGroups[i]
      await this._analyzeGroupConflicts(group, i)
    }
  }

  /**
   * 分析单个User-agent组的冲突
   * @private
   * @param {Object} group - User-agent组
   * @param {number} groupIndex - 组索引
   */
  async _analyzeGroupConflicts(group, groupIndex) {
    const userAgent = group.userAgent.value
    const rules = group.rules
    
    if (rules.length < 2) {
      return // 规则太少，无法产生冲突
    }
    
    const allowRules = rules.filter(r => r.directive === 'allow')
    const disallowRules = rules.filter(r => r.directive === 'disallow')
    
    // 检测Allow和Disallow之间的冲突
    for (const allowRule of allowRules) {
      for (const disallowRule of disallowRules) {
        const conflict = this._analyzeRuleConflict(allowRule, disallowRule, userAgent)
        if (conflict) {
          this._addCheck(
            'intra-group-rule-conflict',
            '组内规则冲突检测',
            'warning',
            conflict.message,
            conflict.line,
            conflict.suggestion,
            conflict.severity
          )
          
          this._recordConflict(allowRule, disallowRule, conflict.type, groupIndex)
        }
      }
    }
    
    // 检测同类型规则的重复
    this._detectSameTypeConflicts(allowRules, 'allow', userAgent, groupIndex)
    this._detectSameTypeConflicts(disallowRules, 'disallow', userAgent, groupIndex)
  }

  /**
   * 分析两个规则之间的冲突
   * @private
   * @param {Object} rule1 - 第一个规则
   * @param {Object} rule2 - 第二个规则
   * @param {string} userAgent - User-agent值
   * @returns {Object|null} 冲突信息
   */
  _analyzeRuleConflict(rule1, rule2, userAgent) {
    const path1 = rule1.value
    const path2 = rule2.value
    const directive1 = rule1.directive
    const directive2 = rule2.directive
    
    // 完全相同的路径
    if (path1 === path2) {
      return {
        type: 'exact-match',
        message: `User-agent "${userAgent}" 的${directive1}和${directive2}规则完全冲突: ${path1}`,
        line: rule1.line,
        suggestion: '移除重复的规则或明确优先级',
        severity: this.options.exactMatchSeverity
      }
    }
    
    // 检查路径包含关系
    const containmentResult = this._checkPathContainment(path1, path2)
    if (containmentResult) {
      return {
        type: 'path-overlap',
        message: `User-agent "${userAgent}" 的规则可能冲突: ${directive1} "${path1}" 与 ${directive2} "${path2}" ${containmentResult.relationship}`,
        line: rule1.line,
        suggestion: containmentResult.suggestion,
        severity: this.options.pathOverlapSeverity
      }
    }
    
    // 检查通配符冲突
    if (this.options.analyzeWildcards) {
      const wildcardConflict = this._checkWildcardConflict(path1, path2, directive1, directive2)
      if (wildcardConflict) {
        return {
          type: 'wildcard-conflict',
          message: `User-agent "${userAgent}" 的通配符规则冲突: ${directive1} "${path1}" 与 ${directive2} "${path2}"`,
          line: rule1.line,
          suggestion: wildcardConflict.suggestion,
          severity: 'medium'
        }
      }
    }
    
    return null
  }

  /**
   * 检查路径包含关系
   * @private
   * @param {string} path1 - 第一个路径
   * @param {string} path2 - 第二个路径
   * @returns {Object|null} 包含关系信息
   */
  _checkPathContainment(path1, path2) {
    // 移除结尾的通配符和锚点进行比较
    const cleanPath1 = path1.replace(/[\*\$]+$/, '')
    const cleanPath2 = path2.replace(/[\*\$]+$/, '')
    
    if (cleanPath1.startsWith(cleanPath2) && cleanPath1 !== cleanPath2) {
      return {
        relationship: '被包含',
        suggestion: `检查"${path1}"是否应该被"${path2}"规则覆盖`
      }
    }
    
    if (cleanPath2.startsWith(cleanPath1) && cleanPath1 !== cleanPath2) {
      return {
        relationship: '包含',
        suggestion: `检查"${path2}"是否应该被"${path1}"规则覆盖`
      }
    }
    
    // 检查部分重叠
    const commonPrefix = this._findCommonPrefix(cleanPath1, cleanPath2)
    if (commonPrefix.length > 1 && commonPrefix.length >= Math.min(cleanPath1.length, cleanPath2.length) * 0.5) {
      return {
        relationship: '部分重叠',
        suggestion: `检查路径"${path1}"和"${path2}"的重叠部分是否合理`
      }
    }
    
    return null
  }

  /**
   * 检查通配符冲突
   * @private
   * @param {string} path1 - 第一个路径
   * @param {string} path2 - 第二个路径
   * @param {string} directive1 - 第一个指令
   * @param {string} directive2 - 第二个指令
   * @returns {Object|null} 通配符冲突信息
   */
  _checkWildcardConflict(path1, path2, directive1, directive2) {
    const hasWildcard1 = path1.includes('*')
    const hasWildcard2 = path2.includes('*')
    
    if (!hasWildcard1 && !hasWildcard2) {
      return null
    }
    
    // 检查通配符模式匹配
    if (hasWildcard1 && this._matchesWildcardPattern(path2, path1)) {
      return {
        suggestion: `通配符模式"${path1}"可能匹配路径"${path2}"`
      }
    }
    
    if (hasWildcard2 && this._matchesWildcardPattern(path1, path2)) {
      return {
        suggestion: `通配符模式"${path2}"可能匹配路径"${path1}"`
      }
    }
    
    // 检查两个通配符模式的重叠
    if (hasWildcard1 && hasWildcard2) {
      const overlap = this._checkWildcardOverlap(path1, path2)
      if (overlap) {
        return {
          suggestion: `通配符模式"${path1}"和"${path2}"可能有重叠`
        }
      }
    }
    
    return null
  }

  /**
   * 检查路径是否匹配通配符模式
   * @private
   * @param {string} path - 路径
   * @param {string} pattern - 通配符模式
   * @returns {boolean} 是否匹配
   */
  _matchesWildcardPattern(path, pattern) {
    // 简单的通配符匹配实现
    const regexPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
      .replace(/\\\*/g, '.*') // 将*替换为.*
      .replace(/\\\$/g, '$') // 处理结束锚点
    
    try {
      const regex = new RegExp('^' + regexPattern)
      return regex.test(path)
    } catch (error) {
      return false
    }
  }

  /**
   * 检查两个通配符模式的重叠
   * @private
   * @param {string} pattern1 - 第一个模式
   * @param {string} pattern2 - 第二个模式
   * @returns {boolean} 是否有重叠
   */
  _checkWildcardOverlap(pattern1, pattern2) {
    // 简化的重叠检测：检查模式的固定部分是否有共同前缀
    const fixed1 = pattern1.split('*')[0]
    const fixed2 = pattern2.split('*')[0]
    
    if (fixed1 && fixed2) {
      return fixed1.startsWith(fixed2) || fixed2.startsWith(fixed1)
    }
    
    return false
  }

  /**
   * 检测同类型规则的冲突
   * @private
   * @param {Array} rules - 同类型规则数组
   * @param {string} type - 规则类型
   * @param {string} userAgent - User-agent值
   * @param {number} groupIndex - 组索引
   */
  _detectSameTypeConflicts(rules, type, userAgent, groupIndex) {
    const pathMap = new Map()
    
    rules.forEach(rule => {
      const path = rule.value
      if (pathMap.has(path)) {
        const existingRule = pathMap.get(path)
        this._addCheck(
          'duplicate-same-type-rule',
          '同类型规则重复检测',
          'warning',
          `User-agent "${userAgent}" 有重复的${type}规则: ${path}`,
          rule.line,
          `移除第${rule.line}行或第${existingRule.line}行的重复规则`,
          this.options.duplicateRuleSeverity
        )
        
        this._recordConflict(rule, existingRule, 'duplicate', groupIndex)
      } else {
        pathMap.set(path, rule)
      }
    })
    
    // 检测冗余规则（被其他规则覆盖的规则）
    this._detectRedundantRules(rules, type, userAgent, groupIndex)
  }

  /**
   * 检测冗余规则
   * @private
   * @param {Array} rules - 规则数组
   * @param {string} type - 规则类型
   * @param {string} userAgent - User-agent值
   * @param {number} groupIndex - 组索引
   */
  _detectRedundantRules(rules, type, userAgent, groupIndex) {
    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        const rule1 = rules[i]
        const rule2 = rules[j]
        
        const redundancy = this._checkRuleRedundancy(rule1, rule2)
        if (redundancy) {
          this._addCheck(
            'redundant-rule',
            '冗余规则检测',
            'info',
            `User-agent "${userAgent}" 的${type}规则可能冗余: "${redundancy.redundantRule.value}" 被 "${redundancy.coveringRule.value}" 覆盖`,
            redundancy.redundantRule.line,
            `考虑移除被覆盖的规则`,
            'low'
          )
          
          this._recordConflict(rule1, rule2, 'redundancy', groupIndex)
        }
      }
    }
  }

  /**
   * 检查规则冗余性
   * @private
   * @param {Object} rule1 - 第一个规则
   * @param {Object} rule2 - 第二个规则
   * @returns {Object|null} 冗余信息
   */
  _checkRuleRedundancy(rule1, rule2) {
    const path1 = rule1.value
    const path2 = rule2.value
    
    // 检查一个规则是否完全包含另一个规则
    if (path1.length > path2.length && path1.startsWith(path2)) {
      return {
        redundantRule: rule1,
        coveringRule: rule2,
        reason: 'path-containment'
      }
    }
    
    if (path2.length > path1.length && path2.startsWith(path1)) {
      return {
        redundantRule: rule2,
        coveringRule: rule1,
        reason: 'path-containment'
      }
    }
    
    // 检查通配符覆盖
    if (path2.endsWith('*') && path1.startsWith(path2.slice(0, -1))) {
      return {
        redundantRule: rule1,
        coveringRule: rule2,
        reason: 'wildcard-coverage'
      }
    }
    
    if (path1.endsWith('*') && path2.startsWith(path1.slice(0, -1))) {
      return {
        redundantRule: rule2,
        coveringRule: rule1,
        reason: 'wildcard-coverage'
      }
    }
    
    return null
  }

  /**
   * 检测User-agent组间的规则冲突
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _detectInterGroupConflicts(structure) {
    const groups = structure.userAgentGroups
    
    // 检查通配符组与特定User-agent组的关系
    const wildcardGroups = groups.filter(g => g.userAgent.value === '*')
    const specificGroups = groups.filter(g => g.userAgent.value !== '*')
    
    if (wildcardGroups.length > 0 && specificGroups.length > 0) {
      this._analyzeWildcardSpecificConflicts(wildcardGroups, specificGroups)
    }
    
    // 检查相同User-agent的多个组
    this._detectDuplicateUserAgentGroups(groups)
    
    // 检查User-agent组的覆盖关系
    this._analyzeUserAgentCoverage(groups)
  }

  /**
   * 分析通配符与特定User-agent的冲突
   * @private
   * @param {Array} wildcardGroups - 通配符组
   * @param {Array} specificGroups - 特定User-agent组
   */
  _analyzeWildcardSpecificConflicts(wildcardGroups, specificGroups) {
    for (const wildcardGroup of wildcardGroups) {
      for (const specificGroup of specificGroups) {
        this._compareGroupRules(wildcardGroup, specificGroup)
      }
    }
  }

  /**
   * 比较两个组的规则
   * @private
   * @param {Object} group1 - 第一个组
   * @param {Object} group2 - 第二个组
   */
  _compareGroupRules(group1, group2) {
    const userAgent1 = group1.userAgent.value
    const userAgent2 = group2.userAgent.value
    
    // 检查相同路径的不同规则
    for (const rule1 of group1.rules) {
      for (const rule2 of group2.rules) {
        if (rule1.value === rule2.value && rule1.directive !== rule2.directive) {
          this._addCheck(
            'inter-group-rule-conflict',
            '组间规则冲突检测',
            'info',
            `不同User-agent的相同路径规则冲突: "${userAgent1}" ${rule1.directive} "${rule1.value}" vs "${userAgent2}" ${rule2.directive} "${rule2.value}"`,
            rule1.line,
            `特定User-agent规则会覆盖通配符规则`,
            'low'
          )
        }
      }
    }
  }

  /**
   * 检测重复的User-agent组
   * @private
   * @param {Array} groups - User-agent组数组
   */
  _detectDuplicateUserAgentGroups(groups) {
    const userAgentMap = new Map()
    
    groups.forEach((group, index) => {
      const userAgent = group.userAgent.value.toLowerCase()
      
      if (userAgentMap.has(userAgent)) {
        const existingGroup = userAgentMap.get(userAgent)
        this._addCheck(
          'duplicate-user-agent-group',
          '重复User-agent组检测',
          'warning',
          `重复的User-agent组: "${group.userAgent.value}" 在第${group.userAgent.line}行和第${existingGroup.userAgent.line}行`,
          group.userAgent.line,
          '合并重复的User-agent组或移除多余的定义',
          'medium'
        )
      } else {
        userAgentMap.set(userAgent, group)
      }
    })
  }

  /**
   * 分析User-agent覆盖关系
   * @private
   * @param {Array} groups - User-agent组数组
   */
  _analyzeUserAgentCoverage(groups) {
    const wildcardGroups = groups.filter(g => g.userAgent.value === '*')
    const specificGroups = groups.filter(g => g.userAgent.value !== '*')
    
    if (wildcardGroups.length > 1) {
      this._addCheck(
        'multiple-wildcard-groups',
        'User-agent覆盖分析',
        'warning',
        `发现${wildcardGroups.length}个通配符User-agent组`,
        null,
        '只需要一个通配符User-agent组',
        'medium'
      )
    }
    
    if (specificGroups.length > 0 && wildcardGroups.length > 0) {
      this._addCheck(
        'wildcard-specific-coverage',
        'User-agent覆盖分析',
        'pass',
        `配置了${specificGroups.length}个特定User-agent和${wildcardGroups.length}个通配符组`,
        null,
        '特定User-agent规则会覆盖通配符规则',
        'low'
      )
    }
  }

  /**
   * 分析规则优先级问题
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _analyzeRulePriority(structure) {
    for (const group of structure.userAgentGroups) {
      this._analyzeGroupRulePriority(group)
    }
  }

  /**
   * 分析组内规则优先级
   * @private
   * @param {Object} group - User-agent组
   */
  _analyzeGroupRulePriority(group) {
    const rules = group.rules
    const userAgent = group.userAgent.value
    
    // 检查Allow规则是否在相关的Disallow规则之后
    for (let i = 0; i < rules.length; i++) {
      const currentRule = rules[i]
      
      if (currentRule.directive === 'allow') {
        // 查找可能被这个Allow规则覆盖的Disallow规则
        for (let j = 0; j < i; j++) {
          const previousRule = rules[j]
          
          if (previousRule.directive === 'disallow') {
            const relationship = this._checkPathContainment(currentRule.value, previousRule.value)
            
            if (relationship && relationship.relationship === '被包含') {
              this._addCheck(
                'rule-priority-issue',
                '规则优先级分析',
                'info',
                `User-agent "${userAgent}" 的Allow规则"${currentRule.value}"可能覆盖之前的Disallow规则"${previousRule.value}"`,
                currentRule.line,
                '确认规则顺序是否符合预期',
                'low'
              )
            }
          }
        }
      }
    }
    
    // 检查规则的逻辑顺序
    this._checkRuleLogicalOrder(rules, userAgent)
  }

  /**
   * 检查规则的逻辑顺序
   * @private
   * @param {Array} rules - 规则数组
   * @param {string} userAgent - User-agent值
   */
  _checkRuleLogicalOrder(rules, userAgent) {
    let hasGeneralDisallow = false
    let hasSpecificAllow = false
    
    rules.forEach(rule => {
      if (rule.directive === 'disallow' && (rule.value === '/' || rule.value.length <= 3)) {
        hasGeneralDisallow = true
      }
      
      if (rule.directive === 'allow' && rule.value.length > 3) {
        hasSpecificAllow = true
      }
    })
    
    if (hasGeneralDisallow && hasSpecificAllow) {
      this._addCheck(
        'logical-rule-order',
        '规则逻辑顺序分析',
        'pass',
        `User-agent "${userAgent}" 使用了合理的规则组合：先禁止后允许`,
        null,
        null,
        'low'
      )
    }
  }

  /**
   * 检测重复和冗余规则
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _detectDuplicateRules(structure) {
    const allRules = structure.allRules
    
    // 按路径分组检查重复
    const pathGroups = new Map()
    
    allRules.forEach(rule => {
      const key = `${rule.userAgent}:${rule.value}`
      
      if (!pathGroups.has(key)) {
        pathGroups.set(key, [])
      }
      pathGroups.get(key).push(rule)
    })
    
    // 检查每个路径组的重复情况
    pathGroups.forEach((rules, key) => {
      if (rules.length > 1) {
        this._analyzeDuplicateRuleGroup(rules, key)
      }
    })
  }

  /**
   * 分析重复规则组
   * @private
   * @param {Array} rules - 重复规则数组
   * @param {string} key - 规则键
   */
  _analyzeDuplicateRuleGroup(rules, key) {
    const [userAgent, path] = key.split(':')
    const directives = [...new Set(rules.map(r => r.directive))]
    
    if (directives.length === 1) {
      // 完全重复的规则
      const lines = rules.map(r => r.line).join(', ')
      this._addCheck(
        'exact-duplicate-rules',
        '重复规则检测',
        'warning',
        `User-agent "${userAgent}" 有完全重复的${directives[0]}规则: ${path} (行: ${lines})`,
        rules[1].line,
        '移除重复的规则',
        'medium'
      )
    } else {
      // 相同路径的不同指令
      this._addCheck(
        'conflicting-path-rules',
        '冲突路径规则检测',
        'error',
        `User-agent "${userAgent}" 对同一路径有冲突规则: ${path}`,
        rules[0].line,
        '确定应该使用Allow还是Disallow',
        'high'
      )
    }
  }

  /**
   * 分析路径覆盖关系
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _analyzePathCoverage(structure) {
    if (!this.options.checkPathOverlaps) {
      return
    }
    
    for (const group of structure.userAgentGroups) {
      this._analyzeGroupPathCoverage(group)
    }
  }

  /**
   * 分析组内路径覆盖关系
   * @private
   * @param {Object} group - User-agent组
   */
  _analyzeGroupPathCoverage(group) {
    const rules = group.rules
    const userAgent = group.userAgent.value
    
    // 构建路径树来分析覆盖关系
    const pathTree = this._buildPathTree(rules)
    const coverageIssues = this._findCoverageIssues(pathTree, userAgent)
    
    coverageIssues.forEach(issue => {
      this._addCheck(
        'path-coverage-issue',
        '路径覆盖分析',
        issue.severity,
        issue.message,
        issue.line,
        issue.suggestion,
        issue.severity
      )
    })
  }

  /**
   * 构建路径树
   * @private
   * @param {Array} rules - 规则数组
   * @returns {Object} 路径树
   */
  _buildPathTree(rules) {
    const tree = {
      children: new Map(),
      rules: []
    }
    
    rules.forEach(rule => {
      const path = rule.value
      const segments = path.split('/').filter(s => s.length > 0)
      
      let current = tree
      segments.forEach(segment => {
        if (!current.children.has(segment)) {
          current.children.set(segment, {
            children: new Map(),
            rules: []
          })
        }
        current = current.children.get(segment)
      })
      
      current.rules.push(rule)
    })
    
    return tree
  }

  /**
   * 查找覆盖问题
   * @private
   * @param {Object} pathTree - 路径树
   * @param {string} userAgent - User-agent值
   * @returns {Array} 覆盖问题列表
   */
  _findCoverageIssues(pathTree, userAgent) {
    const issues = []
    
    // 递归分析路径树
    const analyzeNode = (node, currentPath) => {
      if (node.rules.length > 1) {
        // 检查同一路径的多个规则
        const allowRules = node.rules.filter(r => r.directive === 'allow')
        const disallowRules = node.rules.filter(r => r.directive === 'disallow')
        
        if (allowRules.length > 0 && disallowRules.length > 0) {
          issues.push({
            severity: 'warning',
            message: `User-agent "${userAgent}" 对路径"${currentPath}"同时有Allow和Disallow规则`,
            line: allowRules[0].line,
            suggestion: '明确路径的访问策略'
          })
        }
      }
      
      // 递归处理子节点
      node.children.forEach((childNode, segment) => {
        const childPath = currentPath + '/' + segment
        analyzeNode(childNode, childPath)
      })
    }
    
    analyzeNode(pathTree, '')
    return issues
  }

  /**
   * 生成冲突摘要报告
   * @private
   * @param {Object} structure - 解析后的结构
   */
  async _generateConflictSummary(structure) {
    const totalRules = structure.allRules.length
    const totalGroups = structure.userAgentGroups.length
    const conflictCount = this.conflictMatrix.size
    
    if (conflictCount === 0) {
      this._addCheck(
        'no-conflicts-detected',
        '冲突检测摘要',
        'pass',
        `未检测到规则冲突（${totalRules}个规则，${totalGroups}个User-agent组）`,
        null,
        null,
        'low'
      )
    } else {
      this._addCheck(
        'conflicts-detected',
        '冲突检测摘要',
        'info',
        `检测到${conflictCount}个潜在冲突（${totalRules}个规则，${totalGroups}个User-agent组）`,
        null,
        '查看详细的冲突分析结果',
        'medium'
      )
    }
    
    // 生成冲突类型统计
    const conflictTypes = new Map()
    this.checks.forEach(check => {
      if (check.id.includes('conflict') || check.id.includes('duplicate')) {
        const type = check.id
        conflictTypes.set(type, (conflictTypes.get(type) || 0) + 1)
      }
    })
    
    if (conflictTypes.size > 0) {
      const typesSummary = Array.from(conflictTypes.entries())
        .map(([type, count]) => `${type}: ${count}`)
        .join(', ')
      
      this._addCheck(
        'conflict-types-summary',
        '冲突类型统计',
        'info',
        `冲突类型分布: ${typesSummary}`,
        null,
        null,
        'low'
      )
    }
  }

  /**
   * 记录冲突到冲突矩阵
   * @private
   * @param {Object} rule1 - 第一个规则
   * @param {Object} rule2 - 第二个规则
   * @param {string} type - 冲突类型
   * @param {number} groupIndex - 组索引
   */
  _recordConflict(rule1, rule2, type, groupIndex) {
    const key = `${rule1.line}-${rule2.line}`
    this.conflictMatrix.set(key, {
      rule1,
      rule2,
      type,
      groupIndex,
      timestamp: Date.now()
    })
  }

  /**
   * 查找公共前缀
   * @private
   * @param {string} str1 - 第一个字符串
   * @param {string} str2 - 第二个字符串
   * @returns {string} 公共前缀
   */
  _findCommonPrefix(str1, str2) {
    let i = 0
    while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
      i++
    }
    return str1.substring(0, i)
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
   * 获取冲突矩阵
   * @returns {Map} 冲突矩阵
   */
  getConflictMatrix() {
    return new Map(this.conflictMatrix)
  }

  /**
   * 获取冲突统计
   * @returns {Object} 冲突统计信息
   */
  getConflictStatistics() {
    const stats = {
      totalConflicts: this.conflictMatrix.size,
      conflictTypes: new Map(),
      severityDistribution: new Map()
    }
    
    this.checks.forEach(check => {
      if (check.id.includes('conflict') || check.id.includes('duplicate')) {
        stats.conflictTypes.set(check.id, (stats.conflictTypes.get(check.id) || 0) + 1)
        stats.severityDistribution.set(check.severity, (stats.severityDistribution.get(check.severity) || 0) + 1)
      }
    })
    
    return stats
  }
}

export default RuleConflictDetector