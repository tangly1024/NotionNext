/**
 * SEO测试工具
 * 用于测试和验证SEO优化效果
 */

import {
  generateArticleSchema,
  generateWebsiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  validateSchema,
  validateMultipleSchemas
} from './structuredData'

import {
  optimizeMetaDescription,
  optimizePageTitle,
  generateCanonicalUrl,
  validateMetaDescription
} from './seoUtils'

/**
 * 全面的SEO测试套件
 * @param {Object} pageData 页面数据
 * @param {Object} siteInfo 网站信息
 * @returns {Object} 测试结果
 */
export function runSEOTest(pageData, siteInfo) {
  const baseUrl = siteInfo?.link || 'https://example.com'
  const results = {
    overall: {
      score: 0,
      grade: 'F',
      issues: [],
      recommendations: []
    },
    metaTags: testMetaTags(pageData, siteInfo),
    structuredData: testStructuredData(pageData, siteInfo, baseUrl),
    technicalSEO: testTechnicalSEO(pageData, siteInfo, baseUrl),
    performance: testPerformance(pageData),
    accessibility: testAccessibility(pageData)
  }
  
  // 计算总分
  const scores = [
    results.metaTags.score,
    results.structuredData.score,
    results.technicalSEO.score,
    results.performance.score,
    results.accessibility.score
  ]
  
  results.overall.score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  results.overall.grade = getGrade(results.overall.score)
  
  // 收集所有问题和建议
  Object.values(results).forEach(section => {
    if (section.issues) {
      results.overall.issues.push(...section.issues)
    }
    if (section.recommendations) {
      results.overall.recommendations.push(...section.recommendations)
    }
  })
  
  return results
}

/**
 * 测试Meta标签
 * @param {Object} pageData 页面数据
 * @param {Object} siteInfo 网站信息
 * @returns {Object} Meta标签测试结果
 */
function testMetaTags(pageData, siteInfo) {
  const result = {
    score: 100,
    issues: [],
    recommendations: [],
    details: {}
  }
  
  // 测试标题
  const title = pageData.title || siteInfo?.title
  const optimizedTitle = optimizePageTitle(title, siteInfo?.title)
  
  result.details.title = {
    original: title,
    optimized: optimizedTitle,
    length: optimizedTitle?.length || 0,
    isOptimal: optimizedTitle && optimizedTitle.length <= 60
  }
  
  if (!title) {
    result.issues.push('缺少页面标题')
    result.score -= 30
  } else if (title.length > 60) {
    result.issues.push('标题过长，可能被搜索引擎截断')
    result.score -= 15
  } else if (title.length < 30) {
    result.recommendations.push('标题较短，建议增加描述性内容')
    result.score -= 5
  }
  
  // 测试描述
  const description = pageData.description || pageData.summary
  const optimizedDescription = optimizeMetaDescription(description)
  const descValidation = validateMetaDescription(optimizedDescription)
  
  result.details.description = {
    original: description,
    optimized: optimizedDescription,
    length: optimizedDescription?.length || 0,
    validation: descValidation
  }
  
  if (!description) {
    result.issues.push('缺少meta描述')
    result.score -= 25
  } else if (!descValidation.isValid) {
    result.issues.push(...descValidation.issues)
    result.score -= 15
  }
  
  // 测试关键词
  const keywords = pageData.keywords || pageData.tags
  result.details.keywords = {
    count: keywords?.length || 0,
    keywords: keywords || []
  }
  
  if (!keywords || keywords.length === 0) {
    result.recommendations.push('建议添加相关关键词')
    result.score -= 10
  } else if (keywords.length > 10) {
    result.issues.push('关键词过多，可能被视为关键词堆砌')
    result.score -= 10
  }
  
  // 测试图片
  const image = pageData.image || pageData.pageCover
  result.details.image = {
    hasImage: !!image,
    url: image
  }
  
  if (!image) {
    result.recommendations.push('建议添加页面封面图片以改善社交媒体分享效果')
    result.score -= 5
  }
  
  return result
}

/**
 * 测试结构化数据
 * @param {Object} pageData 页面数据
 * @param {Object} siteInfo 网站信息
 * @param {string} baseUrl 基础URL
 * @returns {Object} 结构化数据测试结果
 */
