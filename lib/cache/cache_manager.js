import BLOG from '@/blog.config'
import { getCacheFromFile, setCacheToFile } from '@/lib/cache/local_file_cache'
import { getCacheFromMemory, setCacheToMemory } from '@/lib/cache/memory_cache'
const enableCache = true && !BLOG.isProd // 生产环境禁用
const cacheProvider = 'memory' // ['memory','file'] 用内存或data.json做缓存

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache (key) {
  if (!enableCache) {
    return null
  }
  let dataFromCache
  switch (cacheProvider) {
    case 'memory':
      dataFromCache = await getCacheFromMemory(key)
      break
    case 'file':
      dataFromCache = await getCacheFromFile(key)
      break
    default:
      break
  }

  return dataFromCache
}

export async function setDataToCache (key, data) {
  if (!enableCache || !data) {
    return
  }
  switch (cacheProvider) {
    case 'memory':
      await setCacheToMemory(key, data)
      break
    case 'file':
      await setCacheToFile(key, data)
      break
    default:
      break
  }
}
