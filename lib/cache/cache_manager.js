import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key, force) {
  if (JSON.parse(BLOG.ENABLE_CACHE) || force) {
    const dataFromCache = await getApi().getCache(key)
    if (JSON.stringify(dataFromCache) === '[]') {
      return null
    }
    return getApi().getCache(key)
  } else {
    return null
  }
}

export async function setDataToCache(key, data) {
  if (!data) {
    return
  }
  await getApi().setCache(key, data)
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
