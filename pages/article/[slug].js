import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { LayoutSlug } from '@/themes'
import Custom404 from '@/pages/404'

/**
 * 根据notion的slug访问页面
 * @param {*} props
 * @returns
 */
const Slug = (props) => {
  if (!props.post) {
    return <Custom404 {...props} />
  }
  return <LayoutSlug {...props} />
}

export async function getStaticPaths () {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = 'slug-paths'
  const { allPosts } = await getGlobalNotionData({ from, includePage: true })
  return {
    paths: allPosts.map(row => ({ params: { slug: row.slug } })),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const from = `slug-props-${slug}`
  const { allPosts, categories, tags, postCount, latestPosts } =
    await getGlobalNotionData({ from, includePage: true })

  const post = allPosts.find(p => p.slug === slug)

  if (!post) {
    return { props: {}, revalidate: 1 }
  }

  post.blockMap = await getPostBlocks(post.id, 'slug')

  const posts = allPosts.filter(post => post?.type?.[0] === 'Post')
  const index = posts.indexOf(post)
  const prev = posts.slice(index - 1, index)[0] ?? posts.slice(-1)[0]
  const next = posts.slice(index + 1, index + 2)[0] ?? posts[0]

  const recommendPosts = getRecommendPost(post, allPosts)

  return {
    props: {
      post,
      tags,
      prev,
      next,
      recommendPosts,
      categories,
      postCount,
      latestPosts
    },
    revalidate: 1
  }
}

/**
 * 获取文章的关联推荐文章列表，目前根据标签关联性筛选
 * @param post
 * @param {*} allPosts
 * @param {*} count
 * @returns
 */
function getRecommendPost (post, allPosts, count = 5) {
  let filteredPosts = []
  for (const i in allPosts) {
    const p = allPosts[i]
    filteredPosts.push(Object.assign(p))
  }

  if (post.tags && post.tags.length) {
    const currentTag = post.tags[0]
    filteredPosts = filteredPosts.filter(
      p => p && p.slug !== post.slug && p.tags && p.tags?.includes(currentTag) && p.type === ['Post']
    )
  }

  // 筛选前5个
  if (filteredPosts.length > count) {
    filteredPosts = filteredPosts.slice(0, count)
  }
  return filteredPosts
}

export default Slug
