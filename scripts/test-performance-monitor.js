#!/usr/bin/env node

/**
 * 性能监控器测试脚本
 * 用于验证性能监控和缓存机制功能
 */

const { SitemapPerformanceMonitor } = require('../lib/utils/SitemapPerformanceMonitor')

async function testPerformanceMonitor() {
  console.log('🧪 开始测试性能监控器...\n')

  const performanceMonitor = new SitemapPerformanceMonitor({
    maxGenerationTime: 5000,
    maxMemoryUsage: 100 * 1024 * 1024, // 100MB
    enableCache: true,
    cacheMaxAge: 2000, // 2秒用于测试
    enableMonitoring: true,
    enableMemoryMonitoring: false, // 禁用内存监控避免定时器
    enableTimeoutProtection: false, // 禁用超时保护避免定时器
    enableLogging: true
  })

  let testsPassed = 0
  let testsTotal = 0

  // 测试1: 基础性能监控
  testsTotal++
  console.log('📋 测试1: 基础性能监控')
  try {
    const mockGenerator = async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return {
        success: true,
        xml: '<xml>test sitemap</xml>',
        stats: { urlsProcessed: 10, xmlSize: 1000 }
      }
    }

    const result = await performanceMonitor.executeWithMonitoring(
      mockGenerator,
      'test-key-1'
    )

    if (result.success && 
        result.fromCache === false &&
        result.generationTime >= 0 &&
        result.requestId) {
      console.log('✅ 基础性能监控正常')
      console.log(`   - 生成时间: ${result.generationTime}ms`)
      console.log(`   - 请求ID: ${result.requestId}`)
      testsPassed++
    } else {
      console.log('❌ 基础性能监控异常')
    }
  } catch (error) {
    console.log('❌ 基础性能监控测试失败:', error.message)
  }

  // 测试2: 缓存机制
  testsTotal++
  console.log('\n📋 测试2: 缓存机制')
  try {
    let callCount = 0
    const mockGenerator = async () => {
      callCount++
      return {
        success: true,
        xml: '<xml>cached sitemap</xml>',
        stats: { urlsProcessed: 5, xmlSize: 500 }
      }
    }

    // 第一次调用
    const result1 = await performanceMonitor.executeWithMonitoring(
      mockGenerator,
      'cache-test-key'
    )

    // 第二次调用应该使用缓存
    const result2 = await performanceMonitor.executeWithMonitoring(
      mockGenerator,
      'cache-test-key'
    )

    if (result1.fromCache === false && 
        result2.fromCache === true &&
        callCount === 1) {
      console.log('✅ 缓存机制正常')
      console.log(`   - 第一次调用: 生成新内容`)
      console.log(`   - 第二次调用: 使用缓存`)
      console.log(`   - 生成器调用次数: ${callCount}`)
      testsPassed++
    } else {
      console.log('❌ 缓存机制异常')
      console.log(`   - 生成器调用次数: ${callCount}`)
    }
  } catch (error) {
    console.log('❌ 缓存机制测试失败:', error.message)
  }

  // 测试3: 错误处理
  testsTotal++
  console.log('\n📋 测试3: 错误处理')
  try {
    const failGenerator = async () => {
      throw new Error('模拟生成失败')
    }

    try {
      await performanceMonitor.executeWithMonitoring(failGenerator, 'error-test')
      console.log('❌ 错误处理异常 - 应该抛出错误')
    } catch (error) {
      if (error.message === '模拟生成失败') {
        console.log('✅ 错误处理正常')
        console.log(`   - 正确捕获错误: ${error.message}`)
        testsPassed++
      } else {
        console.log('❌ 错误处理异常 - 错误信息不匹配')
      }
    }
  } catch (error) {
    console.log('❌ 错误处理测试失败:', error.message)
  }

  // 测试4: 性能统计
  testsTotal++
  console.log('\n📋 测试4: 性能统计')
  try {
    const stats = performanceMonitor.getPerformanceStats()
    
    if (stats.totalRequests >= 2 &&
        stats.successfulRequests >= 1 &&
        stats.failedRequests >= 1 &&
        stats.cacheHits >= 1 &&
        stats.averageGenerationTime >= 0) {
      console.log('✅ 性能统计正常')
      console.log(`   - 总请求数: ${stats.totalRequests}`)
      console.log(`   - 成功请求: ${stats.successfulRequests}`)
      console.log(`   - 失败请求: ${stats.failedRequests}`)
      console.log(`   - 缓存命中: ${stats.cacheHits}`)
      console.log(`   - 缓存命中率: ${stats.cacheHitRate}`)
      console.log(`   - 平均生成时间: ${stats.averageGenerationTime.toFixed(2)}ms`)
      testsPassed++
    } else {
      console.log('❌ 性能统计异常')
      console.log('   - 统计数据:', stats)
    }
  } catch (error) {
    console.log('❌ 性能统计测试失败:', error.message)
  }

  // 测试5: 缓存过期和降级
  testsTotal++
  console.log('\n📋 测试5: 缓存过期和降级')
  try {
    // 先设置一个成功的缓存
    const successGenerator = async () => ({
      success: true,
      xml: '<xml>success</xml>',
      stats: { urlsProcessed: 3 }
    })

    await performanceMonitor.executeWithMonitoring(successGenerator, 'expire-test')

    // 等待缓存过期
    await new Promise(resolve => setTimeout(resolve, 2100))

    // 然后尝试一个失败的生成器
    const failGenerator = async () => {
      throw new Error('生成失败')
    }

    const result = await performanceMonitor.executeWithMonitoring(failGenerator, 'expire-test')

    if (result.fromCache === true && result.isStale === true) {
      console.log('✅ 缓存过期和降级正常')
      console.log(`   - 使用过期缓存作为降级`)
      console.log(`   - 错误信息: ${result.error}`)
      testsPassed++
    } else {
      console.log('❌ 缓存过期和降级异常')
    }
  } catch (error) {
    console.log('❌ 缓存过期和降级测试失败:', error.message)
  }

  // 测试6: 缓存大小限制
  testsTotal++
  console.log('\n📋 测试6: 缓存大小限制')
  try {
    performanceMonitor.config.cacheMaxSize = 2

    const generator = async (data) => ({
      success: true,
      xml: `<xml>${data}</xml>`,
      stats: { urlsProcessed: 1 }
    })

    // 添加3个缓存条目
    await performanceMonitor.executeWithMonitoring(() => generator('data1'), 'limit-key1')
    await performanceMonitor.executeWithMonitoring(() => generator('data2'), 'limit-key2')
    await performanceMonitor.executeWithMonitoring(() => generator('data3'), 'limit-key3')

    const stats = performanceMonitor.getPerformanceStats()
    
    if (stats.cacheSize <= 2) {
      console.log('✅ 缓存大小限制正常')
      console.log(`   - 缓存大小: ${stats.cacheSize}`)
      console.log(`   - 限制大小: 2`)
      testsPassed++
    } else {
      console.log('❌ 缓存大小限制异常')
      console.log(`   - 缓存大小: ${stats.cacheSize}`)
    }
  } catch (error) {
    console.log('❌ 缓存大小限制测试失败:', error.message)
  }

  // 测试7: 健康状态检查
  testsTotal++
  console.log('\n📋 测试7: 健康状态检查')
  try {
    const healthStatus = performanceMonitor.getHealthStatus()
    
    if (healthStatus.healthy !== undefined &&
        healthStatus.issues !== undefined &&
        healthStatus.stats !== undefined &&
        healthStatus.timestamp !== undefined) {
      console.log('✅ 健康状态检查正常')
      console.log(`   - 健康状态: ${healthStatus.healthy ? '健康' : '不健康'}`)
      console.log(`   - 问题数量: ${healthStatus.issues.length}`)
      if (healthStatus.issues.length > 0) {
        console.log(`   - 问题列表: ${healthStatus.issues.join(', ')}`)
      }
      testsPassed++
    } else {
      console.log('❌ 健康状态检查异常')
    }
  } catch (error) {
    console.log('❌ 健康状态检查测试失败:', error.message)
  }

  // 测试8: 缓存清理
  testsTotal++
  console.log('\n📋 测试8: 缓存清理')
  try {
    const initialCacheSize = performanceMonitor.getPerformanceStats().cacheSize
    
    // 强制清理所有缓存
    performanceMonitor.clearCache(true)
    
    const finalCacheSize = performanceMonitor.getPerformanceStats().cacheSize
    
    if (finalCacheSize === 0) {
      console.log('✅ 缓存清理正常')
      console.log(`   - 清理前缓存大小: ${initialCacheSize}`)
      console.log(`   - 清理后缓存大小: ${finalCacheSize}`)
      testsPassed++
    } else {
      console.log('❌ 缓存清理异常')
    }
  } catch (error) {
    console.log('❌ 缓存清理测试失败:', error.message)
  }

  // 清理资源
  performanceMonitor.stopMemoryMonitoring()

  // 输出测试结果
  console.log('\n' + '='.repeat(50))
  console.log(`📊 测试结果: ${testsPassed}/${testsTotal} 通过`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 所有测试通过！性能监控器工作正常')
    return true
  } else {
    console.log('⚠️  部分测试失败，请检查性能监控器')
    return false
  }
}

// 运行测试
if (require.main === module) {
  testPerformanceMonitor()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('测试运行失败:', error)
      process.exit(1)
    })
}

module.exports = { testPerformanceMonitor }