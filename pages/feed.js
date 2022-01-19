import { generateRss } from '@/lib/rss'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'

export async function getServerSideProps ({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  const globalNotionData = await getGlobalNotionData({ from: 'rss' })
  const xmlFeed = generateRss(globalNotionData?.allPosts?.slice(0, 10) || [])
  res.write(xmlFeed)
  res.end()
  return {
    props: {}
  }
}

const feed = () => null
export default feed
