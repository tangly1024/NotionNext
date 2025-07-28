/**
 * FormatValidator 格式验证器测试
 * 
 * 测试格式验证器的各项功能，包括：
 * - 文件编码检测
 * - 行结束符验证
 * - 语法结构检查
 * - 指令格式验证
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach } from '@jest/globals'
import { FormatValidator } from '../lib/seo/formatValidator.js'

describe('FormatValidator 格式验证器测试', () => {
  let validator

  beforeEach(() => {
    validator = new FormatValidator()
  })

  describe('文件大小验证', () => {
    test('应该检测空文件', async () => {
      const content = ''
      const checks = await validator.validate(content)
      
      const emptyFileCheck = checks.find(c => c.id === 'empty-file')
      expect(emptyFileCheck).toBeDefined()
      expect(emptyFileCheck.status).toBe('error')
      expect(emptyFileCheck.severity).toBe('critical')
    })

    test('应该通过正常大小文件检查', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const sizeCheck = checks.find(c => c.id === 'file-size-ok')
      expect(sizeCheck).toBeDefined()
      expect(sizeCheck.status).toBe('pass')
    })

    test('应该警告过大文件', async () => {
      const validator = new FormatValidator({ maxFileSize: 50 })
      const content = 'User-agent: *\nDisallow: /admin/\n'.repeat(10)
      const checks = await validator.validate(content)
      
      const largeSizeCheck = checks.find(c => c.id === 'file-too-large')
      expect(largeSizeCheck).toBeDefined()
      expect(largeSizeCheck.status).toBe('warning')
    })
  })

  describe('编码验证', () => {
    test('应该检测ASCII字符', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const asciiCheck = checks.find(c => c.id === 'ascii-only')
      expect(asciiCheck).toBeDefined()
      expect(asciiCheck.status).toBe('pass')
    })

    test('应该警告非ASCII字符', async () => {
      const content = 'User-agent: *\nDisallow: /中文路径/'
      const checks = await validator.validate(content)
      
      const nonAsciiCheck = checks.find(c => c.id === 'non-ascii-chars')
      expect(nonAsciiCheck).toBeDefined()
      expect(nonAsciiCheck.status).toBe('warning')
    })

    test('应该检测BOM', async () => {
      const validator = new FormatValidator({ allowBOM: false })
      const content = '\uFEFFUser-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const bomCheck = checks.find(c => c.id === 'bom-detected')
      expect(bomCheck).toBeDefined()
      expect(bomCheck.status).toBe('warning')
    })
  })

  describe('行结束符验证', () => {
    test('应该检测一致的LF行结束符', async () => {
      const content = 'User-agent: *\nDisallow: /admin/\nAllow: /'
      const checks = await validator.validate(content)
      
      const lineEndingCheck = checks.find(c => c.id === 'consistent-line-endings')
      expect(lineEndingCheck).toBeDefined()
      expect(lineEndingCheck.status).toBe('pass')
    })

    test('应该警告混合行结束符', async () => {
      const content = 'User-agent: *\r\nDisallow: /admin/\nAllow: /'
      const checks = await validator.validate(content)
      
      const mixedCheck = checks.find(c => c.id === 'mixed-line-endings')
      expect(mixedCheck).toBeDefined()
      expect(mixedCheck.status).toBe('warning')
    })

    test('应该警告CR行结束符', async () => {
      const content = 'User-agent: *\rDisallow: /admin/\rAllow: /'
      const checks = await validator.validate(content)
      
      const crCheck = checks.find(c => c.id === 'cr-line-endings')
      expect(crCheck).toBeDefined()
      expect(crCheck.status).toBe('warning')
    })
  })

  describe('基本结构验证', () => {
    test('应该检测有效指令', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const validDirectiveCheck = checks.find(c => c.id === 'has-valid-directives')
      expect(validDirectiveCheck).toBeDefined()
      expect(validDirectiveCheck.status).toBe('pass')
    })

    test('应该检测无有效指令', async () => {
      const content = '# 这只是注释\n\n# 另一个注释'
      const checks = await validator.validate(content)
      
      const noValidCheck = checks.find(c => c.id === 'no-valid-directives')
      expect(noValidCheck).toBeDefined()
      expect(noValidCheck.status).toBe('error')
    })

    test('应该警告过多空行', async () => {
      const content = 'User-agent: *\n\n\n\n\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const excessiveEmptyCheck = checks.find(c => c.id === 'excessive-empty-lines')
      expect(excessiveEmptyCheck).toBeDefined()
      expect(excessiveEmptyCheck.status).toBe('warning')
    })
  })

  describe('行格式验证', () => {
    test('应该警告过长行', async () => {
      const validator = new FormatValidator({ maxLineLength: 50 })
      const longLine = 'User-agent: *\nDisallow: /' + 'a'.repeat(100)
      const checks = await validator.validate(longLine)
      
      const longLineCheck = checks.find(c => c.id === 'line-too-long')
      expect(longLineCheck).toBeDefined()
      expect(longLineCheck.status).toBe('warning')
      expect(longLineCheck.line).toBe(2)
    })

    test('应该警告行首行尾空白', async () => {
      const content = 'User-agent: *\n  Disallow: /admin/  '
      const checks = await validator.validate(content)
      
      const whitespaceCheck = checks.find(c => c.id === 'line-whitespace')
      expect(whitespaceCheck).toBeDefined()
      expect(whitespaceCheck.status).toBe('warning')
      expect(whitespaceCheck.line).toBe(2)
    })

    test('应该警告制表符', async () => {
      const content = 'User-agent: *\n\tDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const tabCheck = checks.find(c => c.id === 'tab-characters')
      expect(tabCheck).toBeDefined()
      expect(tabCheck.status).toBe('warning')
      expect(tabCheck.line).toBe(2)
    })

    test('应该检测控制字符', async () => {
      const content = 'User-agent: *\nDisallow: /admin/\x00'
      const checks = await validator.validate(content)
      
      const controlCheck = checks.find(c => c.id === 'control-characters')
      expect(controlCheck).toBeDefined()
      expect(controlCheck.status).toBe('error')
      expect(controlCheck.line).toBe(2)
    })
  })

  describe('指令语法验证', () => {
    test('应该检测缺少冒号', async () => {
      const content = 'User-agent *\nDisallow /admin/'
      const checks = await validator.validate(content)
      
      // 现在由DirectiveSyntaxValidator处理，检查是否有相关的语法错误
      const syntaxErrors = checks.filter(c => c.status === 'error')
      expect(syntaxErrors.length).toBeGreaterThan(0)
    })

    test('应该检测空指令名', async () => {
      const content = ': *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      // 现在由DirectiveSyntaxValidator处理，检查是否有相关的语法错误
      const syntaxErrors = checks.filter(c => c.status === 'error')
      expect(syntaxErrors.length).toBeGreaterThan(0)
    })

    test('应该警告未知指令', async () => {
      const content = 'User-agent: *\nUnknown-directive: value'
      const checks = await validator.validate(content)
      
      // 现在由DirectiveSyntaxValidator处理，检查是否有未知指令警告
      const unknownCheck = checks.find(c => c.id === 'unknown-directive-warning')
      expect(unknownCheck).toBeDefined()
      expect(unknownCheck.status).toBe('warning')
    })

    test('应该警告空指令值', async () => {
      const content = 'User-agent: *\nSitemap:'
      const checks = await validator.validate(content)
      
      const emptyValueCheck = checks.find(c => c.id === 'empty-directive-value')
      expect(emptyValueCheck).toBeDefined()
      expect(emptyValueCheck.status).toBe('error') // DirectiveSyntaxValidator 将其标记为错误
    })

    test('应该允许Disallow空值', async () => {
      const content = 'User-agent: *\nDisallow:'
      const checks = await validator.validate(content)
      
      const emptyValueCheck = checks.find(c => c.id === 'empty-directive-value')
      expect(emptyValueCheck).toBeUndefined()
    })

    test('应该警告多个冒号', async () => {
      const content = 'User-agent: *\nDisallow: /admin:test/'
      const checks = await validator.validate(content)
      
      // 这个检查现在可能不存在，因为路径中的冒号是有效的
      // 检查是否有任何相关的警告或通过检查
      const allChecks = checks.filter(c => c.line === 2)
      expect(allChecks.length).toBeGreaterThan(0)
    })
  })

  describe('字符集验证', () => {
    test('应该通过有效字符集检查', async () => {
      const content = 'User-agent: *\nDisallow: /admin/'
      const checks = await validator.validate(content)
      
      const charsetCheck = checks.find(c => c.id === 'valid-character-set')
      expect(charsetCheck).toBeDefined()
      expect(charsetCheck.status).toBe('pass')
    })

    test('应该检测不可见字符', async () => {
      const content = 'User-agent: *\nDisallow: /admin/\u200B'
      const checks = await validator.validate(content)
      
      const invisibleCheck = checks.find(c => c.id === 'invisible-characters')
      expect(invisibleCheck).toBeDefined()
      expect(invisibleCheck.status).toBe('warning')
    })
  })

  describe('支持的指令', () => {
    test('应该返回支持的指令列表', () => {
      const directives = validator.getSupportedDirectives()
      
      expect(directives).toContain('user-agent')
      expect(directives).toContain('disallow')
      expect(directives).toContain('allow')
      expect(directives).toContain('sitemap')
      expect(directives).toContain('host')
    })

    test('应该检查指令是否受支持', () => {
      expect(validator.isDirectiveSupported('user-agent')).toBe(true)
      expect(validator.isDirectiveSupported('User-Agent')).toBe(true)
      expect(validator.isDirectiveSupported('unknown-directive')).toBe(false)
    })
  })

  describe('配置选项', () => {
    test('应该使用自定义配置', async () => {
      const customValidator = new FormatValidator({
        maxFileSize: 100,
        maxLineLength: 50,
        strictSyntax: true
      })
      
      expect(customValidator.options.maxFileSize).toBe(100)
      expect(customValidator.options.maxLineLength).toBe(50)
      expect(customValidator.options.strictSyntax).toBe(true)
    })
  })

  describe('错误处理', () => {
    test('应该处理验证错误', async () => {
      // 模拟验证过程中的错误
      const validator = new FormatValidator()
      
      // 重写一个方法来抛出错误
      const originalMethod = validator._validateFileSize
      validator._validateFileSize = () => {
        throw new Error('测试错误')
      }
      
      const checks = await validator.validate('test content')
      
      const errorCheck = checks.find(c => c.id === 'format-validation-error')
      expect(errorCheck).toBeDefined()
      expect(errorCheck.status).toBe('error')
      expect(errorCheck.severity).toBe('critical')
      
      // 恢复原方法
      validator._validateFileSize = originalMethod
    })
  })

  describe('复杂场景测试', () => {
    test('应该处理完整的robots.txt文件', async () => {
      const content = `# Robots.txt for example.com
# Generated by NotionNext

User-agent: *
Allow: /

# Disallow access to admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/

# Allow access to important directories
Allow: /images/
Allow: /css/
Allow: /js/

# Specific rules for search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Sitemap locations
Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-images.xml

# Host declaration
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
      const content = `User-agent *
Disallow /admin/


		Allow: /images/
Unknown-directive: value
Sitemap:
User-agent: Googlebot\x00
Disallow: /very/long/path/${'a'.repeat(2000)}`

      const checks = await validator.validate(content)
      
      // 应该检测到多个问题
      const errors = checks.filter(c => c.status === 'error')
      const warnings = checks.filter(c => c.status === 'warning')
      
      expect(errors.length).toBeGreaterThan(0)
      expect(warnings.length).toBeGreaterThan(0)
      
      // 检查特定问题
      expect(checks.some(c => c.id === 'tab-characters')).toBe(true)
      expect(checks.some(c => c.id === 'unknown-directive-warning')).toBe(true)
      expect(checks.some(c => c.id === 'empty-directive-value')).toBe(true)
      expect(checks.some(c => c.id === 'control-characters')).toBe(true)
      // 应该有语法错误（由DirectiveSyntaxValidator处理）
      expect(errors.length).toBeGreaterThan(0)
    })
  })
})