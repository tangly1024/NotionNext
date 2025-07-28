/**
 * FormatValidator - robots.txt格式验证器
 * 
 * 负责验证robots.txt文件的基础格式，包括：
 * - 文件编码检测（UTF-8验证）
 * - 行结束符验证和标准化
 * - 语法结构检查
 * - 指令格式正确性验证
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { ValidationCheck } from './robotsValidatorModels.js'
import { DirectiveSyntaxValidator } from './directiveSyntaxValidator.js'

/**
 * 格式验证器类
 */
export class FormatValidator {
  constructor(options = {}) {
    this.options = {
      // 编码选项
      expectedEncoding: options.expectedEncoding || 'utf8',
      allowBOM: options.allowBOM !== false,
      
      // 行结束符选项
      normalizeLineEndings: options.normalizeLineEndings !== false,
      preferredLineEnding: options.preferredLineEnding || '\n',
      
      // 语法选项
      strictSyntax: options.strictSyntax || false,
      allowEmptyLines: options.allowEmptyLines !== false,
      allowComments: options.allowComments !== false,
      
      // 大小限制
      maxFileSize: options.maxFileSize || 500 * 1024, // 500KB
      maxLineLength: options.maxLineLength || 2048,
      
      ...options
    }
    
    // 支持的指令列表
    this.supportedDirectives = [
      'user-agent',
      'disallow',
      'allow',
      'crawl-delay',
      'sitemap',
      'host',
      'request-rate',
      'visit-time'
    ]
    
    // 验证结果
    this.checks = []
    
    // 初始化指令语法验证器
    this.directiveSyntaxValidator = new DirectiveSyntaxValidator(this.options)
  }

  /**
   * 执行格式验证
   * @param {string} content - 文件内容
   * @param {Object} context - 验证上下文
   * @returns {ValidationCheck[]} 验证检查结果
   */
  async validate(content, context = {}) {
    this.checks = []
    
    try {
      // 1. 文件大小检查
      this._validateFileSize(content)
      
      // 2. 编码检查
      this._validateEncoding(content)
      
      // 3. 行结束符检查
      const normalizedContent = this._validateLineEndings(content)
      
      // 4. 基本结构检查
      this._validateBasicStructure(normalizedContent)
      
      // 5. 行格式检查
      this._validateLineFormats(normalizedContent)
      
      // 6. 指令语法检查
      await this._validateDirectiveSyntax(normalizedContent)
      
      // 7. 字符集检查
      this._validateCharacterSet(normalizedContent)
      
      return this.checks
      
    } catch (error) {
      this._addCheck(
        'format-validation-error',
        '格式验证错误',
        'error',
        `格式验证过程中发生错误: ${error.message}`,
        null,
        '请检查文件内容和格式',
        'critical'
      )
      
      return this.checks
    }
  }

  /**
   * 验证文件大小
   * @private
   * @param {string} content - 文件内容
   */
  _validateFileSize(content) {
    const fileSize = Buffer.byteLength(content, 'utf8')
    
    if (fileSize === 0) {
      this._addCheck(
        'empty-file',
        '文件大小检查',
        'error',
        'robots.txt 文件为空',
        null,
        '请添加基本的 robots.txt 指令',
        'critical'
      )
    } else if (fileSize > this.options.maxFileSize) {
      this._addCheck(
        'file-too-large',
        '文件大小检查',
        'warning',
        `文件大小 ${fileSize} 字节超过建议的 ${this.options.maxFileSize} 字节`,
        null,
        '考虑简化 robots.txt 内容以提高加载速度',
        'medium'
      )
    } else {
      this._addCheck(
        'file-size-ok',
        '文件大小检查',
        'pass',
        `文件大小 ${fileSize} 字节，符合要求`,
        null,
        null,
        'low'
      )
    }
  }

