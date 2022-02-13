import LayoutBase from './LayoutBase'
import BlogPostListScroll from './components/BlogPostListScroll'

export const LayoutCategory = (props) => {
  return <LayoutBase {...props}>
    <BlogPostListScroll {...props} />
  </LayoutBase>
}
