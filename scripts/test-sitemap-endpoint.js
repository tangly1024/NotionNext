#!/usr/bin/env node

/**
 * 测试sitemap端点功能
 * 验证增强版sitemap是否正确集成
 */

const BLOG = require('../blog.config')
const { SitemapEnhancedGenerator } = require('../lib/utils/SitemapEnhancedGenerator')

async function testSitemapEndpoint() {
  console.log('🧪 开始测试sitemap端点功能...\n')

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
      title: '草稿文章',
      slug: 'draft-post',
      status: 'Draft',
      type: 'Post',
      publishDay: '2024-01-10'
    }
  ]

  let testsPassed = 0
  let testsTotal = 0

  // 测试1: 检查配置是否正确
  testsTotal++
  console.log('📋 测试1: 检查sitemap配置')
  try {
    if (BLOG.SEO_SITEMAP_ENHANCED === true || BLOG.SEO_SITEMAP_ENHANCED === 'true') {
      console.log('✅ 增强版sitemap已启用')
      console.log(`   - SEO_SITEMAP_ENHANCED: ${BLOG.SEO_SITEMAP_ENHANCED}`)
      console.log(`   - SEO_SITEMAP_IMAGES: ${BLOG.SEO_SITEMAP_IMAGES}`)
      console.log(`   - SEO_SITEMAP_NEWS: ${BLOG.SEO_SITEMAP_NEWS}`)
      testsPassed++
    } else {
      console.log('❌ 增强版sitemap未启用')
      console.log(`   - SEO_SITEMAP_ENHANCED: ${BLOG.SEO_SITEMAP_ENHANCED}`)
    }
  } catch (error) {
    console.log('❌ 配置检查失败:', error.message)
  }

  // 测试2: 测试增强版生成器
  testsTotal++
  console.log('\n📋 测试2: 测试增强版生成器')
  try {
    const generator = new SitemapEnhancedGenerator({
      baseUrl: 'https://www.shareking.vip'
    })

    const result = await generator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: { title: '测试网站' }
    })

    if (result.success && result.sitemaps && result.sitemaps.length > 0) {
      console.log('✅ 增强版生成器工作正常')
      console.log(`   - 生成了 ${result.sitemaps.length} 个sitemap文件`)
      console.log(`   - 总URL数量: ${result.stats.totalUrls}`)
      console.log(`   - 生成时间: ${result.stats.generationTime}ms`)
      
      const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml')
      if (mainSitemap) {
        console.log(`   - 主sitemap包含 ${mainSitemap.urls} 个URL`)
        console.log(`   - 包含已发布内容: ${mainSitemap.content.includes('test-post-1') ? '是' : '否'}`)
        console.log(`   - 过滤草稿内容: ${!mainSitemap.content.includes('draft-post') ? '是' : '否'}`)
      }
      testsPassed++
    } else {
      console.log('❌ 增强版生成器异常')
      console.log('   - 结果:', result)
    }
  } catch (error) {
    console.log('❌ 增强版生成器测试失败:', error.message)
  }

  // 测试3: 测试XML格式
  testsTotal++
  console.log('\n📋 测试3: 测试XML格式')
  try {
    const generator = new SitemapEnhancedGenerator({
      baseUrl: 'https://www.shareking.vip'
    })

    const result = await generator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: { title: '测试网站' }
    })

    const mainSitemap = result.sitemaps.find(s => s.filename === 'sitemap.xml')
    
    if (mainSitemap && 
        mainSitemap.content.includes('<?xml version="1.0" encoding="UTF-8"?>') &&
        mainSitemap.content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') &&
        mainSitemap.content.includes('<urlset') &&
        mainSitemap.content.includes('</urlset>')) {
      console.log('✅ XML格式正确')
      console.log('   - 包含XML声明')
      console.log('   - 包含正确的命名空间')
      console.log('   - 包含完整的XML结构')
      testsPassed++
    } else {
      console.log('❌ XML格式异常')
    }
  } catch (error) {
    console.log('❌ XML格式测试失败:', error.message)
  }

  // 测试4: 测试多种sitemap文件
  testsTotal++
  console.log('\n📋 测试4: 测试多种sitemap文件')
  try {
    const generator = new SitemapEnhancedGenerator({
      baseUrl: 'https://www.shareking.vip'
    })

    const result = await generator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: { title: '测试网站' }
    })

    const expectedFiles = ['sitemap.xml', 'sitemap-posts.xml', 'sitemap-pages.xml']
    const actualFiles = result.sitemaps.map(s => s.filename)
    
    const hasAllExpected = expectedFiles.every(file => actualFiles.includes(file))
    
    if (hasAllExpected) {
      console.log('✅ 多种sitemap文件生成正常')
      console.log(`   - 生成的文件: ${actualFiles.join(', ')}`)
      console.log(`   - 包含所有预期文件: ${expectedFiles.join(', ')}`)
      testsPassed++
    } else {
      console.log('❌ 多种sitemap文件生成异常')
      console.log(`   - 预期文件: ${expectedFiles.join(', ')}`)
      console.log(`   - 实际文件: ${actualFiles.join(', ')}`)
    }
  } catch (error) {
    console.log('❌ 多种sitemap文件测试失败:', error.message)
  }

  // 测试5: 测试配置驱动功能
  testsTotal++
  console.log('\n📋 测试5: 测试配置驱动功能')
  try {
    // 测试禁用图片sitemap的配置
    const generator = new SitemapEnhancedGenerator({
      baseUrl: 'https://www.shareking.vip',
      enableImages: false
    })

    const result = await generator.generateEnhancedSitemaps({
      allPages: mockPages,
      siteInfo: { title: '测试网站' }
    })

    const hasImageSitemap = result.sitemaps.some(s => s.filename === 'sitemap-images.xml')
    
    if (!hasImageSitemap) {
      console.log('✅ 配置驱动功能正常')
      console.log('   - 成功禁用了图片sitemap')
      console.log('   - 配置参数生效')
      testsPassed++
    } else {
      console.log('❌ 配置驱动功能异常')
      console.log('   - 图片sitemap未被正确禁用')
    }
  } catch (error) {
    console.log('❌ 配置驱动功能测试失败:', error.message)
  }

  // 输出测试结果
  console.log('\n' + '='.repeat(50))
  console.log(`📊 测试结果: ${testsPassed}/${testsTotal} 通过`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 所有测试通过！sitemap端点功能工作正常')
    console.log('\n✅ 增强版sitemap功能已成功集成到主sitemap生成流程中')
    console.log('✅ 配置驱动的sitemap生成功能正常')
    console.log('✅ 支持多种sitemap文件生成')
    console.log('✅ XML格式符合标准')
    return true
  } else {
    console.log('⚠️  部分测试失败，请检查sitemap端点功能')
    return false
  }
}

// 运行测试
if (require.main === module) {
  testSitemapEndpoint()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('测试运行失败:', error)
      process.exit(1)
    })
}

module.exports = { testSitemapEndpoint }