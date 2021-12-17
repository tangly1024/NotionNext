import cache from 'memory-cache'
import BLOG from 'blog.config'

const cacheTime = BLOG.isProd ? 60 : 60 * 60

export async function getCacheFromMemory (key, options) {
  return cache.get(key)
}

export async function setCacheToMemory (key, data) {
  await cache.put(key, data, cacheTime * 1000)
}
