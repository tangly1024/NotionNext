import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import TagItemMini from './TagItemMini'
import CONFIG_HEXO from '../config_hexo'
import NotionPage from '@/components/NotionPage'

const BlogPostCard = ({ post, showSummary, index, siteInfo }) => {
  const showPreview = CONFIG_HEXO.POST_LIST_PREVIEW && post.blockMap
  if (post && !post.page_cover && CONFIG_HEXO.POST_LIST_COVER_DEFAULT) {
    post.page_cover = siteInfo?.pageCover
  }
  const showPageCover = CONFIG_HEXO.POST_LIST_COVER && post?.page_cover
  return (
    <div
        key={post.id}
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
        data-aos-anchor-placement="top-bottom"
        className={`flex md:flex-row flex-col-reverse  ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}
        w-full md:h-72 h-96 justify-between overflow-hidden drop-shadow-md  
        border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray  `}>

        <div className={`lg:p-8 p-4 flex flex-col  ${showPageCover ? 'md:w-7/12 w-full' : 'w-full'}`}>
          <Link
            href={`${BLOG.SUB_PATH}/${post.slug}`}
            passHref
            className={`replace cursor-pointer hover:underline text-2xl ${showPreview ? 'text-center' : ''
              } leading-tight text-gray-600 dark:text-gray-100 hover:text-indigo-700 dark:hover:text-indigo-400`}>

            {post.title}

          </Link>

          <div
            className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'
              } flex-wrap dark:text-gray-500 text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-400`}
          >
            <Link
              href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
              passHref
              className="font-light hover:underline cursor-pointer text-sm leading-4 mr-3">

              <i className="far fa-calendar-alt mr-1" />
              {post.date?.start_date || post.lastEditedTime}

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
            <Link
              href={`/category/${post.category}`}
              passHref
              className="cursor-pointer font-light text-sm hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform">

              <i className="mr-1 far fa-folder" />
              {post.category}

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

        {showPageCover && !showPreview && post?.page_cover && (
           <div className="flex relative duration-200 cursor-pointer transform overflow-hidden md:w-5/12 ">
                <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={post?.page_cover}
                        alt={post.title}
                        className="h-full w-full hover:scale-125 transform object-cover duration-500"
                    />
                    {/* <Image className='hover:scale-125 transform duration-500' src={post?.page_cover} alt={post.title} layout='fill' objectFit='cover' loading='lazy' /> */}
                </Link>
            </div>
        )}

    </div>
  )
}

export default BlogPostCard
