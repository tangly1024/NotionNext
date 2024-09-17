import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import Link from 'next/link'
import CategoryItem from './CategoryItem'

/**
 * 普通的博客卡牌
 * 带封面图
 */
const PostItemCard = ({ post }) => {
  const { siteInfo } = useGlobal()
  const cover = post?.pageCoverThumbnail || siteInfo?.pageCover
  return (
    <div key={post.id} className='mb-6 max-w-screen-3xl'>
      <div className='flex flex-col space-y-3'>
        {siteConfig('MAGZINE_POST_LIST_COVER') && (
          <Link
            href={post?.href}
            passHref
            className={
              'cursor-pointer hover:underline leading-tight text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400'
            }>
            <div className='w-full h-40 aspect-video overflow-hidden mb-2'>
              <LazyImage
                src={cover}
                style={cover ? {} : { height: '0px' }}
                className='w-full h-40 aspect-video object-cover'
              />
            </div>
          </Link>
        )}
        {siteConfig('MAGZINE_POST_LIST_CATEGORY') && (
          <CategoryItem category={post.category} />
        )}

        <Link
          href={post?.href}
          passHref
          className={
            'text-xl cursor-pointer hover:underline leading-tight text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400'
          }>
          <h2>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h2>
        </Link>

        <div className='text-sm'>
          {formatDateFmt(post.publishDate, 'yyyy-MM')}
        </div>
      </div>
    </div>
  )
}

export default PostItemCard
