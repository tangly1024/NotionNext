import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'

/** 阅读次数组件（Busuanzi） */
const PostViewCounter = () => {
  return (
    <span
      id="busuanzi_container_page_pv"
      className="text-sm text-gray-500 dark:text-gray-400 block mt-1"
    >
      👀 本文阅读 <span id="busuanzi_value_page_pv"></span> 次
    </span>
  )
}

/**
 * 普通的博客卡牌
 * 带封面图 + 阅读次数
 */
const PostItemCard = ({ post, className }) => {
  const { siteInfo } = useGlobal()
  const cover = post?.pageCoverThumbnail || siteInfo?.pageCover

  return (
    <div key={post?.id} className={className}>
      <div className="space-y-3 relative justify-center items-center text-gray-500">
        {/* 封面图 */}
        <div className="h-full overflow-hidden">
          <LazyImage
            alt={post?.title}
            src={cover}
            style={cover ? {} : { height: '0px' }}
            className="h-full max-h-[70vh] object-cover select-none pointer-events-none"
          />
        </div>

        <div className="text-center">
          {/* 标题 */}
          <SmartLink
            href={post?.href}
            passHref
            className="cursor-pointer hover:underline leading-tight dark:text-gray-300"
          >
            <h2 className="select-none pointer-events-none">
              {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
              {post?.title}
            </h2>
          </SmartLink>

          {/* 发布日期 */}
          <SmartLink
            className="text-sm"
            href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
            passHref
          >
            {formatDateFmt(post?.publishDate, 'yyyy-MM')}
          </SmartLink>

          {/* 阅读次数 */}
          <PostViewCounter />
        </div>
      </div>
    </div>
  )
}

export default PostItemCard
