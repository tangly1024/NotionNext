import MemoryCache from './memory_cache'
import FileCache from './local_file_cache'
import MongoCache from './mongo_db_cache'
const enableCache = true

let api
if (process.env.MONGO_DB_URL && process.env.MONGO_DB_NAME) {
  api = MongoCache
} else if (process.env.ENABLE_FILE_CACHE) {
  api = FileCache
} else {
  api = MemoryCache
}

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key) {
  if (!enableCache) {
    return null
  }
  const dataFromCache = await api.getCache(key)
  if (JSON.stringify(dataFromCache) === '[]') {
    return null
  }
  return api.getCache(key)
}

export async function setDataToCache(key, data) {
  if (!enableCache || !data) {
    return
  }
  await api.setCache(key, data)
}

export async function delCacheData(key) {
  if (!enableCache) {
    return
  }
  await api.delCache(key)
}
