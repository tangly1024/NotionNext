#!/usr/bin/env node
/**
 * Robots.txt 验证器 CLI 工具
 * 
 * 提供命令行界面来验证 robots.txt 文件
 * 支持多种输出格式和配置选项
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { program } from 'commander'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { RobotsValidator } from '../lib/seo/robotsValidator.js'

// 设置命令行选项
program
  .version('1.0.0')
  .description('Robots.txt 验证工具 - 确保您的 robots.txt 文件符合标准')
  .option('-f, --file <path>', 'robots.txt 文件路径', 'public/robots.txt')
  .option('-o, --output <format>', '输出格式 (console|json|html)', 'console')
  .option('-v, --verbose', '显示详细信息', false)
  .option('-s, --strict', '启用严格模式', false)
  .option('--no-colors', '禁用颜色输出')
  .option('--timeout <ms>', '网络请求超时时间（毫秒）', '5000')
  .option('--save-report <path>', '保存报告到指定文件')
  .option('--config <path>', '使用配置文件')
  .option('--check-accessibility', '检查 sitemap 可访问性', true)
  .option('--no-check-accessibility', '跳过 sitemap 可访问性检查')
  .option('--ai-protection', '启用 AI 机器人保护检查', true)
  .option('--no-ai-protection', '禁用 AI 机器人保护检查')

program.parse()

const options = program.opts()

/**
 * 加载配置文件
 * @param {string} configPath - 配置文件路径
 * @returns {Object} 配置对象
 */
async function loadConfig(configPath) {
  try {
    if (!fs.existsSync(configPath)) {
      console.error(chalk.red(`❌ 配置文件不存在: ${configPath}`))
      process.exit(1)
    }
    
    const config = await import(path.resolve(configPath))
    return config.default || config
  } catch (error) {
    console.error(chalk.red(`❌ 加载配置文件失败: ${error.message}`))
    process.exit(1)
  }
}

/**
 * 格式化控制台输出
 * @param {Object} result - 验证结果
 * @param {boolean} verbose - 是否显示详细信息
 */
function formatConsoleOutput(result, verbose = false) {
  const { isValid, score, summary, categories } = result
  
  // 标题
  console.log('\n' + chalk.bold.blue('🤖 Robots.txt 验证报告'))
  console.log('=' .repeat(50))
  
  // 总体结果
  const statusIcon = isValid ? '✅' : '❌'
  const statusColor = isValid ? 'green' : 'red'
  console.log(`\n${statusIcon} 验证状态: ${chalk[statusColor](isValid ? '通过' : '失败')}`)
  console.log(`📊 总分: ${chalk.bold(score)}/100`)
  
  // 统计信息
  console.log(`\n📈 统计信息:`)
  console.log(`  - 总检查项: ${summary.totalChecks}`)
  console.log(`  - 通过: ${chalk.green(summary.passed)}`)
  console.log(`  - 警告: ${chalk.yellow(summary.warnings)}`)
  console.log(`  - 错误: ${chalk.red(summary.errors)}`)
  
  // 分类结果
  console.log(`\n📋 分类结果:`)
  Object.entries(categories).forEach(([category, data]) => {
    const icon = data.passed ? '✅' : '❌'
    const color = data.passed ? 'green' : 'red'
    console.log(`  ${icon} ${category}: ${chalk[color](data.score)}/100`)
  })
  
  if (verbose) {
    // 详细检查结果
    console.log(`\n🔍 详细检查结果:`)
    Object.entries(categories).forEach(([categoryName, categoryData]) => {
      console.log(`\n${chalk.bold.cyan(categoryName.toUpperCase())}:`)
      
      categoryData.checks.forEach(check => {
        let icon, color
        switch (check.status) {
          case 'pass':
            icon = '✅'
            color = 'green'
            break
          case 'warning':
            icon = '⚠️'
            color = 'yellow'
            break
          case 'error':
            icon = '❌'
            color = 'red'
            break
          default:
            icon = 'ℹ️'
            color = 'blue'
        }
        
        console.log(`  ${icon} ${chalk[color](check.message)}`)
        if (check.line) {
          console.log(`     行号: ${check.line}`)
        }
        if (check.suggestion && verbose) {
          console.log(`     建议: ${chalk.gray(check.suggestion)}`)
        }
      })
    })
  }
  
  // 建议
  if (!isValid) {
    console.log(`\n💡 ${chalk.bold.yellow('改进建议:')}`)
    console.log('  - 修复所有错误项')
    console.log('  - 考虑处理警告项以提高质量')
    console.log('  - 使用 --verbose 选项查看详细建议')
  }
  
  console.log('\n' + '='.repeat(50))
}

/**
 * 保存报告到文件
 * @param {Object} report - 报告内容
 * @param {string} filePath - 文件路径
 * @param {string} format - 文件格式
 */
function saveReport(report, filePath, format) {
  try {
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    let content
    switch (format) {
      case 'json':
        content = JSON.stringify(report, null, 2)
        break
      case 'html':
        content = report // HTML 格式已经是字符串
        break
      default:
        content = JSON.stringify(report, null, 2)
    }
    
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(chalk.green(`📄 报告已保存到: ${filePath}`))
  } catch (error) {
    console.error(chalk.red(`❌ 保存报告失败: ${error.message}`))
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log(chalk.blue('🚀 启动 Robots.txt 验证器...'))
    
    // 加载配置
    let config = {}
    if (options.config) {
      config = await loadConfig(options.config)
    }
    
    // 合并配置选项
    const validatorOptions = {
      filePath: options.file,
      outputFormat: options.output,
      verbose: options.verbose,
      strict: options.strict,
      colors: options.colors,
      timeout: parseInt(options.timeout),
      checkAccessibility: options.checkAccessibility,
      aiProtection: options.aiProtection,
      ...config
    }
    
    console.log(`📁 验证文件: ${chalk.cyan(validatorOptions.filePath)}`)
    
    // 检查文件是否存在
    if (!fs.existsSync(validatorOptions.filePath)) {
      console.error(chalk.red(`❌ 文件不存在: ${validatorOptions.filePath}`))
      process.exit(1)
    }
    
    // 创建验证器实例
    const validator = new RobotsValidator(validatorOptions)
    
    // 执行验证
    console.log(chalk.blue('🔍 正在验证...'))
    const result = await validator.validate()
    
    // 生成报告
    const report = validator.generateReport()
    
    // 输出结果
    if (options.output === 'console') {
      formatConsoleOutput(result, options.verbose)
    } else {
      console.log(JSON.stringify(report, null, 2))
    }
    
    // 保存报告
    if (options.saveReport) {
      saveReport(report, options.saveReport, options.output)
    }
    
    // 设置退出代码
    const exitCode = result.isValid ? 0 : 1
    
    if (exitCode === 0) {
      console.log(chalk.green('\n🎉 验证完成，所有检查通过！'))
    } else {
      console.log(chalk.red('\n⚠️  验证完成，发现问题需要修复'))
    }
    
    process.exit(exitCode)
    
  } catch (error) {
    console.error(chalk.red(`❌ 验证过程中发生错误: ${error.message}`))
    
    if (options.verbose) {
      console.error(chalk.gray(error.stack))
    }
    
    process.exit(1)
  }
}

// 处理未捕获的异常
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ 未处理的 Promise 拒绝:'), reason)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ 未捕获的异常:'), error.message)
  process.exit(1)
})

// 运行主函数
main()