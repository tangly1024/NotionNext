/**
 * 关键词排名跟踪系统
 * 监控关键词在各大搜索引擎的排名变化，提供竞争对手分析和排名报告
 */

class KeywordRankingTracker {
  constructor(options = {}) {
    this.options = {
      maxResults: 100,
      timeout: 15000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      enableProxy: false,
      proxyList: [],
      retryAttempts: 3,
      retryDelay: 2000,
      ...options
    }

    this.keywords = new Map()
    this.rankings = new Map()
    this.competitors = new Map()
    this.notifications = []
    
    this.searchEngines = {
      google: {
        name: 'Google',
        baseUrl: 'https://www.google.com/search',
        params: { q: '', num: 100, hl: 'zh-CN' },
        selector: 'div.g',
        titleSelector: 'h3',
        urlSelector: 'a',
        enabled: true
      },
      bing: {
        name: 'Bing',
        baseUrl: 'https://www.bing.com/search',
        params: { q: '', count: 50 },
        selector: '.b_algo',
        titleSelector: 'h2 a',
        urlSelector: 'h2 a',
        enabled: true
      },
      baidu: {
        name: '百度',
        baseUrl: 'https://www.baidu.com/s',
        params: { wd: '', rn: 50 },
        selector: '.result',
        titleSelector: 'h3 a',
        urlSelector: 'h3 a',
        enabled: true
      }
    }
  }

  /**
   * 添加关键词监控
   */
  addKeyword(keyword, config = {}) {
    const keywordId = this.generateKeywordId(keyword)
    
    this.keywords.set(keywordId, {
      id: keywordId,
      keyword,
      targetUrl: config.targetUrl || '',
      searchEngines: config.searchEngines || ['google', 'bing', 'baidu'],
      location: config.location || 'zh-CN',
      device: config.device || 'desktop',
      frequency: config.frequency || 'daily', // daily, weekly, monthly
      active: config.active !== false,
      createdAt: Date.now(),
      lastChecked: null,
      ...config
    })

    return keywordId
  }

  /**
   * 移除关键词监控
   */
  removeKeyword(keywordId) {
    this.keywords.delete(keywordId)
    
    // 清理相关排名数据
    for (const [rankingKey, ranking] of this.rankings) {
      if (ranking.keywordId === keywordId) {
        this.rankings.delete(rankingKey)
      }
    }
  }

  /**
   * 更新关键词配置
   */
  updateKeyword(keywordId, updates) {
    const keyword = this.keywords.get(keywordId)
    if (!keyword) {
      throw new Error(`Keyword not found: ${keywordId}`)
    }

    this.keywords.set(keywordId, {
      ...keyword,
      ...updates,
      updatedAt: Date.now()
    })
  }

  /**
   * 检查单个关键词排名
   */
  async checkKeywordRanking(keywordId) {
    const keyword = this.keywords.get(keywordId)
    if (!keyword || !keyword.active) {
      throw new Error(`Keyword not found or inactive: ${keywordId}`)
    }

    const results = []

    for (const engineId of keyword.searchEngines) {
      const engine = this.searchEngines[engineId]
      if (!engine || !engine.enabled) continue

      try {
        const ranking = await this.searchKeywordRanking(
          keyword.keyword,
          keyword.targetUrl,
          engine,
          keyword.location,
          keyword.device
        )

        results.push({
          keywordId,
          keyword: keyword.keyword,
          searchEngine: engineId,
          ranking: ranking.position,
          url: ranking.url,
          title: ranking.title,
          snippet: ranking.snippet,
          timestamp: Date.now(),
          location: keyword.location,
          device: keyword.device
        })

        // 保存排名数据
        this.saveRankingData(keywordId, engineId, ranking)

      } catch (error) {
        console.error(`Error checking ranking for ${keyword.keyword} on ${engineId}:`, error)
        results.push({
          keywordId,
          keyword: keyword.keyword,
          searchEngine: engineId,
          error: error.message,
          timestamp: Date.now()
        })
      }
    }

    // 更新最后检查时间
    keyword.lastChecked = Date.now()
    this.keywords.set(keywordId, keyword)

    return results
  }

