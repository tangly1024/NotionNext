import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import { detectSEOIssues, autoFixSEOIssues, generateSEOFixReport } from '@/lib/seo/seoFixManager'
import { extractImagesFromContent } from '@/lib/seo/imageSEO'
import { generateArticleSchema, generateWebsiteSchema } from '@/lib/seo/structuredData'

/**
 * SEO修复测试页面
 * 用于测试和验证SEO问题检测和自动修复功能
 */
export default function SEOFixTest() {
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTest, setSelectedTest] = useState('current-page')

  // 测试数据
  const testPageData = {
    title: '测试页面标题',
    description: '这是一个测试页面的描述',
    content: `
      这是测试内容。包含一些图片：
      ![](https://example.com/image1.jpg)
      ![测试图片](https://example.com/image2.png)
      ![Lazy loaded image](https://example.com/image3.webp)
      
      更多内容...
    `,
    type: 'Post',
    category: '测试分类',
    tags: ['测试', 'SEO', '优化'],
    images: [
      {
        src: 'https://example.com/image1.jpg',
        alt: '',
        title: ''
      },
      {
        src: 'https://example.com/image2.png',
        alt: '测试图片',
        title: ''
      },
      {
        src: 'https://example.com/image3.webp',
        alt: 'Lazy loaded image',
        title: ''
      }
    ],
    siteInfo: {
      title: siteConfig('TITLE'),
      description: siteConfig('DESCRIPTION'),
      author: siteConfig('AUTHOR')
    }
  }

  // 运行SEO测试
  const runSEOTest = async () => {
    setIsLoading(true)
    try {
      // 1. 检测SEO问题
      console.log('🔍 检测SEO问题...')
      const detectionResult = await detectSEOIssues(testPageData, {
        checkImages: true,
        checkStructuredData: true,
        checkMetaTags: true,
        checkContent: true,
        checkPerformance: true
      })

      console.log('检测结果:', detectionResult)

      // 2. 自动修复问题
      console.log('🔧 自动修复SEO问题...')
      const fixResult = await autoFixSEOIssues(
        testPageData, 
        detectionResult.issues.concat(detectionResult.warnings),
        {
          fixImages: true,
          fixMetaTags: true,
          fixStructuredData: true,
          fixContent: true
        }
      )

      console.log('修复结果:', fixResult)

      // 3. 重新检测修复后的问题
      console.log('🔍 重新检测修复后的问题...')
      const reDetectionResult = await detectSEOIssues(fixResult.updatedPageData, {
        checkImages: true,
        checkStructuredData: true,
        checkMetaTags: true,
        checkContent: true,
        checkPerformance: true
      })

      // 4. 生成修复报告
      const report = generateSEOFixReport(detectionResult, fixResult)
      report.newScore = reDetectionResult.score
      report.scoreImprovement = reDetectionResult.score - detectionResult.score

      setTestResults({
        original: detectionResult,
        fixed: fixResult,
        reDetection: reDetectionResult,
        report
      })

    } catch (error) {
      console.error('SEO测试失败:', error)
      setTestResults({
        error: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 测试当前页面的SEO
  const testCurrentPage = async () => {
    setIsLoading(true)
    try {
      // 从当前页面提取数据
      const currentPageData = {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || '',
        keywords: document.querySelector('meta[name="keywords"]')?.content || '',
        content: document.body.innerText,
        images: Array.from(document.images).map(img => ({
          src: img.src,
          alt: img.alt,
          title: img.title
        })),
        type: 'website',
        siteInfo: {
          title: siteConfig('TITLE'),
          description: siteConfig('DESCRIPTION')
        }
      }

      const detectionResult = await detectSEOIssues(currentPageData)
      
      setTestResults({
        currentPage: true,
        original: detectionResult,
        pageData: currentPageData
      })

    } catch (error) {
      console.error('当前页面SEO测试失败:', error)
      setTestResults({
        error: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            SEO修复测试工具
          </h1>
          
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setSelectedTest('current-page')}
                className={`px-4 py-2 rounded-lg ${
                  selectedTest === 'current-page'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                测试当前页面
              </button>
              <button
                onClick={() => setSelectedTest('test-data')}
                className={`px-4 py-2 rounded-lg ${
                  selectedTest === 'test-data'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                使用测试数据
              </button>
            </div>

            <button
              onClick={selectedTest === 'current-page' ? testCurrentPage : runSEOTest}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '测试中...' : '开始SEO测试'}
            </button>
          </div>

          {/* 测试结果显示 */}
          {testResults && (
            <div className="space-y-6">
              {testResults.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-medium mb-2">测试失败</h3>
                  <p className="text-red-600">{testResults.error}</p>
                </div>
              )}

              {testResults.original && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium mb-4">
                    原始SEO检测结果 (评分: {testResults.original.score}/100)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-red-100 p-3 rounded">
                      <div className="text-red-800 font-medium">错误</div>
                      <div className="text-2xl font-bold text-red-600">
                        {testResults.original.issues.length}
                      </div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded">
                      <div className="text-yellow-800 font-medium">警告</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {testResults.original.warnings.length}
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded">
                      <div className="text-green-800 font-medium">建议</div>
                      <div className="text-2xl font-bold text-green-600">
                        {testResults.original.recommendations.length}
                      </div>
                    </div>
                  </div>

                  {/* 问题详情 */}
                  {testResults.original.issues.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-red-800 mb-2">严重问题:</h4>
                      <ul className="space-y-1">
                        {testResults.original.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-red-700">
                            • {issue.description} ({issue.severity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {testResults.original.warnings.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-yellow-800 mb-2">警告:</h4>
                      <ul className="space-y-1">
                        {testResults.original.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-yellow-700">
                            • {warning.description} ({warning.severity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {testResults.fixed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-medium mb-4">自动修复结果</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-100 p-3 rounded">
                      <div className="text-green-800 font-medium">已修复</div>
                      <div className="text-2xl font-bold text-green-600">
                        {testResults.fixed.fixed.length}
                      </div>
                    </div>
                    <div className="bg-red-100 p-3 rounded">
                      <div className="text-red-800 font-medium">修复失败</div>
                      <div className="text-2xl font-bold text-red-600">
                        {testResults.fixed.failed.length}
                      </div>
                    </div>
                    <div className="bg-gray-100 p-3 rounded">
                      <div className="text-gray-800 font-medium">已跳过</div>
                      <div className="text-2xl font-bold text-gray-600">
                        {testResults.fixed.skipped.length}
                      </div>
                    </div>
                  </div>

                  {testResults.fixed.fixed.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-green-800 mb-2">成功修复的问题:</h4>
                      <ul className="space-y-2">
                        {testResults.fixed.fixed.map((fix, index) => (
                          <li key={index} className="text-sm text-green-700 bg-green-100 p-2 rounded">
                            <div className="font-medium">{fix.description}</div>
                            <div className="text-xs mt-1">
                              修复前: {fix.before} → 修复后: {fix.after}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {testResults.reDetection && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-purple-800 font-medium mb-4">
                    修复后重新检测结果 (评分: {testResults.reDetection.score}/100)
                  </h3>
                  
                  {testResults.report && (
                    <div className="bg-purple-100 p-3 rounded mb-4">
                      <div className="text-purple-800 font-medium">评分改进</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {testResults.report.scoreImprovement > 0 ? '+' : ''}
                        {testResults.report.scoreImprovement}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-red-100 p-3 rounded">
                      <div className="text-red-800 font-medium">剩余错误</div>
                      <div className="text-2xl font-bold text-red-600">
                        {testResults.reDetection.issues.length}
                      </div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded">
                      <div className="text-yellow-800 font-medium">剩余警告</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {testResults.reDetection.warnings.length}
                      </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded">
                      <div className="text-green-800 font-medium">建议</div>
                      <div className="text-2xl font-bold text-green-600">
                        {testResults.reDetection.recommendations.length}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {testResults.report && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-800 font-medium mb-4">修复报告摘要</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div>测试时间: {new Date(testResults.report.timestamp).toLocaleString()}</div>
                    <div>发现问题: {testResults.report.issuesFound}</div>
                    <div>成功修复: {testResults.report.issuesFixed}</div>
                    <div>修复失败: {testResults.report.issuesFailed}</div>
                    <div>跳过修复: {testResults.report.issuesSkipped}</div>
                    <div>评分改进: {testResults.report.originalScore} → {testResults.report.newScore} ({testResults.report.scoreImprovement > 0 ? '+' : ''}{testResults.report.scoreImprovement})</div>
                  </div>
                </div>
              )}

              {/* 调试信息 */}
              <details className="bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-800">
                  查看详细调试信息
                </summary>
                <pre className="mt-4 text-xs bg-white p-4 rounded border overflow-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {
      // 页面属性
    }
  }
}