  /**
   * 验证文件编码
   * @private
   * @param {string} content - 文件内容
   */
  _validateEncoding(content) {
    try {
      // 检查BOM
      const hasBOM = content.charCodeAt(0) === 0xFEFF
      
      if (hasBOM && !this.options.allowBOM) {
        this._addCheck(
          'bom-detected',
          '编码检查',
          'warning',
          '检测到BOM（字节顺序标记）',
          1,
          '建议移除BOM以确保最佳兼容性',
          'low'
        )
      }
      
      // 检查非ASCII字符
      const hasNonASCII = /[^\x00-\x7F]/.test(content)
      
      if (hasNonASCII) {
        this._addCheck(
          'non-ascii-chars',
          '编码检查',
          'warning',
          '文件包含非ASCII字符',
          null,
          '确保文件以UTF-8编码保存',
          'medium'
        )
      } else {
        this._addCheck(
          'ascii-only',
          '编码检查',
          'pass',
          '文件仅包含ASCII字符，兼容性良好',
          null,
          null,
          'low'
        )
      }
      
    } catch (error) {
      this._addCheck(
        'encoding-check-failed',
        '编码检查',
        'error',
        `编码检查失败: ${error.message}`,
        null,
        '请确保文件以UTF-8编码保存',
        'high'
      )
    }
  }

  /**
   * 验证行结束符
   * @private
   * @param {string} content - 文件内容
   * @returns {string} 标准化后的内容
   */
  _validateLineEndings(content) {
    const crlfCount = (content.match(/\r\n/g) || []).length
    const lfCount = (content.match(/(?<!\r)\n/g) || []).length
    const crCount = (content.match(/\r(?!\n)/g) || []).length
    
    let normalizedContent = content
    let lineEndingType = 'mixed'
    
    if (crlfCount > 0 && lfCount === 0 && crCount === 0) {
      lineEndingType = 'CRLF (Windows)'
    } else if (lfCount > 0 && crlfCount === 0 && crCount === 0) {
      lineEndingType = 'LF (Unix/Linux)'
    } else if (crCount > 0 && crlfCount === 0 && lfCount === 0) {
      lineEndingType = 'CR (Mac Classic)'
    }
    
    if (lineEndingType === 'mixed') {
      this._addCheck(
        'mixed-line-endings',
        '行结束符检查',
        'warning',
        '文件包含混合的行结束符',
        null,
        '统一使用LF (\\n) 行结束符',
        'medium'
      )
    } else if (lineEndingType === 'CR (Mac Classic)') {
      this._addCheck(
        'cr-line-endings',
        '行结束符检查',
        'warning',
        '使用了过时的CR行结束符',
        null,
        '建议使用LF (\\n) 行结束符',
        'medium'
      )
    } else {
      this._addCheck(
        'consistent-line-endings',
        '行结束符检查',
        'pass',
        `使用一致的${lineEndingType}行结束符`,
        null,
        null,
        'low'
      )
    }
    
    // 标准化行结束符
    if (this.options.normalizeLineEndings) {
      normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    }
    
    return normalizedContent
  }

