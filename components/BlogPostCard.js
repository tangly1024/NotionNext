import BLOG from '@/blog.config'
import TagItemMini from '@/components/TagItemMini'
import Link from 'next/link'
import React from 'react'

const BlogPostCard = ({ post }) => {
  return (
    <div key={post.id} className='animate__animated animate__slideInUp animate__faster shadow-card inline-block border dark:border-gray-600 my-2 w-full 2xl:max-w-2xl bg-white bg-opacity-80 dark:bg-gray-800 dark:hover:bg-gray-700 overflow-hidden'>
        {/*  封面图 */}
        {post.page_cover && post.page_cover.length > 1 && (
          <Link href={`${BLOG.path}/article/${post.slug}`} className='md:flex-shrink-0 md:w-52 md:h-52 rounded-lg'>
            <img className='w-full max-h-60 object-cover cursor-pointer transform hover:scale-110 duration-500' src={post.page_cover} alt={post.title} />
          </Link>
        )}

        <div className='px-8 py-6'>
          <Link href={`${BLOG.path}/article/${post.slug}`}>
            <div className='cursor-pointer my-3 text-2xl leading-tight font-bold text-black dark:text-gray-100 hover:underline'>{post.title}</div>
          </Link>
          <div className='flex flex-nowrap'>
            <Link href={`/category/${post.category}`}>
              <div className='cursor-pointer text-sm py-1.5 mr-2 hover:underline'><i className='fa fa-folder-open-o mr-1'/>{post.category}</div>
            </Link>
            {post.tags.map(tag => (<TagItemMini key={tag} tag={tag} />))}
            <span className='mt-2 mx-2 text-gray-500 dark:text-gray-300 text-sm leading-4'>{post.date.start_date}</span>
          </div>
          <p className='mt-2 text-gray-500 dark:text-gray-300 text-sm'>{post.summary}</p>
        </div>
    </div>
  )
}

export default BlogPostCard
