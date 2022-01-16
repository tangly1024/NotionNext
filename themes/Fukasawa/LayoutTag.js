import BlogListPage from './components/BlogListPage'
import LayoutBase from './LayoutBase'

export const LayoutTag = (props) => {
  return <LayoutBase {...props}>
    <BlogListPage {...props} />
  </LayoutBase>
}
