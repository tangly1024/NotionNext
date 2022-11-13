import { BlogListPage } from './components/BlogListPage'
import LayoutBase from './LayoutBase'

export const LayoutPage = props => {
  return (
    <LayoutBase {...props}>
        <BlogListPage {...props} />
    </LayoutBase>
  )
}
