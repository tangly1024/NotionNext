/**
 * 增强版Sitemap生成器
 * 
 * 整合现有功能，支持配置驱动的sitemap生成。
 * 提供多种sitemap格式和高级功能。
 * 
 * 主要功能：
 * - 多类型sitemap生成（posts、pages、images等）
 * - Sitemap索引文件生成
 * - 配置驱动的生成策略
 * - 大型网站的sitemap分割
 * - 搜索引擎优化支持
 * 
 * @class SitemapEnhancedGenerator
 * @version 2.0.0
 * @since 2024-01-28
 * 
 * @example
 * const generator = new SitemapEnhancedGenerator({
 *   baseUrl: 'https://example.com'
 * });
 * 
 * const result = await generator.generateEnhancedSitemaps({
 *   allPages: pages,
 *   siteInfo: siteInfo
 * });
 */

const BLOG = require('../../blog.config')

class SitemapEnhancedGenerator {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || BLOG.LINK || 'https://www.shareking.vip',
      
      // 从blog.config.js读取配置
      enableEnhanced: BLOG.SEO_SITEMAP_ENHANCED || true,
      enableImages: BLOG.SEO_SITEMAP_IMAGES || true,
      enableNews: BLOG.SEO_SITEMAP_NEWS || false,
      enableVideos: BLOG.SEO_SITEMAP_VIDEOS || false,
      
      // 更新频率配置
      changefreq: {
        home: BLOG.SEO_SITEMAP_CHANGEFREQ_HOME || 'daily',
        posts: BLOG.SEO_SITEMAP_CHANGEFREQ_POSTS || 'weekly',
        pages: 'monthly',
        categories: 'weekly',
        tags: 'weekly'
      },
      
      // 优先级配置
      priority: {
        home: parseFloat(BLOG.SEO_SITEMAP_PRIORITY_HOME) || 1.0,
        posts: parseFloat(BLOG.SEO_SITEMAP_PRIORITY_POSTS) || 0.8,
        pages: 0.7,
        categories: 0.6,
        tags: 0.5,
        rss: 0.7
      },
      
      // 分类URL映射
      categoryMapping: BLOG.CATEGORY_URL_MAPPING || {},
      enableCategoryMapping: BLOG.CUSTOM_CATEGORY_MAPPING || true,
      
      // 限制配置
      maxUrls: 50000,
      maxSizeBytes: 50 * 1024 * 1024, // 50MB
      
      // 其他配置
      enableSitemapIndex: true,
      enableAutoSubmission: BLOG.SEO_AUTO_SUBMISSION || false,
      
