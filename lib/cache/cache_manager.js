import { getCacheFromFile, setCacheToFile } from '@/lib/cache/local_file_cache'
import { getCacheFromMemory, setCacheToMemory } from '@/lib/cache/memory_cache'
import BLOG from '@/blog.config'
/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key 
 * @returns 
 */
export async function getDataFromCache (key) {
  let dataFromCache
  if (BLOG.isProd) {
    dataFromCache = await getCacheFromMemory(key)
  } else {
    dataFromCache = await getCacheFromFile(key)
  }
  return dataFromCache
}

export async function setDataToCache (key, data) {
  if (BLOG.isProd) {
    await setCacheToMemory(key, data)
  } else {
    await setCacheToFile(key, data)
  }
}
