import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'
import RedisCache from './redis_cache'
import VercelCache from './vercel_cache'

const isBuildPhase =
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'export'


  
const enableLocalCache = isBuildPhase || !BLOG['isProd']
const hasRedis = !!BLOG.REDIS_URL

const inflightMap = new Map()

const pid = process.pid

function isRealVercelEnv() {
  return (
    process.env.VERCEL === '1' &&
    process.env.VERCEL_ENV &&   // production / preview
    process.env.VERCEL_REGION   // Vercel 特有
  )
}

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
 
  // cacheLog('MISS', key, '缓存未命中，发起真实请求')

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

  const chain = getCacheChain()

  for (const { name, api } of chain) {
    try {
      const data = await api.getCache(key)

      if (data && JSON.stringify(data) !== '[]') {
        cacheLog('HIT', key, `from:${name}`)
        return data
      }
    } catch (e) {
      console.warn(`[Cache] ${name} get failed key:${key}`, e.message)
    }
  }

  return null
}

export async function getDataFromCache(key, force) {
  if (!JSON.parse(BLOG.ENABLE_CACHE) && !force) return null

  const chain = getCacheChain()

  for (const { name, api } of chain) {
    try {
      const data = await api.getCache(key)

      if (data && JSON.stringify(data) !== '[]') {
        cacheLog('HIT', key, `from:${name}`)
        return data
      }
    } catch (e) {
      console.warn(`[Cache] ${name} get failed key:${key}`, e.message)
    }
  }

  return null
}

export async function delCacheData(key) {
  const chain = getCacheChain()

  for (const { name, api } of chain) {
    try {
      await api.delCache(key)
    } catch (e) {
      console.warn(`[Cache] ${name} del failed key:${key}`, e.message)
    }
  }
}

function getCacheType() {
  if (hasRedis) return 'redis'
  if (isRealVercelEnv()) return 'vercel'
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

function getCacheChain() {
  const chain = []

  if (hasRedis) {
    chain.push({ name: 'redis', api: RedisCache })
  }

  if (isRealVercelEnv()) {
    chain.push({ name: 'vercel', api: VercelCache })
  }

  if (isBuildPhase || !BLOG.isProd) {
    chain.push({ name: 'file', api: FileCache })
  }

  // 永远兜底
  chain.push({ name: 'memory', api: MemoryCache })

  return chain
}