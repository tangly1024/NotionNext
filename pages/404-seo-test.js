import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * 404页面SEO功能测试页面
 */
export default function SEO404Test() {
  const [testResults, setTestResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    const results = []

    // 测试1: 检查404错误记录API
    try {
      const response = await fetch('/api/seo/404-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: '/test-404-path',
          referrer: 'https://example.com',
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      })
      
      const data = await response.json()
      results.push({
        test: '404错误记录API',
        status: data.success ? 'PASS' : 'FAIL',
        details: data.success ? '成功记录404错误' : data.error
      })
    } catch (error) {
      results.push({
        test: '404错误记录API',
        status: 'FAIL',
        details: error.message
      })
    }

    // 测试2: 检查404错误报告API
    try {
      const response = await fetch('/api/seo/404-report?limit=10&sortBy=count')
      const data = await response.json()
      results.push({
        test: '404错误报告API',
        status: data.success ? 'PASS' : 'FAIL',
        details: data.success ? `获取到${data.report.errors.length}条错误记录` : data.error
      })
    } catch (error) {
      results.push({
        test: '404错误报告API',
        status: 'FAIL',
        details: error.message
      })
    }

    // 测试3: 检查配置项
    const config404Tests = [
      { key: 'SEO_ENHANCED_404', name: '增强404页面' },
      { key: 'SEO_404_MONITOR', name: '404错误监控' },
      { key: 'SEO_404_SMART_REDIRECT', name: '智能重定向' },
      { key: 'SEO_404_RELATED_CONTENT', name: '相关内容推荐' },
      { key: 'SEO_404_SEARCH_INTEGRATION', name: '搜索集成' },
      { key: 'SEO_404_ANALYTICS_TRACKING', name: '分析跟踪' }
    ]

    config404Tests.forEach(({ key, name }) => {
      const value = siteConfig(key, true)
      results.push({
        test: `配置项: ${name}`,
        status: value ? 'ENABLED' : 'DISABLED',
        details: `${key} = ${value}`
      })
    })

    // 测试4: 检查404页面组件
    const components = [
      'Enhanced404Page',
      'SEO404',
      'NotFoundErrorTracker'
    ]

    for (const component of components) {
      try {
        const exists = document.querySelector(`[data-component="${component}"]`) !== null
        results.push({
          test: `组件: ${component}`,
          status: exists ? 'LOADED' : 'NOT_FOUND',
          details: exists ? '组件已加载' : '组件未找到'
        })
      } catch (error) {
        results.push({
          test: `组件: ${component}`,
          status: 'ERROR',
          details: error.message
        })
      }
    }

    setTestResults(results)
    setIsLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS':
      case 'ENABLED':
      case 'LOADED':
        return 'text-green-600 bg-green-100'
      case 'FAIL':
      case 'ERROR':
        return 'text-red-600 bg-red-100'
      case 'DISABLED':
      case 'NOT_FOUND':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              404页面SEO功能测试
            </h1>
            <p className="text-gray-600">
              测试404页面SEO优化功能的各个组件和API
            </p>
          </div>

          {/* 测试控制 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">运行测试</h2>
                <p className="text-gray-600">点击按钮开始测试404页面SEO功能</p>
              </div>
              <button
                onClick={runTests}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? '测试中...' : '开始测试'}
              </button>
            </div>
          </div>

          {/* 测试结果 */}
          {testResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">测试结果</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {testResults.map((result, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {result.test}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.details}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 功能说明 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">404页面SEO优化功能</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">核心功能</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 增强的404页面设计</li>
                  <li>• SEO优化的meta标签</li>
                  <li>• 结构化数据支持</li>
                  <li>• 智能重定向建议</li>
                  <li>• 相关内容推荐</li>
                  <li>• 搜索功能集成</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">监控功能</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 404错误自动记录</li>
                  <li>• 错误统计分析</li>
                  <li>• 来源追踪</li>
                  <li>• 性能数据收集</li>
                  <li>• 管理后台界面</li>
                  <li>• 分析工具集成</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">相关页面</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/404"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">404页面</h3>
                <p className="text-sm text-gray-600">查看增强的404页面</p>
              </a>
              <a
                href="/admin/404-monitor"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">404监控</h3>
                <p className="text-sm text-gray-600">查看404错误统计</p>
              </a>
              <a
                href="/non-existent-page"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">测试404</h3>
                <p className="text-sm text-gray-600">触发404页面</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}