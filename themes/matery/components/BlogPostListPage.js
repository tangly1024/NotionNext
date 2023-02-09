import BlogPostCard from './BlogPostCard'
import BLOG from '@/blog.config'
import BlogPostListEmpty from './BlogPostListEmpty'
import PaginationSimple from './PaginationSimple'

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListPage = ({ page = 1, posts = [], postCount, siteInfo }) => {
  const totalPage = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
  const showPagination = postCount >= BLOG.POSTS_PER_PAGE
  if (!posts || posts.length === 0 || page > totalPage) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id="container" className='w-full'>
        <div className='pt-6'></div>
        {/* 文章列表 */}
        <div className="px-4 pt-4 xl:columns-3 md:columns-2 pb-24" >
          {posts.map(post => (
            <BlogPostCard key={post.id} post={post} siteInfo={siteInfo} />
          ))}
        </div>
        {showPagination && <PaginationSimple page={page} totalPage={totalPage} />}
      </div>
    )
  }
}

export default BlogPostListPage
