/**
 * API路由：获取文章阅读次数
 * 每次请求都会获取最新数据，不使用缓存
 */
export default async function handler(req, res) {
  const { path } = req.query
  
  if (!path) {
    return res.status(400).json({ error: 'Path parameter is required' })
  }
  
  try {
    // 设置响应头，防止缓存
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    
    // 获取实时浏览量
    // 这里通过不蒜子API获取最新统计数据
    // 如果你有其他统计服务，可以替换为对应的API调用
    const viewCount = await fetchRealTimeViews(path)
    
    // 返回结果
    return res.status(200).json({ 
      path,
      count: viewCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching view count:', error)
    return res.status(500).json({ error: 'Failed to fetch view count' })
  }
}

/**
 * 获取实时浏览量
 * 这里使用自定义实现，根据实际情况修改
 */
async function fetchRealTimeViews(path) {
  // 模拟从数据库或第三方服务获取数据
  // 这里仅作为示例，实际应用中应该连接到真实数据源
  
  try {
    // 如果你使用不蒜子等第三方统计服务，可以通过API获取最新数据
    // 如果你使用自己的数据库，可以从数据库中获取并更新计数
    
    // 这里模拟一个随机数，实际应用中应替换为真实实现
    // 可以使用以下方法之一：
    // 1. 调用不蒜子API获取最新数据
    // 2. 从数据库中读取并更新访问计数
    // 3. 使用Redis等缓存存储访问计数
    
    // 模拟从数据库读取的延迟
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 基于路径生成一个稳定的数字（实际应用中替换为真实数据）
    const hash = path.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    // 生成一个基于路径的伪随机数，但每次请求都略有增加，模拟访问增长
    const baseCount = Math.abs(hash % 1000) + 100
    const time = Math.floor(Date.now() / 10000) // 变化较慢，每10秒变化一次
    const viewCount = baseCount + (time % 10)
    
    return viewCount
  } catch (error) {
    console.error('Error in fetchRealTimeViews:', error)
    return 0
  }
} 