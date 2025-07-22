/**
 * 增强版sitemap生成器
 * 支持多种sitemap类型和智能优化
 */

import { siteConfig } from '@/lib/config'
import fs from 'fs'

/**
 * 生成增强版sitemap
 * @param {Object} props 配置参数
 * @returns {Object} 生成的sitemap数据
 */
export function generateEnhancedSitemap(props) {
  const { allPages, siteInfo, NOTION_CONFIG, options = {} } = props
  
  const link = siteConfig('LINK', siteInfo?.link, NOTION_CONFIG)
  const baseUrl = link?.replace(/\/$/, '') || ''
  
  const {
    enableImages = true,
    enableNews = false,
    enableVideos = false,
    maxUrls = 50000,
    changefreqRules = {},
    priorityRules = {},
    excludePatterns = [],
    includeStaticPages = true
  } = options
  
  const sitemaps = {
    main: generateMainSitemap({ allPages, baseUrl, NOTION_CONFIG, options }),
    images: enableImages ? generateImageSitemap({ allPages, baseUrl, options }) : null,
    news: enableNews ? generateNewsSitemap({ allPages, baseUrl, options }) : null,
    videos: enableVideos ? generateVideoSitemap({ allPages, baseUrl, options }) : null,
    index: null
  }
  
  // 生成sitemap索引
  sitemaps.index = generateSitemapIndex({ sitemaps, baseUrl })
  
  return sitemaps
}

/**
 * 生成主sitemap
 * @param {Object} params 参数
 * @returns {string} sitemap XML
 */
function generateMainSitemap({ allPages, baseUrl, NOTION_CONFIG, options = {} }) {
  const {
    changefreqRules = {
      home: 'daily',
      posts: 'weekly',
      pages: 'monthly',
      categories: 'weekly',
      tags: 'weekly'
    },
    priorityRules = {
      home: 1.0,
      posts: 0.8,
      pages: 0.6,
      categories: 0.5,
      tags: 0.4
    }
  } = options
  
  const urls = []
  const now = new Date().toISOString().split('T')[0]
  
  // 首页
  urls.push({
    loc: baseUrl,
    lastmod: now,
    changefreq: changefreqRules.home,
    priority: priorityRules.home
  })
  
  // 静态页面
  const staticPages = [
    { path: '/archive', changefreq: changefreqRules.pages, priority: priorityRules.pages },
    { path: '/category', changefreq: changefreqRules.categories, priority: priorityRules.categories },
    { path: '/tag', changefreq: changefreqRules.tags, priority: priorityRules.tags },
    { path: '/search', changefreq: 'monthly', priority: 0.3 }
  ]
  
  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority
    })
  })
  
  // 文章页面
  if (allPages && allPages.length > 0) {
    allPages
      .filter(post => post.status === 'Published' && post.type === 'Post')
      .forEach(post => {
        const slug = post.slug?.startsWith('/') ? post.slug.slice(1) : post.slug
        if (slug) {
          urls.push({
            loc: `${baseUrl}/${slug}`,
            lastmod: formatDate(post.lastEditedDay || post.publishDay),
            changefreq: changefreqRules.posts,
            priority: priorityRules.posts,
            images: extractPostImages(post)
          })
        }
      })
  }
  
  // 分类页面
  const categories = extractCategories(allPages)
  categories.forEach(category => {
    urls.push({
      loc: `${baseUrl}/category/${encodeURIComponent(category)}`,
      lastmod: now,
      changefreq: changefreqRules.categories,
      priority: priorityRules.categories
    })
  })
  
  // 标签页面
  const tags = extractTags(allPages)
  tags.forEach(tag => {
    urls.push({
      loc: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
      lastmod: now,
      changefreq: changefreqRules.tags,
      priority: priorityRules.tags
    })
  })
  
  return createSitemapXml(urls, 'main')
}

/**
 * 生成图片sitemap
 * @param {Object} params 参数
 * @returns {string} 图片sitemap XML
 */
function generateImageSitemap({ allPages, baseUrl, options = {} }) {
  const images = []
  
  if (allPages && allPages.length > 0) {
    allPages
      .filter(post => post.status === 'Published')
      .forEach(post => {
        const postImages = extractPostImages(post)
        const slug = post.slug?.startsWith('/') ? post.slug.slice(1) : post.slug
        
        if (postImages.length > 0 && slug) {
          const pageUrl = `${baseUrl}/${slug}`
          
          postImages.forEach(img => {
            images.push({
              loc: pageUrl,
              image: {
                loc: img.src,
                title: img.title || post.title,
                caption: img.caption || post.summary,
                license: img.license
              }
            })
          })
        }
      })
  }
  
  return createImageSitemapXml(images)
}

