import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import CONFIG from '../config'
import CategoryItem from './CategoryItem'
import TagItemMini from './TagItemMini'

const BlogPostCardHorizontal = ({ post, showSummary }) => {
  const showPreview =
    siteConfig('MEDIUM_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  const { locale } = useGlobal()
  return (
    <div
      key={post.id}
      className='flex justify-between space-x-6 mb-6 border-top border-gray-200'>
      {/* 卡牌左侧 */}
      <div className='h-40 w-96'>
        <Link
          href={post?.href}
          passHref
          className={
            ' cursor-pointer font-bold hover:underline text-xl leading-tight text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400'
          }>
          <h3 className='max-w-80 break-words'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h3>
        </Link>

        <div
          className={
            'flex mt-2 items-center justify-start flex-wrap space-x-3 text-gray-400'
          }>
          <div className='text-sm py-1'>{post.date?.start_date}</div>
          {siteConfig('MEDIUM_POST_LIST_CATEGORY', null, CONFIG) && (
            <CategoryItem category={post.category} />
          )}
          {siteConfig('MEDIUM_POST_LIST_TAG', null, CONFIG) &&
            post?.tagItems?.map(tag => (
              <TagItemMini key={tag.name} tag={tag} />
            ))}
        </div>

        {(!showPreview || showSummary) && (
          <main className='my-4 line-clamp-2 text-gray-700 dark:text-gray-300 text-sm font-light leading-7'>
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
      </div>

      {/* 卡牌右侧图片 */}
      <div className='w-40 h-40 object-cover overflow-hidden mb-2'>
        <LazyImage
          src={post.pageCoverThumbnail}
          style={post.pageCoverThumbnail ? {} : { height: '0px' }}
          className='w-40 h-40 object-cover hover:scale-125 duration-150'
        />
      </div>
    </div>
  )
}

export default BlogPostCardHorizontal
