import BlogPostCard from '@/components/BlogPostCard'
import Pagination from '@/components/Pagination'
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
  const totalPages = Math.ceil(filteredBlogPosts.length / BLOG.postsPerPage)
  const postsToShow = filteredBlogPosts.slice(
    BLOG.postsPerPage * (page - 1),
    BLOG.postsPerPage * page
  )
  let showNext = false
  if (filteredBlogPosts) {
    const totalPosts = filteredBlogPosts.length
    showNext = page * BLOG.postsPerPage < totalPosts
  }

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty />
  } else {
    return <div id='post-list-wrapper' className='pt-16 md:pt-28 px-2 md:px-20'>
      {(!page || page === 1) && (<div className='py-5' />)}

      {(page && page !== 1) && (
        <div className='pb-5'>
          <div className='dark:text-gray-200 flex justify-between py-1'>
            {page && page !== 1 && (<span>页 {page} / {totalPages}</span>)}
          </div>
        </div>
      )}

      <div>
        {/* 文章列表 */}
        <div className='flex flex-wrap'>
          {postsToShow.map(post => (
            <BlogPostCard key={post.id} post={post} tags={tags} />
          ))}
        </div>

        <Pagination page={page} showNext={showNext} />
      </div>
    </div>
  }
}

export default BlogPostListPage