/**
 * 生成新闻sitemap
 * @param {Object} params 参数
 * @returns {string} 新闻sitemap XML
 */
function generateNewsSitemap({ allPages, baseUrl, options = {} }) {
  const newsArticles = []
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  
  if (allPages && allPages.length > 0) {
    allPages
      .filter(post => {
        const publishDate = new Date(post.publishDay)
        return (
          post.status === 'Published' &&
          post.type === 'Post' &&
          publishDate >= twoDaysAgo &&
          (post.category?.includes('新闻') || post.category?.includes('资讯'))
        )
      })
      .forEach(post => {
        const slug = post.slug?.startsWith('/') ? post.slug.slice(1) : post.slug
        if (slug) {
          newsArticles.push({
            loc: `${baseUrl}/${slug}`,
            news: {
              publication: {
                name: siteConfig('TITLE'),
                language: siteConfig('LANG')
              },
              publication_date: formatDate(post.publishDay),
              title: post.title
            }
          })
        }
      })
  }
  
  return createNewsSitemapXml(newsArticles)
}

/**
 * 生成视频sitemap
 * @param {Object} params 参数
 * @returns {string} 视频sitemap XML
 */
function generateVideoSitemap({ allPages, baseUrl, options = {} }) {
  const videos = []
  
  if (allPages && allPages.length > 0) {
    allPages
      .filter(post => post.status === 'Published')
      .forEach(post => {
        const postVideos = extractPostVideos(post)
        const slug = post.slug?.startsWith('/') ? post.slug.slice(1) : post.slug
        
        if (postVideos.length > 0 && slug) {
          const pageUrl = `${baseUrl}/${slug}`
          
          postVideos.forEach(video => {
            videos.push({
              loc: pageUrl,
              video: {
                thumbnail_loc: video.thumbnail,
                title: video.title || post.title,
                description: video.description || post.summary,
                content_loc: video.url,
                duration: video.duration,
                publication_date: formatDate(post.publishDay)
              }
            })
          })
        }
      })
  }
  
  return createVideoSitemapXml(videos)
}

/**
 * 生成sitemap索引
 * @param {Object} params 参数
 * @returns {string} sitemap索引XML
 */
function generateSitemapIndex({ sitemaps, baseUrl }) {
  const indexEntries = []
  const now = new Date().toISOString()
  
  // 主sitemap
  if (sitemaps.main) {
    indexEntries.push({
      loc: `${baseUrl}/sitemap.xml`,
      lastmod: now
    })
  }
  
  // 图片sitemap
  if (sitemaps.images) {
    indexEntries.push({
      loc: `${baseUrl}/sitemap-images.xml`,
      lastmod: now
    })
  }
  
  // 新闻sitemap
  if (sitemaps.news) {
    indexEntries.push({
      loc: `${baseUrl}/sitemap-news.xml`,
      lastmod: now
    })
  }
  
  // 视频sitemap
  if (sitemaps.videos) {
    indexEntries.push({
      loc: `${baseUrl}/sitemap-videos.xml`,
      lastmod: now
    })
  }
  
  return createSitemapIndexXml(indexEntries)
}

/**
 * 创建标准sitemap XML
 * @param {Array} urls URL数组
 * @param {string} type sitemap类型
 * @returns {string} XML字符串
 */
function createSitemapXml(urls, type = 'main') {
  let urlsXml = ''
  
  urls.forEach(url => {
    urlsXml += '  <url>\n'
    urlsXml += `    <loc>${escapeXml(url.loc)}</loc>\n`
    
    if (url.lastmod) {
      urlsXml += `    <lastmod>${url.lastmod}</lastmod>\n`
    }
    
    if (url.changefreq) {
      urlsXml += `    <changefreq>${url.changefreq}</changefreq>\n`
    }
    
    if (url.priority) {
      urlsXml += `    <priority>${url.priority}</priority>\n`
    }
    
    urlsXml += '  </url>\n'
  })
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlsXml}</urlset>`
}

/**
 * 创建图片sitemap XML
 * @param {Array} images 图片数组
 * @returns {string} XML字符串
 */
function createImageSitemapXml(images) {
  let urlsXml = ''
  
  images.forEach(item => {
    urlsXml += '  <url>\n'
    urlsXml += `    <loc>${escapeXml(item.loc)}</loc>\n`
    urlsXml += '    <image:image>\n'
    urlsXml += `      <image:loc>${escapeXml(item.image.loc)}</image:loc>\n`
    
    if (item.image.title) {
      urlsXml += `      <image:title>${escapeXml(item.image.title)}</image:title>\n`
    }
    
    if (item.image.caption) {
      urlsXml += `      <image:caption>${escapeXml(item.image.caption)}</image:caption>\n`
    }
    
    urlsXml += '    </image:image>\n'
    urlsXml += '  </url>\n'
  })
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}</urlset>`
}

