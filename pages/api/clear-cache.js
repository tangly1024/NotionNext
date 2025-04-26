import { clearLocalCache } from '@/lib/cache/cache_manager'

export default async function handler(req, res) {
  try {
    await clearLocalCache()
    res.status(200).json({
      success: true,
      message: '缓存已清除，请刷新页面以加载最新配置。'
    })
  } catch (error) {
    console.error('Error clearing cache:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
