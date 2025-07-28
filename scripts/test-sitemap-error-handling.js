#!/usr/bin/env node

/**
 * Sitemap错误处理测试脚本
 * 用于验证错误处理和降级机制是否正常工作
 */

const { SitemapErrorHandler } = require('../lib/utils/SitemapErrorHandler')

async function testErrorHandling() {
  console.log('🧪 开始测试Sitemap错误处理机制...\n')

  const errorHandler = new SitemapErrorHandler({
    baseUrl: 'https://www.shareking.vip',
    enableLogging: true
  })

  let testsPassed = 0
  let testsTotal = 0

  // 测试1: 数据获取错误处理
  testsTotal++
  console.log('📋 测试1: 数据获取错误处理')
  try {
    const error = new Error('模拟API调用失败')
    const result = errorHandler.handleDataFetchError(error, 'test-site-1')
    
    if (!result.success && result.source === 'none') {
      console.log('✅ 数据获取错误处理正常')
      testsPassed++
    } else {
      console.log('❌ 数据获取错误处理异常')
    }
  } catch (error) {
    console.log('❌ 数据获取错误处理测试失败:', error.message)
  }

  // 测试2: 缓存机制
  testsTotal++
  console.log('\n📋 测试2: 缓存机制')
  try {
    const testData = { allPages: [{ id: '1', title: 'Test Page', status: 'Published', slug: 'test' }] }
    errorHandler.setCachedData('test-site-2', testData)
    
    const error = new Error('模拟API调用失败')
    const result = errorHandler.handleDataFetchError(error, 'test-site-2')
    
    if (result.success && result.source === 'cache' && result.data === testData) {
      console.log('✅ 缓存机制工作正常')
      testsPassed++
    } else {
      console.log('❌ 缓存机制异常')
    }
  } catch (error) {
    console.log('❌ 缓存机制测试失败:', error.message)
  }

  // 测试3: 数据处理错误处理
  testsTotal++
  console.log('\n📋 测试3: 数据处理错误处理')
  try {
    const testData = {
      allPages: [
        { id: '1', status: 'Published', slug: 'valid-page' },
        { id: '2', status: 'Draft', slug: 'draft-page' },
        { id: '3', status: 'Published', slug: '' }
      ]
    }
    
    const error = new Error('模拟数据处理失败')
    const result = errorHandler.handleProcessingError(error, testData)
    
    if (result.success && result.data.allPages.length === 1 && result.source === 'basic_processing') {
      console.log('✅ 数据处理错误处理正常')
      testsPassed++
    } else {
      console.log('❌ 数据处理错误处理异常')
    }
  } catch (error) {
    console.log('❌ 数据处理错误处理测试失败:', error.message)
  }

  // 测试4: XML生成错误处理
  testsTotal++
  console.log('\n📋 测试4: XML生成错误处理')
  try {
    const testUrls = [
      { loc: 'https://www.shareking.vip/test1', lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.8' },
      { loc: 'https://www.shareking.vip/test2', lastmod: '2024-01-02', changefreq: 'weekly', priority: '0.8' }
    ]
    
    const error = new Error('模拟XML生成失败')
    const result = errorHandler.handleXMLGenerationError(error, testUrls)
    
    if (result.success && result.xml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      console.log('✅ XML生成错误处理正常')
      testsPassed++
    } else {
      console.log('❌ XML生成错误处理异常')
    }
  } catch (error) {
    console.log('❌ XML生成错误处理测试失败:', error.message)
  }

  // 测试5: 降级sitemap生成
  testsTotal++
  console.log('\n📋 测试5: 降级sitemap生成')
  try {
    const fallbackXml = errorHandler.generateFallbackSitemap('level2')
    
    if (fallbackXml.includes('<?xml version="1.0" encoding="UTF-8"?>') && 
        fallbackXml.includes('https://www.shareking.vip') &&
        fallbackXml.includes('/archive')) {
      console.log('✅ 降级sitemap生成正常')
      testsPassed++
    } else {
      console.log('❌ 降级sitemap生成异常')
    }
  } catch (error) {
    console.log('❌ 降级sitemap生成测试失败:', error.message)
  }

  // 测试6: 重试机制
  testsTotal++
  console.log('\n📋 测试6: 重试机制')
  try {
    let attemptCount = 0
    const testFunction = async () => {
      attemptCount++
      if (attemptCount < 3) {
        throw new Error('暂时失败')
      }
      return 'success'
    }
    
    errorHandler.config.retryDelay = 10 // 快速重试
    const result = await errorHandler.retry(testFunction, 3)
    
    if (result === 'success' && attemptCount === 3) {
      console.log('✅ 重试机制工作正常')
      testsPassed++
    } else {
      console.log('❌ 重试机制异常')
    }
  } catch (error) {
    console.log('❌ 重试机制测试失败:', error.message)
  }

  // 测试7: XML转义
  testsTotal++
  console.log('\n📋 测试7: XML转义')
  try {
    const testString = 'Test & <script>alert("xss")</script>'
    const escaped = errorHandler.escapeXML(testString)
    
    if (escaped.includes('&amp;') && escaped.includes('&lt;') && escaped.includes('&gt;')) {
      console.log('✅ XML转义工作正常')
      testsPassed++
    } else {
      console.log('❌ XML转义异常')
    }
  } catch (error) {
    console.log('❌ XML转义测试失败:', error.message)
  }

  // 测试8: 健康状态检查
  testsTotal++
  console.log('\n📋 测试8: 健康状态检查')
  try {
    const healthStatus = errorHandler.getHealthStatus()
    
    if (healthStatus.healthy !== undefined && 
        healthStatus.errorStats && 
        healthStatus.timestamp) {
      console.log('✅ 健康状态检查正常')
      testsPassed++
    } else {
      console.log('❌ 健康状态检查异常')
    }
  } catch (error) {
    console.log('❌ 健康状态检查测试失败:', error.message)
  }

  // 输出测试结果
  console.log('\n' + '='.repeat(50))
  console.log(`📊 测试结果: ${testsPassed}/${testsTotal} 通过`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 所有测试通过！错误处理机制工作正常')
    return true
  } else {
    console.log('⚠️  部分测试失败，请检查错误处理机制')
    return false
  }
}

// 运行测试
if (require.main === module) {
  testErrorHandling()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('测试运行失败:', error)
      process.exit(1)
    })
}

module.exports = { testErrorHandling }