/** @jest-environment node */
import handler from '@/pages/api/subscribe'
import subscribe from '@/lib/plugins/mailchimp'
jest.mock('@/lib/plugins/mailchimp', () => ({
  __esModule: true,
  default: jest.fn()
}))
const response = () => ({
  setHeader: jest.fn(),
  status(code) {
    this.code = code
    return this
  },
  json(body) {
    this.body = body
    return this
  }
})
it.each([
  [400, 'Invalid Resource', 400, 'error'],
  [401, 'Unauthorized', 502, 'error'],
  [400, 'Member Exists', 409, 'error'],
  [200, '', 200, 'success']
])(
  'maps Mailchimp %s %s to an honest result',
  async (status, title, expected, result) => {
    subscribe.mockResolvedValue({
      ok: status === 200,
      status,
      json: async () => ({ title })
    })
    const res = response()
    await handler(
      {
        method: 'POST',
        body: { email: 'reader@example.com', firstName: 'Reader' }
      },
      res
    )
    expect(res.code).toBe(expected)
    expect(res.body.status).toBe(result)
    expect(subscribe).toHaveBeenCalledWith({
      email: 'reader@example.com',
      first_name: 'Reader',
      last_name: undefined
    })
  }
)
it.each([null, { email: 'invalid' }, { email: 'x@y.com', firstName: {} }])(
  'rejects malformed input before subscribing (%j)',
  async body => {
    const res = response()
    await handler({ method: 'POST', body }, res)
    expect(res.code).toBe(400)
    expect(subscribe).not.toHaveBeenCalled()
  }
)
it('reports network failures without forwarding secrets', async () => {
  subscribe.mockRejectedValue(new Error('secret-key'))
  const res = response()
  await handler({ method: 'POST', body: { email: 'x@y.com' } }, res)
  expect(res.code).toBe(503)
  expect(JSON.stringify(res.body)).not.toContain('secret-key')
})
