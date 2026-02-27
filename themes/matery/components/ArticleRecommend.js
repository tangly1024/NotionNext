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
export default function ArticleRecommend({ recommendPosts, siteInfo }) {
  const { locale } = useGlobal()

  if (
    !siteConfig('MATERY_ARTICLE_RECOMMEND', null, CONFIG) ||
    !recommendPosts ||
    recommendPosts.length === 0
  ) {
    return <></>
  }

  return (
    <div className='p-2'>
      <div className='mb-2 px-1 flex flex-nowrap justify-between'>
        <div>
          <i className='mr-2 fas fa-thumbs-up' />
          {locale.COMMON.RELATE_POSTS}
        </div>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {recommendPosts.map(post => {
          const headerImage = post?.pageCoverThumbnail
            ? post.pageCoverThumbnail
            : siteInfo?.pageCover

          return (
            <SmartLink
              key={post.id}
              title={post.title}
              href={post?.href}
              passHref
              className='flex h-40 cursor-pointer overflow-hidden'>
              <div className='h-full w-full group'>
                <LazyImage
                  src={headerImage}
                  className='h-full w-full object-cover object-center group-hover:scale-110 transform duration-200'
                />

                <div className='flex items-center justify-center bg-black bg-opacity-60 hover:bg-opacity-10 w-full h-full duration-300 '>
                  <div className='text-sm text-white text-center shadow-text'>
                    <div>
                      <i className='fas fa-calendar-alt mr-1' />
                      {post.date?.start_date}
                    </div>
                    <div className='hover:underline'>{post.title}</div>
                  </div>
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
