import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import TagItemMini from './TagItemMini'

const BlogPostCard = ({ post, tags }) => {
  return (
    <div key={post.id} className='flex md:flex-row flex-col-reverse justify-between hover:shadow-2xl shadow-md mb-14 duration-300 rounded-xl
      w-full bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600'>

      <div className='p-8 flex flex-col justify-between w-full'>
        <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
          <a className='cursor-pointer text-lg md:text-xl leading-tight text-black dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400'>
            {post.title}
          </a>
        </Link>

        <p className='my-4 text-gray-800 dark:text-gray-300 text-sm font-light'>{post.summary}</p>

        <div className='flex items-center justify-between flex-wrap dark:text-gray-500 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 '>
          <div>
          <Link href={`/category/${post.category}`} passHref>
            <a className='cursor-pointer font-light text-sm hover:underline transform'>
              <FontAwesomeIcon icon={faFolder} className='mr-1' />{post.category}
            </a>
          </Link>
          <span className='mx-2'>|</span>
          <Link href={`/archive#${post?.date?.start_date?.substr(0, 7)}`} passHref>
            <a className='font-light hover:underline cursor-pointer text-sm leading-4 mr-3'>{post.date.start_date}</a>
          </Link>
          </div>
          <div className='md:flex-nowrap flex-wrap md:justify-start hidden md:inline-block'>
            <div> {post.tagItems.map(tag => (<TagItemMini key={tag.name} tag={tag} />))}</div>
          </div>
        </div>

      </div>

      {post?.page_cover && (
        <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
        <div className='h-60  w-full md:max-w-sm relative rounded-t-xl md:rounded-t-none md:rounded-r-xl md:h-full duration-200 cursor-pointer transform overflow-hidden'>
          <Image className='hover:scale-105 transform duration-500 rounded-t-xl md:rounded-t-none md:rounded-r-xl' src={post?.page_cover} alt={post.title} layout='fill' objectFit='cover' loading='lazy' />
        </div>
      </Link>
      )}
    </div >
  )
}

export default BlogPostCard
