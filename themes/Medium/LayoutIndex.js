import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'

export const LayoutIndex = (props) => {
  // const { posts, tags, meta, categories, postCount, latestPosts } = props
  return <LayoutBase {...props}>
      <BlogPostListPage {...props}/>
  </LayoutBase>
}
