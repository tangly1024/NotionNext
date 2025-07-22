import { useState, useEffect } from 'react'

/**
 * 关键词排名跟踪管理页面
 */
export default function KeywordRankingManager() {
  const [keywords, setKeywords] = useState([])
  const [competitors, setCompetitors] = useState([])
  const [rankings, setRankings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('keywords')
  
  // 新关键词表单
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    targetUrl: '',
    searchEngines: ['google', 'bing', 'baidu'],
    location: 'zh-CN',
    device: 'desktop',
    frequency: 'daily'
  })

  // 新竞争对手表单
  const [newCompetitor, setNewCompetitor] = useState({
    domain: '',
    keywords: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchKeywords(),
        fetchCompetitors(),
        fetchStats(),
        fetchNotifications()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchKeywords = async () => {
    try {
      const response = await fetch('/api/seo/keyword-ranking?action=keywords')
      const data = await response.json()
      if (data.success) {
        setKeywords(data.keywords)
      }
    } catch (error) {
      console.error('Error fetching keywords:', error)
    }
  }

  const fetchCompetitors = async () => {
    try {
      const response = await fetch('/api/seo/keyword-ranking?action=competitors')
      const data = await response.json()
      if (data.success) {
        setCompetitors(data.competitors)
      }
    } catch (error) {
      console.error('Error fetching competitors:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/seo/keyword-ranking?action=stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/seo/keyword-ranking?action=notifications&limit=20')
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const addKeyword = async () => {
    if (!newKeyword.keyword) {
      alert('请输入关键词')
      return
    }

    try {
      const response = await fetch('/api/seo/keyword-ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_keyword',
          ...newKeyword
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('关键词添加成功！')
        setNewKeyword({
          keyword: '',
          targetUrl: '',
          searchEngines: ['google', 'bing', 'baidu'],
          location: 'zh-CN',
          device: 'desktop',
          frequency: 'daily'
        })
        fetchKeywords()
      } else {
        alert('添加失败：' + data.error)
      }
    } catch (error) {
      alert('添加失败：' + error.message)
    }
  }

  const checkKeywordRanking = async (keywordId) => {
    try {
      const response = await fetch('/api/seo/keyword-ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check_ranking',
          keywordId
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('排名检查完成！')
        fetchKeywords()
        fetchNotifications()
      } else {
        alert('检查失败：' + data.error)
      }
    } catch (error) {
      alert('检查失败：' + error.message)
    }
  }

  const checkAllRankings = async () => {
    if (!confirm('确定要检查所有关键词排名吗？这可能需要一些时间。')) {
      return
    }

    try {
      const response = await fetch('/api/seo/keyword-ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check_all'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`批量检查完成！共检查了${data.total}个结果。`)
        fetchKeywords()
        fetchNotifications()
      } else {
        alert('检查失败：' + data.error)
      }
    } catch (error) {
      alert('检查失败：' + error.message)
    }
  }

  const addCompetitor = async () => {
    if (!newCompetitor.domain) {
      alert('请输入竞争对手域名')
      return
    }

    try {
      const response = await fetch('/api/seo/keyword-ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_competitor',
          domain: newCompetitor.domain,
          keywords: newCompetitor.keywords.split(',').map(k => k.trim()).filter(k => k)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('竞争对手添加成功！')
        setNewCompetitor({ domain: '', keywords: '' })
        fetchCompetitors()
      } else {
        alert('添加失败：' + data.error)
      }
    } catch (error) {
      alert('添加失败：' + error.message)
    }
  }

  const deleteKeyword = async (keywordId) => {
    if (!confirm('确定要删除这个关键词吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/seo/keyword-ranking?keywordId=${keywordId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        alert('关键词删除成功！')
        fetchKeywords()
      } else {
        alert('删除失败：' + data.error)
      }
    } catch (error) {
      alert('删除失败：' + error.message)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN')
  }

  const getEngineColor = (engine) => {
    const colors = {
      google: 'bg-blue-100 text-blue-800',
      bing: 'bg-green-100 text-green-800',
      baidu: 'bg-red-100 text-red-800'
    }
    return colors[engine] || 'bg-gray-100 text-gray-800'
  }

  const getRankingColor = (position) => {
    if (position <= 3) return 'text-green-600 font-bold'
    if (position <= 10) return 'text-blue-600'
    if (position <= 20) return 'text-yellow-600'
    return 'text-red-600'
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
            关键词排名跟踪
          </h1>
          <p className="text-gray-600">
            监控关键词在各大搜索引擎的排名变化，分析竞争对手表现
          </p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stats.keywords?.total || 0}
            </div>
            <div className="text-sm text-gray-600">总关键词数</div>
            <div className="text-xs text-gray-500 mt-1">
              活跃: {stats.keywords?.active || 0}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {stats.rankings?.total || 0}
            </div>
            <div className="text-sm text-gray-600">排名记录数</div>
            <div className="text-xs text-gray-500 mt-1">
              24小时: {stats.rankings?.recent24h || 0}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {stats.competitors?.total || 0}
            </div>
            <div className="text-sm text-gray-600">竞争对手数</div>
            <div className="text-xs text-gray-500 mt-1">
              活跃: {stats.competitors?.active || 0}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {stats.notifications?.recent || 0}
            </div>
            <div className="text-sm text-gray-600">最近通知</div>
            <div className="text-xs text-gray-500 mt-1">
              总计: {stats.notifications?.total || 0}
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'keywords', name: '关键词管理' },
                { id: 'competitors', name: '竞争对手' },
                { id: 'notifications', name: '排名通知' },
                { id: 'reports', name: '排名报告' }
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
            {/* 关键词管理标签页 */}
            {activeTab === 'keywords' && (
              <div className="space-y-6">
                {/* 添加关键词 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">添加新关键词</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="关键词"
                      value={newKeyword.keyword}
                      onChange={(e) => setNewKeyword({...newKeyword, keyword: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      placeholder="目标URL (可选)"
                      value={newKeyword.targetUrl}
                      onChange={(e) => setNewKeyword({...newKeyword, targetUrl: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newKeyword.frequency}
                      onChange={(e) => setNewKeyword({...newKeyword, frequency: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">每日检查</option>
                      <option value="weekly">每周检查</option>
                      <option value="monthly">每月检查</option>
                    </select>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={addKeyword}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      添加关键词
                    </button>
                    <button
                      onClick={checkAllRankings}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      检查所有排名
                    </button>
                  </div>
                </div>

                {/* 关键词列表 */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          关键词
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          目标URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          搜索引擎
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          最后检查
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          状态
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {keywords.map((keyword) => (
                        <tr key={keyword.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {keyword.keyword}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {keyword.targetUrl || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-1">
                              {keyword.searchEngines.map((engine) => (
                                <span
                                  key={engine}
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEngineColor(engine)}`}
                                >
                                  {engine}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {keyword.lastChecked ? formatDate(keyword.lastChecked) : '从未'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              keyword.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {keyword.active ? '活跃' : '暂停'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => checkKeywordRanking(keyword.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                检查
                              </button>
                              <button
                                onClick={() => deleteKeyword(keyword.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 竞争对手标签页 */}
            {activeTab === 'competitors' && (
              <div className="space-y-6">
                {/* 添加竞争对手 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-4">添加竞争对手</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="竞争对手域名 (如: example.com)"
                      value={newCompetitor.domain}
                      onChange={(e) => setNewCompetitor({...newCompetitor, domain: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="关键词 (用逗号分隔)"
                      value={newCompetitor.keywords}
                      onChange={(e) => setNewCompetitor({...newCompetitor, keywords: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={addCompetitor}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    添加竞争对手
                  </button>
                </div>

                {/* 竞争对手列表 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {competitors.map((competitor) => (
                    <div key={competitor.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {competitor.domain}
                      </h4>
                      <div className="text-sm text-gray-600 mb-3">
                        <div>关键词数: {competitor.keywords?.length || 0}</div>
                        <div>最后检查: {competitor.lastChecked ? formatDate(competitor.lastChecked) : '从未'}</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900 text-sm">
                          分析
                        </button>
                        <button className="text-red-600 hover:text-red-900 text-sm">
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 排名通知标签页 */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="font-medium">最近排名变化通知</h3>
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            排名变化通知
                          </div>
                          <div className="text-sm text-gray-600">
                            关键词: {notification.keyword} | 搜索引擎: {notification.searchEngine}
                          </div>
                          <div className="text-sm text-gray-600">
                            排名变化: {notification.previousPosition} → {notification.currentPosition}
                            <span className={`ml-2 ${notification.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ({notification.change > 0 ? '+' : ''}{notification.change})
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 排名报告标签页 */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    排名报告功能
                  </h3>
                  <p className="text-gray-600">
                    详细的排名分析报告功能正在开发中...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}