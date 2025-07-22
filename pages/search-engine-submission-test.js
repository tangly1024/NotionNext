import { useState, useEffect } from 'react'

/**
 * 搜索引擎提交功能测试页面
 */
export default function SearchEngineSubmissionTest() {
  const [testResults, setTestResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [engines, setEngines] = useState({})
  const [quota, setQuota] = useState({})

  useEffect(() => {
    fetchEngineStatus()
  }, [])

  const fetchEngineStatus = async () => {
    try {
      const response = await fetch('/api/seo/search-engine-submission')
      const data = await response.json()
      
      if (data.success) {
        setEngines(data.data.engines || {})
        setQuota(data.data.quota || {})
      }
    } catch (error) {
      console.error('Error fetching engine status:', error)
    }
  }

  const runTests = async () => {
    setIsLoading(true)
    const results = []

    // 测试1: API连接测试
    try {
      const response = await fetch('/api/seo/search-engine-submission')
      const data = await response.json()
      results.push({
        test: 'API连接测试',
        status: data.success ? 'PASS' : 'FAIL',
        details: data.success ? 'API响应正常' : data.error
      })
    } catch (error) {
      results.push({
        test: 'API连接测试',
        status: 'FAIL',
        details: error.message
      })
    }

    // 测试2: 搜索引擎配置测试
    const enabledEngines = Object.entries(engines).filter(([_, engine]) => engine.enabled)
    results.push({
      test: '搜索引擎配置',
      status: enabledEngines.length > 0 ? 'PASS' : 'WARN',
      details: `${enabledEngines.length}个搜索引擎已启用: ${enabledEngines.map(([id, engine]) => engine.name).join(', ')}`
    })

    // 测试3: 配额检查
    const quotaStatus = Object.entries(quota).map(([engineId, quotaInfo]) => {
      const percentage = quotaInfo.percentage || 0
      return {
        engine: engineId,
        status: percentage < 80 ? 'OK' : percentage < 95 ? 'WARN' : 'CRITICAL',
        usage: `${quotaInfo.used}/${quotaInfo.limit}`
      }
    })

    results.push({
      test: '配额状态检查',
      status: quotaStatus.every(q => q.status === 'OK') ? 'PASS' : 'WARN',
      details: quotaStatus.map(q => `${q.engine}: ${q.usage} (${q.status})`).join(', ')
    })

    // 测试4: 验证文件生成测试
    const verificationTests = [
      { engine: 'google', type: 'html_tag' },
      { engine: 'bing', type: 'html_tag' },
      { engine: 'baidu', type: 'html_tag' }
    ]

    for (const { engine, type } of verificationTests) {
      try {
        const response = await fetch(`/api/seo/verification-file?engine=${engine}&type=${type}&code=test123`)
        results.push({
          test: `验证文件生成 (${engine})`,
          status: response.ok ? 'PASS' : 'FAIL',
          details: response.ok ? '验证文件生成成功' : `HTTP ${response.status}`
        })
      } catch (error) {
        results.push({
          test: `验证文件生成 (${engine})`,
          status: 'FAIL',
          details: error.message
        })
      }
    }

    // 测试5: 环境变量检查
    const envVars = [
      'GOOGLE_INDEXING_API_KEY',
      'BING_WEBMASTER_API_KEY',
      'BAIDU_PUSH_TOKEN'
    ]

    const envStatus = envVars.map(varName => {
      // 这里无法直接检查服务器端环境变量，所以只能提示
      return {
        name: varName,
        status: 'UNKNOWN',
        details: '需要在服务器端配置'
      }
    })

    results.push({
      test: '环境变量配置',
      status: 'INFO',
      details: `需要配置: ${envVars.join(', ')}`
    })

    setTestResults(results)
    setIsLoading(false)
  }

  const testSitemapSubmission = async () => {
    try {
      const response = await fetch('/api/seo/search-engine-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_sitemap',
          engineId: 'google'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('测试提交成功！')
      } else {
        alert('测试提交失败：' + data.error)
      }
    } catch (error) {
      alert('测试提交失败：' + error.message)
    }
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
              搜索引擎提交功能测试
            </h1>
            <p className="text-gray-600">
              测试搜索引擎提交功能的各个组件和API
            </p>
          </div>

          {/* 搜索引擎状态概览 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">搜索引擎状态</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(engines).map(([engineId, engine]) => (
                <div key={engineId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{engine.name}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      engine.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {engine.enabled ? '启用' : '禁用'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>配额: {engine.quotaUsed}/{engine.quotaLimit}</div>
                    <div>最后提交: {engine.lastSubmission ? new Date(engine.lastSubmission).toLocaleDateString() : '从未'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 测试控制 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">功能测试</h2>
                <p className="text-gray-600">运行各项功能测试以验证系统状态</p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={runTests}
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? '测试中...' : '运行测试'}
                </button>
                <button
                  onClick={testSitemapSubmission}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  测试提交
                </button>
              </div>
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
            <h2 className="text-lg font-semibold mb-4">搜索引擎提交功能</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">支持的搜索引擎</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Google (Google Search Console)</li>
                  <li>• Bing (Bing Webmaster Tools)</li>
                  <li>• 百度 (百度搜索资源平台)</li>
                  <li>• Yandex (Yandex Webmaster)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">提交功能</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 自动sitemap提交</li>
                  <li>• 单个URL索引请求</li>
                  <li>• 批量URL提交</li>
                  <li>• 配额管理</li>
                  <li>• 提交历史记录</li>
                  <li>• 验证码管理</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 配置说明 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">配置说明</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">环境变量配置</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700">
{`# Google Indexing API
GOOGLE_INDEXING_API_KEY=your_google_api_key

# Bing Webmaster API
BING_WEBMASTER_API_KEY=your_bing_api_key

# 百度推送Token
BAIDU_PUSH_TOKEN=your_baidu_token`}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">使用说明</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>在各搜索引擎平台注册并获取API密钥</li>
                  <li>配置环境变量</li>
                  <li>在管理界面中启用相应的搜索引擎</li>
                  <li>添加验证码（如需要）</li>
                  <li>测试提交功能</li>
                  <li>启用自动提交（可选）</li>
                </ol>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">相关页面</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/search-engine-submission"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">提交管理</h3>
                <p className="text-sm text-gray-600">管理搜索引擎提交</p>
              </a>
              <a
                href="/sitemap.xml"
                target="_blank"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">Sitemap</h3>
                <p className="text-sm text-gray-600">查看网站sitemap</p>
              </a>
              <a
                href="/admin/seo-dashboard"
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">SEO仪表板</h3>
                <p className="text-sm text-gray-600">查看SEO整体状态</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}