import { useState, useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import BLOG from '@/blog.config'

/**
 * 搜索引擎提交管理页面
 */
export default function SearchEngineSubmissionManager() {
  const [engines, setEngines] = useState({})
  const [history, setHistory] = useState([])
  const [quota, setQuota] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [verificationCodes, setVerificationCodes] = useState({})
  const [newVerification, setNewVerification] = useState({
    engineId: '',
    method: '',
    code: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seo/search-engine-submission')
      const data = await response.json()
      
      if (data.success) {
        setEngines(data.data.engines || {})
        setHistory(data.data.recentHistory || [])
        setQuota(data.data.quota || {})
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitSitemap = async (engineId = null) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/seo/search-engine-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_sitemap',
          engineId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Sitemap提交成功！')
        fetchData()
      } else {
        alert('提交失败：' + data.error)
      }
    } catch (error) {
      alert('提交失败：' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const submitUrl = async () => {
    const url = prompt('请输入要提交的URL:')
    if (!url) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/seo/search-engine-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_url',
          urls: [url],
          engineId: 'google'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('URL提交成功！')
        fetchData()
      } else {
        alert('提交失败：' + data.error)
      }
    } catch (error) {
      alert('提交失败：' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleEngine = async (engineId, enabled) => {
    try {
      const response = await fetch('/api/seo/search-engine-submission', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggle_engine',
          engineId,
          enabled
        })
      })

      const data = await response.json()
      
      if (data.success) {
        fetchData()
      } else {
        alert('更新失败：' + data.error)
      }
    } catch (error) {
      alert('更新失败：' + error.message)
    }
  }

  const addVerificationCode = async () => {
    if (!newVerification.engineId || !newVerification.method || !newVerification.code) {
      alert('请填写完整的验证信息')
      return
    }

    try {
      const response = await fetch('/api/seo/search-engine-submission', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'set_verification',
          ...newVerification
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('验证码添加成功！')
        setNewVerification({ engineId: '', method: '', code: '' })
        fetchData()
      } else {
        alert('添加失败：' + data.error)
      }
    } catch (error) {
      alert('添加失败：' + error.message)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  const getStatusColor = (enabled) => {
    return enabled ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
  }

  const getQuotaColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            搜索引擎提交管理
          </h1>
          <p className="text-gray-600">
            管理sitemap提交、URL索引和搜索引擎验证
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: '概览' },
                { id: 'engines', name: '搜索引擎' },
                { id: 'history', name: '提交历史' },
                { id: 'verification', name: '验证管理' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* 概览标签页 */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 快速操作 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => submitSitemap()}
                    disabled={submitting}
                    className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? '提交中...' : '提交Sitemap到所有引擎'}
                  </button>
                  <button
                    onClick={submitUrl}
                    disabled={submitting}
                    className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    提交单个URL
                  </button>
                  <button
                    onClick={fetchData}
                    className="p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    刷新数据
                  </button>
                </div>

                {/* 配额使用情况 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">今日配额使用情况</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(quota).map(([engineId, quotaInfo]) => (
                      <div key={engineId} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{engineId}</span>
                          <span className="text-sm text-gray-600">
                            {quotaInfo.used}/{quotaInfo.limit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getQuotaColor(quotaInfo.percentage)}`}
                            style={{ width: `${Math.min(quotaInfo.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          剩余: {quotaInfo.remaining}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 最近提交历史 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">最近提交历史</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            时间
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            搜索引擎
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            URL
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            状态
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {history.slice(0, 5).map((record, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {formatDate(record.timestamp)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 capitalize">
                              {record.engineId}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-xs">
                              {record.url}
                            </td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                record.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {record.success ? '成功' : '失败'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 搜索引擎标签页 */}
            {activeTab === 'engines' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">搜索引擎状态</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(engines).map(([engineId, engine]) => (
                    <div key={engineId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium">{engine.name}</h4>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={engine.enabled}
                            onChange={(e) => toggleEngine(engineId, e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm">启用</span>
                        </label>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>状态:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(engine.enabled)}`}>
                            {engine.enabled ? '启用' : '禁用'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>今日使用:</span>
                          <span>{engine.quotaUsed}/{engine.quotaLimit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>最后提交:</span>
                          <span>
                            {engine.lastSubmission 
                              ? formatDate(engine.lastSubmission)
                              : '从未提交'
                            }
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={() => submitSitemap(engineId)}
                          disabled={submitting || !engine.enabled}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          提交Sitemap
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 提交历史标签页 */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">完整提交历史</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          时间
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          搜索引擎
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          错误信息
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.map((record, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(record.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {record.engineId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {record.url}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {record.success ? '成功' : '失败'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {record.error || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 验证管理标签页 */}
            {activeTab === 'verification' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">验证码管理</h3>
                
                {/* 添加新验证码 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-4">添加验证码</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={newVerification.engineId}
                      onChange={(e) => setNewVerification({...newVerification, engineId: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">选择搜索引擎</option>
                      {Object.entries(engines).map(([engineId, engine]) => (
                        <option key={engineId} value={engineId}>{engine.name}</option>
                      ))}
                    </select>
                    
                    <select
                      value={newVerification.method}
                      onChange={(e) => setNewVerification({...newVerification, method: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">选择验证方式</option>
                      <option value="html_file">HTML文件</option>
                      <option value="html_tag">HTML标签</option>
                      <option value="dns">DNS记录</option>
                    </select>
                    
                    <input
                      type="text"
                      placeholder="验证码"
                      value={newVerification.code}
                      onChange={(e) => setNewVerification({...newVerification, code: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button
                    onClick={addVerificationCode}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    添加验证码
                  </button>
                </div>

                {/* 现有验证码列表 */}
                <div>
                  <h4 className="font-medium mb-4">现有验证码</h4>
                  <div className="space-y-4">
                    {Object.entries(verificationCodes).map(([engineId, methods]) => (
                      <div key={engineId} className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium mb-2 capitalize">{engineId}</h5>
                        <div className="space-y-2">
                          {Object.entries(methods).map(([method, info]) => (
                            <div key={method} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div>
                                <span className="font-medium">{method}:</span>
                                <span className="ml-2 font-mono text-sm">{info.code}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(info.timestamp)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}