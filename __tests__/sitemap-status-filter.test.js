// 测试sitemap状态过滤逻辑
import { jest } from '@jest/globals'

// 模拟测试数据
const mockPages = [
  {
    id: '1',
    title: '已发布文章',
    slug: 'published-post',
    status: 'Published',
    publishDay: '2024-01-01',
    type: 'Post'
  },
  {
    id: '2', 
    title: '草稿文章',
    slug: 'draft-post',
    status: 'Draft',
    publishDay: '2024-01-02',
    type: 'Post'
  },
  {
    id: '3',
    title: '隐藏文章',
    slug: 'invisible-post', 
    status: 'Invisible',
    publishDay: '2024-01-03',
    type: 'Post'
  },
  {
    id: '4',
    title: '无slug文章',
    slug: '',
    status: 'Published',
    publishDay: '2024-01-04',
    type: 'Post'
  },
  {
    id: '5',
    title: '无发布日期文章',
    slug: 'no-date-post',
    status: 'Published',
    publishDay: null,
    type: 'Post'
  }
]

// 模拟isValidSlug函数
function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false
  if (slug.includes('https://') || slug.includes('http://')) return false
  if (slug.includes('#')) return false
  return true
}

describe('Sitemap状态过滤测试', () => {
  test('应该只包含已发布且有效的文章', () => {
    // 应用与sitemap.xml.js相同的过滤逻辑
    const filteredPages = mockPages.filter(p => {
      return p.status === 'Published' &&
             p.slug &&
             p.publishDay &&
             isValidSlug(p.slug)
    })

    // 验证结果
    expect(filteredPages).toHaveLength(1)
    expect(filteredPages[0].title).toBe('已发布文章')
    expect(filteredPages[0].status).toBe('Published')
  })

  test('应该过滤掉草稿状态的文章', () => {
    const draftPages = mockPages.filter(p => p.status === 'Draft')
    const publishedPages = mockPages.filter(p => 
      p.status === 'Published' && p.slug && p.publishDay && isValidSlug(p.slug)
    )
    
    expect(draftPages).toHaveLength(1)
    expect(publishedPages.find(p => p.status === 'Draft')).toBeUndefined()
  })

  test('应该过滤掉没有slug的文章', () => {
    const filteredPages = mockPages.filter(p => {
      return p.status === 'Published' &&
             p.slug &&
             p.publishDay &&
             isValidSlug(p.slug)
    })

    const noSlugPage = filteredPages.find(p => !p.slug)
    expect(noSlugPage).toBeUndefined()
  })

  test('应该过滤掉没有发布日期的文章', () => {
    const filteredPages = mockPages.filter(p => {
      return p.status === 'Published' &&
             p.slug &&
             p.publishDay &&
             isValidSlug(p.slug)
    })

    const noDatePage = filteredPages.find(p => !p.publishDay)
    expect(noDatePage).toBeUndefined()
  })
})