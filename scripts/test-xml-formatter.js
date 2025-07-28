#!/usr/bin/env node

/**
 * XML格式化器测试脚本
 * 用于验证XML格式化和响应优化功能
 */

const { XMLFormatter } = require('../lib/utils/XMLFormatter')

async function testXMLFormatter() {
  console.log('🧪 开始测试XML格式化器...\n')

  const xmlFormatter = new XMLFormatter({
    baseUrl: 'https://www.shareking.vip',
    maxUrls: 50000,
    enableValidation: true,
    prettyPrint: false
  })

  let testsPassed = 0
  let testsTotal = 0

  // 测试1: 基础XML生成
  testsTotal++
  console.log('📋 测试1: 基础XML生成')
  try {
    const urls = [
      { loc: 'https://www.shareking.vip/', lastmod: '2024-01-01', changefreq: 'daily', priority: '1.0' },
      { loc: 'https://www.shareking.vip/archive', lastmod: '2024-01-01', changefreq: 'daily', priority: '0.8' },
      { loc: 'https://www.shareking.vip/category', lastmod: '2024-01-01', changefreq: 'daily', priority: '0.8' }
    ]
    
    const result = xmlFormatter.generateSitemapXML(urls)
    
    if (result.success && 
        result.xml.includes('<?xml version="1.0" encoding="UTF-8"?>') &&
        result.xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') &&
        result.stats.urlsProcessed === 3) {
      console.log('✅ 基础XML生成正常')
      console.log(`   - 处理了 ${result.stats.urlsProcessed} 个URL`)
      console.log(`   - XML大小: ${result.stats.xmlSize} 字节`)
      console.log(`   - 生成时间: ${result.stats.generationTime}ms`)
      testsPassed++
    } else {
      console.log('❌ 基础XML生成异常')
    }
  } catch (error) {
    console.log('❌ 基础XML生成测试失败:', error.message)
  }

  // 测试2: XML转义功能
  testsTotal++
  console.log('\n📋 测试2: XML转义功能')
  try {
    const testString = 'Test & <script>alert("xss")</script> "quotes" \'single\''
    const escaped = xmlFormatter.escapeXML(testString)
    
    if (escaped.includes('&amp;') && 
        escaped.includes('&lt;') && 
        escaped.includes('&gt;') &&
        escaped.includes('&quot;') &&
        escaped.includes('&apos;')) {
      console.log('✅ XML转义功能正常')
      console.log(`   - 原始: ${testString}`)
      console.log(`   - 转义: ${escaped}`)
      testsPassed++
    } else {
      console.log('❌ XML转义功能异常')
    }
  } catch (error) {
    console.log('❌ XML转义功能测试失败:', error.message)
  }

  // 测试3: URL验证和过滤
  testsTotal++
  console.log('\n📋 测试3: URL验证和过滤')
  try {
    const urls = [
      { loc: 'https://www.shareking.vip/valid-page', lastmod: '2024-01-01' },
      { loc: 'invalid-url', lastmod: '2024-01-01' }, // 无效URL
      { loc: 'https://other-domain.com/page', lastmod: '2024-01-01' }, // 不同域名
      { lastmod: '2024-01-01' }, // 缺少loc字段
      null // null对象
    ]
    
    const validatedUrls = xmlFormatter.validateUrls(urls)
    
    if (validatedUrls.length === 1 && validatedUrls[0].loc === 'https://www.shareking.vip/valid-page') {
      console.log('✅ URL验证和过滤正常')
      console.log(`   - 原始URL数量: ${urls.length}`)
      console.log(`   - 有效URL数量: ${validatedUrls.length}`)
      console.log(`   - 验证错误数量: ${xmlFormatter.stats.validationErrors.length}`)
      testsPassed++
    } else {
      console.log('❌ URL验证和过滤异常')
    }
  } catch (error) {
    console.log('❌ URL验证和过滤测试失败:', error.message)
  }

  // 测试4: 日期格式化
  testsTotal++
  console.log('\n📋 测试4: 日期格式化')
  try {
    const testCases = [
      { input: '2024-01-01', expected: '2024-01-01' },
      { input: '2024-12-31T10:30:00Z', expected: '2024-12-31' },
      { input: new Date('2024-06-15'), expected: '2024-06-15' },
      { input: 'invalid-date', expected: /^\d{4}-\d{2}-\d{2}$/ }
    ]
    
    let allPassed = true
    testCases.forEach((testCase, index) => {
      const result = xmlFormatter.formatDate(testCase.input)
      const isValid = typeof testCase.expected === 'string' 
        ? result === testCase.expected 
        : testCase.expected.test(result)
      
      if (!isValid) {
        allPassed = false
        console.log(`   - 测试用例 ${index + 1} 失败: ${testCase.input} -> ${result}`)
      }
    })
    
    if (allPassed) {
      console.log('✅ 日期格式化正常')
      console.log('   - 所有测试用例通过')
      testsPassed++
    } else {
      console.log('❌ 日期格式化异常')
    }
  } catch (error) {
    console.log('❌ 日期格式化测试失败:', error.message)
  }

  // 测试5: Priority和Changefreq验证
  testsTotal++
  console.log('\n📋 测试5: Priority和Changefreq验证')
  try {
    const priorityTests = [
      { input: '0.8', expected: '0.8' },
      { input: '1.5', expected: '1.0' }, // 超出范围
      { input: '-0.5', expected: '0.0' }, // 超出范围
      { input: 'invalid', expected: '0.5' } // 无效值
    ]
    
    const changefreqTests = [
      { input: 'daily', expected: 'daily' },
      { input: 'weekly', expected: 'weekly' },
      { input: 'invalid', expected: 'weekly' } // 无效值
    ]
    
    let priorityPassed = priorityTests.every(test => 
      xmlFormatter.validatePriority(test.input) === test.expected
    )
    
    let changefreqPassed = changefreqTests.every(test => 
      xmlFormatter.validateChangefreq(test.input) === test.expected
    )
    
    if (priorityPassed && changefreqPassed) {
      console.log('✅ Priority和Changefreq验证正常')
      console.log('   - Priority验证通过')
      console.log('   - Changefreq验证通过')
      testsPassed++
    } else {
      console.log('❌ Priority和Changefreq验证异常')
    }
  } catch (error) {
    console.log('❌ Priority和Changefreq验证测试失败:', error.message)
  }

  // 测试6: 大量URL处理
  testsTotal++
  console.log('\n📋 测试6: 大量URL处理')
  try {
    const largeUrlSet = []
    for (let i = 0; i < 1000; i++) {
      largeUrlSet.push({
        loc: `https://www.shareking.vip/page-${i}`,
        lastmod: '2024-01-01',
        changefreq: 'weekly',
        priority: (Math.random()).toFixed(1)
      })
    }
    
    const startTime = Date.now()
    const result = xmlFormatter.generateSitemapXML(largeUrlSet)
    const processingTime = Date.now() - startTime
    
    if (result.success && 
        result.stats.urlsProcessed === 1000 &&
        processingTime < 1000) { // 应该在1秒内完成
      console.log('✅ 大量URL处理正常')
      console.log(`   - 处理了 ${result.stats.urlsProcessed} 个URL`)
      console.log(`   - 处理时间: ${processingTime}ms`)
      console.log(`   - XML大小: ${result.stats.xmlSize} 字节`)
      testsPassed++
    } else {
      console.log('❌ 大量URL处理异常')
      console.log(`   - 处理时间: ${processingTime}ms`)
    }
  } catch (error) {
    console.log('❌ 大量URL处理测试失败:', error.message)
  }

  // 测试7: 图片扩展支持
  testsTotal++
  console.log('\n📋 测试7: 图片扩展支持')
  try {
    const urlsWithImages = [
      {
        loc: 'https://www.shareking.vip/article-with-images',
        lastmod: '2024-01-01',
        images: [
          { loc: 'https://www.shareking.vip/image1.jpg', caption: '测试图片1' },
          { loc: 'https://www.shareking.vip/image2.jpg', title: '测试图片2' }
        ]
      }
    ]
    
    const result = xmlFormatter.generateSitemapXML(urlsWithImages, { includeImages: true })
    
    if (result.success &&
        result.xml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"') &&
        result.xml.includes('<image:image>') &&
        result.xml.includes('https://www.shareking.vip/image1.jpg')) {
      console.log('✅ 图片扩展支持正常')
      console.log('   - 包含图片命名空间')
      console.log('   - 包含图片元素')
      testsPassed++
    } else {
      console.log('❌ 图片扩展支持异常')
    }
  } catch (error) {
    console.log('❌ 图片扩展支持测试失败:', error.message)
  }

  // 测试8: 响应头优化
  testsTotal++
  console.log('\n📋 测试8: 响应头优化')
  try {
    const mockRes = {
      headers: {},
      setHeader: function(name, value) {
        this.headers[name] = value
      }
    }
    
    xmlFormatter.setOptimalResponseHeaders(mockRes)
    
    const requiredHeaders = [
      'Content-Type',
      'Cache-Control',
      'X-Robots-Tag',
      'Vary',
      'X-Content-Type-Options',
      'X-Frame-Options'
    ]
    
    const hasAllHeaders = requiredHeaders.every(header => mockRes.headers[header])
    const correctContentType = mockRes.headers['Content-Type'] === 'application/xml; charset=utf-8'
    const correctCacheControl = mockRes.headers['Cache-Control'].includes('public')
    
    if (hasAllHeaders && correctContentType && correctCacheControl) {
      console.log('✅ 响应头优化正常')
      console.log('   - 设置了所有必需的响应头')
      console.log('   - Content-Type正确')
      console.log('   - 缓存策略正确')
      testsPassed++
    } else {
      console.log('❌ 响应头优化异常')
    }
  } catch (error) {
    console.log('❌ 响应头优化测试失败:', error.message)
  }

  // 测试9: Sitemap索引生成
  testsTotal++
  console.log('\n📋 测试9: Sitemap索引生成')
  try {
    const sitemapUrls = [
      { loc: 'https://www.shareking.vip/sitemap-posts.xml', lastmod: '2024-01-01' },
      { loc: 'https://www.shareking.vip/sitemap-pages.xml', lastmod: '2024-01-02' },
      { loc: 'https://www.shareking.vip/sitemap-categories.xml', lastmod: '2024-01-03' }
    ]
    
    const indexXml = xmlFormatter.generateSitemapIndex(sitemapUrls)
    
    if (indexXml.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') &&
        indexXml.includes('https://www.shareking.vip/sitemap-posts.xml') &&
        indexXml.includes('<sitemap>') &&
        indexXml.includes('</sitemapindex>')) {
      console.log('✅ Sitemap索引生成正常')
      console.log(`   - 包含 ${sitemapUrls.length} 个sitemap文件`)
      testsPassed++
    } else {
      console.log('❌ Sitemap索引生成异常')
    }
  } catch (error) {
    console.log('❌ Sitemap索引生成测试失败:', error.message)
  }

  // 测试10: 错误处理和降级
  testsTotal++
  console.log('\n📋 测试10: 错误处理和降级')
  try {
    // 设置极小的大小限制来触发错误
    const testFormatter = new XMLFormatter({
      baseUrl: 'https://www.shareking.vip',
      maxSizeBytes: 1
    })
    
    const urls = [
      { loc: 'https://www.shareking.vip/page1', lastmod: '2024-01-01' }
    ]
    
    const result = testFormatter.generateSitemapXML(urls)
    
    if (!result.success && result.error && result.fallbackXML) {
      console.log('✅ 错误处理和降级正常')
      console.log(`   - 检测到错误: ${result.error}`)
      console.log('   - 提供了降级XML')
      testsPassed++
    } else {
      console.log('❌ 错误处理和降级异常')
    }
  } catch (error) {
    console.log('❌ 错误处理和降级测试失败:', error.message)
  }

  // 输出测试结果
  console.log('\n' + '='.repeat(50))
  console.log(`📊 测试结果: ${testsPassed}/${testsTotal} 通过`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 所有测试通过！XML格式化器工作正常')
    return true
  } else {
    console.log('⚠️  部分测试失败，请检查XML格式化器')
    return false
  }
}

// 运行测试
if (require.main === module) {
  testXMLFormatter()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('测试运行失败:', error)
      process.exit(1)
    })
}

module.exports = { testXMLFormatter }