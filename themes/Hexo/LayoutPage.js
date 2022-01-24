import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'

export const LayoutPage = (props) => {
  const { page, posts, postCount } = props
  return <LayoutBase {...props}>
      <BlogPostListPage page={page} posts={posts} postCount={postCount} />
  </LayoutBase>
}
