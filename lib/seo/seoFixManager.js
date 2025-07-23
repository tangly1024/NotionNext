/**
 * SEO问题修复管理器
 * 自动检测和修复常见的SEO问题
 */

import { siteConfig } from '@/lib/config'
import { generateImageAlt, optimizeImagesSEO, analyzeImageSEO } from './imageSEO'
import { generateArticleSchema, generateWebsiteSchema, generateBreadcrumbSchema } from './structuredData'
import { optimizeMetaDescription, optimizePageTitle, extractOptimizedKeywords } from './seoUtils'

/**
 * SEO问题类型定义
 */
export const SEO_ISSUE_TYPES = {
  MISSING_ALT: 'missing_alt',
  POOR_ALT_QUALITY: 'poor_alt_quality',
  MISSING_STRUCTURED_DATA: 'missing_structured_data',
  POOR_META_DESCRIPTION: 'poor_meta_description',
  POOR_TITLE: 'poor_title',
  MISSING_CANONICAL: 'missing_canonical',
  DUPLICATE_CONTENT: 'duplicate_content',
  POOR_KEYWORDS: 'poor_keywords',
  MISSING_BREADCRUMBS: 'missing_breadcrumbs',
  PERFORMANCE_ISSUES: 'performance_issues'
}

/**
 * 全面的SEO问题检测器
 * @param {Object} pageData - 页面数据
 * @param {Object} options - 检测选项
 * @returns {Promise<Object>} 检测结果
 */
export async function detectSEOIssues(pageData, options = {}) {
  const {
    checkImages = true,
    checkStructuredData = true,
    checkMetaTags = true,
    checkPerformance = true,
    checkContent = true
  } = options

  const issues = []
  const warnings = []
  const recommendations = []

  // 1. 检测图片SEO问题
  if (checkImages && pageData.images) {
    const imageIssues = await detectImageSEOIssues(pageData.images, pageData)
    issues.push(...imageIssues.errors)
    warnings.push(...imageIssues.warnings)
    recommendations.push(...imageIssues.recommendations)
  }

  // 2. 检测结构化数据问题
  if (checkStructuredData) {
    const structuredDataIssues = detectStructuredDataIssues(pageData)
    issues.push(...structuredDataIssues.errors)
    warnings.push(...structuredDataIssues.warnings)
    recommendations.push(...structuredDataIssues.recommendations)
  }

  // 3. 检测Meta标签问题
  if (checkMetaTags) {
    const metaIssues = detectMetaTagIssues(pageData)
    issues.push(...metaIssues.errors)
    warnings.push(...metaIssues.warnings)
    recommendations.push(...metaIssues.recommendations)
  }

  // 4. 检测内容质量问题
  if (checkContent) {
    const contentIssues = detectContentIssues(pageData)
    issues.push(...contentIssues.errors)
    warnings.push(...contentIssues.warnings)
    recommendations.push(...contentIssues.recommendations)
  }

  // 5. 检测性能问题
  if (checkPerformance) {
    const performanceIssues = detectPerformanceIssues(pageData)
    warnings.push(...performanceIssues.warnings)
    recommendations.push(...performanceIssues.recommendations)
  }

  // 计算SEO评分
  const score = calculateSEOScore(issues, warnings, recommendations)

  return {
    score,
    issues,
    warnings,
    recommendations,
    summary: generateIssueSummary(issues, warnings, recommendations),
    fixable: issues.filter(issue => issue.fixable).length,
    timestamp: new Date().toISOString()
  }
}

/**
 * 自动修复SEO问题
 * @param {Object} pageData - 页面数据
 * @param {Array} issues - 问题列表
 * @param {Object} options - 修复选项
 * @returns {Promise<Object>} 修复结果
 */
