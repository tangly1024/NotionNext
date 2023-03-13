import BLOG from '@/blog.config'
import NotionPage from '@/components/NotionPage'
import Link from 'next/link'
import TagItemMini from './TagItemMini'

export const BlogPostCardInfo = ({ post, showPreview, showSummary }) => {
  return <>
        {/* 标题 */}
        <Link
            href={`${BLOG.SUB_PATH}/${post.slug}`}
            passHref
            className={`replace cursor-pointer hover:underline text-2xl ${showPreview ? 'text-center' : ''
                } leading-tight text-gray-600 dark:text-gray-100 hover:text-indigo-700 dark:hover:text-indigo-400`}>

            {post.title}

        </Link>

        {/* 日期 */}
        <div
            className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'
                } flex-wrap dark:text-gray-500 text-gray-400 hover:text-indigo-700 dark:hover:text-indigo-400`}
        >
            <Link
                href={`/archive#${post?.date?.start_date?.substr(0, 7)}`}
                passHref
                className="font-light hover:underline cursor-pointer text-sm leading-4 mr-3">

                <i className="far fa-calendar-alt mr-1" />
                {post.date?.start_date || post.lastEditedTime}

            </Link>
        </div>

        {/* 摘要 */}
        {(!showPreview || showSummary) && !post.results && (
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}
                className="replace py-3 h-28 text-gray-700  dark:text-gray-300 text-sm font-light leading-7">
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
        {/* 预览 */}
        {showPreview && (
            <div className="overflow-ellipsis truncate">
                <NotionPage post={post} />
            </div>
        )}

        {/* 分类标签 */}
        <div className="text-gray-400 justify-between flex">
            <Link
                href={`/category/${post.category}`}
                passHref
                className="cursor-pointer font-light text-sm hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform">

                <i className="mr-1 far fa-folder" />
                {post.category}

            </Link>
            <div className="md:flex-nowrap flex-wrap md:justify-start inline-block">
                <div>
                    {' '}
                    {post.tagItems.map(tag => (
                        <TagItemMini key={tag.name} tag={tag} />
                    ))}
                </div>
            </div>
        </div>
    </>
}
