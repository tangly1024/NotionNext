import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'

export default function ImageAltTest() {
  const [testResults, setTestResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // 测试图片列表
  const testImages = [
    {
      src: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&q=50&fm=webp&crop=entropy&cs=srgb&width=800&fmt=webp',
      originalAlt: '',
      context: { title: '模板说明', category: '知行合一', tags: ['文字', '推荐'] }
    },
    {
      src: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&q=50&fm=webp&crop=entropy&cs=srgb&width=800&fmt=webp',
      originalAlt: '',
      context: { title: '示例文章', category: '技术分享', tags: ['建站', '文字', '推荐'] }
    },
    {
      src: '/images/heo/20239df3f66615b532ce571eac6d14ff21cf072602.webp',
      originalAlt: 'Lazy loaded image',
      context: { title: 'AfterEffect', category: '设计工具', tags: ['设计', '视频'] }
    },
    {
      src: 'https://www.notion.so/images/page-cover/woodcuts_3.jpg',
      originalAlt: '',
      context: { title: '七武士', category: '影视资源', tags: ['日本战国', '武士精神', '经典电影'] }
    },
    {
      src: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.1.0&q=50&fm=webp&crop=entropy&cs=srgb&width=800&fmt=webp',
      originalAlt: '',
      context: { title: '英语启蒙神器《见物能聊》', category: '网课资源', tags: ['推荐'] }
    }
  ]

  const testImageAltGeneration = async () => {
    setIsLoading(true)
    const results = []

    try {
      // 动态导入图片SEO功能
      const { generateImageAlt } = await import('@/lib/seo/imageSEO')

      for (const testImage of testImages) {
        try {
          const generatedAlt = await generateImageAlt(testImage.src, testImage.context)
          
          results.push({
            src: testImage.src,
            originalAlt: testImage.originalAlt,
            generatedAlt: generatedAlt,
            context: testImage.context,
            success: true,
            improvement: generatedAlt && generatedAlt !== testImage.originalAlt
          })
        } catch (error) {
          results.push({
            src: testImage.src,
            originalAlt: testImage.originalAlt,
            generatedAlt: '',
            context: testImage.context,
            success: false,
            error: error.message,
            improvement: false
          })
        }
      }
    } catch (error) {
      console.error('Failed to load image SEO module:', error)
    }

    setTestResults(results)
    setIsLoading(false)
  }

  // 页面加载时自动运行测试
  useEffect(() => {
    testImageAltGeneration()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            图片ALT属性生成测试
          </h1>
          
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={testImageAltGeneration}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '生成中...' : '重新测试ALT属性生成'}
            </button>
            
            {testResults.length > 0 && (
              <div className="text-sm text-gray-600">
                测试完成: {testResults.filter(r => r.success).length}/{testResults.length} 成功
                {testResults.filter(r => r.improvement).length > 0 && 
                  `, ${testResults.filter(r => r.improvement).length} 个已改进`
                }
              </div>
            )}
          </div>

          {testResults.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">测试结果</h2>
              
              {testResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3">
                      <img
                        src={result.src}
                        alt={result.generatedAlt || result.originalAlt || 'Test image'}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+'
                        }}
                      />
                    </div>
                    
                    <div className="md:w-2/3 space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900">图片信息</h3>
                        <p className="text-sm text-gray-600 break-all">{result.src}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900">上下文</h4>
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">标题:</span> {result.context.title}</p>
                          <p><span className="font-medium">分类:</span> {result.context.category}</p>
                          <p><span className="font-medium">标签:</span> {result.context.tags?.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-red-600 mb-1">原始ALT</h4>
                          <div className="text-sm bg-red-50 p-3 rounded border min-h-[3rem] flex items-center">
                            {result.originalAlt ? (
                              <span className="text-red-700">{result.originalAlt}</span>
                            ) : (
                              <span className="text-red-400 italic">(空)</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-green-600 mb-1">生成的ALT</h4>
                          <div className="text-sm bg-green-50 p-3 rounded border min-h-[3rem] flex items-center">
                            {result.success ? (
                              result.generatedAlt ? (
                                <span className="text-green-700">{result.generatedAlt}</span>
                              ) : (
                                <span className="text-green-400 italic">(生成失败)</span>
                              )
                            ) : (
                              <span className="text-red-600">错误: {result.error}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.success ? '✓ 成功' : '✗ 失败'}
                        </span>
                        
                        {result.improvement && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            🎯 已改进
                          </span>
                        )}
                        
                        {result.generatedAlt && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            长度: {result.generatedAlt.length} 字符
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-blue-800 font-medium mb-2">测试说明</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• 此测试验证图片ALT属性的自动生成功能</li>
              <li>• 系统会根据图片上下文（标题、分类、标签）生成描述性ALT文本</li>
              <li>• 生成的ALT文本应该比原始的占位符文本更有意义</li>
              <li>• ALT文本长度建议在10-125字符之间</li>
              <li>• 如果图片加载失败，会显示占位符图片</li>
            </ul>
          </div>
          
          {testResults.length > 0 && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-gray-800 font-medium mb-2">测试统计</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{testResults.length}</div>
                  <div className="text-gray-600">总测试数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.filter(r => r.success).length}
                  </div>
                  <div className="text-gray-600">成功生成</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {testResults.filter(r => r.improvement).length}
                  </div>
                  <div className="text-gray-600">质量改进</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(testResults.filter(r => r.generatedAlt).reduce((sum, r) => sum + r.generatedAlt.length, 0) / testResults.filter(r => r.generatedAlt).length) || 0}
                  </div>
                  <div className="text-gray-600">平均长度</div>
                </div>
              </div>
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