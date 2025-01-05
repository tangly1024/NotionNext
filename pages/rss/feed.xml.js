import { getGlobalData } from '@/lib/db/getSiteData'
import { generateRssData, rssCacheHead } from '@/lib/rss'

export async function getServerSideProps(ctx) {
  const from = 'rss-feed-xml-props'
  const { locale } = ctx.req
  const globalData = await getGlobalData({ from, locale })
  const rssData = await generateRssData(globalData)
  ctx.res.setHeader('Cache-Control', rssCacheHead)
  ctx.res.setHeader('Content-Type', 'text/xml')
  ctx.res.write(rssData.rss2()) // 直接返回内容
  ctx.res.end()
  return { props: {} }
}

export default function rssFeedXML() {}