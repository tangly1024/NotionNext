import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import Redis from 'ioredis'
import { dataCachePrefix } from './namespace'

export const redisClient = BLOG.REDIS_URL ? new Redis(BLOG.REDIS_URL) : {}

const cacheTime = Math.trunc(
  siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND) * 1.5
)

export async function getCache(key) {
    const data = await redisClient.get(dataCachePrefix + key)
    return data ? JSON.parse(data) : null
}

export async function setCache(key, data, customCacheTime) {
    await redisClient.set(
      dataCachePrefix + key,
      JSON.stringify(data),
      'EX',
      customCacheTime || cacheTime
    )
}

export async function delCache(key) {
  await redisClient.del(dataCachePrefix + key)
}

export async function cleanCache() {
  let cursor = '0'
  do {
    const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', dataCachePrefix + '*', 'COUNT', 250)
    cursor = nextCursor
    if (keys.length) await redisClient.del(...keys)
  } while (cursor !== '0')
}

export default { getCache, setCache, delCache, cleanCache }
