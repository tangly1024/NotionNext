import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import CONFIG_FUKA from '../config_fuka'
import Card from './Card'

const BlogCard = ({ post, showSummary }) => {
  const showPreview = CONFIG_FUKA.POST_LIST_PREVIEW && post.blockMap
  return (
    <Card className="w-full lg:max-w-sm p-2 h-full overflow-auto">
      <div
        key={post.id}
        className="animate__animated animate__fadeIn flex flex-col-reverse justify-between duration-300"
      >
        <div className="p-2 flex flex-col w-full">
          <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`} passHref>
            <a
              className={`cursor-pointer font-bold hover:underline text-xl ${showPreview ? 'justify-center' : 'justify-start'
                } leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400`}
            >
              {post.title}
            </a>
          </Link>

          {(!showPreview || showSummary) && (
            <p className="mt-4 mb-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7 overflow-hidden">
              {post.summary}
            </p>
          )}
        </div>

        {CONFIG_FUKA.POST_LIST_COVER && post?.page_cover && (
          <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`} passHref>
            <div className="h-40 w-full relative duration-200 cursor-pointer transform overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post?.page_cover}
                alt={post.title}
                className="hover:scale-125 transform duration-500"
              ></img>
              {/* <Image className='hover:scale-105 transform duration-500' src={post?.page_cover} alt={post.title} layout='fill' objectFit='cover' loading='lazy' /> */}
            </div>
          </Link>
        )}
      </div>
    </Card>
  )
}

export default BlogCard
