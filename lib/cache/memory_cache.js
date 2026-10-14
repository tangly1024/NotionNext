import cache from 'memory-cache'
import BLOG from '@/blog.config'
import { dataCachePrefix } from './namespace'

const cacheTime = BLOG.isProd ? 10 * 60 : 120 * 60 // 120 minutes for dev,10 minutes for prod

export async function getCache(key, options) {
  return await cache.get(dataCachePrefix + key)
}

export async function setCache(key, data, customCacheTime) {
  await cache.put(dataCachePrefix + key, data, (customCacheTime || cacheTime) * 1000)
}

export async function delCache(key) {
  await cache.del(dataCachePrefix + key)
}

export function cleanCache() {
  for (const key of cache.keys()) {
    if (key.startsWith(dataCachePrefix)) cache.del(key)
  }
}

export default { getCache, setCache, delCache, cleanCache }
