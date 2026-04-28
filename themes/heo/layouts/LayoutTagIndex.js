import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'

const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()

  return (
    <div id='tag-outer-wrapper' className='mt-8 px-5 md:px-0'>
      <div className='overflow-hidden rounded-[30px] border border-slate-200 bg-white px-6 py-8 shadow-[0_16px_40px_rgba(15,23,42,0.05)] dark:border-gray-800 dark:bg-[#1e1e1e] sm:px-8'>
        <div className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-gray-400'>
          Tags
        </div>
        <div className='mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-gray-100'>
          {locale.COMMON.TAGS}
        </div>
        <div className='mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-gray-400 sm:text-base'>
          {locale.locale === 'en-US'
            ? 'Open the sharper thematic cuts, keywords, and recurring ideas.'
            : '这里更适合按关键词、方法论和反复出现的主题切入。'}
        </div>

        <div
          id='tag-list'
          className='mt-8 flex flex-wrap gap-3'>
        {tagOptions.map(tag => (
          <SmartLink
            key={tag.name}
            href={`/tag/${tag.name}`}
            passHref
            legacyBehavior>
            <div className='group flex cursor-pointer flex-nowrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-800 transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-950 hover:text-white dark:border-gray-700 dark:bg-[#161616] dark:text-gray-200 dark:hover:border-yellow-600 dark:hover:bg-yellow-600 dark:hover:text-black'>
              <span>{tag.name}</span>
              <div className='rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500 group-hover:text-slate-950 dark:bg-[#2a2a2a] dark:text-gray-300 dark:group-hover:bg-black/10 dark:group-hover:text-black'>
                {tag.count}
              </div>
            </div>
          </SmartLink>
        ))}
        </div>
      </div>
    </div>
  )
}

export default LayoutTagIndex
