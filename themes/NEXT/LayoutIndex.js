import LayoutBase from './LayoutBase'
import Header from './components/Header'
import LatestPostsGroup from './components/LatestPostsGroup'
import Card from './components/Card'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import { CONFIG_NEXT } from './index'

export const LayoutIndex = ({ posts, tags, meta, categories, postCount, latestPosts }) => {
  return <LayoutBase
    headerSlot={CONFIG_NEXT.HOME_BANNER && <Header />}
    meta={meta}
    tags={tags}
    sideBarSlot={<LatestPostsGroup posts={latestPosts} />}
    rightAreaSlot={
      CONFIG_NEXT.RIGHT_LATEST_POSTS && <Card><LatestPostsGroup posts={latestPosts} /></Card>
    }
    postCount={postCount}
    categories={categories}
  >
    {CONFIG_NEXT.POSTS_LIST_TYPE !== 'page'
      ? (
        <BlogPostListScroll posts={posts} tags={tags} showSummary={true} />
        )
      : (
        <BlogPostListPage posts={posts} tags={tags} postCount={postCount} />
        )}
  </LayoutBase>
}
