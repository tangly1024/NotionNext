import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'

// 配置是否开启Vercel环境中的缓存，因为Vercel中现有两种缓存方式在无服务环境下基本都是无意义的，纯粹的浪费资源
const enableCacheInVercel =
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'export' ||
  !BLOG['isProd']

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key, force) {
  if (enableCacheInVercel || BLOG.ENABLE_CACHE || force) {
    const dataFromCache = await cacheApi.getCache(key)
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
  if (!enableCacheInVercel || !data) {
    return
  }
  //   console.trace('[API-->>缓存写入]:', key)
  await cacheApi.setCache(key, data, customCacheTime)
}

export async function delCacheData(key) {
  if (!JSON.parse(BLOG.ENABLE_CACHE)) {
    return
  }
  await cacheApi.delCache(key)
}

// 缓存实现类
const cacheApi = process.env.ENABLE_FILE_CACHE ? FileCache : MemoryCache
