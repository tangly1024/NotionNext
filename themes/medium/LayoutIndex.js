import BLOG from '@/blog.config'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import LayoutBase from './LayoutBase'

export const LayoutIndex = (props) => {
  return <LayoutBase {...props}>
    {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
  </LayoutBase>
}
