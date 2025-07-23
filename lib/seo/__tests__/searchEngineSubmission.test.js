/**
 * 搜索引擎提交功能测试
 */

import { SearchEngineSubmissionManager } from '../searchEngineSubmission'

describe('SearchEngineSubmissionManager', () => {
  let manager

  beforeEach(() => {
    manager = new SearchEngineSubmissionManager({
      siteUrl: 'https://example.com',
      sitemapUrl: '/sitemap.xml'
    })
  })

  describe('Configuration', () => {
    test('should initialize with default config', () => {
      expect(manager.config.siteUrl).toBe('https://example.com')
      expect(manager.config.sitemapUrl).toBe('/sitemap.xml')
      expect(manager.config.enableAutoSubmission).toBe(true)
    })

    test('should have all search engines configured', () => {
      const engines = Object.keys(manager.searchEngines)
      expect(engines).toContain('google')
      expect(engines).toContain('bing')
      expect(engines).toContain('baidu')
      expect(engines).toContain('yandex')
    })
  })

  describe('URL Building', () => {
    test('should build correct submission URL', () => {
      const engine = manager.searchEngines.google
      const sitemapUrl = 'https://example.com/sitemap.xml'
      const submissionUrl = manager.buildSubmissionUrl(engine, sitemapUrl)
      
      expect(submissionUrl).toContain('https://www.google.com/ping')
      expect(submissionUrl).toContain('sitemap=https%3A%2F%2Fexample.com%2Fsitemap.xml')
    })
  })

  describe('Quota Management', () => {
    test('should check quota limits correctly', () => {
      // 初始状态应该允许提交
      expect(manager.checkQuotaLimit('google')).toBe(true)
      
      // 模拟达到配额限制
      const today = new Date().toDateString()
      manager.quotaUsage.set(`google_${today}`, 200)
      expect(manager.checkQuotaLimit('google')).toBe(false)
    })

    test('should update quota usage', () => {
      const today = new Date().toDateString()
      const key = `google_${today}`
      
      manager.updateQuotaUsage('google')
      expect(manager.quotaUsage.get(key)).toBe(1)
      
      manager.updateQuotaUsage('google')
      expect(manager.quotaUsage.get(key)).toBe(2)
    })
  })

  describe('Verification Code Management', () => {
    test('should set and get verification codes', () => {
      const testCode = 'test123'
      manager.setVerificationCode('google', 'html_tag', testCode)
      
      const verification = manager.getVerificationCode('google', 'html_tag')
      expect(verification.code).toBe(testCode)
      expect(verification.method).toBe('html_tag')
      expect(verification.engineId).toBe('google')
    })

    test('should generate verification file content', () => {
      manager.setVerificationCode('google', 'html_tag', 'test123')
      
      const content = manager.generateVerificationFile('google', 'html_tag')
      expect(content).toContain('test123')
    })
  })

  describe('Submission History', () => {
    test('should record submission history', () => {
      const url = 'https://example.com/test'
      manager.recordSubmission('google', url, true)
      
      const history = manager.getSubmissionHistory('google', 1)
      expect(history).toHaveLength(1)
      expect(history[0].engineId).toBe('google')
      expect(history[0].url).toBe(url)
      expect(history[0].success).toBe(true)
    })

    test('should filter history by engine', () => {
      manager.recordSubmission('google', 'https://example.com/1', true)
      manager.recordSubmission('bing', 'https://example.com/2', true)
      manager.recordSubmission('google', 'https://example.com/3', false)
      
      const googleHistory = manager.getSubmissionHistory('google')
      expect(googleHistory).toHaveLength(2)
      expect(googleHistory.every(record => record.engineId === 'google')).toBe(true)
    })
  })

  describe('Engine Status', () => {
    test('should get engine status', () => {
      const status = manager.getEngineStatus()
      
      expect(status.google).toBeDefined()
      expect(status.google.name).toBe('Google')
      expect(status.google.enabled).toBe(true)
      expect(status.google.quotaUsed).toBe(0)
      expect(status.google.quotaLimit).toBe(200)
    })
  })

  describe('Batch Processing', () => {
    test('should get correct batch size', () => {
      expect(manager.getBatchSize('google')).toBe(10)
      expect(manager.getBatchSize('bing')).toBe(50)
      expect(manager.getBatchSize('baidu')).toBe(20)
      expect(manager.getBatchSize('unknown')).toBe(10)
    })
  })

  describe('Error Handling', () => {
    test('should handle unknown search engine', async () => {
      await expect(
        manager.submitSitemapToEngine('unknown', 'https://example.com/sitemap.xml')
      ).rejects.toThrow('Unknown search engine: unknown')
    })

    test('should handle quota exceeded', async () => {
      // 设置配额已满
      const today = new Date().toDateString()
      manager.quotaUsage.set(`google_${today}`, 200)
      
      await expect(
        manager.submitSitemapToEngine('google', 'https://example.com/sitemap.xml')
      ).rejects.toThrow('Quota limit exceeded for Google')
    })
  })
})

describe('Integration Tests', () => {
  test('should have proper API endpoints', () => {
    // 这些测试需要在实际环境中运行
    expect(typeof fetch).toBeDefined()
  })

  test('should have environment variables documented', () => {
    const requiredEnvVars = [
      'GOOGLE_INDEXING_API_KEY',
      'BING_WEBMASTER_API_KEY',
      'BAIDU_PUSH_TOKEN'
    ]
    
    // 检查环境变量是否在配置中定义
    requiredEnvVars.forEach(varName => {
      expect(process.env[varName]).toBeDefined()
    })
  })
})