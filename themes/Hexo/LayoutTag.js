import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import BlogPostListScroll from './components/BlogPostListScroll'
import LayoutBase from './LayoutBase'

export const LayoutTag = (props) => {
  const { tags, posts, tag } = props
  const { locale } = useGlobal()

  const meta = {
    title: `${tag} | ${locale.COMMON.TAGS} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }

  return <LayoutBase {...props} meta={meta}>
      <BlogPostListScroll posts={posts} tags={tags} currentTag={tag}/>
   </LayoutBase>
}
