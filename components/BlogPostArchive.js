import React, { useRef } from 'react'
import Link from 'next/link'
import BLOG from '@/blog.config'
/**
 * 博客归档列表
 * @param posts 所有文章
 * @param archiveTitle 归档标题
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostArchive = ({ posts = [], archiveTitle }) => {
  const targetRef = useRef(null)
  if (!posts || posts.length === 0) {
    return <></>
  } else {
    return <div ref={targetRef}>
      <div className='pt-16 pb-4 text-3xl dark:text-white' id={archiveTitle}>{archiveTitle}</div>
      <ul className='flex flex-wrap space-y-1'>
        {posts.map(post => (
          <Link key={post.id} href={`${BLOG.path}/article/${post.slug}`} passHref>
            <li className='w-full border-l pl-2 hover:underline cursor-pointer hover:scale-105 transform duration-500'>
              <div name={post?.date?.start_date}><span className='text-gray-400'>{post.date.start_date}</span> &nbsp; <span className='dark:text-blue-400 text-blue-600'>{post.title}</span></div>
            </li>
          </Link>
        ))}
      </ul>
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
export default BlogPostArchive
