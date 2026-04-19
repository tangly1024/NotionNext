import {
  buildMultiSegmentStaticPaths,
  buildSingleSegmentStaticPaths,
  buildTwoSegmentStaticPaths
} from '@/lib/routes/staticPaths'

describe('static article path builders', () => {
  const allPages = [
    { slug: 'about', status: 'Published', type: 'Page' },
    { slug: 'article/hello-world', status: 'Published', type: 'Post' },
    {
      slug: 'article/guides/ai-workflow-2026',
      status: 'Published',
      type: 'Post'
    },
    { slug: '/article/chatgpt-content-marketing-pros-cons/', status: 'Published', type: 'Post' },
    { slug: 'draft-post', status: 'Draft', type: 'Post' },
    { slug: 'https://example.com', status: 'Published', type: 'Page' },
    { slug: 'menu/item', status: 'Published', type: 'Menu' }
  ]

  test('builds single-segment static paths', () => {
    expect(buildSingleSegmentStaticPaths({ allPages, locale: 'zh-CN' })).toEqual([
      { params: { prefix: 'about' }, locale: 'zh-CN' }
    ])
  })

  test('builds two-segment static paths', () => {
    expect(buildTwoSegmentStaticPaths({ allPages, locale: 'en-US' })).toEqual([
      { params: { prefix: 'article', slug: 'hello-world' }, locale: 'en-US' },
      {
        params: { prefix: 'article', slug: 'chatgpt-content-marketing-pros-cons' },
        locale: 'en-US'
      }
    ])
  })

  test('supports allow-list filtering', () => {
    expect(
      buildTwoSegmentStaticPaths({
        allPages,
        locale: 'en-US',
        allowList: new Set(['article/chatgpt-content-marketing-pros-cons'])
      })
    ).toEqual([
      {
        params: { prefix: 'article', slug: 'chatgpt-content-marketing-pros-cons' },
        locale: 'en-US'
      }
    ])
  })

  test('builds multi-segment static paths', () => {
    expect(buildMultiSegmentStaticPaths({ allPages, locale: 'en-US' })).toEqual([
      {
        params: {
          prefix: 'article',
          slug: 'guides',
          suffix: ['ai-workflow-2026']
        },
        locale: 'en-US'
      }
    ])
  })
})
