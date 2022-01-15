import { useGlobal } from '@/lib/global'
import BLOG from '@/blog.config'
import LayoutBase from '@/themes/NEXT/LayoutBase'
import StickyBar from './components/StickyBar'
import CategoryList from './components/CategoryList'
import BlogPostListScroll from './components/BlogPostListScroll'

const Category = ({ tags, posts, category, categories, latestPosts, postCount }) => {
  const { locale } = useGlobal()
  const meta = {
    title: `${category} | ${locale.COMMON.CATEGORY} | ${BLOG.title}`,
    description: BLOG.description,
    type: 'website'
  }
  return <LayoutBase meta={meta} tags={tags} currentCategory={category} postCount={postCount} latestPosts={latestPosts} categories={categories}>
    <StickyBar>
      <CategoryList currentCategory={category} categories={categories} />
    </StickyBar>
    <div className='md:mt-8'>
      <BlogPostListScroll posts={posts} tags={tags} currentCategory={category}/>
    </div>
  </LayoutBase>
}

export default Category
