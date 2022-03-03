import LayoutBase from './LayoutBase'
import BlogListPage from './components/BlogListPage'

export const LayoutSearch = (props) => {
  return <LayoutBase {...props}>
        <BlogListPage {...props}/>
  </LayoutBase>
}
