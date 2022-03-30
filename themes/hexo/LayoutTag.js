import BlogPostListScroll from './components/BlogPostListScroll'
import LayoutBase from './LayoutBase'

export const LayoutTag = (props) => {
  const { tags, posts, tag } = props

  return <LayoutBase {...props}>
      <BlogPostListScroll posts={posts} tags={tags} currentTag={tag}/>
   </LayoutBase>
}
