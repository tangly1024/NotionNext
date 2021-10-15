import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import BLOG from '@/blog.config'

import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import throttle from 'lodash.throttle'

/**
 * 获取指定页码的文章
 * @param page 第几页
 * @param totalPosts 所有文章
 * @param postsPerPage 每页文章数量
 * @returns {*}
 */
const getPostByPage = function (page, totalPosts, postsPerPage) {
  return totalPosts.slice(
    postsPerPage * (page - 1),
    postsPerPage * page
  )
}

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScrollPagination = ({ posts = [], tags, targetRef }) => {
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
  const [page, updatePage] = useState(1)
  const [postsToShow, updatePostToShow] = useState(getPostByPage(page, filteredBlogPosts, BLOG.postsPerPage))

  let showNext = false
  if (filteredBlogPosts) {
    const totalPosts = filteredBlogPosts.length
    showNext = page * BLOG.postsPerPage < totalPosts
  }
  const [loading, updateLoading] = useState(false)
  const handleGetMore = function () {
    if (!showNext) {
      // 完了
      return
    }
    if (loading) {
      // 加载中
      return
    }
    updateLoading(true)
    updatePage(page + 1)
    updatePostToShow(postsToShow.concat(getPostByPage(page + 1, filteredBlogPosts, BLOG.postsPerPage)))
    updateLoading(false)
  }

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY + window.outerHeight
    const clientHeight = targetRef ? (targetRef.current.clientHeight) : 0
    if (scrollS > clientHeight + 10) {
      handleGetMore()
    }
  }, 500))

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  return <main id='post-list-wrapper' className='pt-16 md:pt-28 px-2 md:px-20'>
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

      <div className='flex'>
        {showNext
          ? (<div className='w-full my-4 py-4 bg-gray-200 text-center cursor-pointer' onClick={ handleGetMore}> 加载更多 </div>)
          : (
          <div className='w-full my-4 py-4 bg-gray-200 text-center' > 加载完了😰 </div>
            )}

      </div>
    </div>
  </main>
}

export default BlogPostListScrollPagination
