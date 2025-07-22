import fs from 'fs'
import { siteConfig } from '../config'

/**
 * 增强版sitemap生成器
 * 支持图片sitemap、多语言、自动更新等功能
 */
export function generateEnhancedSitemap({ allPages, siteInfo, NOTION_CONFIG }) {
  const baseUrl = getBaseUrl(siteInfo, NOTION_CONFIG)
  
  // 生成主sitemap索引文件
  generateSitemapIndex(baseUrl)
  
  // 生成页面sitemap
  generatePagesSitemap(allPages, baseUrl)
  
  // 生成文章sitemap
  generatePostsSitemap(allPages, baseUrl)
  
  // 生成图片sitemap
  generateImagesSitemap(allPages, baseUrl)
  
  // 生成主sitemap（兼容性）
  generateMainSitemap(allPages, baseUrl)
  
  console.log('✅ Enhanced sitemaps generated successfully')
}

/**
 * 获取基础URL
 */
function getBaseUrl(siteInfo, NOTION_CONFIG) {
  let link = siteConfig('LINK', siteInfo?.link, NOTION_CONFIG)
  // 确保链接不以斜杠结尾
  if (link && link.endsWith('/')) {
    link = link.slice(0, -1)
  }
  return link
}

/**
 * 生成sitemap索引文件
 */
