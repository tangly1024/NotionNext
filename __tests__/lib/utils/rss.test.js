import fs from 'fs'
import { generateRss } from '@/lib/utils/rss'
import { getPostBlocks } from '@/lib/db/SiteDataApi'
import { formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'

const addItemMock = jest.fn()
const rss2Mock = jest.fn(() => '<rss>ok</rss>')
const atom1Mock = jest.fn(() => '<atom>ok</atom>')
const json1Mock = jest.fn(() => '{"ok":true}')

jest.mock('feed', () => ({
  Feed: jest.fn().mockImplementation(() => ({
    addItem: addItemMock,
    rss2: rss2Mock,
    atom1: atom1Mock,
    json1: json1Mock
  }))
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
  getPostBlocks: jest.fn()
}))

jest.mock('@/lib/db/notion/getPostBlocks', () => ({
  formatNotionBlock: jest.fn(block => block)
}))

jest.mock('@/lib/utils/notion.util', () => ({
  adapterNotionBlockMap: jest.fn(blockMap => blockMap)
}))

describe('generateRss', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(fs, 'statSync').mockImplementation(() => {
      throw new Error('ENOENT')
    })
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('adapts and formats blockMap before rendering RSS content', async () => {
    const rawBlockMap = {
      block: {
        x1: { id: 'x1', type: 'text' }
      }
    }
    const adaptedBlockMap = {
      block: {
        y1: { id: 'y1', type: 'text' }
      }
    }
    const formattedBlock = {
      y1: { id: 'y1', type: 'text', properties: {} }
    }

    getPostBlocks.mockResolvedValue(rawBlockMap)
    adapterNotionBlockMap.mockReturnValue(adaptedBlockMap)
    formatNotionBlock.mockReturnValue(formattedBlock)

    await generateRss({
      NOTION_CONFIG: {
        AUTHOR: 'author',
        LANG: 'zh-CN',
        SUB_PATH: '',
        CONTACT_EMAIL: ''
      },
      siteInfo: {
        title: 'site',
        description: 'desc',
        link: 'https://example.com'
      },
      latestPosts: [
        {
          id: 'post-1',
          slug: 'hello',
          title: 'Hello',
          summary: 'Summary',
          publishDay: '2026-02-18'
        }
      ]
    })

    expect(getPostBlocks).toHaveBeenCalledWith('post-1', 'rss-content')
    expect(adapterNotionBlockMap).toHaveBeenCalledWith(rawBlockMap)
    expect(formatNotionBlock).toHaveBeenCalledWith(
      expect.objectContaining({
        y1: expect.objectContaining({ id: 'y1', type: 'text' })
      })
    )
    expect(addItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        content: '<div>rss-content</div>'
      })
    )
    expect(fs.writeFileSync).toHaveBeenCalledTimes(3)
  })
})

