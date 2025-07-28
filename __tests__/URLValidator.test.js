// URLValidator单元测试
import { URLValidator } from '../lib/utils/URLValidator'

describe('URLValidator', () => {
  let validator

  beforeEach(() => {
    validator = new URLValidator({
      baseUrl: 'https://www.shareking.vip'
    })
  })

  describe('isValidSlug', () => {
    test('应该接受有效的slug', () => {
      const validSlugs = [
        'valid-post-slug',
        'post123',
        'category/subcategory',
        'post-with-numbers-123',
        'chinese-中文-slug'
      ]

      validSlugs.forEach(slug => {
        expect(validator.isValidSlug(slug)).toBe(true)
      })
    })

    test('应该拒绝无效的slug', () => {
      const invalidSlugs = [
        null,
        undefined,
        '',
        '/',
        'https://example.com/post',
        'http://example.com/post',
        'post#fragment',
        'post?query=value',
        'post<script>',
        'post>alert',
        'post"quote',
        'post|pipe',
        'post^caret',
        'post`backtick',
        'post{brace}',
        'post\\backslash',
        'a'.repeat(501) // 超长slug
      ]

      invalidSlugs.forEach(slug => {
        expect(validator.isValidSlug(slug)).toBe(false)
      })
    })
  })

  describe('isValidURL', () => {
    test('应该接受有效的URL', () => {
      const validUrls = [
        'https://www.shareking.vip',
        'https://www.shareking.vip/',
        'https://www.shareking.vip/post',
        'https://www.shareking.vip/category/tech',
        'https://www.shareking.vip/en/post'
      ]

      validUrls.forEach(url => {
        expect(validator.isValidURL(url)).toBe(true)
      })
    })

    test('应该拒绝无效的URL', () => {
      const invalidUrls = [
        null,
        undefined,
        '',
        'not-a-url',
        'ftp://www.shareking.vip',
        'https://other-domain.com/post',
        'https://www.shareking.vip/post#fragment',
        'https://github.com/user/repo',
        'https://tangly1024.com/post',
        'https://docs.tangly1024.com/guide',
        'https://blog.tangly1024.com/article',
        'https://preview.tangly1024.com/test',
        'https://netdiskso.xyz/file',
        'https://www.shareking.vip/' + 'a'.repeat(2048) // 超长URL
      ]

      invalidUrls.forEach(url => {
        expect(validator.isValidURL(url)).toBe(false)
      })
    })
  })

  describe('cleanURL', () => {
    test('应该清理和标准化URL', () => {
      const testCases = [
        {
          input: '  https://www.shareking.vip/post  ',
          expected: 'https://www.shareking.vip/post'
        },
        {
          input: 'https://www.shareking.vip/post#fragment',
          expected: 'https://www.shareking.vip/post'
        },
        {
          input: 'https://www.shareking.vip/post?query=value',
          expected: 'https://www.shareking.vip/post'
        },
        {
          input: 'https://www.shareking.vip//double//slash',
          expected: 'https://www.shareking.vip/double/slash'
        },
        {
          input: '/relative/path',
          expected: 'https://www.shareking.vip/relative/path'
        },
        {
          input: 'relative/path',
          expected: 'https://www.shareking.vip/relative/path'
        }
      ]

      testCases.forEach(({ input, expected }) => {
        expect(validator.cleanURL(input)).toBe(expected)
      })
    })

    test('应该对无效URL返回null', () => {
      const invalidInputs = [
        null,
        undefined,
        '',
        'https://other-domain.com/post',
        'https://github.com/user/repo'
      ]

      invalidInputs.forEach(input => {
        expect(validator.cleanURL(input)).toBeNull()
      })
    })
  })

  describe('generateURL', () => {
    test('应该生成有效的URL', () => {
      const testCases = [
        {
          slug: 'test-post',
          locale: '',
          expected: 'https://www.shareking.vip/test-post'
        },
        {
          slug: 'test-post',
          locale: 'en',
          expected: 'https://www.shareking.vip/en/test-post'
        },
        {
          slug: '/test-post',
          locale: '/en',
          expected: 'https://www.shareking.vip/en/test-post'
        },
        {
          slug: 'test-post',
          locale: 'zh-CN',
          expected: 'https://www.shareking.vip/test-post'
        }
      ]

      testCases.forEach(({ slug, locale, expected }) => {
        expect(validator.generateURL(slug, locale)).toBe(expected)
      })
    })

    test('应该对无效slug返回null', () => {
      const invalidSlugs = ['', null, 'https://example.com', 'post#fragment']

      invalidSlugs.forEach(slug => {
        expect(validator.generateURL(slug)).toBeNull()
      })
    })
  })

  describe('validateURLList', () => {
    test('应该正确验证URL列表', () => {
      const urls = [
        { loc: 'https://www.shareking.vip/valid-post' },
        { loc: 'https://github.com/invalid' },
        { loc: null },
        { loc: 'https://www.shareking.vip/another-valid' },
        { loc: 'https://www.shareking.vip/post#fragment' }
      ]

      const result = validator.validateURLList(urls)

      expect(result.valid).toHaveLength(2)
      expect(result.invalid).toHaveLength(3)
      expect(result.valid[0].loc).toBe('https://www.shareking.vip/valid-post')
      expect(result.valid[1].loc).toBe('https://www.shareking.vip/another-valid')
    })
  })

  describe('deduplicateURLs', () => {
    test('应该去除重复的URL', () => {
      const urls = [
        {
          loc: 'https://www.shareking.vip/post1',
          lastmod: '2024-01-01'
        },
        {
          loc: 'https://www.shareking.vip/post2',
          lastmod: '2024-01-02'
        },
        {
          loc: 'https://www.shareking.vip/post1',
          lastmod: '2024-01-03' // 更新的版本
        }
      ]

      const result = validator.deduplicateURLs(urls)

      expect(result).toHaveLength(2)
      expect(result.find(url => url.loc === 'https://www.shareking.vip/post1').lastmod).toBe('2024-01-03')
    })
  })

  describe('escapeXML', () => {
    test('应该正确转义XML特殊字符', () => {
      const testCases = [
        { input: 'normal text', expected: 'normal text' },
        { input: 'text & more', expected: 'text &amp; more' },
        { input: 'text < more', expected: 'text &lt; more' },
        { input: 'text > more', expected: 'text &gt; more' },
        { input: 'text "quote"', expected: 'text &quot;quote&quot;' },
        { input: "text 'quote'", expected: 'text &apos;quote&apos;' },
        { input: '', expected: '' },
        { input: null, expected: '' },
        { input: undefined, expected: '' }
      ]

      testCases.forEach(({ input, expected }) => {
        expect(validator.escapeXML(input)).toBe(expected)
      })
    })
  })

  describe('getValidationStats', () => {
    test('应该返回正确的验证统计信息', () => {
      const urls = [
        { loc: 'https://www.shareking.vip/valid1' },
        { loc: 'https://www.shareking.vip/valid2' },
        { loc: 'https://github.com/invalid' },
        { loc: null }
      ]

      const stats = validator.getValidationStats(urls)

      expect(stats.total).toBe(4)
      expect(stats.valid).toBe(2)
      expect(stats.invalid).toBe(2)
      expect(stats.validPercentage).toBe('50.00')
      expect(stats.invalidReasons).toHaveProperty('Missing loc property')
      expect(stats.invalidReasons).toHaveProperty('Invalid URL format')
    })
  })

  describe('配置测试', () => {
    test('应该使用自定义配置', () => {
      const customValidator = new URLValidator({
        baseUrl: 'https://custom-domain.com',
        blacklistedDomains: ['example.com'],
        maxUrlLength: 100
      })

      expect(customValidator.isValidURL('https://custom-domain.com/post')).toBe(true)
      expect(customValidator.isValidURL('https://www.shareking.vip/post')).toBe(false)
      expect(customValidator.isValidURL('https://example.com/post')).toBe(false)
      
      const longUrl = 'https://custom-domain.com/' + 'a'.repeat(100)
      expect(customValidator.isValidURL(longUrl)).toBe(false)
    })
  })
})