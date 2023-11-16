import BlogPostCard from './BlogPostCard'
import { siteConfig } from '@/lib/config'
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
  const totalPage = Math.ceil(postCount / parseInt(siteConfig('POSTS_PER_PAGE')))
  const showPagination = postCount >= parseInt(siteConfig('POSTS_PER_PAGE'))
  if (!posts || posts.length === 0 || page > totalPage) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div className='w-full'>
        <div className='pt-6'></div>
        {/* 文章列表 */}
        <div className="pt-4 flex flex-wrap pb-12" >
          {posts?.map(post => (
           <div key={post.id} className='xl:w-1/3 md:w-1/2 w-full p-4'> <BlogPostCard index={posts.indexOf(post)} post={post} siteInfo={siteInfo} /></div>
          ))}
        </div>
        {showPagination && <PaginationSimple page={page} totalPage={totalPage} />}
      </div>
    )
  }
}

export default BlogPostListPage
