/** @jest-environment node */
import handler from '@/pages/api/post/unlock'
import { resolvePostProps } from '@/lib/db/SiteDataApi'

jest.mock('@/blog.config', () => ({ LANG: 'zh-CN', NOTION_PAGE_ID: 'root' }))
jest.mock('@/lib/db/SiteDataApi', () => ({ resolvePostProps: jest.fn() }))
const id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
function response() {
  return {
    headers: {},
    statusCode: 200,
    setHeader(k, v) {
      this.headers[k] = v
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(data) {
      this.body = data
      return this
    }
  }
}
const request = () => ({
  method: 'POST',
  headers: { host: 'example.com', origin: 'https://example.com' },
  socket: { remoteAddress: '127.0.0.1', encrypted: true },
  body: { postId: id, password: 'secret', locale: 'zh-CN' }
})

it('sends authenticated content with explicit no-store headers', async () => {
  resolvePostProps.mockResolvedValue({ post: { id, blockMap: { block: {} } } })
  const res = response()
  await handler(request(), res)
  expect(res.statusCode).toBe(200)
  expect(res.headers['Cache-Control']).toContain('no-store')
  expect(res.headers['CDN-Cache-Control']).toBe('no-store')
})
it.each([
  [null, 404],
  [{ id, password: 'protected' }, 401]
])('rejects an unavailable or still-locked post', async (post, code) => {
  resolvePostProps.mockResolvedValue({ post })
  const res = response()
  await handler(request(), res)
  expect(res.statusCode).toBe(code)
  expect(res.body.post).toBeUndefined()
})
it('rejects cross-origin browser requests before resolving content', async () => {
  const req = request()
  req.headers.origin = 'https://untrusted.invalid'
  const res = response()
  await handler(req, res)
  expect(res.statusCode).toBe(403)
  expect(resolvePostProps).not.toHaveBeenCalled()
})
it('does not expose upstream error details or credentials', async () => {
  resolvePostProps.mockRejectedValue(new Error('sensitive upstream payload'))
  const res = response()
  await handler(request(), res)
  expect(res.statusCode).toBe(503)
  expect(JSON.stringify(res.body)).not.toContain('sensitive')
})
