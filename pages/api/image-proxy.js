import { NextResponse } from 'next/server'

/**
 * 图片代理API - 解决Notion图片URL过期419错误
 * 
 * 使用方法:
 * /api/image-proxy?url=https://file.notion.so/...
 */
export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.query

  // 验证URL参数
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' })
  }

  // 验证是否为Notion图片URL
  if (!isNotionImageUrl(url)) {
    return res.status(400).json({ error: 'Invalid Notion image URL' })
  }

  try {
    // 设置缓存头
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400') // 24小时缓存
    res.setHeader('CDN-Cache-Control', 'public, max-age=86400')
    
    // 代理请求到Notion
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NotionNext/1.0)',
        'Accept': 'image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site'
      },
      timeout: 10000 // 10秒超时
    })

    // 检查响应状态
    if (!response.ok) {
      console.error(`Image proxy failed: ${response.status} ${response.statusText} for URL: ${url}`)
      
      // 如果是419错误，尝试刷新URL
      if (response.status === 419) {
        return res.status(419).json({ 
          error: 'Image URL expired', 
          message: 'Please refresh the page to get updated image URLs',
          code: 'IMAGE_EXPIRED'
        })
      }
      
      return res.status(response.status).json({ 
        error: `Failed to fetch image: ${response.statusText}`,
        originalStatus: response.status
      })
    }

    // 获取内容类型
    const contentType = response.headers.get('content-type') || 'image/png'
    
    // 验证是否为图片类型
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'Response is not an image' })
    }

    // 设置响应头
    res.setHeader('Content-Type', contentType)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    
    // 获取图片数据
    const imageBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(imageBuffer)
    
    // 返回图片数据
    res.status(200).send(buffer)

  } catch (error) {
    console.error('Image proxy error:', error)
    
    // 处理超时错误
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        error: 'Request timeout', 
        message: 'Image loading timed out'
      })
    }
    
    // 处理网络错误
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(502).json({ 
        error: 'Network error', 
        message: 'Unable to connect to image server'
      })
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to proxy image'
    })
  }
}

/**
 * 验证是否为有效的Notion图片URL
 */
function isNotionImageUrl(url) {
  try {
    const urlObj = new URL(url)
    
    // 检查域名
    const validDomains = [
      'file.notion.so',
      's3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com'
    ]
    
    if (!validDomains.some(domain => urlObj.hostname.includes(domain))) {
      return false
    }
    
    // 检查路径格式
    if (urlObj.hostname === 'file.notion.so') {
      return urlObj.pathname.startsWith('/f/f/')
    }
    
    return true
  } catch (error) {
    return false
  }
}

// 导出配置
export const config = {
  api: {
    responseLimit: '10mb', // 允许最大10MB的图片
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
}