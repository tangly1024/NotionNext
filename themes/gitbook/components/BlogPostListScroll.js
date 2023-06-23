import BLOG from '@/blog.config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import throttle from 'lodash.throttle'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScroll = ({ posts = [], currentSearch }) => {
  const postsPerPage = BLOG.POSTS_PER_PAGE
  const [page, updatePage] = useState(1)
  let filteredPosts = Object.assign(posts)
  const router = useRouter()
  const searchKey = getSearchKey(router)
  if (searchKey) {
    filteredPosts = posts.filter(post => {
      const tagContent = post.tags ? post.tags.join(' ') : ''
      const searchContent = post.title + post.summary + tagContent
      return searchContent.toLowerCase().includes(searchKey.toLowerCase())
    })
  }
  const postsToShow = getPostByPage(page, filteredPosts, postsPerPage)

  let hasMore = false
  if (filteredPosts) {
    const totalCount = filteredPosts.length
    hasMore = page * postsPerPage < totalCount
  }

  const handleGetMore = () => {
    if (!hasMore) return
    updatePage(page + 1)
  }

  // 监听滚动自动分页加载
  const scrollTrigger = useCallback(throttle(() => {
    const scrollS = window.scrollY + window.outerHeight
    const clientHeight = targetRef ? (targetRef.current ? (targetRef.current.clientHeight) : 0) : 0
    if (scrollS > clientHeight + 100) {
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

  const targetRef = useRef(null)

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  } else {
    return <div id='container' ref={targetRef} className='w-full'>

      {/* 文章列表 */}
      <div className='space-y-1 lg:space-y-4'>
        {postsToShow?.map(post => (
          <BlogPostCard key={post.id} post={post} showSummary={true} />
        ))}
      </div>

    </div>
  }
}

/**
 * 获取从第1页到指定页码的文章
 * @param page 第几页
 * @param totalPosts 所有文章
 * @param postsPerPage 每页文章数量
 * @returns {*}
 */
const getPostByPage = function (page, totalPosts, postsPerPage) {
  return totalPosts.slice(
    0,
    postsPerPage * page
  )
}

function getSearchKey(router) {
  if (router.query && router.query.s) {
    return router.query.s
  }
  return null
}

export default BlogPostListScroll
