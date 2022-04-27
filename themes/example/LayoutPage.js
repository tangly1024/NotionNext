import { BlogList } from './components/BlogList'
import LayoutBase from './LayoutBase'

export const LayoutPage = props => {
  return (
    <LayoutBase {...props}>
        <BlogList {...props} />
    </LayoutBase>
  )
}
