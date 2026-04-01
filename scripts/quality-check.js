#!/usr/bin/env node

/**
 * 代码质量检查脚本
 * 运行各种代码质量检查工具
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command, description) {
  log(`\n🔍 ${description}...`, 'blue')
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    log(`✅ ${description} 通过`, 'green')
    return { success: true, output }
  } catch (error) {
    log(`❌ ${description} 失败`, 'red')
    if (error.stdout) {
      console.log(error.stdout)
    }
    if (error.stderr) {
      console.error(error.stderr)
    }
    return { success: false, error: error.message }
  }
}

function checkFileExists(filePath, description) {
  log(`\n📁 检查 ${description}...`, 'blue')
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} 存在`, 'green')
    return true
  } else {
    log(`❌ ${description} 不存在: ${filePath}`, 'red')
    return false
  }
}

function analyzePackageJson() {
  log('\n📦 分析 package.json...', 'blue')
  const packagePath = path.join(process.cwd(), 'package.json')
  
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json 不存在', 'red')
    return false
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  // 检查必要的脚本
  const requiredScripts = ['build', 'dev', 'start']
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script])
  
  if (missingScripts.length > 0) {
    log(`⚠️  缺少脚本: ${missingScripts.join(', ')}`, 'yellow')
  } else {
    log('✅ 所有必要脚本都存在', 'green')
  }

  // 检查依赖版本
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
  const outdatedDeps = []
  
  // 这里可以添加更复杂的版本检查逻辑
  log(`📊 总依赖数量: ${Object.keys(dependencies).length}`, 'cyan')
  
  return true
}

function checkCodeCoverage() {
  log('\n📈 检查代码覆盖率...', 'blue')
  // 这里可以添加代码覆盖率检查逻辑
  log('ℹ️  代码覆盖率检查跳过（需要配置测试）', 'yellow')
}

function checkSecurity() {
  log('\n🔒 安全检查...', 'blue')
  return runCommand('npm audit --audit-level=moderate', '依赖安全检查')
}

function checkBundleSize() {
  log('\n📦 检查包大小...', 'blue')
  // 这里可以添加包大小分析逻辑
  log('ℹ️  包大小检查跳过（需要构建）', 'yellow')
}

function generateReport(results) {
  log('\n📋 生成质量报告...', 'blue')
  
  const report = {
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }
  }

  const reportPath = path.join(process.cwd(), 'quality-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  log(`📄 质量报告已生成: ${reportPath}`, 'cyan')
  return report
}

async function main() {
  log('🚀 开始代码质量检查', 'magenta')
  
  const results = []
  
  // 检查配置文件
  const configFiles = [
    { path: '.eslintrc.js', name: 'ESLint 配置' },
    { path: '.prettierrc.js', name: 'Prettier 配置' },
    { path: 'tsconfig.json', name: 'TypeScript 配置' },
    { path: 'next.config.js', name: 'Next.js 配置' }
  ]
  
  configFiles.forEach(({ path: filePath, name }) => {
    const exists = checkFileExists(filePath, name)
    results.push({ name, success: exists, type: 'config' })
  })
  
  // 分析 package.json
  const packageAnalysis = analyzePackageJson()
  results.push({ name: 'Package.json 分析', success: packageAnalysis, type: 'analysis' })
  
  // 运行 ESLint
  const eslintResult = runCommand('npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0', 'ESLint 检查')
  results.push({ name: 'ESLint', success: eslintResult.success, type: 'lint', ...eslintResult })
  
  // 运行 TypeScript 检查
  const tscResult = runCommand('npx tsc --noEmit', 'TypeScript 类型检查')
  results.push({ name: 'TypeScript', success: tscResult.success, type: 'type-check', ...tscResult })
  
  // 运行 Prettier 检查
  const prettierResult = runCommand('npx prettier --check .', 'Prettier 格式检查')
  results.push({ name: 'Prettier', success: prettierResult.success, type: 'format', ...prettierResult })
  
  // 安全检查
  const securityResult = checkSecurity()
  results.push({ name: '安全检查', success: securityResult.success, type: 'security', ...securityResult })
  
  // 其他检查
  checkCodeCoverage()
  checkBundleSize()
  
  // 生成报告
  const report = generateReport(results)
  
  // 输出总结
  log('\n📊 质量检查总结:', 'magenta')
  log(`✅ 通过: ${report.summary.passed}`, 'green')
  log(`❌ 失败: ${report.summary.failed}`, 'red')
  log(`📊 总计: ${report.summary.total}`, 'cyan')
  
  // 如果有失败的检查，退出码为 1
  if (report.summary.failed > 0) {
    log('\n⚠️  存在质量问题，请修复后重试', 'yellow')
    process.exit(1)
  } else {
    log('\n🎉 所有质量检查都通过了！', 'green')
    process.exit(0)
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    log(`💥 质量检查过程中发生错误: ${error.message}`, 'red')
    process.exit(1)
  })
}

module.exports = { main, runCommand, checkFileExists }
