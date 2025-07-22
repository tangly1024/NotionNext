/**
 * Web Vitals数据摘要API
 * 提供Web Vitals数据的统计和摘要信息
 */

export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { timeRange = '24h', metric } = req.query
    
    // 获取Web Vitals数据摘要
    const summary = await getWebVitalsSummary(timeRange, metric)
    
    res.status(200).json({
      success: true,
      data: summary,
      timeRange,
      generatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Web vitals summary API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * 获取Web Vitals数据摘要
 */
async function getWebVitalsSummary(timeRange, specificMetric) {
  try {
    // 从文件读取数据（实际应用中应该从数据库读取）
    const data = await readWebVitalsData(timeRange)
    
    if (!data || data.length === 0) {
      return {
        totalSamples: 0,
        metrics: {},
        trends: {},
        recommendations: []
      }
    }

    // 按指标分组数据
    const groupedData = groupDataByMetric(data, specificMetric)
    
    // 计算每个指标的统计信息
    const metrics = {}
    const trends = {}
    
    Object.entries(groupedData).forEach(([metricName, values]) => {
      const stats = calculateMetricStats(values)
      metrics[metricName] = stats
      trends[metricName] = calculateTrend(values)
    })

    // 生成优化建议
    const recommendations = generateRecommendations(metrics)

    return {
      totalSamples: data.length,
      metrics,
      trends,
      recommendations,
      timeRange
    }
    
  } catch (error) {
    console.error('Error getting web vitals summary:', error)
    return {
      totalSamples: 0,
      metrics: {},
      trends: {},
      recommendations: [],
      error: 'Failed to load data'
    }
  }
}

/**
 * 从文件读取Web Vitals数据
 */
async function readWebVitalsData(timeRange) {
  const fs = require('fs').promises
  const path = require('path')
  
  try {
    const logDir = path.join(process.cwd(), 'logs', 'web-vitals')
    
    // 根据时间范围确定要读取的文件
    const filesToRead = getFilesToRead(timeRange)
    const allData = []
    
    for (const fileName of filesToRead) {
      const filePath = path.join(logDir, fileName)
      
      try {
        const fileContent = await fs.readFile(filePath, 'utf8')
        const lines = fileContent.trim().split('\n').filter(line => line.trim())
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            allData.push(data)
          } catch (parseError) {
            console.warn('Failed to parse line:', line)
          }
        }
      } catch (fileError) {
        // 文件不存在或无法读取，跳过
        console.warn(`Could not read file ${fileName}:`, fileError.message)
      }
    }
    
    // 根据时间范围过滤数据
    const cutoffTime = getCutoffTime(timeRange)
    return allData.filter(item => item.timestamp >= cutoffTime)
    
  } catch (error) {
    console.error('Error reading web vitals data:', error)
    return []
  }
}

/**
 * 获取需要读取的文件列表
 */
function getFilesToRead(timeRange) {
  const today = new Date()
  const files = []
  
  switch (timeRange) {
    case '1h':
    case '24h':
      files.push(`${today.toISOString().split('T')[0]}.jsonl`)
      break
    case '7d':
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        files.push(`${date.toISOString().split('T')[0]}.jsonl`)
      }
      break
    case '30d':
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        files.push(`${date.toISOString().split('T')[0]}.jsonl`)
      }
      break
    default:
      files.push(`${today.toISOString().split('T')[0]}.jsonl`)
  }
  
  return files
}

/**
 * 获取时间截止点
 */
function getCutoffTime(timeRange) {
  const now = Date.now()
  
  switch (timeRange) {
    case '1h':
      return now - (60 * 60 * 1000)
    case '24h':
      return now - (24 * 60 * 60 * 1000)
    case '7d':
      return now - (7 * 24 * 60 * 60 * 1000)
    case '30d':
      return now - (30 * 24 * 60 * 60 * 1000)
    default:
      return now - (24 * 60 * 60 * 1000)
  }
}

/**
 * 按指标分组数据
 */
function groupDataByMetric(data, specificMetric) {
  const grouped = {}
  
  data.forEach(item => {
    if (specificMetric && item.metric !== specificMetric) return
    
    if (!grouped[item.metric]) {
      grouped[item.metric] = []
    }
    grouped[item.metric].push(item)
  })
  
  return grouped
}

