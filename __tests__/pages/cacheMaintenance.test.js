/** @jest-environment node */
import cacheHandler, { config as cacheConfig } from '@/pages/api/cache'
import revalidateHandler, {
  config as revalidateConfig
} from '@/pages/api/revalidate'
import { clearDataCache } from '@/lib/cache/cache_manager'
import { collectRevalidationPaths } from '@/lib/server/revalidation'
jest.mock('@/blog.config', () => ({}))
jest.mock('@/lib/cache/cache_manager', () => ({ clearDataCache: jest.fn() }))
jest.mock('@/lib/db/SiteDataApi', () => ({ fetchGlobalAllData: jest.fn() }))
jest.mock('@/lib/server/revalidation', () => ({
  ...jest.requireActual('@/lib/server/revalidation'),
  collectRevalidationPaths: jest.fn()
}))
const res = () => ({
  setHeader: jest.fn(),
  revalidate: jest.fn(async () => {}),
  status(code) {
    this.code = code
    return this
  },
  json(body) {
    this.body = body
    return this
  }
})
it('keeps cache maintenance functions within legacy Hobby duration limits', () => {
  expect(cacheConfig.maxDuration).toBeLessThanOrEqual(60)
  expect(revalidateConfig.maxDuration).toBeLessThanOrEqual(60)
})
beforeEach(() => {
  delete process.env.CACHE_REVALIDATION_TOKEN
  process.env.REVALIDATION_TOKEN = 'fixture-token'
  clearDataCache.mockResolvedValue(['file', 'memory'])
  collectRevalidationPaths.mockReset()
})
it('disables unauthenticated cache maintenance when no token is configured', async () => {
  const response = res()
  await cacheHandler({ method: 'POST', headers: {} }, response)
  expect(response.code).toBe(503)
  expect(clearDataCache).not.toHaveBeenCalled()
})
it('refreshes old and new articles after clearing the data cache', async () => {
  const order = []
  collectRevalidationPaths
    .mockImplementationOnce(() => {
      order.push('old')
      return Promise.resolve(['/', '/article/removed'])
    })
    .mockImplementationOnce(() => {
      order.push('new')
      return Promise.resolve(['/', '/article/new', '/tag/tools'])
    })
  clearDataCache.mockImplementationOnce(() => {
    order.push('clear')
    return Promise.resolve(['memory'])
  })
  const response = res()
  await revalidateHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer fixture-token' },
      body: { all: true }
    },
    response
  )
  expect(order).toEqual(['old', 'clear', 'new'])
  expect(response.code).toBe(200)
  expect(response.revalidate.mock.calls.flat()).toEqual([
    '/',
    '/article/removed',
    '/article/new',
    '/tag/tools'
  ])
})
it('rebuilds exactly one requested page without data invalidation or locale-wide discovery', async () => {
  collectRevalidationPaths.mockResolvedValue([
    '/zh-CN',
    '/en',
    '/zh-CN/tag/tools',
    '/en/category/books',
    '/en/page/2'
  ])
  const response = res()
  await revalidateHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer fixture-token' },
      body: { path: '/article/example' }
    },
    response
  )
  expect(response.code).toBe(200)
  expect(response.revalidate).toHaveBeenCalledTimes(1)
  expect(response.revalidate).toHaveBeenCalledWith('/article/example')
  expect(clearDataCache).not.toHaveBeenCalled()
  expect(collectRevalidationPaths).not.toHaveBeenCalled()
  expect(response.body).toMatchObject({
    stores: [],
    complete: true,
    remainingPaths: []
  })
})
it('requires an explicit switch to clear data for one path and still rebuilds only that path', async () => {
  const order = []
  clearDataCache.mockImplementationOnce(() => {
    order.push('clear')
    return Promise.resolve(['memory'])
  })
  const response = res()
  response.revalidate.mockImplementation(() => {
    order.push('revalidate')
    return Promise.resolve()
  })
  await revalidateHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer fixture-token' },
      body: { path: '/article/example', invalidateData: true }
    },
    response
  )
  expect(order).toEqual(['clear', 'revalidate'])
  expect(response.code).toBe(200)
  expect(response.revalidate).toHaveBeenCalledTimes(1)
  expect(collectRevalidationPaths).not.toHaveBeenCalled()
})
it('returns a bounded batch and resumes without repeating invalidation or discovery', async () => {
  const paths = Array.from({ length: 60 }, (_, index) => `/en/article/${index}`)
  collectRevalidationPaths.mockResolvedValue(paths)
  const first = res()
  await revalidateHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer fixture-token' },
      body: { all: true }
    },
    first
  )
  expect(first.code).toBe(202)
  expect(first.revalidate).toHaveBeenCalledTimes(25)
  expect(first.body).toMatchObject({
    complete: false,
    total: 60,
    remainingPaths: paths.slice(25)
  })
  const second = res()
  await revalidateHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer fixture-token' },
      body: { paths: first.body.remainingPaths, batchSize: 50 }
    },
    second
  )
  expect(second.code).toBe(200)
  expect(second.revalidate).toHaveBeenCalledTimes(35)
  expect(second.body).toMatchObject({ complete: true, remainingPaths: [] })
  expect(clearDataCache).toHaveBeenCalledTimes(1)
  expect(collectRevalidationPaths).toHaveBeenCalledTimes(2)
  expect([
    ...first.revalidate.mock.calls.flat(),
    ...second.revalidate.mock.calls.flat()
  ]).toEqual(paths)
})
it('reports a failed page separately from paths that have not run yet', async () => {
  const response = res()
  const failure = Object.assign(new Error('upstream failed: fixture-secret'), {
    config: { headers: { Authorization: 'Bearer fixture-secret' } },
    response: { data: 'fixture-private-response' }
  })
  const log = jest.spyOn(console, 'error').mockImplementation(() => {})
  response.revalidate.mockRejectedValueOnce(failure)
  await revalidateHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer fixture-token' },
      body: { paths: ['/one', '/two'], batchSize: 1 }
    },
    response
  )
  expect(response.code).toBe(500)
  expect(response.body).toMatchObject({
    complete: false,
    remainingPaths: ['/two'],
    results: [{ path: '/one', revalidated: false }]
  })
  expect(log).toHaveBeenCalledWith(
    '[Revalidation] Page regeneration failed',
    '/one',
    'Error'
  )
  expect(JSON.stringify(log.mock.calls)).not.toMatch(
    /fixture-secret|fixture-private-response/
  )
})
it.each([
  { invalidateData: 'true' },
  { all: true, invalidateData: false },
  { batchSize: 0 },
  { batchSize: 51 },
  { batchSize: 1.5 }
])('rejects malformed invalidation and batch controls (%j)', async body => {
  const response = res()
  await revalidateHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer fixture-token' },
      body
    },
    response
  )
  expect(response.code).toBe(400)
  expect(clearDataCache).not.toHaveBeenCalled()
  expect(response.revalidate).not.toHaveBeenCalled()
})
it('logs cache invalidation failures and does not regenerate pages', async () => {
  const failure = Object.assign(new Error('upstream failed: fixture-secret'), {
    config: { headers: { Authorization: 'Bearer fixture-secret' } },
    response: { data: 'fixture-private-response' }
  })
  clearDataCache.mockRejectedValueOnce(failure)
  const log = jest.spyOn(console, 'error').mockImplementation(() => {})
  const response = res()
  await revalidateHandler(
    {
      method: 'POST',
      headers: { authorization: 'Bearer fixture-token' },
      body: { invalidateData: true }
    },
    response
  )
  expect(response.code).toBe(503)
  expect(response.revalidate).not.toHaveBeenCalled()
  expect(log).toHaveBeenCalledWith(
    '[Revalidation] Cache invalidation or page discovery failed',
    'Error'
  )
  expect(JSON.stringify(log.mock.calls)).not.toMatch(
    /fixture-secret|fixture-private-response/
  )
})
it.each([
  'https://example.com',
  '//example.com',
  '/%2e%2e/a',
  '/%61pi/cache',
  '/',
  7
])(
  'rejects invalid paths or reports regeneration failures (%j)',
  async path => {
    collectRevalidationPaths.mockResolvedValue([])
    const response = res()
    response.revalidate.mockRejectedValue(new Error('failed'))
    await revalidateHandler(
      {
        method: 'POST',
        headers: { authorization: 'Bearer fixture-token' },
        body: { path }
      },
      response
    )
    expect(response.code).toBe(path === '/' ? 500 : 400)
    if (path !== '/') expect(clearDataCache).not.toHaveBeenCalled()
  }
)
