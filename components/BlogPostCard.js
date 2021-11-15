import BLOG from '@/blog.config'
import TagItemMini from '@/components/TagItemMini'
import Link from 'next/link'
import React from 'react'

const BlogPostCard = ({ post }) => {
  return (
    <div key={post.id}
         className='animate__animated animate__fadeIn animate__faster xl:flex shadow-card border dark:border-gray-600 mb-6 w-full bg-white bg-opacity-80 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden'>
      {/*  封面图 */}
      {post.page_cover && post.page_cover.length > 1 && (
        <Link href={`${BLOG.path}/article/${post.slug}`}>
          <img className='w-full max-h-72 xl:w-80 object-cover cursor-pointer transform hover:scale-110 duration-500'
               src={post.page_cover} alt={post.title} />
        </Link>
      )}

      <div className='px-8 py-6 w-full'>
        <Link href={`${BLOG.path}/article/${post.slug}`}>
          <div
            className='cursor-pointer my-3 text-xl leading-tight font-bold text-black dark:text-gray-100 hover:underline'>{post.title}</div>
        </Link>
        <p className='mt-2 text-gray-500 dark:text-gray-400 text-sm'>{post.summary}</p>

        <div className='flex md:flex-nowrap flex-wrap md:justify-start justify-between pt-5'>
          <div className='flex whitespace-nowrap'>
            <Link href={`/category/${post.category}`}>
              <div className='cursor-pointer dark:text-gray-200 text-gray-500 text-sm py-1.5 mr-1 underline hover:scale-105 transform duration-200'><i
                className='fa fa-folder-open-o mr-1' />{post.category}</div>
            </Link>
            <span className='mt-2 mx-2 text-gray-500 dark:text-gray-300 text-sm leading-4'>{post.date.start_date}</span>
          </div>
          <div className='flex ml-1'> {post.tags.map(tag => (<TagItemMini key={tag} tag={tag} />))}</div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostCard
