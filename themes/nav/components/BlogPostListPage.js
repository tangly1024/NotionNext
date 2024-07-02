import { siteConfig } from '@/lib/config'
import BlogPostCard from './BlogPostCard'
import NavPostListEmpty from './NavPostListEmpty'
import PaginationSimple from './PaginationSimple'

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListPage = ({ page = 1, posts = [], postCount }) => {
  const totalPage = Math.ceil(
    postCount / parseInt(siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG))
  )

  if (!posts || posts.length === 0) {
    return <NavPostListEmpty />
  }

  return (
    <div className='w-full justify-center'>
      <div id='posts-wrapper'>
        {/* 文章列表 */}
        {posts?.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      <PaginationSimple page={page} totalPage={totalPage} />
    </div>
  )
}

export default BlogPostListPage
