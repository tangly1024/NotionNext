import BLOG from '@/blog.config'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  Code,
  Collection,
  CollectionRow,
  Equation,
  NotionRenderer
} from 'react-notion-x'
import TagItemMini from './TagItemMini'
import CONFIG_APPLE_IOS_HEXO from '../config_apple_ios_hexo'

const BlogPostCard = ({ post, showSummary }) => {
  const showPreview = CONFIG_APPLE_IOS_HEXO.POST_LIST_PREVIEW && post.blockMap
  console.log(post)
  return (
    <div className="w-full shadow hover:scale-110 hover:shadow-2xl border border-gray-100 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 transform duration-300">
      <div
        key={post.id}
        className="animate__animated animate__fadeIn flex flex-col-reverse lg:flex-row justify-between duration-300"
      >
        <div className="lg:p-8 p-4 flex flex-col w-full">
          <Link href={`${BLOG.PATH}/article/${post.slug}`} passHref>
            <a
              className={`replace cursor-pointer hover:underline text-2xl font-sans ${
                showPreview ? 'text-center' : ''
              } leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400`}
            >
              {post.title}
            </a>
          </Link>

          <div
            className={`flex mt-2 items-center ${
              showPreview ? 'justify-center' : 'justify-start'
            } flex-wrap dark:text-gray-500 text-gray-400`}
          >
            <Link
              href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
              passHref
            >
              <a className="font-light hover:underline cursor-pointer text-sm leading-4 mr-3 hover:text-blue-500 dark:hover:text-blue-400">
                <i className="far fa-calendar-alt mr-1" />
                {post.date.start_date}
              </a>
            </Link>

            <Link href={`/category/${post.category}`} passHref>
              <a className="cursor-pointer font-light text-sm hover:underline transform flex-none pr-4 hover:text-blue-500 dark:hover:text-blue-400">
                <i className="mr-1 far fa-folder" />
                {post.category}
              </a>
            </Link>
          </div>

          {(!showPreview || showSummary) && (
            <p className="replace my-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7 line-clamp-2">
              {post.summary}
            </p>
          )}

          {showPreview && (
            <div className="overflow-ellipsis truncate">
              <NotionRenderer
                bodyClassName="max-h-full"
                recordMap={post.blockMap}
                mapPageUrl={mapPageUrl}
                components={{
                  equation: Equation,
                  code: Code,
                  collectionRow: CollectionRow,
                  collection: Collection
                }}
              />
            </div>
          )}

          <div className="text-gray-400 justify-between flex">
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

        {CONFIG_APPLE_IOS_HEXO.POST_LIST_COVER &&
          !showPreview &&
          post?.page_cover && (
            <Link href={`${BLOG.PATH}/article/${post.slug}`} passHref>
              <a className="hover:scale-110 w-full relative duration-200 rounded-xl cursor-pointer transform overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* <img src={post?.page_cover} alt={post.title} className='h-full object-cover'></img> */}
                <Image
                  className="rounded-xl transform duration-500 hover:scale-110"
                  src={post?.page_cover}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  loading="lazy"
                />
              </a>
            </Link>
          )}
      </div>
    </div>
  )
}

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

export default BlogPostCard
