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
  const { post, siteInfo } = props

  return (
    <>
      <div className='flex flex-col gap-y-4 py-4 px-2 lg:px-0'>
        <div className='flex justify-center items-center'>
          {siteConfig('MAGZINE_POST_LIST_CATEGORY') && (
            <CategoryItem category={post?.category} />
          )}
          <div
            className={
              'flex items-center justify-start flex-wrap text-gray-400'
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

      {post?.type && !post?.type !== 'Page' && post?.pageCover && (
        <div className='w-full relative md:flex-shrink-0 overflow-hidden'>
          <LazyImage
            alt={post?.title}
            src={post?.pageCover}
            className='object-cover max-h-[60vh] w-full'
          />
        </div>
      )}
    </>
  )
}
