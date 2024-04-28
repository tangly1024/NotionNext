import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { checkContainHttp, sliceUrlFromHttp } from '@/lib/utils'
import Link from 'next/link'
import CONFIG from '../config'

/**
 * 博客列表的单个卡片
 * @param {*} param0
 * @returns
 */
const BlogItem = ({ post }) => {
  const showPageCover =
    siteConfig('EXAMPLE_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail
  const url = checkContainHttp(post.slug)
    ? sliceUrlFromHttp(post.slug)
    : `${siteConfig('SUB_PATH', '')}/${post.slug}`

  return (
    <article
      className={`${showPageCover ? 'flex md:flex-row flex-col-reverse' : ''} replace mb-12 `}>
      <div className={`${showPageCover ? 'md:w-7/12' : ''}`}>
        <h2 className='mb-4'>
          <Link
            href={`/${post.slug}`}
            className='text-black dark:text-gray-100 text-xl md:text-2xl no-underline hover:underline'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post?.title}
          </Link>
        </h2>

        <div className='mb-4 text-sm text-gray-700 dark:text-gray-300'>
          by{' '}
          <a href='#' className='text-gray-700 dark:text-gray-300'>
            {siteConfig('AUTHOR')}
          </a>{' '}
          on {post.date?.start_date || post.createdTime}
          <TwikooCommentCount post={post} className='pl-1' />
          {post.category && (
            <>
              <span className='font-bold mx-1'> | </span>
              <Link
                href={`/category/${post.category}`}
                className='text-gray-700 dark:text-gray-300 hover:underline'>
                {post.category}
              </Link>
            </>
          )}
          {/* <span className="font-bold mx-1"> | </span> */}
          {/* <a href="#" className="text-gray-700">2 Comments</a> */}
        </div>

        {!post.results && (
          <p className='line-clamp-3 text-gray-700 dark:text-gray-400 leading-normal'>
            {post.summary}
          </p>
        )}
        {/* 搜索结果 */}
        {post.results && (
          <p className='line-clamp-3 mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7'>
            {post.results.map((r, index) => (
              <span key={index}>{r}</span>
            ))}
          </p>
        )}
      </div>
      {/* 图片封面 */}
      {showPageCover && (
        <div className='md:w-5/12 w-full h-44 overflow-hidden p-1'>
          <Link href={url} passHref legacyBehavior>
            <LazyImage
              src={post?.pageCoverThumbnail}
              className='w-full bg-cover hover:scale-110 duration-200'
            />
          </Link>
        </div>
      )}
    </article>
  )
}

export default BlogItem
