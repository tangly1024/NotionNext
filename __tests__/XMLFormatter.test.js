/**
 * XMLFormatter 测试文件
 */

const { XMLFormatter } = require('../lib/utils/XMLFormatter')

describe('XMLFormatter', () => {
  let xmlFormatter

  beforeEach(() => {
    xmlFormatter = new XMLFormatter({
      baseUrl: 'https://test.example.com',
      maxUrls: 1000,
      enableValidation: true,
      prettyPrint: false
    })
  })

  describe('构造函数和配置', () => {
    test('应该使用默认配置', () => {
      const formatter = new XMLFormatter()
      expect(formatter.config.baseUrl).toBe('https://www.shareking.vip')
      expect(formatter.config.maxUrls).toBe(50000)
      expect(formatter.config.enableValidation).toBe(true)
    })

    test('应该使用自定义配置', () => {
      const customConfig = {
        baseUrl: 'https://custom.com',
        maxUrls: 1000,
        prettyPrint: true
      }
      const formatter = new XMLFormatter(customConfig)
      expect(formatter.config.baseUrl).toBe('https://custom.com')
      expect(formatter.config.maxUrls).toBe(1000)
      expect(formatter.config.prettyPrint).toBe(true)
    })
  })

  describe('URL验证', () => {
    test('应该验证有效的URL列表', () => {
      const urls = [
        { loc: 'https://test.example.com/page1', lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.8' },
        { loc: 'https://test.example.com/page2', lastmod: '2024-01-02', changefreq: 'daily', priority: '0.9' }
      ]
      
      const validatedUrls = xmlFormatter.validateUrls(urls)
      expect(validatedUrls).toHaveLength(2)
      expect(validatedUrls[0].loc).toBe('https://test.example.com/page1')
    })

    test('应该过滤无效的URL', () => {
      const urls = [
        { loc: 'https://test.example.com/valid', lastmod: '2024-01-01' },
        { loc: 'invalid-url', lastmod: '2024-01-01' }, // 无效URL
        { loc: 'https://other-domain.com/page', lastmod: '2024-01-01' }, // 不同域名
        { lastmod: '2024-01-01' }, // 缺少loc字段
        null // null对象
      ]
      
      const validatedUrls = xmlFormatter.validateUrls(urls)
      expect(validatedUrls).toHaveLength(1)
      expect(validatedUrls[0].loc).toBe('https://test.example.com/valid')
    })

    test('应该处理非数组输入', () => {
      expect(() => {
        xmlFormatter.validateUrls('not-an-array')
      }).toThrow('URLs must be an array')
    })
  })

  describe('URL数量限制', () => {
    test('应该在URL数量超限时进行截断', () => {
      const urls = []
      for (let i = 0; i < 1500; i++) {
        urls.push({
          loc: `https://test.example.com/page${i}`,
          priority: (i % 10 / 10).toString() // 不同优先级
        })
      }
      
      const limitedUrls = xmlFormatter.applyUrlLimits(urls)
      expect(limitedUrls).toHaveLength(1000) // 配置的maxUrls
    })

    test('应该按优先级排序保留高优先级URL', () => {
      const urls = [
        { loc: 'https://test.example.com/low', priority: '0.1' },
        { loc: 'https://test.example.com/high', priority: '0.9' },
        { loc: 'https://test.example.com/medium', priority: '0.5' }
      ]
      
      xmlFormatter.config.maxUrls = 2
      const limitedUrls = xmlFormatter.applyUrlLimits(urls)
      
      expect(limitedUrls).toHaveLength(2)
      expect(limitedUrls[0].loc).toBe('https://test.example.com/high')
      expect(limitedUrls[1].loc).toBe('https://test.example.com/medium')
    })
  })

  describe('XML生成', () => {
    test('应该生成有效的sitemap XML', () => {
      const urls = [
        { loc: 'https://test.example.com/page1', lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.8' },
        { loc: 'https://test.example.com/page2', lastmod: '2024-01-02', changefreq: 'daily', priority: '0.9' }
      ]
      
      const result = xmlFormatter.generateSitemapXML(urls)
      
      expect(result.success).toBe(true)
      expect(result.xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(result.xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
      expect(result.xml).toContain('https://test.example.com/page1')
      expect(result.xml).toContain('https://test.example.com/page2')
      expect(result.stats.urlsProcessed).toBe(2)
    })

    test('应该生成格式化的XML（pretty print）', () => {
      xmlFormatter.config.prettyPrint = true
      
      const urls = [
        { loc: 'https://test.example.com/page1', lastmod: '2024-01-01' }
      ]
      
      const result = xmlFormatter.generateSitemapXML(urls)
      
      expect(result.xml).toContain('\n')
      expect(result.xml).toContain('  <url>')
    })

    test('应该处理图片扩展', () => {
      const urls = [
        {
          loc: 'https://test.example.com/page1',
          images: [
            { loc: 'https://test.example.com/image1.jpg', caption: 'Test Image' }
          ]
        }
      ]
      
      const result = xmlFormatter.generateSitemapXML(urls, { includeImages: true })
      
      expect(result.success).toBe(true)
      expect(result.xml).toBeDefined()
      expect(result.xml).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')
      expect(result.xml).toContain('<image:image>')
      expect(result.xml).toContain('https://test.example.com/image1.jpg')
    })
  })

  describe('XML转义', () => {
    test('应该正确转义XML特殊字符', () => {
      const input = 'Test & <script>alert("xss")</script> "quotes" \'single\''
      const expected = 'Test &amp; &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &quot;quotes&quot; &apos;single&apos;'
      
      const result = xmlFormatter.escapeXML(input)
      expect(result).toBe(expected)
    })

    test('应该处理非字符串输入', () => {
      expect(xmlFormatter.escapeXML(null)).toBe('')
      expect(xmlFormatter.escapeXML(undefined)).toBe('')
      expect(xmlFormatter.escapeXML(123)).toBe('')
    })
  })

  describe('日期格式化', () => {
    test('应该格式化有效的日期字符串', () => {
      expect(xmlFormatter.formatDate('2024-01-01')).toBe('2024-01-01')
      expect(xmlFormatter.formatDate('2024-12-31T10:30:00Z')).toBe('2024-12-31')
    })

    test('应该处理Date对象', () => {
      const date = new Date('2024-01-01')
      expect(xmlFormatter.formatDate(date)).toBe('2024-01-01')
    })

    test('应该处理无效日期', () => {
      const result = xmlFormatter.formatDate('invalid-date')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/) // 应该返回当前日期格式
    })
  })

  describe('changefreq验证', () => {
    test('应该验证有效的changefreq值', () => {
      expect(xmlFormatter.validateChangefreq('daily')).toBe('daily')
      expect(xmlFormatter.validateChangefreq('weekly')).toBe('weekly')
      expect(xmlFormatter.validateChangefreq('monthly')).toBe('monthly')
    })

    test('应该处理无效的changefreq值', () => {
      expect(xmlFormatter.validateChangefreq('invalid')).toBe('weekly')
      expect(xmlFormatter.validateChangefreq('')).toBe('weekly')
    })
  })

  describe('priority验证', () => {
    test('应该验证有效的priority值', () => {
      expect(xmlFormatter.validatePriority('0.8')).toBe('0.8')
      expect(xmlFormatter.validatePriority(0.5)).toBe('0.5')
    })

    test('应该限制priority值在0.0-1.0范围内', () => {
      expect(xmlFormatter.validatePriority('1.5')).toBe('1.0')
      expect(xmlFormatter.validatePriority('-0.5')).toBe('0.0')
    })

    test('应该处理无效的priority值', () => {
      expect(xmlFormatter.validatePriority('invalid')).toBe('0.5')
      expect(xmlFormatter.validatePriority('')).toBe('0.5')
    })
  })

  describe('XML验证', () => {
    test('应该验证有效的XML', () => {
      const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://test.example.com</loc>
  </url>
</urlset>`
      
      expect(() => {
        xmlFormatter.validateXML(validXml)
      }).not.toThrow()
    })

    test('应该检测无效的XML', () => {
      const invalidXml = '<urlset><url><loc>test</loc></url>' // 缺少XML声明和结束标签
      
      expect(() => {
        xmlFormatter.validateXML(invalidXml)
      }).toThrow()
    })
  })

  describe('降级XML生成', () => {
    test('应该生成降级XML', () => {
      const fallbackXml = xmlFormatter.generateFallbackXML()
      
      expect(fallbackXml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(fallbackXml).toContain('https://test.example.com')
      expect(fallbackXml).toContain('<priority>1.0</priority>')
    })
  })

  describe('sitemap索引生成', () => {
    test('应该生成sitemap索引文件', () => {
      const sitemapUrls = [
        { loc: 'https://test.example.com/sitemap1.xml', lastmod: '2024-01-01' },
        { loc: 'https://test.example.com/sitemap2.xml', lastmod: '2024-01-02' }
      ]
      
      const indexXml = xmlFormatter.generateSitemapIndex(sitemapUrls)
      
      expect(indexXml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
      expect(indexXml).toContain('https://test.example.com/sitemap1.xml')
      expect(indexXml).toContain('https://test.example.com/sitemap2.xml')
    })
  })

  describe('响应头设置', () => {
    test('应该设置正确的响应头', () => {
      const mockRes = {
        headers: {},
        setHeader: function(name, value) {
          this.headers[name] = value
        }
      }
      
      xmlFormatter.setOptimalResponseHeaders(mockRes)
      
      expect(mockRes.headers['Content-Type']).toBe('application/xml; charset=utf-8')
      expect(mockRes.headers['Cache-Control']).toContain('public')
      expect(mockRes.headers['X-Robots-Tag']).toBe('noindex')
    })

    test('应该为降级sitemap设置不同的缓存时间', () => {
      const mockRes = {
        headers: {},
        setHeader: function(name, value) {
          this.headers[name] = value
        }
      }
      
      xmlFormatter.setOptimalResponseHeaders(mockRes, { isFallback: true })
      
      expect(mockRes.headers['Cache-Control']).toContain('max-age=300')
    })
  })

  describe('统计信息', () => {
    test('应该记录正确的统计信息', () => {
      const urls = [
        { loc: 'https://test.example.com/page1', lastmod: '2024-01-01' },
        { loc: 'https://test.example.com/page2', lastmod: '2024-01-02' }
      ]
      
      const result = xmlFormatter.generateSitemapXML(urls)
      
      expect(result.stats.urlsProcessed).toBe(2)
      expect(result.stats.xmlSize).toBeGreaterThan(0)
      expect(result.stats.generationTime).toBeGreaterThanOrEqual(0)
    })

    test('应该重置统计信息', () => {
      xmlFormatter.stats.urlsProcessed = 10
      xmlFormatter.resetStats()
      
      expect(xmlFormatter.stats.urlsProcessed).toBe(0)
    })
  })

  describe('警告生成', () => {
    test('应该生成适当的警告', () => {
      const originalUrls = new Array(10).fill(null).map((_, i) => ({
        loc: `https://test.example.com/page${i}`
      }))
      
      const processedUrls = originalUrls.slice(0, 5) // 模拟过滤
      
      const warnings = xmlFormatter.generateWarnings(originalUrls, processedUrls)
      
      expect(warnings).toContain('5 URLs were filtered out')
    })
  })

  describe('错误处理', () => {
    test('应该处理XML生成错误', () => {
      // 模拟一个会导致错误的情况
      xmlFormatter.config.maxSizeBytes = 1 // 极小的大小限制
      
      const urls = [
        { loc: 'https://test.example.com/page1', lastmod: '2024-01-01' }
      ]
      
      const result = xmlFormatter.generateSitemapXML(urls)
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.fallbackXML).toBeDefined()
    })
  })
})