/**
 * 创建新闻sitemap XML
 * @param {Array} articles 新闻文章数组
 * @returns {string} XML字符串
 */
function createNewsSitemapXml(articles) {
  let urlsXml = ''
  
  articles.forEach(article => {
    urlsXml += '  <url>\n'
    urlsXml += `    <loc>${escapeXml(article.loc)}</loc>\n`
    urlsXml += '    <news:news>\n'
    urlsXml += '      <news:publication>\n'
    urlsXml += `        <news:name>${escapeXml(article.news.publication.name)}</news:name>\n`
    urlsXml += `        <news:language>${article.news.publication.language}</news:language>\n`
    urlsXml += '      </news:publication>\n'
    urlsXml += `      <news:publication_date>${article.news.publication_date}</news:publication_date>\n`
    urlsXml += `      <news:title>${escapeXml(article.news.title)}</news:title>\n`
    urlsXml += '    </news:news>\n'
    urlsXml += '  </url>\n'
  })
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlsXml}</urlset>`
}

/**
 * 创建sitemap索引XML
 * @param {Array} entries 索引条目数组
 * @returns {string} XML字符串
 */
function createSitemapIndexXml(entries) {
  let sitemapsXml = ''
  
  entries.forEach(entry => {
    sitemapsXml += '  <sitemap>\n'
    sitemapsXml += `    <loc>${escapeXml(entry.loc)}</loc>\n`
    if (entry.lastmod) {
      sitemapsXml += `    <lastmod>${entry.lastmod}</lastmod>\n`
    }
    sitemapsXml += '  </sitemap>\n'
  })
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}</sitemapindex>`
}

/**
 * 写入sitemap文件
 * @param {Object} sitemaps sitemap数据
 */
export function writeEnhancedSitemaps(sitemaps) {
  try {
    // 确保public目录存在
    fs.mkdirSync('./public', { recursive: true })
    
    // 写入主sitemap
    if (sitemaps.main) {
      fs.writeFileSync('./public/sitemap.xml', sitemaps.main)
    }
    
    // 写入图片sitemap
    if (sitemaps.images) {
      fs.writeFileSync('./public/sitemap-images.xml', sitemaps.images)
    }
    
    // 写入新闻sitemap
    if (sitemaps.news) {
      fs.writeFileSync('./public/sitemap-news.xml', sitemaps.news)
    }
    
    // 写入视频sitemap
    if (sitemaps.videos) {
      fs.writeFileSync('./public/sitemap-videos.xml', sitemaps.videos)
    }
    
    // 写入sitemap索引
    if (sitemaps.index) {
      fs.writeFileSync('./public/sitemap-index.xml', sitemaps.index)
    }
    
    console.log('✅ Enhanced sitemaps generated successfully')
    return true
  } catch (error) {
    console.warn('⚠️ Failed to write sitemaps:', error.message)
    return false
  }
}

// 辅助函数
function formatDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0]
  return new Date(dateString).toISOString().split('T')[0]
}

function extractCategories(allPages) {
  const categories = new Set()
  if (allPages) {
    allPages.forEach(post => {
      if (post.category && post.category.length > 0) {
        post.category.forEach(cat => categories.add(cat))
      }
    })
  }
  return Array.from(categories)
}

function extractTags(allPages) {
  const tags = new Set()
  if (allPages) {
    allPages.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => tags.add(tag))
      }
    })
  }
  return Array.from(tags)
}

function extractPostImages(post) {
  const images = []
  
  // 封面图
  if (post.pageCover) {
    images.push({
      src: post.pageCover,
      title: post.title,
      caption: post.summary
    })
  }
  
  // 缩略图
  if (post.pageCoverThumbnail && post.pageCoverThumbnail !== post.pageCover) {
    images.push({
      src: post.pageCoverThumbnail,
      title: `${post.title} - 缩略图`,
      caption: post.summary
    })
  }
  
  return images
}

function extractPostVideos(post) {
  // 这里可以根据实际需求提取文章中的视频信息
  return []
}

function escapeXml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export { generateEnhancedSitemap }