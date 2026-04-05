import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'
import RedisCache from './redis_cache'
import VercelCache from './vercel_cache'

const isBuildPhase =
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'export'

const isVercel = !!process.env.VERCEL
const enableLocalCache = isBuildPhase || !BLOG['isProd']
const hasRedis = !!BLOG.REDIS_URL

const inflightMap = new Map()

const pid = process.pid

function cacheLog(action, key, extra = '') {
  const type = getCacheType()
  console.log(
    `[Cache][${type.toUpperCase()}][pid:${process.pid}] ${action} key:${key} ${extra}`
  )
}

export async function getOrSetDataWithCache(key, getDataFunction, ...getDataArgs) {
  return getOrSetDataWithCustomCache(key, null, getDataFunction, ...getDataArgs)
}

export async function getOrSetDataWithCustomCache(
  key,
  customCacheTime,
  getDataFunction,
  ...getDataArgs
) {
  const dataFromCache = await getDataFromCache(key)
  if (dataFromCache) {
    cacheLog('HIT', key)
    return dataFromCache
  }

  if (inflightMap.has(key)) {
    cacheLog('INFLIGHT-WAIT', key)
    return inflightMap.get(key)
  }
  cacheLog('MISS', key, '缓存未命中，发起真实请求')

  const promise = getDataFunction(...getDataArgs)
    .then(async data => {
      if (data) {
        await setDataToCache(key, data, customCacheTime)
        cacheLog('SET', key, '写入缓存成功')
      }
      inflightMap.delete(key)
      return data || null
    })
    .catch(err => {
      inflightMap.delete(key)
      cacheLog('ERROR', key, err.message)
      throw err
    })

  inflightMap.set(key, promise)
  return promise
}

export async function getDataFromCache(key, force) {
  if (!JSON.parse(BLOG.ENABLE_CACHE) && !force) return null

  try {
    const api = getApi()
    const data = await api.getCache(key)

    if (!data || JSON.stringify(data) === '[]') {
      cacheLog('MISS', key)
      return null
    }

    cacheLog('HIT', key)
    return data
  } catch (e) {
    console.warn(`[Cache] get failed key:${key}`, e.message)
    return null
  }
}

export async function setDataToCache(key, data, customCacheTime) {
  if (!data) return

  try {
    const api = getApi()

    await api.setCache(key, data, customCacheTime)

    cacheLog('SET', key, `ttl:${customCacheTime || 'default'}`)
  } catch (e) {
    console.warn(`[Cache] set failed key:${key}`, e.message)
  }
}

export async function delCacheData(key) {
  if (!JSON.parse(BLOG.ENABLE_CACHE)) return
  await getApi().delCache(key)
}

function getCacheType() {
  if (hasRedis) return 'redis'
  if (isVercel) return 'vercel'
  if (isBuildPhase) return 'file'
  return 'memory'
}

export function getApi() {
  const type = getCacheType()

  switch (type) {
    case 'redis':
      return RedisCache
    case 'vercel':
      return VercelCache
    case 'file':
      return FileCache
    default:
      return MemoryCache
  }
}