import { siteConfig } from '@/lib/config'
import dynamic from 'next/dynamic'

const ShareButtons = dynamic(() => import('@/components/ShareButtons'), {
  ssr: false
})

/**
 * 分享栏
 * @param {} param0
 * @returns
 */
const ShareBar = ({ post, className = '' }) => {
  if (
    !JSON.parse(siteConfig('POST_SHARE_BAR_ENABLE')) ||
    !post ||
    post?.type !== 'Post'
  ) {
    return <></>
  }

  return (
    <section className={className}>
      <div className='overflow-x-auto rounded-[1.75rem] border border-slate-200/80 bg-white/96 p-4 shadow-[0_16px_42px_rgba(15,23,42,0.05)] dark:border-slate-700/60 dark:bg-[#1f2026]'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='px-1'>
            <div className='text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>
              Share This Post
            </div>
            <div className='mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100'>
              分享这篇文章
            </div>
          </div>
          <div className='flex w-full md:w-auto md:justify-end'>
            <ShareButtons post={post} />
          </div>
        </div>
      </div>
    </section>
  )
}
export default ShareBar
