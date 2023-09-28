import BLOG from '@/blog.config'
import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import { useGlobal } from '@/lib/global'
import React, { useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import { getListByPage } from '@/lib/utils'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScroll = ({ posts = [], currentSearch, showSummary = CONFIG.POST_LIST_SUMMARY, siteInfo }) => {
  const postsPerPage = BLOG.POSTS_PER_PAGE
  const [page, updatePage] = useState(1)
  const postsToShow = getListByPage(posts, page, postsPerPage)

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
  const scrollTrigger = () => {
    requestAnimationFrame(() => {
      const scrollS = window.scrollY + window.outerHeight
      const clientHeight = targetRef ? (targetRef.current ? (targetRef.current.clientHeight) : 0) : 0
      if (scrollS > clientHeight + 100) {
        handleGetMore()
      }
    })
  }

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  })

  const targetRef = useRef(null)
  const { locale } = useGlobal()

  if (!postsToShow || postsToShow.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  } else {
    return <div id='container' ref={targetRef} className='w-full'>

      {/* 文章列表 */}
      <div className="2xl:grid 2xl:grid-cols-2 grid-cols-1 gap-5">
        {postsToShow.map(post => (
          <BlogPostCard key={post.id} post={post} showSummary={showSummary} siteInfo={siteInfo}/>
        ))}
      </div>

      {/* 更多按钮 */}
      <div>
        <div onClick={() => { handleGetMore() }}
             className='w-full my-4 py-4 text-center cursor-pointer rounded-xl dark:text-gray-200'
        > {hasMore ? locale.COMMON.MORE : `${locale.COMMON.NO_MORE}`} </div>
      </div>
    </div>
  }
}

export default BlogPostListScroll
