import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * 404错误监控管理页面
 */
export default function NotFoundMonitor() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    limit: 50,
    sortBy: 'count',
    timeRange: null
  })

  useEffect(() => {
    fetchReport()
  }, [filters])

  const fetchReport = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        limit: filters.limit.toString(),
        sortBy: filters.sortBy
      })
      
      if (filters.timeRange) {
        params.append('timeRange', JSON.stringify(filters.timeRange))
      }

      const response = await fetch(`/api/seo/404-report?${params}`)
      const data = await response.json()

      if (data.success) {
        setReport(data.report)
      } else {
        setError(data.error || '获取报告失败')
      }
    } catch (err) {
      setError('网络错误：' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  const getTimeRangeOptions = () => {
    const now = Date.now()
    const day = 24 * 60 * 60 * 1000
    
    return [
      { label: '全部时间', value: null },
      { label: '最近24小时', value: { start: now - day, end: now } },
      { label: '最近7天', value: { start: now - 7 * day, end: now } },
      { label: '最近30天', value: { start: now - 30 * day, end: now } }
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            404错误监控
          </h1>
          <p className="text-gray-600">
            监控和分析网站的404错误，提供智能重定向建议
          </p>
        </div>

        {/* 过滤器 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">筛选条件</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                显示数量
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={25}>25条</option>
                <option value={50}>50条</option>
                <option value={100}>100条</option>
                <option value={200}>200条</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                排序方式
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="count">按错误次数</option>
                <option value="recent">按最近发生</option>
                <option value="first">按首次发生</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                时间范围
              </label>
              <select
                value={filters.timeRange ? JSON.stringify(filters.timeRange) : ''}
                onChange={(e) => handleFilterChange('timeRange', e.target.value ? JSON.parse(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getTimeRangeOptions().map((option, index) => (
                  <option key={index} value={option.value ? JSON.stringify(option.value) : ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 统计摘要 */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {report.summary.totalErrors}
              </div>
              <div className="text-sm text-gray-600">总错误次数</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {report.summary.uniquePaths}
              </div>
              <div className="text-sm text-gray-600">唯一路径数</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {report.summary.topReferrers.length}
              </div>
              <div className="text-sm text-gray-600">来源网站数</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {report.summary.commonPatterns.length}
              </div>
              <div className="text-sm text-gray-600">常见模式数</div>
            </div>
          </div>
        )}

        {/* 错误列表 */}
        {report && report.errors.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">404错误详情</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      路径
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      错误次数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      首次发生
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最近发生
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      建议
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.errors.map((error, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {error.path}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {error.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(error.firstSeen)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(error.lastSeen)}
                      </td>
                      <td className="px-6 py-4">
                        {error.suggestions.length > 0 ? (
                          <div className="space-y-1">
                            {error.suggestions.slice(0, 2).map((suggestion, idx) => (
                              <div key={idx} className="text-xs">
                                <a
                                  href={suggestion.url}
                                  className="text-blue-600 hover:text-blue-800"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {suggestion.url}
                                </a>
                                <span className="text-gray-500 ml-2">
                                  ({Math.round(suggestion.confidence * 100)}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">无建议</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {report && report.errors.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              没有404错误
            </h3>
            <p className="text-gray-500">
              在选定的时间范围内没有发现404错误，网站运行良好！
            </p>
          </div>
        )}
      </div>
    </div>
  )
}