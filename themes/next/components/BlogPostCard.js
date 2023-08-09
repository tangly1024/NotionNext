import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Card from './Card'
import TagItemMini from './TagItemMini'
import CONFIG from '../config'
import NotionPage from '@/components/NotionPage'
import NotionIcon from '@/components/NotionIcon'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { formatDateFmt } from '@/lib/formatDate'

const BlogPostCard = ({ post, showSummary }) => {
  const { locale } = useGlobal()
  const showPreview = CONFIG.POST_LIST_PREVIEW && post.blockMap
  return (
    <Card className="w-full">
      <div
        key={post.id}
        className="flex flex-col-reverse justify-between duration-300"
      >
        <div className="lg:p-8 p-4 flex flex-col w-full">
          <Link
            href={`${BLOG.SUB_PATH}/${post.slug}`}
            passHref
            data-aos="fade-down"
            data-aos-duration="500"
            data-aos-once="true"
            data-aos-anchor-placement="top-bottom"
            className={`cursor-pointer hover:underline text-3xl ${showPreview ? 'text-center' : ''
              } leading-tight text-gray-700 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400`}>

            <NotionIcon icon={post.pageIcon} /> {post.title}

          </Link>

          <div data-aos="fade-down"
                data-aos-duration="500"
                data-aos-delay="100"
                data-aos-once="true"
                data-aos-anchor-placement="top-bottom"
                className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'} flex-wrap dark:text-gray-500 text-gray-400 `}>

            <div>
              {post.category && (
                <>
                  <Link
                    href={`/category/${post.category}`}
                    passHref
                    className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer font-light text-sm hover:underline transform">

                    <i className="mr-1 fas fa-folder" />
                    {post.category}

                  </Link>
                  <span className="mx-2">|</span>
                </>
              )}
                <Link
                    href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                    passHref
                    className="hover:text-blue-500 dark:hover:text-blue-400 font-light hover:underline cursor-pointer text-sm leading-4 mr-3">
                    {post.date?.start_date}
                </Link>
            </div>
            <TwikooCommentCount post={post} className='hover:text-blue-500 dark:hover:text-blue-400 hover:underline text-sm'/>

            <div className="hover:text-blue-500 dark:hover:text-blue-400  md:flex-nowrap flex-wrap md:justify-start inline-block">
                {post.tagItems?.map(tag => (
                  <TagItemMini key={tag.name} tag={tag} />
                ))}
            </div>
          </div>

          {(!showPreview || showSummary) && !post.results && (
            <p data-aos="fade-down"
                data-aos-duration="500"
                data-aos-delay="100"
                data-aos-once="true"
                data-aos-anchor-placement="top-bottom"
                className="mt-4 mb-12 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
              {post.summary}
            </p>
          )}

          {/* 搜索结果 */}
          {post.results && (
            <p className="line-clamp-4 mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
              {post.results.map((r, index) => (
                <span key={index}>{r}</span>
              ))}
            </p>
          )}

          {showPreview && post?.blockMap && (
            <div data-aos="fade-down"
            data-aos-duration="500"
            data-aos-delay="100"
            data-aos-once="true"
            data-aos-anchor-placement="top-bottom"className="overflow-ellipsis truncate">
              <NotionPage post={post} />
            </div>
          )}

          <div className="text-right border-t pt-8 border-dashed">
            <Link
              href={`${BLOG.SUB_PATH}/${post.slug}`}
              className="hover:bg-opacity-100 hover:underline transform duration-300 p-3 text-white bg-gray-800 cursor-pointer">

              {locale.COMMON.ARTICLE_DETAIL}
              <i className="ml-1 fas fa-angle-right" />

            </Link>
          </div>
        </div>

        {CONFIG.POST_LIST_COVER && post?.pageCoverThumbnail && (
          <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
            <div className="h-72 w-full relative duration-200 cursor-pointer transform overflow-hidden">
              <Image
                className="hover:scale-105 transform duration-500"
                src={post?.pageCoverThumbnail}
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
