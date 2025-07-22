/**
 * 404错误监控和报告系统
 * 收集、分析和报告404错误，提供智能重定向建议
 */

class NotFoundMonitor {
  constructor() {
    this.errors = new Map()
    this.redirectRules = new Map()
    this.commonPaths = new Set()
  }

  /**
   * 记录404错误
   */
  logError(path, referrer = '', userAgent = '', timestamp = Date.now()) {
    const errorKey = this.normalizeUrl(path)
    
    if (!this.errors.has(errorKey)) {
      this.errors.set(errorKey, {
        path: errorKey,
        count: 0,
        firstSeen: timestamp,
        lastSeen: timestamp,
        referrers: new Map(),
        userAgents: new Set(),
        suggestions: []
      })
    }

    const error = this.errors.get(errorKey)
    error.count++
    error.lastSeen = timestamp
    
    // 记录referrer统计
    if (referrer) {
      const refCount = error.referrers.get(referrer) || 0
      error.referrers.set(referrer, refCount + 1)
    }
    
    // 记录用户代理
    if (userAgent) {
      error.userAgents.add(userAgent)
    }

    // 生成智能重定向建议
    error.suggestions = this.generateRedirectSuggestions(errorKey)
    
    return error
  }

  /**
   * 标准化URL
   */
  normalizeUrl(url) {
    return url
      .toLowerCase()
      .replace(/\/+$/, '') // 移除尾部斜杠
      .replace(/\/+/g, '/') // 合并多个斜杠
  }

  /**
   * 生成智能重定向建议
   */
  generateRedirectSuggestions(errorPath) {
    const suggestions = []
    
    // 1. 检查是否有预定义的重定向规则
    for (const [pattern, redirect] of this.redirectRules) {
      if (errorPath.match(pattern)) {
        suggestions.push({
          type: 'redirect_rule',
          url: redirect,
          confidence: 0.9,
          reason: '预定义重定向规则'
        })
      }
    }

    // 2. 基于路径模式的建议
    const pathSuggestions = this.analyzePathPattern(errorPath)
    suggestions.push(...pathSuggestions)

    // 3. 基于相似路径的建议
    const similarPaths = this.findSimilarPaths(errorPath)
    suggestions.push(...similarPaths)

    // 4. 基于内容类型的通用建议
    const genericSuggestions = this.getGenericSuggestions(errorPath)
    suggestions.push(...genericSuggestions)

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
  }

  /**
   * 分析路径模式
   */
  analyzePathPattern(path) {
    const suggestions = []
    
    // 文章相关路径
    if (path.match(/\/(post|article|blog)\//) || path.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
      suggestions.push({
        type: 'category_redirect',
        url: '/archive',
        confidence: 0.8,
        reason: '文章归档页面'
      })
    }

    // 分类相关路径
    if (path.match(/\/(category|cat)\//) || path.match(/\/categories\//)) {
      suggestions.push({
        type: 'category_redirect',
        url: '/category',
        confidence: 0.8,
        reason: '分类浏览页面'
      })
    }

    // 标签相关路径
    if (path.match(/\/(tag|tags)\//) || path.match(/\/topics\//)) {
      suggestions.push({
        type: 'tag_redirect',
        url: '/tag',
        confidence: 0.8,
        reason: '标签浏览页面'
      })
    }

    // 搜索相关路径
    if (path.match(/\/(search|find)\//) || path.includes('?q=') || path.includes('?search=')) {
      suggestions.push({
        type: 'search_redirect',
        url: '/search',
        confidence: 0.7,
        reason: '搜索页面'
      })
    }

    return suggestions
  }

  /**
   * 查找相似路径
   */
  findSimilarPaths(errorPath) {
    const suggestions = []
    const threshold = 0.6 // 相似度阈值
    
    for (const commonPath of this.commonPaths) {
      const similarity = this.calculateSimilarity(errorPath, commonPath)
      if (similarity > threshold) {
        suggestions.push({
          type: 'similar_path',
          url: commonPath,
          confidence: similarity * 0.7, // 降低相似路径的置信度
          reason: `与 ${commonPath} 相似`
        })
      }
    }
    
    return suggestions
  }

  /**
   * 计算字符串相似度
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  /**
   * 计算编辑距离
   */
  levenshteinDistance(str1, str2) {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  /**
   * 获取通用建议
   */
  getGenericSuggestions(path) {
    return [
      {
        type: 'home',
        url: '/',
        confidence: 0.5,
        reason: '返回首页'
      },
      {
        type: 'archive',
        url: '/archive',
        confidence: 0.4,
        reason: '浏览所有文章'
      },
      {
        type: 'category',
        url: '/category',
        confidence: 0.3,
        reason: '按分类浏览'
      }
    ]
  }

  /**
   * 添加重定向规则
   */
  addRedirectRule(pattern, redirect) {
    this.redirectRules.set(new RegExp(pattern), redirect)
  }

  /**
   * 添加常见路径
   */
  addCommonPath(path) {
    this.commonPaths.add(this.normalizeUrl(path))
  }

  /**
   * 获取错误统计报告
   */
  getErrorReport(options = {}) {
    const {
      limit = 50,
      sortBy = 'count',
      timeRange = null
    } = options

    let errors = Array.from(this.errors.values())

    // 时间范围过滤
    if (timeRange) {
      const { start, end } = timeRange
      errors = errors.filter(error => 
        error.lastSeen >= start && error.lastSeen <= end
      )
    }

    // 排序
    errors.sort((a, b) => {
      switch (sortBy) {
        case 'count':
          return b.count - a.count
        case 'recent':
          return b.lastSeen - a.lastSeen
        case 'first':
          return a.firstSeen - b.firstSeen
        default:
          return b.count - a.count
      }
    })

    return {
      total: errors.length,
      errors: errors.slice(0, limit),
      summary: this.generateSummary(errors)
    }
  }

  /**
   * 生成统计摘要
   */
  generateSummary(errors) {
    const totalErrors = errors.reduce((sum, error) => sum + error.count, 0)
    const topReferrers = new Map()
    const pathPatterns = new Map()

    errors.forEach(error => {
      // 统计referrer
      error.referrers.forEach((count, referrer) => {
        const currentCount = topReferrers.get(referrer) || 0
        topReferrers.set(referrer, currentCount + count)
      })

      // 分析路径模式
      const pattern = this.extractPathPattern(error.path)
      const currentCount = pathPatterns.get(pattern) || 0
      pathPatterns.set(pattern, currentCount + error.count)
    })

    return {
      totalErrors,
      uniquePaths: errors.length,
      topReferrers: Array.from(topReferrers.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      commonPatterns: Array.from(pathPatterns.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    }
  }

  /**
   * 提取路径模式
   */
  extractPathPattern(path) {
    return path
      .replace(/\/\d+/g, '/{id}')
      .replace(/\/[a-f0-9-]{36}/g, '/{uuid}')
      .replace(/\/\d{4}-\d{2}-\d{2}/g, '/{date}')
  }

  /**
   * 清理旧数据
   */
  cleanup(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30天
    const cutoff = Date.now() - maxAge
    
    for (const [key, error] of this.errors) {
      if (error.lastSeen < cutoff) {
        this.errors.delete(key)
      }
    }
  }
}

// 单例实例
const notFoundMonitor = new NotFoundMonitor()

export default notFoundMonitor
export { NotFoundMonitor }