      ...config
    }
    
    this.stats = {
      totalUrls: 0,
      sitemapFiles: [],
      generationTime: 0,
      errors: []
    }
  }

  /**
   * 生成完整的sitemap集合
   * @param {Object} data - 站点数据
   * @returns {Object} 生成结果
   */
  async generateEnhancedSitemaps(data) {
    const startTime = Date.now()
    
    try {
      const { allPages, siteInfo } = data
      const sitemaps = []
      
      // 生成主sitemap（向后兼容）
      const mainSitemap = this.generateMainSitemap(allPages)
      sitemaps.push({
        filename: 'sitemap.xml',
        content: mainSitemap.xml,
        urls: mainSitemap.urls
      })
      
      if (this.config.enableEnhanced) {
        // 生成页面sitemap
        const pagesSitemap = this.generatePagesSitemap(allPages)
        sitemaps.push({
          filename: 'sitemap-pages.xml',
          content: pagesSitemap.xml,
          urls: pagesSitemap.urls
        })
        
        // 生成文章sitemap
        const postsSitemap = this.generatePostsSitemap(allPages)
        sitemaps.push({
          filename: 'sitemap-posts.xml',
          content: postsSitemap.xml,
          urls: postsSitemap.urls
        })
        
        // 生成分类sitemap
        const categoriesSitemap = this.generateCategoriesSitemap(allPages)
        if (categoriesSitemap.urls > 0) {
          sitemaps.push({
            filename: 'sitemap-categories.xml',
            content: categoriesSitemap.xml,
            urls: categoriesSitemap.urls
          })
        }
        
        // 生成标签sitemap
        const tagsSitemap = this.generateTagsSitemap(allPages)
        if (tagsSitemap.urls > 0) {
          sitemaps.push({
            filename: 'sitemap-tags.xml',
            content: tagsSitemap.xml,
            urls: tagsSitemap.urls
          })
        }
        
        // 生成图片sitemap
        if (this.config.enableImages) {
          const imagesSitemap = this.generateImagesSitemap(allPages)
          if (imagesSitemap.urls > 0) {
            sitemaps.push({
              filename: 'sitemap-images.xml',
              content: imagesSitemap.xml,
              urls: imagesSitemap.urls
            })
          }
        }
        
        // 生成新闻sitemap
        if (this.config.enableNews) {
          const newsSitemap = this.generateNewsSitemap(allPages)
          if (newsSitemap.urls > 0) {
            sitemaps.push({
              filename: 'sitemap-news.xml',
              content: newsSitemap.xml,
              urls: newsSitemap.urls
            })
          }
        }
        
        // 生成sitemap索引文件
        if (this.config.enableSitemapIndex && sitemaps.length > 1) {
          const indexSitemap = this.generateSitemapIndex(sitemaps)
          sitemaps.push({
            filename: 'sitemap-index.xml',
            content: indexSitemap.xml,
            urls: 0,
            isIndex: true
          })
        }
      }
      
      // 计算统计信息
      this.stats.totalUrls = sitemaps.reduce((sum, sitemap) => sum + sitemap.urls, 0)
      this.stats.sitemapFiles = sitemaps.map(s => s.filename)
      this.stats.generationTime = Date.now() - startTime
      
      return {
        success: true,
        sitemaps,
        stats: this.stats
      }
      
    } catch (error) {
      this.stats.errors.push(error.message)
      return {
        success: false,
        error: error.message,
        stats: this.stats
      }
    }
  }

  /**
   * 生成主sitemap（向后兼容）
   * @param {Array} allPages - 所有页面数据
   * @returns {Object} sitemap结果
   */
  generateMainSitemap(allPages) {
    const urls = []
    
    // 添加静态页面
    urls.push(...this.generateStaticPages())
    
    // 添加文章页面
    if (allPages) {
      const publishedPages = allPages.filter(page => 
        page.status === 'Published' && 
        page.slug && 
        this.isValidSlug(page.slug)
      )
      
      publishedPages.forEach(page => {
        urls.push({
          loc: this.buildUrl(page.slug),
          lastmod: this.formatDate(page.publishDay || page.lastEditedTime),
          changefreq: this.getChangeFreq(page),
          priority: this.getPriority(page)
        })
      })
    }
    
    const xml = this.createSitemapXML(urls)
    
    return {
      xml,
      urls: urls.length
    }
  }

  /**
   * 生成页面sitemap
   * @param {Array} allPages - 所有页面数据
   * @returns {Object} sitemap结果
   */
  generatePagesSitemap(allPages) {
    const urls = []
    
    // 添加静态页面
    urls.push(...this.generateStaticPages())
    
    // 添加Page类型的页面
    if (allPages) {
      const pages = allPages.filter(page => 
        page.type === 'Page' && 
        page.status === 'Published' && 
        page.slug && 
        this.isValidSlug(page.slug)
      )
      
      pages.forEach(page => {
        urls.push({
          loc: this.buildUrl(page.slug),
          lastmod: this.formatDate(page.lastEditedTime || page.publishDay),
          changefreq: this.config.changefreq.pages,
          priority: this.config.priority.pages
        })
      })
    }
    
    const xml = this.createSitemapXML(urls)
    
    return {
      xml,
      urls: urls.length
    }
  }

  /**
   * 生成文章sitemap
   * @param {Array} allPages - 所有页面数据
   * @returns {Object} sitemap结果
   */
  generatePostsSitemap(allPages) {
    const urls = []
    
    if (allPages) {
      const posts = allPages.filter(page => 
        page.type === 'Post' && 
        page.status === 'Published' && 
        page.slug && 
        this.isValidSlug(page.slug)
      )
      
      posts.forEach(post => {
        urls.push({
          loc: this.buildUrl(post.slug),
          lastmod: this.formatDate(post.publishDay || post.lastEditedTime),
          changefreq: this.getChangeFreq(post),
          priority: this.getPostPriority(post),
          // 添加文章特定的元数据
          news: this.config.enableNews && this.isRecentPost(post.publishDay) ? {
            publication_date: this.formatDate(post.publishDay, true),
            title: post.title
          } : null
        })
      })
    }
    
    const xml = this.createSitemapXML(urls, { includeNews: this.config.enableNews })
    
    return {
      xml,
      urls: urls.length
    }
  }

  /**
   * 生成分类sitemap
   * @param {Array} allPages - 所有页面数据
   * @returns {Object} sitemap结果
   */
  generateCategoriesSitemap(allPages) {
    const urls = []
    
    if (allPages) {
      const categories = [...new Set(allPages
        .filter(page => page.category && page.status === 'Published')
        .map(page => page.category)
      )]
      
      categories.forEach(category => {
        const categoryUrl = this.config.enableCategoryMapping && this.config.categoryMapping[category]
          ? this.config.categoryMapping[category]
          : encodeURIComponent(category)
        
        urls.push({
          loc: this.buildUrl(`category/${categoryUrl}`),
          lastmod: this.formatDate(new Date()),
          changefreq: this.config.changefreq.categories,
          priority: this.config.priority.categories
        })
      })
    }
    
    const xml = this.createSitemapXML(urls)
    
    return {
      xml,
      urls: urls.length
    }
  }

  /**
   * 生成标签sitemap
   * @param {Array} allPages - 所有页面数据
   * @returns {Object} sitemap结果
   */
  generateTagsSitemap(allPages) {
    const urls = []
    
    if (allPages) {
      const tags = [...new Set(allPages
        .filter(page => page.tags && page.status === 'Published')
        .flatMap(page => page.tags)
      )]
      
      tags.forEach(tag => {
        urls.push({
          loc: this.buildUrl(`tag/${encodeURIComponent(tag)}`),
          lastmod: this.formatDate(new Date()),
          changefreq: this.config.changefreq.tags,
          priority: this.config.priority.tags
        })
      })
    }
    
    const xml = this.createSitemapXML(urls)
    
    return {
      xml,
      urls: urls.length
    }
  }

  /**
   * 生成图片sitemap
   * @param {Array} allPages - 所有页面数据
   * @returns {Object} sitemap结果
   */
  generateImagesSitemap(allPages) {
    const images = []
    
    if (allPages) {
      allPages
        .filter(page => page.status === 'Published' && page.slug)
        .forEach(page => {
          const pageUrl = this.buildUrl(page.slug)
          
          // 添加页面封面图片
          if (page.pageCover) {
            images.push({
              loc: pageUrl,
              image: {
                loc: page.pageCover,
                title: page.title,
                caption: page.summary || page.title
              }
            })
          }
          
          // 从内容中提取图片（简化版本）
          if (page.summary && page.summary.includes('http')) {
            const imageUrls = this.extractImageUrls(page.summary)
            imageUrls.forEach(imageUrl => {
              images.push({
                loc: pageUrl,
                image: {
                  loc: imageUrl,
                  title: page.title,
                  caption: page.summary || page.title
                }
              })
            })
          }
        })
    }
    
    const xml = this.createImageSitemapXML(images)
    
    return {
      xml,
      urls: images.length
    }
  }

  /**
   * 生成新闻sitemap
   * @param {Array} allPages - 所有页面数据
   * @returns {Object} sitemap结果
   */
  generateNewsSitemap(allPages) {
    const urls = []
    
    if (allPages) {
      const recentPosts = allPages.filter(page => 
        page.type === 'Post' && 
        page.status === 'Published' && 
        page.slug && 
        this.isRecentPost(page.publishDay, 2) // 2天内的文章
      )
      
      recentPosts.forEach(post => {
        urls.push({
          loc: this.buildUrl(post.slug),
          news: {
            publication: {
              name: BLOG.AUTHOR || 'NotionNext Blog',
              language: BLOG.LANG || 'zh-CN'
            },
            publication_date: this.formatDate(post.publishDay, true),
            title: post.title
          }
        })
      })
    }
    
    const xml = this.createNewsSitemapXML(urls)
    
    return {
      xml,
      urls: urls.length
    }
  }

  /**
   * 生成sitemap索引文件
   * @param {Array} sitemaps - sitemap文件列表
   * @returns {Object} 索引sitemap结果
   */
  generateSitemapIndex(sitemaps) {
    const currentDate = this.formatDate(new Date(), true)
    
    let indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
    
    sitemaps
      .filter(sitemap => !sitemap.isIndex && sitemap.urls > 0)
      .forEach(sitemap => {
        indexXml += `  <sitemap>
    <loc>${this.config.baseUrl}/${sitemap.filename}</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
`
      })
    
    indexXml += `</sitemapindex>`
    
    return {
      xml: indexXml
    }
  }

  /**
   * 生成静态页面URL列表
   * @returns {Array} 静态页面URL列表
   */
  generateStaticPages() {
    const currentDate = this.formatDate(new Date())
    
    return [
      {
        loc: this.config.baseUrl,
        lastmod: currentDate,
        changefreq: this.config.changefreq.home,
        priority: this.config.priority.home
      },
      {
        loc: this.buildUrl('archive'),
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 0.8
      },
      {
        loc: this.buildUrl('category'),
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 0.8
      },
      {
        loc: this.buildUrl('search'),
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.6
      },
      {
        loc: this.buildUrl('tag'),
        lastmod: currentDate,
        changefreq: 'daily',
        priority: 0.8
      },
      {
        loc: this.buildUrl('rss/feed.xml'),
        lastmod: currentDate,
        changefreq: 'daily',
        priority: this.config.priority.rss
      }
    ]
  }

  /**
   * 创建标准sitemap XML
   * @param {Array} urls - URL列表
   * @param {Object} options - 选项
   * @returns {string} XML字符串
   */
  createSitemapXML(urls, options = {}) {
    let urlsXml = ''
    
    urls.forEach(url => {
      urlsXml += `  <url>
    <loc>${this.escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`
      
      if (options.includeNews && url.news) {
        urlsXml += `
    <news:news>
      <news:publication>
        <news:name>${this.escapeXML(url.news.publication?.name || BLOG.AUTHOR)}</news:name>
        <news:language>${url.news.publication?.language || BLOG.LANG}</news:language>
      </news:publication>
      <news:publication_date>${url.news.publication_date}</news:publication_date>
      <news:title>${this.escapeXML(url.news.title)}</news:title>
    </news:news>`
      }
      
      urlsXml += `
  </url>
`
    })

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}</urlset>`
  }

  /**
   * 创建图片sitemap XML
   * @param {Array} images - 图片列表
   * @returns {string} XML字符串
   */
  createImageSitemapXML(images) {
    let urlsXml = ''
    
    // 按页面分组图片
    const groupedImages = {}
    images.forEach(img => {
      if (!groupedImages[img.loc]) {
        groupedImages[img.loc] = []
      }
      groupedImages[img.loc].push(img.image)
    })
    
    Object.entries(groupedImages).forEach(([pageUrl, pageImages]) => {
      urlsXml += `  <url>
    <loc>${this.escapeXML(pageUrl)}</loc>`
      
      pageImages.forEach(image => {
        urlsXml += `
    <image:image>
      <image:loc>${this.escapeXML(image.loc)}</image:loc>
      <image:title>${this.escapeXML(image.title)}</image:title>
      <image:caption>${this.escapeXML(image.caption)}</image:caption>
    </image:image>`
      })
      
      urlsXml += `
  </url>
