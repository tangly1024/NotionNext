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
    <section className='heo-post-footer__recommend hidden md:block'>
      <div className='overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-white/96 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.045)] dark:border-slate-700/60 dark:bg-[#1f2026] sm:p-5'>
        <div className='mb-4 flex flex-col gap-2 px-1 sm:mb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4'>
          <div>
            <div className='text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>
              Related Posts
            </div>
            <div className='mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100'>
              {locale.COMMON.RELATE_POSTS}
            </div>
          </div>
          <div className='text-sm text-slate-400 dark:text-slate-500'>
            为你继续延伸阅读线索
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3'>
          {recommendPosts.map(post => {
            const headerImage = post?.pageCoverThumbnail || post?.pageCover || siteInfo?.pageCover

            return (
              <SmartLink
                key={post?.id}
                title={post?.title}
                href={post?.href}
                passHref
                className='group overflow-hidden rounded-[1.35rem] border border-slate-200/75 bg-slate-50/68 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/88 hover:bg-white/98 hover:shadow-[0_14px_28px_rgba(15,23,42,0.065)] dark:border-slate-700/60 dark:bg-slate-900/18 dark:hover:border-slate-600/75 dark:hover:bg-slate-900/26'>
                <div className='relative h-28 overflow-hidden border-b border-slate-200/65 dark:border-slate-700/55 sm:h-32'>
                  <LazyImage
                    src={headerImage}
                    className='absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-slate-950/30 via-slate-900/8 to-white/0 dark:from-black/35 dark:via-black/8 dark:to-transparent' />
                </div>
                <div className='space-y-2.5 p-3.5 sm:p-4'>
                  <div className='line-clamp-2 text-[1.02rem] font-semibold leading-7 text-slate-800 transition-colors duration-300 group-hover:text-slate-950 dark:text-slate-100 dark:group-hover:text-white sm:text-lg'>
                    {post.title}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-slate-500 transition-colors duration-300 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300'>
                    <span>查看文章</span>
                    <i className='fas fa-arrow-right text-xs' />
                  </div>
                </div>
              </SmartLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}
