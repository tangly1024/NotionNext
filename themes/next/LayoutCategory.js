import LayoutBase from './LayoutBase'
import StickyBar from './components/StickyBar'
import CategoryList from './components/CategoryList'
import BlogPostListScroll from './components/BlogPostListScroll'

export const LayoutCategory = (props) => {
  const { tags, posts, category, categories } = props
  return <LayoutBase currentCategory={category} {...props}>
    <StickyBar>
      <CategoryList currentCategory={category} categories={categories} />
    </StickyBar>
    <div className='md:mt-8'>
      <BlogPostListScroll posts={posts} tags={tags} currentCategory={category}/>
    </div>
  </LayoutBase>
}
