import { Validator, Sanitizer, RateLimiter } from '@/lib/utils/validation'

describe('Validator', () => {
  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ]

      validEmails.forEach(email => {
        expect(Validator.isValidEmail(email)).toBe(true)
      })
    })

    it('rejects invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        '',
        null,
        undefined
      ]

      invalidEmails.forEach(email => {
        expect(Validator.isValidEmail(email)).toBe(false)
      })
    })
  })

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://test.org',
        'https://sub.domain.com/path?query=value',
        'http://localhost:3000'
      ]

      validUrls.forEach(url => {
        expect(Validator.isValidUrl(url)).toBe(true)
      })
    })

    it('rejects invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com',
        'javascript:alert(1)',
        '',
        null,
        undefined
      ]

      invalidUrls.forEach(url => {
        expect(Validator.isValidUrl(url)).toBe(false)
      })
    })
  })

  describe('isValidSlug', () => {
    it('validates correct slugs', () => {
      const validSlugs = [
        'hello-world',
        'test-post-123',
        'simple',
        'multi-word-slug'
      ]

      validSlugs.forEach(slug => {
        expect(Validator.isValidSlug(slug)).toBe(true)
      })
    })

    it('rejects invalid slugs', () => {
      const invalidSlugs = [
        'Hello World',
        'test_post',
        'slug with spaces',
        'UPPERCASE',
        '',
        null,
        undefined
      ]

      invalidSlugs.forEach(slug => {
        expect(Validator.isValidSlug(slug)).toBe(false)
      })
    })
  })

  describe('isValidNotionId', () => {
    it('validates correct Notion IDs', () => {
      const validIds = [
        '123e4567-e89b-12d3-a456-426614174000',
        '123e4567e89b12d3a456426614174000',
        'abcdef12-3456-7890-abcd-ef1234567890'
      ]

      validIds.forEach(id => {
        expect(Validator.isValidNotionId(id)).toBe(true)
      })
    })

    it('rejects invalid Notion IDs', () => {
      const invalidIds = [
        'not-a-uuid',
        '123-456-789',
        '',
        null,
        undefined
      ]

      invalidIds.forEach(id => {
        expect(Validator.isValidNotionId(id)).toBe(false)
      })
    })
  })

  describe('isValidLength', () => {
    it('validates string length correctly', () => {
      expect(Validator.isValidLength('hello', 1, 10)).toBe(true)
      expect(Validator.isValidLength('test', 4, 4)).toBe(true)
      expect(Validator.isValidLength('', 0, 5)).toBe(true)
    })

    it('rejects strings outside length range', () => {
      expect(Validator.isValidLength('hello', 10, 20)).toBe(false)
      expect(Validator.isValidLength('very long string', 1, 5)).toBe(false)
      expect(Validator.isValidLength('test', 5, 10)).toBe(false)
    })
  })

  describe('isValidNumber', () => {
    it('validates numbers in range', () => {
      expect(Validator.isValidNumber(5, 1, 10)).toBe(true)
      expect(Validator.isValidNumber(0, 0, 0)).toBe(true)
      expect(Validator.isValidNumber(-5, -10, 0)).toBe(true)
    })

    it('rejects numbers outside range', () => {
      expect(Validator.isValidNumber(15, 1, 10)).toBe(false)
      expect(Validator.isValidNumber(-5, 0, 10)).toBe(false)
      expect(Validator.isValidNumber(NaN, 1, 10)).toBe(false)
    })
  })
})

describe('Sanitizer', () => {
  describe('stripHtml', () => {
    it('removes HTML tags', () => {
      expect(Sanitizer.stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world')
      expect(Sanitizer.stripHtml('<script>alert(1)</script>')).toBe('alert(1)')
      expect(Sanitizer.stripHtml('No HTML here')).toBe('No HTML here')
    })

    it('handles empty or null input', () => {
      expect(Sanitizer.stripHtml('')).toBe('')
      expect(Sanitizer.stripHtml(null)).toBe('')
      expect(Sanitizer.stripHtml(undefined)).toBe('')
    })
  })

  describe('sanitizeXss', () => {
    it('removes XSS patterns', () => {
      expect(Sanitizer.sanitizeXss('<script>alert(1)</script>')).toBe('')
      expect(Sanitizer.sanitizeXss('<iframe src="evil.com"></iframe>')).toBe('')
      expect(Sanitizer.sanitizeXss('javascript:alert(1)')).toBe('')
    })

    it('preserves safe content', () => {
      expect(Sanitizer.sanitizeXss('Hello world')).toBe('Hello world')
      expect(Sanitizer.sanitizeXss('Safe text content')).toBe('Safe text content')
    })
  })

  describe('sanitizeFilename', () => {
    it('removes illegal characters', () => {
      expect(Sanitizer.sanitizeFilename('file<name>.txt')).toBe('filename.txt')
      expect(Sanitizer.sanitizeFilename('file|name?.txt')).toBe('filename.txt')
    })

    it('replaces spaces with underscores', () => {
      expect(Sanitizer.sanitizeFilename('my file name.txt')).toBe('my_file_name.txt')
    })

    it('removes leading and trailing dots', () => {
      expect(Sanitizer.sanitizeFilename('...filename...')).toBe('filename')
    })
  })

  describe('escapeHtml', () => {
    it('escapes HTML entities', () => {
      expect(Sanitizer.escapeHtml('<script>')).toBe('&lt;script&gt;')
      expect(Sanitizer.escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
      expect(Sanitizer.escapeHtml('"Hello"')).toBe('&quot;Hello&quot;')
    })
  })
})

describe('RateLimiter', () => {
  let rateLimiter

  beforeEach(() => {
    rateLimiter = new RateLimiter()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('allows requests within limit', () => {
    expect(rateLimiter.isRateLimited('user1', 5, 60000)).toBe(false)
    expect(rateLimiter.isRateLimited('user1', 5, 60000)).toBe(false)
    expect(rateLimiter.isRateLimited('user1', 5, 60000)).toBe(false)
  })

  it('blocks requests over limit', () => {
    // Make 5 requests (limit)
    for (let i = 0; i < 5; i++) {
      expect(rateLimiter.isRateLimited('user1', 5, 60000)).toBe(false)
    }
    
    // 6th request should be blocked
    expect(rateLimiter.isRateLimited('user1', 5, 60000)).toBe(true)
  })

  it('resets after time window', () => {
    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      rateLimiter.isRateLimited('user1', 5, 60000)
    }
    
    // Should be blocked
    expect(rateLimiter.isRateLimited('user1', 5, 60000)).toBe(true)
    
    // Advance time past window
    jest.advanceTimersByTime(61000)
    
    // Should be allowed again
    expect(rateLimiter.isRateLimited('user1', 5, 60000)).toBe(false)
  })

  it('handles different users separately', () => {
    // User1 makes 5 requests
    for (let i = 0; i < 5; i++) {
      rateLimiter.isRateLimited('user1', 5, 60000)
    }
    
    // User1 should be blocked
    expect(rateLimiter.isRateLimited('user1', 5, 60000)).toBe(true)
    
    // User2 should still be allowed
    expect(rateLimiter.isRateLimited('user2', 5, 60000)).toBe(false)
  })
})
