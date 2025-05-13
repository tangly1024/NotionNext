import BLOG from '@/blog.config'
import { Redis } from '@upstash/redis'

export const upstashRedisClient =
  BLOG.UPSTASH_REDIS_URL && BLOG.UPSTASH_REDIS_TOKEN
    ? new Redis({
        url: BLOG.UPSTASH_REDIS_URL,
        token: BLOG.UPSTASH_REDIS_TOKEN
      })
    : null

export const upstashRedisCacheTime = Math.trunc(
  BLOG.NEXT_REVALIDATE_SECOND * 1.5
)

export async function getCache(key) {
  try {
    const data = await upstashRedisClient.get(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('upstash 读取失败 ' + e)
  }
}

export async function setCache(key, data, customCacheTime) {
  try {
    await upstashRedisClient.set(
      key,
      JSON.stringify(data),
      'EX',
      customCacheTime || upstashRedisCacheTime
    )
  } catch (e) {
    console.error('upstash 写入失败 ' + e)
  }
}

export async function delCache(key) {
  try {
    await upstashRedisClient.del(key)
  } catch (e) {
    console.error('upstash 删除失败 ' + e)
  }
}

export default { getCache, setCache, delCache }
