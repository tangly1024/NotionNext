import { getCache } from '@vercel/functions'

const cache = getCache()

const VercelCache = {
  async getCache(key) {
    const data = await cache.get(key)
    return data || null
  },

  async setCache(key, data, ttl = 3600) {
    await cache.set(key, data, {
      ttl,
      tags: ['notion']
    })
  },

  async delCache(key) {
    // ⚠️ vercel runtime cache 不支持直接删除
    // 可以用 tag 失效（可扩展）
    console.warn('[VercelCache] delete not supported, use tag invalidation')
  }
}

export default VercelCache