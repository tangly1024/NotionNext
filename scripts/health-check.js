#!/usr/bin/env node

/**
 * 项目健康检查脚本
 * 验证所有优化是否正常工作
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

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

function runCommand(command, description, silent = false) {
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: silent ? 'pipe' : 'inherit',
      timeout: 30000
    })
    return { success: true, output }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * 检查文件是否存在
 */
function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath)
  if (exists) {
    log(`✅ ${description}`, 'green')
  } else {
    log(`❌ ${description} - 文件不存在: ${filePath}`, 'red')
  }
  return exists
}

/**
 * 检查配置文件
 */
function checkConfigFiles() {
  log('\n📋 检查配置文件...', 'blue')
  
  const configFiles = [
    { path: 'package.json', name: 'Package.json' },
    { path: 'next.config.js', name: 'Next.js 配置' },
    { path: 'tailwind.config.js', name: 'Tailwind 配置' },
    { path: 'tsconfig.json', name: 'TypeScript 配置' },
    { path: '.eslintrc.js', name: 'ESLint 配置' },
    { path: '.prettierrc.js', name: 'Prettier 配置' },
    { path: 'jest.config.js', name: 'Jest 配置' },
    { path: '.npmrc', name: 'NPM 配置' }
  ]
  
  let passed = 0
  configFiles.forEach(({ path: filePath, name }) => {
    if (checkFileExists(filePath, name)) {
      passed++
    }
  })
  
  return { passed, total: configFiles.length }
}

/**
 * 检查VSCode配置
 */
function checkVSCodeConfig() {
  log('\n🔧 检查VSCode配置...', 'blue')
  
  const vscodeFiles = [
    { path: '.vscode/settings.json', name: 'VSCode 设置' },
    { path: '.vscode/extensions.json', name: 'VSCode 扩展推荐' },
    { path: '.vscode/launch.json', name: 'VSCode 调试配置' },
    { path: '.vscode/tasks.json', name: 'VSCode 任务配置' }
  ]
  
  let passed = 0
  vscodeFiles.forEach(({ path: filePath, name }) => {
    if (checkFileExists(filePath, name)) {
      passed++
    }
  })
  
  return { passed, total: vscodeFiles.length }
}

/**
 * 检查脚本文件
 */
function checkScripts() {
  log('\n📜 检查脚本文件...', 'blue')
  
  const scriptFiles = [
    { path: 'scripts/quality-check.js', name: '代码质量检查脚本' },
    { path: 'scripts/dev-tools.js', name: '开发工具脚本' },
    { path: 'scripts/setup-git-hooks.js', name: 'Git Hooks 设置脚本' },
    { path: 'scripts/health-check.js', name: '健康检查脚本' }
  ]
  
  let passed = 0
  scriptFiles.forEach(({ path: filePath, name }) => {
    if (checkFileExists(filePath, name)) {
      passed++
    }
  })
  
  return { passed, total: scriptFiles.length }
}

/**
 * 检查文档文件
 */
function checkDocumentation() {
  log('\n📚 检查文档文件...', 'blue')
  
  const docFiles = [
    { path: 'README.md', name: '项目说明文档' },
    { path: 'DEVELOPMENT.md', name: '开发者指南' },
    { path: 'DEPLOYMENT.md', name: '部署指南' },
    { path: 'OPTIMIZATION_SUMMARY.md', name: '优化总结' }
  ]
  
  let passed = 0
  docFiles.forEach(({ path: filePath, name }) => {
    if (checkFileExists(filePath, name)) {
      passed++
    }
  })
  
  return { passed, total: docFiles.length }
}

/**
 * 检查测试文件
 */
function checkTests() {
  log('\n🧪 检查测试文件...', 'blue')
  
  const testFiles = [
    { path: '__tests__/components/LazyImage.test.js', name: 'LazyImage 组件测试' },
    { path: '__tests__/lib/utils/validation.test.js', name: '验证工具测试' },
    { path: 'jest.setup.js', name: 'Jest 设置文件' },
    { path: 'jest.env.js', name: 'Jest 环境配置' }
  ]
  
  let passed = 0
  testFiles.forEach(({ path: filePath, name }) => {
    if (checkFileExists(filePath, name)) {
      passed++
    }
  })
  
  return { passed, total: testFiles.length }
}

/**
 * 检查依赖安装
 */
function checkDependencies() {
  log('\n📦 检查依赖安装...', 'blue')
  
  if (!fs.existsSync('node_modules')) {
    log('❌ node_modules 目录不存在，请运行 npm install', 'red')
    return { passed: 0, total: 1 }
  }
  
  log('✅ node_modules 目录存在', 'green')
  
  // 检查关键依赖
  const keyDeps = ['next', 'react', 'tailwindcss', '@testing-library/react', 'jest']
  let passed = 1 // node_modules 存在
  
  keyDeps.forEach(dep => {
    const depPath = path.join('node_modules', dep)
    if (fs.existsSync(depPath)) {
      log(`✅ ${dep} 已安装`, 'green')
      passed++
    } else {
      log(`❌ ${dep} 未安装`, 'red')
    }
  })
  
  return { passed, total: keyDeps.length + 1 }
}

/**
 * 运行代码质量检查
 */
