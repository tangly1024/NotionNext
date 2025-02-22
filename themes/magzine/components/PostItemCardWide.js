import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import CategoryItem from './CategoryItem'

/**
 * 水平左右布局的博客卡片
 * @param {*} param0
 * @returns
 */
const PostItemCardWide = ({ post, showSummary }) => {
  const showPreview = siteConfig('MAGZINE_POST_LIST_PREVIEW') && post.blockMap
  const { locale } = useGlobal()
  return (
    <div key={post.id} className='flex justify-between gap-x-6'>
      {/* 卡牌左侧 */}
      <div className='h-40 w-96 gap-y-3 flex flex-col'>
        {siteConfig('MAGZINE_POST_LIST_CATEGORY') && (
          <CategoryItem category={post.category} />
        )}
        <Link
          href={post?.href}
          passHref
          className={
            ' cursor-pointer font-semibold hover:underline text-xl leading-tight dark:text-gray-300  dark:hover:text-gray-400'
          }>
          <h3 className='max-w-80 break-words'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h3>
        </Link>

        {(!showPreview || showSummary) && (
          <main className='line-clamp-2 text-gray-900 dark:text-gray-300 text-sm'>
            {post.summary}
          </main>
        )}

        {showPreview && (
          <div className='overflow-ellipsis truncate'>
            <NotionPage post={post} />
            <div className='pointer-events-none border-t pt-8 border-dashed'>
              <div className='w-full justify-start flex'>
                <Link
                  href={post?.href}
                  passHref
                  className='hover:bg-opacity-100 hover:scale-105 duration-200 pointer-events-auto transform font-bold text-gray-500 cursor-pointer'>
                  {locale.COMMON.ARTICLE_DETAIL}
                  <i className='ml-1 fas fa-angle-right' />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div
          className={
            'flex items-center justify-start flex-wrap space-x-3 text-gray-500'
          }>
          {/* {siteConfig('MAGZINE_POST_LIST_TAG') &&
            post?.tagItems?.map(tag => (
              <TagItemMini key={tag.name} tag={tag} />
            ))} */}
          <div className='text-sm py-1'>{post.date?.start_date}</div>
        </div>
      </div>

      {/* 卡牌右侧图片 */}
      <div className='w-40 h-40 object-cover overflow-hidden mb-2'>
        <LazyImage
          alt={post?.title}
          src={post.pageCoverThumbnail}
          style={post.pageCoverThumbnail ? {} : { height: '0px' }}
          className='w-40 h-40 object-cover hover:scale-125 duration-150'
        />
      </div>
    </div>
  )
}

export default PostItemCardWide
