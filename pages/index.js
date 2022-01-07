import BLOG from '@/blog.config'
import BaseLayout from '@/layouts/BaseLayout'
import BlogPostListScroll from '@/components/BlogPostListScroll'
import { getGlobalNotionData } from '@/lib/notion/getNotionData'
import Header from '@/components/Header'
import BlogPostListPage from '@/components/BlogPostListPage'
import LatestPostsGroup from '@/components/LatestPostsGroup'

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
    postsToShow = Object.create(allPosts)
  } else {
    postsToShow = allPosts.slice(
      BLOG.postsPerPage * (page - 1),
      BLOG.postsPerPage * page
    )
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
      rightAreaSlot={BLOG.widget?.showLatestPost && <LatestPostsGroup posts={latestPosts} />}
      postCount={postCount}
      categories={categories}
    >
      {BLOG.postListStyle !== 'page'
        ? (<BlogPostListScroll posts={posts} tags={tags} />)
        : (<BlogPostListPage posts={posts} tags={tags} postCount={postCount} />)
      }

    </BaseLayout>
  )
}

export default Index
