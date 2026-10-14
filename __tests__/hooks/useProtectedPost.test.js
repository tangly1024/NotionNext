import { act, renderHook } from '@testing-library/react'
import useProtectedPost from '@/hooks/useProtectedPost'
import { StrictMode } from 'react'
import enUS from '@/lib/lang/en-US'
import zhCN from '@/lib/lang/zh-CN'

const router = { locale: 'zh-CN', basePath: '/blog' }
const initialPost = { id: 'one', password: 'protected' }
const originalFetch = global.fetch
afterEach(() => {
  global.fetch = originalFetch
  localStorage.clear()
  window.history.replaceState({}, '', '/')
})

it('keeps content locked until the server returns the authorized body', async () => {
  const body = { ...initialPost, blockMap: { block: {} } }
  global.fetch = jest
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ post: body, prev: { id: 'prev' }, next: { id: 'next' }, recommendPosts: [{ id: 'related' }] }) })
  const { result } = renderHook(() => useProtectedPost(initialPost, router))
  expect(result.current.lock).toBe(true)
  await act(async () => {
    expect(await result.current.validPassword('secret')).toBe(true)
  })
  expect(global.fetch).toHaveBeenCalledWith(
    '/blog/api/post/unlock',
    expect.objectContaining({ method: 'POST', cache: 'no-store' })
  )
  expect(result.current.lock).toBe(false)
  expect(result.current.post).toEqual(body)
  expect(result.current.prev).toEqual({ id: 'prev' })
  expect(result.current.next).toEqual({ id: 'next' })
  expect(result.current.recommendPosts).toEqual([{ id: 'related' }])
  expect(localStorage.getItem('password_default')).toBeNull()
})

it.each(['url', 'storage'])('migrates a legacy %s password under Strict Mode', async source => {
  const body = { ...initialPost, blockMap: { block: {} } }
  window.history.replaceState({}, '', source === 'url' ? '/protected?password=secret' : '/protected')
  if (source === 'storage') localStorage.setItem('password_/protected', 'secret')
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ post: body }) })
  const { result } = renderHook(() => useProtectedPost(initialPost, router), {
    wrapper: ({ children }) => <StrictMode>{children}</StrictMode>
  })
  await act(async () => {})
  expect(result.current.lock).toBe(false)
  expect(global.fetch).toHaveBeenCalledTimes(1)
  expect(window.location.search).toBe('')
  expect(localStorage.getItem('password_/protected')).toBeNull()
})

it('discards a pending unlock after navigation to another article', async () => {
  let finish
  global.fetch = jest.fn(
    () =>
      new Promise(resolve => {
        finish = resolve
      })
  )
  const { result, rerender } = renderHook(
    ({ post }) => useProtectedPost(post, router),
    { initialProps: { post: initialPost } }
  )
  let pending
  act(() => {
    pending = result.current.validPassword('secret')
  })
  rerender({ post: { id: 'two', password: 'protected' } })
  await act(async () => {
    finish({
      ok: true,
      json: async () => ({ post: { ...initialPost, blockMap: { block: {} } } })
    })
    expect(await pending).toBe(false)
  })
  expect(result.current.post.id).toBe('two')
  expect(result.current.lock).toBe(true)
})

it.each([enUS, zhCN])('uses the active locale for service, rate-limit and network failures ($LOCALE)', async locale => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: false, status: 429 })
    .mockResolvedValueOnce({ ok: false, status: 503 })
    .mockRejectedValueOnce(new TypeError('Failed to fetch'))
  const { result } = renderHook(() => useProtectedPost(initialPost, router, locale))
  for (const key of ['POST_UNLOCK_RATE_LIMIT', 'POST_UNLOCK_UNAVAILABLE', 'POST_UNLOCK_NETWORK_ERROR']) {
    await act(async () => { expect(await result.current.validPassword('secret')).toBe(false) })
    expect(result.current.unlockError).toBe(locale.COMMON[key])
    expect(result.current.lock).toBe(true)
  }
})

it('does not fetch on a static lock page and still removes legacy credentials', async () => {
  global.fetch = jest.fn()
  window.history.replaceState({}, '', '/protected?password=secret')
  localStorage.setItem('password_/protected', 'secret')
  const { result } = renderHook(() => useProtectedPost(initialPost, router, enUS, true))
  await act(async () => { expect(await result.current.validPassword('secret')).toBe(false) })
  expect(result.current.lock).toBe(true)
  expect(global.fetch).not.toHaveBeenCalled()
  expect(window.location.search).toBe('')
  expect(localStorage.getItem('password_/protected')).toBeNull()
})

it('treats malformed successful responses as localized service errors', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ post: { id: 'other' } }) })
  const { result } = renderHook(() => useProtectedPost(initialPost, router, enUS))
  await act(async () => { expect(await result.current.validPassword('secret')).toBe(false) })
  expect(result.current.unlockError).toBe(enUS.COMMON.POST_UNLOCK_UNAVAILABLE)
  expect(result.current.lock).toBe(true)
})
