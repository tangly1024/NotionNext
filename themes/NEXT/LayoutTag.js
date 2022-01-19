import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import TagList from './components/TagList'
import BlogPostListScroll from './components/BlogPostListScroll'

export const LayoutTag = ({ tags, posts, tag, categories, postCount, latestPosts }) => {
  const { locale } = useGlobal()

  const meta = {
    title: `${tag} | ${locale.COMMON.TAGS} | ${BLOG.TITLE}`,
    description: BLOG.DESCRIPTION,
    type: 'website'
  }

  // 将当前选中的标签置顶🔝
  if (!tags) tags = []
  const currentTag = tags?.find(r => r?.name === tag)
  const newTags = currentTag ? [currentTag].concat(tags.filter(r => r?.name !== tag)) : tags.filter(r => r?.name !== tag)

  return <LayoutBase meta={meta} tags={tags} currentTag={tag} categories={categories} postCount={postCount} latestPosts={latestPosts}>
    <StickyBar>
      <TagList tags={newTags} currentTag={tag}/>
    </StickyBar>
    <div className='md:mt-8'>
      <BlogPostListScroll posts={posts} tags={tags} currentTag={tag}/>
    </div>
  </LayoutBase>
}
