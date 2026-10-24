import { createFeed, createFeedFileUrl } from '@/lib/utils/rss'

const addItemMock = jest.fn()
const rss2Mock = jest.fn(() => '<rss>ok</rss>')
const atom1Mock = jest.fn(() => '<atom>ok</atom>')
const json1Mock = jest.fn(() => '{"ok":true}')
const feedCtorMock = jest.fn()

jest.mock('feed', () => ({
  Feed: jest.fn().mockImplementation(options => {
    feedCtorMock(options)
    return {
      addItem: addItemMock,
      rss2: rss2Mock,
      atom1: atom1Mock,
      json1: json1Mock
    }
  })
}))

jest.mock('react-dom/server', () => ({
  __esModule: true,
  default: {
    renderToString: jest.fn(() => '<div>rss-content</div>')
  }
}))

jest.mock('@/components/NotionPage', () => ({
  __esModule: true,
  default: () => null
}))

jest.mock('@/lib/db/SiteDataApi', () => ({
  getPostBlocks: jest.fn(() => Promise.resolve(null))
}))

jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  formatNotionBlock: jest.fn(block => block)
}))

jest.mock('@/lib/utils/notion.util', () => ({
  adapterNotionBlockMap: jest.fn(blockMap => blockMap)
}))

jest.mock('@/lib/plugins/mailEncrypt', () => ({
  decryptEmail: jest.fn(() => 'a@example.com')
}))

const siteInfo = {
  title: 'Demo Site',
  description: 'Demo description',
  link: 'https://example.com/'
}

const NOTION_CONFIG = {
  AUTHOR: 'Tester',
  LANG: 'zh-CN',
  CONTACT_EMAIL: 'a@example.com'
}

describe('createFeedFileUrl', () => {
  it('never produces double slashes', () => {
    expect(createFeedFileUrl('https://example.com/', '', 'rss/feed.xml')).toBe(
      'https://example.com/rss/feed.xml'
    )
    expect(
      createFeedFileUrl('https://example.com', 'blog', 'rss/feed.xml')
    ).toBe('https://example.com/blog/rss/feed.xml')
    expect(
      createFeedFileUrl('https://example.com/', '/blog/', 'rss/feed.xml')
    ).toBe('https://example.com/blog/rss/feed.xml')
  })

  it('returns the site root when no file is given', () => {
    expect(createFeedFileUrl('https://example.com/', '')).toBe(
      'https://example.com'
    )
    expect(createFeedFileUrl('https://example.com/', 'blog', '')).toBe(
      'https://example.com/blog'
    )
  })
})

describe('createFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders article content so fallback feeds are not title-only', async () => {
    await createFeed({
      siteInfo,
      NOTION_CONFIG,
      posts: [
        {
          id: 'post-1',
          title: 'Hello',
          slug: 'hello',
          summary: 'summary text',
          publishDay: '2024-01-02'
        }
      ],
      allPages: [],
      subPath: '',
      renderContent: post => Promise.resolve(`<p>${post.summary}</p>`)
    })

    expect(addItemMock).toHaveBeenCalledTimes(1)
    expect(addItemMock.mock.calls[0][0]).toMatchObject({
      title: 'Hello',
      link: 'https://example.com/hello',
      description: 'summary text',
      content: '<p>summary text</p>'
    })
  })

  it('falls back to publishDate when publishDay is missing', async () => {
    await createFeed({
      siteInfo,
      NOTION_CONFIG,
      posts: [
        {
          id: 'post-2',
          title: 'Dated',
          slug: 'dated',
          summary: 's',
          publishDate: '2023-05-06'
        }
      ],
      allPages: [],
      renderContent: () => Promise.resolve('content')
    })

    expect(addItemMock.mock.calls[0][0].date).toEqual(new Date('2023-05-06'))
  })

  it('declares a feed id and a slash-safe site link', async () => {
    await createFeed({
      siteInfo,
      NOTION_CONFIG,
      posts: [],
      allPages: [],
      subPath: 'blog'
    })

    expect(feedCtorMock).toHaveBeenCalledTimes(1)
    expect(feedCtorMock.mock.calls[0][0]).toMatchObject({
      id: 'https://example.com/blog/rss/feed.xml',
      link: 'https://example.com/blog',
      title: 'Demo Site',
      language: 'zh-CN'
    })
  })
})
