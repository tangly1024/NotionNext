import BlogPostCard from './BlogPostCard'
import PaginationNumber from './PaginationNumber'
import BLOG from '@/blog.config'
import BlogPostListEmpty from './BlogPostListEmpty'

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
                    {/* 文章列表 */}
                    <div className="2xl:grid 2xl:grid-cols-2 grid-cols-1 gap-5">
                        {posts?.map(post => (
                            <BlogPostCard index={posts.indexOf(post)} key={post.id} post={post} siteInfo={siteInfo} />
                        ))}
                    </div>

                    {showPagination && <PaginationNumber page={page} totalPage={totalPage} />}
            </div>
    )
  }
}

export default BlogPostListPage