  /**
   * 搜索关键词排名
   */
  async searchKeywordRanking(keyword, targetUrl, engine, location = 'zh-CN', device = 'desktop') {
    const searchUrl = this.buildSearchUrl(keyword, engine, location, device)
    
    try {
      const response = await this.makeRequest(searchUrl, {
        headers: {
          'User-Agent': this.getUserAgent(device),
          'Accept-Language': location,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      })

      const html = await response.text()
      return this.parseSearchResults(html, engine, targetUrl, keyword)

    } catch (error) {
      throw new Error(`Search request failed: ${error.message}`)
    }
  }

  /**
   * 构建搜索URL
   */
  buildSearchUrl(keyword, engine, location, device) {
    const params = new URLSearchParams({
      ...engine.params,
      [Object.keys(engine.params)[0]]: keyword
    })

    // 添加位置参数
    if (location && engine.name === 'Google') {
      params.set('gl', location.split('-')[1] || 'CN')
      params.set('hl', location)
    }

    // 添加设备参数
    if (device === 'mobile' && engine.name === 'Google') {
      params.set('mobile', '1')
    }

    return `${engine.baseUrl}?${params.toString()}`
  }

  /**
   * 解析搜索结果
   */
  parseSearchResults(html, engine, targetUrl, keyword) {
    // 简化的HTML解析，实际项目中建议使用专业的HTML解析库
    const resultPattern = this.getResultPattern(engine)
    const matches = [...html.matchAll(resultPattern)]
    
    let position = 0
    let found = false
    let resultData = {
      position: -1,
      url: '',
      title: '',
      snippet: '',
      found: false
    }

    for (const match of matches) {
      position++
      
      const url = this.extractUrl(match[0], engine)
      const title = this.extractTitle(match[0], engine)
      const snippet = this.extractSnippet(match[0], engine)

      // 检查是否匹配目标URL
      if (targetUrl && this.isUrlMatch(url, targetUrl)) {
        resultData = {
          position,
          url,
          title,
          snippet,
          found: true
        }
        found = true
        break
      }

      // 如果没有指定目标URL，返回第一个结果
      if (!targetUrl && position === 1) {
        resultData = {
          position: 1,
          url,
          title,
          snippet,
          found: true
        }
        break
      }
    }

    return resultData
  }

  /**
   * 获取结果匹配模式
   */
  getResultPattern(engine) {
    // 简化的正则表达式，实际项目中需要更复杂的解析
    switch (engine.name) {
      case 'Google':
        return /<div class="g"[^>]*>.*?<\/div>/gs
      case 'Bing':
        return /<li class="b_algo"[^>]*>.*?<\/li>/gs
      case '百度':
        return /<div class="result"[^>]*>.*?<\/div>/gs
      default:
        return /<div[^>]*>.*?<\/div>/gs
    }
  }

  /**
   * 提取URL
   */
  extractUrl(html, engine) {
    const urlPattern = /href=["']([^"']*)["']/i
    const match = html.match(urlPattern)
    return match ? this.cleanUrl(match[1]) : ''
  }

  /**
   * 提取标题
   */
  extractTitle(html, engine) {
    const titlePattern = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/i
    const match = html.match(titlePattern)
    return match ? this.cleanText(match[1]) : ''
  }

  /**
   * 提取摘要
   */
  extractSnippet(html, engine) {
    // 简化的摘要提取
    const snippetPattern = /<span[^>]*class="[^"]*st[^"]*"[^>]*>(.*?)<\/span>/i
    const match = html.match(snippetPattern)
    return match ? this.cleanText(match[1]) : ''
  }

  /**
   * 清理URL
   */
  cleanUrl(url) {
    // 移除Google重定向等
    if (url.startsWith('/url?q=')) {
      const decoded = decodeURIComponent(url.substring(7))
      const ampIndex = decoded.indexOf('&')
      return ampIndex > 0 ? decoded.substring(0, ampIndex) : decoded
    }
    return url
  }

  /**
   * 清理文本
   */
  cleanText(text) {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
  }

  /**
   * 检查URL是否匹配
   */
  isUrlMatch(url, targetUrl) {
    try {
      const urlObj = new URL(url)
      const targetObj = new URL(targetUrl)
      
      // 比较域名和路径
      return urlObj.hostname === targetObj.hostname && 
             urlObj.pathname === targetObj.pathname
    } catch {
      return url.includes(targetUrl) || targetUrl.includes(url)
    }
  }

  /**
   * 获取用户代理
   */
  getUserAgent(device) {
    const userAgents = {
      desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      mobile: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    }
    return userAgents[device] || userAgents.desktop
  }

  /**
   * 保存排名数据
   */
  saveRankingData(keywordId, engineId, ranking) {
    const rankingKey = `${keywordId}_${engineId}_${Date.now()}`
    
    this.rankings.set(rankingKey, {
      keywordId,
      searchEngine: engineId,
      position: ranking.position,
      url: ranking.url,
      title: ranking.title,
      snippet: ranking.snippet,
      found: ranking.found,
      timestamp: Date.now()
    })

    // 检查排名变化并发送通知
    this.checkRankingChanges(keywordId, engineId, ranking)
  }

  /**
   * 检查排名变化
   */
  checkRankingChanges(keywordId, engineId, currentRanking) {
    const previousRanking = this.getPreviousRanking(keywordId, engineId)
    
    if (!previousRanking) return

    const positionChange = previousRanking.position - currentRanking.position
    
    if (Math.abs(positionChange) >= 5) { // 排名变化超过5位时通知
      this.addNotification({
        type: 'ranking_change',
        keywordId,
        searchEngine: engineId,
        previousPosition: previousRanking.position,
        currentPosition: currentRanking.position,
        change: positionChange,
        timestamp: Date.now()
      })
    }
  }

  /**
   * 获取上次排名
   */
  getPreviousRanking(keywordId, engineId) {
    const rankings = Array.from(this.rankings.values())
      .filter(r => r.keywordId === keywordId && r.searchEngine === engineId)
      .sort((a, b) => b.timestamp - a.timestamp)
    
    return rankings.length > 1 ? rankings[1] : null
  }

  /**
   * 添加通知
   */
  addNotification(notification) {
    this.notifications.push(notification)
    
    // 限制通知数量
    if (this.notifications.length > 1000) {
      this.notifications = this.notifications.slice(-500)
    }
  }

  /**
   * 批量检查关键词排名
   */
  async checkAllKeywords() {
    const results = []
    const activeKeywords = Array.from(this.keywords.values())
      .filter(k => k.active)

    for (const keyword of activeKeywords) {
      try {
        const result = await this.checkKeywordRanking(keyword.id)
        results.push(...result)
        
        // 添加延迟避免被限制
        await this.delay(2000)
      } catch (error) {
        console.error(`Error checking keyword ${keyword.keyword}:`, error)
      }
    }

    return results
  }

  /**
   * 获取关键词排名历史
   */
  getKeywordHistory(keywordId, engineId = null, days = 30) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000)
    
