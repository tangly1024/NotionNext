import BlogPostListPage from './components/BlogPostListPage'
import LayoutBase from './LayoutBase'

export const LayoutPage = (props) => {
  return <LayoutBase {...props}>
      <BlogPostListPage {...props}/>
  </LayoutBase>
}

export default LayoutPage