/**
 * 计算指标统计信息
 */
function calculateMetricStats(values) {
  if (!values || values.length === 0) {
    return {
      count: 0,
      average: 0,
      median: 0,
      p75: 0,
      p95: 0,
      min: 0,
      max: 0,
      ratings: { good: 0, 'needs-improvement': 0, poor: 0 }
    }
  }

  const sortedValues = values.map(v => v.value).sort((a, b) => a - b)
  const ratings = { good: 0, 'needs-improvement': 0, poor: 0 }
  
  values.forEach(v => {
    if (ratings[v.rating] !== undefined) {
      ratings[v.rating]++
    }
  })

  return {
    count: values.length,
    average: sortedValues.reduce((sum, val) => sum + val, 0) / sortedValues.length,
    median: getPercentile(sortedValues, 50),
    p75: getPercentile(sortedValues, 75),
    p95: getPercentile(sortedValues, 95),
    min: sortedValues[0],
    max: sortedValues[sortedValues.length - 1],
    ratings
  }
}

/**
 * 计算百分位数
 */
function getPercentile(sortedArray, percentile) {
  const index = (percentile / 100) * (sortedArray.length - 1)
  const lower = Math.floor(index)
  const upper = Math.ceil(index)
  const weight = index % 1
  
  if (upper >= sortedArray.length) return sortedArray[sortedArray.length - 1]
  
  return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight
}

/**
 * 计算趋势
 */
function calculateTrend(values) {
  if (!values || values.length < 2) {
    return { direction: 'stable', change: 0 }
  }

  // 按时间排序
  const sortedByTime = values.sort((a, b) => a.timestamp - b.timestamp)
  
  // 计算最近一半和前一半的平均值
  const midPoint = Math.floor(sortedByTime.length / 2)
  const firstHalf = sortedByTime.slice(0, midPoint)
  const secondHalf = sortedByTime.slice(midPoint)
  
  const firstAvg = firstHalf.reduce((sum, v) => sum + v.value, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, v) => sum + v.value, 0) / secondHalf.length
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100
  
  let direction = 'stable'
  if (Math.abs(change) > 5) {
    direction = change > 0 ? 'increasing' : 'decreasing'
  }
  
  return { direction, change: Math.round(change * 100) / 100 }
}

/**
 * 生成优化建议
 */
function generateRecommendations(metrics) {
  const recommendations = []
  
  Object.entries(metrics).forEach(([metricName, stats]) => {
    const poorPercentage = (stats.ratings.poor / stats.count) * 100
    const needsImprovementPercentage = (stats.ratings['needs-improvement'] / stats.count) * 100
    
    if (poorPercentage > 25) {
      recommendations.push({
        priority: 'high',
        metric: metricName,
        issue: `${poorPercentage.toFixed(1)}% 的 ${metricName} 指标表现较差`,
        suggestion: getMetricSuggestion(metricName, 'poor')
      })
    } else if (needsImprovementPercentage > 50) {
      recommendations.push({
        priority: 'medium',
        metric: metricName,
        issue: `${needsImprovementPercentage.toFixed(1)}% 的 ${metricName} 指标需要改进`,
        suggestion: getMetricSuggestion(metricName, 'needs-improvement')
      })
    }
  })
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

/**
 * 获取指标建议
 */
function getMetricSuggestion(metric, rating) {
  const suggestions = {
    FCP: {
      poor: '优化关键渲染路径，减少阻塞渲染的资源',
      'needs-improvement': '启用资源预加载，优化CSS加载顺序'
    },
    LCP: {
      poor: '优化图片加载，改善服务器响应时间',
      'needs-improvement': '使用现代图片格式，启用CDN'
    },
    FID: {
      poor: '减少JavaScript执行时间，分割长任务',
      'needs-improvement': '优化事件处理器，延迟非关键脚本'
    },
    CLS: {
      poor: '为所有图片设置尺寸属性，避免动态内容插入',
      'needs-improvement': '预留广告位空间，使用transform动画'
    }
  }
  
  return suggestions[metric]?.[rating] || '请查看详细的性能优化指南'
}