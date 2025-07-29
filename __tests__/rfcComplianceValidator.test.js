/**
 * RFCComplianceValidator RFC 9309标准合规验证器测试
 * 
 * 测试RFC 9309标准合规验证器的各项功能，包括：
 * - 文件结构合规性验证
 * - 指令格式合规性验证
 * - 必需指令存在性验证
 * - 指令顺序和分组验证
 * - 字段名称规范验证
 * - 非标准指令使用验证
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { RFCComplianceValidator } from '../lib/seo/rfcComplianceValidator.js'

describe('RFCComplianceValidator RFC 9309标准合规验证器测试', () => {
  let validator

  beforeEach(() => {
    validator = new RFCComplianceValidator()
  })

  describe('文件结构合规性验证', () => {
    test('应该检测空的robots.txt文件', async () => {
      const content = '# 只有注释\n# 没有指令'
      const checks = await validator.validate(content)
      
      const emptyFileCheck = checks.find(c => c.id === 'empty-robots-file')
      expect(emptyFileCheck).toBeDefined()
      expect(emptyFileCheck.status).toBe('error')
      expect(emptyFileCheck.severity).toBe('critical')
    })

    test('应该验证合理的文件大小', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const reasonableSizeCheck = checks.find(c => c.id === 'reasonable-file-size')
      expect(reasonableSizeCheck).toBeDefined()
      expect(reasonableSizeCheck.status).toBe('pass')
    })

    test('应该警告过大的文件', async () => {
      const largeContent = 'User-agent: *\nDisallow: /admin/\n' + 
        Array.from({length: 999}, (_, i) => `# Comment ${i}`).join('\n')
      const checks = await validator.validate(largeContent)
      
      const largeFileCheck = checks.find(c => c.id === 'large-robots-file')
      expect(largeFileCheck).toBeDefined()
      expect(largeFileCheck.status).toBe('warning')
    })

    test('应该检测过多的注释', async () => {
      const content = `# Comment 1
# Comment 2
# Comment 3
# Comment 4
# Comment 5
User-agent: *
Disallow: /admin/`
      const checks = await validator.validate(content)
      
      const excessiveCommentsCheck = checks.find(c => c.id === 'excessive-comments')
      expect(excessiveCommentsCheck).toBeDefined()
      expect(excessiveCommentsCheck.status).toBe('info')
    })
  })

  describe('指令格式合规性验证', () => {
    test('应该验证标准指令格式', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const validFormatChecks = checks.filter(c => c.id === 'valid-directive-format')
      expect(validFormatChecks.length).toBeGreaterThan(0)
      validFormatChecks.forEach(check => {
        expect(check.status).toBe('pass')
      })
    })

    test('应该检测指令大小写问题', async () => {
      const content = 'User-Agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const caseMismatchCheck = checks.find(c => c.id === 'directive-case-mismatch')
      expect(caseMismatchCheck).toBeDefined()
      expect(caseMismatchCheck.status).toBe('info')
    })

    test('应该检测缺少指令值', async () => {
      const content = 'User-agent:\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const missingValueCheck = checks.find(c => c.id === 'missing-directive-value')
      expect(missingValueCheck).toBeDefined()
      expect(missingValueCheck.status).toBe('error')
    })

    test('应该检测未知指令', async () => {
      const content = 'User-agent: *\nUnknownDirective: value'
      const checks = await validator.validate(content)
      
      const unknownDirectiveCheck = checks.find(c => c.id === 'unknown-directive')
      expect(unknownDirectiveCheck).toBeDefined()
      expect(unknownDirectiveCheck.status).toBe('error')
    })

    test('应该检测已弃用指令', async () => {
      const content = 'User-agent: *\nNoindex: true'
      const checks = await validator.validate(content)
      
      const deprecatedCheck = checks.find(c => c.id === 'deprecated-directive')
      expect(deprecatedCheck).toBeDefined()
      expect(deprecatedCheck.status).toBe('warning')
    })

    test('应该识别扩展指令', async () => {
      const validator = new RFCComplianceValidator({ allowExtensions: true })
      const content = 'User-agent: *\nClean-param: param'
      const checks = await validator.validate(content)
      
      const extensionCheck = checks.find(c => c.id === 'extension-directive')
      expect(extensionCheck).toBeDefined()
      expect(extensionCheck.status).toBe('info')
    })

    test('应该检测不可重复指令的重复使用', async () => {
      const content = `User-agent: *
Host: example.com
Host: www.example.com`
      const checks = await validator.validate(content)
      
      const nonRepeatableCheck = checks.find(c => c.id === 'non-repeatable-directive-repeated')
      expect(nonRepeatableCheck).toBeDefined()
      expect(nonRepeatableCheck.status).toBe('error')
    })

    test('应该生成指令合规性摘要', async () => {
      const content = 'User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml'
      const checks = await validator.validate(content)
      
      const summaryCheck = checks.find(c => c.id === 'directive-compliance-summary')
      expect(summaryCheck).toBeDefined()
      expect(summaryCheck.status).toBe('pass')
    })
  })

  describe('必需指令存在性验证', () => {
    test('应该检测缺少User-agent指令', async () => {
      const content = 'Disallow: /admin/'
      const checks = await validator.validate(content)
      
      const missingUserAgentCheck = checks.find(c => c.id === 'missing-user-agent')
      expect(missingUserAgentCheck).toBeDefined()
      expect(missingUserAgentCheck.status).toBe('error')
      expect(missingUserAgentCheck.severity).toBe('critical')
    })

    test('应该警告没有访问规则', async () => {
      const content = 'User-agent: *'
      const checks = await validator.validate(content)
      
      const noRulesCheck = checks.find(c => c.id === 'no-access-rules')
      expect(noRulesCheck).toBeDefined()
      expect(noRulesCheck.status).toBe('warning')
    })

    test('应该验证有效的访问规则', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const hasRulesCheck = checks.find(c => c.id === 'has-access-rules')
      expect(hasRulesCheck).toBeDefined()
      expect(hasRulesCheck.status).toBe('pass')
    })

    test('应该评估结构完整性', async () => {
      const content = `User-agent: *
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml`
      const checks = await validator.validate(content)
      
      const completenessCheck = checks.find(c => c.id === 'structure-completeness-good')
      expect(completenessCheck).toBeDefined()
      expect(completenessCheck.status).toBe('pass')
    })

    test('应该检测结构完整性较差', async () => {
      const content = 'User-agent: *'
      const checks = await validator.validate(content)
      
      const poorCompletenessCheck = checks.find(c => c.id === 'structure-completeness-poor')
      expect(poorCompletenessCheck).toBeDefined()
      expect(poorCompletenessCheck.status).toBe('warning')
    })
  })

  describe('指令顺序和分组验证', () => {
    test('应该跳过指令顺序验证（默认禁用）', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const orderNotEnforcedCheck = checks.find(c => c.id === 'directive-order-not-enforced')
      expect(orderNotEnforcedCheck).toBeDefined()
      expect(orderNotEnforcedCheck.status).toBe('info')
    })

    test('应该验证正确的指令顺序', async () => {
      const validator = new RFCComplianceValidator({ enforceDirectiveOrder: true })
      const content = `User-agent: *
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml`
      const checks = await validator.validate(content)
      
      const orderCorrectCheck = checks.find(c => c.id === 'directive-order-correct')
      expect(orderCorrectCheck).toBeDefined()
      expect(orderCorrectCheck.status).toBe('pass')
    })

    test('应该检测指令顺序问题', async () => {
      const validator = new RFCComplianceValidator({ enforceDirectiveOrder: true })
      const content = `Disallow: /admin/
User-agent: *`
      const checks = await validator.validate(content)
      
      const orderIssueCheck = checks.find(c => c.id === 'directive-order-issue')
      expect(orderIssueCheck).toBeDefined()
      expect(orderIssueCheck.status).toBe('info')
    })

    test('应该检测全局指令在User-agent组之间', async () => {
      const validator = new RFCComplianceValidator({ enforceDirectiveOrder: true })
      const content = `User-agent: *
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml
User-agent: Googlebot
Allow: /`
      const checks = await validator.validate(content)
      
      const orderIssueCheck = checks.find(c => c.id === 'directive-order-issue')
      expect(orderIssueCheck).toBeDefined()
      expect(orderIssueCheck.status).toBe('info')
    })
  })

  describe('字段名称规范验证', () => {
    test('应该验证标准字段名称', async () => {
      const validator = new RFCComplianceValidator({ validateFieldNames: true })
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const standardFieldChecks = checks.filter(c => c.id === 'standard-field-name')
      expect(standardFieldChecks.length).toBeGreaterThan(0)
      standardFieldChecks.forEach(check => {
        expect(check.status).toBe('pass')
      })
    })

    test('应该检测字段名称中的特殊字符', async () => {
      const validator = new RFCComplianceValidator({ validateFieldNames: true })
      const content = 'User@agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const fieldIssueCheck = checks.find(c => c.id === 'field-name-issue')
      expect(fieldIssueCheck).toBeDefined()
      expect(fieldIssueCheck.status).toBe('warning')
    })

    test('应该检测过长的字段名称', async () => {
      const validator = new RFCComplianceValidator({ validateFieldNames: true })
      const content = 'VeryLongFieldNameThatExceedsReasonableLength: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const fieldIssueCheck = checks.find(c => c.id === 'field-name-issue')
      expect(fieldIssueCheck).toBeDefined()
      expect(fieldIssueCheck.status).toBe('warning')
    })

    test('应该确认字段名称合规', async () => {
      const validator = new RFCComplianceValidator({ validateFieldNames: true })
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const compliantCheck = checks.find(c => c.id === 'field-names-compliant')
      expect(compliantCheck).toBeDefined()
      expect(compliantCheck.status).toBe('pass')
    })
  })

  describe('非标准指令使用验证', () => {
    test('应该检测非标准指令', async () => {
      const content = 'User-agent: *\nCustomDirective: value'
      const checks = await validator.validate(content)
      
      const nonStandardCheck = checks.find(c => c.id === 'non-standard-directives-found')
      expect(nonStandardCheck).toBeDefined()
      expect(nonStandardCheck.status).toBe('warning')
    })

    test('应该检测扩展指令', async () => {
      const content = 'User-agent: *\nClean-param: param'
      const checks = await validator.validate(content)
      
      const extensionCheck = checks.find(c => c.id === 'extension-directives-found')
      expect(extensionCheck).toBeDefined()
      expect(extensionCheck.status).toBe('info')
    })

    test('应该检测已弃用指令', async () => {
      const content = 'User-agent: *\nNoindex: true'
      const checks = await validator.validate(content)
      
      const deprecatedCheck = checks.find(c => c.id === 'deprecated-directives-found')
      expect(deprecatedCheck).toBeDefined()
      expect(deprecatedCheck.status).toBe('warning')
    })

    test('应该计算高合规性得分', async () => {
      const content = `User-agent: *
Disallow: /admin/
Allow: /public/
Sitemap: https://example.com/sitemap.xml`
      const checks = await validator.validate(content)
      
      const highComplianceCheck = checks.find(c => c.id === 'high-rfc-compliance')
      expect(highComplianceCheck).toBeDefined()
      expect(highComplianceCheck.status).toBe('pass')
    })

    test('应该计算低合规性得分', async () => {
      const content = `User-agent: *
CustomDirective1: value1
CustomDirective2: value2
Noindex: true`
      const checks = await validator.validate(content)
      
      const lowComplianceCheck = checks.find(c => c.id === 'low-rfc-compliance')
      expect(lowComplianceCheck).toBeDefined()
      expect(lowComplianceCheck.status).toBe('warning')
    })
  })

  describe('配置选项', () => {
    test('应该使用自定义配置', () => {
      const customValidator = new RFCComplianceValidator({
        strictMode: true,
        allowExtensions: false,
        enforceDirectiveOrder: true,
        validateFieldNames: true
      })
      
      expect(customValidator.options.strictMode).toBe(true)
      expect(customValidator.options.allowExtensions).toBe(false)
      expect(customValidator.options.enforceDirectiveOrder).toBe(true)
      expect(customValidator.options.validateFieldNames).toBe(true)
    })
  })

  describe('工具方法', () => {
    test('应该获取标准指令列表', () => {
      const standardDirectives = validator.getStandardDirectives()
      
      expect(standardDirectives).toHaveProperty('user-agent')
      expect(standardDirectives).toHaveProperty('disallow')
      expect(standardDirectives).toHaveProperty('allow')
      expect(standardDirectives).toHaveProperty('sitemap')
      expect(standardDirectives['user-agent'].required).toBe(true)
    })

    test('应该获取已弃用指令列表', () => {
      const deprecatedDirectives = validator.getDeprecatedDirectives()
      
      expect(deprecatedDirectives).toHaveProperty('noindex')
      expect(deprecatedDirectives).toHaveProperty('nofollow')
      expect(deprecatedDirectives['noindex'].replacement).toBe('meta robots tag')
    })

    test('应该获取扩展指令列表', () => {
      const extensionDirectives = validator.getExtensionDirectives()
      
      expect(extensionDirectives).toHaveProperty('clean-param')
      expect(extensionDirectives).toHaveProperty('cache-delay')
      expect(extensionDirectives['clean-param'].source).toBe('Yandex')
    })

    test('应该检查指令是否为标准指令', () => {
      expect(validator.isStandardDirective('user-agent')).toBe(true)
      expect(validator.isStandardDirective('User-Agent')).toBe(true)
      expect(validator.isStandardDirective('custom-directive')).toBe(false)
    })

    test('应该检查指令是否已弃用', () => {
      expect(validator.isDeprecatedDirective('noindex')).toBe(true)
      expect(validator.isDeprecatedDirective('NoIndex')).toBe(true)
      expect(validator.isDeprecatedDirective('user-agent')).toBe(false)
    })

    test('应该检查指令是否为扩展指令', () => {
      expect(validator.isExtensionDirective('clean-param')).toBe(true)
      expect(validator.isExtensionDirective('Clean-Param')).toBe(true)
      expect(validator.isExtensionDirective('user-agent')).toBe(false)
    })
  })

  describe('错误处理', () => {
    test('应该处理验证错误', async () => {
      const validator = new RFCComplianceValidator()
      
      // 重写一个方法来抛出错误
      const originalMethod = validator._parseContent
      validator._parseContent = () => {
        throw new Error('测试错误')
      }
      
      const checks = await validator.validate('test content')
      
      const errorCheck = checks.find(c => c.id === 'rfc-validation-error')
      expect(errorCheck).toBeDefined()
      expect(errorCheck.status).toBe('error')
      expect(errorCheck.severity).toBe('critical')
      
      // 恢复原方法
      validator._parseContent = originalMethod
    })
  })

  describe('复杂场景测试', () => {
    test('应该处理完整的RFC合规robots.txt文件', async () => {
      const content = `# Robots.txt for example.com - RFC 9309 compliant
User-agent: *
Disallow: /admin/
Allow: /public/

User-agent: Googlebot
Disallow: /private/
Crawl-delay: 1

Sitemap: https://example.com/sitemap.xml
Host: example.com`

      const checks = await validator.validate(content)
      
      // 应该有多个通过的检查
      const passedChecks = checks.filter(c => c.status === 'pass')
      expect(passedChecks.length).toBeGreaterThan(0)
      
      // 应该有高合规性得分
      const highComplianceCheck = checks.find(c => c.id === 'high-rfc-compliance')
      expect(highComplianceCheck).toBeDefined()
      
      // 应该有结构完整性检查
      const completenessCheck = checks.find(c => c.id === 'structure-completeness-good')
      expect(completenessCheck).toBeDefined()
    })

    test('应该处理有问题的robots.txt文件', async () => {
      const content = `# 有问题的robots.txt文件
User-Agent: *
Disallow: /admin/
NoIndex: true
CustomDirective: value
UnknownField: test

User-agent: Googlebot
Host: example.com
Disallow: /private/

User-agent: *
Allow: /duplicate/`

      const checks = await validator.validate(content)
      
      // 应该检测到多个问题
      const errors = checks.filter(c => c.status === 'error')
      const warnings = checks.filter(c => c.status === 'warning')
      
      expect(errors.length).toBeGreaterThan(0)
      expect(warnings.length).toBeGreaterThan(0)
      
      // 检查特定问题
      expect(checks.some(c => c.id === 'directive-case-mismatch')).toBe(true)
      expect(checks.some(c => c.id === 'deprecated-directive')).toBe(true)
      expect(checks.some(c => c.id === 'unknown-directive')).toBe(true)
    })

    test('应该处理只有基本指令的简单文件', async () => {
      const content = `User-agent: *
Disallow: /admin/
Allow: /public/`

      const checks = await validator.validate(content)
      
      // 应该通过基本验证
      const hasRulesCheck = checks.find(c => c.id === 'has-access-rules')
      expect(hasRulesCheck).toBeDefined()
      expect(hasRulesCheck.status).toBe('pass')
      
      const complianceCheck = checks.find(c => c.id === 'high-rfc-compliance')
      expect(complianceCheck).toBeDefined()
      expect(complianceCheck.status).toBe('pass')
    })
  })
})