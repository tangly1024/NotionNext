/** @jest-environment node */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { randomUUID } from 'crypto'

// Explicitly opt in to an isolated test Redis. Never use the site's REDIS_URL.
const testRedisUrl = process.env.NOTIONNEXT_TEST_REDIS_URL
const describeRedis = testRedisUrl ? describe : describe.skip

describeRedis('real Redis generation and SCAN invalidation', () => {
  let cacheRoot
  let cache
  let generation
  let namespace
  let fixtureKeys = []

  beforeAll(async () => {
    cacheRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'notionnext-redis-'))
    jest.resetModules()
    jest.doMock('@/blog.config', () => ({
      REDIS_URL: testRedisUrl,
      NOTION_PAGE_ID: `integration-${randomUUID()}`,
      NEXT_REVALIDATE_SECOND: 60
    }))
    jest.doMock('@/lib/config', () => ({
      siteConfig: (key, fallback) => fallback
    }))
    jest.doMock('@/lib/cache/build_session', () => ({
      getNotionCacheRoot: () => cacheRoot
    }))
    cache = require('@/lib/cache/redis_cache')
    generation = require('@/lib/cache/invalidation')
    namespace = require('@/lib/cache/namespace')
    let timeout
    try {
      await Promise.race([
        cache.redisClient.ping(),
        new Promise((resolve, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Test Redis connection timed out')),
            5000
          )
        })
      ])
    } catch (error) {
      cache.redisClient.disconnect()
      throw error
    } finally {
      clearTimeout(timeout)
    }
  })

  afterAll(async () => {
    try {
      if (cache?.redisClient.status === 'ready' && fixtureKeys.length) {
        await cache.redisClient.del(...fixtureKeys)
      }
    } finally {
      cache?.redisClient.disconnect()
      if (cacheRoot) fs.rmSync(cacheRoot, { recursive: true, force: true })
    }
  })

  it('persists generations and scans every data batch without deleting another namespace or the marker', async () => {
    const markerKey = `${namespace.cacheNamespace}:generation`
    const unrelated = `${namespace.cacheNamespace}:other-site:data:keep`
    const entries = Array.from(
      { length: 800 },
      (_, index) => `${namespace.dataCachePrefix}fixture-${index}`
    )
    fixtureKeys = [
      ...entries,
      markerKey,
      unrelated,
      `${namespace.dataCachePrefix}article`
    ]
    const value = await generation.rotateCacheGeneration()
    expect(await cache.redisClient.get(markerKey)).toBe(value)
    expect(await generation.getCacheGeneration()).toBe(value)
    const pipeline = cache.redisClient.pipeline()
    for (const key of [...entries, unrelated])
      pipeline.set(key, 'fixture', 'EX', 60)
    await pipeline.exec()
    await cache.setCache('article', { title: 'cached' })
    expect(await cache.getCache('article')).toEqual({ title: 'cached' })
    const scan = jest.spyOn(cache.redisClient, 'scan')
    await cache.cleanCache()
    expect(scan.mock.calls.length).toBeGreaterThan(1)
    expect(
      await cache.redisClient.exists(
        ...entries,
        `${namespace.dataCachePrefix}article`
      )
    ).toBe(0)
    expect(await cache.redisClient.get(markerKey)).toBe(value)
    expect(await cache.redisClient.get(unrelated)).toBe('fixture')
  }, 20000)
})
