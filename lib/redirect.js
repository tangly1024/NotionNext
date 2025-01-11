import fs from 'fs'
import { redisCacheTime, redisClient } from '@/lib/cache/redis_cache'
import {
  upstashRedisCacheTime,
  upstashRedisClient
} from '@/lib/cache/upstash_redis_cache'
import BLOG from '@/blog.config'

export async function generateRedirectJson({ allPages }) {
  let uuidSlugMap = {}
  allPages.forEach(page => {
    if (page.type === 'Post' && page.status === 'Published') {
      uuidSlugMap[page.id] = page.slug
    }
  })
  if (upstashRedisClient) {
    try {
      await upstashRedisClient.hset(BLOG.REDIRECT_CACHE_KEY, uuidSlugMap)

      await upstashRedisClient.expire(
        BLOG.REDIRECT_CACHE_KEY,
        upstashRedisCacheTime
      )
    } catch (e) {
      console.warn('写入 upstashRedis 失败', e)
    }
  } else if (redisClient) {
    try {
      await redisClient.hset(
        BLOG.REDIRECT_CACHE_KEY,
        uuidSlugMap,
        async () =>
          await redisClient.expire(BLOG.REDIRECT_CACHE_KEY, redisCacheTime)
      )
    } catch (e) {
      console.warn('写入Redis失败', e)
    }
  } else {
    try {
      fs.writeFileSync('./public/redirect.json', JSON.stringify(uuidSlugMap))
    } catch (error) {
      console.warn('无法写入文件', error)
    }
  }
}
