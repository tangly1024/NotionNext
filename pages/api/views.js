import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'page-views.json')

/**
 * 确保数据文件存在
 */
function ensureDataFile() {
  const dataDir = path.join(process.cwd(), 'data')
  
  // 确保数据目录存在
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  // 确保数据文件存在
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}), 'utf-8')
  }
}

/**
 * 读取所有页面访问数据
 */
function readViewsData() {
  ensureDataFile()
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading views data:', error)
    return {}
  }
}

/**
 * 写入页面访问数据
 */
function writeViewsData(data) {
  ensureDataFile()
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error writing views data:', error)
    return false
  }
}

/**
 * API路由：获取或更新文章阅读次数
 * 每次请求都会获取最新数据，不使用缓存
 */
export default async function handler(req, res) {
  // 设置响应头，防止缓存
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  
  const { path: pagePath, increment } = req.query
  
  if (!pagePath) {
    return res.status(400).json({ error: 'Path parameter is required' })
  }
  
  try {
    // 读取当前数据
    const viewsData = readViewsData()
    
    // 如果该路径不存在，初始化为0
    if (!viewsData[pagePath]) {
      viewsData[pagePath] = {
        count: 0,
        lastUpdated: new Date().toISOString()
      }
    }
    
    // 如果请求包含increment=true参数，增加访问计数
    if (increment === 'true' && req.method === 'POST') {
      viewsData[pagePath].count += 1
      viewsData[pagePath].lastUpdated = new Date().toISOString()
      writeViewsData(viewsData)
    }
    
    // 返回结果
    return res.status(200).json({ 
      path: pagePath,
      count: viewsData[pagePath].count,
      lastUpdated: viewsData[pagePath].lastUpdated,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error handling views request:', error)
    return res.status(500).json({ error: 'Failed to process view count' })
  }
} 