import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import SEOContentAnalyzer from '@/components/SEOContentAnalyzer'
import RelatedPosts, { useRelatedPosts } from '@/components/RelatedPosts'
import { getRelatedPosts, generateRelatedPostsStructuredData } from '@/lib/seo/relatedPosts'

/**
 * 内容分析功能测试页面
 * 用于测试和验证内容分析功能
 */
export default function ContentAnalysisTest() {
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedContent, setSelectedContent] = useState('article')

  // 测试内容数据
  const testContents = {
    article: {
      title: 'React性能优化完全指南：从基础到高级技巧',
      description: '本文详细介绍了React应用性能优化的各种方法，包括组件优化、状态管理、代码分割等高级技巧，帮助开发者构建更快速、更高效的React应用程序。',
      content: `
# React性能优化完全指南

React作为现代前端开发的主流框架，性能优化一直是开发者关注的重点。本文将从多个角度探讨React性能优化的最佳实践。

## 组件优化

### 使用React.memo
React.memo是一个高阶组件，它可以帮助我们避免不必要的重渲染。当组件的props没有发生变化时，React.memo会跳过渲染过程。

### useMemo和useCallback
这两个Hook可以帮助我们缓存计算结果和函数引用，避免在每次渲染时重新计算。

## 状态管理优化

合理使用Context API，避免状态提升过度。将状态尽可能地保持在需要它的组件附近。

## 代码分割

使用React.lazy和Suspense实现组件懒加载，减少初始包的大小。

## 虚拟化长列表

对于包含大量数据的列表，使用react-window或react-virtualized进行虚拟化处理。

## 总结

React性能优化是一个持续的过程，需要根据具体的应用场景选择合适的优化策略。
      `,
      keywords: ['React', '性能优化', '前端开发', 'JavaScript', 'Web开发'],
      targetKeyword: 'React性能优化'
    },
    
    short: {
      title: '短文测试',
      description: '这是一个短文测试。',
      content: `
# 短文测试

这是一个很短的文章，用来测试内容分析功能对短文的处理。

内容不够长。
      `,
      keywords: ['测试'],
      targetKeyword: '测试'
    },
    
    noStructure: {
      title: '无结构文章测试标题过长会被截断的情况下如何处理',
      description: '这是一个没有良好结构的文章，用来测试分析器如何处理结构问题。这个描述也故意写得很长，超过了推荐的160字符限制，看看分析器会如何提示优化建议。',
      content: `
这是一个没有标题结构的文章。所有内容都在一个段落中，没有使用任何标题标签。这样的文章结构对SEO不友好，也不利于用户阅读。文章内容应该有清晰的层次结构，使用H1、H2、H3等标题标签来组织内容。同时，段落也不应该太长，每个段落应该只包含一个主要观点。这个段落故意写得很长，用来测试可读性分析功能。句子也故意写得很长，包含很多从句和复杂的语法结构，这样会降低文章的可读性评分。
      `,
      keywords: ['结构', '测试'],
      targetKeyword: '结构'
    }
  }

  // 模拟文章数据用于相关文章推荐测试
  const mockPosts = [
    {
      id: '1',
      title: 'Vue.js性能优化技巧',
      summary: 'Vue.js应用的性能优化方法和最佳实践',
      slug: 'vue-performance-tips',
      tags: ['Vue', '性能优化', '前端开发'],
      category: '前端技术',
      publishDay: '2024-01-10',
      status: 'Published'
    },
    {
      id: '2', 
      title: 'JavaScript异步编程详解',
      summary: '深入理解JavaScript中的异步编程模式',
      slug: 'javascript-async-programming',
      tags: ['JavaScript', '异步编程', 'Promise'],
      category: '前端技术',
      publishDay: '2024-01-12',
      status: 'Published'
    },
    {
      id: '3',
      title: 'React Hooks最佳实践',
      summary: 'React Hooks的使用技巧和注意事项',
      slug: 'react-hooks-best-practices',
      tags: ['React', 'Hooks', '前端开发'],
      category: '前端技术',
      publishDay: '2024-01-14',
      status: 'Published'
    },
    {
      id: '4',
      title: 'Web性能监控指南',
      summary: '如何监控和优化Web应用的性能',
      slug: 'web-performance-monitoring',
      tags: ['性能优化', 'Web开发', '监控'],
      category: '前端技术',
      publishDay: '2024-01-16',
      status: 'Published'
    },
    {
      id: '5',
      title: 'CSS Grid布局完全指南',
      summary: 'CSS Grid布局的详细使用方法',
      slug: 'css-grid-guide',
      tags: ['CSS', '布局', '前端开发'],
      category: '前端技术',
      publishDay: '2024-01-18',
      status: 'Published'
    }
  ]

  const currentTestPost = {
    id: 'current',
    ...testContents[selectedContent],
    slug: 'current-test-post',
    category: '前端技术',
    publishDay: '2024-01-15',
    status: 'Published'
  }

  // 使用相关文章Hook
  const { relatedPosts, isLoading: relatedLoading } = useRelatedPosts(
    currentTestPost, 
    mockPosts,
    { maxResults: 4 }
  )

  // 运行内容分析测试
  const runContentAnalysisTest = async () => {
    setIsLoading(true)
    
    try {
      const currentContent = testContents[selectedContent]
      
      // 模拟分析过程
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const results = {
        contentType: selectedContent,
        analysisComplete: true,
        relatedPostsCount: relatedPosts.length,
        relatedPostsData: relatedPosts,
        structuredData: generateRelatedPostsStructuredData(
          relatedPosts, 
          siteConfig('LINK') || 'https://example.com'
        ),
        recommendations: generateContentRecommendations(currentContent),
        timestamp: new Date().toISOString()
      }

      setTestResults(results)
      console.log('✅ 内容分析测试完成:', results)

    } catch (error) {
      console.error('❌ 内容分析测试失败:', error)
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 分析完成回调
  const handleAnalysisComplete = (analysis) => {
    console.log('SEO内容分析完成:', analysis)
  }

  // 页面加载时自动运行测试
  useEffect(() => {
    runContentAnalysisTest()
  }, [selectedContent, relatedPosts])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            内容分析功能测试工具
          </h1>
          
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(testContents).map(contentType => (
                <button
                  key={contentType}
                  onClick={() => setSelectedContent(contentType)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedContent === contentType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {contentType === 'article' ? '标准文章' :
                   contentType === 'short' ? '短文测试' :
                   contentType === 'noStructure' ? '无结构文章' : contentType}
                </button>
              ))}
            </div>

            <button
              onClick={runContentAnalysisTest}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '分析中...' : '重新分析内容'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：内容分析器 */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">测试内容</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>标题:</strong> {testContents[selectedContent].title}</div>
                  <div><strong>描述:</strong> {testContents[selectedContent].description}</div>
                  <div><strong>目标关键词:</strong> {testContents[selectedContent].targetKeyword}</div>
                  <div><strong>关键词:</strong> {testContents[selectedContent].keywords.join(', ')}</div>
                </div>
              </div>

              {/* SEO内容分析器 */}
              <SEOContentAnalyzer
                content={testContents[selectedContent].content}
                title={testContents[selectedContent].title}
                description={testContents[selectedContent].description}
                keywords={testContents[selectedContent].keywords}
                targetKeyword={testContents[selectedContent].targetKeyword}
                onAnalysisComplete={handleAnalysisComplete}
                showRealTime={true}
                language="zh-CN"
              />
            </div>

            {/* 右侧：相关文章推荐 */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">相关文章推荐测试</h3>
                
                {relatedLoading ? (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    加载相关文章...
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    找到 {relatedPosts.length} 篇相关文章
                  </div>
                )}
              </div>

              {/* 相关文章组件 */}
              <RelatedPosts
                currentPost={currentTestPost}
                allPosts={mockPosts}
                maxResults={4}
                title="相关文章推荐"
                showSummary={true}
                showDate={true}
                showTags={true}
                layout="list"
                baseUrl={siteConfig('LINK') || 'https://example.com'}
                enableStructuredData={true}
              />

              {/* 相关文章算法分析 */}
              {testResults && testResults.relatedPostsData && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">算法分析结果</h4>
                  <div className="space-y-2 text-sm">
                    {testResults.relatedPostsData.map((post, index) => (
                      <div key={post.id} className="flex justify-between items-center bg-white p-2 rounded">
                        <span className="font-medium">{post.title}</span>
                        <span className="text-blue-600">
                          {Math.round(post.relevanceScore * 100)}% 相关
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 测试结果 */}
          {testResults && (
            <div className="mt-6 space-y-4">
              {testResults.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-medium mb-2">测试失败</h3>
                  <p className="text-red-600">{testResults.error}</p>
                </div>
              )}

              {testResults.recommendations && testResults.recommendations.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-yellow-800 font-medium mb-4">内容优化建议</h3>
                  <ul className="space-y-2">
                    {testResults.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-yellow-700 text-sm">
                        • {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {testResults.structuredData && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-purple-800 font-medium mb-4">相关文章结构化数据</h3>
                  <details className="bg-white rounded p-3">
                    <summary className="cursor-pointer font-medium text-purple-700">
                      查看JSON-LD数据
                    </summary>
                    <pre className="mt-3 text-xs bg-gray-50 p-3 rounded border overflow-auto max-h-64">
                      {JSON.stringify(testResults.structuredData, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-medium mb-2">测试说明</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• 左侧展示SEO内容分析器的实时分析结果</li>
                  <li>• 右侧展示相关文章推荐功能和算法分析</li>
                  <li>• 分析器会检查关键词密度、标题结构、可读性等</li>
                  <li>• 相关文章推荐基于标签、分类、内容相似度等因素</li>
                  <li>• 系统会生成相关文章的结构化数据以提升SEO</li>
                  <li>• 不同类型的测试内容会产生不同的分析结果</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 生成内容优化建议
function generateContentRecommendations(content) {
  const recommendations = []
  
  if (content.title.length > 60) {
    recommendations.push('标题过长，建议缩短到60字符以内')
  }
  
  if (content.description.length > 160) {
    recommendations.push('描述过长，建议控制在160字符以内')
  }
  
  if (content.content.length < 300) {
    recommendations.push('内容过短，建议扩展到至少300字')
  }
  
  if (!content.content.includes('#')) {
    recommendations.push('缺少标题结构，建议添加H1、H2等标题')
  }
  
  if (content.keywords.length < 3) {
    recommendations.push('关键词数量过少，建议增加到3-8个')
  }
  
  return recommendations
}

// 静态生成页面
export async function getStaticProps() {
  return {
    props: {
      // 页面属性
    }
  }
}