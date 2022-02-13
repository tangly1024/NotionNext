import LayoutBase from './LayoutBase'
import BlogPostListPage from './components/BlogPostListPage'

export const LayoutTag = (props) => {
  return <LayoutBase>
    <BlogPostListPage {...props} />
   </LayoutBase>
}
