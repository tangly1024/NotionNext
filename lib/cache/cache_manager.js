import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'
import RedisCache from './redis_cache'
// import VercelCache from './vercel_cache'

const cacheStats = {
  hit: 0,
  miss: 0,
  set: 0,
  error: 0,
  total: 0,
  perStore: {} // { redis: {hit, set}, memory: {...} }
}

const isBuildPhase =
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'export'

const enableLocalCache = isBuildPhase || !BLOG['isProd']
const hasRedis = !!BLOG.REDIS_URL

const inflightMap = new Map()

const pid = process.pid

function isVercelEnv() {
  return !!process.env.VERCEL
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
    // cacheLog('HIT', key)
    return dataFromCache
  }

  if (inflightMap.has(key)) {
    // cacheLog('INFLIGHT-WAIT', key)
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

export async function setDataToCache(key, data, customCacheTime) {
  if (!data) return

  const chain = getCacheChain()

  for (const { name, api } of chain) {
    try {
      await api.setCache(key, data, customCacheTime)
      // cacheLog('SET', key, `to:${name}`)

       cacheStats.set++
      cacheStats.perStore[name] = cacheStats.perStore[name] || { hit: 0, set: 0 }
      cacheStats.perStore[name].set++

      return
    } catch (e) {
      console.warn(`[Cache] ${name} set failed key:${key}`, e.message)
            cacheStats.error++

    }
  }

  console.warn(`[Cache] ALL set failed key:${key}`)
}

export async function getDataFromCache(key, force) {
  if (!JSON.parse(BLOG.ENABLE_CACHE) && !force) return null

  const chain = getCacheChain()

  for (const { name, api } of chain) {
    try {
      const data = await api.getCache(key)

      if (data && JSON.stringify(data) !== '[]') {
        // cacheLog('HIT', key, `from:${name}`)
         cacheStats.hit++
        cacheStats.perStore[name] = cacheStats.perStore[name] || { hit: 0, set: 0 }
        cacheStats.perStore[name].hit++
        return data
      }
    } catch (e) {
      cacheStats.error++
      console.warn(`[Cache] ${name} get failed key:${key}`, e.message)
    }
  }
  cacheStats.miss++
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
  if (isBuildPhase) return 'file'
  // if (isVercelEnv()) return 'vercel'
  return 'memory'
}

export function getApi() {
  const type = getCacheType()

  switch (type) {
    case 'redis':
      return RedisCache
    // case 'vercel':
    // VercelCache 目前不稳定（有大小限制），先注释掉
    //   return VercelCache
    // 文件速度和内存消耗存疑
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

  // if (isVercelEnv()) {
  //   chain.push({ name: 'vercel', api: VercelCache })
  // }

  if (isBuildPhase || !BLOG.isProd) {
    chain.push({ name: 'file', api: FileCache })
  }

  // 永远兜底
  chain.push({ name: 'memory', api: MemoryCache })

  return chain
}

function printCacheSummary() {
  const hitRate = cacheStats.total
    ? ((cacheStats.hit / cacheStats.total) * 100).toFixed(1)
    : 0

  console.log('\n[Cache Summary]')
  console.log('Strategy:', getCacheChain().map(c => c.name).join(' → '))
  console.log(
    `Stats: HIT ${hitRate}% | MISS ${cacheStats.miss} | ERROR ${cacheStats.error} | total ${cacheStats.total}`
  )

  console.log('[Per Store]')
  Object.entries(cacheStats.perStore).forEach(([name, stat]) => {
    console.log(`  ${name}: hit=${stat.hit || 0}, set=${stat.set || 0}`)
  })

  console.log('----------------------------------\n')
}

// Node 进程结束时触发
if (typeof process !== 'undefined') {
  process.on('exit', printCacheSummary)
}