/**
 * RobotsValidator - 核心robots.txt验证器
 * 
 * 这是robots.txt验证系统的主入口点，负责协调各个验证器组件
 * 并管理整个验证流程。
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import fs from 'fs'
import path from 'path'
import { ValidationResult, ValidationCategory, ValidationCheck, Recommendation } from './robotsValidatorModels.js'
import { FormatValidator } from './formatValidator.js'
import { ContentValidator } from './contentValidator.js'

/**
 * 主验证器类 - 系统入口点
 */
export class RobotsValidator {
  constructor(options = {}) {
    // 默认配置选项
    this.options = {
      // 基本配置
      filePath: options.filePath || 'public/robots.txt',
      strict: options.strict || false,
      
      // 输出配置
      outputFormat: options.outputFormat || 'console', // console, json, html
      verbose: options.verbose !== false,
      colors: options.colors !== false,
      
      // 验证选项
      checkAccessibility: options.checkAccessibility !== false,
      validateSitemaps: options.validateSitemaps !== false,
      checkSEO: options.checkSEO !== false,
      
      // 网络配置
      timeout: options.timeout || 5000,
      userAgent: options.userAgent || 'RobotsValidator/1.0',
      
      // 规则配置
      allowedUserAgents: options.allowedUserAgents || [],
      blockedUserAgents: options.blockedUserAgents || [],
      requiredSitemaps: options.requiredSitemaps || [],
      
      // 报告配置
      reportPath: options.reportPath || './robots-validation-report',
      includeRecommendations: options.includeRecommendations !== false,
      includeSuggestions: options.includeSuggestions !== false,
      
      // 合并用户提供的其他选项
      ...options
    }
    
    // 初始化验证器组件
    this.formatValidator = new FormatValidator(this.options)
    this.contentValidator = new ContentValidator(this.options)
    this.standardsValidator = null
    this.seoValidator = null
    this.reportGenerator = null
    
    // 验证结果存储
    this.validationResult = null
    this.errors = []
    this.warnings = []
    this.recommendations = []
  }

  /**
   * 主验证方法 - 执行完整的验证流程
   * @returns {Promise<ValidationResult>} 验证结果
   */
  async validate() {
    try {
      console.log(`🤖 开始验证 robots.txt 文件: ${this.options.filePath}`)
      
      // 1. 文件存在性检查
      const fileContent = await this._checkFileExists()
      
      // 2. 初始化验证结果
      this.validationResult = new ValidationResult()
      this.validationResult.metadata.validatedAt = new Date()
      
      // 3. 更新文件大小元数据
      const stats = fs.statSync(path.resolve(this.options.filePath))
      this.validationResult.metadata.fileSize = stats.size
      
      // 4. 执行验证流程（各个验证器将在后续任务中实现）
      await this._executeValidationPipeline(fileContent)
      
      // 4. 计算最终分数和状态
      this._calculateFinalScore()
      
      // 5. 生成报告
      if (this.options.verbose) {
        console.log(`✅ 验证完成，总分: ${this.validationResult.score}/100`)
      }
      
      return this.validationResult
      
    } catch (error) {
      return this._handleValidationError(error)
    }
  }

  /**
   * 生成验证报告
   * @param {ValidationResult} result - 验证结果
   * @returns {string|Object} 格式化的报告
   */
  generateReport(result = null) {
    const validationResult = result || this.validationResult
    
    if (!validationResult) {
      throw new Error('没有可用的验证结果来生成报告')
    }
    
    // 报告生成器将在后续任务中实现
    switch (this.options.outputFormat) {
      case 'json':
        return this._generateJSONReport(validationResult)
      case 'html':
        return this._generateHTMLReport(validationResult)
      case 'console':
      default:
        return this._generateConsoleReport(validationResult)
    }
  }

  /**
   * 检查文件是否存在并读取内容
   * @private
   * @returns {Promise<string>} 文件内容
   */
  async _checkFileExists() {
    try {
      const filePath = path.resolve(this.options.filePath)
      
      if (!fs.existsSync(filePath)) {
        throw new Error(`robots.txt 文件不存在: ${filePath}`)
      }
      
      const stats = fs.statSync(filePath)
      const content = fs.readFileSync(filePath, 'utf8')
      
      // 更新元数据
      if (this.validationResult) {
        this.validationResult.metadata.fileSize = stats.size
      }
      
      if (this.options.verbose) {
        console.log(`📄 文件读取成功，大小: ${stats.size} 字节`)
      }
      
      return content
      
    } catch (error) {
      throw new Error(`无法读取 robots.txt 文件: ${error.message}`)
    }
  }

