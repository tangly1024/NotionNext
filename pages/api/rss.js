import BLOG from '@/blog.config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { createFeed } from '@/lib/utils/rss'

/**
 * In-memory RSS cache to avoid regenerating on every request.
 * Survives across ISR revalidations within the same serverless instance.
 */
let rssCache = {
  xml: null,
  atomXml: null,
  json: null,
  updatedAt: 0
}

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

function isCacheFresh() {
  return rssCache.xml && Date.now() - rssCache.updatedAt < CACHE_TTL_MS
}

/**
 * Generate RSS feed content from site data.
 * Reuses the same data pipeline as the homepage getStaticProps.
 */
async function generateRssContent() {
  const locale = BLOG.LANG
  const defaultLocale = BLOG.LANG
  const pageId = BLOG.NOTION_PAGE_ID

  // Parse the first (default) page ID for data fetching
  const pageIds = pageId.split(',')
  const targetId = pageIds[0].includes(':')
    ? pageIds[0].split(':')[1]
    : pageIds[0]

  const props = await fetchGlobalAllData({ from: 'rss-api', pageId: targetId, locale })
  if (!props || !props.allPages) {
    return null
  }

  const { siteInfo, allPages, NOTION_CONFIG } = props

  // 复用构建时同一份文章列表，保证兜底 feed 与静态 feed 的条数与顺序一致
  const latestPosts = (props.latestPosts || []).filter(
    post => post.type === 'Post' && post.status === 'Published'
  )

  if (latestPosts.length === 0) {
    return null
  }

  // 与构建时的静态 feed 共用同一套渲染逻辑，保证兜底输出与静态文件内容一致
  const feed = await createFeed({
    siteInfo,
    NOTION_CONFIG,
    posts: latestPosts,
    allPages,
    subPath: NOTION_CONFIG?.SUB_PATH || BLOG.SUB_PATH
  })

  return {
    xml: feed.rss2(),
    atomXml: feed.atom1(),
    json: feed.json1()
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    if (!isCacheFresh()) {
      const content = await generateRssContent()
      if (content) {
        rssCache = {
          ...content,
          updatedAt: Date.now()
        }
      }
    }

    if (!rssCache.xml) {
      return res.status(503).json({ message: 'RSS feed not available' })
    }

    const format = req.query.format || 'rss'

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600')

    if (format === 'atom') {
      res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8')
      return res.status(200).send(rssCache.atomXml)
    }

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      return res.status(200).send(rssCache.json)
    }

    // Default: RSS 2.0
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
    return res.status(200).send(rssCache.xml)
  } catch (error) {
    console.error('[RSS API] Error generating feed:', error)
    return res.status(500).json({ message: 'Failed to generate RSS feed' })
  }
}
