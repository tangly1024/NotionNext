import { useGlobal } from '@/lib/global'

/**
 * 空白博客 列表
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListEmpty = ({ currentSearch }) => {
  const { locale } = useGlobal()
  return (
    <div className='mx-auto flex w-full items-center justify-center py-16 md:py-20'>
      <div className='rounded-3xl border border-dashed border-slate-200 bg-white/80 px-8 py-10 text-center shadow-sm dark:border-gray-700 dark:bg-[#16181f]'>
        <div className='text-sm font-medium tracking-[0.2em] text-slate-400 dark:text-slate-500'>
          END OF LIST
        </div>
        <div className='mt-3 text-base text-slate-600 dark:text-slate-300'>
          {locale.COMMON.NO_MORE}
        </div>
        {currentSearch && (
          <div className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
            {currentSearch}
          </div>
        )}
      </div>
    </div>
  )
}
export default BlogPostListEmpty
