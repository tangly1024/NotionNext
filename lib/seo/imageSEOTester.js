/**
 * 图片SEO测试工具
 * 提供全面的图片SEO测试和验证功能
 */

import { 
  generateImageAlt, 
  analyzeImageSEO, 
  validateImageSEO,
  optimizeImagesSEO,
  extractImagesFromContent,
  generateImageStructuredData
} from './imageSEO'
import { getImageSEOConfig, validateImageSEOConfig } from './imageSEOConfig'

/**
 * 运行完整的图片SEO测试套件
 * @param {Object} options - 测试选项
 * @returns {Promise<Object>} 测试结果
 */
export async function runImageSEOTestSuite(options = {}) {
  const {
    url = typeof window !== 'undefined' ? window.location.href : '',
    content = '',
    images = [],
    config = getImageSEOConfig()
  } = options

  const testResults = {
    timestamp: new Date().toISOString(),
    url,
    config: config,
    tests: {},
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      warnings: 0,
      score: 0
    }
  }

  try {
    // 1. 配置验证测试
    testResults.tests.configValidation = await testConfigValidation(config)
    
    // 2. Alt属性生成测试
    testResults.tests.altGeneration = await testAltGeneration()
    
    // 3. 图片分析测试
    testResults.tests.imageAnalysis = await testImageAnalysis(images)
    
    // 4. 图片验证测试
    testResults.tests.imageValidation = await testImageValidation(images, config)
    
    // 5. 内容提取测试
    testResults.tests.contentExtraction = await testContentExtraction(content)
    
    // 6. 结构化数据测试
    testResults.tests.structuredData = await testStructuredDataGeneration(images)
    
    // 7. 批量优化测试
    testResults.tests.batchOptimization = await testBatchOptimization(images)
    
    // 8. 性能测试
    testResults.tests.performance = await testPerformance()
    
    // 计算总体结果
    calculateTestSummary(testResults)
    
  } catch (error) {
    testResults.error = error.message
    testResults.summary.score = 0
  }

  return testResults
}

/**
 * 测试配置验证
 */
async function testConfigValidation(config) {
  const test = {
    name: 'Configuration Validation',
    passed: false,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    const validation = validateImageSEOConfig(config)
    test.passed = validation.isValid
    test.errors = validation.errors
    test.warnings = validation.warnings
    test.details = { validation }
  } catch (error) {
    test.errors.push(`Config validation failed: ${error.message}`)
  }

  return test
}

/**
 * 测试Alt属性生成
 */
async function testAltGeneration() {
  const test = {
    name: 'Alt Text Generation',
    passed: false,
    errors: [],
    warnings: [],
    details: {}
  }

  const testCases = [
    {
      src: 'https://example.com/logo.png',
      context: { title: 'Test Site' },
      expected: 'logo'
    },
    {
      src: 'https://example.com/user-avatar.jpg',
      context: { author: 'John Doe' },
      expected: 'profile'
    },
    {
      src: 'https://example.com/chart-data-visualization.png',
      context: { category: 'Analytics' },
      expected: 'chart'
    },
    {
      src: 'https://example.com/screenshot-app.png',
      context: { title: 'My App' },
      expected: 'screenshot'
    }
  ]

  const results = []
  let passedCases = 0

  for (const testCase of testCases) {
    try {
      const generatedAlt = await generateImageAlt(testCase.src, testCase.context)
      const passed = generatedAlt.toLowerCase().includes(testCase.expected)
      
      results.push({
        src: testCase.src,
        generated: generatedAlt,
        expected: testCase.expected,
        passed
      })
      
      if (passed) passedCases++
    } catch (error) {
      test.errors.push(`Alt generation failed for ${testCase.src}: ${error.message}`)
      results.push({
        src: testCase.src,
        error: error.message,
        passed: false
      })
    }
  }

  test.passed = passedCases === testCases.length
  test.details = { results, passedCases, totalCases: testCases.length }

  if (passedCases < testCases.length) {
    test.warnings.push(`${testCases.length - passedCases} alt generation test cases failed`)
  }

  return test
}

/**
 * 测试图片分析
 */
async function testImageAnalysis(images) {
  const test = {
    name: 'Image Analysis',
    passed: false,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    const testImages = images.length > 0 ? images : getTestImages()
    const analysis = analyzeImageSEO(testImages)
    
    test.passed = analysis.totalImages > 0
    test.details = { analysis }
    
    if (analysis.score < 70) {
      test.warnings.push(`Low SEO score: ${analysis.score}`)
    }
    
    if (analysis.issues.length > 0) {
      test.warnings.push(`Found ${analysis.issues.length} issues`)
    }
    
  } catch (error) {
    test.errors.push(`Image analysis failed: ${error.message}`)
  }

  return test
}

