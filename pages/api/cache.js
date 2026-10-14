import { clearDataCache } from '@/lib/cache/cache_manager'

export const config = { maxDuration: 60 }

/**
 * 清理缓存
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }

  const token = process.env.CACHE_REVALIDATION_TOKEN
  if (!token) return res.status(503).json({ status: 'error', message: 'Cache maintenance is disabled' })
  if (req.headers.authorization !== `Bearer ${token}`) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }

  try {
    const stores = await clearDataCache()
    res.status(200).json({ status: 'success', message: 'Data cache cleared', stores })
  } catch (error) {
    console.error('Cache clean error:', error)
    res.status(503).json({ status: 'error', message: 'Cache invalidation failed' })
  }
}