  /**
   * 执行验证管道
   * @private
   * @param {string} content - 文件内容
   */
  async _executeValidationPipeline(content) {
    // 这个方法将在后续任务中实现各个验证器的调用
    // 目前只是建立框架结构
    
    if (this.options.verbose) {
      console.log('🔍 开始执行验证管道...')
    }
    
    // 初始化验证类别
    this.validationResult.categories = {
      format: new ValidationCategory('格式验证', 'format'),
      content: new ValidationCategory('内容验证', 'content'),
      standards: new ValidationCategory('标准合规', 'standards'),
      seo: new ValidationCategory('SEO优化', 'seo')
    }
    
    // 执行各个验证器
    await this._runFormatValidation(content)
    await this._runContentValidation(content)
    // await this._runStandardsValidation(content)
    // await this._runSEOValidation(content)
  }

  /**
   * 运行格式验证
   * @private
   * @param {string} content - 文件内容
   */
  async _runFormatValidation(content) {
    if (this.options.verbose) {
      console.log('📝 执行格式验证...')
    }
    
    const formatChecks = await this.formatValidator.validate(content, {
      filePath: this.options.filePath
    })
    
    // 将检查结果添加到格式验证类别
    const formatCategory = this.validationResult.categories.format
    formatChecks.forEach(check => {
      formatCategory.addCheck(check)
    })
    
    if (this.options.verbose) {
      const passedCount = formatChecks.filter(c => c.status === 'pass').length
      const warningCount = formatChecks.filter(c => c.status === 'warning').length
      const errorCount = formatChecks.filter(c => c.status === 'error').length
      console.log(`📝 格式验证完成: ${passedCount} 通过, ${warningCount} 警告, ${errorCount} 错误`)
    }
  }

  /**
   * 运行内容验证
   * @private
   * @param {string} content - 文件内容
   */
  async _runContentValidation(content) {
    if (this.options.verbose) {
      console.log('📋 执行内容验证...')
    }
    
    const contentChecks = await this.contentValidator.validate(content, {
      filePath: this.options.filePath
    })
    
    // 将检查结果添加到内容验证类别
    const contentCategory = this.validationResult.categories.content
    contentChecks.forEach(check => {
      contentCategory.addCheck(check)
    })
    
    if (this.options.verbose) {
      const passedCount = contentChecks.filter(c => c.status === 'pass').length
      const warningCount = contentChecks.filter(c => c.status === 'warning').length
      const errorCount = contentChecks.filter(c => c.status === 'error').length
      console.log(`📋 内容验证完成: ${passedCount} 通过, ${warningCount} 警告, ${errorCount} 错误`)
    }
  }



  /**
   * 计算最终分数
   * @private
   */
  _calculateFinalScore() {
    let totalScore = 0
    let totalWeight = 0
    let totalChecks = 0
    let passedChecks = 0
    let warningCount = 0
    let errorCount = 0
    
    // 遍历所有验证类别
    Object.values(this.validationResult.categories).forEach(category => {
      category.checks.forEach(check => {
        totalChecks++
        
        if (check.status === 'pass') {
          passedChecks++
          totalScore += 100
        } else if (check.status === 'warning') {
          warningCount++
          totalScore += 50
        } else if (check.status === 'error') {
          errorCount++
          totalScore += 0
        }
        
        totalWeight++
      })
      
      // 计算类别分数
      if (category.checks.length > 0) {
        const categoryScore = category.checks.reduce((sum, check) => {
          return sum + (check.status === 'pass' ? 100 : check.status === 'warning' ? 50 : 0)
        }, 0) / category.checks.length
        
        category.score = Math.round(categoryScore)
        category.passed = categoryScore >= 70 // 70分以上算通过
      }
    })
    
    // 计算总分
    this.validationResult.score = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0
    this.validationResult.isValid = this.validationResult.score >= 70 && errorCount === 0
    
    // 更新摘要
    this.validationResult.summary = {
      totalChecks,
      passed: passedChecks,
      warnings: warningCount,
      errors: errorCount
    }
  }

