import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'

export const LayoutIndex = (props) => {
  return <LayoutBase {...props}>
      <BlogPostListPage {...props}/>
  </LayoutBase>
}
