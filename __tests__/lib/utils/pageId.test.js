// __tests__/lib/utils/pageId.test.js
const { extractLangPrefix, extractLangId, getShortId } = require('@/lib/utils/pageId')

describe('PageId Utils', () => {
  describe('extractLangPrefix', () => {
    it('extracts language prefix from page ID', () => {
      expect(extractLangPrefix('en:page-id-123')).toBe('en')
      expect(extractLangPrefix('zh:page-id-456')).toBe('zh')
      expect(extractLangPrefix('fr:some-content')).toBe('fr')
    })

    it('returns empty string if no prefix', () => {
      expect(extractLangPrefix('page-id-123')).toBe('')
      expect(extractLangPrefix('no-colon-here')).toBe('')
    })
  })

  describe('extractLangId', () => {
    it('extracts ID after language prefix', () => {
      expect(extractLangId('en:page-id-123')).toBe('page-id-123')
      expect(extractLangId('zh:content-456')).toBe('content-456')
    })

    it('returns original string if no prefix', () => {
      expect(extractLangId('page-id-123')).toBe('page-id-123')
      expect(extractLangId('no-prefix')).toBe('no-prefix')
    })

    it('handles strings with spaces after colon', () => {
      expect(extractLangId('en: page-id-123')).toBe('page-id-123')
    })
  })

  describe('getShortId', () => {
    it('extracts short ID from UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const shortId = getShortId(uuid)
      
      expect(shortId).toBe('12d3-a456-426614174000')
      expect(shortId.length).toBeLessThan(uuid.length)
    })

    it('returns original if no dashes', () => {
      expect(getShortId('nodashes')).toBe('nodashes')
    })

    it('handles null or undefined', () => {
      expect(getShortId(null)).toBe(null)
      expect(getShortId(undefined)).toBe(undefined)
    })
  })
})