/**
 * 测试图片验证
 */
async function testImageValidation(images, config) {
  const test = {
    name: 'Image Validation',
    passed: false,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    const testImages = images.length > 0 ? images : getTestImages()
    const validationResults = []
    let validImages = 0

    for (const image of testImages) {
      const validation = validateImageSEO(image)
      validationResults.push({
        src: image.src,
        validation
      })
      
      if (validation.isValid) validImages++
    }

    test.passed = validImages > 0
    test.details = { 
      validationResults, 
      validImages, 
      totalImages: testImages.length 
    }
    
    if (validImages < testImages.length) {
      test.warnings.push(`${testImages.length - validImages} images failed validation`)
    }
    
  } catch (error) {
    test.errors.push(`Image validation failed: ${error.message}`)
  }

  return test
}

/**
 * 测试内容提取
 */
async function testContentExtraction(content) {
  const test = {
    name: 'Content Extraction',
    passed: false,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    const testContent = content || getTestContent()
    const extractedImages = extractImagesFromContent(testContent)
    
    test.passed = extractedImages.length > 0
    test.details = { 
      extractedImages, 
      totalExtracted: extractedImages.length 
    }
    
    if (extractedImages.length === 0) {
      test.warnings.push('No images found in content')
    }
    
  } catch (error) {
    test.errors.push(`Content extraction failed: ${error.message}`)
  }

  return test
}

/**
 * 测试结构化数据生成
 */
async function testStructuredDataGeneration(images) {
  const test = {
    name: 'Structured Data Generation',
    passed: false,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    const testImages = images.length > 0 ? images : getTestImages()
    const structuredData = generateImageStructuredData(testImages, {
      title: 'Test Page',
      author: 'Test Author'
    })
    
    test.passed = structuredData !== null
    test.details = { structuredData }
    
    if (!structuredData) {
      test.warnings.push('No structured data generated')
    } else {
      // 验证结构化数据格式
      if (!structuredData['@context'] || !structuredData['@type']) {
        test.warnings.push('Invalid structured data format')
      }
    }
    
  } catch (error) {
    test.errors.push(`Structured data generation failed: ${error.message}`)
  }

  return test
}

/**
 * 测试批量优化
 */
async function testBatchOptimization(images) {
  const test = {
    name: 'Batch Optimization',
    passed: false,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    const testImages = images.length > 0 ? images : getTestImages()
    const optimizationResult = await optimizeImagesSEO(testImages, {
      title: 'Test Page',
      category: 'Test Category'
    })
    
    test.passed = optimizationResult.optimizedImages.length > 0
    test.details = { optimizationResult }
    
    if (optimizationResult.optimizationReport.optimizedCount === 0) {
      test.warnings.push('No images were optimized')
    }
    
  } catch (error) {
    test.errors.push(`Batch optimization failed: ${error.message}`)
  }

  return test
}

/**
 * 测试性能
 */
async function testPerformance() {
  const test = {
    name: 'Performance Test',
    passed: false,
    errors: [],
    warnings: [],
    details: {}
  }

  try {
    const testImages = getTestImages()
    const startTime = performance.now()
    
    // 测试Alt生成性能
    const altPromises = testImages.map(img => 
      generateImageAlt(img.src, { title: 'Test' })
    )
    await Promise.all(altPromises)
    
    // 测试分析性能
    analyzeImageSEO(testImages)
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    test.passed = duration < 1000 // 应该在1秒内完成
    test.details = { 
      duration: Math.round(duration),
      imagesProcessed: testImages.length,
      averageTimePerImage: Math.round(duration / testImages.length)
    }
    
    if (duration > 1000) {
      test.warnings.push(`Performance test took ${Math.round(duration)}ms, which is slower than expected`)
    }
    
  } catch (error) {
    test.errors.push(`Performance test failed: ${error.message}`)
  }

  return test
}

/**
 * 计算测试总结
 */
function calculateTestSummary(testResults) {
  const tests = Object.values(testResults.tests)
  
  testResults.summary.totalTests = tests.length
  testResults.summary.passedTests = tests.filter(t => t.passed).length
  testResults.summary.failedTests = tests.filter(t => !t.passed).length
  testResults.summary.warnings = tests.reduce((sum, t) => sum + t.warnings.length, 0)
  
  // 计算总体评分
  const passRate = testResults.summary.passedTests / testResults.summary.totalTests
  const warningPenalty = Math.min(testResults.summary.warnings * 5, 30)
  testResults.summary.score = Math.max(0, Math.round(passRate * 100 - warningPenalty))
}

/**
 * 获取测试图片数据
 */
