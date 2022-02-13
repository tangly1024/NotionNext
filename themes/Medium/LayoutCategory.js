import LayoutBase from './LayoutBase'
import BlogPostListPage from './components/BlogPostListPage'

export const LayoutCategory = (props) => {
  return <LayoutBase {...props}>
    <BlogPostListPage {...props} />
  </LayoutBase>
}