export async function autoFixSEOIssues(pageData, issues, options = {}) {
  const {
    fixImages = true,
    fixMetaTags = true,
    fixStructuredData = true,
    fixContent = true
  } = options

  const fixResults = {
    fixed: [],
    failed: [],
    skipped: [],
    updatedPageData: { ...pageData }
  }

  for (const issue of issues) {
    if (!issue.fixable) {
      fixResults.skipped.push({
        issue: issue.type,
        reason: 'Not automatically fixable'
      })
      continue
    }

    try {
      let fixResult = null

      switch (issue.type) {
        case SEO_ISSUE_TYPES.MISSING_ALT:
          if (fixImages) {
            fixResult = await fixMissingAltAttributes(fixResults.updatedPageData, issue)
          }
          break

        case SEO_ISSUE_TYPES.POOR_ALT_QUALITY:
          if (fixImages) {
            fixResult = await fixPoorAltQuality(fixResults.updatedPageData, issue)
          }
          break

        case SEO_ISSUE_TYPES.MISSING_STRUCTURED_DATA:
          if (fixStructuredData) {
            fixResult = await fixMissingStructuredData(fixResults.updatedPageData, issue)
          }
          break

        case SEO_ISSUE_TYPES.POOR_META_DESCRIPTION:
          if (fixMetaTags) {
            fixResult = await fixPoorMetaDescription(fixResults.updatedPageData, issue)
          }
          break

        case SEO_ISSUE_TYPES.POOR_TITLE:
          if (fixMetaTags) {
            fixResult = await fixPoorTitle(fixResults.updatedPageData, issue)
          }
          break

        case SEO_ISSUE_TYPES.POOR_KEYWORDS:
          if (fixContent) {
            fixResult = await fixPoorKeywords(fixResults.updatedPageData, issue)
          }
          break

        default:
          fixResults.skipped.push({
            issue: issue.type,
            reason: 'No fix handler available'
          })
          continue
      }

      if (fixResult && fixResult.success) {
        fixResults.fixed.push({
          issue: issue.type,
          description: issue.description,
          fix: fixResult.description,
          before: fixResult.before,
          after: fixResult.after
        })

        // 更新页面数据
        if (fixResult.updatedData) {
          Object.assign(fixResults.updatedPageData, fixResult.updatedData)
        }
      } else {
        fixResults.failed.push({
          issue: issue.type,
          reason: fixResult?.error || 'Unknown error'
        })
      }
    } catch (error) {
      fixResults.failed.push({
        issue: issue.type,
        reason: error.message
      })
    }
  }

  return fixResults
}

/**
 * 检测图片SEO问题
 */
async function detectImageSEOIssues(images, pageData) {
  const errors = []
  const warnings = []
  const recommendations = []

  if (!images || images.length === 0) {
    return { errors, warnings, recommendations }
  }

  const analysis = analyzeImageSEO(images)

  // 检测缺失的alt属性
  const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '')
  if (imagesWithoutAlt.length > 0) {
    errors.push({
      type: SEO_ISSUE_TYPES.MISSING_ALT,
      severity: 'high',
      description: `${imagesWithoutAlt.length} images missing alt attributes`,
      affectedImages: imagesWithoutAlt.map(img => img.src),
      fixable: true,
      impact: 'Critical for accessibility and SEO'
    })
  }

  // 检测低质量的alt属性
  const poorAltImages = images.filter(img => 
    img.alt && (
      img.alt.length < 10 || 
      img.alt.length > 125 ||
      img.alt.toLowerCase().includes('image') ||
      img.alt.toLowerCase().includes('picture') ||
      img.alt === 'Lazy loaded image'
    )
  )
  
  if (poorAltImages.length > 0) {
    warnings.push({
      type: SEO_ISSUE_TYPES.POOR_ALT_QUALITY,
      severity: 'medium',
      description: `${poorAltImages.length} images have poor quality alt attributes`,
      affectedImages: poorAltImages.map(img => ({ src: img.src, alt: img.alt })),
      fixable: true,
      impact: 'Reduces SEO effectiveness and accessibility'
    })
  }

  // 检测图片格式问题
  const oldFormatImages = images.filter(img => {
    const format = img.src.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png'].includes(format)
  })

  if (oldFormatImages.length > 0) {
    recommendations.push({
      type: 'image_format_optimization',
      severity: 'low',
      description: `${oldFormatImages.length} images could use modern formats (WebP/AVIF)`,
      affectedImages: oldFormatImages.map(img => img.src),
      fixable: false,
      impact: 'Improves loading performance'
    })
  }

  return { errors, warnings, recommendations }
}

/**
 * 检测结构化数据问题
 */
