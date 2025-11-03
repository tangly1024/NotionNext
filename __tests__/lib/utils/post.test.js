// __tests__/lib/utils/post.test.js
import {
  getRecommendPost,
  checkSlugHasNoSlash,
  checkSlugHasOneSlash,
  checkSlugHasMorThanTwoSlash
} from '@/lib/utils/post'

describe('Post Utils', () => {
  describe('getRecommendPost', () => {
    const allPosts = [
      { id: '1', type: 'Post', tags: ['tech', 'javascript'] },
      { id: '2', type: 'Post', tags: ['tech', 'react'] },
      { id: '3', type: 'Post', tags: ['design', 'ui'] },
      { id: '4', type: 'Post', tags: ['javascript', 'node'] },
      { id: '5', type: 'Page', tags: ['tech'] }
    ]

    it('returns posts with matching tags', () => {
      const currentPost = { id: '1', tags: ['tech', 'javascript'] }
      const recommended = getRecommendPost(currentPost, allPosts, 6)
      
      expect(recommended.length).toBeGreaterThan(0)
      expect(recommended.every(p => p.id !== '1')).toBe(true)
    })

    it('excludes current post from recommendations', () => {
      const currentPost = { id: '2', tags: ['tech'] }
      const recommended = getRecommendPost(currentPost, allPosts, 6)
      
      expect(recommended.find(p => p.id === '2')).toBeUndefined()
    })

    it('limits results to specified count', () => {
      const currentPost = { id: '1', tags: ['tech', 'javascript'] }
      const recommended = getRecommendPost(currentPost, allPosts, 2)
      
      expect(recommended.length).toBeLessThanOrEqual(2)
    })

    it('excludes non-Post types', () => {
      const currentPost = { id: '1', tags: ['tech'] }
      const recommended = getRecommendPost(currentPost, allPosts, 6)
      
      expect(recommended.every(p => p.type.includes('Post'))).toBe(true)
    })

    it('handles post with no tags', () => {
      const currentPost = { id: '1', tags: [] }
      const recommended = getRecommendPost(currentPost, allPosts, 6)
      
      expect(recommended).toEqual([])
    })
  })

  describe('checkSlugHasNoSlash', () => {
    it('returns true for slug without slashes', () => {
      expect(checkSlugHasNoSlash({ slug: 'about', type: 'Post' })).toBe(true)
      expect(checkSlugHasNoSlash({ slug: 'contact', type: 'Post' })).toBe(true)
    })

    it('returns false for slug with slashes', () => {
      expect(checkSlugHasNoSlash({ slug: 'blog/post', type: 'Post' })).toBe(false)
      expect(checkSlugHasNoSlash({ slug: '/about', type: 'Post' })).toBe(false)
    })

    it('returns false for HTTP links', () => {
      expect(checkSlugHasNoSlash({ slug: 'https://example.com', type: 'Post' })).toBe(false)
    })

    it('returns false for Menu type', () => {
      expect(checkSlugHasNoSlash({ slug: 'about', type: 'Menu' })).toBe(false)
    })
  })

  describe('checkSlugHasOneSlash', () => {
    it('returns true for slug with exactly one slash', () => {
      expect(checkSlugHasOneSlash({ slug: 'blog/post', type: 'Post' })).toBe(true)
      expect(checkSlugHasOneSlash({ slug: '/category/tech', type: 'Post' })).toBe(false)
    })

    it('returns false for slug without slashes', () => {
      expect(checkSlugHasOneSlash({ slug: 'about', type: 'Post' })).toBe(false)
    })

    it('returns false for slug with multiple slashes', () => {
      expect(checkSlugHasOneSlash({ slug: 'blog/category/post', type: 'Post' })).toBe(false)
    })
  })

  describe('checkSlugHasMorThanTwoSlash', () => {
    it('returns true for slug with 2+ slashes', () => {
      expect(checkSlugHasMorThanTwoSlash({ slug: 'blog/category/post', type: 'Post' })).toBe(true)
      expect(checkSlugHasMorThanTwoSlash({ slug: 'a/b/c/d', type: 'Post' })).toBe(true)
    })

    it('returns false for slug with less than 2 slashes', () => {
      expect(checkSlugHasMorThanTwoSlash({ slug: 'blog/post', type: 'Post' })).toBe(false)
      expect(checkSlugHasMorThanTwoSlash({ slug: 'about', type: 'Post' })).toBe(false)
    })
  })
})