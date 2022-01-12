import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faAngleRight, faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import TagItemMini from './TagItemMini'

const BlogPostCard = ({ post, showSummary }) => {
  const { locale } = useGlobal()
  const showPreview = BLOG.home?.showPreview && post.blockMap
  return (
    <div key={post.id} className='shadow border animate__animated animate__fadeIn flex flex-col-reverse justify-between md:hover:shadow-xl duration-300
        w-full bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600'>

      <div className='lg:p-8 p-4 flex flex-col w-full'>
        <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
          <a className={`cursor-pointer font-bold hover:underline text-3xl flex ${showPreview ? 'justify-center' : 'justify-start'} leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400`}>
            {post.title}
          </a>
        </Link>

        <div className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'} flex-wrap dark:text-gray-500 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 `}>
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
          <div className='md:flex-nowrap flex-wrap md:justify-start inline-block'>
            <div> {post.tagItems.map(tag => (<TagItemMini key={tag.name} tag={tag} />))}</div>
          </div>
        </div>

        {(!showPreview || showSummary) && <p className='mt-4 mb-24 text-gray-700 dark:text-gray-300 text-sm font-light leading-7'>
          {post.summary}
        </p>}

        {showPreview && post?.blockMap && <div className='overflow-ellipsis truncate'>
          <NotionRenderer
            bodyClassName='max-h-full'
            recordMap={post.blockMap}
            mapPageUrl={mapPageUrl}
            components={{
              equation: Equation,
              code: Code,
              collectionRow: CollectionRow,
              collection: Collection
            }}
          />
        </div> }

        <div className='article-cover pointer-events-none'>
          <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
              <a className='hover:bg-opacity-100 hover:scale-105 pointer-events-auto transform duration-300 rounded-md p-2 text-red-500 cursor-pointer'>
                {locale.COMMON.ARTICLE_DETAIL}
                <FontAwesomeIcon className='ml-1' icon={faAngleRight} /></a>
          </Link>
        </div>
      </div>

      {BLOG.home?.showPostCover && post?.page_cover && (
        <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
        <div className='h-72 w-full relative duration-200 cursor-pointer transform overflow-hidden'>
          <Image className='hover:scale-105 transform duration-500' src={post?.page_cover} alt={post.title} layout='fill' objectFit='cover' loading='lazy' />
        </div>
      </Link>
      )}
    </div >
  )
}

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

export default BlogPostCard