function detectStructuredDataIssues(pageData) {
  const errors = []
  const warnings = []
  const recommendations = []

  // 检查是否缺少基础结构化数据
  if (!pageData.structuredData || pageData.structuredData.length === 0) {
    errors.push({
      type: SEO_ISSUE_TYPES.MISSING_STRUCTURED_DATA,
      severity: 'high',
      description: 'Missing structured data markup',
      fixable: true,
      impact: 'Reduces search engine understanding of content'
    })
  } else {
    // 检查结构化数据质量
    const hasArticleSchema = pageData.structuredData.some(schema => 
      schema['@type'] === 'Article' || schema['@type'] === 'BlogPosting'
    )
    
    if (pageData.type === 'Post' && !hasArticleSchema) {
      warnings.push({
        type: 'missing_article_schema',
        severity: 'medium',
        description: 'Article page missing Article structured data',
        fixable: true,
        impact: 'Reduces rich snippet opportunities'
      })
    }

    const hasBreadcrumbSchema = pageData.structuredData.some(schema => 
      schema['@type'] === 'BreadcrumbList'
    )
    
    if (pageData.breadcrumbs && pageData.breadcrumbs.length > 0 && !hasBreadcrumbSchema) {
      recommendations.push({
        type: 'missing_breadcrumb_schema',
        severity: 'low',
        description: 'Breadcrumbs available but missing structured data',
        fixable: true,
        impact: 'Improves navigation understanding'
      })
    }
  }

  return { errors, warnings, recommendations }
}

/**
 * 检测Meta标签问题
 */
function detectMetaTagIssues(pageData) {
  const errors = []
  const warnings = []
  const recommendations = []

  // 检查标题质量
  if (!pageData.title || pageData.title.trim() === '') {
    errors.push({
      type: SEO_ISSUE_TYPES.POOR_TITLE,
      severity: 'high',
      description: 'Missing or empty page title',
      fixable: true,
      impact: 'Critical for SEO and user experience'
    })
  } else {
    if (pageData.title.length < 30) {
      warnings.push({
        type: SEO_ISSUE_TYPES.POOR_TITLE,
        severity: 'medium',
        description: 'Page title is too short (less than 30 characters)',
        current: pageData.title,
        fixable: true,
        impact: 'May not be descriptive enough for search engines'
      })
    } else if (pageData.title.length > 60) {
      warnings.push({
        type: SEO_ISSUE_TYPES.POOR_TITLE,
        severity: 'medium',
        description: 'Page title is too long (more than 60 characters)',
        current: pageData.title,
        fixable: true,
        impact: 'May be truncated in search results'
      })
    }
  }

  // 检查描述质量
  if (!pageData.description || pageData.description.trim() === '') {
    errors.push({
      type: SEO_ISSUE_TYPES.POOR_META_DESCRIPTION,
      severity: 'high',
      description: 'Missing or empty meta description',
      fixable: true,
      impact: 'Reduces click-through rates from search results'
    })
  } else {
    if (pageData.description.length < 120) {
      warnings.push({
        type: SEO_ISSUE_TYPES.POOR_META_DESCRIPTION,
        severity: 'medium',
        description: 'Meta description is too short (less than 120 characters)',
        current: pageData.description,
        fixable: true,
        impact: 'May not provide enough information to users'
      })
    } else if (pageData.description.length > 160) {
      warnings.push({
        type: SEO_ISSUE_TYPES.POOR_META_DESCRIPTION,
        severity: 'medium',
        description: 'Meta description is too long (more than 160 characters)',
        current: pageData.description,
        fixable: true,
        impact: 'May be truncated in search results'
      })
    }
  }

  // 检查关键词
  if (!pageData.keywords || pageData.keywords.trim() === '') {
    recommendations.push({
      type: SEO_ISSUE_TYPES.POOR_KEYWORDS,
      severity: 'low',
      description: 'Missing or empty keywords',
      fixable: true,
      impact: 'May help with content categorization'
    })
  }

  return { errors, warnings, recommendations }
}

/**
 * 检测内容质量问题
 */
