#!/usr/bin/env node

/**
 * 模拟sitemap.xml.js的核心生成逻辑测试
 * 验证增强版sitemap集成是否正确工作
 */

const BLOG = require('../blog.config')
const { SitemapEnhancedGenerator } = require('../lib/utils/SitemapEnhancedGenerator')
const { SitemapErrorHandler } = require('../lib/utils/SitemapErrorHandler')
const { XMLFormatter } = require('../lib/utils/XMLFormatter')
const { URLValidator } = require('../lib/utils/URLValidator')

// 模拟sitemap.xml.js中的核心生成逻辑
async function simulateSitemapGeneration() {
  console.log('🧪 模拟sitemap.xml.js生成逻辑...\n')

  const baseUrl = 'https://www.shareking.vip'
  
  // 初始化组件（模拟sitemap.xml.js中的初始化）
  const errorHandler = new SitemapErrorHandler({ baseUrl })
  const urlValidator = new URLValidator({ baseUrl })
  const xmlFormatter = new XMLFormatter({ 
    baseUrl,
    maxUrls: 50000,
    enableValidation: true,
    prettyPrint: false
  })

  // 模拟页面数据
  const mockSiteData = [{
    allPages: [
      {
        id: '1',
        title: '测试文章1',
        slug: 'test-post-1',
        status: 'Published',
        type: 'Post',
        publishDay: '2024-01-01',
        category: '技术分享',
        tags: ['JavaScript']
      },
      {
        id: '2',
        title: '测试页面1',
        slug: 'test-page-1',
        status: 'Published',
        type: 'Page',
        publishDay: '2024-01-05'
      },
      {
        id: '3',
        title: '草稿文章',
        slug: 'draft-post',
        status: 'Draft',
        type: 'Post',
        publishDay: '2024-01-10'
      }
    ],
    siteInfo: { title: '测试网站' },
    locale: '',
    siteId: 'main'
  }]

  let testsPassed = 0
  let testsTotal = 0

  // 测试1: 检查增强版sitemap是否启用
  testsTotal++
  console.log('📋 测试1: 检查增强版sitemap配置')
  try {
    if (BLOG.SEO_SITEMAP_ENHANCED) {
      console.log('✅ 增强版sitemap已启用')
      console.log(`   - 配置值: ${BLOG.SEO_SITEMAP_ENHANCED}`)
      testsPassed++
    } else {
      console.log('❌ 增强版sitemap未启用')
    }
  } catch (error) {
    console.log('❌ 配置检查失败:', error.message)
  }

  // 测试2: 模拟增强版生成流程
  testsTotal++
  console.log('\n📋 测试2: 模拟增强版生成流程')
  try {
    // 合并所有站点的页面数据（模拟sitemap.xml.js中的逻辑）
    const allPages = []
    mockSiteData.forEach(siteData => {
      if (siteData.allPages) {
        const pagesWithLocale = siteData.allPages.map(page => ({
          ...page,
          locale: siteData.locale
        }))
        allPages.push(...pagesWithLocale)
      }
    })

    // 检查是否启用增强版sitemap（模拟sitemap.xml.js中的条件判断）
    if (BLOG.SEO_SITEMAP_ENHANCED) {
      // 使用增强版生成器
      const enhancedGenerator = new SitemapEnhancedGenerator({ baseUrl })
      const enhancedResult = await enhancedGenerator.generateEnhancedSitemaps({
        allPages,
        siteInfo: mockSiteData[0]?.siteInfo
      })

      if (enhancedResult.success) {
        // 返回主sitemap（向后兼容）
        const mainSitemap = enhancedResult.sitemaps.find(s => s.filename === 'sitemap.xml')
        
        console.log('✅ 增强版生成流程正常')
        console.log(`   - 生成了 ${enhancedResult.sitemaps.length} 个sitemap文件`)
        console.log(`   - 总URL数量: ${enhancedResult.stats.totalUrls}`)
        console.log(`   - 生成时间: ${enhancedResult.stats.generationTime}ms`)
        console.log(`   - 主sitemap包含 ${mainSitemap.urls} 个URL`)
        
        // 验证内容过滤
        const xmlContent = mainSitemap.content
        const hasPublished = xmlContent.includes('test-post-1')
        const noDrafts = !xmlContent.includes('draft-post')
        
        console.log(`   - 包含已发布内容: ${hasPublished ? '是' : '否'}`)
        console.log(`   - 过滤草稿内容: ${noDrafts ? '是' : '否'}`)
        
        if (hasPublished && noDrafts) {
          testsPassed++
        } else {
          console.log('   ⚠️ 内容过滤有问题')
        }
      } else {
        console.log('❌ 增强版生成失败')
        console.log(`   - 错误: ${enhancedResult.error}`)
      }
    } else {
      console.log('❌ 增强版sitemap未启用，跳过测试')
    }
  } catch (error) {
    console.log('❌ 增强版生成流程测试失败:', error.message)
  }

  // 测试3: 测试降级机制
  testsTotal++
  console.log('\n📋 测试3: 测试降级机制')
  try {
    // 模拟增强版生成失败的情况
    console.log('   模拟增强版生成失败，测试降级到标准生成...')
    
    // 标准生成流程（模拟sitemap.xml.js中的降级逻辑）
    let allUrls = []
    
    mockSiteData.forEach(siteData => {
      try {
        // 模拟generateSitemapUrls函数
        const currentDate = new Date().toISOString().split('T')[0]
        
        // 基础页面
        const urls = [
          {
            loc: `${baseUrl}`,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: '1.0'
          }
        ]

        // 添加文章页面
        if (siteData.allPages) {
          siteData.allPages
            .filter(p => {
              return p.status === 'Published' &&
                     p.slug &&
                     p.publishDay &&
                     urlValidator.isValidSlug(p.slug)
            })
            .forEach(post => {
              const generatedUrl = urlValidator.generateURL(post.slug, siteData.locale)
              
              if (generatedUrl) {
                urls.push({
                  loc: generatedUrl,
                  lastmod: new Date(post.publishDay).toISOString().split('T')[0],
                  changefreq: 'weekly',
                  priority: '0.8'
                })
              }
            })
        }

        allUrls = allUrls.concat(urls)
      } catch (processingError) {
        console.log(`   处理站点数据时出错: ${processingError.message}`)
      }
    })

    // 使用URLValidator进行去重和验证
    const validationResult = urlValidator.validateURLList(allUrls)
    const uniqueUrls = urlValidator.deduplicateURLs(validationResult.valid)

    // 使用XMLFormatter生成XML
    const xmlResult = xmlFormatter.generateSitemapXML(uniqueUrls)
    
    if (xmlResult.success) {
      console.log('✅ 降级机制正常')
      console.log(`   - 生成了 ${xmlResult.stats.urlsProcessed} 个URL`)
      console.log(`   - XML大小: ${xmlResult.stats.xmlSize} 字节`)
      console.log(`   - 生成时间: ${xmlResult.stats.generationTime}ms`)
      
      // 验证XML格式
      const hasXmlDeclaration = xmlResult.xml.includes('<?xml version="1.0" encoding="UTF-8"?>')
      const hasUrlset = xmlResult.xml.includes('<urlset')
      
      if (hasXmlDeclaration && hasUrlset) {
        console.log('   - XML格式正确')
        testsPassed++
      } else {
        console.log('   ⚠️ XML格式有问题')
      }
    } else {
      console.log('❌ 降级机制失败')
      console.log(`   - 错误: ${xmlResult.error}`)
    }
  } catch (error) {
    console.log('❌ 降级机制测试失败:', error.message)
  }

  // 测试4: 测试响应头设置
  testsTotal++
  console.log('\n📋 测试4: 测试响应头设置')
  try {
    // 模拟响应对象
    const mockRes = {
      headers: {},
      setHeader: function(name, value) {
        this.headers[name] = value
      }
    }

    // 测试XMLFormatter的响应头设置
    xmlFormatter.setOptimalResponseHeaders(mockRes, { 
      isFallback: false,
      fromCache: false 
    })

    const expectedHeaders = [
      'Content-Type',
      'Cache-Control',
      'X-Robots-Tag'
    ]

    const hasAllHeaders = expectedHeaders.every(header => 
      mockRes.headers.hasOwnProperty(header)
    )

    if (hasAllHeaders) {
      console.log('✅ 响应头设置正常')
      console.log(`   - Content-Type: ${mockRes.headers['Content-Type']}`)
      console.log(`   - Cache-Control: ${mockRes.headers['Cache-Control']}`)
      console.log(`   - X-Robots-Tag: ${mockRes.headers['X-Robots-Tag']}`)
      testsPassed++
    } else {
      console.log('❌ 响应头设置异常')
      console.log('   - 缺少必要的响应头')
    }
  } catch (error) {
    console.log('❌ 响应头设置测试失败:', error.message)
  }

  // 输出测试结果
  console.log('\n' + '='.repeat(50))
  console.log(`📊 测试结果: ${testsPassed}/${testsTotal} 通过`)
  
  if (testsPassed === testsTotal) {
    console.log('🎉 所有测试通过！sitemap生成逻辑工作正常')
    console.log('\n✅ 增强版sitemap功能已正确集成')
    console.log('✅ 降级机制工作正常')
    console.log('✅ 响应头设置正确')
    console.log('✅ 内容过滤功能正常')
    return true
  } else {
    console.log('⚠️  部分测试失败，请检查sitemap生成逻辑')
    return false
  }
}

// 运行测试
if (require.main === module) {
  simulateSitemapGeneration()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(error => {
      console.error('测试运行失败:', error)
      process.exit(1)
    })
}

module.exports = { simulateSitemapGeneration }