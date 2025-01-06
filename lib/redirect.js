import fs from 'fs'
import { redisCacheTime, redisClient } from '@/lib/cache/redis_cache'

export const redirectCacheKey = 'uuid_slug_map'

export async function generateRedirectJson({ allPages }) {
  let uuidSlugMap = {}
  allPages.forEach(page => {
    if (page.type === 'Post' && page.status === 'Published') {
      uuidSlugMap[page.id] = page.slug
    }
  })
  if (redisClient) {
    try {
      await redisClient.hset(
        redirectCacheKey,
        uuidSlugMap,
        async () => await redisClient.expire(redirectCacheKey, redisCacheTime)
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
