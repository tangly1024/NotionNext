import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import TagItemMini from './TagItemMini'
import CONFIG_MATERY from '../config_matery'
import NotionPage from '@/components/NotionPage'

const BlogPostCard = ({ post, showSummary }) => {
  const showPreview = CONFIG_MATERY.POST_LIST_PREVIEW && post.blockMap
  return (
        <div className="w-full drop-shadow-md hover:shadow border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray duration-500  hover:scale-105">
            <div key={post.id} className="flex flex-col justify-between ">

                {CONFIG_MATERY.POST_LIST_COVER && !showPreview && post?.page_cover && !post.results && (
                    <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref>
                        <div className="flex w-full relative duration-200 bg-black rounded-t-md  cursor-pointer transform overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={post?.page_cover}
                                alt={post.title}
                                className="opacity-50 max-h-52 lg:max-h-72 w-full hover:scale-125 rounded-t-md  transform object-cover duration-500"
                            />
                            <span className='absolute bottom-0 left-0 text-white p-6 text-2xl' > {post.title}</span>
                        </div>
                    </Link>
                )}

                {/* 描述 */}
                <div className="lg:p-8 p-4 flex flex-col w-full">

                    {(!showPreview || showSummary) && !post.results && post.summary && (
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

                    <div className='text-gray-800 justify-between flex'>
                        <Link
                            href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                            passHref
                        >
                            <a className="font-light hover:underline cursor-pointer text-sm leading-4 mr-3">
                                <i className="far fa-clock mr-1" />
                                {post.date?.start_date || post.lastEditedTime}
                            </a>
                        </Link>
                        <Link href={`/category/${post.category}`} passHref>
                            <a className="cursor-pointer font-light text-sm hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform">
                                <i className="mr-1 far fa-folder" />
                                {post.category}
                            </a>
                        </Link>
                    </div>
                </div>

                {post?.tagItems && post?.tagItems.length > 0 && (<>
                    <hr />
                    <div className="text-gray-400 justify-between flex px-5 py-3">
                        <div className="md:flex-nowrap flex-wrap md:justify-start inline-block">
                            <div>
                                {' '}
                                {post.tagItems.map(tag => (
                                    <TagItemMini key={tag.name} tag={tag} />
                                ))}
                            </div>
                        </div>
                    </div>
                </>)}

            </div>
        </div>
  )
}

export default BlogPostCard
