/** @jest-environment node */
import cacheHandler from '@/pages/api/cache'
import revalidateHandler from '@/pages/api/revalidate'
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
    .mockImplementationOnce(async () => {
      order.push('old')
      return ['/', '/article/removed']
    })
    .mockImplementationOnce(async () => {
      order.push('new')
      return ['/', '/article/new', '/tag/tools']
    })
  clearDataCache.mockImplementationOnce(async () => {
    order.push('clear')
    return ['memory']
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
