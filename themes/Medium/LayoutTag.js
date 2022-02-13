import LayoutBase from './LayoutBase'
import BlogPostListScroll from './components/BlogPostListScroll'

export const LayoutTag = (props) => {
  return <LayoutBase>
    <BlogPostListScroll {...props} />
   </LayoutBase>
}
