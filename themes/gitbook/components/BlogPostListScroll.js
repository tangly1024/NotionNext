import BlogPostCard from './BlogPostCard'
import BlogPostListEmpty from './BlogPostListEmpty'
import React, { useRef } from 'react'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListScroll = ({ posts = [], currentSearch }) => {
  const targetRef = useRef(null)
  const filteredPosts = Object.assign(posts)

  if (!filteredPosts || filteredPosts.length === 0) {
    return <BlogPostListEmpty currentSearch={currentSearch} />
  } else {
    return <div id='container' ref={targetRef} className='w-full'>
            {/* 文章列表 */}
            {filteredPosts?.map(post => (
                <BlogPostCard key={post.id} post={post} showSummary={true} />
            ))}
        </div>
  }
}

export default BlogPostListScroll
