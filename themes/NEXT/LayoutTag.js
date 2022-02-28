import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import TagList from './components/TagList'
import BlogPostListScroll from './components/BlogPostListScroll'

export const LayoutTag = (props) => {
  const { tags, posts, tag } = props
  const { locale } = useGlobal()

  const meta = {
    title: `${tag} | ${locale.COMMON.TAGS} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }

  return <LayoutBase meta={meta} currentTag={tag} {...props}>
    <StickyBar>
      <TagList tags={tags} currentTag={tag}/>
    </StickyBar>
    <div className='md:mt-8'>
      <BlogPostListScroll posts={posts} tags={tags} currentTag={tag}/>
    </div>
  </LayoutBase>
}
