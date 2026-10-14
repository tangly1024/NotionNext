/** @jest-environment node */
import fs from 'fs/promises'
import {
  collectRevalidationPaths,
  revalidatePaths
} from '@/lib/server/revalidation'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
jest.mock('@/blog.config', () => ({
  LANG: 'zh-CN',
  NOTION_PAGE_ID: 'root,en:translated'
}))
jest.mock('@/lib/config', () => ({ siteConfig: (key, fallback) => fallback }))
jest.mock('@/lib/db/SiteDataApi', () => ({ fetchGlobalAllData: jest.fn() }))

it('discovers locale-prefixed articles and old prerendered paths', async () => {
  fetchGlobalAllData.mockResolvedValue({
    allPages: [
      {
        id: 'one',
        type: 'Post',
        status: 'Published',
        slug: 'article/new',
        tags: []
      }
    ],
    NOTION_CONFIG: {}
  })
  jest.spyOn(fs, 'readFile').mockResolvedValue(
    JSON.stringify({
      routes: { '/zh-CN/article/removed': {}, '/zh-CN/404': {} }
    })
  )
  const paths = await collectRevalidationPaths()
  expect(paths).toEqual(
    expect.arrayContaining([
      '/zh-CN',
      '/en',
      '/zh-CN/article/new',
      '/en/article/new',
      '/zh-CN/article/removed'
    ])
  )
  expect(paths).not.toContain('/zh-CN/404')
})
it('uses the internal locale route for on-demand ISR', async () => {
  const res = { revalidate: jest.fn(async () => {}) }
  const results = await revalidatePaths(res, [
    '/',
    '/article/new',
    '/en/article/new'
  ])
  expect(res.revalidate.mock.calls.flat()).toEqual([
    '/zh-CN',
    '/zh-CN/article/new',
    '/en/article/new'
  ])
  expect(results.every(value => value.revalidated)).toBe(true)
})
it('stops scheduling new paths after the request budget expires', async () => {
  let now = 0
  jest.spyOn(Date, 'now').mockImplementation(() => now)
  const res = {
    revalidate: jest.fn(async () => {
      now = 100
    })
  }
  const results = await revalidatePaths(res, ['/one', '/two', '/three'], 1, 50)
  expect(res.revalidate).toHaveBeenCalledTimes(1)
  expect(results).toEqual([{ path: '/one', revalidated: true }])
})
