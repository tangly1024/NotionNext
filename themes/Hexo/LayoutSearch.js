
import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'

export const LayoutSearch = (props) => {
  return <LayoutBase {...props}>
    <BlogPostListPage {...props}/>
  </LayoutBase>
}
