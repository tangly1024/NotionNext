import BlogPostCard from '@/components/BlogPostCard'
import PaginationNumber from './PaginationNumber'
import BLOG from '@/blog.config'

import { useRouter } from 'next/router'
import BlogPostListEmpty from '@/components/BlogPostListEmpty'

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListPage = ({ page = 1, posts = [], tags }) => {
  let filteredBlogPosts = posts

  // 处理查询过滤 支持标签、关键词过滤
  let currentSearch = ''
  const router = useRouter()
  if (router.query && router.query.s) {
    currentSearch = router.query.s
    filteredBlogPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent + post.slug
      return searchContent.toLowerCase().includes(currentSearch.toLowerCase())
    })
  }

  // 处理分页
  const totalPage = Math.ceil(filteredBlogPosts.length / BLOG.postsPerPage)
  const postsToShow = filteredBlogPosts.slice(
    BLOG.postsPerPage * (page - 1),
    BLOG.postsPerPage * page
  )

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id="container" className='mt-10'>
        {/* 文章列表 */}
        <div className="flex flex-wrap space-y-8 mx-5 md:mx-0">
          {postsToShow.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        <PaginationNumber page={page} totalPage={totalPage} />
      </div>
    )
  }
}

export default BlogPostListPage