function detectContentIssues(pageData) {
  const errors = []
  const warnings = []
  const recommendations = []

  // 检查内容长度
  if (pageData.content) {
    const wordCount = pageData.content.split(/\s+/).length
    
    if (wordCount < 300) {
      warnings.push({
        type: 'thin_content',
        severity: 'medium',
        description: `Content is too short (${wordCount} words, recommended: 300+)`,
        fixable: false,
        impact: 'May be considered thin content by search engines'
      })
    }
  }

  // 检查标题结构
  if (pageData.content) {
    const headings = pageData.content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []
    
    if (headings.length === 0) {
      recommendations.push({
        type: 'missing_headings',
        severity: 'low',
        description: 'Content lacks heading structure',
        fixable: false,
        impact: 'Improves content organization and SEO'
      })
    }
  }

  return { errors, warnings, recommendations }
}

/**
 * 检测性能问题
 */
function detectPerformanceIssues(pageData) {
  const warnings = []
  const recommendations = []

  // 检查图片优化
  if (pageData.images) {
    const largeImages = pageData.images.filter(img => 
      img.fileSize && img.fileSize > 500 * 1024 // 500KB
    )
    
    if (largeImages.length > 0) {
      recommendations.push({
        type: 'large_images',
        severity: 'low',
        description: `${largeImages.length} images are larger than 500KB`,
        affectedImages: largeImages.map(img => ({ src: img.src, size: img.fileSize })),
        fixable: false,
        impact: 'May slow down page loading'
      })
    }
  }

  return { warnings, recommendations }
}

/**
 * 修复缺失的alt属性
 */
