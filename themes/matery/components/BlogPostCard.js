import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 博客列表：文章卡牌
 * @param {*} param0
 * @returns
 */
const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('MATERY_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  // matery 主题默认强制显示图片
  if (post && !post.pageCoverThumbnail) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }
  const showPageCover =
    siteConfig('MATERY_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail
  const delay = (index % 3) * 300

  return (
    <div
      data-aos='zoom-in'
      data-aos-duration='500'
      data-aos-delay={delay}
      data-aos-once='true'
      data-aos-anchor-placement='top-bottom'
      className='w-full mb-4 overflow-hidden shadow-md border dark:border-black rounded-xl bg-white dark:bg-hexo-black-gray'>
      {/* 固定高度 ，空白用图片拉升填充 */}
      <header className='group flex flex-col h-80 justify-between'>
        {/* 头部图片 填充卡片 */}
        {showPageCover && (
          <SmartLink href={post?.href} passHref legacyBehavior>
            <div className='flex flex-grow w-full relative duration-200 = rounded-t-md cursor-pointer transform overflow-hidden'>
              <LazyImage
                src={post?.pageCoverThumbnail}
                alt={post.title}
                className='h-full w-full group-hover:scale-125 group-hover:brightness-50 rounded-t-md transform object-cover duration-500'
              />
              <h2 className='absolute bottom-0 left-0 text-white p-6 text-2xl replace break-words w-full shadow-text z-30'>
                {siteConfig('POST_TITLE_ICON') && (
                  <NotionIcon icon={post.pageIcon} />
                )}
                {post.title}
              </h2>
              {/* 放在图片的阴影遮罩，便于突出文字 */}
              <div className='h-1/2 w-full absolute left-0 bottom-0 z-20 opacity-75 transition-all duration-200'>
                <div className='h-full w-full absolute bg-gradient-to-b from-transparent to-black'></div>
              </div>
            </div>
          </SmartLink>
        )}

        {/* 文字描述 */}
        <main>
          {/* 描述 */}
          <div className='px-4 flex flex-col w-full  text-gray-700  dark:text-gray-300'>
            {(!showPreview || showSummary) && post.summary && (
              <p className='replace my-2 text-sm font-light leading-7 line-clamp-3'>
                {post.summary}
              </p>
            )}

            <div className='text-gray-800 justify-between flex my-2  dark:text-gray-300'>
              <div>
                <SmartLink
                  href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                  passHref
                  className='font-light hover:underline cursor-pointer text-sm leading-4 mr-3'>
                  <i className='far fa-clock mr-1' />
                  {post.date?.start_date || post.lastEditedDay}
                </SmartLink>
                <TwikooCommentCount
                  post={post}
                  className='hover:underline cursor-pointer text-sm'
                />
              </div>
              <SmartLink
                href={`/category/${post.category}`}
                passHref
                className='cursor-pointer font-light text-sm hover:underline hover:text-indigo-700 dark:hover:text-indigo-400 transform'>
                <i className='mr-1 far fa-folder' />
                {post.category}
              </SmartLink>
            </div>
          </div>

          {post?.tagItems && post?.tagItems.length > 0 && (
            <>
              <hr />
              <div className='text-gray-400 justify-between flex px-5 py-3'>
                <div className='md:flex-nowrap flex-wrap md:justify-start inline-block'>
                  <div>
                    {' '}
                    {post.tagItems.map(tag => (
                      <TagItemMini key={tag.name} tag={tag} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </header>
    </div>
  )
}

export default BlogPostCard
