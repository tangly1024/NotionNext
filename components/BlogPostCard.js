import BLOG from '@/blog.config'
import TagItemMini from '@/components/TagItemMini'
import Link from 'next/link'
import React from 'react'

const BlogPostCard = ({ post, tags }) => {
  return (
    <div key={post.id}
         className='animate__animated animate__fadeIn animate__faster xl:flex shadow-card border dark:border-gray-600 mb-6 w-full bg-white dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden'>

      {post.page_cover && post.page_cover.length > 1 && (
        <Link href={`${BLOG.path}/article/${post.slug}`}>
          <img className='w-full max-h-72 xl:w-80 object-cover cursor-pointer transform hover:scale-110 duration-500'
               src={post.page_cover} alt={post.title} />
        </Link>
      )}

      <div className='px-4 py-4 w-full'>

        <div>
          <Link href={`/category/${post.category}`}>
            <span className='cursor-pointer dark:text-gray-200 text-gray-400 text-sm py-1.5 mr-1 hover:underline hover:text-blue-500 transform'>
              <i className='fa fa-folder-open-o mr-1' />{post.category}
            </span>
          </Link>
          <span className='mx-1 dark:text-gray-400'>|</span>
          <span className='mt-2 mx-2 text-gray-400 dark:text-gray-300 text-sm leading-4'>{post.date.start_date}</span>
        </div>

        <Link href={`${BLOG.path}/article/${post.slug}`}>
          <div className='cursor-pointer my-3 text-lg leading-tight font-bold text-black dark:text-gray-100 hover:underline'>
            {post.title}
          </div>
        </Link>

        <p className='mt-2 text-gray-400 dark:text-gray-400 text-sm'>{post.summary}</p>

        <div className='flex md:flex-nowrap flex-wrap md:justify-start justify-between pt-5'>
          <div> {post.tagItems.map(tag => (<TagItemMini key={tag.name} tag={tag} />))}</div>
        </div>
      </div>
    </div>
  )
}

export default BlogPostCard
