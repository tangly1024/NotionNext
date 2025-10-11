#!/usr/bin/env node

/**
 * 最终项目验证脚本
 * 验证所有优化任务是否完成
 */

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

/**
 * 验证优化任务完成情况
 */
function validateOptimizationTasks() {
  log('🎯 验证优化任务完成情况', 'magenta')
  log('=' .repeat(60), 'cyan')
  
  const tasks = [
    {
      name: '项目分析与评估',
      checks: [
        { file: 'OPTIMIZATION_SUMMARY.md', desc: '优化总结文档' },
        { file: 'package.json', desc: '项目配置文件' }
      ]
    },
    {
      name: '依赖管理优化',
      checks: [
        { file: '.npmrc', desc: 'NPM 配置文件' },
        { file: 'package.json', desc: '依赖包更新', validate: validateDependencies }
      ]
    },
    {
      name: '性能优化',
      checks: [
        { file: 'next.config.js', desc: 'Next.js 性能配置', validate: validateNextConfig },
        { file: 'conf/performance.config.js', desc: '性能配置文件' },
        { file: 'components/PerformanceMonitor.js', desc: '性能监控组件' }
      ]
    },
    {
      name: '代码质量提升',
      checks: [
        { file: 'tsconfig.json', desc: 'TypeScript 配置', validate: validateTSConfig },
        { file: '.eslintrc.js', desc: 'ESLint 配置' },
        { file: '.prettierrc.js', desc: 'Prettier 配置' },
        { file: 'lib/utils/errorHandler.js', desc: '错误处理工具' },
        { file: 'types/index.ts', desc: '类型定义文件' },
        { file: 'scripts/quality-check.js', desc: '质量检查脚本' }
      ]
    },
    {
      name: 'SEO和可访问性优化',
      checks: [
        { file: 'components/SEO.js', desc: 'SEO 组件优化', validate: validateSEOComponent },
        { file: 'components/Accessibility.js', desc: '可访问性组件' },
        { file: 'lib/sitemap.js', desc: '站点地图生成器' }
      ]
    },
    {
      name: '安全性加固',
      checks: [
        { file: 'next.config.js', desc: '安全头部配置', validate: validateSecurityHeaders },
        { file: 'lib/utils/validation.js', desc: '输入验证工具' },
        { file: 'lib/middleware/security.js', desc: '安全中间件' },
        { file: 'lib/config/env-validation.js', desc: '环境变量验证' }
      ]
    },
    {
      name: '开发体验优化',
      checks: [
        { file: '.vscode/settings.json', desc: 'VSCode 设置' },
        { file: '.vscode/extensions.json', desc: 'VSCode 扩展推荐' },
        { file: '.vscode/launch.json', desc: 'VSCode 调试配置' },
        { file: '.vscode/tasks.json', desc: 'VSCode 任务配置' },
        { file: 'scripts/dev-tools.js', desc: '开发工具脚本' },
        { file: 'scripts/setup-git-hooks.js', desc: 'Git Hooks 设置' },
        { file: 'DEVELOPMENT.md', desc: '开发者指南' }
      ]
    },
    {
      name: '文档和测试完善',
      checks: [
        { file: 'jest.config.js', desc: 'Jest 配置' },
        { file: 'jest.setup.js', desc: 'Jest 设置文件' },
        { file: '__tests__/components/LazyImage.test.js', desc: '组件测试示例' },
        { file: '__tests__/lib/utils/validation.test.js', desc: '工具函数测试' },
        { file: 'DEPLOYMENT.md', desc: '部署指南' },
        { file: '.github/workflows/ci.yml', desc: 'CI/CD 配置' },
        { file: 'lighthouserc.js', desc: 'Lighthouse 配置' }
      ]
    }
  ]
  
  let totalTasks = 0
  let completedTasks = 0
  
  tasks.forEach(task => {
    log(`\n📋 ${task.name}`, 'blue')
    
    let taskCompleted = 0
    task.checks.forEach(check => {
      totalTasks++
      
      if (fs.existsSync(check.file)) {
        let isValid = true
        
        // 运行自定义验证
        if (check.validate) {
          try {
            isValid = check.validate(check.file)
          } catch (error) {
            isValid = false
          }
        }
        
        if (isValid) {
          log(`  ✅ ${check.desc}`, 'green')
          completedTasks++
          taskCompleted++
        } else {
          log(`  ⚠️  ${check.desc} - 配置可能不完整`, 'yellow')
        }
      } else {
        log(`  ❌ ${check.desc} - 文件不存在`, 'red')
      }
    })
    
    const taskProgress = Math.round((taskCompleted / task.checks.length) * 100)
    log(`  📊 任务完成度: ${taskProgress}%`, taskProgress === 100 ? 'green' : taskProgress >= 80 ? 'yellow' : 'red')
  })
  
  return { completed: completedTasks, total: totalTasks }
}

