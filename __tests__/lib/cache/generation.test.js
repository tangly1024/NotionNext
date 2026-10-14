/** @jest-environment node */
import fs from 'fs'
import os from 'os'
import path from 'path'

let cacheRoot
let generation

beforeEach(() => {
  cacheRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'notionnext-generation-'))
  jest.resetModules()
  jest.doMock('@/blog.config', () => ({ NOTION_PAGE_ID: 'generation-test' }))
  jest.doMock('@/lib/cache/build_session', () => ({
    getNotionCacheRoot: () => cacheRoot
  }))
  jest.doMock('@/lib/cache/redis_cache', () => ({ redisClient: {} }))
  generation = require('@/lib/cache/invalidation')
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
  fs.rmSync(cacheRoot, { recursive: true, force: true })
})

it('caches real file reads briefly and observes an external marker after expiry', async () => {
  const marker = path.join(cacheRoot, 'data-generation')
  fs.writeFileSync(marker, 'before')
  const read = jest.spyOn(fs, 'readFileSync')
  expect(await generation.getCacheGeneration()).toBe('before')
  fs.writeFileSync(marker, 'after')
  expect(await generation.getCacheGeneration()).toBe('before')
  expect(read).toHaveBeenCalledTimes(1)
  jest.advanceTimersByTime(generation.GENERATION_CACHE_TTL_MS)
  expect(await generation.getCacheGeneration()).toBe('after')
  expect(read).toHaveBeenCalledTimes(2)
})

it('writes an atomic real marker and waits for another worker to expire its memo', async () => {
  let otherWorker
  jest.isolateModules(() => {
    otherWorker = require('@/lib/cache/invalidation')
  })
  expect(await otherWorker.getCacheGeneration()).toBe('0')
  let completed = false
  const rotating = generation.rotateCacheGeneration().then(value => {
    completed = true
    return value
  })
  const persisted = fs.readFileSync(
    path.join(cacheRoot, 'data-generation'),
    'utf8'
  )
  expect(persisted).toMatch(/^[a-f0-9-]{36}$/)
  expect(await generation.getCacheGeneration()).toBe(persisted)
  expect(await otherWorker.getCacheGeneration()).toBe('0')
  expect(completed).toBe(false)
  await jest.advanceTimersByTimeAsync(generation.GENERATION_CACHE_TTL_MS)
  expect(await rotating).toBe(persisted)
  expect(await otherWorker.getCacheGeneration()).toBe(persisted)
  expect(fs.readdirSync(cacheRoot)).toEqual(['data-generation'])
})

it('removes a temporary marker and reports a failed atomic replacement', async () => {
  jest.spyOn(fs, 'renameSync').mockImplementation(() => {
    throw new Error('read only')
  })
  await expect(generation.rotateCacheGeneration()).rejects.toThrow('read only')
  expect(fs.readdirSync(cacheRoot)).toEqual([])
})

it('shares concurrent Redis generation reads without letting a pre-rotation read overwrite the new memo', async () => {
  jest.resetModules()
  let finishRead
  const redisClient = {
    get: jest.fn(
      () =>
        new Promise(resolve => {
          finishRead = resolve
        })
    ),
    set: jest.fn(async () => {})
  }
  jest.doMock('@/blog.config', () => ({
    NOTION_PAGE_ID: 'generation-test',
    REDIS_URL: 'fixture'
  }))
  jest.doMock('@/lib/cache/redis_cache', () => ({ redisClient }))
  generation = require('@/lib/cache/invalidation')
  const old = generation.getCacheGeneration()
  const concurrent = generation.getCacheGeneration()
  expect(redisClient.get).toHaveBeenCalledTimes(1)
  const rotating = generation.rotateCacheGeneration()
  await Promise.resolve()
  const current = await generation.getCacheGeneration()
  finishRead('old')
  expect(await old).toBe('old')
  expect(await concurrent).toBe('old')
  expect(await generation.getCacheGeneration()).toBe(current)
  await jest.advanceTimersByTimeAsync(generation.GENERATION_CACHE_TTL_MS)
  expect(await rotating).toBe(current)
})

it('falls back to the local marker without logging Redis request details', async () => {
  jest.resetModules()
  const failure = Object.assign(new Error('Redis failed: fixture-secret'), {
    config: { password: 'fixture-secret' }
  })
  const redisClient = { get: jest.fn().mockRejectedValue(failure) }
  const log = jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.doMock('@/blog.config', () => ({
    NOTION_PAGE_ID: 'generation-test',
    REDIS_URL: 'fixture'
  }))
  jest.doMock('@/lib/cache/redis_cache', () => ({ redisClient }))
  generation = require('@/lib/cache/invalidation')
  fs.writeFileSync(path.join(cacheRoot, 'data-generation'), 'local-fallback')
  expect(await generation.getCacheGeneration()).toBe('local-fallback')
  expect(log).toHaveBeenCalledWith(
    '[Cache] Redis generation read failed; using local marker',
    'Error'
  )
  expect(JSON.stringify(log.mock.calls)).not.toContain('fixture-secret')
})
