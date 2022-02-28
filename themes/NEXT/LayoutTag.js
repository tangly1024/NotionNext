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

  // 将当前选中的标签置顶🔝
  const currentTag = tags?.find(r => r?.name === tag)
  const newTags = currentTag ? [currentTag].concat(tags.filter(r => r?.name !== tag)) : tags.filter(r => r?.name !== tag)

  return <LayoutBase meta={meta} currentTag={tag} {...props}>
    <StickyBar>
      <TagList tags={newTags} currentTag={tag}/>
    </StickyBar>
    <div className='md:mt-8'>
      <BlogPostListScroll posts={posts} tags={tags} currentTag={tag}/>
    </div>
  </LayoutBase>
}
