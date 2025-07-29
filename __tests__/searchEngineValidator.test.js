/**
 * SearchEngineValidator 搜索引擎特定规则验证器测试
 * 
 * 测试搜索引擎特定规则验证器的各项功能，包括：
 * - 主要搜索引擎配置验证
 * - Crawl-delay设置合理性检查
 * - 搜索引擎访问权限验证
 * - SEO最佳实践分析
 * - 索引策略分析
 * - SEO优化建议生成
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { SearchEngineValidator } from '../lib/seo/searchEngineValidator.js'

describe('SearchEngineValidator 搜索引擎特定规则验证器测试', () => {
  let validator

  beforeEach(() => {
    validator = new SearchEngineValidator()
  })

  describe('主要搜索引擎配置验证', () => {
    test('应该检测已配置的主要搜索引擎', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/
Allow: /public/`
      const checks = await validator.validate(content)
      
      const configuredCheck = checks.find(c => c.id === 'major-search-engine-configured')
      expect(configuredCheck).toBeDefined()
      expect(configuredCheck.status).toBe('pass')
      expect(configuredCheck.message).toContain('Google')
    })

    test('应该警告缺少主要搜索引擎配置', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const missingGoogleCheck = checks.find(c => 
        c.id === 'major-search-engine-missing' && c.message.includes('Google')
      )
      expect(missingGoogleCheck).toBeDefined()
      expect(missingGoogleCheck.status).toBe('warning')
      expect(missingGoogleCheck.severity).toBe('high') // Google是critical优先级
    })

    test('应该验证搜索引擎有规则配置', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/
Allow: /public/`
      const checks = await validator.validate(content)
      
      const hasRulesCheck = checks.find(c => c.id === 'search-engine-has-rules')
      expect(hasRulesCheck).toBeDefined()
      expect(hasRulesCheck.status).toBe('pass')
      expect(hasRulesCheck.message).toContain('2个访问规则')
    })

    test('应该警告搜索引擎没有规则', async () => {
      const content = `User-agent: Googlebot`
      const checks = await validator.validate(content)
      
      const noRulesCheck = checks.find(c => c.id === 'search-engine-no-rules')
      expect(noRulesCheck).toBeDefined()
      expect(noRulesCheck.status).toBe('warning')
    })
  })

  describe('Crawl-delay设置验证', () => {
    test('应该验证合理的Crawl-delay设置', async () => {
      const content = `User-agent: Googlebot
Crawl-delay: 1
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const optimalDelayCheck = checks.find(c => c.id === 'optimal-crawl-delay')
      expect(optimalDelayCheck).toBeDefined()
      expect(optimalDelayCheck.status).toBe('pass')
      expect(optimalDelayCheck.message).toContain('1秒')
    })

    test('应该警告过长的Crawl-delay', async () => {
      const content = `User-agent: Googlebot
Crawl-delay: 30
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const excessiveDelayCheck = checks.find(c => c.id === 'excessive-crawl-delay')
      expect(excessiveDelayCheck).toBeDefined()
      expect(excessiveDelayCheck.status).toBe('warning')
      expect(excessiveDelayCheck.message).toContain('过长')
    })

    test('应该分析Crawl-delay分布', async () => {
      const content = `User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 2`
      const checks = await validator.validate(content)
      
      const distributionCheck = checks.find(c => c.id === 'crawl-delay-distribution')
      expect(distributionCheck).toBeDefined()
      expect(distributionCheck.status).toBe('pass')
      expect(distributionCheck.message).toContain('平均')
    })

    test('应该检测极端的Crawl-delay值', async () => {
      const content = `User-agent: SomeBot
Crawl-delay: 120`
      const checks = await validator.validate(content)
      
      const extremeDelayCheck = checks.find(c => c.id === 'extreme-crawl-delay')
      expect(extremeDelayCheck).toBeDefined()
      expect(extremeDelayCheck.status).toBe('warning')
      expect(extremeDelayCheck.message).toContain('120秒')
    })
  })

  describe('SEO最佳实践验证', () => {
    test('应该检测CSS/JS资源被阻止', async () => {
      const content = `User-agent: Googlebot
Disallow: /css/
Disallow: /js/`
      const checks = await validator.validate(content)
      
      const cssJsBlockedCheck = checks.find(c => c.id === 'css-js-blocked')
      expect(cssJsBlockedCheck).toBeDefined()
      expect(cssJsBlockedCheck.status).toBe('warning')
      expect(cssJsBlockedCheck.message).toContain('CSS/JS资源')
    })

    test('应该验证CSS/JS资源可访问', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/
Allow: /`
      const checks = await validator.validate(content)
      
      const cssJsAccessibleCheck = checks.find(c => c.id === 'css-js-accessible')
      expect(cssJsAccessibleCheck).toBeDefined()
      expect(cssJsAccessibleCheck.status).toBe('pass')
    })

    test('应该检测搜索引擎被完全阻止', async () => {
      const content = `User-agent: Googlebot
Disallow: /`
      const checks = await validator.validate(content)
      
      const completelyBlockedCheck = checks.find(c => c.id === 'search-engine-completely-blocked')
      expect(completelyBlockedCheck).toBeDefined()
      expect(completelyBlockedCheck.status).toBe('error')
      expect(completelyBlockedCheck.severity).toBe('critical')
    })

    test('应该检测缺少Sitemap声明', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const missingSitemapCheck = checks.find(c => c.id === 'missing-sitemap-declaration')
      expect(missingSitemapCheck).toBeDefined()
      expect(missingSitemapCheck.status).toBe('warning')
    })

    test('应该验证Sitemap已声明', async () => {
      const content = `User-agent: *
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml`
      const checks = await validator.validate(content)
      
      const sitemapDeclaredCheck = checks.find(c => c.id === 'sitemap-declared')
      expect(sitemapDeclaredCheck).toBeDefined()
      expect(sitemapDeclaredCheck.status).toBe('pass')
    })

    test('应该检测重要页面被阻止', async () => {
      const content = `User-agent: *
Disallow: /sitemap.xml`
      const checks = await validator.validate(content)
      
      const importantPageBlockedCheck = checks.find(c => c.id === 'important-page-blocked')
      expect(importantPageBlockedCheck).toBeDefined()
      expect(importantPageBlockedCheck.status).toBe('warning')
      expect(importantPageBlockedCheck.message).toContain('/sitemap.xml')
    })
  })

  describe('搜索引擎访问权限验证', () => {
    test('应该分析搜索引擎访问范围 - 完全访问', async () => {
      const content = `User-agent: Googlebot
Allow: /`
      const checks = await validator.validate(content)
      
      const accessScopeCheck = checks.find(c => c.id === 'search-engine-access-scope')
      expect(accessScopeCheck).toBeDefined()
      expect(accessScopeCheck.status).toBe('pass')
      expect(accessScopeCheck.message).toContain('完全访问')
    })

    test('应该分析搜索引擎访问范围 - 完全阻止', async () => {
      const content = `User-agent: Googlebot
Disallow: /`
      const checks = await validator.validate(content)
      
      const accessScopeCheck = checks.find(c => c.id === 'search-engine-access-scope')
      expect(accessScopeCheck).toBeDefined()
      expect(accessScopeCheck.status).toBe('error')
      expect(accessScopeCheck.message).toContain('完全阻止')
    })

    test('应该分析搜索引擎访问范围 - 选择性访问', async () => {
      const content = `User-agent: Googlebot
Disallow: /
Allow: /public/`
      const checks = await validator.validate(content)
      
      const accessScopeCheck = checks.find(c => c.id === 'search-engine-access-scope')
      expect(accessScopeCheck).toBeDefined()
      expect(accessScopeCheck.message).toContain('选择性访问')
    })

    test('应该警告限制性通配符规则没有例外', async () => {
      const content = `User-agent: *
Disallow: /`
      const checks = await validator.validate(content)
      
      const restrictiveWildcardCheck = checks.find(c => c.id === 'restrictive-wildcard-no-exceptions')
      expect(restrictiveWildcardCheck).toBeDefined()
      expect(restrictiveWildcardCheck.status).toBe('warning')
    })
  })

  describe('机器人友好性分析', () => {
    test('应该评估高机器人友好性', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/
Allow: /public/

User-agent: Bingbot
Disallow: /private/

Sitemap: https://example.com/sitemap.xml`
      const checks = await validator.validate(content)
      
      const highFriendlinessCheck = checks.find(c => c.id === 'high-bot-friendliness')
      expect(highFriendlinessCheck).toBeDefined()
      expect(highFriendlinessCheck.status).toBe('pass')
      expect(highFriendlinessCheck.message).toContain('优秀')
    })

    test('应该评估低机器人友好性', async () => {
      const content = `User-agent: *
Disallow: /`
      const checks = await validator.validate(content)
      
      const lowFriendlinessCheck = checks.find(c => c.id === 'low-bot-friendliness')
      expect(lowFriendlinessCheck).toBeDefined()
      expect(lowFriendlinessCheck.status).toBe('warning')
      expect(lowFriendlinessCheck.message).toContain('较低')
    })
  })

  describe('索引策略分析', () => {
    test('应该识别开放式索引策略', async () => {
      const content = `User-agent: *
Allow: /`
      const checks = await validator.validate(content)
      
      const strategyCheck = checks.find(c => c.id === 'indexing-strategy-analysis')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('开放式索引')
      
      const recommendationCheck = checks.find(c => c.id === 'open-strategy-recommendation')
      expect(recommendationCheck).toBeDefined()
    })

    test('应该识别白名单式索引策略', async () => {
      const content = `User-agent: *
Disallow: /
Allow: /public/`
      const checks = await validator.validate(content)
      
      const strategyCheck = checks.find(c => c.id === 'indexing-strategy-analysis')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('白名单式索引')
    })

    test('应该识别黑名单式索引策略', async () => {
      const content = `User-agent: *
Disallow: /admin/
Disallow: /private/`
      const checks = await validator.validate(content)
      
      const strategyCheck = checks.find(c => c.id === 'indexing-strategy-analysis')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('黑名单式索引')
    })

    test('应该警告阻止式索引策略', async () => {
      const content = `User-agent: *
Disallow: /`
      const checks = await validator.validate(content)
      
      const strategyCheck = checks.find(c => c.id === 'indexing-strategy-analysis')
      expect(strategyCheck).toBeDefined()
      expect(strategyCheck.message).toContain('阻止式索引')
      
      const warningCheck = checks.find(c => c.id === 'blocked-strategy-warning')
      expect(warningCheck).toBeDefined()
      expect(warningCheck.status).toBe('error')
    })
  })

  describe('SEO优化建议', () => {
    test('应该建议添加Google配置', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const googleRecommendation = checks.find(c => 
        c.id.startsWith('seo-recommendation') && c.message.includes('Google')
      )
      expect(googleRecommendation).toBeDefined()
      expect(googleRecommendation.status).toBe('info')
    })

    test('应该建议添加Sitemap', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const sitemapRecommendation = checks.find(c => 
        c.id.startsWith('seo-recommendation') && c.message.includes('Sitemap')
      )
      expect(sitemapRecommendation).toBeDefined()
    })

    test('应该建议允许CSS/JS访问', async () => {
      const content = `User-agent: Googlebot
Disallow: /css/
Disallow: /js/`
      const checks = await validator.validate(content)
      
      const cssJsRecommendation = checks.find(c => 
        c.id.startsWith('seo-recommendation') && c.message.includes('CSS和JavaScript')
      )
      expect(cssJsRecommendation).toBeDefined()
    })

    test('应该确认SEO已优化', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/
Allow: /

Sitemap: https://example.com/sitemap.xml`
      const checks = await validator.validate(content)
      
      const wellOptimizedCheck = checks.find(c => c.id === 'seo-well-optimized')
      expect(wellOptimizedCheck).toBeDefined()
      expect(wellOptimizedCheck.status).toBe('pass')
    })

    test('应该生成建议摘要', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const summaryCheck = checks.find(c => c.id === 'seo-recommendations-summary')
      expect(summaryCheck).toBeDefined()
      expect(summaryCheck.message).toContain('条SEO优化建议')
    })
  })

  describe('搜索引擎覆盖度分析', () => {
    test('应该评估优秀的搜索引擎覆盖度', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/

User-agent: Bingbot
Disallow: /private/`
      const checks = await validator.validate(content)
      
      const excellentCoverageCheck = checks.find(c => c.id === 'excellent-search-engine-coverage')
      expect(excellentCoverageCheck).toBeDefined()
      expect(excellentCoverageCheck.status).toBe('pass')
      expect(excellentCoverageCheck.message).toContain('优秀')
    })

    test('应该评估有限的搜索引擎覆盖度', async () => {
      const content = `User-agent: DuckDuckBot
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const limitedCoverageCheck = checks.find(c => c.id === 'limited-search-engine-coverage')
      expect(limitedCoverageCheck).toBeDefined()
      expect(limitedCoverageCheck.status).toBe('warning')
      expect(limitedCoverageCheck.message).toContain('有限')
    })
  })

  describe('通配符规则影响分析', () => {
    test('应该分析通配符与特定搜索引擎共存', async () => {
      const content = `User-agent: *
Disallow: /admin/

User-agent: Googlebot
Allow: /`
      const checks = await validator.validate(content)
      
      const wildcardWithSpecificCheck = checks.find(c => c.id === 'wildcard-with-specific-engines')
      expect(wildcardWithSpecificCheck).toBeDefined()
      expect(wildcardWithSpecificCheck.status).toBe('pass')
    })

    test('应该提示只有通配符规则', async () => {
      const content = `User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const onlyWildcardCheck = checks.find(c => c.id === 'only-wildcard-rules')
      expect(onlyWildcardCheck).toBeDefined()
      expect(onlyWildcardCheck.status).toBe('info')
    })
  })

  describe('配置选项', () => {
    test('应该使用自定义配置', () => {
      const customValidator = new SearchEngineValidator({
        strictMode: true,
        checkCrawlDelayReasonableness: false,
        validateSearchEngineAccess: false,
        recommendOptimalSettings: false,
        checkSEOBestPractices: false,
        analyzeIndexingStrategy: false
      })
      
      expect(customValidator.options.strictMode).toBe(true)
      expect(customValidator.options.checkCrawlDelayReasonableness).toBe(false)
      expect(customValidator.options.validateSearchEngineAccess).toBe(false)
      expect(customValidator.options.recommendOptimalSettings).toBe(false)
      expect(customValidator.options.checkSEOBestPractices).toBe(false)
      expect(customValidator.options.analyzeIndexingStrategy).toBe(false)
    })
  })

  describe('工具方法', () => {
    test('应该获取支持的搜索引擎列表', () => {
      const engines = validator.getSupportedSearchEngines()
      
      expect(engines).toHaveProperty('googlebot')
      expect(engines).toHaveProperty('bingbot')
      expect(engines).toHaveProperty('baiduspider')
      expect(engines.googlebot.name).toBe('Google')
      expect(engines.googlebot.priority).toBe('critical')
    })

    test('应该检查是否为已知搜索引擎', () => {
      expect(validator.isKnownSearchEngine('Googlebot')).toBe(true)
      expect(validator.isKnownSearchEngine('googlebot')).toBe(true)
      expect(validator.isKnownSearchEngine('UnknownBot')).toBe(false)
    })

    test('应该获取搜索引擎配置', () => {
      const config = validator.getSearchEngineConfig('Googlebot')
      
      expect(config).toBeDefined()
      expect(config.name).toBe('Google')
      expect(config.priority).toBe('critical')
      expect(config.marketShare).toBe(92.0)
      
      const unknownConfig = validator.getSearchEngineConfig('UnknownBot')
      expect(unknownConfig).toBeNull()
    })
  })

  describe('错误处理', () => {
    test('应该处理验证错误', async () => {
      const validator = new SearchEngineValidator()
      
      // 重写一个方法来抛出错误
      const originalMethod = validator._parseContent
      validator._parseContent = () => {
        throw new Error('测试错误')
      }
      
      const checks = await validator.validate('test content')
      
      const errorCheck = checks.find(c => c.id === 'search-engine-validation-error')
      expect(errorCheck).toBeDefined()
      expect(errorCheck.status).toBe('error')
      expect(errorCheck.severity).toBe('critical')
      
      // 恢复原方法
      validator._parseContent = originalMethod
    })
  })

  describe('复杂场景测试', () => {
    test('应该处理完整的搜索引擎优化配置', async () => {
      const content = `# SEO优化的robots.txt
User-agent: Googlebot
Disallow: /admin/
Disallow: /private/
Allow: /css/
Allow: /js/
Allow: /images/
Crawl-delay: 1

User-agent: Bingbot
Disallow: /admin/
Crawl-delay: 2

User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /temp/

Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/news-sitemap.xml`

      const checks = await validator.validate(content)
      
      // 应该有多个通过的检查
      const passedChecks = checks.filter(c => c.status === 'pass')
      expect(passedChecks.length).toBeGreaterThan(5)
      
      // 应该有优秀的搜索引擎覆盖度
      const excellentCoverageCheck = checks.find(c => c.id === 'excellent-search-engine-coverage')
      expect(excellentCoverageCheck).toBeDefined()
      
      // 应该有高机器人友好性
      const highFriendlinessCheck = checks.find(c => c.id === 'high-bot-friendliness')
      expect(highFriendlinessCheck).toBeDefined()
      
      // 应该确认SEO已优化
      const wellOptimizedCheck = checks.find(c => c.id === 'seo-well-optimized')
      expect(wellOptimizedCheck).toBeDefined()
    })

    test('应该处理有问题的搜索引擎配置', async () => {
      const content = `User-agent: Googlebot
Disallow: /
Crawl-delay: 60

User-agent: Bingbot
Disallow: /css/
Disallow: /js/
Disallow: /images/

User-agent: *
Disallow: /sitemap.xml`

      const checks = await validator.validate(content)
      
      // 应该检测到多个问题
      const errors = checks.filter(c => c.status === 'error')
      const warnings = checks.filter(c => c.status === 'warning')
      
      expect(errors.length).toBeGreaterThan(0)
      expect(warnings.length).toBeGreaterThan(0)
      
      // 检查特定问题
      expect(checks.some(c => c.id === 'search-engine-completely-blocked')).toBe(true)
      expect(checks.some(c => c.id === 'excessive-crawl-delay')).toBe(true)
      expect(checks.some(c => c.id === 'css-js-blocked')).toBe(true)
      expect(checks.some(c => c.id === 'important-page-blocked')).toBe(true)
    })

    test('应该处理基本的搜索引擎配置', async () => {
      const content = `User-agent: *
Disallow: /admin/
Allow: /public/`

      const checks = await validator.validate(content)
      
      // 应该有基本的分析结果
      const strategyCheck = checks.find(c => c.id === 'indexing-strategy-analysis')
      expect(strategyCheck).toBeDefined()
      
      const friendlinessCheck = checks.find(c => 
        c.id.includes('bot-friendliness')
      )
      expect(friendlinessCheck).toBeDefined()
      
      // 应该有SEO建议
      const recommendationChecks = checks.filter(c => 
        c.id.startsWith('seo-recommendation')
      )
      expect(recommendationChecks.length).toBeGreaterThan(0)
    })
  })
})