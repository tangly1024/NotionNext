import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Card from './Card'
import TagItemMini from './TagItemMini'
import CONFIG_NEXT from '../config_next'
import NotionPage from '@/components/NotionPage'

const BlogPostCard = ({ post, showSummary }) => {
  const { locale } = useGlobal()
  const showPreview = CONFIG_NEXT.POST_LIST_PREVIEW && post.blockMap
  return (
    <Card className="w-full animate__animated animate__fadeIn">
      <div
        key={post.id}
        className="flex flex-col-reverse justify-between duration-300"
      >
        <div className="lg:p-8 p-4 flex flex-col w-full">
          <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`} passHref>
            <a
              className={`cursor-pointer font-bold hover:underline text-3xl ${showPreview ? 'text-center' : ''
                } leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400`}
            >
              {post.title}
            </a>
          </Link>

          <div
            className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'
              } flex-wrap dark:text-gray-500 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 `}
          >
            <div>
              {post.category && (
                <>
                  <Link href={`/category/${post.category}`} passHref>
                    <a className="cursor-pointer font-light text-sm hover:underline transform">
                      <i className="mr-1 fas fa-folder" />
                      {post.category}
                    </a>
                  </Link>
                  <span className="mx-2">|</span>
                </>
              )}
              <Link
                href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                passHref
              >
                <a className="font-light hover:underline cursor-pointer text-sm leading-4 mr-3">
                  {post.date?.start_date}
                </a>
              </Link>
            </div>
            <div className="md:flex-nowrap flex-wrap md:justify-start inline-block">
              <div>
                {' '}
                {post.tagItems.map(tag => (
                  <TagItemMini key={tag.name} tag={tag} />
                ))}
              </div>
            </div>
          </div>

          {(!showPreview || showSummary) && !post.results && (
            <p className="mt-4 mb-24 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
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

          {showPreview && post?.blockMap && (
            <div className="overflow-ellipsis truncate">
              <NotionPage post={post} />
            </div>
          )}

          <div className="text-right border-t pt-8 border-dashed">
            <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`}>
              <a className="hover:bg-opacity-100 hover:underline transform duration-300 p-3 text-white bg-gray-800 dark:bg-black cursor-pointer">
                {locale.COMMON.ARTICLE_DETAIL}
                <i className="ml-1 fas fa-angle-right" />
              </a>
            </Link>
          </div>
        </div>

        {CONFIG_NEXT.POST_LIST_COVER && post?.page_cover && (
          <Link href={`${BLOG.SUB_PATH}/article/${post.slug}`} passHref>
            <div className="h-72 w-full relative duration-200 cursor-pointer transform overflow-hidden">
              <Image
                className="hover:scale-105 transform duration-500"
                src={post?.page_cover}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                loading="lazy"
              />
            </div>
          </Link>
        )}
      </div>
    </Card>
  )
}

export default BlogPostCard
