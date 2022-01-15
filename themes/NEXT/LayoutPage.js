import LayoutBase from './LayoutBase'
import LatestPostsGroup from './components/LatestPostsGroup'
import BlogPostListPage from './components/BlogPostListPage'
import { CONFIG_NEXT } from './index'

const LayoutPage = ({ page, posts, tags, meta, categories, postCount, latestPosts }) => {
  return (
    <LayoutBase
      meta={meta}
      tags={tags}
      sideBarSlot={<LatestPostsGroup posts={latestPosts} />}
      rightAreaSlot={CONFIG_NEXT.RIGHT_LATEST_POSTS && <LatestPostsGroup posts={latestPosts} />}
      postCount={postCount}
      categories={categories}
    >
      <BlogPostListPage page={page} posts={posts} postCount={postCount} />
    </LayoutBase>
  )
}

export default LayoutPage
