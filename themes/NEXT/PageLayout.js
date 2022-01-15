import BaseLayout from './BaseLayout'
import LatestPostsGroup from './components/LatestPostsGroup'
import BlogPostListPage from './components/BlogPostListPage'
import _NEXT from './_NEXT'

const PageLayout = ({ page, posts, tags, meta, categories, postCount, latestPosts }) => {
  return (
    <BaseLayout
      meta={meta}
      tags={tags}
      sideBarSlot={<LatestPostsGroup posts={latestPosts} />}
      rightAreaSlot={_NEXT.RIGHT_LATEST_POSTS && <LatestPostsGroup posts={latestPosts} />}
      postCount={postCount}
      categories={categories}
    >
      <BlogPostListPage page={page} posts={posts} postCount={postCount} />
    </BaseLayout>
  )
}

export default PageLayout
