import handler from '@/pages/api/cron/revalidate'
import { cleanCache } from '@/lib/cache/local_file_cache'

jest.mock('@/lib/cache/local_file_cache', () => ({
  cleanCache: jest.fn()
}))

const createResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  setHeader: jest.fn(),
  revalidate: jest.fn().mockResolvedValue(undefined)
})

describe('GET /api/cron/revalidate', () => {
  const secret = 'test-cron-secret'

  beforeEach(() => {
    process.env.CRON_SECRET = secret
    jest.clearAllMocks()
  })

  afterAll(() => {
    delete process.env.CRON_SECRET
  })

  it('requires Vercel Cron authorization', async () => {
    const req = { method: 'GET', headers: {} }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      message: 'Unauthorized'
    })
    expect(res.revalidate).not.toHaveBeenCalled()
  })

  it('refreshes the public index paths', async () => {
    const req = {
      method: 'GET',
      headers: { authorization: `Bearer ${secret}` }
    }
    const res = createResponse()

    await handler(req, res)

    expect(cleanCache).toHaveBeenCalledTimes(1)
    expect(res.revalidate).toHaveBeenCalledTimes(5)
    expect(res.revalidate).toHaveBeenNthCalledWith(1, '/')
    expect(res.revalidate).toHaveBeenNthCalledWith(5, '/search')
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('accepts only GET requests', async () => {
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.revalidate).not.toHaveBeenCalled()
  })
})
