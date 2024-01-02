import MemoryCache from './memory_cache'
import FileCache from './local_file_cache'
import MongoCache from './mongo_db_cache'
import BLOG from '@/blog.config'

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key, force) {
  if (BLOG.ENABLE_CACHE || force) {
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
  if (!BLOG.ENABLE_CACHE) {
    return
  }
  await getApi().delCache(key)
}

/**
 * 缓存实现类
 * @returns
 */
function getApi() {
  if (process.env.MONGO_DB_URL && process.env.MONGO_DB_NAME) {
    return MongoCache
  } else if (process.env.ENABLE_FILE_CACHE) {
    return FileCache
  } else {
    return MemoryCache
  }
}
