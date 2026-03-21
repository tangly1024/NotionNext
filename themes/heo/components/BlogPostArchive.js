import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 博客归档列表
 * @param posts 所有文章
 * @param archiveTitle 归档标题
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostArchive = ({ posts = [], archiveTitle, siteInfo }) => {
  if (!posts || posts.length === 0) {
    return <></>
  } else {
    return (
      <div className=''>
        <div className='pb-4 text-xl font-bold dark:text-gray-300' id={archiveTitle}>
          {archiveTitle}
        </div>
        <ul>
          {posts?.map(post => {
            const showPreview =
              siteConfig('HEO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
            if (
              post &&
              !post.pageCoverThumbnail &&
              siteConfig('HEO_POST_LIST_COVER_DEFAULT', null, CONFIG)
            ) {
              post.pageCoverThumbnail = siteInfo?.pageCover
            }
            const showPageCover =
              siteConfig('HEO_POST_LIST_COVER', null, CONFIG) &&
              post?.pageCoverThumbnail &&
              !showPreview
            return (
              <div
                key={post.id}
                className={
                  'cursor-pointer flex flex-row mb-4 md:flex-row group w-full bg-white dark:bg-[#1e1e1e] border border-gray-200/60 dark:border-gray-600 hover:border-indigo-600 dark:hover:border-yellow-600 hover:shadow-md dark:hover:shadow-black/20 duration-300 transition-all justify-between overflow-hidden rounded-2xl'
                }>
                {/* 图片封面 */}
                {showPageCover && (
                  <div className='flex-shrink-0'>
                    <SmartLink href={post?.href} passHref legacyBehavior>
                      <LazyImage
                        className={'rounded-xl bg-center bg-cover w-28 h-full md:w-40 object-cover'}
                        src={post?.pageCoverThumbnail}
                      />
                    </SmartLink>
                  </div>
                )}

                {/* 文字区块 */}
                <div className={'flex px-3 py-3 md:px-4 md:py-3 flex-col justify-between w-full gap-1.5'}>
                  <div className='flex flex-col gap-1.5'>
                    {/* 分类 */}
                    {post?.category && (
                      <div
                        className={`flex items-center ${showPreview ? 'justify-center' : 'justify-start'} hidden md:block flex-wrap`}>
                        <SmartLink
                          passHref
                          href={`/category/${post.category}`}
                          className='cursor-pointer text-xs font-medium menu-link inline-block px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-yellow-900/30 dark:text-yellow-500 transition-colors duration-300 border border-indigo-100 dark:border-yellow-800/40'>
                          {post.category}
                        </SmartLink>
                      </div>
                    )}

                    {/* 标题 */}
                    <SmartLink
                      href={post?.href}
                      passHref
                      className={
                        ' group-hover:text-indigo-700 group-hover:dark:text-indigo-400 text-black dark:text-gray-100 dark:group-hover:text-yellow-600 line-clamp-2 replace cursor-pointer text-lg font-semibold leading-tight'
                      }>
                      <span className='menu-link '>{post.title}</span>
                    </SmartLink>
                  </div>

                  {/* 摘要 */}
                  {/* <p className="line-clamp-1 replace my-3 2xl:my-0 text-gray-700  dark:text-gray-300 text-xs font-light leading-tight">
                                        {post.summary}
                                    </p> */}

                  <div className='md:flex-nowrap flex-wrap md:justify-start inline-block'>
                    <div>
                      {' '}
                      {post.tagItems?.map(tag => (
                        <TagItemMini key={tag.name} tag={tag} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default BlogPostArchive
