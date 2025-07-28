/**
 * SitemapErrorHandler 测试文件
 */

const { SitemapErrorHandler } = require('../lib/utils/SitemapErrorHandler')

describe('SitemapErrorHandler', () => {
  let errorHandler

  beforeEach(() => {
    errorHandler = new SitemapErrorHandler({
      baseUrl: 'https://test.example.com',
      enableLogging: false // 测试时禁用日志
    })
  })

  afterEach(() => {
    errorHandler.resetErrorStats()
  })

  describe('构造函数和配置', () => {
    test('应该使用默认配置', () => {
      const handler = new SitemapErrorHandler()
      expect(handler.config.baseUrl).toBe('https://www.shareking.vip')
      expect(handler.config.maxRetries).toBe(2)
      expect(handler.config.retryDelay).toBe(1000)
    })

    test('应该使用自定义配置', () => {
      const customConfig = {
        baseUrl: 'https://custom.com',
        maxRetries: 5,
        retryDelay: 2000
      }
      const handler = new SitemapErrorHandler(customConfig)
      expect(handler.config.baseUrl).toBe('https://custom.com')
      expect(handler.config.maxRetries).toBe(5)
      expect(handler.config.retryDelay).toBe(2000)
    })
  })

  describe('数据获取错误处理', () => {
    test('应该处理数据获取错误并返回缓存数据', () => {
      const siteId = 'test-site'
      const cachedData = { allPages: [{ id: '1', title: 'Test' }] }
      
      // 设置缓存数据
      errorHandler.setCachedData(siteId, cachedData)
      
      const error = new Error('API调用失败')
      const result = errorHandler.handleDataFetchError(error, siteId)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual(cachedData)
      expect(result.source).toBe('cache')
      expect(errorHandler.getErrorStats().dataFetchErrors).toBe(1)
    })

    test('应该在没有缓存时返回失败结果', () => {
      const siteId = 'test-site'
      const error = new Error('API调用失败')
      const result = errorHandler.handleDataFetchError(error, siteId)
      
      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.source).toBe('none')
    })
  })

  describe('数据处理错误处理', () => {
    test('应该处理数据处理错误并执行基础处理', () => {
      const data = {
        allPages: [
          { id: '1', status: 'Published', slug: 'test-1' },
          { id: '2', status: 'Draft', slug: 'test-2' },
          { id: '3', status: 'Published', slug: 'test-3' }
        ]
      }
      
      const error = new Error('数据处理失败')
      const result = errorHandler.handleProcessingError(error, data)
      
      expect(result.success).toBe(true)
      expect(result.data.allPages).toHaveLength(2) // 只保留Published状态
      expect(result.source).toBe('basic_processing')
      expect(errorHandler.getErrorStats().processingErrors).toBe(1)
    })

    test('应该处理无效数据', () => {
      const invalidData = null
      const error = new Error('数据处理失败')
      const result = errorHandler.handleProcessingError(error, invalidData)
      
      expect(result.success).toBe(true)
      expect(result.data.allPages).toEqual([])
    })
  })

  describe('XML生成错误处理', () => {
    test('应该处理XML生成错误并生成简化XML', () => {
      const urls = [
        { loc: 'https://test.com/page1', lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.8' },
        { loc: 'https://test.com/page2', lastmod: '2024-01-02', changefreq: 'weekly', priority: '0.8' }
      ]
      
      const error = new Error('XML生成失败')
      const result = errorHandler.handleXMLGenerationError(error, urls)
      
      expect(result.success).toBe(true)
      expect(result.xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result.xml).toContain('https://test.com/page1')
      expect(result.source).toBe('simplified')
      expect(errorHandler.getErrorStats().xmlGenerationErrors).toBe(1)
    })

    test('应该在简化XML失败时返回降级XML', () => {
      const invalidUrls = null
      const error = new Error('XML生成失败')
      const result = errorHandler.handleXMLGenerationError(error, invalidUrls)
      
      expect(result.success).toBe(true)
      expect(result.xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result.xml).toContain(errorHandler.config.baseUrl)
      // 当传入null时，generateSimplifiedXML会调用generateBasicSitemap，所以source是simplified
      expect(result.source).toBe('simplified')
    })
  })

  describe('降级sitemap生成', () => {
    test('应该生成基础sitemap (level2)', () => {
      const xml = errorHandler.generateFallbackSitemap('level2')
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
      expect(xml).toContain('https://test.example.com')
      expect(xml).toContain('/archive')
      expect(xml).toContain('/category')
      expect(errorHandler.getErrorStats().fallbackUsed).toBe(1)
    })

    test('应该生成最小sitemap (level3)', () => {
      const xml = errorHandler.generateFallbackSitemap('level3')
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(xml).toContain('https://test.example.com')
      expect(xml).not.toContain('/archive') // 最小sitemap只包含首页
    })
  })

  describe('缓存机制', () => {
    test('应该正确设置和获取缓存数据', () => {
      const key = 'test-key'
      const data = { test: 'data' }
      
      errorHandler.setCachedData(key, data)
      const retrieved = errorHandler.getCachedData(key)
      
      expect(retrieved).toEqual(data)
    })

    test('应该在缓存过期时返回null', () => {
      const key = 'test-key'
      const data = { test: 'data' }
      
      // 设置很短的缓存时间
      const shortCacheHandler = new SitemapErrorHandler({
        cacheMaxAge: 1, // 1毫秒
        enableLogging: false
      })
      
      shortCacheHandler.setCachedData(key, data)
      
      // 等待缓存过期
      return new Promise(resolve => {
        setTimeout(() => {
          const retrieved = shortCacheHandler.getCachedData(key)
          expect(retrieved).toBeNull()
          resolve()
        }, 10)
      })
    })
  })

  describe('重试机制', () => {
    test('应该在成功时不重试', async () => {
      let callCount = 0
      const successFn = async () => {
        callCount++
        return 'success'
      }
      
      const result = await errorHandler.retry(successFn)
      
      expect(result).toBe('success')
      expect(callCount).toBe(1)
    })

    test('应该在失败时重试指定次数', async () => {
      let callCount = 0
      const failFn = async () => {
        callCount++
        throw new Error('失败')
      }
      
      // 设置快速重试以加速测试
      errorHandler.config.retryDelay = 1
      
      try {
        await errorHandler.retry(failFn, 2)
        fail('应该抛出错误')
      } catch (error) {
        expect(error.message).toBe('失败')
        expect(callCount).toBe(3) // 初始调用 + 2次重试
      }
    })

    test('应该在重试成功时返回结果', async () => {
      let callCount = 0
      const eventualSuccessFn = async () => {
        callCount++
        if (callCount < 3) {
          throw new Error('暂时失败')
        }
        return 'success'
      }
      
      errorHandler.config.retryDelay = 1
      const result = await errorHandler.retry(eventualSuccessFn, 3)
      
      expect(result).toBe('success')
      expect(callCount).toBe(3)
    })
  })

  describe('XML转义', () => {
    test('应该正确转义XML特殊字符', () => {
      const input = 'Test & <script>alert("xss")</script> "quotes" \'single\''
      const expected = 'Test &amp; &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &quot;quotes&quot; &apos;single&apos;'
      
      const result = errorHandler.escapeXML(input)
      expect(result).toBe(expected)
    })

    test('应该处理非字符串输入', () => {
      expect(errorHandler.escapeXML(null)).toBe('')
      expect(errorHandler.escapeXML(undefined)).toBe('')
      expect(errorHandler.escapeXML(123)).toBe('')
    })
  })

  describe('基础数据处理', () => {
    test('应该过滤无效页面', () => {
      const data = {
        allPages: [
          { status: 'Published', slug: 'valid-page' },
          { status: 'Draft', slug: 'draft-page' },
          { status: 'Published', slug: '' }, // 空slug
          { status: 'Published', slug: 'another-valid' },
          { status: 'Published' }, // 没有slug
          null, // null页面
          { status: 'Published', slug: '   ' } // 只有空格的slug
        ]
      }
      
      const result = errorHandler.performBasicProcessing(data)
      
      expect(result.allPages).toHaveLength(2)
      expect(result.allPages[0].slug).toBe('valid-page')
      expect(result.allPages[1].slug).toBe('another-valid')
    })

    test('应该处理空数据', () => {
      const result1 = errorHandler.performBasicProcessing(null)
      expect(result1.allPages).toEqual([])
      
      const result2 = errorHandler.performBasicProcessing({})
      expect(result2.allPages).toEqual([])
      
      const result3 = errorHandler.performBasicProcessing({ allPages: null })
      expect(result3.allPages).toEqual([])
    })
  })

  describe('健康状态检查', () => {
    test('应该报告健康状态', () => {
      const status = errorHandler.getHealthStatus()
      
      expect(status.healthy).toBe(true)
      expect(status.errorStats).toBeDefined()
      expect(status.cacheSize).toBe(0)
      expect(status.timestamp).toBeDefined()
    })

    test('应该在错误过多时报告不健康', () => {
      // 模拟大量错误
      for (let i = 0; i < 15; i++) {
        errorHandler.handleDataFetchError(new Error('test'), `site-${i}`)
      }
      
      const status = errorHandler.getHealthStatus()
      expect(status.healthy).toBe(false)
    })
  })

  describe('错误统计', () => {
    test('应该正确统计各类错误', () => {
      errorHandler.handleDataFetchError(new Error('fetch error'), 'site1')
      errorHandler.handleProcessingError(new Error('processing error'), {})
      errorHandler.handleXMLGenerationError(new Error('xml error'), [])
      errorHandler.generateFallbackSitemap()
      
      const stats = errorHandler.getErrorStats()
      
      expect(stats.dataFetchErrors).toBe(1)
      expect(stats.processingErrors).toBe(1)
      expect(stats.xmlGenerationErrors).toBe(1)
      expect(stats.fallbackUsed).toBe(1)
    })

    test('应该能重置错误统计', () => {
      errorHandler.handleDataFetchError(new Error('test'), 'site1')
      expect(errorHandler.getErrorStats().dataFetchErrors).toBe(1)
      
      errorHandler.resetErrorStats()
      expect(errorHandler.getErrorStats().dataFetchErrors).toBe(0)
    })
  })

  describe('从页面数据生成URL', () => {
    test('应该从页面数据生成正确的URL列表', () => {
      const pages = [
        { status: 'Published', slug: 'page-1', publishDay: '2024-01-01' },
        { status: 'Published', slug: 'page-2', publishDay: '2024-01-02' },
        { status: 'Draft', slug: 'draft-page' }, // 应该被过滤
        { status: 'Published', slug: 'page-3' } // 没有publishDay
      ]
      
      const urls = errorHandler.generateUrlsFromPages(pages)
      
      expect(urls).toHaveLength(3)
      expect(urls[0].loc).toBe('https://test.example.com/page-1')
      expect(urls[0].lastmod).toBe('2024-01-01')
      expect(urls[1].loc).toBe('https://test.example.com/page-2')
      expect(urls[1].lastmod).toBe('2024-01-02')
      expect(urls[2].loc).toBe('https://test.example.com/page-3')
      expect(urls[2].lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/) // 当前日期格式
    })
  })
})