import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import CategoryItem from './CategoryItem'
import TagItemMini from './TagItemMini'

/**
 * 置顶头条文章
 * @param {*} param0
 * @returns
 */
const PostItemCardTop = ({ post, showSummary }) => {
  const showPreview =
    siteConfig('MAGZINE_POST_LIST_PREVIEW', true, CONFIG) && post?.blockMap
  const { locale } = useGlobal()
  return (
    <div
      key={post?.id}
      // data-aos='fade-up'
      // data-aos-duration='300'
      // data-aos-once='false'
      // data-aos-anchor-placement='top-bottom'
      className='mb-6 max-w-screen-3xl '>
      <div className='flex flex-col w-full'>
        {siteConfig('MAGZINE_POST_LIST_COVER', true, CONFIG) &&
          post?.pageCoverThumbnail && (
            <SmartLink
              href={post?.href || ''}
              passHref
              className={
                'cursor-pointer hover:underline text-4xl leading-tight  dark:text-gray-300  dark:hover:text-gray-400'
              }>
              <div className='w-full h-80 object-cover overflow-hidden mb-2'>
                <LazyImage
                  priority
                  alt={post?.title}
                  src={post?.pageCoverThumbnail}
                  className='w-full h-80 object-cover hover:scale-125 duration-150'
                />
              </div>
            </SmartLink>
          )}

        <div className='flex py-2 space-x-1 items-center'>
          {siteConfig('MAGZINE_POST_LIST_CATEGORY') && (
            <CategoryItem category={post?.category} />
          )}
          <div
            className={
              'flex items-center justify-start flex-wrap space-x-3 text-gray-400'
            }>
            {siteConfig('MAGZINE_POST_LIST_TAG') &&
              post?.tagItems?.map(tag => (
                <TagItemMini key={tag.name} tag={tag} />
              ))}
          </div>
        </div>

        <SmartLink
          href={post?.href || ''}
          passHref
          className={
            'cursor-pointer hover:underline leading-tight dark:text-gray-300  dark:hover:text-gray-400'
          }>
          <h2 className='text-4xl'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post?.pageIcon} />
            )}
            {post?.title}
          </h2>
        </SmartLink>

        <div className='flex'></div>

        {(!showPreview || showSummary) && (
          <main className='my-4 text-gray-900 dark:text-gray-300 text-lg  leading-7'>
            {post?.summary}
          </main>
        )}

        {showPreview && (
          <div className='overflow-ellipsis truncate'>
            <NotionPage post={post} />
            <div className='pointer-events-none border-t pt-8 border-dashed'>
              <div className='w-full justify-start flex'>
                <SmartLink
                  href={post?.href}
                  passHref
                  className='hover:bg-opacity-100 hover:scale-105 duration-200 pointer-events-auto transform font-bold text-gray-500 cursor-pointer'>
                  {locale.COMMON.ARTICLE_DETAIL}
                  <i className='ml-1 fas fa-angle-right' />
                </SmartLink>
              </div>
            </div>
          </div>
        )}

        <div className='text-sm py-1'>{post?.date?.start_date}</div>
      </div>
    </div>
  )
}

export default PostItemCardTop
