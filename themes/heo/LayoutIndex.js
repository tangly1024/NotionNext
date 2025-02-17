import CategoryBar from '@/themes/heo/components/CategoryBar'
import { siteConfig } from '@/lib/config'
import BlogPostListPage from '@/themes/heo/components/BlogPostListPage'
import dynamic from 'next/dynamic'

const BlogPostListScroll = dynamic(
  () => import('./components/BlogPostListScroll')
)

/**
 * 首页
 * 是一个博客列表，嵌入一个Hero大图
 * @param {*} props
 * @returns
 */
export const LayoutIndex = props => {
  return (
    <div id='post-outer-wrapper' className='px-5 md:px-0'>
      {/* 文章分类条 */}
      <CategoryBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}
