import { buildRouteSiteContext } from '@/lib/routes/siteContext'

describe('route site context builder', () => {
  test('keeps route-required fields and strips heavy raw fields', () => {
    const context = buildRouteSiteContext({
      allPages: [{ id: '1', slug: 'article/test', status: 'Published' }],
      allNavPages: [{ id: '2', slug: 'about' }],
      latestPosts: [{ id: '3', slug: 'article/latest' }],
      customMenu: [{ title: 'Docs', href: '/docs' }],
      notice: { id: '4', title: 'Notice' },
      NOTION_CONFIG: { THEME: 'heo' },
      rawMetadata: { huge: true },
      collection: [{ id: 'x' }],
      collectionQuery: { query: true },
      collectionView: { view: true },
      block: { block: true },
      schema: { schema: true },
      pageIds: ['1', '2']
    })

    expect(context).toEqual({
      allPages: [{ id: '1', slug: 'article/test', status: 'Published' }],
      allNavPages: [{ id: '2', slug: 'about' }],
      latestPosts: [{ id: '3', slug: 'article/latest' }],
      customMenu: [{ title: 'Docs', href: '/docs' }],
      notice: { id: '4', title: 'Notice' },
      NOTION_CONFIG: { THEME: 'heo' }
    })
  })
})
