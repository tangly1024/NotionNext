import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

export const BlogItem = props => {
  const { post } = props
  const { NOTION_CONFIG } = useGlobal()
  const showPageCover = siteConfig('TYPOGRAPHY_POST_COVER_ENABLE', false, CONFIG)
  const showPreview =
    siteConfig('POST_LIST_PREVIEW', false, NOTION_CONFIG) && post.blockMap
  return (
    <div key={post.id} className='h-42 mt-6 mb-10'>
      {/* 文章标题 */}

      <div className='flex'>
        <div className='article-cover h-full'>
          {/* 图片封面 */}
          {showPageCover && (
            <div className='overflow-hidden mr-2 w-56 h-full'>
              <SmartLink href={post.href} passHref legacyBehavior>
                <LazyImage
                  src={post?.pageCoverThumbnail}
                  className='w-56 h-full object-cover object-center group-hover:scale-110 duration-500'
                />
              </SmartLink>
            </div>
          )}
        </div>

        <article className='article-info'>
          <h2 className='mb-2'>
            <SmartLink
              href={post.href}
              className='text-xl underline decoration-2 font-bold text-[var(--primary-color)] dark:text-white dark:hover:bg-white dark:hover:text-[var(--primary-color)]  duration-200 transition-all rounded-sm'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon icon={post.pageIcon} />
              )}
              {post.title}
            </SmartLink>
          </h2>

          {/* 文章信息 */}
          <header className='text-md text-[var(--primary-color)] dark:text-gray-300 flex-wrap flex items-center leading-6'>
            <div className='space-x-2'>
              <span className='text-sm'>
                发布于
                <SmartLink
                  className='p-1 hover:text-red-400 transition-all duration-200'
                  href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}>
                  {post.date?.start_date || post.createdTime}
                </SmartLink>
              </span>
            </div>

            <div className='text-sm'>
              {/* {post.category && (
                <SmartLink href={`/category/${post.category}`} className='p-1'>
                  {' '}
                  <span className='hover:text-red-400 transition-all duration-200'>
                    <i className='fa-regular fa-folder mr-0.5' />
                    {post.category}
                  </span>
                </SmartLink>
              )} */}
              {post?.tags &&
                post?.tags?.length > 0 &&
                post?.tags.map(t => (
                  <SmartLink
                    key={t}
                    href={`/tag/${t}`}
                    className=' hover:text-red-400 transition-all duration-200'>
                    <span> #{t}</span>
                  </SmartLink>
                ))}
            </div>
          </header>

          <main className='text-[var(--primary-color)] dark:text-gray-300 line-clamp-4 overflow-hidden text-ellipsis relative leading-[1.7]'>
            {!showPreview && (
              <>
                {post.summary}
              </>
            )}
            {showPreview && post?.blockMap && (
              <div className='line-clamp-4 overflow-hidden'>
                <NotionPage post={post} />
                <hr className='border-dashed py-4' />
              </div>
            )}
          </main>
        </article>
      </div>
    </div>
  )
}
