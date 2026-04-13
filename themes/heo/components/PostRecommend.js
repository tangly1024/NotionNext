import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 关联推荐文章
 * @param {prev,next} param0
 * @returns
 */
export default function PostRecommend({ recommendPosts, siteInfo }) {
  const { locale } = useGlobal()

  if (
    !siteConfig('HEO_ARTICLE_RECOMMEND', null, CONFIG) ||
    !recommendPosts ||
    recommendPosts.length === 0
  ) {
    return <></>
  }

  return (
    <div className='pt-8 hidden md:block'>
      {/* 推荐文章 */}
      <div className=' mb-2 px-1 flex flex-nowrap justify-between'>
        <div className='dark:text-gray-300 text-lg font-bold'>
          <i className='mr-2 fas fa-thumbs-up' />
          {locale.COMMON.RELATE_POSTS}
        </div>
      </div>

      {/* 文章列表 */}

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {recommendPosts.map(post => {
          const headerImage = post?.pageCoverThumbnail
            ? post?.pageCoverThumbnail
            : siteInfo?.pageCover

          return (
            <SmartLink
              key={post?.id}
              title={post?.title}
              href={post?.href}
              passHref
              className='flex h-40 cursor-pointer overflow-hidden rounded-2xl'>
              <div className='h-full w-full relative group'>
                <div className='flex items-center justify-center w-full h-full duration-300 '>
                  <div className='z-10 text-lg px-4 font-bold text-white text-center shadow-text select-none'>
                    {post.title}
                  </div>
                </div>
                <LazyImage
                  src={headerImage}
                  className='absolute top-0 w-full h-full object-cover object-center group-hover:scale-110 group-hover:brightness-50 transform duration-200'
                />
                {/* 卡片的阴影遮罩，为了凸显图片上的文字 */}
                <div className='h-3/4 w-full absolute left-0 bottom-0'>
                  <div className='h-full w-full absolute opacity-80 group-hover:opacity-100 transition-all duration-1000 bg-gradient-to-b from-transparent to-black'></div>
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
