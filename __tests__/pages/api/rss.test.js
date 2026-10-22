const fetchGlobalAllDataMock = jest.fn()
const createFeedMock = jest.fn()

jest.mock('@/lib/db/SiteDataApi', () => ({
  fetchGlobalAllData: (...args) => fetchGlobalAllDataMock(...args)
}))

jest.mock('@/lib/utils/rss', () => ({
  createFeed: (...args) => createFeedMock(...args)
}))

const loadHandler = () => {
  let handler
  jest.isolateModules(() => {
    handler = require('@/pages/api/rss').default
  })
  return handler
}

const createResponse = () => {
  const res = {
    statusCode: 0,
    body: null,
    headers: {},
    setHeader: jest.fn((key, value) => {
      res.headers[key] = value
    }),
    status: jest.fn(code => {
      res.statusCode = code
      return res
    }),
    send: jest.fn(payload => {
      res.body = payload
      return res
    }),
    json: jest.fn(payload => {
      res.body = payload
      return res
    })
  }
  return res
}

const publishedPost = {
  id: 'post-1',
  title: 'Hello',
  slug: 'hello',
  summary: 'summary',
  type: 'Post',
  status: 'Published',
  publishDay: '2024-01-02'
}

const siteData = {
  siteInfo: { title: 'Demo', description: 'desc', link: 'https://example.com' },
  allPages: [],
  NOTION_CONFIG: { AUTHOR: 'Tester', SUB_PATH: '' },
  latestPosts: [publishedPost]
}

const feedStub = () => ({
  rss2: () => '<rss>full</rss>',
  atom1: () => '<atom>full</atom>',
  json1: () => '{"items":1}'
})

describe('/api/rss fallback', () => {
  beforeEach(() => {
    fetchGlobalAllDataMock.mockReset()
    createFeedMock.mockReset()
  })

  it('renders the feed through the shared builder instead of a title-only list', async () => {
    fetchGlobalAllDataMock.mockResolvedValue(siteData)
    createFeedMock.mockResolvedValue(feedStub())

    const res = createResponse()
    await loadHandler()({ method: 'GET', query: {} }, res)

    expect(createFeedMock).toHaveBeenCalledTimes(1)
    const feedArgs = createFeedMock.mock.calls[0][0]
    expect(feedArgs.posts).toEqual([publishedPost])
    expect(feedArgs.siteInfo).toBe(siteData.siteInfo)
    expect(feedArgs.allPages).toBe(siteData.allPages)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBe('<rss>full</rss>')
    expect(res.headers['Content-Type']).toBe(
      'application/rss+xml; charset=utf-8'
    )
  })

  it('serves atom and json variants from the same feed', async () => {
    fetchGlobalAllDataMock.mockResolvedValue(siteData)
    createFeedMock.mockResolvedValue(feedStub())

    const atomRes = createResponse()
    await loadHandler()({ method: 'GET', query: { format: 'atom' } }, atomRes)
    expect(atomRes.body).toBe('<atom>full</atom>')

    const jsonRes = createResponse()
    await loadHandler()({ method: 'GET', query: { format: 'json' } }, jsonRes)
    expect(jsonRes.body).toBe('{"items":1}')
  })

  it('keeps the 503 response when no published posts are available', async () => {
    fetchGlobalAllDataMock.mockResolvedValue({ ...siteData, latestPosts: [] })

    const res = createResponse()
    await loadHandler()({ method: 'GET', query: {} }, res)

    expect(createFeedMock).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(503)
  })

  it('returns 500 when feed generation throws', async () => {
    fetchGlobalAllDataMock.mockResolvedValue(siteData)
    createFeedMock.mockRejectedValue(new Error('boom'))

    const res = createResponse()
    await loadHandler()({ method: 'GET', query: {} }, res)

    expect(res.statusCode).toBe(500)
  })
})
