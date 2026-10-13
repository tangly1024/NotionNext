/** @jest-environment node */
import handler from '@/pages/api/subscribe'
import subscribe from '@/lib/plugins/mailchimp'
jest.mock('@/blog.config', () => ({
  __esModule: true,
  default: { MAILCHIMP_API_KEY: 'secret-key-us18' }
}))
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
let errorLog
beforeEach(() => {
  subscribe.mockReset()
  errorLog = jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => errorLog.mockRestore())

it.each([
  [400, 'Invalid Resource', 400, 'error'],
  [401, 'Unauthorized', 502, 'error'],
  [400, 'Member Exists', 200, 'success'],
  [200, '', 200, 'success']
])(
  'maps Mailchimp %s %s to an honest result',
  async (status, title, expected, result) => {
    subscribe.mockResolvedValue({
      ok: status === 200,
      status,
      json: () => Promise.resolve({ title })
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
it('reports network failures with redacted server diagnostics', async () => {
  subscribe.mockRejectedValue(
    new Error('fetch failed: secret-key-us18 x@y.com')
  )
  const res = response()
  await handler({ method: 'POST', body: { email: 'x@y.com' } }, res)
  expect(res.code).toBe(503)
  expect(JSON.stringify(res.body)).not.toContain('secret-key')
  expect(errorLog).toHaveBeenCalledWith(
    '[Newsletter] Subscription unavailable',
    { message: 'fetch failed: [redacted] [redacted]' }
  )
})

it('records Mailchimp status and title without subscriber or credential data', async () => {
  subscribe.mockResolvedValue({
    ok: false,
    status: 401,
    json: () =>
      Promise.resolve({
        title: 'Unauthorized secret-key-us18 x@y.com',
        detail: 'private upstream detail'
      })
  })
  const res = response()
  await handler({ method: 'POST', body: { email: 'x@y.com' } }, res)
  expect(errorLog).toHaveBeenCalledWith(
    '[Newsletter] Mailchimp request failed',
    {
      status: 401,
      title: 'Unauthorized [redacted] [redacted]'
    }
  )
  expect(JSON.stringify(errorLog.mock.calls)).not.toContain('private upstream')
  expect(JSON.stringify(res.body)).not.toContain('Unauthorized')
})

it('retains upstream status diagnostics when Mailchimp returns non-JSON errors', async () => {
  subscribe.mockResolvedValue({
    ok: false,
    status: 502,
    json: () => Promise.reject(new SyntaxError('Invalid JSON'))
  })
  const res = response()
  await handler({ method: 'POST', body: { email: 'x@y.com' } }, res)
  expect(res.code).toBe(502)
  expect(errorLog).toHaveBeenCalledWith(
    '[Newsletter] Mailchimp request failed',
    {
      status: 502,
      title: undefined
    }
  )
})

it.each(['Newsletter is not configured', 'Invalid newsletter configuration'])(
  'records configuration failures for operators: %s',
  async message => {
    subscribe.mockRejectedValue(new Error(message))
    const res = response()
    await handler({ method: 'POST', body: { email: 'x@y.com' } }, res)
    expect(res.code).toBe(503)
    expect(res.body.message).toBe('Subscription is temporarily unavailable')
    expect(errorLog).toHaveBeenCalledWith(
      '[Newsletter] Subscription unavailable',
      { message }
    )
  }
)

it('gives new and existing addresses the same response without updating existing members', async () => {
  const submit = async () => {
    const res = response()
    await handler({ method: 'POST', body: { email: 'x@y.com' } }, res)
    return res
  }
  subscribe
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ status: 'pending' })
    })
    .mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ title: 'Member Exists' })
    })
  const added = await submit()
  const existing = await submit()
  expect(existing.code).toBe(added.code)
  expect(existing.body).toEqual(added.body)
  expect(existing.body.message).toContain('request received')
  expect(subscribe).toHaveBeenCalledTimes(2)
  expect(errorLog).not.toHaveBeenCalled()
})

it('does not call Mailchimp for unsupported methods and disables caching', async () => {
  const res = response()
  await handler({ method: 'GET' }, res)
  expect(res.code).toBe(405)
  expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store')
  expect(subscribe).not.toHaveBeenCalled()
})
