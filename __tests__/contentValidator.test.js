/**
 * ContentValidator 内容验证器测试
 * 
 * 测试内容验证器的各项功能，包括：
 * - User-agent规则验证
 * - Allow/Disallow规则验证
 * - Sitemap声明验证
 * - Host声明验证
 * - 规则关系验证
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { ContentValidator } from '../lib/seo/contentValidator.js'

describe('ContentValidator 内容验证器测试', () => {
  let validator

  beforeEach(() => {
    validator = new ContentValidator()
  })

  describe('User-agent规则验证', () => {
    test('应该检测缺少User-agent组', async () => {
      const content = '# 只有注释\n# 没有User-agent'
      const checks = await validator.validate(content)
      
      const noUserAgentCheck = checks.find(c => c.id === 'no-user-agent-groups')
      expect(noUserAgentCheck).toBeDefined()
      expect(noUserAgentCheck.status).toBe('error')
      expect(noUserAgentCheck.severity).toBe('critical')
    })

    test('应该检测空的User-agent值', async () => {
      const content = 'User-agent:\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const emptyUserAgentCheck = checks.find(c => c.id === 'empty-user-agent')
      expect(emptyUserAgentCheck).toBeDefined()
      expect(emptyUserAgentCheck.status).toBe('error')
    })

    test('应该识别通配符User-agent', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const wildcardCheck = checks.find(c => c.id === 'wildcard-user-agent')
      expect(wildcardCheck).toBeDefined()
      expect(wildcardCheck.status).toBe('pass')
    })

    test('应该识别已知的搜索引擎机器人', async () => {
      const content = 'User-agent: Googlebot\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const knownBotCheck = checks.find(c => c.id === 'known-user-agent')
      expect(knownBotCheck).toBeDefined()
      expect(knownBotCheck.status).toBe('pass')
      expect(knownBotCheck.message).toContain('Google')
    })

    test('应该标记自定义User-agent', async () => {
      const content = 'User-agent: MyCustomBot\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const customBotCheck = checks.find(c => c.id === 'custom-user-agent')
      expect(customBotCheck).toBeDefined()
      expect(customBotCheck.status).toBe('info')
    })

    test('应该警告高优先级机器人没有规则', async () => {
      const content = 'User-agent: Googlebot'
      const checks = await validator.validate(content)
      
      const noBotRulesCheck = checks.find(c => c.id === 'high-priority-bot-no-rules')
      expect(noBotRulesCheck).toBeDefined()
      expect(noBotRulesCheck.status).toBe('warning')
    })

    test('应该检测User-agent格式问题', async () => {
      const content = 'User-agent: Bot<script>\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const formatCheck = checks.find(c => c.id === 'invalid-user-agent-format')
      expect(formatCheck).toBeDefined()
      expect(formatCheck.status).toBe('warning')
    })

    test('应该验证User-agent有规则', async () => {
      const content = 'User-agent: *\nDisallow: /admin/\nAllow: /public/'
      const checks = await validator.validate(content)
      
      const hasRulesCheck = checks.find(c => c.id === 'user-agent-has-rules')
      expect(hasRulesCheck).toBeDefined()
      expect(hasRulesCheck.status).toBe('pass')
      expect(hasRulesCheck.message).toContain('2个规则')
    })

    test('应该警告User-agent没有规则', async () => {
      const validator = new ContentValidator({ requireUserAgentRules: true })
      const content = 'User-agent: *'
      const checks = await validator.validate(content)
      
      const noRulesCheck = checks.find(c => c.id === 'user-agent-no-rules')
      expect(noRulesCheck).toBeDefined()
      expect(noRulesCheck.status).toBe('warning')
    })
  })

  describe('Crawl-delay验证', () => {
    test('应该验证合理的Crawl-delay', async () => {
      const content = 'User-agent: *\nCrawl-delay: 1\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const reasonableDelayCheck = checks.find(c => c.id === 'reasonable-crawl-delay')
      expect(reasonableDelayCheck).toBeDefined()
      expect(reasonableDelayCheck.status).toBe('pass')
    })

    test('应该警告搜索引擎过长的Crawl-delay', async () => {
      const content = 'User-agent: Googlebot\nCrawl-delay: 15\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const excessiveDelayCheck = checks.find(c => c.id === 'excessive-crawl-delay-search')
      expect(excessiveDelayCheck).toBeDefined()
      expect(excessiveDelayCheck.status).toBe('warning')
    })

    test('应该提示SEO工具较短的Crawl-delay', async () => {
      const content = 'User-agent: AhrefsBot\nCrawl-delay: 2\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const lowDelayCheck = checks.find(c => c.id === 'low-crawl-delay-seo')
      expect(lowDelayCheck).toBeDefined()
      expect(lowDelayCheck.status).toBe('info')
    })
  })

  describe('User-agent组关系验证', () => {
    test('应该检测通配符和特定机器人的组合', async () => {
      const content = `User-agent: *
Disallow: /admin/

User-agent: Googlebot
Allow: /`
      const checks = await validator.validate(content)
      
      const wildcardWithSpecificCheck = checks.find(c => c.id === 'wildcard-with-specific-bots')
      expect(wildcardWithSpecificCheck).toBeDefined()
      expect(wildcardWithSpecificCheck.status).toBe('pass')
    })

    test('应该识别高优先级机器人配置', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/

User-agent: Bingbot
Allow: /`
      const checks = await validator.validate(content)
      
      const highPriorityCheck = checks.find(c => c.id === 'high-priority-bots-configured')
      expect(highPriorityCheck).toBeDefined()
      expect(highPriorityCheck.status).toBe('pass')
    })

    test('应该警告缺少通配符User-agent', async () => {
      const validator = new ContentValidator({ allowWildcardUserAgent: true })
      const content = 'User-agent: Googlebot\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const noWildcardCheck = checks.find(c => c.id === 'no-wildcard-user-agent')
      expect(noWildcardCheck).toBeDefined()
      expect(noWildcardCheck.status).toBe('warning')
    })

    test('应该警告多个通配符User-agent', async () => {
      const content = `User-agent: *
Disallow: /admin/

User-agent: *
Allow: /public/`
      const checks = await validator.validate(content)
      
      const multipleWildcardCheck = checks.find(c => c.id === 'multiple-wildcard-user-agents')
      expect(multipleWildcardCheck).toBeDefined()
      expect(multipleWildcardCheck.status).toBe('warning')
    })

    test('应该提示通配符不在最后位置', async () => {
      const content = `User-agent: *
Disallow: /admin/

User-agent: Googlebot
Allow: /`
      const checks = await validator.validate(content)
      
      const wildcardNotLastCheck = checks.find(c => c.id === 'wildcard-not-last')
      expect(wildcardNotLastCheck).toBeDefined()
      expect(wildcardNotLastCheck.status).toBe('info')
    })

    test('应该检测重复的User-agent', async () => {
      const content = `User-agent: Googlebot
Disallow: /admin/

User-agent: Googlebot
Allow: /public/`
      const checks = await validator.validate(content)
      
      const duplicateCheck = checks.find(c => c.id === 'duplicate-user-agent')
      expect(duplicateCheck).toBeDefined()
      expect(duplicateCheck.status).toBe('warning')
    })
  })

  describe('规则关系验证', () => {
    test('应该检测孤立的路径规则', async () => {
      const content = `# 没有User-agent的规则
Disallow: /admin/
Allow: /public/`
      const checks = await validator.validate(content)
      
      const orphanedRulesCheck = checks.find(c => c.id === 'orphaned-path-rules')
      expect(orphanedRulesCheck).toBeDefined()
      expect(orphanedRulesCheck.status).toBe('error')
    })

    test('应该统计规则分布', async () => {
      const content = `User-agent: *
Disallow: /admin/
Allow: /public/

User-agent: Googlebot
Disallow: /private/`
      const checks = await validator.validate(content)
      
      const distributionCheck = checks.find(c => c.id === 'rules-distribution-ok')
      expect(distributionCheck).toBeDefined()
      expect(distributionCheck.status).toBe('pass')
      expect(distributionCheck.message).toContain('3个访问规则')
    })
  })

  describe('占位符验证', () => {
    test('应该显示路径规则验证占位符', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const pathPlaceholderCheck = checks.find(c => c.id === 'path-rules-placeholder')
      expect(pathPlaceholderCheck).toBeDefined()
      expect(pathPlaceholderCheck.status).toBe('info')
    })

    test('应该显示Sitemap验证占位符', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const sitemapPlaceholderCheck = checks.find(c => c.id === 'sitemap-validation-placeholder')
      expect(sitemapPlaceholderCheck).toBeDefined()
      expect(sitemapPlaceholderCheck.status).toBe('info')
    })

    test('应该显示Host验证占位符', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const hostPlaceholderCheck = checks.find(c => c.id === 'host-validation-placeholder')
      expect(hostPlaceholderCheck).toBeDefined()
      expect(hostPlaceholderCheck.status).toBe('info')
    })
  })

  describe('配置选项', () => {
    test('应该使用自定义配置', () => {
      const customValidator = new ContentValidator({
        strictMode: true,
        requireUserAgentRules: true,
        allowWildcardUserAgent: false
      })
      
      expect(customValidator.options.strictMode).toBe(true)
      expect(customValidator.options.requireUserAgentRules).toBe(true)
      expect(customValidator.options.allowWildcardUserAgent).toBe(false)
    })
  })

  describe('工具方法', () => {
    test('应该获取已知User-agent信息', () => {
      const info = validator.getKnownUserAgentInfo('Googlebot')
      
      expect(info).toBeDefined()
      expect(info.name).toBe('Google')
      expect(info.category).toBe('search')
      expect(info.priority).toBe('high')
    })

    test('应该检查User-agent是否已知', () => {
      expect(validator.isKnownUserAgent('Googlebot')).toBe(true)
      expect(validator.isKnownUserAgent('googlebot')).toBe(true)
      expect(validator.isKnownUserAgent('UnknownBot')).toBe(false)
    })

    test('应该获取所有已知User-agent列表', () => {
      const knownUserAgents = validator.getKnownUserAgents()
      
      expect(knownUserAgents).toHaveProperty('googlebot')
      expect(knownUserAgents).toHaveProperty('bingbot')
      expect(knownUserAgents).toHaveProperty('ahrefsbot')
      expect(knownUserAgents.googlebot.name).toBe('Google')
    })
  })

  describe('错误处理', () => {
    test('应该处理验证错误', async () => {
      const validator = new ContentValidator()
      
      // 重写一个方法来抛出错误
      const originalMethod = validator._parseContent
      validator._parseContent = () => {
        throw new Error('测试错误')
      }
      
      const checks = await validator.validate('test content')
      
      const errorCheck = checks.find(c => c.id === 'content-validation-error')
      expect(errorCheck).toBeDefined()
      expect(errorCheck.status).toBe('error')
      expect(errorCheck.severity).toBe('critical')
      
      // 恢复原方法
      validator._parseContent = originalMethod
    })
  })

  describe('复杂场景测试', () => {
    test('应该处理完整的robots.txt文件', async () => {
      const content = `# Robots.txt for example.com
User-agent: *
Allow: /

# Search engines
User-agent: Googlebot
Disallow: /admin/
Crawl-delay: 1

User-agent: Bingbot
Disallow: /private/
Crawl-delay: 2

# SEO tools
User-agent: AhrefsBot
Disallow: /

# AI bots
User-agent: GPTBot
Disallow: /

Sitemap: https://example.com/sitemap.xml
Host: example.com`

      const checks = await validator.validate(content)
      
      // 应该有多个通过的检查
      const passedChecks = checks.filter(c => c.status === 'pass')
      expect(passedChecks.length).toBeGreaterThan(0)
      
      // 应该识别已知机器人
      const knownBotChecks = checks.filter(c => c.id === 'known-user-agent')
      expect(knownBotChecks.length).toBeGreaterThan(0)
      
      // 应该有规则分布检查
      const distributionCheck = checks.find(c => c.id === 'rules-distribution-ok')
      expect(distributionCheck).toBeDefined()
    })

    test('应该处理有问题的robots.txt文件', async () => {
      const content = `# 文件开头就有孤立的规则
Disallow: /orphaned-at-start/

User-agent:
Disallow: /admin/

User-agent: Bot<script>
Allow: /public/

User-agent: Googlebot

User-agent: Googlebot
Disallow: /duplicate/

User-agent: *
Allow: /wildcard/

User-agent: *
Disallow: /another-wildcard/`

      const checks = await validator.validate(content)
      
      // 应该检测到多个问题
      const errors = checks.filter(c => c.status === 'error')
      const warnings = checks.filter(c => c.status === 'warning')
      
      expect(errors.length).toBeGreaterThan(0)
      expect(warnings.length).toBeGreaterThan(0)
      
      // 检查特定问题
      expect(checks.some(c => c.id === 'empty-user-agent')).toBe(true)
      expect(checks.some(c => c.id === 'invalid-user-agent-format')).toBe(true)
      expect(checks.some(c => c.id === 'duplicate-user-agent')).toBe(true)
      expect(checks.some(c => c.id === 'orphaned-path-rules')).toBe(true)
      expect(checks.some(c => c.id === 'multiple-wildcard-user-agents')).toBe(true)
    })

    test('应该处理只有通配符的简单文件', async () => {
      const content = `User-agent: *
Disallow: /admin/
Allow: /public/`

      const checks = await validator.validate(content)
      
      // 应该通过基本验证
      const wildcardCheck = checks.find(c => c.id === 'wildcard-user-agent')
      expect(wildcardCheck).toBeDefined()
      expect(wildcardCheck.status).toBe('pass')
      
      const hasRulesCheck = checks.find(c => c.id === 'user-agent-has-rules')
      expect(hasRulesCheck).toBeDefined()
      expect(hasRulesCheck.status).toBe('pass')
    })
  })
})