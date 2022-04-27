
import { BlogList } from './components/BlogList'
import LayoutBase from './LayoutBase'

export const LayoutIndex = props => {
  return (
    <LayoutBase {...props}>
      <BlogList {...props} />
    </LayoutBase>
  )
}
