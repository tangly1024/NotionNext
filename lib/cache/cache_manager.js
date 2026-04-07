import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'
import RedisCache from './redis_cache'
import { withFileLock } from './file_lock'

const cacheStats = {
  hit: 0,
  miss: 0,
  set: 0,
  error: 0,
  total: 0,
  perStore: {}
}

const isBuildPhase =
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'export'

const enableLocalCache = isBuildPhase || !BLOG['isProd']
const hasRedis = !!BLOG.REDIS_URL

// 进程内 inflight 去重（单 Worker 内仍然有效）
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
  // 1. 读缓存（内存 / 文件 / Redis）
  const dataFromCache = await getDataFromCache(key)
  if (dataFromCache) {
    return dataFromCache
  }

  // 2. 进程内 inflight 去重（同一 Worker 内并发时只发一次）
  if (inflightMap.has(key)) {
    return inflightMap.get(key)
  }

  cacheLog('MISS', key, '缓存未命中，发起真实请求')

  // 3. 构建阶段（多 Worker）：用文件锁保证跨进程只请求一次
  if (isBuildPhase) {
    const promise = withFileLock(
      key,
      async () => {
        // 持锁后 double-check，防止等待期间已有其他 Worker 写入
        const doubleCheck = await getDataFromCache(key)
        if (doubleCheck) {
          cacheLog('DOUBLE-CHECK-HIT', key, '锁内命中缓存')
          return doubleCheck
        }

        const data = await getDataFunction(...getDataArgs)
        if (data) {
          await setDataToCache(key, data, customCacheTime)
          cacheLog('SET', key, '写入缓存成功')
        }
        return data || null
      },
      () => getDataFromCache(key) // 等待锁释放后重读
    ).catch(err => {
      cacheLog('ERROR', key, err.message)
      throw err
    })

    inflightMap.set(key, promise)
    promise.finally(() => inflightMap.delete(key))
    return promise
  }

  // 4. 非构建阶段（运行时）：保持原有 inflight 逻辑即可
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
  return 'memory'
}

export function getApi() {
  const type = getCacheType()
  switch (type) {
    case 'redis': return RedisCache
    case 'file':  return FileCache
    default:      return MemoryCache
  }
}

function getCacheChain() {
  const chain = []
  if (hasRedis) chain.push({ name: 'redis', api: RedisCache })
  if (isBuildPhase || !BLOG.isProd) chain.push({ name: 'file', api: FileCache })
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

if (typeof process !== 'undefined') {
  process.on('exit', printCacheSummary)
}