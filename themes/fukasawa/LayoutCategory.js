import BlogListPage from './components/BlogListPage'
import LayoutBase from './LayoutBase'

export const LayoutCategory = props => {
  return <LayoutBase {...props}>
    <BlogListPage page={props.page} posts={props.posts} postCount={props.postCount} />
  </LayoutBase>
}
