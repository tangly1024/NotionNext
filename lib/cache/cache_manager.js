import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'

/**
 * 尝试从缓存中获取数据，如果没有则尝试获取数据并写入缓存，最终返回所需数据
 * @param key
 * @param getDataFunction
 * @param getDataArgs
 * @returns {Promise<*|null>}
 */
export async function getOrSetDataWithCache(key, getDataFunction, ...getDataArgs) {
  return getOrSetDataWithCustomCache(key, null, getDataFunction, ...getDataArgs)
}


/**
 * 尝试从缓存中获取数据，如果没有则尝试获取数据并自定义写入缓存，最终返回所需数据
 * @param key
 * @param customCacheTime
 * @param getDataFunction
 * @param getDataArgs
 * @returns {Promise<*|null>}
 */
export async function getOrSetDataWithCustomCache(key, customCacheTime, getDataFunction, ...getDataArgs) {
  const dataFromCache = await getDataFromCache(key)
  if (dataFromCache) {
    console.log('[缓存-->>API]:', key)
    return dataFromCache
  }
  const data = await getDataFunction(...getDataArgs)
  if (data) {
    console.log('[API-->>缓存]:', key)
    await setDataToCache(key, data, customCacheTime)
  }
  return data || null
}

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key, force) {
  if (BLOG.ENABLE_CACHE || force) {
    const dataFromCache = await getApi().getCache(key)
    if (!dataFromCache || JSON.stringify(dataFromCache) === '[]') {
      return null
    }
    // console.trace('[API-->>缓存]:', key, dataFromCache)
    return dataFromCache
  } else {
    return null
  }
}

export async function setDataToCache(key, data, customCacheTime) {
  if (!data) {
    return
  }
  //   console.trace('[API-->>缓存写入]:', key)
  await getApi().setCache(key, data, customCacheTime)
}

export async function delCacheData(key) {
  if (!JSON.parse(BLOG.ENABLE_CACHE)) {
    return
  }
  await getApi().delCache(key)
}

/**
 * 缓存实现类
 * @returns
 */
function getApi() {
  if (process.env.ENABLE_FILE_CACHE) {
    return FileCache
  } else {
    return MemoryCache
  }
}