function testStructuredData(pageData, siteInfo, baseUrl) {
  const result = {
    score: 100,
    issues: [],
    recommendations: [],
    schemas: []
  }
  
  try {
    // 生成结构化数据
    const schemas = []
    
    if (pageData.type === 'Post' || pageData.type === 'article') {
      const articleSchema = generateArticleSchema(pageData, siteInfo, baseUrl)
      if (articleSchema) {
        schemas.push(articleSchema)
      }
    }
    
    if (pageData.type === 'website' || !pageData.type) {
      const websiteSchema = generateWebsiteSchema(siteInfo, baseUrl)
      const orgSchema = generateOrganizationSchema(siteInfo, baseUrl)
      
      if (websiteSchema) schemas.push(websiteSchema)
      if (orgSchema) schemas.push(orgSchema)
    }
    
    if (pageData.breadcrumbs && pageData.breadcrumbs.length > 0) {
      const breadcrumbSchema = generateBreadcrumbSchema(pageData.breadcrumbs, baseUrl)
      if (breadcrumbSchema) schemas.push(breadcrumbSchema)
    }
    
    // 验证结构化数据
    const validation = validateMultipleSchemas(schemas)
    
    result.schemas = schemas
    result.validation = validation
    
    if (validation.invalidCount > 0) {
      result.issues.push(`${validation.invalidCount}个结构化数据存在错误`)
      result.score -= validation.invalidCount * 20
    }
    
    if (validation.warningCount > 0) {
      result.recommendations.push(`${validation.warningCount}个结构化数据可以优化`)
      result.score -= validation.warningCount * 5
    }
    
    if (schemas.length === 0) {
      result.issues.push('未生成任何结构化数据')
      result.score -= 30
    }
    
  } catch (error) {
    result.issues.push(`结构化数据生成失败: ${error.message}`)
    result.score -= 50
  }
  
  return result
}

/**
 * 测试技术SEO
 * @param {Object} pageData 页面数据
 * @param {Object} siteInfo 网站信息
 * @param {string} baseUrl 基础URL
 * @returns {Object} 技术SEO测试结果
 */
