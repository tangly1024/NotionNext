import BLOG from '@/blog.config'
import BlogCard from './BlogCard'
import BlogPostListEmpty from './BlogListEmpty'
import PaginationSimple from './PaginationSimple'

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogListPage = ({ page = 1, posts = [], postCount }) => {
  const totalPage = Math.ceil(postCount / BLOG.postsPerPage)
  const showNext = page < totalPage
  if (!posts || posts.length === 0) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id="container">
        {/* 文章列表 */}
        <div style={{ columnCount: 3 }}>
          {posts.map(post => (
            <div key={post.id} className='justify-center flex' style={{ breakInside: 'avoid' }}>
              <BlogCard key={post.id} post={post} />
            </div>
          ))}
        </div>
        <PaginationSimple page={page} showNext={showNext} />
      </div>
    )
  }
}

export default BlogListPage
