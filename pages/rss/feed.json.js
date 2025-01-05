import { getGlobalData } from '@/lib/db/getSiteData'
import { generateRssData, rssCacheHead } from '@/lib/rss'

export async function getServerSideProps(ctx) {
  const from = 'rss-feed-json-props'
  const { locale } = ctx.req
  const globalData = await getGlobalData({ from, locale })
  const rssData = await generateRssData(globalData)
  ctx.res.setHeader('Cache-Control', rssCacheHead)
  ctx.res.setHeader('Content-Type', 'application/json')
  ctx.res.write(rssData.json1()) // 直接返回内容
  ctx.res.end()
  return { props: {} }
}

export default function rssFeedJson() {}