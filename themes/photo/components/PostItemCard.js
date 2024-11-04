import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'

/**
 * 普通的博客卡牌
 * 带封面图
 */
const PostItemCard = ({ post }) => {
  const { siteInfo } = useGlobal()
  const cover = post?.pageCoverThumbnail || siteInfo?.pageCover
  return (
    <div key={post.id} className='mb-6 max-w-screen-3xl'>
      <div className='flex flex-col space-y-3 relative'>
        {/* <Link
          href={post?.href}
          passHref
          className={
            'cursor-pointer hover:underline leading-tight text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400'
          }> */}
        <div className='w-full h-3/4 aspect-video overflow-hidden mb-2'>
          <LazyImage
            alt={post?.title}
            src={cover}
            style={cover ? {} : { height: '0px' }}
            className='w-full h-3/4 aspect-video object-cover select-none pointer-events-none'
          />
        </div>
        {/* </Link> */}

        <div className='absolute bottom-0'>
          {/* <Link
            href={post?.href}
            passHref
            className={
              'text-xl cursor-pointer hover:underline leading-tight text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-400'
            }> */}
          <h2 className='select-none pointer-events-none'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h2>
          {/* </Link> */}

          <div className='text-sm select-none pointer-events-none'>
            {formatDateFmt(post.publishDate, 'yyyy-MM')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostItemCard
