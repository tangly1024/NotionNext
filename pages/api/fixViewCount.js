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
 * API路由：修复视图计数数据，移除路径前缀
 */
export default async function handler(req, res) {
  // 设置响应头，防止缓存
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  
  try {
    // 读取当前数据
    const viewsData = readViewsData()
    const oldKeys = Object.keys(viewsData)
    const result = {
      fixed: 0,
      total: oldKeys.length,
      details: []
    }
    
    // 新的数据对象
    const newViewsData = {}
    
    // 处理每个键
    for (const key of oldKeys) {
      const data = viewsData[key]
      let newKey = key
      
      // 如果键包含路径分隔符，提取最后一部分作为新键
      if (key.includes('/')) {
        const segments = key.split('/')
        newKey = segments[segments.length - 1]
        result.fixed++
        result.details.push({
          oldKey: key,
          newKey: newKey,
          count: data.count
        })
      }
      
      // 如果新键已存在，合并计数
      if (newViewsData[newKey]) {
        newViewsData[newKey] = {
          count: newViewsData[newKey].count + data.count,
          lastUpdated: new Date().toISOString()
        }
      } else {
        newViewsData[newKey] = data
      }
    }
    
    // 保存修复后的数据
    const success = writeViewsData(newViewsData)
    
    if (!success) {
      return res.status(500).json({ 
        error: 'Failed to write fixed view count data',
        result
      })
    }
    
    // 返回结果
    return res.status(200).json({ 
      success: true,
      result
    })
  } catch (error) {
    console.error('Error fixing view counts:', error)
    return res.status(500).json({ error: 'Failed to fix view counts' })
  }
} 