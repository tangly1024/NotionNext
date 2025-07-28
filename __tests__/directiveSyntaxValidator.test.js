/**
 * DirectiveSyntaxValidator 指令语法验证器测试
 * 
 * 测试指令语法验证器的各项功能，包括：
 * - 指令语法格式验证
 * - 指令参数有效性检查
 * - 指令关系验证
 * - 必需指令检查
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { DirectiveSyntaxValidator } from '../lib/seo/directiveSyntaxValidator.js'

describe('DirectiveSyntaxValidator 指令语法验证器测试', () => {
  let validator

  beforeEach(() => {
    validator = new DirectiveSyntaxValidator()
  })

  describe('指令结构验证', () => {
    test('应该检测无效的指令名称格式', async () => {
      const content = 'User_Agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const invalidNameCheck = checks.find(c => c.id === 'invalid-directive-name')
      expect(invalidNameCheck).toBeDefined()
      expect(invalidNameCheck.status).toBe('error')
      expect(invalidNameCheck.line).toBe(1)
    })

    test('应该检测不支持的指令', async () => {
      const validator = new DirectiveSyntaxValidator({ allowUnknownDirectives: false })
      const content = 'User-agent: *\nUnknown-directive: value'
      const checks = await validator.validate(content)
      
      const unsupportedCheck = checks.find(c => c.id === 'unsupported-directive')
      expect(unsupportedCheck).toBeDefined()
      expect(unsupportedCheck.status).toBe('error')
    })

    test('应该警告未知指令（允许模式）', async () => {
      const validator = new DirectiveSyntaxValidator({ allowUnknownDirectives: true })
      const content = 'User-agent: *\nUnknown-directive: value'
      const checks = await validator.validate(content)
      
      const unknownCheck = checks.find(c => c.id === 'unknown-directive-warning')
      expect(unknownCheck).toBeDefined()
      expect(unknownCheck.status).toBe('warning')
    })

    test('应该检测指令名称空格问题', async () => {
      const content = ' User-agent : *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const whitespaceCheck = checks.find(c => c.id === 'directive-name-whitespace')
      expect(whitespaceCheck).toBeDefined()
      expect(whitespaceCheck.status).toBe('warning')
    })

    test('应该检测指令值空格问题', async () => {
      const content = 'User-agent:  * \nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const valueWhitespaceCheck = checks.find(c => c.id === 'directive-value-whitespace')
      expect(valueWhitespaceCheck).toBeDefined()
      expect(valueWhitespaceCheck.status).toBe('warning')
    })
  })

  describe('指令语法验证', () => {
    test('应该检测空的必需指令值', async () => {
      const content = 'User-agent:\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const emptyValueCheck = checks.find(c => c.id === 'empty-directive-value')
      expect(emptyValueCheck).toBeDefined()
      expect(emptyValueCheck.status).toBe('error')
    })

    test('应该检测无效的指令格式', async () => {
      const content = 'User-agent: <invalid>\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const invalidFormatCheck = checks.find(c => c.id === 'invalid-directive-format')
      expect(invalidFormatCheck).toBeDefined()
      expect(invalidFormatCheck.status).toBe('error')
    })

    test('应该允许Disallow空值', async () => {
      const content = 'User-agent: *\nDisallow:'
      const checks = await validator.validate(content)
      
      const emptyDisallowCheck = checks.find(c => c.id === 'empty-directive-value' && c.line === 2)
      expect(emptyDisallowCheck).toBeUndefined()
    })
  })

  describe('User-agent参数验证', () => {
    test('应该识别通配符User-agent', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const wildcardCheck = checks.find(c => c.id === 'user-agent-wildcard')
      expect(wildcardCheck).toBeDefined()
      expect(wildcardCheck.status).toBe('pass')
    })

    test('应该识别已知的User-agent', async () => {
      const content = 'User-agent: Googlebot\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const knownUserAgentCheck = checks.find(c => c.id === 'known-user-agent')
      expect(knownUserAgentCheck).toBeDefined()
      expect(knownUserAgentCheck.status).toBe('pass')
    })

    test('应该标记自定义User-agent', async () => {
      const content = 'User-agent: MyCustomBot\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const customUserAgentCheck = checks.find(c => c.id === 'custom-user-agent')
      expect(customUserAgentCheck).toBeDefined()
      expect(customUserAgentCheck.status).toBe('info')
    })

    test('应该警告User-agent中的特殊字符', async () => {
      const content = 'User-agent: Bot<script>\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const specialCharsCheck = checks.find(c => c.id === 'user-agent-special-chars')
      expect(specialCharsCheck).toBeDefined()
      expect(specialCharsCheck.status).toBe('warning')
    })
  })

  describe('路径参数验证', () => {
    test('应该检测空的Allow路径', async () => {
      const content = 'User-agent: *\nAllow:'
      const checks = await validator.validate(content)
      
      const emptyAllowCheck = checks.find(c => c.id === 'empty-allow-path')
      expect(emptyAllowCheck).toBeDefined()
      expect(emptyAllowCheck.status).toBe('error')
    })

    test('应该检测无效的路径格式', async () => {
      const content = 'User-agent: *\nDisallow: admin'
      const checks = await validator.validate(content)
      
      const invalidPathCheck = checks.find(c => c.id === 'invalid-path-format')
      expect(invalidPathCheck).toBeDefined()
      expect(invalidPathCheck.status).toBe('error')
    })

    test('应该警告多个连续通配符', async () => {
      const content = 'User-agent: *\nDisallow: /admin/**'
      const checks = await validator.validate(content)
      
      const multipleWildcardsCheck = checks.find(c => c.id === 'multiple-wildcards')
      expect(multipleWildcardsCheck).toBeDefined()
      expect(multipleWildcardsCheck.status).toBe('warning')
    })

    test('应该识别URL编码路径', async () => {
      const content = 'User-agent: *\nDisallow: /admin%20panel'
      const checks = await validator.validate(content)
      
      const urlEncodedCheck = checks.find(c => c.id === 'url-encoded-path')
      expect(urlEncodedCheck).toBeDefined()
      expect(urlEncodedCheck.status).toBe('info')
    })

    test('应该警告路径中的特殊字符', async () => {
      const content = 'User-agent: *\nDisallow: /admin"test'
      const checks = await validator.validate(content)
      
      const specialCharsCheck = checks.find(c => c.id === 'path-special-chars')
      expect(specialCharsCheck).toBeDefined()
      expect(specialCharsCheck.status).toBe('warning')
    })
  })

  describe('Crawl-delay参数验证', () => {
    test('应该检测无效的Crawl-delay值', async () => {
      const content = 'User-agent: *\nCrawl-delay: invalid'
      const checks = await validator.validate(content)
      
      const invalidDelayCheck = checks.find(c => c.id === 'invalid-crawl-delay')
      expect(invalidDelayCheck).toBeDefined()
      expect(invalidDelayCheck.status).toBe('error')
    })

    test('应该检测负数Crawl-delay', async () => {
      const content = 'User-agent: *\nCrawl-delay: -5'
      const checks = await validator.validate(content)
      
      const negativeDelayCheck = checks.find(c => c.id === 'negative-crawl-delay')
      expect(negativeDelayCheck).toBeDefined()
      expect(negativeDelayCheck.status).toBe('error')
    })

    test('应该警告过长的Crawl-delay', async () => {
      const content = 'User-agent: *\nCrawl-delay: 100000'
      const checks = await validator.validate(content)
      
      const excessiveDelayCheck = checks.find(c => c.id === 'excessive-crawl-delay')
      expect(excessiveDelayCheck).toBeDefined()
      expect(excessiveDelayCheck.status).toBe('warning')
    })

    test('应该通过有效的Crawl-delay', async () => {
      const content = 'User-agent: *\nCrawl-delay: 1.5'
      const checks = await validator.validate(content)
      
      const validDelayCheck = checks.find(c => c.id === 'valid-crawl-delay')
      expect(validDelayCheck).toBeDefined()
      expect(validDelayCheck.status).toBe('pass')
    })
  })

  describe('Sitemap参数验证', () => {
    test('应该检测缺少协议的Sitemap', async () => {
      const content = 'User-agent: *\nSitemap: example.com/sitemap.xml'
      const checks = await validator.validate(content)
      
      const invalidProtocolCheck = checks.find(c => c.id === 'invalid-sitemap-protocol')
      expect(invalidProtocolCheck).toBeDefined()
      expect(invalidProtocolCheck.status).toBe('error')
    })

    test('应该警告HTTP协议的Sitemap', async () => {
      const content = 'User-agent: *\nSitemap: http://example.com/sitemap.xml'
      const checks = await validator.validate(content)
      
      const httpProtocolCheck = checks.find(c => c.id === 'sitemap-http-protocol')
      expect(httpProtocolCheck).toBeDefined()
      expect(httpProtocolCheck.status).toBe('warning')
    })

    test('应该警告不正确的Sitemap扩展名', async () => {
      const content = 'User-agent: *\nSitemap: https://example.com/sitemap.html'
      const checks = await validator.validate(content)
      
      const extensionCheck = checks.find(c => c.id === 'sitemap-extension')
      expect(extensionCheck).toBeDefined()
      expect(extensionCheck.status).toBe('warning')
    })
  })

  describe('Host参数验证', () => {
    test('应该检测包含协议的Host', async () => {
      const content = 'User-agent: *\nHost: https://example.com'
      const checks = await validator.validate(content)
      
      const hostWithProtocolCheck = checks.find(c => c.id === 'host-with-protocol')
      expect(hostWithProtocolCheck).toBeDefined()
      expect(hostWithProtocolCheck.status).toBe('error')
    })

    test('应该检测无效的Host格式', async () => {
      const content = 'User-agent: *\nHost: invalid..domain'
      const checks = await validator.validate(content)
      
      const invalidHostCheck = checks.find(c => c.id === 'invalid-host-format')
      expect(invalidHostCheck).toBeDefined()
      expect(invalidHostCheck.status).toBe('error')
    })

    test('应该通过有效的Host格式', async () => {
      const content = 'User-agent: *\nHost: example.com'
      const checks = await validator.validate(content)
      
      const validHostCheck = checks.find(c => c.id === 'valid-host-format')
      expect(validHostCheck).toBeDefined()
      expect(validHostCheck.status).toBe('pass')
    })
  })

  describe('Request-rate参数验证', () => {
    test('应该检测无效的Request-rate格式', async () => {
      const content = 'User-agent: *\nRequest-rate: invalid'
      const checks = await validator.validate(content)
      
      const invalidRateCheck = checks.find(c => c.id === 'invalid-request-rate')
      expect(invalidRateCheck).toBeDefined()
      expect(invalidRateCheck.status).toBe('error')
    })

    test('应该检测无效的Request-rate值', async () => {
      const content = 'User-agent: *\nRequest-rate: 0/10s'
      const checks = await validator.validate(content)
      
      const invalidValuesCheck = checks.find(c => c.id === 'invalid-request-rate-values')
      expect(invalidValuesCheck).toBeDefined()
      expect(invalidValuesCheck.status).toBe('error')
    })
  })

  describe('Visit-time参数验证', () => {
    test('应该检测无效的Visit-time格式', async () => {
      const content = 'User-agent: *\nVisit-time: invalid'
      const checks = await validator.validate(content)
      
      const invalidTimeCheck = checks.find(c => c.id === 'invalid-visit-time')
      expect(invalidTimeCheck).toBeDefined()
      expect(invalidTimeCheck.status).toBe('error')
    })

    test('应该检测无效的Visit-time值', async () => {
      const content = 'User-agent: *\nVisit-time: 2500-1700'
      const checks = await validator.validate(content)
      
      const invalidValuesCheck = checks.find(c => c.id === 'invalid-visit-time-values')
      expect(invalidValuesCheck).toBeDefined()
      expect(invalidValuesCheck.status).toBe('error')
    })
  })

  describe('指令关系验证', () => {
    test('应该检测孤立的规则', async () => {
      const content = 'Disallow: /admin/\nAllow: /public/'
      const checks = await validator.validate(content)
      
      const orphanedRulesCheck = checks.find(c => c.id === 'orphaned-rules')
      expect(orphanedRulesCheck).toBeDefined()
      expect(orphanedRulesCheck.status).toBe('error')
    })

    test('应该检测多个Host声明', async () => {
      const content = 'User-agent: *\nHost: example.com\nHost: test.com'
      const checks = await validator.validate(content)
      
      const multipleHostCheck = checks.find(c => c.id === 'multiple-host-declarations')
      expect(multipleHostCheck).toBeDefined()
      expect(multipleHostCheck.status).toBe('warning')
    })
  })

  describe('必需指令验证', () => {
    test('应该检测缺少User-agent指令', async () => {
      const validator = new DirectiveSyntaxValidator({ requireUserAgent: true })
      const content = 'Disallow: /admin/'
      const checks = await validator.validate(content)
      
      const missingUserAgentCheck = checks.find(c => c.id === 'missing-user-agent')
      expect(missingUserAgentCheck).toBeDefined()
      expect(missingUserAgentCheck.status).toBe('error')
    })

    test('应该通过有User-agent指令的检查', async () => {
      const validator = new DirectiveSyntaxValidator({ requireUserAgent: true })
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const hasUserAgentCheck = checks.find(c => c.id === 'has-user-agent')
      expect(hasUserAgentCheck).toBeDefined()
      expect(hasUserAgentCheck.status).toBe('pass')
    })
  })

  describe('配置选项', () => {
    test('应该使用自定义配置', async () => {
      const customValidator = new DirectiveSyntaxValidator({
        strictMode: true,
        allowUnknownDirectives: false,
        requireUserAgent: true
      })
      
      expect(customValidator.options.strictMode).toBe(true)
      expect(customValidator.options.allowUnknownDirectives).toBe(false)
      expect(customValidator.options.requireUserAgent).toBe(true)
    })
  })

  describe('工具方法', () => {
    test('应该返回指令规则', () => {
      const rules = validator.getDirectiveRules()
      
      expect(rules).toHaveProperty('user-agent')
      expect(rules).toHaveProperty('disallow')
      expect(rules).toHaveProperty('allow')
      expect(rules).toHaveProperty('sitemap')
    })

    test('应该检查指令有效性', () => {
      expect(validator.isValidDirective('user-agent')).toBe(true)
      expect(validator.isValidDirective('User-Agent')).toBe(true)
      expect(validator.isValidDirective('invalid-directive')).toBe(false)
    })
  })

  describe('错误处理', () => {
    test('应该处理验证错误', async () => {
      const validator = new DirectiveSyntaxValidator()
      
      // 重写一个方法来抛出错误
      const originalMethod = validator._parseDirectives
      validator._parseDirectives = () => {
        throw new Error('测试错误')
      }
      
      const checks = await validator.validate('test content')
      
      const errorCheck = checks.find(c => c.id === 'directive-syntax-error')
      expect(errorCheck).toBeDefined()
      expect(errorCheck.status).toBe('error')
      expect(errorCheck.severity).toBe('critical')
      
      // 恢复原方法
      validator._parseDirectives = originalMethod
    })
  })

  describe('复杂场景测试', () => {
    test('应该处理完整的robots.txt文件', async () => {
      const content = `User-agent: *
Allow: /

User-agent: Googlebot
Disallow: /admin/
Crawl-delay: 1

User-agent: Bingbot
Disallow: /private/
Crawl-delay: 2

Sitemap: https://example.com/sitemap.xml
Host: example.com`

      const checks = await validator.validate(content)
      
      // 应该有多个通过的检查
      const passedChecks = checks.filter(c => c.status === 'pass')
      expect(passedChecks.length).toBeGreaterThan(0)
      
      // 不应该有严重错误
      const criticalErrors = checks.filter(c => c.status === 'error' && c.severity === 'critical')
      expect(criticalErrors.length).toBe(0)
    })

    test('应该处理有问题的robots.txt文件', async () => {
      const content = `User_agent: *
Allow:
Disallow: admin
Crawl-delay: -1
Sitemap: example.com/sitemap.xml
Host: https://example.com
Request-rate: invalid
Visit-time: 2500-1700`

      const checks = await validator.validate(content)
      
      // 应该检测到多个问题
      const errors = checks.filter(c => c.status === 'error')
      const warnings = checks.filter(c => c.status === 'warning')
      
      expect(errors.length).toBeGreaterThan(0)
      
      // 检查特定问题
      expect(checks.some(c => c.id === 'invalid-directive-name')).toBe(true)
      expect(checks.some(c => c.id === 'empty-allow-path')).toBe(true)
      expect(checks.some(c => c.id === 'invalid-path-format')).toBe(true)
      expect(checks.some(c => c.id === 'negative-crawl-delay')).toBe(true)
      expect(checks.some(c => c.id === 'invalid-sitemap-protocol')).toBe(true)
      expect(checks.some(c => c.id === 'host-with-protocol')).toBe(true)
    })
  })
})