function runQualityChecks() {
  log('\n🔍 运行代码质量检查...', 'blue')
  
  const checks = [
    { command: 'npm run lint', name: 'ESLint 检查' },
    { command: 'npm run type-check', name: 'TypeScript 类型检查' },
    { command: 'npm run format:check', name: 'Prettier 格式检查' }
  ]
  
  let passed = 0
  checks.forEach(({ command, name }) => {
    log(`\n🔧 运行 ${name}...`, 'cyan')
    const result = runCommand(command, name, true)
    
    if (result.success) {
      log(`✅ ${name} 通过`, 'green')
      passed++
    } else {
      log(`❌ ${name} 失败`, 'red')
      if (result.error) {
        console.log(result.error)
      }
    }
  })
  
  return { passed, total: checks.length }
}

/**
 * 测试构建
 */
function testBuild() {
  log('\n🏗️ 测试项目构建...', 'blue')
  
  log('🔧 运行构建命令...', 'cyan')
  const result = runCommand('npm run build', '项目构建', true)
  
  if (result.success) {
    log('✅ 项目构建成功', 'green')
    
    // 检查构建输出
    if (fs.existsSync('.next')) {
      log('✅ .next 目录已生成', 'green')
      return { passed: 2, total: 2 }
    } else {
      log('❌ .next 目录未生成', 'red')
      return { passed: 1, total: 2 }
    }
  } else {
    log('❌ 项目构建失败', 'red')
    if (result.error) {
      console.log(result.error)
    }
    return { passed: 0, total: 2 }
  }
}

/**
 * 运行测试
 */
function runTests() {
  log('\n🧪 运行测试...', 'blue')
  
  log('🔧 运行测试命令...', 'cyan')
  const result = runCommand('npm test -- --passWithNoTests', '单元测试', true)
  
  if (result.success) {
    log('✅ 测试运行成功', 'green')
    return { passed: 1, total: 1 }
  } else {
    log('❌ 测试运行失败', 'red')
    if (result.error) {
      console.log(result.error)
    }
    return { passed: 0, total: 1 }
  }
}

/**
 * 检查安全性
 */
function checkSecurity() {
  log('\n🔒 检查安全性...', 'blue')
  
  log('🔧 运行安全审计...', 'cyan')
  const result = runCommand('npm audit --audit-level=moderate', '安全审计', true)
  
  if (result.success) {
    log('✅ 安全审计通过', 'green')
    return { passed: 1, total: 1 }
  } else {
    log('⚠️  发现安全问题，请运行 npm audit fix', 'yellow')
    return { passed: 0, total: 1 }
  }
}

/**
 * 生成健康报告
 */
function generateHealthReport(results) {
  log('\n📊 生成健康报告...', 'blue')
  
  const totalPassed = results.reduce((sum, result) => sum + result.passed, 0)
  const totalChecks = results.reduce((sum, result) => sum + result.total, 0)
  const healthScore = Math.round((totalPassed / totalChecks) * 100)
  
  const report = {
    timestamp: new Date().toISOString(),
    healthScore,
    totalChecks,
    totalPassed,
    results: results.map((result, index) => ({
      category: [
        '配置文件',
        'VSCode配置',
        '脚本文件',
        '文档文件',
        '测试文件',
        '依赖安装',
        '代码质量',
        '项目构建',
        '单元测试',
        '安全检查'
      ][index],
      ...result
    }))
  }
  
  // 保存报告
  const reportPath = path.join(process.cwd(), 'health-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  log(`📄 健康报告已保存: ${reportPath}`, 'cyan')
  
  return report
}

/**
 * 主函数
 */
async function main() {
  log('🏥 CharliiAI 项目健康检查', 'magenta')
  log('=' .repeat(50), 'cyan')
  
  const results = []
  
  // 运行所有检查
  results.push(checkConfigFiles())
  results.push(checkVSCodeConfig())
  results.push(checkScripts())
  results.push(checkDocumentation())
  results.push(checkTests())
  results.push(checkDependencies())
  results.push(runQualityChecks())
  results.push(testBuild())
  results.push(runTests())
  results.push(checkSecurity())
  
  // 生成报告
  const report = generateHealthReport(results)
  
  // 输出总结
  log('\n📋 健康检查总结:', 'magenta')
  log('=' .repeat(50), 'cyan')
  log(`🎯 健康评分: ${report.healthScore}%`, report.healthScore >= 90 ? 'green' : report.healthScore >= 70 ? 'yellow' : 'red')
  log(`✅ 通过检查: ${report.totalPassed}/${report.totalChecks}`, 'cyan')
  
  if (report.healthScore >= 90) {
    log('\n🎉 项目健康状况优秀！', 'green')
  } else if (report.healthScore >= 70) {
    log('\n⚠️  项目健康状况良好，但有改进空间', 'yellow')
  } else {
    log('\n❌ 项目健康状况需要改进', 'red')
  }
  
  log('\n💡 建议:', 'cyan')
  log('- 运行 npm run quality 进行完整质量检查', 'cyan')
  log('- 运行 npm run dev-tools 查看开发工具', 'cyan')
  log('- 查看 DEVELOPMENT.md 了解开发指南', 'cyan')
  
  // 退出码
  process.exit(report.healthScore >= 70 ? 0 : 1)
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    log(`💥 健康检查过程中发生错误: ${error.message}`, 'red')
    process.exit(1)
  })
}

module.exports = { main }