  /**
   * 验证基本结构
   * @private
   * @param {string} content - 文件内容
   */
  _validateBasicStructure(content) {
    const lines = content.split('\n')
    
    // 检查空文件
    if (lines.length === 0 || (lines.length === 1 && lines[0].trim() === '')) {
      this._addCheck(
        'empty-content',
        '基本结构检查',
        'error',
        '文件内容为空',
        null,
        '添加至少一个User-agent指令',
        'critical'
      )
      return
    }
    
    // 检查是否有有效指令
    const hasValidDirective = lines.some(line => {
      const trimmed = line.trim()
      return trimmed && !trimmed.startsWith('#') && trimmed.includes(':')
    })
    
    if (!hasValidDirective) {
      this._addCheck(
        'no-valid-directives',
        '基本结构检查',
        'error',
        '未找到有效的指令',
        null,
        '添加User-agent和相应的Allow/Disallow规则',
        'critical'
      )
    } else {
      this._addCheck(
        'has-valid-directives',
        '基本结构检查',
        'pass',
        '找到有效的指令',
        null,
        null,
        'low'
      )
    }
    
    // 检查过多空行
    let consecutiveEmptyLines = 0
    let maxConsecutiveEmpty = 0
    
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        consecutiveEmptyLines++
        maxConsecutiveEmpty = Math.max(maxConsecutiveEmpty, consecutiveEmptyLines)
      } else {
        consecutiveEmptyLines = 0
      }
    })
    
    if (maxConsecutiveEmpty > 3) {
      this._addCheck(
        'excessive-empty-lines',
        '基本结构检查',
        'warning',
        `发现连续${maxConsecutiveEmpty}个空行`,
        null,
        '减少连续空行以提高可读性',
        'low'
      )
    }
  }

  /**
   * 验证行格式
   * @private
   * @param {string} content - 文件内容
   */
  _validateLineFormats(content) {
    const lines = content.split('\n')
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1
      const trimmed = line.trim()
      
      // 跳过空行和注释
      if (!trimmed || trimmed.startsWith('#')) {
        return
      }
      
      // 检查行长度
      if (line.length > this.options.maxLineLength) {
        this._addCheck(
          'line-too-long',
          '行格式检查',
          'warning',
          `第${lineNumber}行长度${line.length}超过建议的${this.options.maxLineLength}字符`,
          lineNumber,
          '考虑分割长URL或简化指令',
          'low'
        )
      }
      
      // 检查行首/行尾空白
      if (line !== trimmed) {
        this._addCheck(
          'line-whitespace',
          '行格式检查',
          'warning',
          `第${lineNumber}行包含行首或行尾空白字符`,
          lineNumber,
          '移除行首和行尾的空白字符',
          'low'
        )
      }
      
      // 检查制表符
      if (line.includes('\t')) {
        this._addCheck(
          'tab-characters',
          '行格式检查',
          'warning',
          `第${lineNumber}行包含制表符`,
          lineNumber,
          '使用空格替代制表符',
          'low'
        )
      }
      
      // 检查控制字符
      if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(line)) {
        this._addCheck(
          'control-characters',
          '行格式检查',
          'error',
          `第${lineNumber}行包含控制字符`,
          lineNumber,
          '移除控制字符',
          'high'
        )
      }
    })
  }

  /**
   * 验证指令语法
   * @private
   * @param {string} content - 文件内容
   */
  async _validateDirectiveSyntax(content) {
    // 使用专门的指令语法验证器
    const syntaxChecks = await this.directiveSyntaxValidator.validate(content)
    
    // 将指令语法检查结果添加到当前检查列表
    this.checks.push(...syntaxChecks)
  }

  /**
   * 验证字符集
   * @private
   * @param {string} content - 文件内容
   */
  _validateCharacterSet(content) {
    const lines = content.split('\n')
    let hasInvalidChars = false
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1
      
      // 检查不可见字符（除了标准空白字符）
      const invisibleChars = line.match(/[^\x20-\x7E\t\r\n]/g)
      if (invisibleChars) {
        hasInvalidChars = true
        this._addCheck(
          'invisible-characters',
          '字符集检查',
          'warning',
          `第${lineNumber}行包含不可见字符: ${invisibleChars.join(', ')}`,
          lineNumber,
          '移除或替换不可见字符',
          'medium'
        )
      }
    })
    
    if (!hasInvalidChars) {
      this._addCheck(
        'valid-character-set',
        '字符集检查',
        'pass',
        '字符集验证通过',
        null,
        null,
        'low'
      )
    }
  }

  /**
   * 添加验证检查
   * @private
   * @param {string} id - 检查ID
   * @param {string} name - 检查名称
   * @param {string} status - 状态
   * @param {string} message - 消息
   * @param {number|null} line - 行号
   * @param {string|null} suggestion - 建议
   * @param {string} severity - 严重程度
   */
  _addCheck(id, name, status, message, line = null, suggestion = null, severity = 'medium') {
    this.checks.push(new ValidationCheck(id, name, status, message, line, suggestion, severity))
  }

  /**
   * 获取支持的指令列表
   * @returns {string[]} 支持的指令列表
   */
  getSupportedDirectives() {
    return [...this.supportedDirectives]
  }

  /**
   * 检查指令是否受支持
   * @param {string} directive - 指令名称
   * @returns {boolean} 是否受支持
   */
  isDirectiveSupported(directive) {
    return this.supportedDirectives.includes(directive.toLowerCase())
  }
}

export default FormatValidator