#!/usr/bin/env node

/**
 * 增强版Sitemap功能测试脚本
 * 用于验证增强版sitemap生成和整合功能
 */

const { SitemapEnhancedGenerator } = require('../lib/utils/SitemapEnhancedGenerator')

async function testEnhancedSitemap() {
  console.log('🧪 开始测试增强版Sitemap功能...\n')

  const enhancedGenerator = new SitemapEnhancedGenerator({
    baseUrl: 'https://www.shareking.vip',
    enableEnhanced: true,
    enableImages: true,
    enableNews: false,
    enableSitemapIndex: true
  })

  let testsPassed = 0
  let testsTotal = 0

  // 模拟页面数据
  const mockPages = [
    {
      id: '1',
      title: '测试文章1',
      slug: 'test-post-1',
      status: 'Published',
      type: 'Post',
      publishDay: '2024-01-01',
      lastEditedTime: '2024-01-02',
      category: '技术分享',
      tags: ['JavaScript', 'React'],
      pageCover: 'https://example.com/cover1.jpg',
      summary: '这是一篇关于JavaScript的文章'
    },
    {
      id: '2',
      title: '测试页面1',
      slug: 'test-page-1',
      status: 'Published',
      type: 'Page',
      publishDay: '2024-01-05',
      lastEditedTime: '2024-01-06',
      summary: '这是一个测试页面'
    },
    {
      id: '3',
      title: '最新文章',
      slug: 'recent-post',
      status: 'Published',
      type: 'Post',
      publishDay: new Date().toISOString().split('T')[0], // 今天发布
      category: '最新动态',
      tags: ['新闻'],
      pageCover: 'https://example.com/recent.jpg'
    },
    {
      id: '4',
      title: '草稿文章',
      slug: 'draft-post',
      status: 'Draft',
      type: 'Post',
      publishDay: '2024-01-10'
    }
  ]

  const mockSiteInfo = {
    title: '测试网站',
    description: '这是一个测试网站'
  }

  // 测试1: 基础增强版sitemap生成
  testsTotal++
  console.log('📋 测试1: 基础增强版sitemap生成')
  try {
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    if (result.success && 
        result.sitemaps && 
        result.sitemaps.length > 0 &&
        result.stats.totalUrls > 0) {
      console.log('✅ 基础增强版sitemap生成正常')
      console.log(`   - 生成了 ${result.sitemaps.length} 个sitemap文件`)
      console.log(`   - 总URL数量: ${result.stats.totalUrls}`)
      console.log(`   - 生成时间: ${result.stats.generationTime}ms`)
      console.log(`   - 文件列表: ${result.stats.sitemapFiles.join(', ')}`)
      testsPassed++
    } else {
      console.log('❌ 基础增强版sitemap生成异常')
      console.log('   - 结果:', result)
    }
  } catch (error) {
    console.log('❌ 基础增强版sitemap生成测试失败:', error.message)
  }

  // 测试2: 主sitemap内容验证
  testsTotal++
  console.log('\n📋 测试2: 主sitemap内容验证')
  try {
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml')
    
    if (mainSitemap && 
        mainSitemap.content.includes('<?xml version="1.0" encoding="UTF-8"?>') &&
        mainSitemap.content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') &&
        mainSitemap.content.includes('https://www.shareking.vip') &&
        mainSitemap.content.includes('test-post-1') &&
        mainSitemap.content.includes('test-page-1') &&
        !mainSitemap.content.includes('draft-post')) { // 草稿不应该包含
      console.log('✅ 主sitemap内容验证正常')
      console.log(`   - 包含 ${mainSitemap.urls} 个URL`)
      console.log('   - 包含已发布的文章和页面')
      console.log('   - 正确过滤了草稿内容')
      testsPassed++
    } else {
      console.log('❌ 主sitemap内容验证异常')
    }
  } catch (error) {
    console.log('❌ 主sitemap内容验证测试失败:', error.message)
  }

  // 测试3: 分类sitemap生成
  testsTotal++
  console.log('\n📋 测试3: 分类sitemap生成')
  try {
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    const categoriesSitemap = result.sitemaps.find(s => s.filename === 'sitemap-categories.xml')
    
    if (categoriesSitemap && 
        categoriesSitemap.content.includes('category/') &&
        categoriesSitemap.urls > 0) {
      console.log('✅ 分类sitemap生成正常')
      console.log(`   - 包含 ${categoriesSitemap.urls} 个分类URL`)
      testsPassed++
    } else {
      console.log('❌ 分类sitemap生成异常')
    }
  } catch (error) {
    console.log('❌ 分类sitemap生成测试失败:', error.message)
  }

  // 测试4: 标签sitemap生成
  testsTotal++
  console.log('\n📋 测试4: 标签sitemap生成')
  try {
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    const tagsSitemap = result.sitemaps.find(s => s.filename === 'sitemap-tags.xml')
    
    if (tagsSitemap && 
        tagsSitemap.content.includes('tag/') &&
        tagsSitemap.urls > 0) {
      console.log('✅ 标签sitemap生成正常')
      console.log(`   - 包含 ${tagsSitemap.urls} 个标签URL`)
      testsPassed++
    } else {
      console.log('❌ 标签sitemap生成异常')
    }
  } catch (error) {
    console.log('❌ 标签sitemap生成测试失败:', error.message)
  }

  // 测试5: 图片sitemap生成
  testsTotal++
  console.log('\n📋 测试5: 图片sitemap生成')
  try {
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    const imagesSitemap = result.sitemaps.find(s => s.filename === 'sitemap-images.xml')
    
    if (imagesSitemap && 
        imagesSitemap.content.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"') &&
        imagesSitemap.content.includes('<image:image>') &&
        imagesSitemap.content.includes('cover1.jpg') &&
        imagesSitemap.urls > 0) {
      console.log('✅ 图片sitemap生成正常')
      console.log(`   - 包含 ${imagesSitemap.urls} 个图片`)
      console.log('   - 包含正确的图片命名空间')
      testsPassed++
    } else {
      console.log('❌ 图片sitemap生成异常')
    }
  } catch (error) {
    console.log('❌ 图片sitemap生成测试失败:', error.message)
  }

  // 测试6: Sitemap索引文件生成
  testsTotal++
  console.log('\n📋 测试6: Sitemap索引文件生成')
  try {
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    const indexSitemap = result.sitemaps.find(s => s.filename === 'sitemap-index.xml')
    
    if (indexSitemap && 
        indexSitemap.content.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') &&
        indexSitemap.content.includes('sitemap.xml') &&
        indexSitemap.content.includes('sitemap-posts.xml') &&
        indexSitemap.isIndex === true) {
      console.log('✅ Sitemap索引文件生成正常')
      console.log('   - 包含正确的索引命名空间')
      console.log('   - 包含所有子sitemap文件')
      testsPassed++
    } else {
      console.log('❌ Sitemap索引文件生成异常')
    }
  } catch (error) {
    console.log('❌ Sitemap索引文件生成测试失败:', error.message)
  }

  // 测试7: 配置驱动功能
  testsTotal++
  console.log('\n📋 测试7: 配置驱动功能')
  try {
    // 测试禁用图片sitemap
    const configGenerator = new SitemapEnhancedGenerator({
      baseUrl: 'https://www.shareking.vip',
      enableImages: false,
      enableSitemapIndex: false
    })

    const result = await configGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    const imagesSitemap = result.sitemaps.find(s => s.filename === 'sitemap-images.xml')
    const indexSitemap = result.sitemaps.find(s => s.filename === 'sitemap-index.xml')
    
    if (!imagesSitemap && !indexSitemap) {
      console.log('✅ 配置驱动功能正常')
      console.log('   - 正确禁用了图片sitemap')
      console.log('   - 正确禁用了索引文件')
      testsPassed++
    } else {
      console.log('❌ 配置驱动功能异常')
    }
  } catch (error) {
    console.log('❌ 配置驱动功能测试失败:', error.message)
  }

  // 测试8: XML格式验证
  testsTotal++
  console.log('\n📋 测试8: XML格式验证')
  try {
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    let allXmlValid = true
    const xmlValidationResults = []

    result.sitemaps.forEach(sitemap => {
      const xml = sitemap.content
      const isValid = xml.includes('<?xml version="1.0" encoding="UTF-8"?>') &&
                     (xml.includes('<urlset') || xml.includes('<sitemapindex')) &&
                     xml.includes('</urlset>') || xml.includes('</sitemapindex>')
      
      xmlValidationResults.push({
        filename: sitemap.filename,
        valid: isValid
      })
      
      if (!isValid) {
        allXmlValid = false
      }
    })

    if (allXmlValid) {
      console.log('✅ XML格式验证正常')
      console.log(`   - 验证了 ${xmlValidationResults.length} 个XML文件`)
      console.log('   - 所有文件格式正确')
      testsPassed++
    } else {
      console.log('❌ XML格式验证异常')
      console.log('   - 验证结果:', xmlValidationResults)
    }
  } catch (error) {
    console.log('❌ XML格式验证测试失败:', error.message)
  }

  // 测试9: 错误处理
  testsTotal++
  console.log('\n📋 测试9: 错误处理')
  try {
    // 测试空数据处理
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: [],
      siteInfo: mockSiteInfo
    })

    if (result.success && result.sitemaps.length > 0) {
      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml')
      
      if (mainSitemap && mainSitemap.content.includes('https://www.shareking.vip')) {
        console.log('✅ 错误处理正常')
        console.log('   - 空数据时仍能生成基础sitemap')
        console.log('   - 包含静态页面')
        testsPassed++
      } else {
        console.log('❌ 错误处理异常 - 主sitemap内容不正确')
      }
    } else {
      console.log('❌ 错误处理异常 - 生成失败')
    }
  } catch (error) {
    console.log('❌ 错误处理测试失败:', error.message)
  }

  // 测试10: 性能统计
  testsTotal++
  console.log('\n📋 测试10: 性能统计')
  try {
    const result = await enhancedGenerator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: mockSiteInfo
    })

    const stats = enhancedGenerator.getStats()
    
    if (stats.totalUrls > 0 &&
        stats.sitemapFiles.length > 0 &&
        stats.generationTime >= 0) {
      console.log('✅ 性能统计正常')
      console.log(`   - 总URL数: ${stats.totalUrls}`)
      console.log(`   - 文件数: ${stats.sitemapFiles.length}`)
      console.log(`   - 生成时间: ${stats.generationTime}ms`)
      console.log(`   - 错误数: ${stats.errors.length}`)
      testsPassed++
    } else {
      console.log('❌ 性能统计异常')
      console.log('   - 统计数据:', stats)
    }
  } catch (error) {
    console.log('❌ 性能统计测试失败:', error.message)
  }

  // 输出测试结果
  console.log('\n' + '='.repeat(50))
  console.log(`📊 测试结果: ${testsPassed}/${testsTotal} 通过`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 所有测试通过！增强版Sitemap功能工作正常')
    return true
  } else {
    console.log('⚠️  部分测试失败，请检查增强版Sitemap功能')
    return false
  }
}

// 运行测试
if (require.main === module) {
  testEnhancedSitemap()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('测试运行失败:', error)
      process.exit(1)
    })
}

module.exports = { testEnhancedSitemap }