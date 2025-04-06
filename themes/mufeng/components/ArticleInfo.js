import Link from 'next/link'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import NotionIcon from '@/components/NotionIcon'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import RealTimeViewCount from './RealTimeViewCount'

/**
 * 文章描述
 * @param {*} props
 * @returns
 */
export default function ArticleInfo (props) {
  const { post } = props
  const { locale } = useGlobal()

  return (
    <section className="mt-2 mb-3 md:mb-5 text-gray-500 dark:text-gray-400 leading-tight">
      <h2 className="blog-item-title mb-5 font-bold text-black text-xl md:text-2xl no-underline">
        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}{post?.title}
      </h2>

      {post?.type !== 'Page' && (
        <>
          {/* 文章信息 - 与博客列表项保持一致的样式 */}
          <header className='mb-3 md:mb-5 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 leading-tight'>
            <div className='flex items-center space-x-3'>
              <Link
                href={siteConfig('SIMPLE_AUTHOR_LINK', null, CONFIG)}
                className='flex items-center hover:text-red-400 transition-all duration-200'>
                <i className='fas fa-user-edit mr-1'></i> {siteConfig('AUTHOR')}
              </Link>
              
              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full'></span>
              
              <Link
                className='flex items-center hover:text-red-400 transition-all duration-200'
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}>
                <i className='fas fa-calendar-alt mr-1' />{' '}
                {post?.publishDay}
              </Link>
              
              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full'></span>
              
              <span className='flex items-center'>
                <TwikooCommentCount post={post} />
              </span>
              
              <span className='w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full'></span>
              
              <RealTimeViewCount post={post} simple={true} />
            </div>

            <div className='flex items-center mt-2 md:mt-0 md:ml-3'>
              {post?.category && (
                <Link 
                  href={`/category/${post?.category}`} 
                  className='flex items-center text-xs bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md hover:text-red-400 transition-all duration-200'>
                  <i className='fas fa-folder-open mr-1'></i>
                  {post?.category}
                </Link>
              )}
              {post?.tags &&
                post?.tags?.length > 0 &&
                post?.tags.map(t => (
                  <Link
                    key={t}
                    href={`/tag/${t}`}
                    className='ml-2 flex items-center text-xs bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 px-2 py-1 rounded-md hover:text-red-400 transition-all duration-200'>
                    <i className='fas fa-tag mr-1'></i> {t}
                  </Link>
                ))}
            </div>
          </header>
          
          {/* 额外的编辑信息 */}
          <div className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
            <span className="flex items-center">
              <i className="far fa-edit mr-1"></i> {locale.COMMON.LAST_EDITED_TIME}: {post?.lastEditedDay}
            </span>
          </div>
        </>
      )}
    </section>
  )
}
