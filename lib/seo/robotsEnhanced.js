import fs from 'fs'
import { siteConfig } from '../config'

/**
 * 增强版robots.txt生成器
 * 支持更详细的爬虫指令和SEO优化
 */
export function generateEnhancedRobotsTxt(props) {
  const { siteInfo, NOTION_CONFIG } = props
  
  // 优先使用blog.config.js中的配置，而不是Notion中的数据
  const LINK = siteConfig('LINK', 'https://www.shareking.vip', NOTION_CONFIG)
  const AUTHOR = siteConfig('AUTHOR', '分享之王', NOTION_CONFIG)
  
  // 检查是否启用增强版robots.txt
  const isEnhanced = siteConfig('SEO_ROBOTS_ENHANCED', true, NOTION_CONFIG)
  if (!isEnhanced) {
    console.log('Enhanced robots.txt is disabled, skipping...')
    return
  }
  
  // 确保链接不以斜杠结尾
  const baseUrl = LINK && LINK.endsWith('/') ? LINK.slice(0, -1) : LINK

  const content = generateRobotsContent(baseUrl, AUTHOR, NOTION_CONFIG)
  
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
    console.log('✅ Enhanced robots.txt generated successfully for:', baseUrl)
  } catch (error) {
    console.warn('⚠️ Cannot write robots.txt file:', error.message)
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}

/**
 * 生成robots.txt内容
 */
function generateRobotsContent(baseUrl, author, NOTION_CONFIG) {
  const currentDate = new Date().toISOString().split('T')[0]
  const crawlDelay = siteConfig('SEO_ROBOTS_CRAWL_DELAY', 1, NOTION_CONFIG)
  const blockBots = siteConfig('SEO_ROBOTS_BLOCK_BOTS', true, NOTION_CONFIG)
  
  // 基础内容
  let content = `# Robots.txt for ${baseUrl}
# Generated on ${currentDate}
# Author: ${author || 'NotionNext'}

# Allow all web crawlers to access all content
User-agent: *
Allow: /

# Disallow access to admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /_next/
Disallow: /static/

# Disallow access to search result pages to prevent duplicate content
Disallow: /search?*
Disallow: /search/*

# Allow access to important directories
Allow: /images/
Allow: /css/
Allow: /js/
Allow: /fonts/

# Specific rules for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: ${crawlDelay}

User-agent: Bingbot
Allow: /
Crawl-delay: ${crawlDelay}

User-agent: Slurp
Allow: /
Crawl-delay: ${Math.max(crawlDelay, 2)}

User-agent: DuckDuckBot
Allow: /
Crawl-delay: ${crawlDelay}

User-agent: Baiduspider
Allow: /
Crawl-delay: ${Math.max(crawlDelay, 2)}

User-agent: YandexBot
Allow: /
Crawl-delay: ${crawlDelay}
`

  // 如果启用了阻止恶意爬虫
  if (blockBots) {
    content += `
# Block problematic and AI training bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MajesticSEO
Disallow: /

# Block AI training bots
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: meta-externalagent
Disallow: /
`
  }

  // 添加Host和Sitemap信息
  content += `
# Host declaration
Host: ${baseUrl.replace('https://', '').replace('http://', '')}

# Sitemap locations
Sitemap: ${baseUrl}/sitemap.xml`

  // 检查是否启用了图片sitemap
  if (siteConfig('SEO_SITEMAP_IMAGES', true, NOTION_CONFIG)) {
    content += `
Sitemap: ${baseUrl}/sitemap-images.xml`
  }

  content += `
Sitemap: ${baseUrl}/sitemap-pages.xml
Sitemap: ${baseUrl}/sitemap-posts.xml`

  // 如果启用了增强版sitemap，添加更多sitemap文件
  if (siteConfig('SEO_SITEMAP_ENHANCED', true, NOTION_CONFIG)) {
    content += `
Sitemap: ${baseUrl}/sitemap-categories.xml
Sitemap: ${baseUrl}/sitemap-tags.xml
Sitemap: ${baseUrl}/sitemap-index.xml`
  }

  content += `

# Additional information
# For questions about this robots.txt, contact: ${author || 'admin'}@${baseUrl?.replace('https://', '').replace('http://', '')}
`

  return content
}

/**
 * 验证robots.txt内容
 */
export function validateRobotsTxt(content) {
  const issues = []
  
  // 检查基本结构
  if (!content.includes('User-agent:')) {
    issues.push('Missing User-agent directive')
  }
  
  if (!content.includes('Sitemap:')) {
    issues.push('Missing Sitemap directive')
  }
  
  // 检查常见错误
  if (content.includes('Disallow: /')) {
    const lines = content.split('\n')
    const disallowAllIndex = lines.findIndex(line => line.trim() === 'Disallow: /')
    if (disallowAllIndex > -1) {
      const userAgentIndex = lines.slice(0, disallowAllIndex).reverse().findIndex(line => line.includes('User-agent:'))
      if (userAgentIndex > -1) {
        issues.push('Warning: Disallow: / blocks all content for some user agents')
      }
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  }
}

/**
 * 获取robots.txt统计信息
 */
export function getRobotsTxtStats(content) {
  const lines = content.split('\n').filter(line => line.trim())
  const userAgents = lines.filter(line => line.includes('User-agent:')).length
  const allowRules = lines.filter(line => line.includes('Allow:')).length
  const disallowRules = lines.filter(line => line.includes('Disallow:')).length
  const sitemaps = lines.filter(line => line.includes('Sitemap:')).length
  
  return {
    totalLines: lines.length,
    userAgents,
    allowRules,
    disallowRules,
    sitemaps,
    hasHost: content.includes('Host:'),
    hasCrawlDelay: content.includes('Crawl-delay:')
  }
}