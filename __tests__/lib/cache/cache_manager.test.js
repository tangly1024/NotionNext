// __tests__/lib/cache/cache_manager.test.js
import {
  getDataFromCache,
  setDataToCache,
  getOrSetDataWithCache,
  delCacheData,
  getApi
} from '@/lib/cache/cache_manager'

// Mock BLOG config
jest.mock('@/blog.config', () => ({
  ENABLE_CACHE: 'true',
  isProd: false
}))

// Mock cache implementations
jest.mock('@/lib/cache/memory_cache', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  delCache: jest.fn()
}))

describe('Cache Manager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDataFromCache', () => {
    it('returns cached data when available', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      MemoryCache.getCache.mockResolvedValue({ data: 'cached' })
      
      const result = await getDataFromCache('test-key')
      
      expect(result).toEqual({ data: 'cached' })
      expect(MemoryCache.getCache).toHaveBeenCalledWith('test-key')
    })

    it('returns null when cache is empty', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      MemoryCache.getCache.mockResolvedValue(null)
      
      const result = await getDataFromCache('test-key')
      
      expect(result).toBeNull()
    })

    it('returns null when cache returns empty array', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      MemoryCache.getCache.mockResolvedValue([])
      
      const result = await getDataFromCache('test-key')
      
      expect(result).toBeNull()
    })
  })

  describe('setDataToCache', () => {
    it('writes data to cache', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      const data = { test: 'data' }
      
      await setDataToCache('test-key', data)
      
      expect(MemoryCache.setCache).toHaveBeenCalledWith('test-key', data, undefined)
    })

    it('writes data with custom cache time', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      const data = { test: 'data' }
      
      await setDataToCache('test-key', data, 3600)
      
      expect(MemoryCache.setCache).toHaveBeenCalledWith('test-key', data, 3600)
    })

    it('does not write null data', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      
      await setDataToCache('test-key', null)
      
      expect(MemoryCache.setCache).not.toHaveBeenCalled()
    })
  })

  describe('getOrSetDataWithCache', () => {
    it('returns cached data if available', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      MemoryCache.getCache.mockResolvedValue({ cached: true })
      
      const getData = jest.fn().mockResolvedValue({ fresh: true })
      const result = await getOrSetDataWithCache('test-key', getData)
      
      expect(result).toEqual({ cached: true })
      expect(getData).not.toHaveBeenCalled()
    })

    it('fetches and caches data if not in cache', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      MemoryCache.getCache.mockResolvedValue(null)
      
      const getData = jest.fn().mockResolvedValue({ fresh: true })
      const result = await getOrSetDataWithCache('test-key', getData)
      
      expect(result).toEqual({ fresh: true })
      expect(getData).toHaveBeenCalled()
      expect(MemoryCache.setCache).toHaveBeenCalledWith('test-key', { fresh: true }, undefined)
    })

    it('returns null if data fetch fails', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      MemoryCache.getCache.mockResolvedValue(null)
      
      const getData = jest.fn().mockResolvedValue(null)
      const result = await getOrSetDataWithCache('test-key', getData)
      
      expect(result).toBeNull()
    })
  })

  describe('delCacheData', () => {
    it('deletes cache entry', async () => {
      const MemoryCache = require('@/lib/cache/memory_cache')
      
      await delCacheData('test-key')
      
      expect(MemoryCache.delCache).toHaveBeenCalledWith('test-key')
    })
  })

  describe('getApi', () => {
    it('returns MemoryCache by default', () => {
      const api = getApi()
      const MemoryCache = require('@/lib/cache/memory_cache')
      
      expect(api).toBe(MemoryCache)
    })
  })
})