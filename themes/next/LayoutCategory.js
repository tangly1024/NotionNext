import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import CategoryList from './components/CategoryList'
import BlogPostListScroll from './components/BlogPostListScroll'
import BlogPostListPage from './components/BlogPostListPage'
import BLOG from '@/blog.config'

export const LayoutCategory = (props) => {
  const { category, categoryOptions } = props
  return <LayoutBase currentCategory={category} {...props}>
    <StickyBar>
      <CategoryList currentCategory={category} categoryOptions={categoryOptions} />
    </StickyBar>
    <div className='md:mt-8'>
      {BLOG.POST_LIST_STYLE !== 'page'
        ? <BlogPostListScroll {...props} showSummary={true} />
        : <BlogPostListPage {...props} />
    }
    </div>
  </LayoutBase>
}
