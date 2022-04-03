import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import BlogPostListScroll from './components/BlogPostListScroll'
import LayoutBase from './LayoutBase'

export const LayoutTag = props => {
  const { tags, posts, tag } = props
  const { locale } = useGlobal()

  return (
    <LayoutBase {...props}>
      <BlogPostListScroll posts={posts} tags={tags} currentTag={tag} />
    </LayoutBase>
  )
}
