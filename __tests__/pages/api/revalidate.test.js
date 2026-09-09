import handler from '@/pages/api/revalidate'

jest.mock('@/lib/cache/local_file_cache', () => ({
  cleanCache: jest.fn()
}))

const createResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  setHeader: jest.fn(),
  revalidate: jest.fn().mockResolvedValue(undefined)
})

describe('POST /api/revalidate', () => {
  const token = 'test-revalidation-token'

  beforeEach(() => {
    process.env.REVALIDATION_TOKEN = token
    jest.clearAllMocks()
  })

  afterAll(() => {
    delete process.env.REVALIDATION_TOKEN
  })

  it('requires the bearer token in the Authorization header', async () => {
    const req = {
      method: 'POST',
      headers: {},
      body: { token }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      message: 'Unauthorized'
    })
    expect(res.revalidate).not.toHaveBeenCalled()
  })

  it('normalizes and revalidates a single path', async () => {
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: { path: '/article/sync-test/' }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.revalidate).toHaveBeenCalledWith('/article/sync-test')
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('accepts a batch of site paths', async () => {
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: { paths: ['/', '/archive'] }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.revalidate).toHaveBeenNthCalledWith(1, '/')
    expect(res.revalidate).toHaveBeenNthCalledWith(2, '/archive')
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('rejects unsafe paths', async () => {
    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: { paths: ['//external.example.com'] }
    }
    const res = createResponse()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.revalidate).not.toHaveBeenCalled()
  })
})
