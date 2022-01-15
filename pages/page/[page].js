import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import { LayoutPage } from '@/themes'
import Custom404 from '@/pages/404'

const Page = (props) => {
  if (!props?.meta) {
    return <Custom404 />
  }
  return <LayoutPage {...props} />
}

export async function getStaticPaths () {
  const from = 'page-paths'
  const { postCount } = await getGlobalNotionData({ from })
  const totalPages = Math.ceil(postCount / BLOG.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({ params: { page: '' + (i + 2) } })),
    fallback: true
  }
}

export async function getStaticProps ({ params: { page } }) {
  const from = `page-${page}`
  const {
    allPosts,
    latestPosts,
    categories,
    tags,
    postCount
  } = await getGlobalNotionData({ from })
  const meta = {
    title: `${page} | Page | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }
  // 处理分页
  const postsToShow = allPosts.slice(
    BLOG.postsPerPage * (page - 1),
    BLOG.postsPerPage * page
  )

  for (const i in postsToShow) {
    const post = postsToShow[i]
    const blockMap = await getPostBlocks(post.id, 'slug', BLOG.home.previewLines)
    if (blockMap) {
      post.blockMap = blockMap
    }
  }

  return {
    props: {
      page,
      posts: postsToShow,
      postCount,
      latestPosts,
      tags,
      categories,
      meta
    },
    revalidate: 1
  }
}

export default Page