function getTestImages() {
  return [
    {
      src: 'https://example.com/logo.png',
      alt: 'Company logo',
      title: 'Logo',
      width: 200,
      height: 100,
      format: 'png',
      loading: 'eager'
    },
    {
      src: 'https://example.com/hero-image.jpg',
      alt: '',
      title: '',
      width: 1200,
      height: 600,
      format: 'jpg',
      loading: 'lazy'
    },
    {
      src: 'https://example.com/chart.webp',
      alt: 'Sales data chart',
      title: 'Q4 Sales Chart',
      width: 800,
      height: 400,
      format: 'webp',
      loading: 'lazy'
    },
    {
      src: 'https://example.com/avatar.jpg',
      alt: '',
      title: '',
      width: 150,
      height: 150,
      format: 'jpg'
    }
  ]
}

/**
 * 获取测试内容
 */
function getTestContent() {
  return `
# Test Article

This is a test article with images.

![Company logo](https://example.com/logo.png)

Here's some content about our product.

![Product screenshot](https://example.com/screenshot.jpg)

And here's a chart showing our data:

![Sales chart](https://example.com/chart.png)

<img src="https://example.com/html-image.jpg" alt="HTML image" title="Test image">
  `
}

/**
 * 运行快速图片SEO检查
 * @param {Array} images - 图片列表
 * @returns {Object} 检查结果
 */
export function quickImageSEOCheck(images) {
  const results = {
    timestamp: new Date().toISOString(),
    totalImages: images.length,
    issues: [],
    recommendations: [],
    score: 100
  }

  if (images.length === 0) {
    results.issues.push('No images found')
    results.score = 0
    return results
  }

  let issueCount = 0

  images.forEach((image, index) => {
    // 检查alt属性
    if (!image.alt || image.alt.trim() === '') {
      results.issues.push(`Image ${index + 1}: Missing alt attribute`)
      issueCount++
    }

    // 检查尺寸属性
    if (!image.width || !image.height) {
      results.issues.push(`Image ${index + 1}: Missing width/height attributes`)
      issueCount++
    }

    // 检查文件大小
    if (image.fileSize && image.fileSize > 1024 * 1024) {
      results.recommendations.push(`Image ${index + 1}: Consider compressing (${Math.round(image.fileSize / 1024)}KB)`)
    }

    // 检查格式
    const format = image.src.split('.').pop()?.toLowerCase()
    if (format && !['webp', 'avif'].includes(format)) {
      results.recommendations.push(`Image ${index + 1}: Consider using modern format (WebP/AVIF)`)
    }
  })

  // 计算评分
  const issueRatio = issueCount / (images.length * 2) // 每个图片最多2个关键问题
  results.score = Math.max(0, Math.round(100 - (issueRatio * 100)))

  return results
}

/**
 * 生成图片SEO报告
 * @param {Object} testResults - 测试结果
 * @returns {string} HTML报告
 */
export function generateImageSEOReport(testResults) {
  const { summary, tests } = testResults
  
  let html = `
    <div class="image-seo-report">
      <h2>图片SEO测试报告</h2>
      <div class="summary">
        <h3>总结</h3>
        <p>测试时间: ${new Date(testResults.timestamp).toLocaleString()}</p>
        <p>总体评分: <strong>${summary.score}/100</strong></p>
        <p>通过测试: ${summary.passedTests}/${summary.totalTests}</p>
        <p>警告数量: ${summary.warnings}</p>
      </div>
      
      <div class="test-details">
        <h3>详细结果</h3>
  `
  
  Object.entries(tests).forEach(([key, test]) => {
    const status = test.passed ? '✅' : '❌'
    html += `
      <div class="test-item">
        <h4>${status} ${test.name}</h4>
        ${test.errors.length > 0 ? `<div class="errors">错误: ${test.errors.join(', ')}</div>` : ''}
        ${test.warnings.length > 0 ? `<div class="warnings">警告: ${test.warnings.join(', ')}</div>` : ''}
      </div>
    `
  })
  
  html += `
      </div>
    </div>
    
    <style>
      .image-seo-report { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; }
      .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      .test-item { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
      .errors { color: #d32f2f; margin-top: 5px; }
      .warnings { color: #f57c00; margin-top: 5px; }
    </style>
  `
  
  return html
}

/**
 * 导出测试结果为JSON
 * @param {Object} testResults - 测试结果
 * @returns {string} JSON字符串
 */
export function exportTestResults(testResults) {
  return JSON.stringify(testResults, null, 2)
}

/**
 * 图片SEO测试配置
 */
export const IMAGE_SEO_TEST_CONFIG = {
  timeout: 10000, // 10秒超时
  maxImages: 100, // 最大测试图片数量
  enablePerformanceTest: true,
  enableStructuredDataTest: true,
  enableBatchOptimizationTest: true
}