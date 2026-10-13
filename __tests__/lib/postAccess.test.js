/** @jest-environment node */
import { createHash } from 'crypto'
import { resolvePostProps, fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getOrSetDataWithCache } from '@/lib/cache/cache_manager'
import { fetchNotionPageBlocks } from '@/lib/db/notion/getPostBlocks'
import { fetchPageFromNotion } from '@/lib/db/notion/getNotionPost'
import { processPostData } from '@/lib/utils/post'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import {
  redactProtectedBlocks,
  verifyPostPassword
} from '@/lib/server/postAccess'

jest.mock('@/blog.config', () => ({
  NOTION_PAGE_ID: 'audit-root',
  LANG: 'zh-CN',
  LINK: 'https://example.invalid',
  AUTHOR: 'Audit',
  POST_RECOMMEND_COUNT: 6
}))
jest.mock('@/lib/cache/cache_manager', () => ({
  getOrSetDataWithCache: jest.fn()
}))
jest.mock('@/lib/db/notion/getNotionAPI', () => ({
  __esModule: true,
  default: {}
}))
jest.mock('@/lib/db/notion/getNotionPost', () => ({
  fetchPageFromNotion: jest.fn()
}))
jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  fetchNotionPageBlocks: jest.fn(),
  formatNotionBlock: block => block
}))
jest.mock('@/lib/utils/notion.util', () => ({
  adapterNotionBlockMap: jest.fn(raw => raw)
}))
jest.mock('@/lib/utils/post', () => ({
  ...jest.requireActual('@/lib/utils/post'),
  processPostData: jest.fn((...args) => jest.requireActual('@/lib/utils/post').processPostData(...args))
}))
jest.mock('@/lib/plugins/algolia', () => ({ uploadDataToAlgolia: jest.fn() }))
jest.mock('@/lib/utils/originalityProofManifest', () => ({
  isOriginalityProofAutoManifestEnabled: () => false,
  findOriginalityProofManifestRecord: () => null,
  recordOriginalityProofManifest: () => {}
}))
jest.mock('p-limit', () => () => fn => fn())
jest.mock('notion-utils', () => ({
  idToUuid: value => value,
  getTextContent: value => (value || []).map(x => x[0]).join('')
}))

const id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const textId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
const secret = 'regression-password'
const digest = createHash('sha256').update(secret).digest('hex')
const marker = 'PRIVATE_BODY_REGRESSION_MARKER'
const options = { prefix: 'protected', locale: 'zh-CN' }
const body = () => ({
  block: {
    [id]: {
      value: {
        id,
        type: 'page',
        content: [textId],
        properties: { title: [['Title']], secretColumn: [[secret]] }
      }
    },
    [textId]: {
      value: {
        id: textId,
        type: 'text',
        parent_id: id,
        properties: { title: [[marker]] }
      }
    }
  }
})

beforeEach(() => {
  delete process.env.EXPORT
  getOrSetDataWithCache.mockResolvedValue({
    NOTION_CONFIG: {},
    allPages: [
      {
        id,
        title: 'Title',
        slug: 'protected',
        type: 'Post',
        status: 'Published',
        password: digest,
        tags: []
      }
    ],
    latestPosts: [],
    tagOptions: []
  })
  fetchNotionPageBlocks.mockImplementation(() => Promise.resolve(body()))
})

it.each([undefined, 'wrong password'])(
  'never fetches or serializes protected body without a valid password (%s)',
  async password => {
    const props = await resolvePostProps({ ...options, password })
    expect(props.post.password).toBe('protected')
    expect(props.post.blockMap).toBeUndefined()
    expect(JSON.stringify(props)).not.toContain(digest)
    expect(JSON.stringify(props)).not.toContain(marker)
    expect(fetchNotionPageBlocks).not.toHaveBeenCalled()
  }
)

