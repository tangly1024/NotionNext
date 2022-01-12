import BLOG from '@/blog.config'
import BlogPostListPage from '@/components/BlogPostListPage'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import Header from '@/components/Header'
import LatestPostsGroup from '@/components/LatestPostsGroup'
import BaseLayout from '@/layouts/BaseLayout'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'

export async function getStaticProps () {
  const from = 'index'
  const { allPosts, latestPosts, categories, tags, postCount } = await getGlobalNotionData({ from })
  const meta = {
    title: `${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }

  // 处理分页
  const page = 1
  let postsToShow = []
  if (BLOG.postListStyle !== 'page') {
    postsToShow = Array.from(allPosts)
  } else {
    postsToShow = allPosts.slice(
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
  }

  return {
    props: {
      posts: postsToShow,
      latestPosts,
      postCount,
      tags,
      categories,
      meta
    },
    revalidate: 1
  }
}

const Index = ({ posts, tags, meta, categories, postCount, latestPosts }) => {
  return (
    <BaseLayout
      headerSlot={BLOG.home.showHomeBanner && <Header />}
      meta={meta}
      tags={tags}
      sideBarSlot={<LatestPostsGroup posts={latestPosts} />}
      rightAreaSlot={
        BLOG.widget?.showLatestPost && <LatestPostsGroup posts={latestPosts} />
      }
      postCount={postCount}
      categories={categories}
    >
      {BLOG.postListStyle !== 'page'
        ? (
        <BlogPostListScroll posts={posts} tags={tags} showSummary={true} />
          )
        : (
        <BlogPostListPage posts={posts} tags={tags} postCount={postCount} />
          )}
    </BaseLayout>
  )
}

export default Index
