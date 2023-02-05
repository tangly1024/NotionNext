import BLOG from '@/blog.config'
import Link from 'next/link'
import React from 'react'
import TagItemMini from './TagItemMini'
import CONFIG_MATERY from '../config_matery'

const BlogPostCard = ({ post, showSummary, siteInfo }) => {
  const showPreview = CONFIG_MATERY.POST_LIST_PREVIEW && post.blockMap
  // matery 主题默认强制显示图片
  if (post && !post.page_cover) {
    post.page_cover = siteInfo?.pageCover
  }
  const showPageCover = CONFIG_MATERY.POST_LIST_COVER && !showPreview && post?.page_cover
  return (
      <div
          data-aos="zoom-in"
          data-aos-duration="300"
          data-aos-easing="ease-in-out"
          data-aos-once="false"
          data-aos-anchor-placement="top-bottom"
          className="w-full mb-4 h-full overflow-auto drop-shadow-md border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray">

          {/* 固定高度 ，空白用图片拉升填充 */}
          <div key={post.id} className="flex flex-col h-96 justify-between">

              {/* 头部图片 填充卡片 */}
              {showPageCover && (
                  <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
                      <div className="flex flex-grow w-full relative duration-200 bg-black rounded-t-md  cursor-pointer transform overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                              src={post?.page_cover}
                              alt={post.title}
                              className="opacity-50 h-full w-full hover:scale-125 rounded-t-md  transform object-cover duration-500"
                          />
                          <span className='absolute bottom-0 left-0 text-white p-6 text-2xl replace' > {post.title}</span>
                      </div>
                  </Link>
              )}

              <div >
                  {/* 描述 */}
                  <div className="px-4 flex flex-col w-full  text-gray-700  dark:text-gray-300">

                      {(!showPreview || showSummary) && post.summary && (
                          <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical' }}
                              className="replace my-2 text-sm font-light leading-7">
                              {post.summary}
                          </p>
                      )}

                      <div className='text-gray-800 justify-between flex my-2  dark:text-gray-300'>
                          <Link
                              href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                              passHref
                              className="font-light hover:underline cursor-pointer text-sm leading-4 mr-3">

                              <i className="far fa-clock mr-1" />
                              {post.date?.start_date || post.lastEditedTime}

                          </Link>
                          <Link
                              href={`/category/${post.category}`}
                              passHref
                              className="cursor-pointer font-light text-sm hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform">

                              <i className="mr-1 far fa-folder" />
                              {post.category}

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

      </div>
  )
}

export default BlogPostCard
