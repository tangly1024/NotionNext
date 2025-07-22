import { SEOTester } from '@/lib/seo/seoTester'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * SEO测试API
 * 提供SEO测试功能的API接口
 */
export default async function handler(req, res) {
  const { method } = req

  try {
    switch (method) {
      case 'POST':
        return await handleRunTests(req, res)
      case 'GET':
        return await handleGetTestSuites(req, res)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('SEO Test API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * 运行SEO测试
 */
async function handleRunTests(req, res) {
  const { url, testSuites = [], options = {} } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    // 验证URL
    const testUrl = url.startsWith('http') ? url : `${siteConfig('LINK', BLOG.LINK)}${url}`
    
    // 创建SEO测试器实例
    const tester = new SEOTester({
      timeout: 15000,
      enablePerformanceTests: options.enablePerformanceTests !== false,
      enableAccessibilityTests: options.enableAccessibilityTests !== false,
      enableStructuredDataTests: options.enableStructuredDataTests !== false,
      ...options
    })

    // 运行测试
    let results
    if (testSuites.length > 0) {
      // 运行指定的测试套件
      results = await tester.runSpecificTestSuites(testUrl, testSuites)
    } else {
      // 运行所有测试
      results = await tester.runAllTests(testUrl)
    }

    return res.status(200).json({
      success: true,
      results
    })

  } catch (error) {
    console.error('SEO test execution error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

/**
 * 获取可用的测试套件
 */
async function handleGetTestSuites(req, res) {
  try {
    const tester = new SEOTester()
    const testSuites = Array.from(tester.testSuites.entries()).map(([id, suite]) => ({
      id,
      name: suite.name,
      tests: suite.tests,
      testCount: suite.tests.length
    }))

    return res.status(200).json({
      success: true,
      testSuites,
      totalSuites: testSuites.length,
      totalTests: testSuites.reduce((sum, suite) => sum + suite.testCount, 0)
    })

  } catch (error) {
    console.error('Error getting test suites:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}