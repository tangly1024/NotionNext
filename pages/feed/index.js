import { generateRss } from '@/lib/rss'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'

export async function getServerSideProps ({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  // 获取最新文章
  const globalNotionData = await getGlobalNotionData({ from: 'rss' })
  const xmlFeed = await generateRss(globalNotionData?.latestPosts || [])
  res.write(xmlFeed)
  res.end()
  return {
    props: {}
  }
}

const feed = () => null
export default feed
