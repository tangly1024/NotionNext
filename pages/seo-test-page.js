import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * SEO功能集成测试页面
 * 全面测试所有SEO优化功能的集成效果
 */
export default function SEOTestPage() {
  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [activeTest, setActiveTest] = useState(null)

  const seoFeatures = [
    {
      id: 'basic-seo',
      name: '基础SEO组件',
      description: '测试meta标签、标题、描述等基础SEO元素',
      endpoint: '/api/admin/seo-test',
      testData: { url: '/', testSuites: ['meta-tags'] }
    },
    {
      id: 'structured-data',
      name: '结构化数据',
      description: '测试JSON-LD结构化数据的生成和验证',
      endpoint: '/api/admin/seo-test',
      testData: { url: '/', testSuites: ['structured-data'] }
    },
    {
      id: 'performance',
      name: '性能优化',
      description: '测试页面加载性能和Core Web Vitals',
      endpoint: '/api/analytics/web-vitals-summary',
      testData: {}
    },
    {
      id: 'sitemap',
      name: 'Sitemap生成',
      description: '测试XML sitemap的生成和有效性',
      endpoint: '/sitemap.xml',
      testData: {}
    },
    {
      id: 'robots',
      name: 'Robots.txt',
      description: '测试robots.txt文件的配置',
      endpoint: '/robots.txt',
      testData: {}
    },
    {
      id: 'search-submission',
      name: '搜索引擎提交',
      description: '测试搜索引擎提交功能',
      endpoint: '/api/seo/search-engine-submission',
      testData: {}
    },
    {
      id: 'keyword-ranking',
      name: '关键词排名',
      description: '测试关键词排名跟踪功能',
      endpoint: '/api/seo/keyword-ranking?action=stats',
      testData: {}
    },
    {
      id: '404-optimization',
      name: '404页面优化',
      description: '测试404页面SEO优化功能',
      endpoint: '/api/seo/404-report',
      testData: {}
    },
    {
      id: 'image-seo',
      name: '图片SEO',
      description: '测试图片SEO优化功能',
      endpoint: '/api/sitemap/images.js',
      testData: {}
    }
  ]

  const runAllTests = async () => {
    setLoading(true)
    const results = {}

    for (const feature of seoFeatures) {
      setActiveTest(feature.id)
      try {
        const result = await runSingleTest(feature)
        results[feature.id] = {
          status: 'success',
          data: result,
          timestamp: Date.now()
        }
      } catch (error) {
        results[feature.id] = {
          status: 'error',
          error: error.message,
          timestamp: Date.now()
        }
      }
    }

    setTestResults(results)
    setActiveTest(null)
    setLoading(false)
  }

  const runSingleTest = async (feature) => {
    const { endpoint, testData } = feature

    if (endpoint.startsWith('/api/')) {
      // API测试
      const response = await fetch(endpoint, {
        method: Object.keys(testData).length > 0 ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: Object.keys(testData).length > 0 ? JSON.stringify(testData) : undefined
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } else {
      // 静态文件测试
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        const text = await response.text()
        return { content: text.substring(0, 500) + '...' }
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              SEO功能集成测试
            </h1>
            <p className="text-gray-600">
              全面测试所有SEO优化功能的集成效果和性能表现
            </p>
          </div>

          {/* 测试控制 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">集成测试</h2>
                <p className="text-gray-600">
                  点击按钮开始全面测试所有SEO功能模块
                </p>
              </div>
              <button
                onClick={runAllTests}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? '测试中...' : '开始集成测试'}
              </button>
            </div>

            {/* 测试进度 */}
            {loading && activeTest && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-800">
                    正在测试: {seoFeatures.find(f => f.id === activeTest)?.name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SEO功能模块 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {seoFeatures.map((feature) => {
              const result = testResults[feature.id]
              return (
                <div key={feature.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {feature.name}
                    </h3>
                    {result && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {result.status === 'success' ? '通过' : '失败'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>

                  {result && (
                    <div className="border-t pt-3">
                      <div className="text-xs text-gray-500 mb-2">
                        测试时间: {formatTimestamp(result.timestamp)}
                      </div>
                      
                      {result.status === 'success' ? (
                        <div className="text-sm text-green-600">
                          ✓ 功能正常运行
                        </div>
                      ) : (
                        <div className="text-sm text-red-600">
                          ✗ {result.error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 详细测试结果 */}
          {Object.keys(testResults).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">详细测试结果</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {Object.entries(testResults).map(([featureId, result]) => {
                  const feature = seoFeatures.find(f => f.id === featureId)
                  return (
                    <div key={featureId} className="px-6 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {feature?.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {feature?.description}
                      </p>

                      {result.status === 'success' && result.data && (
                        <div className="bg-gray-50 rounded p-3">
                          <pre className="text-xs text-gray-700 overflow-x-auto">
                            {JSON.stringify(result.data, null, 2).substring(0, 500)}
                            {JSON.stringify(result.data, null, 2).length > 500 && '...'}
                          </pre>
                        </div>
                      )}

                      {result.status === 'error' && (
                        <div className="bg-red-50 rounded p-3">
                          <div className="text-sm text-red-700">
                            错误: {result.error}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SEO功能概览 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">SEO功能概览</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">核心功能</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 增强版SEO基础组件</li>
                  <li>• 结构化数据生成系统</li>
                  <li>• 智能sitemap和robots.txt</li>
                  <li>• 性能优化组件</li>
                  <li>• SEO内容分析工具</li>
                  <li>• 面包屑导航系统</li>
                  <li>• 相关文章推荐</li>
                  <li>• Core Web Vitals监控</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">高级功能</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• SEO分析引擎</li>
                  <li>• SEO管理仪表板</li>
                  <li>• 图片SEO优化</li>
                  <li>• 404页面优化</li>
                  <li>• 搜索引擎提交</li>
                  <li>• SEO测试套件</li>
                  <li>• 关键词排名跟踪</li>
                  <li>• 网站性能优化</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 配置信息 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">当前SEO配置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  增强模式
                </div>
                <div className="text-sm text-gray-600">
                  {siteConfig('SEO_ENHANCED_MODE', true) ? '已启用' : '已禁用'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  结构化数据
                </div>
                <div className="text-sm text-gray-600">
                  {siteConfig('SEO_ENABLE_STRUCTURED_DATA', true) ? '已启用' : '已禁用'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  性能监控
                </div>
                <div className="text-sm text-gray-600">
                  {siteConfig('SEO_ENABLE_PERFORMANCE_MONITOR', false) ? '已启用' : '已禁用'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  自动提交
                </div>
                <div className="text-sm text-gray-600">
                  {siteConfig('SEO_AUTO_SUBMISSION', true) ? '已启用' : '已禁用'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  404监控
                </div>
                <div className="text-sm text-gray-600">
                  {siteConfig('SEO_404_MONITOR', true) ? '已启用' : '已禁用'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  图片优化
                </div>
                <div className="text-sm text-gray-600">
                  {siteConfig('SEO_ENABLE_LAZY_LOADING', true) ? '已启用' : '已禁用'}
                </div>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">相关页面</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/admin/seo-dashboard"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">SEO仪表板</h3>
                <p className="text-sm text-gray-600">查看SEO整体状态</p>
              </a>
              
              <a
                href="/admin/seo-settings"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">SEO设置</h3>
                <p className="text-sm text-gray-600">配置SEO参数</p>
              </a>
              
              <a
                href="/admin/keyword-ranking"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">关键词排名</h3>
                <p className="text-sm text-gray-600">监控排名变化</p>
              </a>
              
              <a
                href="/admin/web-vitals-dashboard"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">性能监控</h3>
                <p className="text-sm text-gray-600">查看性能指标</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}