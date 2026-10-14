/** @jest-environment node */
import BLOG from '@/blog.config'
import subscribeToMailchimpApi, {
  subscribeToNewsletter
} from '@/lib/plugins/mailchimp'

jest.mock('@/blog.config', () => ({
  __esModule: true,
  default: {}
}))

beforeEach(() => {
  fetch.mockReset()
  BLOG.MAILCHIMP_API_KEY = 'test-api-key-us6'
  BLOG.MAILCHIMP_LIST_ID = 'list /?id'
})

test('uses the key data center, encodes list IDs and sends names with confirmation required', async () => {
  const upstream = { ok: true }
  fetch.mockResolvedValue(upstream)
  await expect(
    subscribeToMailchimpApi({
      email: 'reader@example.com',
      first_name: 'Reader',
      last_name: 'Example'
    })
  ).resolves.toBe(upstream)
  expect(fetch).toHaveBeenCalledWith(
    'https://us6.api.mailchimp.com/3.0/lists/list%20%2F%3Fid/members',
    expect.objectContaining({
      method: 'POST',
      headers: {
        Authorization: 'apikey test-api-key-us6',
        'Content-Type': 'application/json'
      },
      signal: expect.any(AbortSignal)
    })
  )
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
    email_address: 'reader@example.com',
    status: 'pending',
    merge_fields: { FNAME: 'Reader', LNAME: 'Example' }
  })
  expect(fetch).toHaveBeenCalledTimes(1)
})

test('allows omitted names and sets the upstream timeout to 15 seconds', async () => {
  fetch.mockResolvedValue({ ok: true })
  const timeout = jest.spyOn(AbortSignal, 'timeout')
  try {
    await subscribeToMailchimpApi({ email: 'reader@example.com' })
    expect(JSON.parse(fetch.mock.calls[0][1].body).merge_fields).toEqual({
      FNAME: '',
      LNAME: ''
    })
    expect(timeout).toHaveBeenCalledWith(15000)
  } finally {
    timeout.mockRestore()
  }
})

test.each(['MAILCHIMP_API_KEY', 'MAILCHIMP_LIST_ID'])(
  'rejects missing %s without fetching',
  key => {
    delete BLOG[key]
    expect(() =>
      subscribeToMailchimpApi({ email: 'reader@example.com' })
    ).toThrow('Newsletter is not configured')
    expect(fetch).not.toHaveBeenCalled()
  }
)

test.each(['key', 'key-eu1', 'key-us6.example.com', 'key-us6/path'])(
  'rejects malformed data center in %s',
  key => {
    BLOG.MAILCHIMP_API_KEY = key
    expect(() =>
      subscribeToMailchimpApi({ email: 'reader@example.com' })
    ).toThrow('Invalid newsletter configuration')
    expect(fetch).not.toHaveBeenCalled()
  }
)

test('sends client names and returns the accepted response', async () => {
  const data = { status: 'success', message: 'Request received' }
  fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(data) })
  await expect(
    subscribeToNewsletter('reader@example.com', 'Reader', 'Example')
  ).resolves.toEqual(data)
  expect(fetch).toHaveBeenCalledWith('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'reader@example.com',
      firstName: 'Reader',
      lastName: 'Example'
    })
  })
})

test.each([400, 409, 502, 503])(
  'rejects HTTP %s using the safe server message',
  async status => {
    fetch.mockResolvedValue({
      ok: false,
      status,
      json: () =>
        Promise.resolve({ status: 'error', message: 'Please try again later' })
    })
    await expect(subscribeToNewsletter('reader@example.com')).rejects.toThrow(
      'Please try again later'
    )
  }
)

test.each([true, false])(
  'rejects a malformed JSON response (ok=%s)',
  async ok => {
    fetch.mockResolvedValue({
      ok,
      json: () => Promise.reject(new SyntaxError('Unexpected HTML'))
    })
    await expect(subscribeToNewsletter('reader@example.com')).rejects.toThrow(
      'Subscription is temporarily unavailable'
    )
  }
)

test('reports network failures with a user-facing message', async () => {
  fetch.mockRejectedValue(new TypeError('Failed to fetch'))
  await expect(subscribeToNewsletter('reader@example.com')).rejects.toThrow(
    'Subscription is temporarily unavailable'
  )
})
