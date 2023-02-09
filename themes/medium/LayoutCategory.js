import LayoutBase from './LayoutBase'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import BLOG from '@/blog.config'

export const LayoutCategory = props => {
  const { category } = props
  const slotTop = <div className='flex items-center  py-8'><div className='text-xl'><i className='mr-2 fas fa-th' />分类：</div>{category}</div>

  return <LayoutBase {...props} slotTop={slotTop}>
        {BLOG.POST_LIST_STYLE === 'page' ? <BlogPostListPage {...props} /> : <BlogPostListScroll {...props} />}
    </LayoutBase>
}
