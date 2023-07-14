
import BLOG from '@/blog.config'
import Announcement from './components/Announcement'
import { BlogListPage } from './components/BlogListPage'
import { BlogListScroll } from './components/BlogListScroll'
import LayoutBase from './LayoutBase'

export const LayoutIndex = props => {
  return (
    <LayoutBase {...props}>
       <Announcement {...props} />
       {BLOG.POST_LIST_STYLE === 'page' ? <BlogListPage {...props} /> : <BlogListScroll {...props} />}
    </LayoutBase>
  )
}

export default LayoutIndex
