// __tests__/lib/utils/index.test.js
import {
  sliceUrlFromHttp,
  convertUrlStartWithOneSlash,
  isHttpLink,
  isMailOrTelLink,
  checkStrIsUuid,
  checkStrIsNotionId,
  getLastPartOfUrl,
  getQueryParam,
  mergeDeep,
  isObject,
  isIterable,
  deepClone,
  shuffleArray
} from '@/lib/utils'

describe('Utils - URL Functions', () => {
  describe('sliceUrlFromHttp', () => {
    it('extracts URL starting from http', () => {
      expect(sliceUrlFromHttp('article/https://test.com')).toBe('https://test.com')
      expect(sliceUrlFromHttp('prefix/http://example.com')).toBe('http://example.com')
    })

    it('returns original string if no http found', () => {
      expect(sliceUrlFromHttp('no-url-here')).toBe('no-url-here')
      expect(sliceUrlFromHttp('')).toBe('')
    })
  })

  describe('convertUrlStartWithOneSlash', () => {
    it('adds leading slash if missing', () => {
      expect(convertUrlStartWithOneSlash('test')).toBe('/test')
      expect(convertUrlStartWithOneSlash('about')).toBe('/about')
    })

    it('removes duplicate leading slashes', () => {
      expect(convertUrlStartWithOneSlash('///test')).toBe('/test')
      expect(convertUrlStartWithOneSlash('//about')).toBe('/about')
    })

    it('returns # for null or undefined', () => {
      expect(convertUrlStartWithOneSlash(null)).toBe('#')
      expect(convertUrlStartWithOneSlash(undefined)).toBe('#')
    })
  })

  describe('isHttpLink', () => {
    it('identifies HTTP/HTTPS links', () => {
      expect(isHttpLink('https://example.com')).toBe(true)
      expect(isHttpLink('http://test.org')).toBe(true)
    })

    it('rejects non-HTTP links', () => {
      expect(isHttpLink('/about')).toBe(false)
      expect(isHttpLink('ftp://example.com')).toBe(false)
      expect(isHttpLink('')).toBe(false)
    })
  })

  describe('isMailOrTelLink', () => {
    it('identifies mailto and tel links', () => {
      expect(isMailOrTelLink('mailto:test@example.com')).toBe(true)
      expect(isMailOrTelLink('tel:+1234567890')).toBe(true)
    })

    it('rejects other link types', () => {
      expect(isMailOrTelLink('https://example.com')).toBe(false)
      expect(isMailOrTelLink('/about')).toBe(false)
    })
  })

  describe('checkStrIsUuid', () => {
    it('validates UUID format', () => {
      expect(checkStrIsUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
      expect(checkStrIsUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
    })

    it('rejects invalid UUID', () => {
      expect(checkStrIsUuid('not-a-uuid')).toBe(false)
      expect(checkStrIsUuid('123-456')).toBe(false)
      expect(checkStrIsUuid('')).toBe(false)
    })
  })

  describe('checkStrIsNotionId', () => {
    it('validates 32-character alphanumeric Notion ID', () => {
      expect(checkStrIsNotionId('abcdef1234567890abcdef1234567890')).toBe(true)
      expect(checkStrIsNotionId('12345678901234567890123456789012')).toBe(true)
    })

    it('rejects invalid Notion ID', () => {
      expect(checkStrIsNotionId('short')).toBe(false)
      expect(checkStrIsNotionId('has-dashes-123456789012345678901')).toBe(false)
      expect(checkStrIsNotionId('')).toBe(false)
    })
  })

  describe('getLastPartOfUrl', () => {
    it('extracts last segment after slash', () => {
      expect(getLastPartOfUrl('https://example.com/blog/post')).toBe('post')
      expect(getLastPartOfUrl('/category/tech')).toBe('tech')
    })

    it('returns full string if no slash', () => {
      expect(getLastPartOfUrl('filename')).toBe('filename')
    })

    it('handles empty input', () => {
      expect(getLastPartOfUrl('')).toBe('')
      expect(getLastPartOfUrl(null)).toBe('')
    })
  })

  describe('getQueryParam', () => {
    it('extracts query parameter from URL', () => {
      expect(getQueryParam('https://example.com?theme=dark', 'theme')).toBe('dark')
      expect(getQueryParam('https://test.com?page=2&sort=asc', 'page')).toBe('2')
    })

    it('returns null for missing parameter', () => {
      expect(getQueryParam('https://example.com?theme=dark', 'missing')).toBe(null)
    })

    it('handles URL with hash', () => {
      expect(getQueryParam('https://example.com?theme=dark#section', 'theme')).toBe('dark')
    })
  })
})

describe('Utils - Object Functions', () => {
  describe('isObject', () => {
    it('identifies plain objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ key: 'value' })).toBe(true)
    })

    it('rejects non-objects', () => {
      expect(isObject([])).toBe(false)
      expect(isObject('string')).toBe(false)
      expect(isObject(123)).toBe(false)
    })
  })

  describe('isIterable', () => {
    it('identifies iterable objects', () => {
      expect(isIterable([])).toBe(true)
      expect(isIterable('string')).toBe(true)
      expect(isIterable(new Set())).toBe(true)
    })

    it('rejects non-iterable objects', () => {
      expect(isIterable({})).toBe(false)
      expect(isIterable(null)).toBe(false)
      expect(isIterable(undefined)).toBe(false)
    })
  })

  describe('deepClone', () => {
    it('clones objects deeply', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = deepClone(original)
      
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
    })

    it('clones arrays deeply', () => {
      const original = [1, [2, 3], { a: 4 }]
      const cloned = deepClone(original)
      
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned[1]).not.toBe(original[1])
    })

    it('handles Date objects', () => {
      const date = new Date('2024-01-01')
      const obj = { date }
      const cloned = deepClone(obj)
      
      expect(cloned.date).toBe(date.toISOString())
    })
  })

  describe('mergeDeep', () => {
    it('merges objects deeply', () => {
      const target = { a: 1, b: { c: 2 } }
      const source = { b: { d: 3 }, e: 4 }
      const result = mergeDeep(target, source)
      
      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 })
    })

    it('overwrites primitive values', () => {
      const target = { a: 1 }
      const source = { a: 2 }
      const result = mergeDeep(target, source)
      
      expect(result.a).toBe(2)
    })
  })

  describe('shuffleArray', () => {
    it('returns array with same elements', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray([...original])
      
      expect(shuffled.sort()).toEqual(original.sort())
    })

    it('handles empty array', () => {
      expect(shuffleArray([])).toEqual([])
    })

    it('handles null input', () => {
      expect(shuffleArray(null)).toEqual([])
    })
  })
})