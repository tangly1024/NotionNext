import LayoutBase from './LayoutBase'
import BLOG from '@/blog.config'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'

export const LayoutTag = (props) => {
  const { tag } = props
  const slotTop = <div className='flex items-center  py-8'><div className='text-xl'><i className='mr-2 fas fa-tag'/>标签：</div>{tag}</div>

  return <LayoutBase {...props} slotTop={slotTop}>
        {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
   </LayoutBase>
}
