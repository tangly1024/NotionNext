import BLOG from '@/blog.config'
import NotionPage from '@/components/NotionPage'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import React from 'react'
import CONFIG_MEDIUM from '../config_medium'
import CategoryItem from './CategoryItem'
import TagItemMini from './TagItemMini'

const BlogPostCard = ({ post, showSummary }) => {
  const showPreview = CONFIG_MEDIUM.POST_LIST_PREVIEW && post.blockMap
  const { locale } = useGlobal()
  return (
    <div
      key={post.id}
      className="animate__animated animate__fadeIn duration-300 mb-6 max-w-7xl border-b dark:border-gray-800 "
    >
      <div className="lg:p-8 p-4 flex flex-col w-full">
        <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`} passHref>
          <a
            className={
              'cursor-pointer font-bold font-sans hover:underline text-3xl leading-tight text-gray-700 dark:text-gray-100 hover:text-green-500 dark:hover:text-green-400'
            }
          >
            {post.title}
          </a>
        </Link>

        <div
          className={
            'flex mt-2 items-center justify-start flex-wrap space-x-3 text-gray-400'
          }
        >
          <div className="text-sm py-1">{post.date?.start_date}</div>
          {CONFIG_MEDIUM.POST_LIST_CATEGORY && (
            <CategoryItem category={post.category} />
          )}
          {CONFIG_MEDIUM.POST_LIST_TAG &&
            post?.tagItems?.map(tag => (
              <TagItemMini key={tag.name} tag={tag} />
            ))}
        </div>

        <div className="flex"></div>

        {(!showPreview || showSummary) && (
          <p className="my-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
            {post.summary}
          </p>
        )}

        {showPreview && (
          <div className="overflow-ellipsis truncate">
            <NotionPage post={post} />
            <div className="pointer-events-none border-t pt-8 border-dashed">
              <div className="w-full justify-start flex">
                <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`} passHref>
                  <a className="hover:bg-opacity-100 hover:scale-105 duration-200 pointer-events-auto transform font-bold text-green-500 cursor-pointer">
                    {locale.COMMON.ARTICLE_DETAIL}
                    <i className="ml-1 fas fa-angle-right" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostCard
