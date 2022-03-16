import LayoutBase from './LayoutBase'
import BlogPostListPage from './components/BlogPostListPage'

export const LayoutPage = (props) => {
  return <LayoutBase {...props}>
      <BlogPostListPage {...props} />
  </LayoutBase>
}