  /**
   * 处理验证错误
   * @private
   * @param {Error} error - 错误对象
   * @returns {ValidationResult} 错误结果
   */
  _handleValidationError(error) {
    console.error('❌ 验证过程中发生错误:', error.message)
    
    const errorResult = new ValidationResult()
    errorResult.isValid = false
    errorResult.score = 0
    errorResult.summary = {
      totalChecks: 1,
      passed: 0,
      warnings: 0,
      errors: 1
    }
    
    // 添加错误检查
    const errorCategory = new ValidationCategory('系统错误', 'system')
    errorCategory.addCheck(new ValidationCheck(
      'validation-error',
      '验证系统错误',
      'error',
      error.message,
      null,
      '请检查文件路径和权限',
      'critical'
    ))
    
    errorResult.categories = { system: errorCategory }
    
    return errorResult
  }

  /**
   * 生成控制台报告
   * @private
   * @param {ValidationResult} result - 验证结果
   * @returns {string} 控制台报告
   */
  _generateConsoleReport(result) {
    let report = '\n'
    report += '='.repeat(60) + '\n'
    report += '🤖 ROBOTS.TXT 验证报告\n'
    report += '='.repeat(60) + '\n'
    
    // 总体状态
    const statusIcon = result.isValid ? '✅' : '❌'
    report += `${statusIcon} 验证状态: ${result.isValid ? '通过' : '失败'}\n`
    report += `📊 总分: ${result.score}/100\n`
    report += `📈 统计: ${result.summary.passed} 通过, ${result.summary.warnings} 警告, ${result.summary.errors} 错误\n\n`
    
    // 各类别详情
    Object.values(result.categories).forEach(category => {
      const categoryIcon = category.passed ? '✅' : '❌'
      report += `${categoryIcon} ${category.name} (${category.score}/100)\n`
      
      category.checks.forEach(check => {
        const checkIcon = check.status === 'pass' ? '  ✓' : check.status === 'warning' ? '  ⚠' : '  ✗'
        report += `${checkIcon} ${check.name}: ${check.message}\n`
        
        if (check.suggestion && this.options.includeSuggestions) {
          report += `    💡 建议: ${check.suggestion}\n`
        }
      })
      
      report += '\n'
    })
    
    report += '='.repeat(60) + '\n'
    
    return report
  }

  /**
   * 生成JSON报告
   * @private
   * @param {ValidationResult} result - 验证结果
   * @returns {Object} JSON报告
   */
  _generateJSONReport(result) {
    return {
      timestamp: new Date().toISOString(),
      validator: 'RobotsValidator',
      version: '1.0.0',
      result: result.toJSON()
    }
  }

  /**
   * 生成HTML报告
   * @private
   * @param {ValidationResult} result - 验证结果
   * @returns {string} HTML报告
   */
  _generateHTMLReport(result) {
    // HTML报告生成将在后续任务中完善
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Robots.txt 验证报告</title>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 5px; }
        .status-pass { color: #28a745; }
        .status-warning { color: #ffc107; }
        .status-error { color: #dc3545; }
        .category { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .check { margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 Robots.txt 验证报告</h1>
        <p><strong>状态:</strong> <span class="status-${result.isValid ? 'pass' : 'error'}">${result.isValid ? '通过' : '失败'}</span></p>
        <p><strong>分数:</strong> ${result.score}/100</p>
        <p><strong>验证时间:</strong> ${result.metadata.validatedAt}</p>
    </div>
    
    ${Object.values(result.categories).map(category => `
        <div class="category">
            <h2>${category.name} (${category.score}/100)</h2>
            ${category.checks.map(check => `
                <div class="check status-${check.status}">
                    <strong>${check.name}:</strong> ${check.message}
                    ${check.suggestion ? `<br><em>建议: ${check.suggestion}</em>` : ''}
                </div>
            `).join('')}
        </div>
    `).join('')}
</body>
</html>`
  }
}

export default RobotsValidator