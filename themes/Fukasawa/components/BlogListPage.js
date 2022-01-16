import BlogCard from './BlogCard'
import PaginationNumber from './PaginationNumber'
import BLOG from '@/blog.config'
import BlogPostListEmpty from './BlogListEmpty'

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

  if (!posts || posts.length === 0) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id="container">
        {/* 文章列表 */}
        <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 ">
          {posts.map(post => (
            <div key={post.id} className='justify-center flex'>
              <BlogCard key={post.id} post={post} />
            </div>
          ))}
        </div>
        <PaginationNumber page={page} totalPage={totalPage} />
      </div>
    )
  }
}

export default BlogListPage
