import { getGlobalData } from '@/lib/db/getSiteData'

export default async function handler(req, res) {
  try {
    const from = 'api-posts'
    const data = await getGlobalData({ from })
    
    // 过滤出文章类型的页面
    const posts = data.allPages?.filter(
      page => page.type === 'Post' && page.status === 'Published'
    ) || []
    
    res.status(200).json({
      success: true,
      posts: posts
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
