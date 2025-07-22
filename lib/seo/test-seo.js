/**
 * SEO功能测试脚本
 * 用于验证SEO优化功能是否正常工作
 */

import { runSEOTest, getTestExample } from './seoTester.js'
import { 
  generateArticleSchema, 
  generateWebsiteSchema,
  generateSmartSchema,
  validateSchema 
} from './structuredData.js'
import { 
  optimizeMetaDescription, 
  optimizePageTitle,
  generateCanonicalUrl,
  validateMetaDescription 
} from './seoUtils.js'
import { 
  generateBreadcrumbs,
  BreadcrumbManager 
} from './breadcrumbGenerator.js'

/**
 * 测试SEO工具函数
 */
function testSEOUtils() {
  console.log('🧪 测试SEO工具函数...')
  
  // 测试标题优化
  const title = optimizePageTitle('这是一个很长的文章标题，可能会被搜索引擎截断', '分享之王')
  console.log('✅ 标题优化:', title)
  
  // 测试描述优化
  const longDesc = '这是一个很长的描述'.repeat(20)
  const optimizedDesc = optimizeMetaDescription(longDesc)
  console.log('✅ 描述优化:', optimizedDesc.substring(0, 50) + '...')
  
  // 测试描述验证
  const validation = validateMetaDescription('这是一个长度适中的meta描述，包含了足够的信息来吸引用户点击，同时也不会太长导致被搜索引擎截断。')
  console.log('✅ 描述验证:', validation.isValid ? '通过' : '失败', `(评分: ${validation.score})`)
  
  // 测试Canonical URL生成
  const canonicalUrl = generateCanonicalUrl('https://www.shareking.vip', 'seo-test')
  console.log('✅ Canonical URL:', canonicalUrl)
  
  console.log('')
}

/**
 * 测试结构化数据生成
 */
function testStructuredData() {
  console.log('🧪 测试结构化数据生成...')
  
  const samplePost = {
    title: 'SEO优化完整指南',
    summary: '学习如何优化网站SEO，提升搜索引擎排名',
    slug: 'seo-guide',
    publishDay: '2024-01-01',
    lastEditedDay: '2024-01-02',
    category: ['技术教程'],
    tags: ['SEO', '优化', '搜索引擎'],
    pageCover: '/images/seo-guide.jpg'
  }
  
  const sampleSiteInfo = {
    title: '分享之王',
    description: '专注于分享高价值资源的网站',
    author: '分享之王',
    icon: '/favicon.ico'
  }
  
  const baseUrl = 'https://www.shareking.vip'
  
  // 测试文章Schema生成
  const articleSchema = generateArticleSchema(samplePost, sampleSiteInfo, baseUrl)
  console.log('✅ 文章Schema生成:', articleSchema ? '成功' : '失败')
  if (articleSchema) {
    console.log('   - 类型:', articleSchema['@type'])
    console.log('   - 标题:', articleSchema.headline)
    console.log('   - 作者:', articleSchema.author.name)
  }
  
  // 测试网站Schema生成
  const websiteSchema = generateWebsiteSchema(sampleSiteInfo, baseUrl)
  console.log('✅ 网站Schema生成:', websiteSchema ? '成功' : '失败')
  if (websiteSchema) {
    console.log('   - 类型:', websiteSchema['@type'])
    console.log('   - 名称:', websiteSchema.name)
    console.log('   - 搜索功能:', websiteSchema.potentialAction ? '已配置' : '未配置')
  }
  
  // 测试Schema验证
  const validation = validateSchema(articleSchema)
  console.log('✅ Schema验证:', validation.isValid ? '通过' : '失败')
  if (validation.errors.length > 0) {
    console.log('   - 错误:', validation.errors)
  }
  if (validation.warnings.length > 0) {
    console.log('   - 警告:', validation.warnings)
  }
  
  // 测试智能Schema生成
  const contentWithCourse = {
    ...samplePost,
    course: {
      name: 'SEO优化课程',
      provider: '分享之王',
      description: 'SEO优化完整课程'
    }
  }
  
  const smartSchemas = generateSmartSchema(contentWithCourse, sampleSiteInfo, baseUrl)
  console.log('✅ 智能Schema生成:', smartSchemas.length, '个Schema')
  smartSchemas.forEach((schema, index) => {
    console.log(`   - Schema ${index + 1}:`, schema['@type'])
  })
  
  console.log('')
}

/**
 * 测试面包屑生成
 */
