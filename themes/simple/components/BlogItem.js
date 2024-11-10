import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'
import CONFIG from '../config'

export const BlogItem = ({ post }) => {
  const { NOTION_CONFIG } = useGlobal()
  const showPageCover = siteConfig('SIMPLE_POST_COVER_ENABLE', false, CONFIG)
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post.blockMap

  return (
    <article
      key={post.id}
      className='mb-8 border-b border-gray-200 pb-8 dark:border-gray-700'>
      <div className='flex flex-col sm:flex-row'>
        {showPageCover && (
          <div className='mb-4 sm:mb-0 sm:mr-6 sm:w-56'>
            <Link href={post.href} passHref>
              <LazyImage
                src={post?.pageCoverThumbnail}
                className='h-40 w-full rounded-lg object-cover object-center transition-transform duration-300 hover:scale-105 sm:h-full'
                alt={post.title}
              />
            </Link>
          </div>
        )}

        <div className='flex-1'>
          <h2 className='mb-2 text-2xl font-bold'>
            <Link
              href={post.href}
              className='menu-link text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}
              {post.title}
            </Link>
          </h2>

          <div className='mb-4 flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400'>
            <Link
              href={siteConfig('SIMPLE_AUTHOR_LINK', null, CONFIG)}
              className='mr-4 hover:text-blue-600 dark:hover:text-blue-400'>
              <i className='fa-regular fa-user mr-1' /> {siteConfig('AUTHOR')}
            </Link>
            <Link
              href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
              className='mr-4 hover:text-blue-600 dark:hover:text-blue-400'>
              <i className='fa-regular fa-clock mr-1' />{' '}
              {post.date?.start_date || post.createdTime}
            </Link>
            <TwikooCommentCount post={post} />
            {post.category && (
              <Link
                href={`/category/${post.category}`}
                className='mr-4 hover:text-blue-600 dark:hover:text-blue-400'>
                <i className='fa-regular fa-folder mr-1' />
                {post.category}
              </Link>
            )}
            {post?.tags && post.tags.length > 0 && (
              <div className='flex flex-wrap'>
                {post.tags.map(t => (
                  <Link
                    key={t}
                    href={`/tag/${t}`}
                    className='mr-2 hover:text-blue-600 dark:hover:text-blue-400'>
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className='mb-4 text-gray-700 dark:text-gray-300'>
            {!showPreview && (
              <>
                {post.summary}
                {post.summary && <span>...</span>}
              </>
            )}
            {showPreview && post?.blockMap && (
              <div className='overflow-hidden'>
                <NotionPage post={post} />
                <hr className='my-4 border-dashed border-gray-300 dark:border-gray-600' />
              </div>
            )}
          </div>

          <Link
            href={post.href}
            className='group inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'>
            阅读全文
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
