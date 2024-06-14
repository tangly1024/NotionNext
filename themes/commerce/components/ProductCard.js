import Link from 'next/link'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'
import LazyImage from '@/components/LazyImage'

/**
 * 商品卡
 */
const ProductCard = ({ index, post, siteInfo }) => {
  // Ensure post title fits within a certain number of characters
  const maxTitleLength = 20 // Adjust as needed

  // If post title is longer than the maximum allowed length, truncate it
  const truncatedTitle =
    post.title.length > maxTitleLength
      ? post.title.substring(0, maxTitleLength) + '...'
      : post.title

  if (post && !post.pageCoverThumbnail && CONFIG.POST_LIST_COVER_DEFAULT) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }

  return (
    <div
      className={`${CONFIG.POST_LIST_COVER_HOVER_ENLARGE ? 'hover:scale-110 transition-all duration-150' : ''}`}>
      <div className='group flex flex-col space-y-2 justify-between border dark:border-black bg-white dark:bg-hexo-black-gray rounded-lg p-4 relative'>
        {/* Category label */}
        <div className='absolute top-2 right-2 z-10 bg-gray-800 text-white px-2 py-1 rounded-md text-sm'>
          {post.category}
        </div>

        {/* Image cover */}
        <Link
          href={`${siteConfig('SUB_PATH', '')}/${post.slug}`}
          passHref
          legacyBehavior>
          <div className='overflow-hidden m-2 rounded-lg'>
            <LazyImage
              priority={index === 1}
              src={post?.pageCoverThumbnail}
              className='h-auto aspect-square w-full object-cover object-center group-hover:scale-110 duration-500'
            />
          </div>
        </Link>

        {/* Display truncated post title */}
        <div className='text-center'>{truncatedTitle}</div>
      </div>
    </div>
  )
}

export default ProductCard