async function fixMissingAltAttributes(pageData, issue) {
  try {
    const updatedImages = []
    
    for (const imageSrc of issue.affectedImages) {
      const context = {
        title: pageData.title,
        category: pageData.category,
        tags: pageData.tags,
        content: pageData.content
      }
      
      const generatedAlt = await generateImageAlt(imageSrc, context)
      
      updatedImages.push({
        src: imageSrc,
        alt: generatedAlt || 'Content image',
        generated: true
      })
    }
    
    return {
      success: true,
      description: `Generated alt attributes for ${updatedImages.length} images`,
      before: 'Missing alt attributes',
      after: `Alt attributes generated`,
      updatedData: {
        images: pageData.images?.map(img => {
          const updated = updatedImages.find(u => u.src === img.src)
          return updated ? { ...img, alt: updated.alt } : img
        })
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 修复低质量的alt属性
 */
async function fixPoorAltQuality(pageData, issue) {
  try {
    const updatedImages = []
    
    for (const imageData of issue.affectedImages) {
      const context = {
        title: pageData.title,
        category: pageData.category,
        tags: pageData.tags,
        content: pageData.content
      }
      
      const improvedAlt = await generateImageAlt(imageData.src, context)
      
      if (improvedAlt && improvedAlt !== imageData.alt) {
        updatedImages.push({
          src: imageData.src,
          oldAlt: imageData.alt,
          newAlt: improvedAlt
        })
      }
    }
    
    return {
      success: true,
      description: `Improved alt attributes for ${updatedImages.length} images`,
      before: 'Poor quality alt attributes',
      after: 'Improved alt attributes',
      updatedData: {
        images: pageData.images?.map(img => {
          const updated = updatedImages.find(u => u.src === img.src)
          return updated ? { ...img, alt: updated.newAlt } : img
        })
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 修复缺失的结构化数据
 */
async function fixMissingStructuredData(pageData, issue) {
  try {
    const schemas = []
    const baseUrl = siteConfig('LINK') || 'https://example.com'
    
    // 根据页面类型生成相应的结构化数据
    if (pageData.type === 'Post') {
      const articleSchema = generateArticleSchema(pageData, pageData.siteInfo, baseUrl)
      if (articleSchema) schemas.push(articleSchema)
    }
    
    if (pageData.breadcrumbs && pageData.breadcrumbs.length > 0) {
      const breadcrumbSchema = generateBreadcrumbSchema(pageData.breadcrumbs, baseUrl)
      if (breadcrumbSchema) schemas.push(breadcrumbSchema)
    }
    
    if (pageData.type === 'website' || !pageData.type) {
      const websiteSchema = generateWebsiteSchema(pageData.siteInfo, baseUrl)
      if (websiteSchema) schemas.push(websiteSchema)
    }
    
    return {
      success: true,
      description: `Generated ${schemas.length} structured data schemas`,
      before: 'No structured data',
      after: `${schemas.length} schemas generated`,
      updatedData: {
        structuredData: [...(pageData.structuredData || []), ...schemas]
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 修复低质量的meta描述
 */
async function fixPoorMetaDescription(pageData, issue) {
  try {
    const content = pageData.content || pageData.summary || pageData.title || ''
    const optimizedDescription = optimizeMetaDescription(content)
    
    return {
      success: true,
      description: 'Generated optimized meta description',
      before: pageData.description || 'Missing description',
      after: optimizedDescription,
      updatedData: {
        description: optimizedDescription
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 修复低质量的标题
 */
async function fixPoorTitle(pageData, issue) {
  try {
    const siteTitle = pageData.siteInfo?.title || siteConfig('TITLE')
    const optimizedTitle = optimizePageTitle(pageData.title, siteTitle)
    
    return {
      success: true,
      description: 'Optimized page title',
      before: pageData.title || 'Missing title',
      after: optimizedTitle,
      updatedData: {
        title: optimizedTitle
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 修复低质量的关键词
 */
async function fixPoorKeywords(pageData, issue) {
  try {
    const content = pageData.content || pageData.summary || pageData.title || ''
    const tags = pageData.tags || []
    const optimizedKeywords = extractOptimizedKeywords(content, tags, 10)
    
    return {
      success: true,
      description: 'Generated optimized keywords',
      before: pageData.keywords || 'Missing keywords',
      after: optimizedKeywords.join(', '),
      updatedData: {
        keywords: optimizedKeywords.join(', ')
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 计算SEO评分
 */
function calculateSEOScore(issues, warnings, recommendations) {
  let score = 100
  
  // 错误扣分
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'high':
        score -= 20
        break
      case 'medium':
        score -= 10
        break
      case 'low':
        score -= 5
        break
    }
  })
  
  // 警告扣分
  warnings.forEach(warning => {
    switch (warning.severity) {
      case 'high':
        score -= 10
        break
      case 'medium':
        score -= 5
        break
      case 'low':
        score -= 2
        break
    }
  })
  
  return Math.max(0, Math.min(100, score))
}

/**
 * 生成问题摘要
 */
function generateIssueSummary(issues, warnings, recommendations) {
  const totalIssues = issues.length + warnings.length
  const criticalIssues = issues.filter(i => i.severity === 'high').length
  const fixableIssues = [...issues, ...warnings].filter(i => i.fixable).length
  
  return {
    totalIssues,
    criticalIssues,
    fixableIssues,
    recommendations: recommendations.length,
    categories: {
      images: [...issues, ...warnings].filter(i => 
        i.type.includes('alt') || i.type.includes('image')
      ).length,
      structuredData: [...issues, ...warnings].filter(i => 
        i.type.includes('structured') || i.type.includes('schema')
      ).length,
      metaTags: [...issues, ...warnings].filter(i => 
        i.type.includes('title') || i.type.includes('description') || i.type.includes('keywords')
      ).length,
      content: [...issues, ...warnings].filter(i => 
        i.type.includes('content') || i.type.includes('heading')
      ).length,
      performance: recommendations.filter(r => 
        r.type.includes('performance') || r.type.includes('image') || r.type.includes('large')
      ).length
    }
  }
}

/**
 * 生成SEO修复报告
 */
export function generateSEOFixReport(detectionResult, fixResult) {
  const report = {
    timestamp: new Date().toISOString(),
    originalScore: detectionResult.score,
    issuesFound: detectionResult.issues.length + detectionResult.warnings.length,
    issuesFixed: fixResult.fixed.length,
    issuesFailed: fixResult.failed.length,
    issuesSkipped: fixResult.skipped.length,
    improvements: [],
    remainingIssues: [],
    recommendations: detectionResult.recommendations
  }
  
  // 计算改进
  fixResult.fixed.forEach(fix => {
    report.improvements.push({
      type: fix.issue,
      description: fix.description,
      impact: 'Positive'
    })
  })
  
  // 列出剩余问题
  fixResult.failed.forEach(fail => {
    report.remainingIssues.push({
      type: fail.issue,
      reason: fail.reason,
      requiresManualFix: true
    })
  })
  
  fixResult.skipped.forEach(skip => {
    report.remainingIssues.push({
      type: skip.issue,
      reason: skip.reason,
      requiresManualFix: true
    })
  })
  
  return report
}