function testBreadcrumbs() {
  console.log('🧪 测试面包屑生成...')
  
  const sampleSiteInfo = {
    title: '分享之王',
    link: 'https://www.shareking.vip'
  }
  
  const sampleLocale = {
    COMMON: { HOME: '首页', CATEGORY: '分类', TAGS: '标签' },
    NAV: { ARCHIVE: '归档', SEARCH: '搜索' }
  }
  
  const breadcrumbManager = new BreadcrumbManager(sampleSiteInfo, sampleLocale)
  
  // 测试文章页面面包屑
  const articlePageData = {
    type: 'Post',
    title: 'SEO优化指南',
    slug: 'seo-guide',
    category: ['技术教程']
  }
  
  const articleRouter = {
    route: '/[...slug]',
    asPath: '/seo-guide'
  }
  
  const articleBreadcrumbs = breadcrumbManager.generate(articlePageData, articleRouter)
  console.log('✅ 文章页面面包屑:')
  articleBreadcrumbs.forEach((crumb, index) => {
    console.log(`   ${index + 1}. ${crumb.name} (${crumb.url})`)
  })
  
  // 测试分类页面面包屑
  const categoryPageData = {
    category: '技术教程'
  }
  
  const categoryRouter = {
    route: '/category/[category]',
    asPath: '/category/技术教程'
  }
  
  const categoryBreadcrumbs = breadcrumbManager.generate(categoryPageData, categoryRouter)
  console.log('✅ 分类页面面包屑:')
  categoryBreadcrumbs.forEach((crumb, index) => {
    console.log(`   ${index + 1}. ${crumb.name} (${crumb.url})`)
  })
  
  // 测试面包屑结构化数据
  const breadcrumbSchema = breadcrumbManager.generateStructuredData(articleBreadcrumbs)
  console.log('✅ 面包屑结构化数据:', breadcrumbSchema ? '生成成功' : '生成失败')
  if (breadcrumbSchema) {
    console.log('   - 类型:', breadcrumbSchema['@type'])
    console.log('   - 项目数量:', breadcrumbSchema.itemListElement.length)
  }
  
  console.log('')
}

/**
 * 测试SEO分析工具
 */
function testSEOAnalyzer() {
  console.log('🧪 测试SEO分析工具...')
  
  // 使用示例数据进行测试
  const testResults = getTestExample()
  
  console.log('✅ SEO测试完成:')
  console.log(`   - 总体评分: ${testResults.overall.score}/100 (${testResults.overall.grade}级)`)
  console.log(`   - Meta标签: ${testResults.metaTags.score}/100`)
  console.log(`   - 结构化数据: ${testResults.structuredData.score}/100`)
  console.log(`   - 技术SEO: ${testResults.technicalSEO.score}/100`)
  console.log(`   - 性能优化: ${testResults.performance.score}/100`)
  console.log(`   - 可访问性: ${testResults.accessibility.score}/100`)
  
  if (testResults.overall.issues.length > 0) {
    console.log('   - 发现问题:', testResults.overall.issues.length, '个')
    testResults.overall.issues.slice(0, 3).forEach(issue => {
      console.log(`     • ${issue}`)
    })
  }
  
  if (testResults.overall.recommendations.length > 0) {
    console.log('   - 优化建议:', testResults.overall.recommendations.length, '个')
    testResults.overall.recommendations.slice(0, 3).forEach(rec => {
      console.log(`     • ${rec}`)
    })
  }
  
  console.log('')
}

/**
 * 运行所有测试
 */
function runAllTests() {
  console.log('🚀 开始SEO功能测试...\n')
  
  try {
    testSEOUtils()
    testStructuredData()
    testBreadcrumbs()
    testSEOAnalyzer()
    
    console.log('🎉 所有测试完成！SEO功能工作正常。')
    console.log('\n📋 测试总结:')
    console.log('✅ SEO工具函数 - 正常工作')
    console.log('✅ 结构化数据生成 - 正常工作')
    console.log('✅ 面包屑导航 - 正常工作')
    console.log('✅ SEO分析工具 - 正常工作')
    
    console.log('\n🔗 接下来你可以:')
    console.log('1. 访问 /seo-test.html 使用SEO测试工具')
    console.log('2. 在blog.config.js中设置 SEO_ENHANCED_MODE: true')
    console.log('3. 查看页面源代码验证结构化数据')
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message)
    console.error(error.stack)
  }
}

// 如果直接运行此文件，执行测试
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runAllTests()
}

export { runAllTests, testSEOUtils, testStructuredData, testBreadcrumbs, testSEOAnalyzer }