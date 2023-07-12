import Link from 'next/link'
import TagItemMini from './TagItemMini'
import BLOG from '@/blog.config'

/**
 * 博客列表的文字内容
 * @param {*} param0
 * @returns
 */
export const BlogPostCardInfo = ({ post, showPreview, showPageCover, showSummary }) => {
  return <div className={'flex flex-col justify-between lg:p-6 p-4 w-full'}>

        <div>

            {/* 分类 */}
            {post?.category && <div className={`flex mb-1 items-center ${showPreview ? 'justify-center' : 'justify-start'} flex-wrap dark:text-gray-500 text-gray-400 `}>
                <Link passHref href={`/category/${post.category}`}
                    className="cursor-pointer font-light text-xs menu-link hover:text-indigo-700 dark:hover:text-indigo-400 transform">
                    {post.category}
                </Link>
            </div>}

            {/* 标题 */}
            <Link
                href={`${BLOG.SUB_PATH}/${post.slug}`}
                passHref
                className={'line-clamp-2 replace cursor-pointer text-2xl font-extrabold leading-tight text-black dark:text-gray-100 hover:text-indigo-700 dark:hover:text-indigo-400'}>

                <span className='menu-link '>{post.title}</span>

            </Link>

            {/* 摘要 */}
            {(!showPreview || showSummary) && !post.results && (
                <p className="line-clamp-2 replace my-3 text-gray-700  dark:text-gray-300 text-sm font-light leading-tight">
                    {post.summary}
                </p>
            )}

            {/* 搜索结果 */}
            {post.results && (
                <p className="line-clamp-2 mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
                    {post.results.map(r => (
                        <span key={r}>{r}</span>
                    ))}
                </p>
            )}

            <div className="md:flex-nowrap flex-wrap md:justify-start inline-block">
                <div>
                    {' '}
                    {post.tagItems?.map(tag => (
                        <TagItemMini key={tag.name} tag={tag} />
                    ))}
                </div>
            </div>
        </div>

    </div>
}
