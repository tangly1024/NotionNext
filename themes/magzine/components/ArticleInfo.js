import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
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
      <div className='flex flex-col gap-y-8'>
        <div className='flex justify-center py-2 mr-2 items-center'>
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

        {/* title */}
        <h2 className='text-5xl text-center dark:text-gray-300'>
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

      {/* meta */}
      <section className='py-2 items-center text-sm  px-1'>
        <div className='flex flex-wrap text-gray-500 py-1 dark:text-gray-600'>
          <span className='whitespace-nowrap'>
            {' '}
            <i className='far fa-calendar mr-2' />
            {post?.publishDay}
          </span>
          <span className='mx-1'>|</span>
          <span className='whitespace-nowrap mr-2'>
            <i className='far fa-calendar-check mr-2' />
            {post?.lastEditedDay}
          </span>
          <div className='hidden busuanzi_container_page_pv  mr-2 whitespace-nowrap'>
            <i className='mr-1 fas fa-eye' />
            <span className='busuanzi_value_page_pv' />
          </div>
        </div>
        <Link href='/about' passHref legacyBehavior>
          <div className='flex pt-2'>
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full cursor-pointer'
              width={22}
              alt={siteConfig('AUTHOR')}
            />

            <div className='mr-3 ml-2 my-auto text-gray-500 cursor-pointer'>
              {siteConfig('AUTHOR')}
            </div>
          </div>
        </Link>
      </section>
    </>
  )
}
