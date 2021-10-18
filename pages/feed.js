import { getAllPosts } from '@/lib/notion'
import { generateRss } from '@/lib/rss'

export async function getServerSideProps ({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  let posts = await getAllPosts({ from: 'feed' })
  posts = posts
    .filter(post => post.status[0] === 'Published' && post.type[0] === 'Post')
    .slice(0, 10)
  const xmlFeed = generateRss(posts)
  res.write(xmlFeed)
  res.end()
  return {
    props: {}
  }
}

const feed = () => null
export default feed
