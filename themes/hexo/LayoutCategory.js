import BlogPostListScroll from './components/BlogPostListScroll'
import LayoutBase from './LayoutBase'

export const LayoutCategory = props => {
  const { tags, posts, category } = props
  return <LayoutBase {...props}>
      <BlogPostListScroll posts={posts} tags={tags} currentCategory={category}/>
  </LayoutBase>
}