it('returns the body only after server verification, without the Notion password column', async () => {
  const props = await resolvePostProps({ ...options, password: secret })
  expect(JSON.stringify(props.post)).toContain(marker)
  expect(JSON.stringify(props)).not.toContain(secret)
  expect(JSON.stringify(props)).not.toContain(digest)
})

it.each([id, id.replace(/-/g, ''), `other/${id.replace(/-/g, '')}`])(
  'does not bypass a password through a UUID alias: %s',
  async path => {
    const [prefix, slug] = path.split('/')
    const props = await resolvePostProps({ prefix, slug })
    expect(props.post.password).toBe('protected')
    expect(props.post.blockMap).toBeUndefined()
    expect(fetchPageFromNotion).not.toHaveBeenCalled()
  }
)

it('redacts hashes from public global page data while retaining server-side verification data', async () => {
  expect(JSON.stringify(await fetchGlobalAllData({}))).not.toContain(digest)
  expect(
    (await fetchGlobalAllData({ includePasswordHashes: true })).allPages[0]
      .password
  ).toBe(digest)
})

it.each([null, { block: {} }])(
  'rejects missing/invalid body data instead of generating a successful blank article (%j)',
  async blocks => {
    fetchNotionPageBlocks.mockResolvedValue(blocks)
    await expect(
      resolvePostProps({ ...options, password: secret })
    ).rejects.toThrow('Unable to load article body')
  }
)

it('propagates an upstream failure so ISR can keep its successful version', async () => {
  fetchNotionPageBlocks.mockRejectedValue(new Error('timeout'))
  await expect(
    resolvePostProps({ ...options, password: secret })
  ).rejects.toThrow('Unable to load article body')
})

it.each([undefined, secret])('exports only a safe lock page even with a valid password (%s)', async password => {
  process.env.EXPORT = 'true'
  try {
    const props = await resolvePostProps({ ...options, password })
    expect(props.postUnlockUnavailable).toBe(true)
    expect(props.post.password).toBe('protected')
    expect(props.post.blockMap).toBeUndefined()
    expect(JSON.stringify(props)).not.toContain(marker)
    expect(JSON.stringify(props)).not.toContain(digest)
    expect(fetchNotionPageBlocks).not.toHaveBeenCalled()
  } finally {
    delete process.env.EXPORT
  }
})

it('exports public content while removing a nested protected article', async () => {
  process.env.EXPORT = 'true'
  const publicId = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
  const publicTextId = 'dddddddd-dddd-dddd-dddd-dddddddddddd'
  const cached = await getOrSetDataWithCache()
  cached.allPages.push({ id: publicId, title: 'Public article', slug: 'public', type: 'Post', status: 'Published', tags: [] })
  const blocks = body()
  blocks.block[publicId] = { value: { id: publicId, type: 'page', content: [id, publicTextId], properties: { title: [['Public article']] } } }
  blocks.block[id].value.parent_id = publicId
  blocks.block[publicTextId] = { value: { id: publicTextId, type: 'text', parent_id: publicId, properties: { title: [['PUBLIC_EXPORT_BODY']] } } }
  fetchNotionPageBlocks.mockResolvedValueOnce(blocks)
  try {
    const props = await resolvePostProps({ prefix: 'public' })
    expect(JSON.stringify(props.post)).toContain('PUBLIC_EXPORT_BODY')
    expect(JSON.stringify(props)).not.toContain(marker)
    expect(JSON.stringify(props)).not.toContain(digest)
    expect(props.postUnlockUnavailable).toBeUndefined()
  } finally {
    delete process.env.EXPORT
  }
})

it.each(['fetch', 'adapt', 'process'])(
  'renders a safe public summary after a %s failure',
  async failure => {
    const cached = await getOrSetDataWithCache()
    cached.allPages[0].password = ''
    if (failure === 'fetch') fetchNotionPageBlocks.mockRejectedValueOnce(new Error('timeout'))
    if (failure === 'adapt') adapterNotionBlockMap.mockImplementationOnce(() => { throw new Error('bad blocks') })
    if (failure === 'process') processPostData.mockImplementationOnce(async props => {
      props.post.aiSummary = marker
      props.prev = { password: digest, blockMap: body() }
      throw new Error('summary failure')
    })
    const props = await resolvePostProps(options)
    expect(props.post.title).toBe('Title')
    expect(props.post.blockMap).toBeUndefined()
    expect(JSON.stringify(props)).not.toContain(marker)
    expect(JSON.stringify(props)).not.toContain(digest)
  }
)

