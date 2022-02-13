import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'
import { Code, Collection, Equation, NotionRenderer } from 'react-notion-x'
import CONFIG_MEDIUM from '../config_medium'

const BlogPostCard = ({ post, showSummary }) => {
  const showPreview = CONFIG_MEDIUM.POST_LIST_PREVIEW && post.blockMap
  const { locale } = useGlobal()
  return (
      <div key={post.id} className='animate__animated animate__fadeIn duration-300 mb-6 max-w-7xl '>

        <div className='lg:p-8 p-4 flex flex-col w-full'>
          <Link href={`${BLOG.PATH}/article/${post.slug}`} passHref>
            <a className={'cursor-pointer font-bold font-sans hover:underline text-3xl flex justify-start leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400'}>
              {post.title}
            </a>
          </Link>

          <div className={'flex mt-2 items-center justify-start flex-wrap dark:text-gray-500 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 '}>
            {post.date.start_date}
          </div>

          {(!showPreview || showSummary) && <p className='my-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7'>
            {post.summary}
          </p>}

          {showPreview && <div className='overflow-ellipsis truncate'>
            <NotionRenderer
              bodyClassName='max-h-full'
              recordMap={post.blockMap}
              mapPageUrl={mapPageUrl}
              components={{
                equation: Equation,
                code: Code,
                collection: Collection
              }}
            />
             <div className='article-cover pointer-events-none'>
                <div className='w-full justify-start flex'>
                  <Link href={`${BLOG.PATH}/article/${post.slug}`} passHref>
                      <a className='hover:bg-opacity-100 hover:scale-105 duration-200 pointer-events-auto transform  text-red-500 cursor-pointer'>
                        {locale.COMMON.ARTICLE_DETAIL}
                        <FontAwesomeIcon className='ml-1' icon={faAngleRight} /></a>

                   </Link>
                </div>
              </div>
          </div> }
        </div>
        <hr className='w-full'/>

      </div>

  )
}

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

export default BlogPostCard
