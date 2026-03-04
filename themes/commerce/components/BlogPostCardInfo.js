import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import TagItemMini from './TagItemMini'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import formatDate from '@/lib/utils/formatDate'

/**
 * 博客列表的文字内容
 * @param {*} param0
 * @returns
 */
export const BlogPostCardInfo = ({ post, showPreview, showPageCover, showSummary }) => {
  return <div className={`flex flex-col justify-between lg:p-6 p-4  ${showPageCover && !showPreview ? 'md:w-7/12 w-full md:max-h-60' : 'w-full'}`}>
       <div>
         {/* 标题 */}
         <SmartLink
            href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
            passHref
            className={`line-clamp-2 replace cursor-pointer text-2xl ${showPreview ? 'text-center' : ''
                } leading-tight font-normal text-gray-600 dark:text-gray-100 hover:text-red-700 dark:hover:text-red-400`}>

            <span className='menu-link '>{post.title}</span>

        </SmartLink>

        {/* 分类 */}
        { post?.category && <div
            className={`flex mt-2 items-center ${showPreview ? 'justify-center' : 'justify-start'
                } flex-wrap dark:text-gray-500 text-gray-400 `}
        >
            <SmartLink
                href={`/category/${post.category}`}
                passHref
                className="cursor-pointer font-light text-sm menu-link hover:text-red-700 dark:hover:text-red-400 transform">

                <i className="mr-1 far fa-folder" />
                {post.category}

            </SmartLink>

            <TwikooCommentCount className='text-sm hover:text-red-700 dark:hover:text-red-400' post={post}/>
        </div>}

          {/* 摘要 */}
          {(!showPreview || showSummary) && !post.results && (
            <p className="line-clamp-2 replace my-3 text-gray-700  dark:text-gray-300 text-sm font-light leading-7">
                {post.summary}
            </p>
          )}

        {/* 搜索结果 */}
        {post.results && (
            <p className="line-clamp-2 mt-4 text-gray-700 dark:text-gray-300 text-sm font-light leading-7">
                    {post.results.map((r, index) => (
                        <span key={index}>{r}</span>
                    ))}
            </p>
        )}
        {/* 预览 */}
        {showPreview && (
            <div className="overflow-ellipsis truncate">
                <NotionPage post={post} />
            </div>
        )}

       </div>

       <div>
         {/* 日期标签 */}
         <div className="text-gray-400 justify-between flex">
            {/* 日期 */}
            <SmartLink
                href={`/archive#${formatDate(post?.publishDate, 'yyyy-MM')}`}
                passHref
                className="font-light menu-link cursor-pointer text-sm leading-4 mr-3">

                <i className="far fa-calendar-alt mr-1" />
                {post?.publishDay || post.lastEditedDay}

            </SmartLink>

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
       </div>
}
