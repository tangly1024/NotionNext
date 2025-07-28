#!/usr/bin/env node

/**
 * Robots.txt 验证器 CLI 工具
 * 
 * 用于测试和验证 robots.txt 文件的命令行工具
 * 
 * 使用方法:
 * node scripts/validate-robots.js
 * node scripts/validate-robots.js --file custom-robots.txt
 * node scripts/validate-robots.js --format json
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { RobotsValidator } from '../lib/seo/robotsValidator.js'
import fs from 'fs'
import path from 'path'

/**
 * 解析命令行参数
 */
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    filePath: 'public/robots.txt',
    outputFormat: 'console',
    strict: false,
    verbose: true
  }
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    switch (arg) {
      case '--file':
      case '-f':
        if (i + 1 < args.length) {
          options.filePath = args[++i]
        }
        break
        
      case '--format':
        if (i + 1 < args.length) {
          const format = args[++i]
          if (['console', 'json', 'html'].includes(format)) {
            options.outputFormat = format
          }
        }
        break
        
      case '--strict':
        options.strict = true
        break
        
      case '--quiet':
      case '-q':
        options.verbose = false
        break
        
      case '--help':
      case '-h':
        showHelp()
        process.exit(0)
        break
        
      default:
        if (arg.startsWith('--')) {
          console.warn(`⚠️  未知选项: ${arg}`)
        }
        break
    }
  }
  
  return options
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
🤖 Robots.txt 验证器

用法:
  node scripts/validate-robots.js [选项]

选项:
  -f, --file <path>     指定 robots.txt 文件路径 (默认: public/robots.txt)
  --format <format>     输出格式: console, json, html (默认: console)
  --strict              启用严格模式
  -q, --quiet           静默模式，减少输出
  -h, --help            显示帮助信息

示例:
  node scripts/validate-robots.js
  node scripts/validate-robots.js --file custom-robots.txt
  node scripts/validate-robots.js --format json --quiet
  node scripts/validate-robots.js --strict
`)
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🤖 Robots.txt 验证器启动...\n')
    
    // 解析命令行参数
    const options = parseArgs()
    
    if (options.verbose) {
      console.log(`📁 文件路径: ${options.filePath}`)
      console.log(`📄 输出格式: ${options.outputFormat}`)
      console.log(`⚙️  严格模式: ${options.strict ? '启用' : '禁用'}`)
      console.log('')
    }
    
    // 创建验证器实例
    const validator = new RobotsValidator(options)
    
    // 执行验证
    const result = await validator.validate()
    
    // 生成并输出报告
    const report = validator.generateReport(result)
    
    if (options.outputFormat === 'json') {
      console.log(JSON.stringify(report, null, 2))
    } else if (options.outputFormat === 'html') {
      // 保存HTML报告到文件
      const reportPath = `${options.reportPath || './robots-validation-report'}.html`
      fs.writeFileSync(reportPath, report)
      console.log(`📄 HTML报告已保存到: ${reportPath}`)
    } else {
      console.log(report)
    }
    
    // 设置退出代码
    const exitCode = result.isValid ? 0 : 1
    
    if (options.verbose) {
      console.log(`🏁 验证完成，退出代码: ${exitCode}`)
    }
    
    process.exit(exitCode)
    
  } catch (error) {
    console.error('❌ 验证器运行失败:', error.message)
    
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack)
    }
    
    process.exit(1)
  }
}

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main, parseArgs, showHelp }