`
    })

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}</urlset>`
  }

  /**
   * 创建新闻sitemap XML
   * @param {Array} urls - URL列表
   * @returns {string} XML字符串
   */
  createNewsSitemapXML(urls) {
    let urlsXml = ''
    
    urls.forEach(url => {
      urlsXml += `  <url>
    <loc>${this.escapeXML(url.loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${this.escapeXML(url.news.publication.name)}</news:name>
        <news:language>${url.news.publication.language}</news:language>
      </news:publication>
      <news:publication_date>${url.news.publication_date}</news:publication_date>
      <news:title>${this.escapeXML(url.news.title)}</news:title>
    </news:news>
  </url>
`
    })

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlsXml}</urlset>`
  }

  /**
   * 构建完整URL
   * @param {string} path - 路径
   * @returns {string} 完整URL
   */
  buildUrl(path) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${this.config.baseUrl}/${cleanPath}`
  }

  /**
   * 格式化日期
   * @param {string|Date} date - 日期
   * @param {boolean} includeTime - 是否包含时间
   * @returns {string} 格式化后的日期
   */
  formatDate(date, includeTime = false) {
    if (!date) return new Date().toISOString().split('T')[0]
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return new Date().toISOString().split('T')[0]
    }
    
    return includeTime 
      ? dateObj.toISOString()
      : dateObj.toISOString().split('T')[0]
  }

  /**
   * 获取更新频率
   * @param {Object} page - 页面对象
   * @returns {string} 更新频率
   */
  getChangeFreq(page) {
    if (page.type === 'Post') {
      return this.config.changefreq.posts
    }
    return this.config.changefreq.pages
  }

  /**
   * 获取优先级
   * @param {Object} page - 页面对象
   * @returns {number} 优先级
   */
  getPriority(page) {
    if (page.type === 'Post') {
      return this.config.priority.posts
    }
    return this.config.priority.pages
  }

  /**
   * 获取文章优先级（基于发布时间）
   * @param {Object} post - 文章对象
   * @returns {number} 优先级
   */
  getPostPriority(post) {
    const publishDate = new Date(post.publishDay)
    const now = new Date()
    const daysDiff = (now - publishDate) / (1000 * 60 * 60 * 24)
    
    // 新文章优先级更高
    if (daysDiff < 7) return 0.9
    if (daysDiff < 30) return 0.8
    if (daysDiff < 90) return 0.7
    return this.config.priority.posts
  }

  /**
   * 检查是否为最近发布的文章
   * @param {string} publishDay - 发布日期
   * @param {number} days - 天数限制
   * @returns {boolean} 是否为最近文章
   */
  isRecentPost(publishDay, days = 2) {
    if (!publishDay) return false
    
    const publishDate = new Date(publishDay)
    const now = new Date()
    const daysDiff = (now - publishDate) / (1000 * 60 * 60 * 24)
    return daysDiff <= days
  }

  /**
   * 验证slug是否有效
   * @param {string} slug - slug
   * @returns {boolean} 是否有效
   */
  isValidSlug(slug) {
    if (!slug || typeof slug !== 'string') return false
    
    // 过滤包含其他域名的slug
    if (slug.includes('https://') || slug.includes('http://')) {
      return false
    }
    
    // 过滤包含片段标识符的slug
    if (slug.includes('#')) {
      return false
    }
    
    // 过滤空slug或只有斜杠的slug
    if (slug === '' || slug === '/') {
      return false
    }
    
    return true
  }

  /**
   * 从文本中提取图片URL
   * @param {string} text - 文本内容
   * @returns {Array} 图片URL列表
   */
  extractImageUrls(text) {
    const imageRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi
    return text.match(imageRegex) || []
  }

  /**
   * XML转义
   * @param {string} str - 需要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeXML(str) {
    if (!str) return ''
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return { ...this.stats }
  }
}

module.exports = { SitemapEnhancedGenerator }