import { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'

/**
 * 实时文章阅读次数统计组件
 * 不使用缓存，每次都实时获取最新数据
 */
const RealTimeViewCount = ({ post }) => {
  const { locale } = useGlobal()
  const [viewCount, setViewCount] = useState('--')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 确保在客户端执行
    if (typeof window === 'undefined') return
    
    const fetchViewCount = async () => {
      try {
        setLoading(true)
        
        // 构建请求路径，包含随机参数以避免缓存
        const timestamp = new Date().getTime()
        const postPath = post.slug || post.id
        const apiUrl = `/api/views?path=${postPath}&t=${timestamp}`
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setViewCount(data.count || 0)
        } else {
          console.error('Failed to fetch view count')
          setViewCount('--')
        }
      } catch (error) {
        console.error('Error fetching view count:', error)
        setViewCount('--')
      } finally {
        setLoading(false)
      }
    }
    
    fetchViewCount()
    
    // 可选：每30秒刷新一次数据
    const intervalId = setInterval(fetchViewCount, 30000)
    
    return () => clearInterval(intervalId)
  }, [post])

  if (!post) return null

  return (
    <span className='flex items-center transition-all duration-200'>
      <i className='fas fa-eye mr-1 text-gray-500 group-hover:text-red-400'></i>
      <span className={`number-transition ${loading ? 'animate-pulse' : ''}`}>
        {viewCount} <span className='text-xs'>{locale.COMMON.VIEWS}</span>
      </span>
    </span>
  )
}

export default RealTimeViewCount 