    return Array.from(this.rankings.values())
      .filter(r => {
        return r.keywordId === keywordId &&
               r.timestamp >= cutoff &&
               (engineId ? r.searchEngine === engineId : true)
      })
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  /**
   * 获取排名报告
   */
  generateRankingReport(options = {}) {
    const {
      keywordIds = null,
      searchEngines = null,
      days = 30,
      includeCompetitors = false
    } = options

    const report = {
      summary: {
        totalKeywords: this.keywords.size,
        activeKeywords: Array.from(this.keywords.values()).filter(k => k.active).length,
        totalRankings: this.rankings.size,
        reportPeriod: days
      },
      keywords: [],
      trends: {},
      notifications: this.notifications.slice(-50)
    }

    // 生成关键词报告
    const keywords = keywordIds 
      ? keywordIds.map(id => this.keywords.get(id)).filter(Boolean)
      : Array.from(this.keywords.values())

    keywords.forEach(keyword => {
      const keywordReport = {
        id: keyword.id,
        keyword: keyword.keyword,
        targetUrl: keyword.targetUrl,
        rankings: {},
        averagePosition: {},
        bestPosition: {},
        worstPosition: {},
        trend: {}
      }

      const engines = searchEngines || keyword.searchEngines
      engines.forEach(engineId => {
        const history = this.getKeywordHistory(keyword.id, engineId, days)
        
        if (history.length > 0) {
          const positions = history.map(h => h.position).filter(p => p > 0)
          
          keywordReport.rankings[engineId] = {
            current: history[history.length - 1],
            history: history,
            count: positions.length
          }

          if (positions.length > 0) {
            keywordReport.averagePosition[engineId] = Math.round(
              positions.reduce((sum, pos) => sum + pos, 0) / positions.length
            )
            keywordReport.bestPosition[engineId] = Math.min(...positions)
            keywordReport.worstPosition[engineId] = Math.max(...positions)
          }

          // 计算趋势
          if (history.length >= 2) {
            const recent = history.slice(-7) // 最近7次检查
            const earlier = history.slice(-14, -7) // 之前7次检查
            
            if (recent.length > 0 && earlier.length > 0) {
              const recentAvg = recent.reduce((sum, h) => sum + (h.position || 100), 0) / recent.length
              const earlierAvg = earlier.reduce((sum, h) => sum + (h.position || 100), 0) / earlier.length
              
              keywordReport.trend[engineId] = earlierAvg - recentAvg // 正数表示排名上升
            }
          }
        }
      })

      report.keywords.push(keywordReport)
    })

    return report
  }

