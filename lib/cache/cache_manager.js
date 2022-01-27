import { getCacheFromMemory, setCacheToMemory, delCacheFromMemory } from '@/lib/cache/memory_cache'
// import { getCacheFromFile, setCacheToFile, delCacheFromFile } from './local_file_cache'
const enableCache = true // 生产环境禁用

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache (key) {
  if (!enableCache) {
    return null
  }
  const dataFromCache = await getCacheFromMemory(key)
  if (JSON.stringify(dataFromCache) === '[]') {
    return null
  }
  return dataFromCache
}

export async function setDataToCache (key, data) {
  if (!enableCache || !data) {
    return
  }
  await setCacheToMemory(key, data)
}

export async function delCacheData (key) {
  if (!enableCache) {
    return
  }
  await delCacheFromMemory(key)
}
