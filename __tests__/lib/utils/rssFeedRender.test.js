import { createFeed } from '@/lib/utils/rss'

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

const NOTION_CONFIG = { AUTHOR: 'Tester', LANG: 'zh-CN' }

const posts = [
  {
    id: 'post-1',
    title: 'Hello',
    slug: 'hello',
    summary: 'summary text',
    publishDay: '2024-01-02'
  }
]

const build = () =>
  createFeed({
    siteInfo,
    NOTION_CONFIG,
    posts,
    allPages: [],
    subPath: '',
    renderContent: post => Promise.resolve(`<p>${post.summary}</p>`)
  })

describe('rendered feed output', () => {
  it('includes article bodies in content:encoded', async () => {
    const feed = await build()
    const xml = feed.rss2()

    expect(xml).toContain('<content:encoded>')
    expect(xml).toContain('<![CDATA[<p>summary text</p>]]>')
  })

  it('declares a non-empty feed id for atom consumers', async () => {
    const feed = await build()
    const atom = feed.atom1()

    expect(atom).toContain('<id>https://example.com/rss/feed.xml</id>')
    expect(atom).not.toContain('<id/>')
  })

  it('keeps the site link free of trailing and double slashes', async () => {
    const feed = await build()
    const xml = feed.rss2()

    expect(xml).toContain('<link>https://example.com</link>')
    expect(xml).not.toContain('https://example.com//')
  })

  it('keeps protected posts to their summary without reading blocks', async () => {
    const { getPostBlocks } = require('@/lib/db/SiteDataApi')

    const feed = await createFeed({
      siteInfo,
      NOTION_CONFIG,
      posts: [
        {
          id: 'locked',
          title: 'Locked',
          slug: 'locked',
          summary: 'only summary',
          password: 'secret',
          publishDay: '2024-02-03'
        }
      ],
      allPages: [],
      subPath: ''
    })

    expect(getPostBlocks).not.toHaveBeenCalled()
    expect(feed.rss2()).toContain('<![CDATA[only summary]]>')
  })
})
