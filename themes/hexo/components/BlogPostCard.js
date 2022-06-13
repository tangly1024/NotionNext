import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import TagItemMini from './TagItemMini'
import CONFIG_HEXO from '../config_hexo'
import NotionPage from '@/components/NotionPage'

const BlogPostCard = ({ post, showSummary }) => {
  const showPreview = CONFIG_HEXO.POST_LIST_PREVIEW && post.blockMap
  return (
    <div className="w-full shadow-sm hover:shadow border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray duration-300">
      <div
        key={post.id}
        className="animate__animated animate__fadeIn flex flex-col-reverse lg:flex-row justify-between duration-300"
      >
        <div className="lg:p-8 p-4 flex flex-col w-full">
          <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`} passHref>
            <a
              className={`replace cursor-pointer hover:underline text-2xl font-sans ${showPreview ? 'text-center' : ''
                } leading-tight text-gray-700 dark:text-gray-100 hover:text-indigo-700 dark:hover:text-indigo-400`}
            >
              {post.title}
            </a>
          </Link>

          <div
            className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'
              } flex-wrap dark:text-gray-500 text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-400`}
          >
            <Link
              href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
              passHref
            >
              <a className="font-light hover:underline cursor-pointer text-sm leading-4 mr-3">
                <i className="far fa-calendar-alt mr-1" />
                {post.date?.start_date || post.lastEditedTime}
              </a>
            </Link>
          </div>

          {(!showPreview || showSummary) && !post.results && (
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical' }}
              className="replace h-full max-h-32 my-4 text-gray-700  dark:text-gray-300 text-sm font-light leading-7">
              {post.summary}
            </p>
          )}

          {/* 搜索结果 */}
          {post.results && (
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
              {post.results.map(r => (
                <span key={r}>{r}</span>
              ))}
            </p>
          )}

          {showPreview && (
            <div className="overflow-ellipsis truncate">
              <NotionPage post={post} />
            </div>
          )}

          <div className="text-gray-400 justify-between flex">
            <Link href={`/category/${post.category}`} passHref>
              <a className="cursor-pointer font-light text-sm hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform">
                <i className="mr-1 far fa-folder" />
                {post.category}
              </a>
            </Link>
            <div className="md:flex-nowrap flex-wrap md:justify-start inline-block">
              <div>
                {' '}
                {post.tagItems.map(tag => (
                  <TagItemMini key={tag.name} tag={tag} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {CONFIG_HEXO.POST_LIST_COVER && !showPreview && post?.page_cover && !post.results && (
          <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`} passHref>
            <div className="flex w-full relative duration-200 rounded-t-xl lg:rounded-r-xl lg:rounded-t-none cursor-pointer transform overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post?.page_cover}
                alt={post.title}
                className="max-h-52 lg:max-h-72 w-full hover:scale-125 rounded-t-xl lg:rounded-r-xl lg:rounded-t-none transform object-cover duration-500"
              />
              {/* <Image className='hover:scale-125 rounded-t-xl lg:rounded-r-xl lg:rounded-t-none transform duration-500' src={post?.page_cover} alt={post.title} layout='fill' objectFit='cover' loading='lazy' /> */}
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
