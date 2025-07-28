// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { getGlobalData } from '@/lib/db/getSiteData'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { URLValidator } from '@/lib/utils/URLValidator'

export const getServerSideProps = async ctx => {
  try {
    // 初始化URL验证器
    const baseUrl = 'https://www.shareking.vip'
    const urlValidator = new URLValidator({ baseUrl })
    
    let allUrls = []
    const siteIds = BLOG.NOTION_PAGE_ID.split(',')

    for (let index = 0; index < siteIds.length; index++) {
      const siteId = siteIds[index]
      const id = extractLangId(siteId)
      const locale = extractLangPrefix(siteId)

      try {
        const siteData = await getGlobalData({
          pageId: id,
          from: 'sitemap.xml'
        })

        const localeUrls = generateSitemapUrls(baseUrl, siteData.allPages, locale, urlValidator)
        allUrls = allUrls.concat(localeUrls)
      } catch (error) {
        console.error(`Error processing site ${siteId}:`, error)
        continue
      }
    }

    // 使用URLValidator进行去重和验证
    const validationResult = urlValidator.validateURLList(allUrls)
    const uniqueUrls = urlValidator.deduplicateURLs(validationResult.valid)

    // 记录验证统计信息
    if (validationResult.invalid.length > 0) {
      console.warn(`Filtered ${validationResult.invalid.length} invalid URLs from sitemap`)
    }

    // 生成XML
    const xml = generateXML(uniqueUrls, urlValidator)

    // 设置响应头
    ctx.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    ctx.res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=59')

    ctx.res.write(xml)
    ctx.res.end()

    return { props: {} }
  } catch (error) {
    console.error('Sitemap generation error:', error)

    // 基本的fallback sitemap
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.shareking.vip</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    ctx.res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    ctx.res.write(fallbackXml)
    ctx.res.end()

    return { props: {} }
  }
}



function generateSitemapUrls(baseUrl, allPages, locale, urlValidator) {
  // 处理locale前缀
  let localePrefix = ''
  if (locale && locale.length > 0 && locale !== 'zh-CN') {
    localePrefix = locale.indexOf('/') === 0 ? locale : '/' + locale
  }

  const currentDate = new Date().toISOString().split('T')[0]
  
  // 基础页面
  const urls = [
    {
      loc: `${baseUrl}${localePrefix}`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}${localePrefix}/archive`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}${localePrefix}/category`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      loc: `${baseUrl}${localePrefix}/search`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.6'
    },
    {
      loc: `${baseUrl}${localePrefix}/tag`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.8'
    }
  ]

  // 添加RSS链接
  if (allPages && allPages.length > 0) {
    urls.push({
      loc: `${baseUrl}${localePrefix}/rss/feed.xml`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.7'
    })
  }

  // 添加文章页面
  if (allPages) {
    allPages
      .filter(p => {
        return p.status === 'Published' &&
               p.slug &&
               p.publishDay &&
               urlValidator.isValidSlug(p.slug)
      })
      .forEach(post => {
        const generatedUrl = urlValidator.generateURL(post.slug, locale)
        
        if (generatedUrl) {
          urls.push({
            loc: generatedUrl,
            lastmod: new Date(post.publishDay).toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.8'
          })
        }
      })
  }

  return urls
}

function generateXML(urls, urlValidator) {
  // URLs已经通过URLValidator验证过，这里直接生成XML
  let urlsXml = ''
  urls.forEach(url => {
    urlsXml += `  <url>
    <loc>${urlValidator.escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}</urlset>`
}

export default () => { }
