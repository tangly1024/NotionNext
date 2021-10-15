import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import BLOG from '@/blog.config'

import { useRouter } from 'next/router'

/**
 * 文章列表分页表格
 * @param page 当前页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostList = ({ page = 1, posts = [], tags }) => {
  if (!posts) {
    return <div>
      <div className='grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'>
          <p className='text-gray-500 dark:text-gray-300'>No posts found.</p>
      </div>
    </div>
  }
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

  return <main id='post-list-wrapper' className='pt-16 md:pt-28 px-2 md:px-20'>
    {(!page || page === 1) && (<div className='py-5' />)}

    {(page && page !== 1) && (
      <div className='pb-5'>
        <div className='dark:text-gray-200 flex justify-between py-1'>
          {page && page !== 1 && (<span>页 {page} / {totalPages}</span>)}
        </div>
      </div>
    )}

    <div className=''>
      {/* 文章列表 */}
      <div className='grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'>
        {!postsToShow.length && (
          <p className='text-gray-500 dark:text-gray-300'>No posts found.</p>
        )}
        {postsToShow.map(post => (
          <BlogPost key={post.id} post={post} tags={tags} />
        ))}
      </div>

      <Pagination page={page} showNext={showNext} />
    </div>
  </main>
}

export default BlogPostList
