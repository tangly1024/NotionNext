import BlogPostCard from '@/components/BlogPostCard'
import BLOG from '@/blog.config'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import throttle from 'lodash.throttle'
import BlogPostListEmpty from '@/components/BlogPostListEmpty'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @param targetRef 指向父容器，用于计算下拉滚动的高度
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScroll = ({ posts = [], tags, currentSearch, currentCategory, currentTag }) => {
  const postsPerPage = BLOG.postsPerPage
  const [page, updatePage] = useState(1)
  const postsToShow = getPostByPage(page, posts, postsPerPage)

  let hasMore = false
  if (posts) {
    const totalCount = posts.length
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

  const targetRef = useRef(null)

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch}/>
  } else {
    return <div id='post-list-wrapper' className='mt-20 mx-2 pt-10 md:mx-20' ref={targetRef}>

      {currentCategory && (
        <div className='w-full p-1 bg-gray-100 dark:bg-gray-700'>
          <div className='cursor-pointer py-1.5 mr-2 dark:text-gray-300 hover:underline'><i className='fa fa-folder-open-o mr-1'/>{currentCategory}</div>
        </div>
      )}

      {currentSearch && (
        <div className='w-full p-1 bg-gray-100 dark:bg-gray-700'>
          <div className='cursor-pointer py-1.5 mr-2 dark:text-gray-300 hover:underline'><i className='fa fa-search mr-1'/>关键字：{currentSearch}</div>
        </div>
      )}

      {currentTag && (
        <div className='w-full p-1 bg-gray-100 dark:bg-gray-700 flex'>
          <div className='cursor-pointer py-1.5 mr-2 hover:underline bg-gray-200 dark:bg-gray-400 px-2 rounded'><i className='fa fa-tag mr-1 '/> {currentTag}</div>
        </div>
      )}

      {/* 文章列表 */}
        <div className='grid 3xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5'>
          {postsToShow.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        <div className='flex'>
          <div onClick={() => { handleGetMore() }}
               className='w-full my-4 py-4 bg-gray-300 text-center cursor-pointer dark:bg-gray-700 dark:text-gray-200'
               > {hasMore ? '继续加载' : '加载完了😰'} </div>
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
export default BlogPostListScroll
