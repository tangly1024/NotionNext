import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import { 
  generateDynamicKeywords, 
  formatKeywordsString, 
  optimizeMetaDescription,
  optimizePageTitle,
  extractKeywordsFromText,
  extractKeywordsFromTitle
} from '@/lib/seo/seoUtils'

/**
 * Meta标签优化测试页面
 * 用于测试和验证Meta标签的动态生成和优化功能
 */
export default function MetaTagsTest() {
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPageType, setSelectedPageType] = useState('post')

  // 测试数据
  const siteInfo = {
    title: siteConfig('TITLE'),
    description: siteConfig('DESCRIPTION'),
    author: siteConfig('AUTHOR'),
    keywords: siteConfig('KEYWORDS')
  }

  const testData = {
    post: {
      title: 'React性能优化最佳实践：从基础到高级技巧',
      summary: '本文详细介绍了React应用性能优化的各种方法，包括组件优化、状态管理、代码分割等高级技巧，帮助开发者构建更快速的React应用。',
      tags: ['React', '性能优化', '前端开发', 'JavaScript', 'Web开发'],
      category: '前端技术',
      content: `
        React作为现代前端开发的主流框架，性能优化一直是开发者关注的重点。
        本文将从多个角度探讨React性能优化的最佳实践。
        
        ## 组件优化
        使用React.memo、useMemo和useCallback来避免不必要的重渲染。
        
        ## 状态管理优化
        合理使用Context API，避免状态提升过度。
        
        ## 代码分割
        使用React.lazy和Suspense实现组件懒加载。
      `,
      author: '张三',
      publishDay: '2024-01-15'
    },
    category: {
      category: '前端技术',
      description: '前端技术分类包含React、Vue、JavaScript等相关文章'
    },
    tag: {
      tag: 'React',
      description: 'React相关的技术文章和教程'
    },
    search: {
      keyword: 'React性能优化',
      description: '搜索React性能优化相关内容'
    },
    home: {
      title: siteInfo.title,
      description: siteInfo.description
    }
  }

  // 运行Meta标签测试
  const runMetaTagsTest = async () => {
    setIsLoading(true)
    
    try {
      const results = {
        pageType: selectedPageType,
        tests: {},
        timestamp: new Date().toISOString()
      }

      const currentTestData = testData[selectedPageType]

      // 1. 测试标题优化
      console.log('🔍 测试标题优化...')
      const originalTitle = currentTestData.title || siteInfo.title
      const optimizedTitle = optimizePageTitle(originalTitle, siteInfo.title)
      
      results.tests.title = {
        original: originalTitle,
        optimized: optimizedTitle,
        improvement: optimizedTitle !== originalTitle,
        length: optimizedTitle.length,
        isOptimal: optimizedTitle.length >= 30 && optimizedTitle.length <= 60
      }

      // 2. 测试描述优化
      console.log('🔍 测试描述优化...')
      const originalDescription = currentTestData.summary || currentTestData.description || siteInfo.description
      const optimizedDescription = optimizeMetaDescription(originalDescription)
      
      results.tests.description = {
        original: originalDescription,
        optimized: optimizedDescription,
        improvement: optimizedDescription !== originalDescription,
        length: optimizedDescription.length,
        isOptimal: optimizedDescription.length >= 120 && optimizedDescription.length <= 160
      }

      // 3. 测试动态关键词生成
      console.log('🔍 测试动态关键词生成...')
      const dynamicKeywords = generateDynamicKeywords(currentTestData, siteInfo, selectedPageType)
      const formattedKeywords = formatKeywordsString(dynamicKeywords, 120)
      
      results.tests.keywords = {
        extracted: dynamicKeywords,
        formatted: formattedKeywords,
        count: dynamicKeywords.length,
        length: formattedKeywords.length,
        isOptimal: formattedKeywords.length <= 120 && dynamicKeywords.length >= 3
      }

      // 4. 测试关键词提取功能
      if (currentTestData.content) {
        console.log('🔍 测试内容关键词提取...')
        const contentKeywords = extractKeywordsFromText(currentTestData.content, 10)
        results.tests.contentKeywords = {
          keywords: contentKeywords,
          count: contentKeywords.length
        }
      }

      if (currentTestData.title) {
        console.log('🔍 测试标题关键词提取...')
        const titleKeywords = extractKeywordsFromTitle(currentTestData.title)
        results.tests.titleKeywords = {
          keywords: titleKeywords,
          count: titleKeywords.length
        }
      }

      // 5. 生成优化建议
      results.recommendations = generateOptimizationRecommendations(results.tests)

      // 6. 计算总体评分
      results.score = calculateMetaTagsScore(results.tests)

      setTestResults(results)
      console.log('✅ Meta标签测试完成:', results)

    } catch (error) {
      console.error('❌ Meta标签测试失败:', error)
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 页面加载时自动运行测试
  useEffect(() => {
    runMetaTagsTest()
  }, [selectedPageType])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Meta标签优化测试工具
          </h1>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(testData).map(pageType => (
                <button
                  key={pageType}
                  onClick={() => setSelectedPageType(pageType)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    selectedPageType === pageType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {pageType === 'post' ? '文章页面' : 
                   pageType === 'category' ? '分类页面' :
                   pageType === 'tag' ? '标签页面' :
                   pageType === 'search' ? '搜索页面' :
                   pageType === 'home' ? '首页' : pageType}
                </button>
              ))}
            </div>

            <button
              onClick={runMetaTagsTest}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '测试中...' : '重新测试Meta标签'}
            </button>
          </div>

          {testResults && (
            <div className="space-y-6">
              {testResults.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-medium mb-2">测试失败</h3>
                  <p className="text-red-600">{testResults.error}</p>
                </div>
              )}

              {testResults.score !== undefined && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium mb-4">
                    Meta标签优化评分: {testResults.score}/100
                  </h3>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        testResults.score >= 80 ? 'bg-green-600' :
                        testResults.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${testResults.score}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {testResults.tests && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800">测试结果详情</h2>
                  
                  {/* 标题测试 */}
                  {testResults.tests.title && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">标题优化</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          testResults.tests.title.isOptimal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {testResults.tests.title.length} 字符
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">原始标题:</h4>
                          <p className="text-sm bg-gray-50 p-3 rounded">{testResults.tests.title.original}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">优化后标题:</h4>
                          <p className="text-sm bg-green-50 p-3 rounded">{testResults.tests.title.optimized}</p>
                        </div>
                        
                        {testResults.tests.title.improvement && (
                          <div className="text-sm text-green-600">✓ 标题已优化</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 描述测试 */}
                  {testResults.tests.description && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">描述优化</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          testResults.tests.description.isOptimal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {testResults.tests.description.length} 字符
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">原始描述:</h4>
                          <p className="text-sm bg-gray-50 p-3 rounded">{testResults.tests.description.original}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">优化后描述:</h4>
                          <p className="text-sm bg-green-50 p-3 rounded">{testResults.tests.description.optimized}</p>
                        </div>
                        
                        {testResults.tests.description.improvement && (
                          <div className="text-sm text-green-600">✓ 描述已优化</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 关键词测试 */}
                  {testResults.tests.keywords && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">动态关键词</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          testResults.tests.keywords.isOptimal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {testResults.tests.keywords.count} 个关键词
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">提取的关键词:</h4>
                          <div className="flex flex-wrap gap-2">
                            {testResults.tests.keywords.extracted.map((keyword, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">格式化关键词字符串:</h4>
                          <p className="text-sm bg-green-50 p-3 rounded">{testResults.tests.keywords.formatted}</p>
                          <p className="text-xs text-gray-500 mt-1">长度: {testResults.tests.keywords.length}/120 字符</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 内容关键词 */}
                  {testResults.tests.contentKeywords && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">内容关键词提取</h3>
                      <div className="flex flex-wrap gap-2">
                        {testResults.tests.contentKeywords.keywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 标题关键词 */}
                  {testResults.tests.titleKeywords && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">标题关键词提取</h3>
                      <div className="flex flex-wrap gap-2">
                        {testResults.tests.titleKeywords.keywords.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 优化建议 */}
              {testResults.recommendations && testResults.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-yellow-800 font-medium mb-4">优化建议</h3>
                  <ul className="space-y-2">
                    {testResults.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-yellow-700 text-sm">
                        • {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-medium mb-2">测试说明</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• 此测试验证Meta标签的动态生成和优化功能</li>
                  <li>• 标题长度建议30-60字符，描述长度建议120-160字符</li>
                  <li>• 关键词会根据页面类型和内容动态生成</li>
                  <li>• 系统会自动优化标题和描述的格式和长度</li>
                  <li>• 不同页面类型会生成不同的关键词策略</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 生成优化建议
function generateOptimizationRecommendations(tests) {
  const recommendations = []
  
  if (tests.title && !tests.title.isOptimal) {
    if (tests.title.length < 30) {
      recommendations.push('标题过短，建议扩展到30-60字符')
    } else if (tests.title.length > 60) {
      recommendations.push('标题过长，建议缩短到60字符以内')
    }
  }
  
  if (tests.description && !tests.description.isOptimal) {
    if (tests.description.length < 120) {
      recommendations.push('描述过短，建议扩展到120-160字符')
    } else if (tests.description.length > 160) {
      recommendations.push('描述过长，建议缩短到160字符以内')
    }
  }
  
  if (tests.keywords && !tests.keywords.isOptimal) {
    if (tests.keywords.count < 3) {
      recommendations.push('关键词数量过少，建议增加到3-8个')
    } else if (tests.keywords.length > 120) {
      recommendations.push('关键词字符串过长，建议控制在120字符以内')
    }
  }
  
  return recommendations
}

// 计算Meta标签评分
function calculateMetaTagsScore(tests) {
  let score = 100
  
  // 标题评分 (40%)
  if (tests.title) {
    if (!tests.title.isOptimal) score -= 20
    if (tests.title.length < 10) score -= 20
  } else {
    score -= 40
  }
  
  // 描述评分 (40%)
  if (tests.description) {
    if (!tests.description.isOptimal) score -= 20
    if (tests.description.length < 50) score -= 20
  } else {
    score -= 40
  }
  
  // 关键词评分 (20%)
  if (tests.keywords) {
    if (!tests.keywords.isOptimal) score -= 10
    if (tests.keywords.count === 0) score -= 10
  } else {
    score -= 20
  }
  
  return Math.max(0, Math.round(score))
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {
      // 页面属性
    }
  }
}