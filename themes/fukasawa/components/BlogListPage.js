import BLOG from '@/blog.config'
import { useEffect, useState } from 'react'
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
  const totalPage = Math.ceil(postCount / BLOG.POSTS_PER_PAGE)
  const showNext = page < totalPage && posts.length === BLOG.POSTS_PER_PAGE && posts.length < postCount
  const [colCount, changeCol] = useState(1)

  function updateCol() {
    if (window.outerWidth > 1200) {
      changeCol(3)
    } else if (window.outerWidth > 900) {
      changeCol(2)
    } else {
      changeCol(1)
    }
  }

  useEffect(() => {
    updateCol()
    window.addEventListener('resize', updateCol)
    return () => {
      window.removeEventListener('resize', updateCol)
    }
  })

  if (!posts || posts.length === 0) {
    return <BlogPostListEmpty />
  } else {
    return (
      <div id="container">
        {/* 文章列表 */}
        <div style={{ columnCount: colCount }}>
          {posts?.map(post => (
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
