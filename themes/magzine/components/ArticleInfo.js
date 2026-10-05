import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import CategoryItem from './CategoryItem'
import TagItemMini from './TagItemMini'

/**
 * 文章详情页介绍
 * @param {*} props
 * @returns
 */
export default function ArticleInfo(props) {
  const { post } = props

  return (
    <>
      <div className='flex flex-col gap-y-4 py-4 px-2 lg:px-0'>
        <div className='flex w-full justify-center items-center gap-x-1 min-w-0'>
          {siteConfig('MAGZINE_POST_LIST_CATEGORY') && (
            <CategoryItem category={post?.category} />
          )}
          <div
            className={
              'flex min-w-0 flex-1 items-center justify-start flex-nowrap overflow-x-auto scroll-hidden gap-x-3 text-gray-400'
            }>
            {siteConfig('MAGZINE_POST_LIST_TAG') &&
              post?.tagItems?.map(tag => (
                <TagItemMini key={tag.name} tag={tag} />
              ))}
          </div>
        </div>

        {/* title */}
        <h2 className='text-4xl text-center dark:text-gray-300'>
          {siteConfig('POST_TITLE_ICON') && (
            <NotionIcon icon={post?.pageIcon} />
          )}
          {post?.title}
        </h2>

        <div className='text-xl text-center'>{post?.summary}</div>
      </div>

      {post?.type && post?.type !== 'Page' && post?.pageCover && (
        <div className='w-full aspect-video max-h-[60vh] relative md:flex-shrink-0 overflow-hidden'>
          <LazyImage
            priority
            alt={post?.title}
            src={post?.pageCover}
            width={1200}
            height={675}
            className='object-cover max-h-[60vh] w-full h-full'
          />
        </div>
      )}
    </>
  )
}