function generateSitemapIndex(baseUrl) {
  const currentDate = new Date().toISOString()
  
  const indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-posts.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-images.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`

  writeFile('sitemap-index.xml', indexContent)
}

/**
 * 生成页面sitemap
 */
function generatePagesSitemap(allPages, baseUrl) {
  const staticPages = [
    {
      loc: `${baseUrl}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/archive`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/category`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/tag`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7
    }
  ]

  // 添加分类页面
  const categories = [...new Set(allPages?.filter(p => p.category).map(p => p.category))]
  categories.forEach(category => {
    staticPages.push({
      loc: `${baseUrl}/category/${encodeURIComponent(category)}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.6
    })
  })

  // 添加标签页面
  const tags = [...new Set(allPages?.filter(p => p.tags).flatMap(p => p.tags))]
  tags.forEach(tag => {
    staticPages.push({
      loc: `${baseUrl}/tag/${encodeURIComponent(tag)}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.5
    })
  })

  const xml = createSitemapXml(staticPages)
  writeFile('sitemap-pages.xml', xml)
}

/**
 * 生成文章sitemap
 */
function generatePostsSitemap(allPages, baseUrl) {
  const posts = allPages?.filter(page => page.type === 'Post' && page.status === 'Published') || []
  
  const postUrls = posts.map(post => {
    const slugWithoutLeadingSlash = post?.slug?.startsWith('/')
      ? post?.slug?.slice(1)
      : post.slug

    return {
      loc: `${baseUrl}/${slugWithoutLeadingSlash}`,
      lastmod: new Date(post?.lastEditedTime || post?.publishDay).toISOString(),
      changefreq: getChangeFreq(post),
      priority: getPostPriority(post),
      // 添加文章特定的元数据
      news: post.publishDay && isRecentPost(post.publishDay) ? {
        publication_date: new Date(post.publishDay).toISOString(),
        title: post.title
      } : null
    }
  })

  const xml = createSitemapXml(postUrls, true)
  writeFile('sitemap-posts.xml', xml)
}

/**
 * 生成图片sitemap
 */
function generateImagesSitemap(allPages, baseUrl) {
  const images = []
  
  allPages?.forEach(page => {
    if (page.pageCover) {
      images.push({
        loc: `${baseUrl}/${page.slug?.startsWith('/') ? page.slug.slice(1) : page.slug}`,
        image: {
          loc: page.pageCover,
          title: page.title,
          caption: page.summary || page.title
        }
      })
    }
    
    // 从内容中提取图片（如果有的话）
    if (page.content) {
      const imageMatches = page.content.match(/<img[^>]+src="([^">]+)"/g)
      if (imageMatches) {
        imageMatches.forEach(match => {
          const srcMatch = match.match(/src="([^"]+)"/)
          const altMatch = match.match(/alt="([^"]+)"/)
          if (srcMatch) {
            images.push({
              loc: `${baseUrl}/${page.slug?.startsWith('/') ? page.slug.slice(1) : page.slug}`,
              image: {
                loc: srcMatch[1],
                title: altMatch ? altMatch[1] : page.title,
                caption: page.summary || page.title
              }
            })
          }
        })
      }
    }
  })

  const xml = createImageSitemapXml(images)
  writeFile('sitemap-images.xml', xml)
}

/**
 * 生成主sitemap（向后兼容）
 */
function generateMainSitemap(allPages, baseUrl) {
  const urls = [
    {
      loc: `${baseUrl}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/archive`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/category`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    },
    {
      loc: `${baseUrl}/tag`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily'
    }
  ]

  // 添加所有页面
  allPages?.forEach(post => {
    const slugWithoutLeadingSlash = post?.slug?.startsWith('/')
      ? post?.slug?.slice(1)
      : post.slug
    urls.push({
      loc: `${baseUrl}/${slugWithoutLeadingSlash}`,
      lastmod: new Date(post?.publishDay).toISOString().split('T')[0],
      changefreq: 'daily'
    })
  })

  const xml = createSitemapXml(urls)
  writeFile('sitemap.xml', xml)
}

/**
 * 创建标准sitemap XML
 */
function createSitemapXml(urls, includeNews = false) {
  let urlsXml = ''
  
  urls.forEach(u => {
    urlsXml += `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>`
    
    if (u.priority) {
      urlsXml += `
    <priority>${u.priority}</priority>`
    }
    
    if (includeNews && u.news) {
      urlsXml += `
    <news:news>
      <news:publication>
        <news:name>NotionNext Blog</news:name>
        <news:language>zh-CN</news:language>
      </news:publication>
      <news:publication_date>${u.news.publication_date}</news:publication_date>
      <news:title>${escapeXml(u.news.title)}</news:title>
    </news:news>`
    }
    
    urlsXml += `
  </url>
`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXml}</urlset>`
}

/**
 * 创建图片sitemap XML
 */
function createImageSitemapXml(images) {
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
    <loc>${escapeXml(pageUrl)}</loc>`
    
    pageImages.forEach(image => {
      urlsXml += `
    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      <image:caption>${escapeXml(image.caption)}</image:caption>
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
 * 获取更新频率
 */
function getChangeFreq(post) {
  const publishDate = new Date(post.publishDay)
  const now = new Date()
  const daysDiff = (now - publishDate) / (1000 * 60 * 60 * 24)
  
  if (daysDiff < 7) return 'daily'
  if (daysDiff < 30) return 'weekly'
  if (daysDiff < 365) return 'monthly'
  return 'yearly'
}

/**
 * 获取文章优先级
 */
function getPostPriority(post) {
  const publishDate = new Date(post.publishDay)
  const now = new Date()
  const daysDiff = (now - publishDate) / (1000 * 60 * 60 * 24)
  
  // 新文章优先级更高
  if (daysDiff < 7) return 0.9
  if (daysDiff < 30) return 0.8
  if (daysDiff < 90) return 0.7
  return 0.6
}

/**
 * 检查是否为最近发布的文章
 */
function isRecentPost(publishDay) {
  const publishDate = new Date(publishDay)
  const now = new Date()
  const daysDiff = (now - publishDate) / (1000 * 60 * 60 * 24)
  return daysDiff <= 2 // 2天内的文章
}

/**
 * XML转义
 */
function escapeXml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * 写入文件
 */
function writeFile(filename, content) {
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync(`./public/${filename}`, content)
    fs.writeFileSync(filename, content) // 根目录备份
  } catch (error) {
    console.warn(`⚠️ Cannot write ${filename}:`, error.message)
  }
}

/**
 * 验证sitemap
 */
export function validateSitemap(content) {
  const issues = []
  
  // 检查XML格式
  if (!content.includes('<?xml')) {
    issues.push('Missing XML declaration')
  }
  
  if (!content.includes('<urlset')) {
    issues.push('Missing urlset element')
  }
  
  // 检查URL数量限制
  const urlCount = (content.match(/<url>/g) || []).length
  if (urlCount > 50000) {
    issues.push(`Too many URLs (${urlCount}). Consider splitting into multiple sitemaps.`)
  }
  
  // 检查文件大小
  const sizeInMB = Buffer.byteLength(content, 'utf8') / (1024 * 1024)
  if (sizeInMB > 50) {
    issues.push(`Sitemap too large (${sizeInMB.toFixed(2)}MB). Maximum size is 50MB.`)
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    stats: {
      urlCount,
      sizeInMB: sizeInMB.toFixed(2)
    }
  }
}

/**
 * 自动提交sitemap到搜索引擎
 */
export async function submitSitemapToSearchEngines(baseUrl) {
  const sitemapUrl = `${baseUrl}/sitemap.xml`
  const results = []
  
  // Google Search Console
  try {
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    const response = await fetch(googleUrl)
    results.push({
      engine: 'Google',
      success: response.ok,
      status: response.status
    })
  } catch (error) {
    results.push({
      engine: 'Google',
      success: false,
      error: error.message
    })
  }
  
  // Bing Webmaster Tools
  try {
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    const response = await fetch(bingUrl)
    results.push({
      engine: 'Bing',
      success: response.ok,
      status: response.status
    })
  } catch (error) {
    results.push({
      engine: 'Bing',
      success: false,
      error: error.message
    })
  }
  
  return results
}