import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import BlogPostListScroll from './components/BlogPostListScroll'
import LayoutBase from './LayoutBase'

export const LayoutCategory = (props) => {
  const { tags, posts, category } = props
  const { locale } = useGlobal()
  const meta = {
    title: `${category} | ${locale.COMMON.CATEGORY} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }
  return <LayoutBase {...props} meta={meta}>
      <BlogPostListScroll posts={posts} tags={tags} currentCategory={category}/>
  </LayoutBase>
}