  /**
   * 添加竞争对手
   */
  addCompetitor(domain, keywords = []) {
    const competitorId = this.generateCompetitorId(domain)
    
    this.competitors.set(competitorId, {
      id: competitorId,
      domain,
      keywords,
      active: true,
      createdAt: Date.now(),
      lastChecked: null
    })

    return competitorId
  }

  /**
   * 分析竞争对手
   */
  async analyzeCompetitor(competitorId, keywords) {
    const competitor = this.competitors.get(competitorId)
    if (!competitor) {
      throw new Error(`Competitor not found: ${competitorId}`)
    }

    const results = []

    for (const keyword of keywords) {
      for (const engineId of ['google', 'bing', 'baidu']) {
        const engine = this.searchEngines[engineId]
        if (!engine || !engine.enabled) continue

        try {
          const ranking = await this.searchKeywordRanking(
            keyword,
            competitor.domain,
            engine
          )

          results.push({
            competitorId,
            domain: competitor.domain,
            keyword,
            searchEngine: engineId,
            position: ranking.position,
            found: ranking.found,
            url: ranking.url,
            title: ranking.title,
            timestamp: Date.now()
          })

        } catch (error) {
          console.error(`Error analyzing competitor ${competitor.domain} for ${keyword}:`, error)
        }
      }
      
      // 添加延迟
      await this.delay(1000)
    }

    competitor.lastChecked = Date.now()
    this.competitors.set(competitorId, competitor)

    return results
  }

  /**
   * 生成关键词ID
   */
  generateKeywordId(keyword) {
    return `kw_${keyword.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`
  }

  /**
   * 生成竞争对手ID
   */
  generateCompetitorId(domain) {
    return `comp_${domain.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
  }

  /**
   * 发起HTTP请求
   */
  async makeRequest(url, options = {}) {
    const defaultOptions = {
      timeout: this.options.timeout,
      headers: {
        'User-Agent': this.options.userAgent
      }
    }

    const finalOptions = { ...defaultOptions, ...options }

    try {
      const response = await fetch(url, finalOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`)
    }
  }

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 获取统计信息
   */
  getStats() {
    const activeKeywords = Array.from(this.keywords.values()).filter(k => k.active)
    const recentRankings = Array.from(this.rankings.values())
      .filter(r => r.timestamp > Date.now() - 24 * 60 * 60 * 1000)

    return {
      keywords: {
        total: this.keywords.size,
        active: activeKeywords.length,
        inactive: this.keywords.size - activeKeywords.length
      },
      rankings: {
        total: this.rankings.size,
        recent24h: recentRankings.length
      },
      competitors: {
        total: this.competitors.size,
        active: Array.from(this.competitors.values()).filter(c => c.active).length
      },
      notifications: {
        total: this.notifications.length,
        recent: this.notifications.filter(n => n.timestamp > Date.now() - 24 * 60 * 60 * 1000).length
      }
    }
  }
}

// 单例实例
const keywordRankingTracker = new KeywordRankingTracker()

export default keywordRankingTracker
export { KeywordRankingTracker }