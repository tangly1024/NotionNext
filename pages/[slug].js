import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { LayoutSlug } from '@/themes'
import Custom404 from '@/pages/404'

/**
 * 根据notion的slug访问页面，针对类型为Page的页面
 * @param {*} props
 * @returns
 */
const Slug = (props) => {
  if (!props.post) {
    return <Custom404 {...props} />
  }
  return <LayoutSlug {...props} showArticleInfo={false}/>
}

export async function getStaticPaths () {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = 'slug-paths'
  const { allPosts } = await getGlobalNotionData({ from, pageType: ['Page'] })
  return {
    paths: allPosts.map(row => ({ params: { slug: row.slug } })),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const from = `slug-props-${slug}`
  const { allPosts, categories, tags, postCount, latestPosts, customNav } = await getGlobalNotionData({ from, pageType: ['Page'] })
  const post = allPosts.find(p => p.slug === slug)
  if (!post) {
    return { props: {}, revalidate: 1 }
  }

  post.blockMap = await getPostBlocks(post.id, 'slug')

  return {
    props: {
      post,
      tags,
      categories,
      postCount,
      latestPosts,
      customNav
    },
    revalidate: 1
  }
}

export default Slug
