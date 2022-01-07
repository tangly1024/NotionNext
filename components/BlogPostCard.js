import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight, faFolder } from '@fortawesome/free-solid-svg-icons'
import TagItemMini from './TagItemMini'
import { Code, Collection, CollectionRow, Equation, NotionRenderer } from 'react-notion-x'
import { useGlobal } from '@/lib/global'

const BlogPostCard = ({ post, showSummary }) => {
  const { locale } = useGlobal()
  return (
    <div key={post.id} className='shadow border animate__animated animate__fadeIn flex flex-col-reverse justify-between md:hover:shadow-xl duration-300
        w-full bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600'>

      <div className='lg:p-8 p-4 flex flex-col justify-between w-full'>
        <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
          <a className='cursor-pointer font-bold text-3xl text-center leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400'>
            {post.title}
          </a>
        </Link>

        <div className='flex mt-2 items-center justify-center flex-wrap dark:text-gray-500 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 '>
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

        {showSummary && <p className='mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7'>
          {post.summary}
        </p>}

        {BLOG.home?.showPreview && post?.blockMap && <div className='max-h-screen overflow-hidden truncate max-w-full'>
          <NotionRenderer
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

        <div className='border-b-2 w-full border-dashed py-2'></div>

        <Link href={`${BLOG.path}/article/${post.slug}`} passHref>
          <div className='flex items-center cursor-pointer pt-6 justify-end leading-tight'>
            <a className='bg-black p-2 text-white'>{locale.COMMON.ARTICLE_DETAIL}
             <FontAwesomeIcon icon={faAngleDoubleRight} /></a>
          </div>
        </Link>
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
