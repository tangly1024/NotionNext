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
            {filteredPosts?.map((group, index) => {
              if (group.category) {
                return <div key={index}>
                        <div className='text-md font-sans ' key={group.category}>{group.category}</div>
                        {group.items?.map(post => (<div key={post.id} className='pl-6 border-l'><BlogPostCard className='text-sm' post={post} /></div>))}
                    </div>
              } else {
                return <div key={index}> {group.items?.map(post => (<BlogPostCard key={post.id} post={post} className='text-md' />))}</div>
              }
            })}
        </div>
  }
}

export default BlogPostListScroll
