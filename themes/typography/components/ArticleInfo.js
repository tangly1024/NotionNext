import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import NotionIcon from '@/components/NotionIcon'

/**
 * 文章描述
 * @param {*} props
 * @returns
 */
export default function ArticleInfo(props) {
  const { post } = props

  const { locale } = useGlobal()

  return (
    <section className='mt-2 text-gray-600 dark:text-gray-400 leading-8'>
      <h2 className='blog-item-title mb-5 font-bold text-black text-xl md:text-2xl no-underline'>
        {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
        {post?.title}
      </h2>

      <div className='flex flex-wrap text-[var(--primary-color)] dark:text-gray-300'>
        {post?.type !== 'Page' && (
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
        )}
      </div>
    </section>
  )
}
