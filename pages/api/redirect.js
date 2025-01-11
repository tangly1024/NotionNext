import { redisCacheTime, redisClient } from '@/lib/cache/redis_cache'
import BLOG from '@/blog.config'

export default async function handler(req, res) {
  const { lastPart } = req.body
  try {
    const result =
      (await redisClient.hget(BLOG.REDIRECT_CACHE_KEY, lastPart)) || null
    res.setHeader(
      'Cache-Control',
      `public, max-age=${redisCacheTime}, stale-while-revalidate=${redisCacheTime / 6}`
    )
    res.status(200).json({ status: 'success', data: result })
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'failed!', error })
  }
}
