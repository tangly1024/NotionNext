/**
 * Web Vitals数据收集API
 * 接收和存储Core Web Vitals性能数据
 */

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const vitalsData = req.body
    
    // 验证数据格式
    if (!vitalsData || !vitalsData.metric || typeof vitalsData.value !== 'number') {
      return res.status(400).json({ error: 'Invalid data format' })
    }

    // 数据清洗和验证
    const cleanedData = cleanVitalsData(vitalsData)
    
    // 存储数据（这里可以集成数据库或分析服务）
    await storeVitalsData(cleanedData)
    
    // 实时分析（可选）
    const analysis = analyzeVitalsData(cleanedData)
    
    res.status(200).json({ 
      success: true, 
      message: 'Web vitals data received',
      analysis 
    })
    
  } catch (error) {
    console.error('Web vitals API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * 清洗和验证Web Vitals数据
 */
function cleanVitalsData(data) {
  const allowedMetrics = ['FCP', 'LCP', 'FID', 'CLS', 'TTFB', 'INP']
  const allowedRatings = ['good', 'needs-improvement', 'poor']
  
  return {
    metric: allowedMetrics.includes(data.metric) ? data.metric : 'unknown',
    value: Math.round(data.value * 100) / 100, // 保留2位小数
    rating: allowedRatings.includes(data.rating) ? data.rating : 'unknown',
    timestamp: data.timestamp || Date.now(),
    url: sanitizeUrl(data.url),
    userAgent: sanitizeUserAgent(data.userAgent),
    connection: data.connection ? {
      effectiveType: data.connection.effectiveType,
      downlink: data.connection.downlink,
      rtt: data.connection.rtt,
      saveData: Boolean(data.connection.saveData)
    } : null,
    viewport: data.viewport ? {
      width: Math.max(0, Math.min(10000, data.viewport.width)),
      height: Math.max(0, Math.min(10000, data.viewport.height)),
      devicePixelRatio: Math.max(0, Math.min(10, data.viewport.devicePixelRatio))
    } : null,
    isFinal: Boolean(data.isFinal),
    sessionId: generateSessionId(data)
  }
}

/**
 * 清理URL
 */
function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return ''
  
  try {
    const urlObj = new URL(url)
    // 移除敏感查询参数
    const sensitiveParams = ['token', 'key', 'password', 'secret']
    sensitiveParams.forEach(param => {
      urlObj.searchParams.delete(param)
    })
    return urlObj.toString().substring(0, 500) // 限制长度
  } catch {
    return ''
  }
}

/**
 * 清理User Agent
 */
function sanitizeUserAgent(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return ''
  return userAgent.substring(0, 200) // 限制长度
}

/**
 * 生成会话ID
 */
function generateSessionId(data) {
  // 基于URL、用户代理和时间戳生成简单的会话ID
  const baseString = `${data.url}-${data.userAgent}-${Math.floor(data.timestamp / 300000)}` // 5分钟窗口
  return Buffer.from(baseString).toString('base64').substring(0, 16)
}

/**
 * 存储Web Vitals数据
 */
async function storeVitalsData(data) {
  // 这里可以集成各种存储方案：
  
  // 1. 文件存储（简单方案）
  await storeToFile(data)
  
  // 2. 数据库存储（推荐）
  // await storeToDatabase(data)
  
  // 3. 第三方分析服务
  // await sendToAnalytics(data)
}

/**
 * 文件存储实现
 */
async function storeToFile(data) {
  const fs = require('fs').promises
  const path = require('path')
  
  try {
    const logDir = path.join(process.cwd(), 'logs', 'web-vitals')
    await fs.mkdir(logDir, { recursive: true })
    
    const today = new Date().toISOString().split('T')[0]
    const logFile = path.join(logDir, `${today}.jsonl`)
    
    const logEntry = JSON.stringify(data) + '\n'
    await fs.appendFile(logFile, logEntry)
  } catch (error) {
    console.error('Failed to store web vitals to file:', error)
  }
}

/**
 * 数据库存储实现（示例）
 */
async function storeToDatabase(data) {
  // 这里可以集成数据库，例如：
  // - MongoDB
  // - PostgreSQL
  // - MySQL
  // - Firebase
  // - Supabase
  
  // 示例代码：
  /*
  const db = getDatabase() // 获取数据库连接
  await db.collection('web_vitals').insertOne({
    ...data,
    createdAt: new Date()
  })
  */
  
  // 暂时使用控制台输出作为占位符
  console.log('Would store to database:', data)
}

/**
 * 发送到第三方分析服务
 */
async function sendToAnalytics(data) {
  // 可以发送到：
  // - Google Analytics 4
  // - Adobe Analytics
  // - Mixpanel
  // - 自定义分析服务
  
  // Google Analytics 4 示例：
  /*
  if (process.env.GA_MEASUREMENT_ID) {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: data.sessionId,
        events: [{
          name: 'web_vital',
          params: {
            metric_name: data.metric,
            metric_value: data.value,
            metric_rating: data.rating
          }
        }]
      })
    })
  }
  */
}

/**
 * 分析Web Vitals数据
 */
function analyzeVitalsData(data) {
  const analysis = {
    metric: data.metric,
    performance: getPerformanceLevel(data.metric, data.value),
    recommendations: getRecommendations(data.metric, data.rating, data),
    benchmarks: getBenchmarks(data.metric)
  }
  
  return analysis
}

/**
 * 获取性能等级
 */
function getPerformanceLevel(metric, value) {
  const thresholds = {
    FCP: { excellent: 1000, good: 1800, poor: 3000 },
    LCP: { excellent: 1500, good: 2500, poor: 4000 },
    FID: { excellent: 50, good: 100, poor: 300 },
    CLS: { excellent: 0.05, good: 0.1, poor: 0.25 },
    TTFB: { excellent: 500, good: 800, poor: 1800 },
    INP: { excellent: 100, good: 200, poor: 500 }
  }
  
  const threshold = thresholds[metric]
  if (!threshold) return 'unknown'
  
  if (value <= threshold.excellent) return 'excellent'
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * 获取优化建议
 */
function getRecommendations(metric, rating, data) {
  if (rating === 'good') return []
  
  const recommendations = {
    FCP: [
      '优化关键渲染路径',
      '减少阻塞渲染的资源',
      '优化CSS和JavaScript加载',
      '使用资源预加载'
    ],
    LCP: [
      '优化图片加载和格式',
      '改善服务器响应时间',
      '移除阻塞渲染的资源',
      '使用CDN加速内容分发'
    ],
    FID: [
      '减少JavaScript执行时间',
      '分割长任务',
      '优化第三方脚本',
      '使用Web Workers'
    ],
    CLS: [
      '为图片和视频设置尺寸属性',
      '避免在现有内容上方插入内容',
      '使用transform动画替代改变布局的动画',
      '预留广告位空间'
    ],
    TTFB: [
      '优化服务器配置',
      '使用CDN',
      '优化数据库查询',
      '启用缓存策略'
    ],
    INP: [
      '优化事件处理器',
      '减少DOM操作',
      '使用防抖和节流',
      '优化JavaScript性能'
    ]
  }
  
  return recommendations[metric] || []
}

/**
 * 获取基准数据
 */
function getBenchmarks(metric) {
  const benchmarks = {
    FCP: { good: '< 1.8s', poor: '> 3.0s' },
    LCP: { good: '< 2.5s', poor: '> 4.0s' },
    FID: { good: '< 100ms', poor: '> 300ms' },
    CLS: { good: '< 0.1', poor: '> 0.25' },
    TTFB: { good: '< 800ms', poor: '> 1800ms' },
    INP: { good: '< 200ms', poor: '> 500ms' }
  }
  
  return benchmarks[metric] || {}
}