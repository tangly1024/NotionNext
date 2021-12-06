import BLOG from '@/blog.config'
import TagItemMini from '@/components/TagItemMini'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

const BlogPostCard = ({ post, tags }) => {
  return (
    <div key={post.id} className='md:grid md:grid-cols-5 animate__animated animate__fadeIn animate__faster shadow-lg rounded border dark:border-gray-600 mb-6
     w-full bg-white dark:bg-gray-800 dark:hover:bg-gray-700'>
      <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
        <div className='w-full h-60 hover:scale-105 duration-200 cursor-pointer transform col-span-2 border-r border-dashed'>
          <Image src={(post.page_cover && post.page_cover.length > 1) ? post.page_cover : BLOG.defaultImgCover} alt={post.title} layout='fill' objectFit='cover' loading='lazy' />
        </div>
      </Link>

      <div className='px-4 py-4 col-span-3'>
        <div className='w-52'>
          <Link href={`/category/${post.category}`} passHref>
            <span className='cursor-pointer dark:text-gray-200 text-gray-400 text-sm py-1.5 mr-1 hover:underline hover:text-blue-500 transform'>
              <FontAwesomeIcon icon={faFolder} size='sm' className='mr-1 text-sm' />{post.category}
            </span>
          </Link>
          <span className='mx-1 dark:text-gray-400'>|</span>
          <Link href={`/archive#${post?.date?.start_date?.substr(0, 7)}`} passHref>
            <span className='mt-2 mx-2 text-gray-400 hover:text-blue-400 hover:underline cursor-pointer dark:text-gray-300 text-sm leading-4'>{post.date.start_date}</span>
          </Link>
        </div>

        <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
          <div className='cursor-pointer my-3 text-lg leading-tight font-bold text-black dark:text-gray-100 hover:underline'>
            {post.title}
          </div>
        </Link>

        <p className='mt-2 text-gray-400 dark:text-gray-400 text-sm'>{post.summary}</p>

        <div className='flex md:flex-nowrap flex-wrap md:justify-start justify-between pt-5'>
          <div> {post.tagItems.map(tag => (<TagItemMini key={tag.name} tag={tag} />))}</div>
        </div>
      </div>
    </div >
  )
}

export default BlogPostCard
