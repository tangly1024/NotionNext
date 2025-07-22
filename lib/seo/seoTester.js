import { 
  SEO_TEST_CONFIG, 
  TEST_SUITES_CONFIG, 
  getTestConfig,
  getErrorMessage,
  getSuccessMessage,
  calculateSEOScore
} from './seoConfig'

/**
 * SEO测试套件
 * 提供全面的SEO测试功能，包括meta标签、结构化数据、性能指标等测试
 */

class SEOTester {
  constructor(options = {}) {
    this.options = {
      timeout: 10000,
      userAgent: 'SEO-Tester/1.0',
      enablePerformanceTests: true,
      enableAccessibilityTests: true,
      enableStructuredDataTests: true,
      ...options
    }
    
    this.testResults = []
    this.testSuites = new Map()
    this.setupTestSuites()
  }

  /**
   * 设置测试套件
   */
  setupTestSuites() {
    // 从配置文件加载测试套件
    Object.entries(TEST_SUITES_CONFIG).forEach(([suiteId, config]) => {
      this.testSuites.set(suiteId, {
        name: config.name,
        description: config.description,
        tests: config.tests,
        weight: config.weight
      })
    })
  }

  /**
   * 运行指定的测试套件
   */
  async runSpecificTestSuites(url, suiteIds) {
    this.testResults = []
    const startTime = Date.now()

    try {
      // 获取页面内容
      const pageData = await this.fetchPageData(url)
      
      // 运行指定的测试套件
      for (const suiteId of suiteIds) {
        const suite = this.testSuites.get(suiteId)
        if (suite) {
          await this.runTestSuite(suiteId, suite, pageData)
        }
      }

      const endTime = Date.now()
      
      return {
        success: true,
        url,
        totalTests: this.testResults.length,
        passedTests: this.testResults.filter(r => r.status === 'PASS').length,
        failedTests: this.testResults.filter(r => r.status === 'FAIL').length,
        warningTests: this.testResults.filter(r => r.status === 'WARN').length,
        executionTime: endTime - startTime,
        results: this.testResults,
        summary: this.generateSummary()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: this.testResults
      }
    }
  }

  /**
   * 运行所有测试
   */
  async runAllTests(url) {
    this.testResults = []
    const startTime = Date.now()

    try {
      // 获取页面内容
      const pageData = await this.fetchPageData(url)
      
      // 运行所有测试套件
      for (const [suiteId, suite] of this.testSuites) {
        await this.runTestSuite(suiteId, suite, pageData)
      }

      const endTime = Date.now()
      
      return {
        success: true,
        url,
        totalTests: this.testResults.length,
        passedTests: this.testResults.filter(r => r.status === 'PASS').length,
        failedTests: this.testResults.filter(r => r.status === 'FAIL').length,
        warningTests: this.testResults.filter(r => r.status === 'WARN').length,
        executionTime: endTime - startTime,
        results: this.testResults,
        summary: this.generateSummary()
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: this.testResults
      }
    }
  }

  /**
   * 运行特定测试套件
   */
  async runTestSuite(suiteId, suite, pageData) {
    for (const testMethod of suite.tests) {
      try {
        if (typeof this[testMethod] === 'function') {
          await this[testMethod](pageData)
        }
      } catch (error) {
        this.addTestResult(testMethod, 'ERROR', `测试执行错误: ${error.message}`)
      }
    }
  }

