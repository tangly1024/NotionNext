import { redisClient } from '@/lib/cache/redis_cache'
import { redirectCacheKey } from '@/lib/redirect'

export default async function handler(req, res) {
  const { lastPart } = req.body
  try {
    const result = (await redisClient.hget(redirectCacheKey, lastPart)) || null
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'failed!', error })
  }
}
