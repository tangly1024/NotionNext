import BLOG from '@/blog.config'
import TagItemMini from '@/components/TagItemMini'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-solid-svg-icons'

const BlogPostCard = ({ post, tags }) => {
  return (
    <div key={post.id} className='hover:shadow-2xl shadow-md mb-14 duration-300 md:grid md:grid-cols-5 rounded-xl dark:border-gray-600 animate__animated animate__fadeIn animate__faster
     w-full bg-white dark:bg-gray-800 dark:hover:bg-gray-700'>
      <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
        <div className='w-full h-60 rounded-t-xl md:rounded-t-none md:rounded-l-xl md:h-full duration-200 cursor-pointer transform col-span-2 overflow-hidden'>
          <Image className='hover:scale-105 transform duration-500 rounded-t-xl md:rounded-t-none md:rounded-l-xl' src={(post.page_cover && post.page_cover.length > 1) ? post.page_cover : BLOG.defaultImgCover} alt={post.title} layout='fill' objectFit='cover' loading='lazy' />
        </div>
      </Link>

      <div className='p-8 col-span-3'>
        <div>
          <Link href={`/category/${post.category}`} passHref>
            <a className='cursor-pointer dark:text-gray-200  font-light text-gray-500 text-sm hover:underline hover:text-blue-500 dark:hover:text-blue-400 transform'>
              <FontAwesomeIcon icon={faFolder} className='mr-1' />{post.category}
            </a>
          </Link>
          <span className='mx-2 dark:text-gray-400 text-gray-500'>|</span>
          <Link href={`/archive#${post?.date?.start_date?.substr(0, 7)}`} passHref>
            <a className='mt-2  font-light text-gray-500 hover:text-blue-400 hover:underline cursor-pointer dark:text-gray-300 dark:hover:text-blue-400 text-sm leading-4'>{post.date.start_date}</a>
          </Link>
        </div>

        <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
          <a className='cursor-pointer my-3 text-2xl leading-tight text-black dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400'>
            {post.title}
          </a>
        </Link>

        <p className='mt-2 text-gray-600 dark:text-gray-300 text-sm font-light'>{post.summary}</p>

        <div className='flex md:flex-nowrap flex-wrap md:justify-start justify-between pt-5'>
          <div> {post.tagItems.map(tag => (<TagItemMini key={tag.name} tag={tag} />))}</div>
        </div>
      </div>
    </div >
  )
}

export default BlogPostCard
