import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * SEO设置和测试管理页面
 */
export default function SEOSettings() {
  const [testSuites, setTestSuites] = useState([])
  const [testResults, setTestResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testUrl, setTestUrl] = useState('')
  const [selectedSuites, setSelectedSuites] = useState([])
  const [testOptions, setTestOptions] = useState({
    enablePerformanceTests: true,
    enableAccessibilityTests: true,
    enableStructuredDataTests: true
  })

  useEffect(() => {
    fetchTestSuites()
    setTestUrl(siteConfig('LINK', BLOG.LINK))
  }, [])

  const fetchTestSuites = async () => {
    try {
      const response = await fetch('/api/admin/seo-test')
      const data = await response.json()
      
      if (data.success) {
        setTestSuites(data.testSuites)
      }
    } catch (error) {
      console.error('Error fetching test suites:', error)
    }
  }

  const runTests = async () => {
    if (!testUrl) {
      alert('请输入测试URL')
      return
    }

    setLoading(true)
    setTestResults(null)

    try {
      const response = await fetch('/api/admin/seo-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: testUrl,
          testSuites: selectedSuites,
          options: testOptions
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setTestResults(data.results)
      } else {
        alert('测试失败：' + data.error)
      }
    } catch (error) {
      alert('测试失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleTestSuite = (suiteId) => {
    setSelectedSuites(prev => 
      prev.includes(suiteId) 
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS':
        return 'text-green-600 bg-green-100'
      case 'FAIL':
        return 'text-red-600 bg-red-100'
      case 'WARN':
        return 'text-yellow-600 bg-yellow-100'
      case 'INFO':
        return 'text-blue-600 bg-blue-100'
      case 'ERROR':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SEO测试套件
          </h1>
          <p className="text-gray-600">
            全面测试网站的SEO优化状况，包括meta标签、结构化数据、性能等
          </p>
        </div>

        {/* 测试配置 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">测试配置</h2>
          
          {/* URL输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              测试URL
            </label>
            <input
              type="url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 测试套件选择 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              测试套件 (留空则运行所有测试)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {testSuites.map((suite) => (
                <label key={suite.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSuites.includes(suite.id)}
                    onChange={() => toggleTestSuite(suite.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {suite.name} ({suite.testCount}项测试)
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 测试选项 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              测试选项
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={testOptions.enablePerformanceTests}
                  onChange={(e) => setTestOptions({
                    ...testOptions,
                    enablePerformanceTests: e.target.checked
                  })}
                  className="mr-2"
                />
                <span className="text-sm">启用性能测试</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={testOptions.enableAccessibilityTests}
                  onChange={(e) => setTestOptions({
                    ...testOptions,
                    enableAccessibilityTests: e.target.checked
                  })}
                  className="mr-2"
                />
                <span className="text-sm">启用可访问性测试</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={testOptions.enableStructuredDataTests}
                  onChange={(e) => setTestOptions({
                    ...testOptions,
                    enableStructuredDataTests: e.target.checked
                  })}
                  className="mr-2"
                />
                <span className="text-sm">启用结构化数据测试</span>
              </label>
            </div>
          </div>

          {/* 运行测试按钮 */}
          <button
            onClick={runTests}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '测试中...' : '运行SEO测试'}
          </button>
        </div>

        {/* 测试结果 */}
        {testResults && (
          <div className="space-y-6">
            {/* 测试摘要 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">测试摘要</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(testResults.summary.score)}`}>
                    {testResults.summary.score}
                  </div>
                  <div className="text-sm text-gray-600">SEO得分</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {testResults.totalTests}
                  </div>
                  <div className="text-sm text-gray-600">总测试数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testResults.passedTests}
                  </div>
                  <div className="text-sm text-gray-600">通过</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {testResults.failedTests}
                  </div>
                  <div className="text-sm text-gray-600">失败</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {testResults.warningTests}
                  </div>
                  <div className="text-sm text-gray-600">警告</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {Math.round(testResults.executionTime / 1000)}s
                  </div>
                  <div className="text-sm text-gray-600">执行时间</div>
                </div>
              </div>
            </div>

            {/* 详细测试结果 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">详细测试结果</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {testResults.results.map((result, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 capitalize">
                          {result.test.replace(/-/g, ' ')}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.message}
                        </p>
                        {result.details && (
                          <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                            {typeof result.details === 'object' 
                              ? JSON.stringify(result.details, null, 2)
                              : result.details
                            }
                          </div>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-4 ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 优化建议 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">优化建议</h2>
              <div className="space-y-4">
                {testResults.results
                  .filter(result => result.status === 'FAIL' || result.status === 'WARN')
                  .map((result, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4">
                      <h3 className="font-medium text-gray-900 capitalize">
                        {result.test.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {result.message}
                      </p>
                      <div className="text-sm text-blue-600 mt-1">
                        {getOptimizationSuggestion(result.test, result.status)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 测试套件说明 */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">测试套件说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testSuites.map((suite) => (
              <div key={suite.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{suite.name}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  包含 {suite.testCount} 项测试
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {suite.tests.slice(0, 5).map((test, index) => (
                    <li key={index} className="capitalize">
                      • {test.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </li>
                  ))}
                  {suite.tests.length > 5 && (
                    <li className="text-gray-500">
                      ... 还有 {suite.tests.length - 5} 项测试
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 获取优化建议
 */
function getOptimizationSuggestion(testName, status) {
  const suggestions = {
    'title': '确保每个页面都有唯一且描述性的标题，长度控制在50-60字符',
    'meta-description': '为每个页面添加独特的meta描述，长度控制在120-160字符',
    'meta-keywords': '现代SEO中meta keywords不是必需的，可以移除或保持简洁',
    'canonical': '为每个页面设置canonical URL以避免重复内容问题',
    'open-graph': '添加Open Graph标签以优化社交媒体分享效果',
    'twitter-card': '添加Twitter Card标签以优化Twitter分享效果',
    'json-ld': '添加JSON-LD结构化数据以帮助搜索引擎理解页面内容',
    'article-schema': '为文章页面添加Article结构化数据',
    'website-schema': '为网站添加WebSite结构化数据',
    'page-load-time': '优化页面加载速度，压缩资源，使用CDN',
    'image-optimization': '优化图片格式和大小，使用WebP/AVIF格式',
    'https': '启用HTTPS以提高安全性和SEO排名',
    'robots-txt': '检查robots.txt文件配置，确保不会阻止重要页面',
    'sitemap': '创建并提交XML sitemap到搜索引擎',
    'heading-structure': '使用合理的标题层级结构，每页只有一个H1',
    'content-length': '确保页面有足够的高质量内容'
  }

  return suggestions[testName] || '请查看具体测试结果并进行相应优化'
}