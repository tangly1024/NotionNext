import LayoutBase from './LayoutBase'
import LatestPostsGroup from './components/LatestPostsGroup'
import BlogPostListPage from './components/BlogPostListPage'
import CONFIG_NEXT from './config_next'

export const LayoutPage = (props) => {
  const { latestPosts } = props
  return (
    <LayoutBase
      sideBarSlot={<LatestPostsGroup posts={latestPosts} />}
      rightAreaSlot={CONFIG_NEXT.RIGHT_LATEST_POSTS && <LatestPostsGroup posts={latestPosts} />}
      {...props}
    >
      <BlogPostListPage {...props}/>
    </LayoutBase>
  )
}