it('keeps protected processing failures closed', async () => {
  processPostData.mockRejectedValueOnce(new Error('processing failed'))
  await expect(resolvePostProps({ ...options, password: secret })).rejects.toThrow('processing failed')
})

it('turns failed UUID fetches into not-found without exposing a partial body', async () => {
  fetchPageFromNotion.mockRejectedValueOnce(new Error('Notion unavailable'))
  expect((await resolvePostProps({ prefix: textId })).post).toBeNull()
})

it('keeps compatibility with precomputed uppercase SHA256 and legacy MD5', () => {
  expect(verifyPostPassword({ password: digest.toUpperCase() }, secret)).toBe(
    true
  )
  // Historical fixture for slug "protected" and password "regression-password".
  // Read compatibility must not require generating new legacy password hashes.
  const legacy = '9a311a7d5436c9dd57f43f36fe6b6354'
  expect(
    verifyPostPassword({ slug: 'protected', password: legacy }, secret)
  ).toBe(true)
  expect(
    verifyPostPassword({ slug: 'protected', password: legacy }, 'incorrect')
  ).toBe(false)
  expect(verifyPostPassword({ password: 'protected' }, secret)).toBe(false)
})

it('does not mutate cached raw blocks while removing private Notion properties', async () => {
  const raw = body()
  fetchNotionPageBlocks.mockResolvedValue(raw)
  await resolvePostProps({ ...options, password: secret })
  expect(raw.block[id].value.properties.secretColumn).toEqual([[secret]])
})

it('redacts a protected nested page, its descendants, and signed attachment URLs', () => {
  const outer = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
  const post = {
    id: outer,
    blockMap: {
      ...body(),
      signed_urls: { [textId]: 'https://private.example/file' }
    }
  }
  post.blockMap.block[outer] = {
    value: { id: outer, type: 'page', content: [id] }
  }
  post.blockMap.block[id].value.parent_id = outer
  redactProtectedBlocks(post, [{ id, password: digest }])
  expect(JSON.stringify(post)).not.toContain(marker)
  expect(Object.keys(post.blockMap.block)).toEqual([outer])
  expect(post.blockMap.signed_urls).toEqual({})
  expect(post.blockMap.block[outer].value.content).toEqual([])
})

it('denies unknown UUID pages without a catalogued ancestor', async () => {
  const unknown = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
  fetchPageFromNotion.mockResolvedValue({
    id: unknown,
    blockMap: { block: { [unknown]: { value: { id: unknown, type: 'page' } } } }
  })
  expect((await resolvePostProps({ prefix: unknown })).post).toBeNull()
})

it('allows a nested page only after verifying its protected catalog ancestor', async () => {
  const child = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
  const blocks = body()
  blocks.block[child] = { value: { id: child, type: 'page', parent_id: id, content: [textId], properties: { title: [['Child']] } } }
  blocks.block[textId].value.parent_id = child
  blocks.block[id].value.content = [child]
  fetchPageFromNotion.mockResolvedValue({ id: child, title: 'Child', slug: child, type: 'Page', tags: [], blockMap: blocks })
  const locked = await resolvePostProps({ prefix: child })
  expect(locked.post.blockMap).toBeUndefined()
  const unlocked = await resolvePostProps({ prefix: child, password: secret })
  expect(JSON.stringify(unlocked.post)).toContain(marker)
  expect(unlocked.post.blockMap.block[child]).toBeDefined()
  expect(unlocked.post.blockMap.block[id]).toBeUndefined()
})
