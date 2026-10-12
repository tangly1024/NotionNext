/** @jest-environment node */
import {
  clearDataCache,
  getOrSetDataWithCache
} from '@/lib/cache/cache_manager'
import memoryCache from '@/lib/cache/memory_cache'
import fileCache from '@/lib/cache/local_file_cache'
import redisCache from '@/lib/cache/redis_cache'
import {
  getCacheGeneration,
  rotateCacheGeneration
} from '@/lib/cache/invalidation'

jest.mock('@/blog.config', () => ({
  isProd: true,
  ENABLE_CACHE: true,
  REDIS_URL: 'fixture'
}))
jest.mock('@/lib/cache/invalidation', () => ({
  getCacheGeneration: jest.fn(),
  rotateCacheGeneration: jest.fn()
}))
jest.mock('@/lib/cache/local_file_cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  cleanCache: jest.fn()
}))
jest.mock('@/lib/cache/memory_cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  cleanCache: jest.fn()
}))
jest.mock('@/lib/cache/redis_cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  cleanCache: jest.fn()
}))
let generation
let entries
beforeEach(() => {
  generation = 'before'
  entries = new Map()
  getCacheGeneration.mockImplementation(async () => generation)
  rotateCacheGeneration.mockImplementation(async () => {
    generation = 'after'
  })
  redisCache.getCache.mockImplementation(async key => entries.get(key))
  redisCache.setCache.mockImplementation(async (key, data) => {
    entries.set(key, data)
  })
  redisCache.cleanCache.mockImplementation(async () => {
    entries.clear()
  })
  memoryCache.cleanCache.mockReset()
  fileCache.cleanCache.mockReset()
})

it('invalidates file, memory, and Redis instead of one store', async () => {
  expect(await clearDataCache()).toEqual(['file', 'memory', 'redis'])
  for (const store of [fileCache, memoryCache, redisCache])
    expect(store.cleanCache).toHaveBeenCalledTimes(1)
})
it('still clears other stores when file cleanup throws synchronously', async () => {
  fileCache.cleanCache.mockImplementation(() => {
    throw new Error('read-only')
  })
  await expect(clearDataCache()).rejects.toThrow('file')
  expect(memoryCache.cleanCache).toHaveBeenCalled()
  expect(redisCache.cleanCache).toHaveBeenCalled()
})
it('does not read a stale result that finishes after invalidation', async () => {
  let finishOld
  let started
  const start = new Promise(resolve => {
    started = resolve
  })
  const old = getOrSetDataWithCache('article', () => {
    started()
    return new Promise(resolve => {
      finishOld = resolve
    })
  })
  await start
  await clearDataCache()
  expect(await getOrSetDataWithCache('article', async () => 'fresh')).toBe(
    'fresh'
  )
  finishOld('stale')
  await old
  const fetchAgain = jest.fn()
  expect(await getOrSetDataWithCache('article', fetchAgain)).toBe('fresh')
  expect(fetchAgain).not.toHaveBeenCalled()
})
it('observes a generation changed by another process', async () => {
  expect(await getOrSetDataWithCache('article', async () => 'old')).toBe('old')
  generation = 'other-process'
  expect(await getOrSetDataWithCache('article', async () => 'fresh')).toBe(
    'fresh'
  )
})