  /**
   * 获取页面数据
   */
  async fetchPageData(url) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': this.options.userAgent
      },
      timeout: this.options.timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const dom = this.parseHTML(html)

    return {
      url,
      html,
      dom,
      response,
      headers: Object.fromEntries(response.headers.entries())
    }
  }

  /**
   * 解析HTML
   */
  parseHTML(html) {
    // 简单的HTML解析，实际项目中可能需要使用更强大的解析器
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
    const metaTags = [...html.matchAll(/<meta[^>]*>/gi)]
    const headings = [...html.matchAll(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi)]
    const images = [...html.matchAll(/<img[^>]*>/gi)]
    const links = [...html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi)]
    const scripts = [...html.matchAll(/<script[^>]*>(.*?)<\/script>/gi)]
    const jsonLd = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gi)]

    return {
      title: titleMatch ? titleMatch[1].trim() : null,
      metaTags: metaTags.map(match => match[0]),
      headings: headings.map(match => ({
        level: parseInt(match[1]),
        text: match[2].replace(/<[^>]*>/g, '').trim()
      })),
      images: images.map(match => match[0]),
      links: links.map(match => match[1]),
      scripts: scripts.map(match => match[1]),
      jsonLd: jsonLd.map(match => {
        try {
          return JSON.parse(match[1])
        } catch {
          return null
        }
      }).filter(Boolean)
    }
  }

  // ==================== Meta标签测试 ====================

  /**
   * 测试标题标签
   */
  testTitleTag(pageData) {
    const title = pageData.dom.title
    const config = getTestConfig('title')
    
    if (!title) {
      return this.addTestResult('title', 'FAIL', getErrorMessage('title', 'missing'))
    }

    if (title.length < config.minLength) {
      return this.addTestResult('title', 'WARN', getErrorMessage('title', 'tooShort', { minLength: config.minLength }))
    }

    if (title.length > config.maxLength) {
      return this.addTestResult('title', 'WARN', getErrorMessage('title', 'tooLong', { maxLength: config.maxLength }))
    }

    this.addTestResult('title', 'PASS', getSuccessMessage('title'))
  }

  /**
   * 测试Meta描述
   */
  testMetaDescription(pageData) {
    const descriptionTag = pageData.dom.metaTags.find(tag => 
      tag.includes('name="description"') || tag.includes("name='description'")
    )

    if (!descriptionTag) {
      return this.addTestResult('meta-description', 'FAIL', '缺少meta description标签')
    }

    const contentMatch = descriptionTag.match(/content=["']([^"']*)["']/i)
    const description = contentMatch ? contentMatch[1] : ''

    if (!description) {
      return this.addTestResult('meta-description', 'FAIL', 'meta description内容为空')
    }

    if (description.length < 120) {
      return this.addTestResult('meta-description', 'WARN', `描述过短 (${description.length}字符)`)
    }

    if (description.length > 160) {
      return this.addTestResult('meta-description', 'WARN', `描述过长 (${description.length}字符)`)
    }

    this.addTestResult('meta-description', 'PASS', `描述长度合适 (${description.length}字符)`)
  }

  /**
   * 测试Meta关键词
   */
  testMetaKeywords(pageData) {
    const keywordsTag = pageData.dom.metaTags.find(tag => 
      tag.includes('name="keywords"') || tag.includes("name='keywords'")
    )

    if (!keywordsTag) {
      return this.addTestResult('meta-keywords', 'INFO', '未设置meta keywords（现代SEO中不是必需的）')
    }

    const contentMatch = keywordsTag.match(/content=["']([^"']*)["']/i)
    const keywords = contentMatch ? contentMatch[1].split(',').map(k => k.trim()) : []

    if (keywords.length > 10) {
      return this.addTestResult('meta-keywords', 'WARN', `关键词过多 (${keywords.length}个)`)
    }

    this.addTestResult('meta-keywords', 'PASS', `关键词数量合适 (${keywords.length}个)`)
  }

  /**
   * 测试Canonical URL
   */
  testCanonicalUrl(pageData) {
    const canonicalTag = pageData.dom.metaTags.find(tag => 
      tag.includes('rel="canonical"') || tag.includes("rel='canonical'")
    )

    if (!canonicalTag) {
      return this.addTestResult('canonical', 'WARN', '未设置canonical URL')
    }

    const hrefMatch = canonicalTag.match(/href=["']([^"']*)["']/i)
    const canonicalUrl = hrefMatch ? hrefMatch[1] : ''

    if (!canonicalUrl) {
      return this.addTestResult('canonical', 'FAIL', 'canonical URL为空')
    }

    if (!canonicalUrl.startsWith('http')) {
      return this.addTestResult('canonical', 'WARN', 'canonical URL应该是绝对URL')
    }

    this.addTestResult('canonical', 'PASS', 'canonical URL设置正确')
  }

  /**
   * 测试Open Graph标签
   */
  testOpenGraphTags(pageData) {
    const ogTags = pageData.dom.metaTags.filter(tag => 
      tag.includes('property="og:') || tag.includes("property='og:")
    )

    const requiredOgTags = ['og:title', 'og:description', 'og:type', 'og:url']
    const foundTags = ogTags.map(tag => {
      const match = tag.match(/property=["']og:([^"']*)["']/i)
      return match ? `og:${match[1]}` : null
    }).filter(Boolean)

    const missingTags = requiredOgTags.filter(tag => !foundTags.includes(tag))

    if (missingTags.length > 0) {
      return this.addTestResult('open-graph', 'WARN', `缺少Open Graph标签: ${missingTags.join(', ')}`)
    }

    this.addTestResult('open-graph', 'PASS', 'Open Graph标签完整')
  }

  /**
   * 测试Twitter Card标签
   */
  testTwitterCardTags(pageData) {
    const twitterTags = pageData.dom.metaTags.filter(tag => 
      tag.includes('name="twitter:') || tag.includes("name='twitter:")
    )

    if (twitterTags.length === 0) {
      return this.addTestResult('twitter-card', 'INFO', '未设置Twitter Card标签')
    }

    const cardTag = twitterTags.find(tag => tag.includes('twitter:card'))
    if (!cardTag) {
      return this.addTestResult('twitter-card', 'WARN', '缺少twitter:card标签')
    }

    this.addTestResult('twitter-card', 'PASS', 'Twitter Card标签设置正确')
  }

  // ==================== 结构化数据测试 ====================

  /**
   * 测试JSON-LD存在性
   */
  testJsonLdPresence(pageData) {
    const jsonLdCount = pageData.dom.jsonLd.length

    if (jsonLdCount === 0) {
      return this.addTestResult('json-ld', 'WARN', '未找到JSON-LD结构化数据')
    }

    this.addTestResult('json-ld', 'PASS', `找到${jsonLdCount}个JSON-LD结构化数据`)
  }

  /**
   * 测试文章Schema
   */
  testArticleSchema(pageData) {
    const articleSchema = pageData.dom.jsonLd.find(ld => 
      ld['@type'] === 'Article' || ld['@type'] === 'BlogPosting'
    )

    if (!articleSchema) {
      return this.addTestResult('article-schema', 'INFO', '未找到Article结构化数据（如果是文章页面则建议添加）')
    }

    const requiredFields = ['headline', 'author', 'datePublished']
    const missingFields = requiredFields.filter(field => !articleSchema[field])

    if (missingFields.length > 0) {
      return this.addTestResult('article-schema', 'WARN', `Article Schema缺少字段: ${missingFields.join(', ')}`)
    }

    this.addTestResult('article-schema', 'PASS', 'Article Schema完整')
  }

  /**
   * 测试网站Schema
   */
  testWebSiteSchema(pageData) {
    const websiteSchema = pageData.dom.jsonLd.find(ld => ld['@type'] === 'WebSite')

    if (!websiteSchema) {
      return this.addTestResult('website-schema', 'INFO', '未找到WebSite结构化数据')
    }

    if (!websiteSchema.name || !websiteSchema.url) {
      return this.addTestResult('website-schema', 'WARN', 'WebSite Schema缺少必要字段')
    }

    this.addTestResult('website-schema', 'PASS', 'WebSite Schema设置正确')
  }

  // ==================== 性能测试 ====================

  /**
   * 测试页面加载时间
   */
  async testPageLoadTime(pageData) {
    // 这里需要实际的性能测试实现
    // 由于是服务器端测试，我们模拟一个简单的检查
    const responseTime = pageData.response.headers.get('x-response-time')
    
    if (responseTime) {
      const time = parseFloat(responseTime)
      if (time > 3000) {
        return this.addTestResult('page-load-time', 'FAIL', `页面响应时间过长: ${time}ms`)
      } else if (time > 1000) {
        return this.addTestResult('page-load-time', 'WARN', `页面响应时间较长: ${time}ms`)
      } else {
        return this.addTestResult('page-load-time', 'PASS', `页面响应时间良好: ${time}ms`)
      }
    }

    this.addTestResult('page-load-time', 'INFO', '无法获取页面加载时间数据')
  }

  /**
   * 测试图片优化
   */
  testImageOptimization(pageData) {
    const images = pageData.dom.images
    let unoptimizedImages = 0
    let missingAltImages = 0

    images.forEach(img => {
      // 检查是否有alt属性
      if (!img.includes('alt=')) {
        missingAltImages++
      }

      // 检查图片格式（简单检查）
      if (img.includes('.jpg') || img.includes('.png')) {
        if (!img.includes('webp') && !img.includes('avif')) {
          unoptimizedImages++
        }
      }
    })

    if (missingAltImages > 0) {
      this.addTestResult('image-alt', 'FAIL', `${missingAltImages}张图片缺少alt属性`)
    } else {
      this.addTestResult('image-alt', 'PASS', '所有图片都有alt属性')
    }

    if (unoptimizedImages > images.length * 0.5) {
      this.addTestResult('image-format', 'WARN', `建议使用现代图片格式 (WebP/AVIF)`)
    } else {
      this.addTestResult('image-format', 'PASS', '图片格式优化良好')
    }
  }

  // ==================== 技术SEO测试 ====================

  /**
   * 测试HTTPS重定向
   */
  testHttpsRedirect(pageData) {
    const url = pageData.url
    
    if (!url.startsWith('https://')) {
      return this.addTestResult('https', 'FAIL', '网站未使用HTTPS')
    }

    this.addTestResult('https', 'PASS', '网站使用HTTPS')
  }

  /**
   * 测试robots.txt
   */
  async testRobotsTxt(pageData) {
    try {
      const robotsUrl = new URL('/robots.txt', pageData.url).href
      const response = await fetch(robotsUrl)
      
      if (!response.ok) {
        return this.addTestResult('robots-txt', 'WARN', 'robots.txt文件不存在或无法访问')
      }

      const robotsContent = await response.text()
      
      if (robotsContent.includes('Disallow: /')) {
        return this.addTestResult('robots-txt', 'WARN', 'robots.txt可能阻止了所有爬虫')
      }

      this.addTestResult('robots-txt', 'PASS', 'robots.txt文件存在且配置合理')
    } catch (error) {
      this.addTestResult('robots-txt', 'ERROR', `robots.txt测试失败: ${error.message}`)
    }
  }

  /**
   * 测试sitemap
   */
  async testSitemap(pageData) {
    try {
      const sitemapUrl = new URL('/sitemap.xml', pageData.url).href
      const response = await fetch(sitemapUrl)
      
      if (!response.ok) {
        return this.addTestResult('sitemap', 'WARN', 'sitemap.xml文件不存在或无法访问')
      }

      const sitemapContent = await response.text()
      
      if (!sitemapContent.includes('<urlset') && !sitemapContent.includes('<sitemapindex')) {
        return this.addTestResult('sitemap', 'FAIL', 'sitemap.xml格式不正确')
      }

      this.addTestResult('sitemap', 'PASS', 'sitemap.xml文件存在且格式正确')
    } catch (error) {
      this.addTestResult('sitemap', 'ERROR', `sitemap测试失败: ${error.message}`)
    }
  }

  // ==================== 内容质量测试 ====================

  /**
   * 测试标题结构
   */
  testHeadingStructure(pageData) {
    const headings = pageData.dom.headings
    
    if (headings.length === 0) {
      return this.addTestResult('heading-structure', 'FAIL', '页面没有标题标签')
    }

    const h1Count = headings.filter(h => h.level === 1).length
    
    if (h1Count === 0) {
      return this.addTestResult('heading-structure', 'FAIL', '页面缺少H1标签')
    }

    if (h1Count > 1) {
      return this.addTestResult('heading-structure', 'WARN', `页面有多个H1标签 (${h1Count}个)`)
    }

    // 检查标题层级是否合理
    let previousLevel = 0
    let structureIssues = 0

    headings.forEach(heading => {
      if (heading.level > previousLevel + 1) {
        structureIssues++
      }
      previousLevel = heading.level
    })

    if (structureIssues > 0) {
      return this.addTestResult('heading-structure', 'WARN', '标题层级结构不够合理')
    }

    this.addTestResult('heading-structure', 'PASS', '标题结构良好')
  }

  /**
   * 测试内容长度
   */
  testContentLength(pageData) {
    // 简单的内容长度估算
    const textContent = pageData.html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    const wordCount = textContent.split(' ').length

    if (wordCount < 300) {
      return this.addTestResult('content-length', 'WARN', `内容过短 (约${wordCount}词)`)
    }

    if (wordCount > 2000) {
      return this.addTestResult('content-length', 'INFO', `内容较长 (约${wordCount}词)`)
    }

    this.addTestResult('content-length', 'PASS', `内容长度合适 (约${wordCount}词)`)
  }

  /**
   * 添加测试结果
   */
  addTestResult(testName, status, message, details = null) {
    this.testResults.push({
      test: testName,
      status,
      message,
      details,
      timestamp: Date.now()
    })
  }

  /**
   * 生成测试摘要
   */
  generateSummary() {
    const summary = {
      total: this.testResults.length,
      passed: 0,
      failed: 0,
      warnings: 0,
      info: 0,
      errors: 0,
      score: 0
    }

    this.testResults.forEach(result => {
      switch (result.status) {
        case 'PASS':
          summary.passed++
          break
        case 'FAIL':
          summary.failed++
          break
        case 'WARN':
          summary.warnings++
          break
        case 'INFO':
          summary.info++
          break
        case 'ERROR':
          summary.errors++
          break
      }
    })

    // 计算SEO得分 (0-100)
    const totalScorableTests = summary.passed + summary.failed + summary.warnings
    if (totalScorableTests > 0) {
      summary.score = Math.round(
        ((summary.passed + summary.warnings * 0.5) / totalScorableTests) * 100
      )
    }

    return summary
  }
}

export default SEOTester
export { SEOTester }