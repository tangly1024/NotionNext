import BLOG from '@/blog.config'
import BlogPostListPage from '@/components/BlogPostListPage'
import Header from '@/components/Header'
import LatestPostsGroup from '@/components/LatestPostsGroup'
import BaseLayout from '@/layouts/BaseLayout'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import Custom404 from '../404'

const Page = ({ page, posts, tags, meta, categories, postCount, latestPosts }) => {
  if (!meta || BLOG.postListStyle !== 'page') {
    return <Custom404/>
  }

  return (
    <BaseLayout
    headerSlot={BLOG.home.showHomeBanner && <Header />}
    meta={meta}
    tags={tags}
    sideBarSlot={<LatestPostsGroup posts={latestPosts} />}
    rightAreaSlot={BLOG.widget?.showLatestPost && <LatestPostsGroup posts={latestPosts} />}
    postCount={postCount}
    categories={categories}
  >
    <BlogPostListPage page={page} posts={posts} postCount={postCount} />
  </BaseLayout>
  )
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
  const { allPosts, latestPosts, categories, tags, postCount } = await getGlobalNotionData({ from })
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
    const blockMap = await getPostBlocks(post.id, 'slug', 12)
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
