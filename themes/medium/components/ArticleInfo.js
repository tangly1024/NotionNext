import LazyImage from '@/components/LazyImage'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import NotionIcon from '@/components/NotionIcon'
import CategoryItem from './CategoryItem'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

/**
 * 文章详情页介绍
 * @param {*} props
 * @returns
 */
export default function ArticleInfo(props) {
  const { post, siteInfo } = props

  console.log(post)

  return (<>
        {/* 分类信息 */}
        {post?.category && (
          <div className="pt-4">
            <span className="inline-flex items-center border border-gray-200 rounded-md px-3 py-1 bg-white text-gray-400 text-base font-light mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="rgba(100,205,138,1)"><path d="M12.9998 3L12.9996 10.267L19.294 6.63397L20.294 8.36602L14.0006 11.999L20.294 15.634L19.294 17.366L12.9996 13.732L12.9998 21H10.9998L10.9996 13.732L4.70557 17.366L3.70557 15.634L9.99857 12L3.70557 8.36602L4.70557 6.63397L10.9996 10.267L10.9998 3H12.9998Z"></path></svg>
              {post.category}
            </span>
          </div>
        )}

        {/* title */}
        <h1 className="text-3xl pt-2 font-medium dark:text-gray-300">{siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}{post?.title}</h1>

        {/* 摘要作为副标题 */}
        {post?.summary && (
          <div className='mt-2 text-[14px]/6 text-gray-600 dark:text-gray-400'>
            {post.summary}
          </div>
        )}


        {/* 文章元信息：日期 · 阅读时间 · 字数 · 阅读数 */}
        <div className="flex flex-wrap items-left text-[13px] text-gray-500 mt-6">
          {/* 日期 */}
          {post.date?.start_date && (
            <span>
              {dayjs(post.date.start_date).fromNow(true)}
            </span>
          )}
         {/* 阅读时间 */}
        {post.readTime !== undefined && post.readTime !== null && (
          <span className="mx-1">· {post.readTime} min read</span>
        )}
          {/* 字数 */}
          {post.wordCount && (
            <span className="mx-1">· {post.wordCount} words</span>
          )}
          {/* 阅读数 */}
          <span className="mx-1 busuanzi_container_page_pv">
            · <span className="busuanzi_value_page_pv" /> views
          </span>
        </div>

        {/* meta */}
        <section className="py-2 items-center text-sm px-1">
         {/*    <div className='flex flex-wrap text-gray-500 py-1 dark:text-gray-600'>
                <span className='whitespace-nowrap'> <i className='far fa-calendar mr-2' />{post?.publishDay}</span>
                <span className='mx-1'>|</span>
                <span className='whitespace-nowrap mr-2'><i className='far fa-calendar-check mr-2' />{post?.lastEditedDay}</span>
                <div className="hidden busuanzi_container_page_pv font-light mr-2 whitespace-nowrap">
                    <i className="mr-1 fas fa-eye" /><span className="busuanzi_value_page_pv" />
                </div>
            </div> */}
          {/*   <Link href="/about" passHref legacyBehavior>
                <div className='flex pt-2'>
                    <LazyImage src={siteInfo?.icon} className='rounded-full cursor-pointer' width={22} alt={siteConfig('AUTHOR')} />

                    <div className="mr-3 ml-2 my-auto text-green-500 cursor-pointer">
                        {siteConfig('AUTHOR')}
                    </div>
                </div>
            </Link> */}
        </section>
    </>)
}
