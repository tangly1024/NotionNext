import cache from 'memory-cache'
import BLOG from 'blog.config'
import { isNotVercelProduction } from '@/lib/cache/cache_manager'

const cacheTime = BLOG.isProd ? 10 * 60 : 120 * 60 // 120 minutes for dev,10 minutes for prod

export async function getCache(key, options) {
  if (!isNotVercelProduction) {
    return
  }
  return await cache.get(key)
}

export async function setCache(key, data, customCacheTime) {
  if (!isNotVercelProduction) {
    return
  }
  await cache.put(key, data, (customCacheTime || cacheTime) * 1000)
}

export async function delCache(key) {
  if (!isNotVercelProduction) {
    return
  }
  await cache.del(key)
}

export default { getCache, setCache, delCache }
