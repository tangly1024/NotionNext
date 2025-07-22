import { useState, useEffect } from 'react'
import { initWebVitals, getWebVitalsSnapshot, WEB_VITALS_THRESHOLDS } from '../../lib/performance/webVitals'

/**
 * Web Vitals监控仪表板
 * 实时显示Core Web Vitals性能指标
 */
export default function WebVitalsDashboard({ 
  autoStart = true,
  showRecommendations = true,
  refreshInterval = 5000 
}) {
  const [vitals, setVitals] = useState({})
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [collector, setCollector] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (autoStart) {
      startMonitoring()
    }
    
    return () => {
      if (collector) {
        collector.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      const snapshot = getWebVitalsSnapshot()
      if (snapshot) {
        setVitals(snapshot)
        
        // 添加到历史记录
        setHistory(prev => {
          const newEntry = {
            timestamp: Date.now(),
            ...snapshot
          }
          return [...prev.slice(-19), newEntry] // 保留最近20条记录
        })
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [isMonitoring, refreshInterval])

  const startMonitoring = () => {
    if (typeof window === 'undefined') return

    const webVitalsCollector = initWebVitals({
      enableConsoleLog: true,
      sampleRate: 1.0 // 仪表板中使用100%采样率
    })
    
    setCollector(webVitalsCollector)
    setIsMonitoring(true)

    // 监听Web Vitals事件
    window.addEventListener('web-vital', (event) => {
      const { name, value, rating } = event.detail
      setVitals(prev => ({
        ...prev,
        coreWebVitals: {
          ...prev.coreWebVitals,
          [name]: { value, rating }
        }
      }))
    })
  }

  const stopMonitoring = () => {
    if (collector) {
      collector.destroy()
      setCollector(null)
    }
    setIsMonitoring(false)
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="web-vitals-dashboard">
      {/* 控制面板 */}
      <div className="dashboard-header mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Core Web Vitals 监控</h2>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${isMonitoring ? 'text-green-600' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              {isMonitoring ? '监控中' : '已停止'}
            </div>
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`px-4 py-2 rounded-lg font-medium ${
                isMonitoring 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isMonitoring ? '停止监控' : '开始监控'}
            </button>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
              >
                清除历史
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Core Web Vitals 指标卡片 */}
      <div className="vitals-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <VitalCard
          name="FCP"
          title="首次内容绘制"
          description="页面开始加载到任何内容渲染的时间"
          value={vitals.coreWebVitals?.FCP?.value}
          rating={vitals.coreWebVitals?.FCP?.rating}
          threshold={WEB_VITALS_THRESHOLDS.FCP}
          unit="ms"
        />
        <VitalCard
          name="LCP"
          title="最大内容绘制"
          description="页面主要内容完成渲染的时间"
          value={vitals.coreWebVitals?.LCP?.value}
          rating={vitals.coreWebVitals?.LCP?.rating}
          threshold={WEB_VITALS_THRESHOLDS.LCP}
          unit="ms"
        />
        <VitalCard
          name="FID"
          title="首次输入延迟"
          description="用户首次交互到浏览器响应的时间"
          value={vitals.coreWebVitals?.FID?.value}
          rating={vitals.coreWebVitals?.FID?.rating}
          threshold={WEB_VITALS_THRESHOLDS.FID}
          unit="ms"
        />
        <VitalCard
          name="CLS"
          title="累积布局偏移"
          description="页面加载期间布局稳定性的度量"
          value={vitals.coreWebVitals?.CLS?.value}
          rating={vitals.coreWebVitals?.CLS?.rating}
          threshold={WEB_VITALS_THRESHOLDS.CLS}
          unit=""
          precision={3}
        />
      </div>

      {/* 其他指标 */}
      <div className="other-vitals grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <VitalCard
          name="TTFB"
          title="首字节时间"
          description="服务器响应第一个字节的时间"
          value={vitals.otherMetrics?.TTFB?.value}
          rating={vitals.otherMetrics?.TTFB?.rating}
          threshold={WEB_VITALS_THRESHOLDS.TTFB}
          unit="ms"
        />
        <VitalCard
          name="INP"
          title="交互到下次绘制"
          description="用户交互的响应性度量"
          value={vitals.otherMetrics?.INP?.value}
          rating={vitals.otherMetrics?.INP?.rating}
          threshold={WEB_VITALS_THRESHOLDS.INP}
          unit="ms"
        />
      </div>

      {/* 总体评级 */}
      {vitals.overallRating && (
        <div className="overall-rating mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">总体性能评级</h3>
            <div className="flex items-center">
              <div className={`text-4xl font-bold mr-4 ${getRatingColor(vitals.overallRating)}`}>
                {getRatingIcon(vitals.overallRating)}
              </div>
              <div>
                <div className={`text-xl font-semibold ${getRatingColor(vitals.overallRating)}`}>
                  {getRatingText(vitals.overallRating)}
                </div>
                <div className="text-gray-600 text-sm">
                  基于Core Web Vitals指标的综合评估
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 历史趋势图 */}
      {history.length > 0 && (
        <div className="history-chart mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">性能趋势</h3>
            <VitalsChart data={history} />
          </div>
        </div>
      )}

      {/* 优化建议 */}
      {showRecommendations && vitals.coreWebVitals && (
        <div className="recommendations">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">优化建议</h3>
            <RecommendationsList vitals={vitals.coreWebVitals} />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 单个指标卡片组件
 */
function VitalCard({ name, title, description, value, rating, threshold, unit, precision = 0 }) {
  const formatValue = (val) => {
    if (val === undefined || val === null) return '--'
    return precision > 0 ? val.toFixed(precision) : Math.round(val)
  }

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'poor': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`vital-card bg-white rounded-lg shadow-md p-6 border-l-4 ${getRatingColor(rating)}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{name}</h4>
        {rating && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(rating)}`}>
            {rating === 'good' ? '良好' : rating === 'needs-improvement' ? '待改进' : '较差'}
          </span>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value)}{unit}
        </div>
        <div className="text-sm font-medium text-gray-700">{title}</div>
      </div>
      
      <div className="text-xs text-gray-500 mb-3">{description}</div>
      
      {threshold && (
        <div className="text-xs text-gray-400">
          良好: &lt; {threshold.good}{unit} | 
          待改进: &lt; {threshold.needsImprovement}{unit}
        </div>
      )}
    </div>
  )
}

/**
 * 性能趋势图组件
 */
function VitalsChart({ data }) {
  if (!data || data.length === 0) return <div className="text-gray-500">暂无数据</div>

  // 简化的图表实现
  return (
    <div className="chart-container">
      <div className="text-sm text-gray-600 mb-4">
        显示最近 {data.length} 个数据点的趋势
      </div>
      
      {/* 这里可以集成图表库如Chart.js, Recharts等 */}
      <div className="grid grid-cols-4 gap-4">
        {['FCP', 'LCP', 'FID', 'CLS'].map(metric => (
          <div key={metric} className="text-center">
            <div className="text-sm font-medium text-gray-700 mb-2">{metric}</div>
            <div className="h-20 bg-gray-100 rounded flex items-end justify-center">
              <div className="text-xs text-gray-500">图表占位</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 优化建议列表组件
 */
function RecommendationsList({ vitals }) {
  const recommendations = []

  Object.entries(vitals).forEach(([metric, data]) => {
    if (data.rating === 'poor' || data.rating === 'needs-improvement') {
      const metricRecommendations = getMetricRecommendations(metric, data.rating)
      recommendations.push(...metricRecommendations.map(rec => ({ metric, ...rec })))
    }
  })

  if (recommendations.length === 0) {
    return (
      <div className="text-green-600 flex items-center">
        <span className="text-2xl mr-2">🎉</span>
        <span>所有Core Web Vitals指标表现良好！</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-blue-600 mr-3 mt-1">
            <span className="text-lg">{rec.icon}</span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-blue-900 mb-1">
              {rec.metric} - {rec.title}
            </div>
            <div className="text-blue-800 text-sm">
              {rec.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * 获取指标优化建议
 */
function getMetricRecommendations(metric, rating) {
  const recommendations = {
    FCP: [
      {
        title: '优化关键渲染路径',
        description: '减少阻塞渲染的CSS和JavaScript资源',
        icon: '🚀'
      },
      {
        title: '启用资源预加载',
        description: '使用<link rel="preload">预加载关键资源',
        icon: '⚡'
      }
    ],
    LCP: [
      {
        title: '优化图片加载',
        description: '使用现代图片格式(WebP/AVIF)和适当的尺寸',
        icon: '🖼️'
      },
      {
        title: '改善服务器响应',
        description: '优化服务器配置和数据库查询',
        icon: '🔧'
      }
    ],
    FID: [
      {
        title: '减少JavaScript执行时间',
        description: '分割长任务，优化代码执行效率',
        icon: '⚡'
      },
      {
        title: '延迟非关键脚本',
        description: '使用async/defer属性延迟脚本执行',
        icon: '⏰'
      }
    ],
    CLS: [
      {
        title: '设置图片尺寸属性',
        description: '为所有图片和视频元素设置width和height',
        icon: '📐'
      },
      {
        title: '预留广告位空间',
        description: '为动态内容预留固定空间',
        icon: '📦'
      }
    ]
  }

  return recommendations[metric] || []
}

/**
 * 辅助函数
 */
function getRatingColor(rating) {
  switch (rating) {
    case 'good': return 'text-green-600'
    case 'needs-improvement': return 'text-yellow-600'
    case 'poor': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

function getRatingIcon(rating) {
  switch (rating) {
    case 'good': return '🟢'
    case 'needs-improvement': return '🟡'
    case 'poor': return '🔴'
    default: return '⚪'
  }
}

function getRatingText(rating) {
  switch (rating) {
    case 'good': return '良好'
    case 'needs-improvement': return '待改进'
    case 'poor': return '较差'
    default: return '未知'
  }
}