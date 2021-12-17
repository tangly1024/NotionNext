import cache from 'memory-cache'

export async function getCacheFromMemory (key, options) {
  return cache.get(key)
}

export async function setCacheToMemory (key, data) {
  await cache.put(key, data, 30 * 60 * 1000) // 30 minutes
}
