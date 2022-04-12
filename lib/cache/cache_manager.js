import { getCacheFromMemory as getCache, setCacheToMemory as setCache, delCacheFromMemory as delCache } from '@/lib/cache/memory_cache'
// import { getCacheFromFile as getCache, setCacheToFile as setCache, delCacheFromFile as delCache } from './local_file_cache'
const enableCache = true

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key) {
  if (!enableCache) {
    return null
  }
  const dataFromCache = await getCache(key)
  if (JSON.stringify(dataFromCache) === '[]') {
    return null
  }
  return dataFromCache
}

export async function setDataToCache(key, data) {
  if (!enableCache || !data) {
    return
  }
  await setCache(key, data)
}

export async function delCacheData(key) {
  if (!enableCache) {
    return
  }
  await delCache(key)
}
