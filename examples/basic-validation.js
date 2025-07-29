/**
 * 基本验证示例
 * 
 * 演示如何使用 RobotsValidator 进行基本的 robots.txt 验证
 * 
 * @author NotionNext
 * @version 1.0.0
 */

import { RobotsValidator } from '../lib/seo/robotsValidator.js'

/**
 * 基本验证示例
 */
async function basicValidationExample() {
  console.log('🤖 基本验证示例')
  console.log('=' .repeat(50))
  
  try {
    // 创建验证器实例
    const validator = new RobotsValidator({
      filePath: 'public/robots.txt',
      verbose: true
    })
    
    console.log('📁 验证文件: public/robots.txt')
    console.log('🔍 开始验证...\n')
    
    // 执行验证
    const result = await validator.validate()
    
    // 输出结果
    console.log('📊 验证结果:')
    console.log(`  状态: ${result.isValid ? '✅ 通过' : '❌ 失败'}`)
    console.log(`  总分: ${result.score}/100`)
    console.log(`  检查项: ${result.summary.totalChecks}`)
    console.log(`  通过: ${result.summary.passed}`)
    console.log(`  警告: ${result.summary.warnings}`)
    console.log(`  错误: ${result.summary.errors}`)
    
    // 分类结果
    console.log('\n📋 分类结果:')
    Object.entries(result.categories).forEach(([category, data]) => {
      console.log(`  ${category}: ${data.score}/100 (${data.passed ? '通过' : '失败'})`)
    })
    
    // 生成控制台报告
    console.log('\n📄 详细报告:')
    const report = validator.generateReport()
    console.log(report)
    
    return result
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message)
    throw error
  }
}

/**
 * 简单验证示例
 */
async function simpleValidationExample() {
  console.log('\n🚀 简单验证示例')
  console.log('=' .repeat(50))
  
  const validator = new RobotsValidator()
  
  try {
    const result = await validator.validate()
    
    if (result.isValid) {
      console.log('✅ robots.txt 验证通过！')
      console.log(`📊 得分: ${result.score}/100`)
    } else {
      console.log('❌ robots.txt 验证失败')
      console.log(`📊 得分: ${result.score}/100`)
      console.log(`⚠️  错误: ${result.summary.errors}`)
      console.log(`⚠️  警告: ${result.summary.warnings}`)
    }
    
    return result
    
  } catch (error) {
    console.error('验证过程中发生错误:', error.message)
    return null
  }
}

/**
 * 自定义配置验证示例
 */
async function customConfigExample() {
  console.log('\n⚙️  自定义配置验证示例')
  console.log('=' .repeat(50))
  
  const validator = new RobotsValidator({
    filePath: 'public/robots.txt',
    strict: true,
    checkAccessibility: true,
    validateSitemaps: true,
    timeout: 10000,
    verbose: false
  })
  
  try {
    const result = await validator.validate()
    
    console.log('📊 验证结果 (严格模式):')
    console.log(`  状态: ${result.isValid ? '✅ 通过' : '❌ 失败'}`)
    console.log(`  总分: ${result.score}/100`)
    
    // 检查特定类别
    const formatResult = result.categories.format
    const contentResult = result.categories.content
    const seoResult = result.categories.seo
    
    console.log('\n📋 分类详情:')
    console.log(`  格式验证: ${formatResult.passed ? '✅' : '❌'} (${formatResult.score}/100)`)
    console.log(`  内容验证: ${contentResult.passed ? '✅' : '❌'} (${contentResult.score}/100)`)
    console.log(`  SEO 优化: ${seoResult.passed ? '✅' : '❌'} (${seoResult.score}/100)`)
    
    return result
    
  } catch (error) {
    console.error('验证失败:', error.message)
    return null
  }
}

/**
 * 运行所有示例
 */
async function runAllExamples() {
  console.log('🎯 运行所有基本验证示例\n')
  
  try {
    // 基本验证
    await basicValidationExample()
    
    // 简单验证
    await simpleValidationExample()
    
    // 自定义配置验证
    await customConfigExample()
    
    console.log('\n🎉 所有示例运行完成！')
    
  } catch (error) {
    console.error('\n❌ 示例运行失败:', error.message)
    process.exit(1)
  }
}

// 如果直接运行此文件，则执行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(error => {
    console.error('示例执行失败:', error.message)
    process.exit(1)
  })
}

export {
  basicValidationExample,
  simpleValidationExample,
  customConfigExample,
  runAllExamples
}