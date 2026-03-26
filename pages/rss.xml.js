import BLOG from '@/blog.config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { buildRssXml } from '@/lib/utils/rss'

export const getServerSideProps = async ctx => {
  let rssXml = ''

  try {
    const props = await fetchGlobalAllData({ from: 'rss.xml' })
    rssXml = await buildRssXml(props)
  } catch (error) {
    console.error('[RSS] Failed to build rss.xml, serving fallback feed.', error)
    rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${BLOG.TITLE || 'RSS Feed'}]]></title>
    <link>${BLOG.LINK || ''}</link>
    <description><![CDATA[${BLOG.DESCRIPTION || ''}]]></description>
  </channel>
</rss>`
  }

  ctx.res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=59'
  )
  ctx.res.write(rssXml)
  ctx.res.end()

  return {
    props: {}
  }
}

export default function Rss() {
  return null
}
