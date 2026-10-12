import { act, renderHook } from '@testing-library/react'
import useProtectedPost from '@/hooks/useProtectedPost'
import { StrictMode } from 'react'

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
