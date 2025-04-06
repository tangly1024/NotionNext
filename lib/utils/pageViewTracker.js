/**
 * 页面浏览量跟踪工具
 * 用于记录和获取文章页面的访问次数
 */

/**
 * 增加页面访问计数
 * @param {string} pagePath - 页面路径或标识符 
 * @returns {Promise<Object>} - 包含更新后的计数信息
 */
export const incrementPageView = async (pagePath) => {
  if (!pagePath || typeof window === 'undefined') return null

  try {
    // 检查本地存储，避免重复计数同一次会话内的多次访问
    const viewedPages = getViewedPages()
    
    // 如果这个页面在当前会话中已经被记录过，则不再增加计数
    if (viewedPages.includes(pagePath)) {
      // 仅获取最新计数而不增加
      return await fetchPageViews(pagePath)
    }
    
    // 将页面添加到已访问列表
    addToViewedPages(pagePath)
    
    // 发送POST请求增加计数
    const response = await fetch('/api/incrementView', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({ path: pagePath })
    })
    
    if (!response.ok) {
      console.error('Failed to increment page view', response.statusText)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error incrementing page view:', error)
    return null
  }
}

/**
 * 获取页面的访问计数
 * @param {string} pagePath - 页面路径或标识符
 * @returns {Promise<Object>} - 包含页面访问计数信息
 */
export const fetchPageViews = async (pagePath) => {
  if (!pagePath || typeof window === 'undefined') return null
  
  try {
    // 添加时间戳参数避免缓存
    const timestamp = new Date().getTime()
    const response = await fetch(`/api/views?path=${pagePath}&t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (!response.ok) {
      console.error('Failed to fetch page views', response.statusText)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching page views:', error)
    return null
  }
}

/**
 * 从本地存储获取当前会话已访问的页面列表
 * @returns {Array<string>} - 已访问页面路径列表
 */
const getViewedPages = () => {
  if (typeof window === 'undefined') return []
  
  try {
    const viewedPagesStr = localStorage.getItem('viewedPages')
    return viewedPagesStr ? JSON.parse(viewedPagesStr) : []
  } catch (error) {
    console.error('Error getting viewed pages from storage:', error)
    return []
  }
}

/**
 * 将页面添加到已访问列表
 * @param {string} pagePath - 页面路径
 */
const addToViewedPages = (pagePath) => {
  if (typeof window === 'undefined') return
  
  try {
    const viewedPages = getViewedPages()
    
    if (!viewedPages.includes(pagePath)) {
      viewedPages.push(pagePath)
      localStorage.setItem('viewedPages', JSON.stringify(viewedPages))
    }
  } catch (error) {
    console.error('Error adding page to viewed pages:', error)
  }
}

/**
 * 重置已访问页面列表（例如在用户会话结束时）
 */
export const resetViewedPages = () => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem('viewedPages')
  } catch (error) {
    console.error('Error resetting viewed pages:', error)
  }
} 