/**
 * 验证依赖包更新
 */
function validateDependencies(filePath) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    // 检查关键依赖是否已更新
    const keyDeps = {
      'next': '^14.2.30',
      'react': '^18.3.1',
      'tailwindcss': '^3.4.17'
    }
    
    for (const [dep, expectedVersion] of Object.entries(keyDeps)) {
      const currentVersion = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
      if (!currentVersion || !currentVersion.includes(expectedVersion.replace('^', ''))) {
        return false
      }
    }
    
    // 检查新增的脚本
    const requiredScripts = ['quality', 'pre-commit', 'dev-tools', 'health-check', 'test']
    for (const script of requiredScripts) {
      if (!packageJson.scripts?.[script]) {
        return false
      }
    }
    
    return true
  } catch {
    return false
  }
}

/**
 * 验证Next.js配置
 */
function validateNextConfig(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // 检查性能优化配置
    const requiredConfigs = [
      'compress: true',
      'poweredByHeader: false',
      'swcMinify: true',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Content-Security-Policy'
    ]
    
    return requiredConfigs.every(config => content.includes(config))
  } catch {
    return false
  }
}

/**
 * 验证TypeScript配置
 */
function validateTSConfig(filePath) {
  try {
    const tsConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    // 检查严格模式配置
    const strictOptions = [
      'noImplicitAny',
      'noImplicitReturns',
      'exactOptionalPropertyTypes',
      'noUncheckedIndexedAccess'
    ]
    
    return strictOptions.every(option => 
      tsConfig.compilerOptions?.[option] === true
    )
  } catch {
    return false
  }
}

/**
 * 验证SEO组件
 */
function validateSEOComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // 检查SEO优化功能
    const seoFeatures = [
      'generateStructuredData',
      'og:image:width',
      'twitter:image:alt',
      'dns-prefetch',
      'preconnect'
    ]
    
    return seoFeatures.every(feature => content.includes(feature))
  } catch {
    return false
  }
}

/**
 * 验证安全头部配置
 */
function validateSecurityHeaders(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // 检查安全头部
    const securityHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy'
    ]
    
    return securityHeaders.every(header => content.includes(header))
  } catch {
    return false
  }
}

/**
 * 生成最终报告
 */
function generateFinalReport(taskResults) {
  log('\n📊 最终验证报告', 'magenta')
  log('=' .repeat(60), 'cyan')
  
  const completionRate = Math.round((taskResults.completed / taskResults.total) * 100)
  
  log(`📈 总体完成度: ${completionRate}%`, completionRate >= 95 ? 'green' : completionRate >= 80 ? 'yellow' : 'red')
  log(`✅ 已完成任务: ${taskResults.completed}/${taskResults.total}`, 'cyan')
  
  if (completionRate >= 95) {
    log('\n🎉 恭喜！所有优化任务已基本完成！', 'green')
    log('🚀 项目已达到生产级别的质量标准', 'green')
  } else if (completionRate >= 80) {
    log('\n👍 很好！大部分优化任务已完成', 'yellow')
    log('🔧 建议完善剩余的配置项', 'yellow')
  } else {
    log('\n⚠️  还有较多任务需要完成', 'red')
    log('📋 请参考 OPTIMIZATION_SUMMARY.md 了解详情', 'red')
  }
  
  // 生成报告文件
  const report = {
    timestamp: new Date().toISOString(),
    completionRate,
    completedTasks: taskResults.completed,
    totalTasks: taskResults.total,
    status: completionRate >= 95 ? 'excellent' : completionRate >= 80 ? 'good' : 'needs-improvement'
  }
  
  fs.writeFileSync('validation-report.json', JSON.stringify(report, null, 2))
  log('\n📄 详细报告已保存到 validation-report.json', 'cyan')
  
  return report
}

/**
 * 主函数
 */
function main() {
  log('🔍 NotionNext 项目最终验证', 'magenta')
  log('验证所有优化任务的完成情况', 'cyan')
  log('=' .repeat(60), 'cyan')
  
  const taskResults = validateOptimizationTasks()
  const report = generateFinalReport(taskResults)
  
  log('\n💡 下一步建议:', 'cyan')
  log('1. 运行 npm run health-check 进行健康检查', 'cyan')
  log('2. 运行 npm run quality 进行质量检查', 'cyan')
  log('3. 运行 npm run build 测试构建', 'cyan')
  log('4. 查看 DEPLOYMENT.md 了解部署方式', 'cyan')
  
  return report.status === 'excellent'
}

// 运行主函数
if (require.main === module) {
  const success = main()
  process.exit(success ? 0 : 1)
}

module.exports = { main }
