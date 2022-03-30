import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import TagList from './components/TagList'
import BlogPostListScroll from './components/BlogPostListScroll'

export const LayoutTag = (props) => {
  const { tags, posts, tag } = props

  return <LayoutBase currentTag={tag} {...props}>
    <StickyBar>
      <TagList tags={tags} currentTag={tag}/>
    </StickyBar>
    <div className='md:mt-8'>
      <BlogPostListScroll posts={posts} tags={tags} currentTag={tag}/>
    </div>
  </LayoutBase>
}