function testTechnicalSEO(pageData, siteInfo, baseUrl) {
  const result = {
    score: 100,
    issues: [],
    recommendations: [],
    details: {}
  }
  
  // 测试Canonical URL
  const canonicalUrl = generateCanonicalUrl(baseUrl, pageData.slug)
  result.details.canonical = {
    url: canonicalUrl,
    isValid: !!canonicalUrl && canonicalUrl.startsWith('http')
  }
  
  if (!result.details.canonical.isValid) {
    result.issues.push('Canonical URL格式不正确')
    result.score -= 15
  }
  
  // 测试URL结构
  const slug = pageData.slug
  result.details.url = {
    slug: slug,
    isClean: slug && !slug.includes('?') && !slug.includes('#'),
    hasKeywords: slug && pageData.keywords?.some(keyword => 
      slug.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  
  if (!result.details.url.isClean) {
    result.recommendations.push('建议使用简洁的URL结构')
    result.score -= 5
  }
  
  if (!result.details.url.hasKeywords) {
    result.recommendations.push('建议在URL中包含相关关键词')
    result.score -= 5
  }
  
  // 测试多语言支持
  result.details.i18n = {
    hasMultipleLanguages: false, // 这里可以根据实际情况检测
    hasHreflang: false // 这里可以检测是否有hreflang标签
  }
  
  // 测试robots指令
  result.details.robots = {
    directive: 'index, follow', // 默认值
    isIndexable: true
  }
  
  return result
}

/**
 * 测试性能相关SEO因素
 * @param {Object} pageData 页面数据
 * @returns {Object} 性能测试结果
 */
function testPerformance(pageData) {
  const result = {
    score: 100,
    issues: [],
    recommendations: [],
    details: {}
  }
  
  // 测试图片优化
  const images = pageData.images || []
  result.details.images = {
    total: images.length,
    withAlt: images.filter(img => img.alt).length,
    optimized: images.filter(img => 
      img.src && (img.src.includes('.webp') || img.src.includes('.avif'))
    ).length
  }
  
  if (result.details.images.withAlt < result.details.images.total) {
    result.issues.push('部分图片缺少alt属性')
    result.score -= 10
  }
  
  if (result.details.images.optimized < result.details.images.total) {
    result.recommendations.push('建议使用WebP或AVIF格式优化图片')
    result.score -= 5
  }
  
  // 测试内容长度
  const contentLength = pageData.content?.length || 0
  result.details.content = {
    length: contentLength,
    isAdequate: contentLength > 300
  }
  
  if (!result.details.content.isAdequate) {
    result.recommendations.push('内容较短，建议增加更多有价值的内容')
    result.score -= 10
  }
  
  return result
}

/**
 * 测试可访问性
 * @param {Object} pageData 页面数据
 * @returns {Object} 可访问性测试结果
 */
function testAccessibility(pageData) {
  const result = {
    score: 100,
    issues: [],
    recommendations: [],
    details: {}
  }
  
  // 测试标题层级
  const headings = pageData.headings || []
  result.details.headings = {
    hasH1: headings.some(h => h.level === 1),
    structure: headings.map(h => ({ level: h.level, text: h.text }))
  }
  
  if (!result.details.headings.hasH1) {
    result.issues.push('页面缺少H1标题')
    result.score -= 15
  }
  
  // 检查标题层级是否合理
  let prevLevel = 0
  let hasSkippedLevel = false
  headings.forEach(heading => {
    if (heading.level > prevLevel + 1) {
      hasSkippedLevel = true
    }
    prevLevel = heading.level
  })
  
  if (hasSkippedLevel) {
    result.recommendations.push('标题层级建议按顺序递进（H1->H2->H3）')
    result.score -= 5
  }
  
  // 测试链接
  const links = pageData.links || []
  result.details.links = {
    total: links.length,
    withText: links.filter(link => link.text && link.text.trim()).length,
    internal: links.filter(link => link.internal).length,
    external: links.filter(link => !link.internal).length
  }
  
  if (result.details.links.withText < result.details.links.total) {
    result.issues.push('部分链接缺少描述性文本')
    result.score -= 10
  }
  
  return result
}

/**
 * 根据分数获取等级
 * @param {number} score 分数
 * @returns {string} 等级
 */
function getGrade(score) {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

/**
 * 生成SEO报告
 * @param {Object} testResults 测试结果
 * @returns {string} HTML格式的报告
 */
export function generateSEOReport(testResults) {
  const { overall, metaTags, structuredData, technicalSEO, performance, accessibility } = testResults
  
  return `
    <div class="seo-report">
      <div class="overall-score">
        <h2>总体SEO评分</h2>
        <div class="score-circle">
          <span class="score">${overall.score}</span>
          <span class="grade">${overall.grade}</span>
        </div>
      </div>
      
      <div class="sections">
        <div class="section">
          <h3>Meta标签 (${metaTags.score}/100)</h3>
          <div class="details">
            <p><strong>标题:</strong> ${metaTags.details.title?.optimized || '未设置'}</p>
            <p><strong>描述:</strong> ${metaTags.details.description?.optimized || '未设置'}</p>
            <p><strong>关键词数量:</strong> ${metaTags.details.keywords?.count || 0}</p>
          </div>
          ${metaTags.issues.length > 0 ? `
            <div class="issues">
              <h4>问题:</h4>
              <ul>${metaTags.issues.map(issue => `<li>${issue}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </div>
        
        <div class="section">
          <h3>结构化数据 (${structuredData.score}/100)</h3>
          <div class="details">
            <p><strong>Schema数量:</strong> ${structuredData.schemas?.length || 0}</p>
            <p><strong>有效Schema:</strong> ${structuredData.validation?.validCount || 0}</p>
            <p><strong>错误Schema:</strong> ${structuredData.validation?.invalidCount || 0}</p>
          </div>
        </div>
        
        <div class="section">
          <h3>技术SEO (${technicalSEO.score}/100)</h3>
          <div class="details">
            <p><strong>Canonical URL:</strong> ${technicalSEO.details.canonical?.url || '未设置'}</p>
            <p><strong>URL结构:</strong> ${technicalSEO.details.url?.isClean ? '良好' : '需优化'}</p>
          </div>
        </div>
        
        <div class="section">
          <h3>性能优化 (${performance.score}/100)</h3>
          <div class="details">
            <p><strong>图片总数:</strong> ${performance.details.images?.total || 0}</p>
            <p><strong>有Alt属性:</strong> ${performance.details.images?.withAlt || 0}</p>
            <p><strong>内容长度:</strong> ${performance.details.content?.length || 0} 字符</p>
          </div>
        </div>
        
        <div class="section">
          <h3>可访问性 (${accessibility.score}/100)</h3>
          <div class="details">
            <p><strong>有H1标题:</strong> ${accessibility.details.headings?.hasH1 ? '是' : '否'}</p>
            <p><strong>链接总数:</strong> ${accessibility.details.links?.total || 0}</p>
          </div>
        </div>
      </div>
      
      ${overall.recommendations.length > 0 ? `
        <div class="recommendations">
          <h3>优化建议</h3>
          <ul>${overall.recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>
        </div>
      ` : ''}
    </div>
  `
}

/**
 * 测试示例数据
 * @returns {Object} 示例测试结果
 */
export function getTestExample() {
  const samplePageData = {
    title: '如何优化网站SEO - 完整指南',
    description: '学习网站SEO优化的最佳实践，包括关键词研究、内容优化、技术SEO等方面的详细指导。',
    keywords: ['SEO优化', '网站优化', '搜索引擎', '关键词研究'],
    type: 'Post',
    slug: 'seo-optimization-guide',
    image: '/images/seo-guide.jpg',
    content: '这是一篇关于SEO优化的详细文章内容...',
    headings: [
      { level: 1, text: '如何优化网站SEO' },
      { level: 2, text: '关键词研究' },
      { level: 2, text: '内容优化' },
      { level: 3, text: '标题优化' }
    ],
    links: [
      { text: '了解更多SEO技巧', internal: true },
      { text: 'Google SEO指南', internal: false }
    ],
    breadcrumbs: [
      { name: '首页', url: '/' },
      { name: 'SEO教程', url: '/seo' },
      { name: '优化指南', url: '/seo/optimization-guide' }
    ]
  }
  
  const sampleSiteInfo = {
    title: '分享之王',
    description: '专注于分享高价值资源的网站',
    link: 'https://www.shareking.vip',
    author: '分享之王',
    icon: '/favicon.ico'
  }
  
  return runSEOTest(samplePageData, sampleSiteInfo)
}