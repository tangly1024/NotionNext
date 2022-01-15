import BaseLayout from './BaseLayout'
import Header from './components/Header'
import LatestPostsGroup from './components/LatestPostsGroup'
import Card from './components/Card'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import _NEXT from './_NEXT'

const IndexLayout = ({ posts, tags, meta, categories, postCount, latestPosts }) => {
  return <BaseLayout
    headerSlot={_NEXT.HOME_BANNER && <Header />}
    meta={meta}
    tags={tags}
    sideBarSlot={<LatestPostsGroup posts={latestPosts} />}
    rightAreaSlot={
      _NEXT.RIGHT_LATEST_POSTS && <Card><LatestPostsGroup posts={latestPosts} /></Card>
    }
    postCount={postCount}
    categories={categories}
  >
    {_NEXT.POSTS_LIST_TYPE !== 'page'
      ? (
        <BlogPostListScroll posts={posts} tags={tags} showSummary={true} />
        )
      : (
        <BlogPostListPage posts={posts} tags={tags} postCount={postCount} />
        )}
  </BaseLayout>
}

export default IndexLayout
