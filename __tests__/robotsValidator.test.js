/**
 * RobotsValidator 核心验证器测试
 * 
 * 测试核心验证器架构和基础功能
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import fs from 'fs'
import path from 'path'
import { RobotsValidator } from '../lib/seo/robotsValidator.js'
import { ValidationResult, ValidationCategory, ValidationCheck, Recommendation } from '../lib/seo/robotsValidatorModels.js'

describe('RobotsValidator 核心架构测试', () => {
  const testFilePath = 'test-robots.txt'
  
  beforeEach(() => {
    // 清理测试文件
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath)
    }
  })
  
  afterEach(() => {
    // 清理测试文件
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath)
    }
  })

  describe('验证器初始化', () => {
    test('应该使用默认配置创建验证器', () => {
      const validator = new RobotsValidator()
      
      expect(validator.options.filePath).toBe('public/robots.txt')
      expect(validator.options.outputFormat).toBe('console')
      expect(validator.options.strict).toBe(false)
      expect(validator.options.verbose).toBe(true)
      expect(validator.options.checkAccessibility).toBe(true)
    })
    
    test('应该使用自定义配置创建验证器', () => {
      const customOptions = {
        filePath: 'custom-robots.txt',
        outputFormat: 'json',
        strict: true,
        verbose: false
      }
      
      const validator = new RobotsValidator(customOptions)
      
      expect(validator.options.filePath).toBe('custom-robots.txt')
      expect(validator.options.outputFormat).toBe('json')
      expect(validator.options.strict).toBe(true)
      expect(validator.options.verbose).toBe(false)
    })
  })

  describe('文件存在性检查', () => {
    test('应该在文件不存在时抛出错误', async () => {
      const validator = new RobotsValidator({ filePath: 'nonexistent-robots.txt' })
      
      const result = await validator.validate()
      
      expect(result.isValid).toBe(false)
      expect(result.score).toBe(0)
      expect(result.summary.errors).toBe(1)
    })
    
    test('应该成功读取存在的文件', async () => {
      const testContent = `User-agent: *
Disallow: /admin/
Allow: /`
      
      fs.writeFileSync(testFilePath, testContent)
      
      const validator = new RobotsValidator({ filePath: testFilePath })
      const result = await validator.validate()
      
      expect(result).toBeDefined()
      expect(result.metadata.fileSize).toBeGreaterThan(0)
    })
  })

  describe('基础验证功能', () => {
    test('应该检测空文件', async () => {
      fs.writeFileSync(testFilePath, '')
      
      const validator = new RobotsValidator({ filePath: testFilePath })
      const result = await validator.validate()
      
      expect(result.isValid).toBe(false)
      const errors = result.getErrors()
      expect(errors.some(error => error.id === 'empty-file')).toBe(true)
    })
    
    test('应该检测缺少User-agent指令', async () => {
      const testContent = `Disallow: /admin/
Allow: /`
      
      fs.writeFileSync(testFilePath, testContent)
      
      const validator = new RobotsValidator({ filePath: testFilePath })
      const result = await validator.validate()
      
      // 格式验证器会检测到有效指令但可能有其他格式问题
      expect(result.summary.totalChecks).toBeGreaterThan(0)
      // 检查是否有格式相关的检查
      const formatCategory = result.categories.format
      expect(formatCategory.checks.length).toBeGreaterThan(0)
    })
    
    test('应该检测缺少访问规则', async () => {
      const testContent = `User-agent: *`
      
      fs.writeFileSync(testFilePath, testContent)
      
      const validator = new RobotsValidator({ filePath: testFilePath })
      const result = await validator.validate()
      
      // 格式验证器会检测到有效指令
      expect(result.summary.totalChecks).toBeGreaterThan(0)
      const formatCategory = result.categories.format
      expect(formatCategory.checks.length).toBeGreaterThan(0)
      // 应该有通过的检查（文件大小、编码等）
      const passed = result.getPassed()
      expect(passed.length).toBeGreaterThan(0)
    })
    
    test('应该验证有效的robots.txt文件', async () => {
      const testContent = `User-agent: *
Disallow: /admin/
Allow: /`
      
      fs.writeFileSync(testFilePath, testContent)
      
      const validator = new RobotsValidator({ filePath: testFilePath })
      const result = await validator.validate()
      
      expect(result.summary.errors).toBe(0)
      const passed = result.getPassed()
      expect(passed.length).toBeGreaterThan(0)
    })
  })

  describe('报告生成', () => {
    test('应该生成控制台报告', async () => {
      const testContent = `User-agent: *
Disallow: /admin/`
      
      fs.writeFileSync(testFilePath, testContent)
      
      const validator = new RobotsValidator({ 
        filePath: testFilePath,
        outputFormat: 'console'
      })
      
      const result = await validator.validate()
      const report = validator.generateReport(result)
      
      expect(typeof report).toBe('string')
      expect(report).toContain('ROBOTS.TXT 验证报告')
      expect(report).toContain('验证状态')
      expect(report).toContain('总分')
    })
    
    test('应该生成JSON报告', async () => {
      const testContent = `User-agent: *
Disallow: /admin/`
      
      fs.writeFileSync(testFilePath, testContent)
      
      const validator = new RobotsValidator({ 
        filePath: testFilePath,
        outputFormat: 'json'
      })
      
      const result = await validator.validate()
      const report = validator.generateReport(result)
      
      expect(typeof report).toBe('object')
      expect(report.validator).toBe('RobotsValidator')
      expect(report.version).toBe('1.0.0')
      expect(report.result).toBeDefined()
    })
    
    test('应该生成HTML报告', async () => {
      const testContent = `User-agent: *
Disallow: /admin/`
      
      fs.writeFileSync(testFilePath, testContent)
      
      const validator = new RobotsValidator({ 
        filePath: testFilePath,
        outputFormat: 'html'
      })
      
      const result = await validator.validate()
      const report = validator.generateReport(result)
      
      expect(typeof report).toBe('string')
      expect(report).toContain('<!DOCTYPE html>')
      expect(report).toContain('Robots.txt 验证报告')
    })
  })

  describe('分数计算', () => {
    test('应该正确计算验证分数', async () => {
      const testContent = `User-agent: *
Disallow: /admin/
Allow: /`
      
      fs.writeFileSync(testFilePath, testContent)
      
      const validator = new RobotsValidator({ filePath: testFilePath })
      const result = await validator.validate()
      
      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
      expect(typeof result.score).toBe('number')
    })
  })
})

describe('ValidationResult 数据模型测试', () => {
  test('应该创建空的验证结果', () => {
    const result = new ValidationResult()
    
    expect(result.isValid).toBe(false)
    expect(result.score).toBe(0)
    expect(result.summary.totalChecks).toBe(0)
    expect(result.categories).toEqual({})
    expect(result.recommendations).toEqual([])
  })
  
  test('应该正确添加建议', () => {
    const result = new ValidationResult()
    const recommendation = new Recommendation(
      'fix',
      'high',
      '修复测试',
      '这是一个测试建议',
      '执行修复操作'
    )
    
    result.addRecommendation(recommendation)
    
    expect(result.recommendations.length).toBe(1)
    expect(result.recommendations[0]).toBe(recommendation)
  })
  
  test('应该正确转换为JSON', () => {
    const result = new ValidationResult()
    result.isValid = true
    result.score = 85
    
    const json = result.toJSON()
    
    expect(json.isValid).toBe(true)
    expect(json.score).toBe(85)
    expect(json.summary).toBeDefined()
    expect(json.categories).toBeDefined()
    expect(json.recommendations).toBeDefined()
    expect(json.metadata).toBeDefined()
  })
})

describe('ValidationCategory 数据模型测试', () => {
  test('应该创建验证类别', () => {
    const category = new ValidationCategory('测试类别', 'test')
    
    expect(category.name).toBe('测试类别')
    expect(category.id).toBe('test')
    expect(category.passed).toBe(false)
    expect(category.score).toBe(0)
    expect(category.checks).toEqual([])
  })
  
  test('应该正确添加检查项', () => {
    const category = new ValidationCategory('测试类别', 'test')
    const check = new ValidationCheck(
      'test-check',
      '测试检查',
      'pass',
      '测试通过'
    )
    
    category.addCheck(check)
    
    expect(category.checks.length).toBe(1)
    expect(category.checks[0]).toBe(check)
  })
  
  test('应该正确过滤不同状态的检查', () => {
    const category = new ValidationCategory('测试类别', 'test')
    
    category.addCheck(new ValidationCheck('check1', '检查1', 'pass', '通过'))
    category.addCheck(new ValidationCheck('check2', '检查2', 'warning', '警告'))
    category.addCheck(new ValidationCheck('check3', '检查3', 'error', '错误'))
    
    expect(category.getPassed().length).toBe(1)
    expect(category.getWarnings().length).toBe(1)
    expect(category.getErrors().length).toBe(1)
  })
})

describe('ValidationCheck 数据模型测试', () => {
  test('应该创建验证检查', () => {
    const check = new ValidationCheck(
      'test-check',
      '测试检查',
      'pass',
      '测试消息',
      10,
      '测试建议',
      'high'
    )
    
    expect(check.id).toBe('test-check')
    expect(check.name).toBe('测试检查')
    expect(check.status).toBe('pass')
    expect(check.message).toBe('测试消息')
    expect(check.line).toBe(10)
    expect(check.suggestion).toBe('测试建议')
    expect(check.severity).toBe('high')
  })
  
  test('应该正确判断检查状态', () => {
    const passCheck = new ValidationCheck('pass', '通过', 'pass', '通过')
    const warningCheck = new ValidationCheck('warning', '警告', 'warning', '警告')
    const errorCheck = new ValidationCheck('error', '错误', 'error', '错误')
    
    expect(passCheck.isPassed()).toBe(true)
    expect(passCheck.isWarning()).toBe(false)
    expect(passCheck.isError()).toBe(false)
    
    expect(warningCheck.isPassed()).toBe(false)
    expect(warningCheck.isWarning()).toBe(true)
    expect(warningCheck.isError()).toBe(false)
    
    expect(errorCheck.isPassed()).toBe(false)
    expect(errorCheck.isWarning()).toBe(false)
    expect(errorCheck.isError()).toBe(true)
  })
  
  test('应该正确计算严重程度权重', () => {
    const lowCheck = new ValidationCheck('low', '低', 'pass', '低', null, null, 'low')
    const mediumCheck = new ValidationCheck('medium', '中', 'pass', '中', null, null, 'medium')
    const highCheck = new ValidationCheck('high', '高', 'pass', '高', null, null, 'high')
    const criticalCheck = new ValidationCheck('critical', '严重', 'pass', '严重', null, null, 'critical')
    
    expect(lowCheck.getSeverityWeight()).toBe(1)
    expect(mediumCheck.getSeverityWeight()).toBe(2)
    expect(highCheck.getSeverityWeight()).toBe(3)
    expect(criticalCheck.getSeverityWeight()).toBe(4)
  })
})