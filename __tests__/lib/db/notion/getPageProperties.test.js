/**
 * @jest-environment node
 */

import { adjustPageProperties } from '@/lib/db/notion/getPageProperties'

jest.mock('notion-utils', () => ({
  getDateValue: jest.fn(),
  getTextContent: jest.fn()
}))

jest.mock('@/lib/db/notion/getNotionAPI', () => ({
  __esModule: true,
  default: {
    getUsers: jest.fn()
  }
}))

describe('adjustPageProperties', () => {
  it('uses category mapping for pages only when the page category is mapped', () => {
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%/%year%/%month%/%day%',
      POST_URL_PREFIX_MAPPING_CATEGORY: {
        Guide: 'manual'
      },
      PSEUDO_STATIC: false
    }

    const mappedPage = {
      id: 'page-id',
      type: 'Page',
      slug: 'a-manual',
      category: 'Guide'
    }
    const plainPage = {
      id: 'plain-id',
      type: 'Page',
      slug: 'a-book',
      category: 'Book'
    }

    adjustPageProperties(mappedPage, NOTION_CONFIG)
    adjustPageProperties(plainPage, NOTION_CONFIG)

    expect(mappedPage.slug).toBe('manual/a-manual')
    expect(mappedPage.href).toBe('/manual/a-manual')
    expect(plainPage.slug).toBe('a-book')
    expect(plainPage.href).toBe('/a-book')
  })

  it('keeps date segments for mapped pages that have a Date', () => {
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%/%year%/%month%/%day%',
      POST_URL_PREFIX_MAPPING_CATEGORY: { Guide: 'manual' },
      PSEUDO_STATIC: false
    }
    const page = {
      id: 'page-id',
      type: 'Page',
      slug: 'a-manual',
      category: 'Guide',
      date: { start_date: '2026-08-01' },
      publishDay: '2026-08-01'
    }

    adjustPageProperties(page, NOTION_CONFIG)

    expect(page.slug).toBe('manual/2026/08/01/a-manual')
    expect(page.href).toBe('/manual/2026/08/01/a-manual')
  })

  it('falls back to /category/slug for mapped pages without a Date even when publishDay came from created_time', () => {
    const NOTION_CONFIG = {
      POST_URL_PREFIX: '%category%/%year%/%month%/%day%',
      POST_URL_PREFIX_MAPPING_CATEGORY: { Guide: 'manual' },
      PSEUDO_STATIC: false
    }
    const page = {
      id: 'page-id',
      type: 'Page',
      slug: 'a-manual',
      category: 'Guide',
      publishDay: '2026-08-01'
    }

    adjustPageProperties(page, NOTION_CONFIG)

    expect(page.slug).toBe('manual/a-manual')
    expect(page.href).toBe('/manual/a-manual')
  })
})
