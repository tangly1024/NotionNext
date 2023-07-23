import BLOG from '@/blog.config'
import CONFIG from '../config'
import Link from 'next/link'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import LazyImage from '@/components/LazyImage'

const BlogPostCard = ({ post }) => {
  const showPageCover = CONFIG.POST_LIST_COVER && post?.pageCoverThumbnail

  return <article className={`${showPageCover ? 'flex md:flex-row flex-col-reverse' : ''} replace mb-12 `}>
        <div className={`${showPageCover ? 'md:w-7/12' : ''}`}>
            <h2 className="mb-4">
                <Link
                    href={`/${post.slug}`}
                    className="text-black dark:text-gray-100 text-xl md:text-2xl no-underline hover:underline">
                    {post?.title}
                </Link>
            </h2>

            <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">
                by <a href="#" className="text-gray-700 dark:text-gray-300">{BLOG.AUTHOR}</a> on {post.date?.start_date || post.createdTime}
                <TwikooCommentCount post={post} className='pl-1'/>
                <span className="font-bold mx-1"> | </span>
                <a href={`/category${post.category}`} className="text-gray-700 dark:text-gray-300 hover:underline">{post.category}</a>
                {/* <span className="font-bold mx-1"> | </span> */}
                {/* <a href="#" className="text-gray-700">2 Comments</a> */}
            </div>

            {!post.results && <p className="line-clamp-3 text-gray-700 dark:text-gray-400 leading-normal">
                {post.summary}
            </p>}
            {/* 搜索结果 */}
            {post.results && (
                <p className="line-clamp-3 mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
                    {post.results.map((r, index) => (
                        <span key={index}>{r}</span>
                    ))}
                </p>
            )}
        </div>
        {/* 图片封面 */}
        {showPageCover && (
            <div className="md:w-5/12 w-full overflow-hidden p-1">
                <Link href={`${BLOG.SUB_PATH}/${post.slug}`} passHref legacyBehavior>
                    <LazyImage src={post?.pageCoverThumbnail} className='h-44 bg-center bg-cover hover:scale-110 duration-200' />
                </Link>
            </div>
        )}
    </article>
}

export default BlogPostCard
